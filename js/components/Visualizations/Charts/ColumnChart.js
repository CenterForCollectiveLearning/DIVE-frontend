import React, { Component, PropTypes } from 'react';

import * as GeneratingProcedures from '../../../constants/GeneratingProcedures';

import styles from '../Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class ColumnChart extends Component {

  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, options } = this.props;

    const columnChartOptions = {
      ...options,
      hAxis: {
        title: data[0][0],
        titleTextStyle: {
          color: '#333',
          bold: true,
          italic: false
        }
      },
      vAxis: {
        minValue: 0,
        title: data[0][1],
        titleTextStyle: {
          color: '#333',
          bold: true,
          italic: false
        }
      },
      legend: {
        position: 'none'
      }
    };

    return (
      <Chart chartType="ColumnChart" options={ columnChartOptions } data={ data } graph_id={ chartId }/>
    );
  }
}

ColumnChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  isMinimalView: PropTypes.bool,
  options: PropTypes.object
};

ColumnChart.defaultProps = {
  isMinimalView: false,
  options: {}
};
