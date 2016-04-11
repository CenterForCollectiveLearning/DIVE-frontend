import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import styles from './Compose.sass';

import Input from '../Base/Input';
import ComposeBlock from './ComposeBlock';

import _ from 'underscore';

export class ComposeEditor extends Component {
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
    const { composeSelector, editable } = this.props;
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
          { composeSelector.blocks.length == 0 &&
            <div className={ styles.composeEditorNewDocumentPlaceholder }>
              select a visualization from the sidebar
            </div>
          }
          { composeSelector.blocks.map((block) =>
            <ComposeBlock
              key={ `compose-block-${ composeSelector.documentId }-${ block.exportedSpecId }` }
              block={ block }
              editable={ editable }
              updatedAt={ composeSelector.updatedAt }/>
          )}
        </div>
      </div>
    );
  }
}

ComposeEditor.propTypes = {
  composeSelector: PropTypes.object.isRequired,
  editable: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  const { composeSelector } = state;
  return { composeSelector };
}

export default connect(mapStateToProps, {})(ComposeEditor);
