import React, { Component, PropTypes } from 'react';

import * as GeneratingProcedures from '../../../constants/GeneratingProcedures';

import styles from '../Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class StackedColumnChart extends Component {

  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, options } = this.props;

    const stackedColumnChartOptions = {
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
      }
    }

    return (
      <Chart chartType="ColumnChart" options={ stackedColumnChartOptions } data = { data } graph_id={ chartId }/>
    );
  }
}

StackedColumnChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  isMinimalView: PropTypes.bool,
  options: PropTypes.object
};

StackedColumnChart.defaultProps = {
  isMinimalView: false,
  options: {}
};
