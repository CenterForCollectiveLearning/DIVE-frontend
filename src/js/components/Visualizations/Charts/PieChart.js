import React, { Component, PropTypes } from 'react';

import { fullOptions, minimalOptions } from '../VisualizationOptions';
import styles from '../Visualizations.sass';

import { Chart } from 'react-google-charts';

export default class PieChart extends Component {

  render() {
    const { data, generatingProcedure, isMinimalView, chartId, colors, labels, additionalOptions, config  } = this.props;

    const finalData = data.map((row) =>
      [`${ row[0] }`, row[1]]
    );

    var options = isMinimalView ? minimalOptions : fullOptions;

    return (
      <Chart
        chartType="PieChart"
        options={ options }
        data={ finalData }
        graph_id={ chartId }
        width={ "100%" }
        height={ "100%" }
        loader={ <div className={ styles.renderChartText + ' pt-monospace-text' }>Rendering Chart...</div> }
      />
    );
  }
}

PieChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  isMinimalView: PropTypes.bool,
  additionalOptions: PropTypes.object,
  labels: PropTypes.object,
  colors: PropTypes.array,
  config: PropTypes.object
};

PieChart.defaultProps = {
  isMinimalView: false,
  additionalOptions: {},
  labels: {},
  colors: [ '#007BD7' ],
  config: {}
};
