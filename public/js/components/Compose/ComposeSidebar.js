import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import { fetchExportedVisualizationSpecs } from '../../actions/ComposeActions';

import styles from './Compose.sass';

import Sidebar from '../Base/Sidebar';
import SidebarGroup from '../Base/SidebarGroup';
import Visualization from '../Visualizations/Visualization';

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
      console.log('Fetching because update');
      fetchExportedVisualizationSpecs(project.properties.id);
    }
  }

  render() {
    const { exportedSpecs } = this.props;
    console.log('Exported Specs:', exportedSpecs, exportedSpecs.items);

    return (
      <Sidebar>
        { !exportedSpecs.isFetching && exportedSpecs.items.length > 0 && exportedSpecs.items.map((spec) =>
          <div>
            <div>{ spec.id }</div>
            <div>{ spec.specId }</div>
          </div>
          )
        }
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
  fetchExportedVisualizationSpecs,
  pushState
})(ComposeSidebar);
