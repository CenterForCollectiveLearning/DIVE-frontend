import React, { Component, PropTypes } from 'react';

import { fullOptions, minimalOptions } from '../VisualizationOptions';
import styles from '../Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class ScatterChart extends Component {

  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, colors, labels, additionalOptions, config } = this.props;

    var options = isMinimalView ? minimalOptions : fullOptions;

    options = {
      ...options,
      hAxis: {
        scaleType: config.hScaleType
      },
      legend: {
        ...options.legend,
        position: 'none'
      },
      vAxis: {
        scaleType: config.vScaleType
      }
    }

    options = {
      ...options,
      ...additionalOptions,
    }

    options.hAxis.title = labels && labels.x ? labels.x : data[0][0];
    options.vAxis.title = labels && labels.y ? labels.y : data[0][1];
    options.colors = colors;

    return (
      <Chart
        key={ chartId }
        graph_id={ chartId }
        chartType="ScatterChart"
        options={ options }
        data={ data }
        width={ "100%" }
        height={ "100%" }
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
  colors: PropTypes.array,
  config: PropTypes.object
};

ScatterChart.defaultProps = {
  isMinimalView: false,
  additionalOptions: {},
  labels: {},
  colors: [ '#007BD7' ],
  config: {}
};
