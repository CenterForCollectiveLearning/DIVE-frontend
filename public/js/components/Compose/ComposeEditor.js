import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import styles from './Compose.sass';

import Input from '../Base/Input';
import ComposeBlock from './ComposeBlock';
import ComposeBlockPlaceHolder from './ComposeBlockPlaceHolder';

import _ from 'underscore';

export default class ComposeEditor extends Component {
  constructor(props) {
    super(props);

    const { selectedDocument, saveDocumentTitle } = this.props;
    const heading = selectedDocument ? selectedDocument.title : 'New Document';

    this.saveDocumentTitle = _.debounce(saveDocumentTitle, 800);

    this.state = {
      documentHeading: heading
    }
  }

  componentWillReceiveProps(nextProps) {
    const { selectedDocument } = nextProps;

    if (selectedDocument && (!this.props.selectedDocument || (selectedDocument.title != this.props.selectedDocument.title))) {
      this.setState({ documentHeading: selectedDocument.title });
    }
  }

  onTitleChange(event) {
    const heading = event.target.value;
    this.setState({ documentHeading: heading });
    this.saveDocumentTitle(this.props.selectedDocument.id, heading);
  }

  render() {
    const { selectedDocument, exportedSpecs, updatedAt, editable, selectComposeVisualization } = this.props;
    if (!selectedDocument.blocks) {
      return (<div></div>);
    }

    return (
      <div className={ styles.composeEditorContainer }>
        <div className={
            styles.editorHeader
            + ( editable ? ' ' + styles.editable : '' )
          }>
          <div className={ styles.editorHeaderText }>
            <Input
              className={ styles.documentTitle }
              readonly={ !editable }
              type="text"
              value={ this.state.documentHeading }
              onChange={ this.onTitleChange.bind(this) }/>
          </div>
        </div>
        <div className={ styles.composeEditor + ' ' + (editable ? styles.editable : '') }>
          { selectedDocument.blocks.map((block) =>
            <ComposeBlock
              key={ `compose-block-${ block.uuid }-${ block.updatedAt }` }
              block={ block }
              editable={ editable } />
          )}
          { editable && 
            <ComposeBlockPlaceHolder
              editable={ true }
              exportedSpecs={ exportedSpecs }
              selectComposeVisualization={ selectComposeVisualization } />
          }
        </div>
      </div>
    );
  }
}

ComposeEditor.propTypes = {
  selectedDocument: PropTypes.object.isRequired,
  editable: PropTypes.bool.isRequired,
  exportedSpecs: PropTypes.object,
  selectComposeVisualization: PropTypes.func
};
