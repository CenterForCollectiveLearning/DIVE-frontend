import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  fetchExportedVisualizationSpecs
} from '../../actions/ComposeActions';

import styles from './Compose.sass';

import Sidebar from '../Base/Sidebar';
import SidebarGroup from '../Base/SidebarGroup';
import Visualization from '../Visualizations/Visualization';
import ComposeSidebarVisualizationBlock from './ComposeSidebarVisualizationBlock';

export class ComposeSidebar extends Component {
  componentWillMount() {
    const { projectId, exportedSpecs, fetchExportedVisualizationSpecs } = this.props;
    if (projectId && exportedSpecs.items.length == 0 && !exportedSpecs.isFetching && !exportedSpecs.loaded) {
      fetchExportedVisualizationSpecs(projectId);
    }
  }

  componentDidUpdate(previousProps) {
    const { projectId, exportedSpecs, fetchExportedVisualizationSpecs } = this.props;
    if (projectId && exportedSpecs.items.length == 0 && !exportedSpecs.loaded && !exportedSpecs.isFetching) {
      fetchExportedVisualizationSpecs(projectId);
    }
  }

  render() {
    const { exportedSpecs, documents, composeSelector } = this.props;
    return (
      <Sidebar>
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
  composeSelector: PropTypes.object.isRequired,
  exportedSpecs: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { project, composeSelector, exportedSpecs } = state;
  return {
    projectId: (project.properties.id ? `${ project.properties.id }` : null),
    composeSelector,
    exportedSpecs
  };
}

export default connect(mapStateToProps, {
  fetchExportedVisualizationSpecs
})(ComposeSidebar);
