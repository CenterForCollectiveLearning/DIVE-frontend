import React, { Component, PropTypes } from 'react';

import styles from '../Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class LineChart extends Component {

  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, options, labels } = this.props;

    const lineChartOptions = {
      ...options,
      pointSize: 0,
      hAxis: { title: labels ? labels.x : data[0][0]},
      vAxis: { title: labels ? labels.y : data[0][1]},
      legend: {
        position: 'none'
      }
    }

    return (
      <Chart chartType="LineChart" options={ lineChartOptions } data = { data } graph_id={ chartId }/>
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
