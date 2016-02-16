import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import { createNewDocument, deleteDocument } from '../../actions/ComposeActions';

import { fetchDocuments, fetchExportedVisualizationSpecs } from '../../actions/ComposeActions';

import styles from './Compose.sass';

import Sidebar from '../Base/Sidebar';
import SidebarGroup from '../Base/SidebarGroup';
import Visualization from '../Visualizations/Visualization';
import RaisedButton from '../Base/RaisedButton';

export class ComposeSidebar extends Component {
  constructor(props) {
    super(props);
    this.onClickNewDocument = this.onClickNewDocument.bind(this);
    this.onClickDeleteDocument = this.onClickDeleteDocument.bind(this);
  }

  componentWillMount() {
    const { projectId, exportedSpecs, fetchDocuments, fetchExportedVisualizationSpecs } = this.props;
    if (projectId && exportedSpecs.items.length == 0 && !exportedSpecs.isFetching && !exportedSpecs.loaded) {
      fetchDocuments(projectId)
      fetchExportedVisualizationSpecs(projectId);
    }
  }

  onClickNewDocument() {
    const { projectId, createNewDocument } = this.props;
    createNewDocument(projectId);
  }

  onClickDeleteDocument() {
    const { projectId, deleteDocument } = this.props;
    deleteNewDocument(projectId, documentId);
  }

  componentDidUpdate(previousProps) {
    const { projectId, exportedSpecs, fetchDocuments, fetchExportedVisualizationSpecs } = this.props;
    if (projectId && exportedSpecs.items.length == 0 && !exportedSpecs.isFetching && !exportedSpecs.loaded) {
      fetchDocuments(projectId)
      fetchExportedVisualizationSpecs(projectId);
    }
  }

  render() {
    const { exportedSpecs, documents } = this.props;
    console.log('Documents:', documents)

    return (
      <Sidebar>
        <SidebarGroup heading="Documents">
          <span className={ styles.create } onClick={ this.onClickNewDocument }>
            New Document
          </span>
          <div className={ styles.documents }>
            { !documents.isFetching && documents.items.length > 0 && documents.items.map((document) =>
              <div className={ styles.document } key={ document.id }>
                Document: { document.id }
                <span className={ styles.delete } onClick={ this.onClickDeleteDocument }>
                  Delete
                </span>
              </div>
            )}
          </div>
        </SidebarGroup>
        <SidebarGroup heading="Visualizations">
          { exportedSpecs.loaded && !exportedSpecs.isFetching && exportedSpecs.items.length > 0 && exportedSpecs.items.map((spec) =>
            <div className={ styles.visualizationPreview } key={ spec.id }>
              <Visualization
                containerClassName="block"
                visualizationClassName="visualization"
                overflowTextClassName="overflowText"
                visualizationTypes={ spec.vizTypes }
                spec={ spec }
                data={ spec.data }
                onClick={ this.handleClick }
                isMinimalView={ true }
                showHeader={ true } />
            </div>
            )
          }
          { exportedSpecs.loaded && !exportedSpecs.isFetching && exportedSpecs.items.length == 0 &&
            <div>
              No visualizations saved.
            </div>
          }
        </SidebarGroup>
      </Sidebar>
    );
  }
}

ComposeSidebar.propTypes = {
  projectId: PropTypes.string.isRequired,
  documents: PropTypes.object.isRequired,
  exportedSpecs: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { project, documents, exportedSpecs } = state;
  return {
    projectId: (project.properties.id ? `${ project.properties.id }` : null),
    documents,
    exportedSpecs
  };
}

export default connect(mapStateToProps, {
  fetchDocuments,
  fetchExportedVisualizationSpecs,
  createNewDocument,
  deleteDocument,
  pushState
})(ComposeSidebar);
