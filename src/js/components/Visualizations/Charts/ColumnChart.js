import React, { Component, PropTypes } from 'react';

import styles from '../Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class ColumnChart extends Component {
  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, options, labels } = this.props;

    var finalData = data;

    const fullColumnChartOptions = {
      ...options,
      intervals: { 'lineWidth': 2, 'barWidth': 0.25 },
      hAxis: {
        title: labels && labels.x ? labels.x : finalData[0][0],
        textStyle: {
          color: '#888'
        },
        titleTextStyle: {
          color: '#333',
          bold: true,
          italic: false
        }
      },
      vAxes: [
        {
          textStyle: {
            color: '#888'
          }
        }
      ],
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
        }
      },
      legend: {
        position: 'none'
      }
    };

    const columnChartOptions = isMinimalView ? options : fullColumnChartOptions;

    return (
      <Chart chartType="ColumnChart" chartVersion="43" options={ columnChartOptions } data={ finalData } graph_id={ chartId }/>
    );
  }
}

ColumnChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  isMinimalView: PropTypes.bool,
  options: PropTypes.object,
  labels: PropTypes.object,
};

ColumnChart.defaultProps = {
  isMinimalView: false,
  options: {},
  labels: {}
};
