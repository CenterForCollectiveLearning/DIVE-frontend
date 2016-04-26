import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {
  selectDocument,
  createNewDocument,
  deleteDocument,
  fetchDocuments,
  selectComposeVisualization
} from '../../actions/ComposeActions';

import styles from './Compose.sass';

import Card from '../Base/Card';
import RaisedButton from '../Base/RaisedButton';
import DropDownMenu from '../Base/DropDownMenu';
import HeaderBar from '../Base/HeaderBar';
import ComposeEditor from './ComposeEditor';

import { saveDocumentTitle } from '../../actions/ComposeActions';

export class ComposeView extends Component {
  constructor(props) {
    super(props);

    this.onClickNewDocument = this.onClickNewDocument.bind(this);
    this.onClickDeleteDocument = this.onClickDeleteDocument.bind(this);
    this.onSelectDocument = this.onSelectDocument.bind(this);
    this.onClickShareDocument = this.onClickShareDocument.bind(this);

    const { selectedDocument } = this.props;

    this.state = {
      selectedDocument: selectedDocument
    }
  }

  componentWillMount() {
    const { projectId, fetchDocuments } = this.props;
    if (projectId){
      fetchDocuments(projectId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { projectId, documents, selectedDocument, fetchDocuments } = nextProps;

    if (projectId && !documents.loaded && !documents.isFetching){
      fetchDocuments(projectId);      
    }

    if (selectedDocument && (!this.props.selectedDocument || (selectedDocument.title != this.props.selectedDocument.title))) {
      this.setState({ documentHeading: selectedDocument.title });
    }
  }

  onSelectDocument(documentId) {
    const { projectId, push } = this.props;
    if (documentId) {
      push(`/projects/${ projectId }/compose/${ documentId }`);
    }
  }

  onClickNewDocument() {
    const { projectId, createNewDocument } = this.props;
    createNewDocument(projectId);
  }

  onClickDeleteDocument() {
    const { projectId, documents, composeSelector, deleteDocument, push } = this.props;
    deleteDocument(projectId, composeSelector.documentId);
    const nextDocId = documents.items.find((doc) => doc.id != composeSelector.documentId).id;
    push(`/projects/${ projectId }/compose/${ nextDocId }`);
  }

  onClickShareDocument() {
    window.open(`/stories/${ this.props.composeSelector.documentId }`, '_blank');
  }

  render() {
    const { documents, composeSelector, selectedDocument, exportedSpecs, saveDocumentTitle, selectComposeVisualization } = this.props;
    const saveStatus = composeSelector.saving ? 'Saving': 'Saved';

    return (
      <div className={ styles.composeViewContainer }>
        <HeaderBar
          className={ styles.headerBar }
          header="Story Composer"
          subheader={
            <span className={ styles.saveStatus }>
              { saveStatus }
            </span>
          }
          actions={
            <div className={ styles.headerControlRow }>
              <div className={ styles.headerControl }>
                <RaisedButton icon altText="Delete document" onClick={ this.onClickDeleteDocument } disabled={ documents.items.length <= 1 }><i className="fa fa-trash"></i></RaisedButton>
              </div>
              <div className={ styles.headerControl }>
                <RaisedButton icon altText="New document" onClick={ this.onClickNewDocument }><i className="fa fa-file-o"></i></RaisedButton>
              </div>
              <div className={ styles.headerControl }>
                <RaisedButton onClick={ this.onClickShareDocument }>Share</RaisedButton>
              </div>
              { !documents.isFetching && documents.items.length > 0 &&
                <div className={ styles.headerControl + ' ' + styles.headerControlLong }>
                  <DropDownMenu
                    prefix="Document"
                    width={ 250 }
                    className={ styles.documentSelector }
                    value={ parseInt(composeSelector.documentId) }
                    options={ documents.items.length > 0 ? documents.items : [] }
                    valueMember="id"
                    displayTextMember="title"
                    onChange={ this.onSelectDocument } />
                </div>
              }
            </div>
          }/>
        <ComposeEditor
          selectComposeVisualization={ selectComposeVisualization }
          exportedSpecs={ exportedSpecs }
          saveDocumentTitle={ saveDocumentTitle }
          selectedDocument={ selectedDocument }
          editable={ true }/>
      </div>
    );
  }
}

ComposeView.propTypes = {
  projectId: PropTypes.string,
  documents: PropTypes.object.isRequired,
  selectedDocument: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  const { project, composeSelector, exportedSpecs, documents } = state;
  return {
    projectId: (project.properties.id ? `${ project.properties.id }` : null),
    composeSelector,
    exportedSpecs,
    documents
  };
}

export default connect(mapStateToProps, {
  fetchDocuments,
  selectDocument,
  createNewDocument,
  deleteDocument,
  saveDocumentTitle,
  selectComposeVisualization,
  push
})(ComposeView);
