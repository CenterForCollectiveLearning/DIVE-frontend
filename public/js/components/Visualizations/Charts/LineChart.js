import React, { Component, PropTypes } from 'react';

import styles from '../Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class LineChart extends Component {

  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, options, labels } = this.props;

    var finalData = data;

    const lineChartOptions = {
      ...options,
      intervals: { style: 'boxes' },
      pointSize: 0,
      hAxis: {
        title: labels && labels.x ? labels.x : finalData[0][0],
        textStyle: {
          color: '#888'
        },
        titleTextStyle: {
          color: '#333',
          bold: true,
          italic: false
        },
        format: ''
      },
      vAxis: {
        minValue: 0,
        title: labels && labels.y ? labels.y : finalData[0][1],
        textStyle: {
          color: '#888'
        },
        titleTextStyle: {
          color: '#333',
          bold: true,
          italic: false
        },
        format: 'short'
      },
      legend: {
        ...options.legend,
        position: 'none'
      }
    }

    return (
      <Chart chartType="LineChart" chartVersion="43" options={ lineChartOptions } data = { finalData } graph_id={ chartId }/>
    );
  }
}

LineChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  isMinimalView: PropTypes.bool,
  options: PropTypes.object,
  labels: PropTypes.object
};

LineChart.defaultProps = {
  isMinimalView: false,
  options: {},
  labels: {}
};
