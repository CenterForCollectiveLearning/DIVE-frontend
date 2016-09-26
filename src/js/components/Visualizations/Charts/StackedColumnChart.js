import React, { Component, PropTypes } from 'react';

import { fullOptions, minimalOptions } from '../VisualizationOptions';
import styles from '../Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class StackedColumnChart extends Component {

  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, options } = this.props;

    var options = isMinimalView ? minimalOptions : fullOptions;
    options = {
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

    options = {
      ...options,
      ...additionalOptions,
    }

    options.hAxis.title = labels && labels.x ? labels.x : data[0][0];
    options.vAxis.title = labels && labels.y ? labels.y : data[0][1];
    options.colors = colors;


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
