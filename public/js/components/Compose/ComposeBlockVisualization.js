import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { nextVisualizationFormat } from '../../actions/ComposeActions';

import styles from './Compose.sass';

import Visualization from '../Visualizations/Visualization';

export default class ComposeBlockVisualization extends Component {
  render() {
    const { spec, updatedAt, nextVisualizationFormat } = this.props;
    return (
      <div className={ styles.composeBlockVisualization }>
        <Visualization
          chartId={ `full-compose-visualization-${ spec.id }-${ updatedAt }` }
          containerClassName={ styles.fullComposeVisualization }
          visualizationTypes={ spec.vizTypes }
          spec={ spec }
          data={ spec.data }
          isMinimalView={ false }
          showHeader={ false }
          onClick={ nextVisualizationFormat } />
      </div>
    );
  }
}

ComposeBlockVisualization.propTypes = {
  spec: PropTypes.object.isRequired,
  updatedAt: PropTypes.number
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
  nextVisualizationFormat
})(ComposeBlockVisualization);
