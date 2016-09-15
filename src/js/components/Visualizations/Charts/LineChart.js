import React, { Component, PropTypes } from 'react';

import { fullOptions, minimalOptions } from '../VisualizationOptions';
import styles from '../Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class LineChart extends Component {

  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, additionalOptions, colors, labels } = this.props;

    var finalData = data;

    var options = isMinimalView ? minimalOptions : fullOptions;
    options.hAxis.title = labels && labels.x ? labels.x : finalData[0][0];
    options.vAxis.title = labels && labels.y ? labels.y : finalData[0][1];
    options.colors = colors;

    options = {
      ...options,
      intervals: { style: 'boxes' },
      pointSize: 0,
      legend: {
        position: 'none'
      }
    }

    options = {
      ...options,
      ...additionalOptions
    }

    return (
      <Chart
        chartType="LineChart"
        chartVersion="43"
        options={ options }
        data = { finalData }
        key={ chartId }
        graph_id={ chartId }
      />
    );
  }
}

LineChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  isMinimalView: PropTypes.bool,
  additionalOptions: PropTypes.object,
  labels: PropTypes.object
};

LineChart.defaultProps = {
  isMinimalView: false,
  additionalOptions: {},
  options: {},
  labels: {},
  colors: [ '#007BD7' ]
};
