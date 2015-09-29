import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchSpecVisualizationIfNeeded } from '../../actions/VisualizationActions';
import styles from './visualizations.sass';

import DataGrid from '../Base/DataGrid';
import Visualization from './Visualization';

export class BuilderView extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { project, specId, visualization, fetchSpecVisualizationIfNeeded } = this.props;

    if (project.properties.id && !visualization.spec.id) {
      fetchSpecVisualizationIfNeeded(project.properties.id, specId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { project, specId, fetchSpecVisualizationIfNeeded } = this.props;

    if (project.properties.id !== nextProps.project.properties.id) {
      fetchSpecVisualizationIfNeeded(nextProps.project.properties.id, specId);
    }
  }

  render() {
    const { visualization } = this.props;
    return (
      <div className={ styles.builderViewContainer }>
        { visualization.spec && visualization.tableData &&
          <div className={ styles.fillContainer }>
            <Visualization
              containerClassName="visualizationContainer"
              visualizationClassName="visualization"
              spec={ visualization.spec }
              data={ visualization.visualizationData }/>          
            <DataGrid
              data={ visualization.tableData }
              tableClassName={ styles.grid }
              containerClassName={ styles.gridContainer } />
          </div>
        }
      </div>
    );
  }
}

BuilderView.propTypes = {
  project: PropTypes.object.isRequired,
  visualization: PropTypes.object.isRequired,
  specId: PropTypes.string
};

function mapStateToProps(state) {
  const { project, visualization } = state;
  return {
    project,
    visualization
  }
}

export default connect(mapStateToProps, { fetchSpecVisualizationIfNeeded })(BuilderView);
