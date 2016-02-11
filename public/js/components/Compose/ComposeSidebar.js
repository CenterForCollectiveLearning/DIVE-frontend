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

    return (
      <Sidebar>
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
