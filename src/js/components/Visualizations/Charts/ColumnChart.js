import React, { Component, PropTypes } from 'react';

import { fullOptions, minimalOptions } from '../VisualizationOptions';
import styles from '../Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class ColumnChart extends Component {
  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, additionalOptions, colors, labels } = this.props;

    var finalData = data;

    var options = isMinimalView ? minimalOptions : fullOptions;
    options.hAxis.title = labels && labels.x ? labels.x : finalData[0][0];
    options.vAxis.title = labels && labels.y ? labels.y : finalData[0][1];
    options.colors = colors;


    if (isMinimalView) {
      options = {
        ...options,
        intervals: { 'lineWidth': 1, 'barWidth': 0.25 },
        legend: {
          position: 'none'
        }
      };
    } else {
      options = {
        ...options,
        intervals: { 'lineWidth': 2, 'barWidth': 0.25 },
        hAxis: {
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
    }

    options = {
      ...options,
      ...additionalOptions
    }

    return (
      <Chart
        chartType="ColumnChart"
        options={ options }
        data={ finalData }
        graph_id={ chartId }
        width={ "100%" }
        height={ "100%" }
      />
    );
  }
}

ColumnChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  isMinimalView: PropTypes.bool,
  additionalOptions: PropTypes.object,
  labels: PropTypes.object,
  colors: PropTypes.array
};

ColumnChart.defaultProps = {
  isMinimalView: false,
  additionalOptions: {},
  labels: {},
  colors: [ '#007BD7' ]
};
