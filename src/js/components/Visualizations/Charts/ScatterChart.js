import React, { Component, PropTypes } from 'react';

import { fullOptions, minimalOptions } from '../VisualizationOptions';
import styles from '../Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class ScatterChart extends Component {

  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, colors, labels, additionalOptions } = this.props;

    var options = isMinimalView ? minimalOptions : fullOptions;
    // Viz Options
    options.hAxis.title = labels && labels.x ? labels.x : data[0][0];
    options.vAxis.title = labels && labels.y ? labels.y : data[0][1];
    options.colors = colors;

    options = {
      ...options,
      legend: {
        ...options.legend,
        position: 'none'
      }
    }

    options = {
      ...options,
      ...additionalOptions,
    }

    return (
      <Chart
        key={ chartId }
        graph_id={ chartId }
        chartType="ScatterChart"
        chartVersion="43"
        options={ options }
        data={ data }
       />
    );
  }
}

ScatterChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  isMinimalView: PropTypes.bool,
  additionalOptions: PropTypes.object,
  labels: PropTypes.object,
  colors: PropTypes.array
};

ScatterChart.defaultProps = {
  isMinimalView: false,
  additionalOptions: {},
  labels: {},
  colors: [ '#007BD7' ]
};
