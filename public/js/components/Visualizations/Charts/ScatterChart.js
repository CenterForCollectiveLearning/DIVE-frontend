import React, { Component, PropTypes } from 'react';

import styles from '../Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class ScatterChart extends Component {

  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, options, labels } = this.props;

    const scatterChartOptions = {
      ...options,
      hAxis: { title: labels ? labels.x : data[0][0]},
      vAxis: { title: labels ? labels.y : data[0][1]},
      legend: {
        position: 'none'
      }
    }

    return (
      <Chart chartType="ScatterChart" chartVersion="43" options={ scatterChartOptions } data = { data } graph_id={ chartId }/>
    );
  }
}

ScatterChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  isMinimalView: PropTypes.bool,
  options: PropTypes.object
};

ScatterChart.defaultProps = {
  isMinimalView: false,
  options: {},
  labels: {}
};
