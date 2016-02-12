import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import { fetchDocuments, fetchExportedVisualizationSpecs } from '../../actions/ComposeActions';

import styles from './Compose.sass';

import Sidebar from '../Base/Sidebar';
import SidebarGroup from '../Base/SidebarGroup';
import Visualization from '../Visualizations/Visualization';

export class ComposeSidebar extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { projectId, exportedSpecs, fetchDocuments, fetchExportedVisualizationSpecs } = this.props;
    if (projectId && exportedSpecs.items.length == 0 && !exportedSpecs.isFetching) {
      fetchDocuments(projectId)
      fetchExportedVisualizationSpecs(projectId);
    }
  }

  componentDidUpdate(previousProps) {
    const { projectId, exportedSpecs, fetchDocuments, fetchExportedVisualizationSpecs } = this.props;
    if (projectId && exportedSpecs.items.length == 0 && !exportedSpecs.isFetching) {
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
          <div className={ styles.documents }>
            { !documents.isFetching && documents.items.length > 0 && documents.items.map((document) =>
              <div className={ styles.document } key={ document.id }>Document: { document.id }</div>
            )}
          </div>
        </SidebarGroup>
        <SidebarGroup heading="Visualizations">
          { !exportedSpecs.isFetching && exportedSpecs.items.length > 0 && exportedSpecs.items.map((spec) =>
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
  pushState
})(ComposeSidebar);
