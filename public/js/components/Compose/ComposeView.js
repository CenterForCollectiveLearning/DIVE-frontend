import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import {
  selectDocument,
  createNewDocument,
  deleteDocument,
  fetchDocuments
} from '../../actions/ComposeActions';

import styles from './Compose.sass';

import Card from '../Base/Card';
import RaisedButton from '../Base/RaisedButton';
import DropDownMenu from '../Base/DropDownMenu';
import HeaderBar from '../Base/HeaderBar';
import ComposeEditor from './ComposeEditor';
import Input from '../Base/Input';
import _ from 'underscore';

import { saveDocumentTitle } from '../../actions/ComposeActions';

export class ComposeView extends Component {
  constructor(props) {
    super(props);

    this.onClickNewDocument = this.onClickNewDocument.bind(this);
    this.onClickDeleteDocument = this.onClickDeleteDocument.bind(this);
    this.onSelectDocument = this.onSelectDocument.bind(this);

    const { selectedDocument } = this.props;
    const heading = selectedDocument ? selectedDocument.title : 'New Document';

    this.saveDocumentTitle = _.debounce(this.props.saveDocumentTitle, 800);

    this.state = {
      selectedDocument: selectedDocument,
      documentHeading: heading
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

  onTitleChange(event) {
    const heading = event.target.value;
    this.setState({ documentHeading: heading });
    this.saveDocumentTitle(this.state.selectedDocument.id, heading);
  }

  onSelectDocument(documentId) {
    const { projectId, pushState } = this.props;
    if (documentId) {
      pushState(null, `/projects/${ projectId }/compose/${ documentId }`);
    }
  }

  onClickNewDocument() {
    const { projectId, createNewDocument } = this.props;
    createNewDocument(projectId);
  }

  onClickDeleteDocument() {
    const { projectId, documents, composeSelector, deleteDocument, pushState } = this.props;
    deleteDocument(projectId, composeSelector.documentId);
    const nextDocId = documents.items.find((doc) => doc.id != composeSelector.documentId).id;
    pushState(null, `/projects/${ projectId }/compose/${ nextDocId }`);
  }

  render() {
    const { documents, composeSelector, selectedDocument, editable } = this.props;
    const saveStatus = composeSelector.saving ? 'Saving': 'Saved';

    return (
      <div className={ styles.composeViewContainer }>
        <HeaderBar
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

        <Card>
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
          <ComposeEditor editable={ editable }/>
        </Card>
      </div>
    );
  }
}

ComposeView.propTypes = {
  projectId: PropTypes.string,
  editable: PropTypes.bool,
  documents: PropTypes.object.isRequired,
  selectedDocument: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  const { project, composeSelector, documents } = state;
  return {
    projectId: (project.properties.id ? `${ project.properties.id }` : null),
    composeSelector,
    documents
  };
}

export default connect(mapStateToProps, {
  fetchDocuments,
  selectDocument,
  createNewDocument,
  deleteDocument,
  saveDocumentTitle,
  pushState
})(ComposeView);
