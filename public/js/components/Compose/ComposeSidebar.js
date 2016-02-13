import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchExportedVisualizationSpecs } from '../../actions/ComposeActions';

import styles from './Compose.sass';

import Sidebar from '../Base/Sidebar';
import SidebarGroup from '../Base/SidebarGroup';
import Visualization from '../Visualizations/Visualization';
import ComposeSidebarVisualizationBlock from './ComposeSidebarVisualizationBlock';

export class ComposeSidebar extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { project, exportedSpecs, fetchExportedVisualizationSpecs } = this.props;
    if (project.properties.id && exportedSpecs.items.length == 0 && !exportedSpecs.isFetching) {
      fetchExportedVisualizationSpecs(project.properties.id);
    }
  }

  componentDidUpdate(previousProps) {
    const { project, exportedSpecs, fetchExportedVisualizationSpecs } = this.props;
    if (project.properties.id && exportedSpecs.items.length == 0 && !exportedSpecs.isFetching) {
      fetchExportedVisualizationSpecs(project.properties.id);
    }
  }

  render() {
    const { exportedSpecs } = this.props;

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
  project: PropTypes.object.isRequired,
  exportedSpecs: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { project, exportedSpecs } = state;
  return {
    project,
    exportedSpecs
  };
}

export default connect(mapStateToProps, {
  fetchExportedVisualizationSpecs
})(ComposeSidebar);
