import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import styles from './Compose.sass';

import Input from '../Base/Input';
import ComposeBlock from './ComposeBlock';
import ComposeBlockPlaceholder from './ComposeBlockPlaceholder';

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
    const { selectedDocument, exportedSpecs, saveStatus, exportedRegressions, fieldNameToColor, exportedCorrelations, updatedAt, editable, selectComposeContent } = this.props;
    if (!selectedDocument.blocks) {
      return (<div></div>);
    }

    console.log('Blocks:', selectedDocument.blocks)

    return (
      <div className={ styles.composeEditorContainer }>
        <div className={
            styles.editorHeader
            + ( editable ? ' ' + styles.editable : '' )
          }>
          { saveStatus && <span className={ styles.saveStatus }>{ saveStatus }</span> }
          <h4 className={ styles.editorHeaderText }>
            <Input
              className={ styles.documentTitle }
              readonly={ !editable }
              type="text"
              value={ this.state.documentHeading }
              onChange={ this.onTitleChange.bind(this) }/>
          </h4>
        </div>
        <div className={ styles.composeEditor + ' ' + (editable ? styles.editable : '') }>
          { selectedDocument.blocks.map((block, i, blocks) =>
            <ComposeBlock
              key={ `compose-block-${ block.uuid }-${ i }` }
              fieldNameToColor={ fieldNameToColor }
              block={ block }
              index={ i }
              length={ blocks.length }
              editable={ editable } />
          )}
        </div>
      </div>
    );
  }
}

ComposeEditor.propTypes = {
  selectedDocument: PropTypes.object.isRequired,
  editable: PropTypes.bool.isRequired,
  exportedSpecs: PropTypes.object,
  exportedCorrelations: PropTypes.object,
  exportedRegressions: PropTypes.object,
  fieldNameToColor: PropTypes.object,
  selectComposeContent: PropTypes.func,
  saveStatus: PropTypes.bool
};
