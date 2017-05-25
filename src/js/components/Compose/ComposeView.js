import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {
  selectDocument,
  createNewDocument,
  deleteDocument,
  fetchDocuments,
  selectComposeContent
} from '../../actions/ComposeActions';

import styles from './Compose.sass';

import { Button, Intent } from '@blueprintjs/core';

import Card from '../Base/Card';
import DropDownMenu from '../Base/DropDownMenu';
import HeaderBar from '../Base/HeaderBar';
import ComposeEditor from './ComposeEditor';
import ComposeSidebar from './ComposeSidebar';
import ProjectTopBar from '../ProjectTopBar';

import { saveDocumentTitle } from '../../actions/ComposeActions';

export class ComposeView extends Component {
  constructor(props) {
    super(props);
 
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

  onSelectDocument = (documentId) => {
    const { projectId, push } = this.props;
    if (documentId) {
      push(`/projects/${ projectId }/compose/${ documentId }`);
    }
  }

  onClickNewDocument = () => {
    const { projectId, createNewDocument } = this.props;
    createNewDocument(projectId);
  }

  onClickDeleteDocument = () => {
    const { projectId, documents, composeSelector, deleteDocument, push } = this.props;
    deleteDocument(projectId, composeSelector.documentId);
    const nextDocId = documents.items.find((doc) => doc.id != composeSelector.documentId).id;
    push(`/projects/${ projectId }/compose/${ nextDocId }`);
  }

  onClickShareDocument = () => {
    window.open(`/stories/${ this.props.composeSelector.documentId }`, '_blank');
  }

  render() {
    const { documents, composeSelector, selectedDocument, fieldNameToColor, exportedSpecs, exportedAnalyses, saveDocumentTitle, selectComposeContent } = this.props;
    const saveStatus = composeSelector.saving ? <span>Saving</span>: <span>Saved <span className='pt-icon-standard pt-icon-saved'/></span>;

    const headerBar = <HeaderBar
      className={ styles.headerBar }
      actions={
        <div className={ styles.headerControlRow }>
          <div className={ styles.headerControl }>
            <Button
              text="Delete"
              onClick={ this.onClickDeleteDocument }
              disabled={ documents.items.length <= 1 }
              iconName='trash'
            />
          </div>
          <div className={ styles.headerControl }>
            <Button
              text="New document"
              onClick={ this.onClickNewDocument }
              iconName='document'
            />
          </div>
          <div className={ styles.headerControl }>
            <Button
              onClick={ this.onClickShareDocument }
              text="Share"
              iconName="share"
            />
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

    return (
      <div className={ styles.fillContainer + ' ' + styles.composePageContainer }>
        <div className={ styles.fillContainer }>
          <ProjectTopBar paramDatasetId={ this.props.params.datasetId } routes={ this.props.routes } />
          { headerBar }
          <ComposeEditor
            saveDocumentTitle={ saveDocumentTitle }
            selectedDocument={ selectedDocument }
            fieldNameToColor={ fieldNameToColor }
            saveStatus={ saveStatus }
            editable={ true }/>
        </div>
        <ComposeSidebar
          exportedSpecs={ exportedSpecs }
          selectComposeContent={ selectComposeContent }
          exportedAnalyses={ exportedAnalyses }
          fieldNameToColor={ fieldNameToColor }
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { project, fieldProperties, composeSelector, exportedSpecs,exportedAnalyses, documents } = state;

  return {
    projectId: (project.id ? `${ project.id }` : null),
    composeSelector,
    exportedSpecs,
    exportedAnalyses,
    documents,
    fieldNameToColor: fieldProperties.fieldNameToColor,
  };
}

export default connect(mapStateToProps, {
  fetchDocuments,
  selectDocument,
  createNewDocument,
  deleteDocument,
  saveDocumentTitle,
  selectComposeContent,
  push
})(ComposeView);
