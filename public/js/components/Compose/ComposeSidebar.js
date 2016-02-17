import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import {
  selectDocument,
  createNewDocument,
  deleteDocument,
  requestDocument,
  fetchDocuments,
  fetchExportedVisualizationSpecs
} from '../../actions/ComposeActions';

import styles from './Compose.sass';

import Sidebar from '../Base/Sidebar';
import SidebarGroup from '../Base/SidebarGroup';
import Visualization from '../Visualizations/Visualization';
import RaisedButton from '../Base/RaisedButton';
import DropDownMenu from '../Base/DropDownMenu';
import ComposeSidebarVisualizationBlock from './ComposeSidebarVisualizationBlock';

export class ComposeSidebar extends Component {
  constructor(props) {
    super(props);
    this.onClickNewDocument = this.onClickNewDocument.bind(this);
    this.onClickDeleteDocument = this.onClickDeleteDocument.bind(this);
    this.onSelectDocument = this.onSelectDocument.bind(this);
  }

  componentWillMount() {
    const { projectId, exportedSpecs, fetchDocuments, fetchExportedVisualizationSpecs } = this.props;
    if (projectId && exportedSpecs.items.length == 0 && !exportedSpecs.isFetching && !exportedSpecs.loaded) {
      fetchDocuments(projectId)
      fetchExportedVisualizationSpecs(projectId);
    }
  }

  onSelectDocument(documentId) {
    if (documentId) {
      this.props.pushState(null, `/projects/${ this.props.projectId }/compose/${ documentId }`);
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

  componentDidUpdate(previousProps) {
    const { projectId, exportedSpecs, fetchDocuments, fetchExportedVisualizationSpecs } = this.props;
    if (projectId && exportedSpecs.items.length == 0 && !exportedSpecs.loaded && !exportedSpecs.isFetching) {
      fetchDocuments(projectId)
      fetchExportedVisualizationSpecs(projectId);
    }
  }

  render() {
    const { exportedSpecs, documents, composeSelector } = this.props;
    return (
      <Sidebar>
        <SidebarGroup heading="Documents">
          <div className={ styles.documentControls }>
            { !documents.isFetching && documents.items.length > 0 &&
              <DropDownMenu
                className={ styles.documentSelector }
                value={ `${ composeSelector.documentId }` }
                options={ documents.items.length > 0 ? documents.items : [] }
                valueMember="id"
                displayTextMember="title"
                onChange={ this.onSelectDocument } />
            }
            <RaisedButton icon altText="New document" onClick={ this.onClickNewDocument }><i className="fa fa-file-o"></i></RaisedButton>
            <RaisedButton icon altText="Delete document" onClick={ this.onClickDeleteDocument } disabled={ documents.items.length <= 1 }><i className="fa fa-trash"></i></RaisedButton>
          </div>
        </SidebarGroup>
        <SidebarGroup heading="Starred visualizations">
          { !exportedSpecs.isFetching && exportedSpecs.items.length > 0 && exportedSpecs.items.map((spec) =>
            <ComposeSidebarVisualizationBlock spec={ spec } key={ spec.id }/>
          )}
        </SidebarGroup>
      </Sidebar>
    );
  }
}

ComposeSidebar.propTypes = {
  projectId: PropTypes.string,
  documents: PropTypes.object.isRequired,
  composeSelector: PropTypes.object.isRequired,
  exportedSpecs: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { project, documents, composeSelector, exportedSpecs } = state;
  return {
    projectId: (project.properties.id ? `${ project.properties.id }` : null),
    documents,
    composeSelector,
    exportedSpecs
  };
}

export default connect(mapStateToProps, {
  fetchExportedVisualizationSpecs,
  fetchDocuments,
  selectDocument,
  requestDocument,
  createNewDocument,
  deleteDocument,
  pushState
})(ComposeSidebar);
