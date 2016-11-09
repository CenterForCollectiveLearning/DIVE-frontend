import React, { Component, PropTypes } from 'react';

import { fullOptions, minimalOptions } from '../VisualizationOptions';
import styles from '../Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class BoxPlot extends Component {
  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, colors, labels, additionalOptions, config } = this.props;

    // Data
    var firstRow = [
      data[0][0],
      // { label: 'Minimum', type: 'number', role: 'data'},
      { label: 'Q1 - 1.5IQR', type: 'number', role: 'data'},
      { label: 'Q1', type: 'number', role: 'data'},
      { label: 'Median', type: 'number', role: 'data'},
      { label: 'Mean', type: 'number', role: 'data'},
      { label: 'Q3', type: 'number', role: 'data'},
      { label: 'Q3 + 1.5IQR', type: 'number', role: 'data'},
      // { label: 'Maximum', type: 'number', role: 'data'},
      // {id: 'minimum',  type:'number', role:'interval' },
      {id: 'bottom',  type:'number', role:'interval' },
      {id: 'firstQuartile',  type:'number', role:'interval' },
      {id: 'median', label: 'Median', type:'number', role:'interval' },
      {id: 'mean', type:'number', role:'interval' },
      {id: 'thirdQuartile',  type:'number', role:'interval' },
      {id: 'top',  type:'number', role:'interval' },
      // {id: 'maximum',  type:'number', role:'interval' },
    ];

    const finalData = [ firstRow, ...data.slice(1).map((row) => row.concat(row.slice(1))) ];

    var options = isMinimalView ? minimalOptions : fullOptions;
    // Viz Options

    options = {
      ...options,
      lineWidth: 0,
      intervals: {
        barWidth: 1,
        boxWidth: 1,
        lineWidth: 2,
        style: 'boxes'
      },
      interval: {
        'top': {
          style: 'bars',
          fillOpacity: 1,
          color: '#777'
        },
        'bottom': {
          style: 'bars',
          fillOpacity: 1,
          color: '#777'
        },
        'mean': {
          style: 'points',
        },
        'minimum': {
          style: 'points',
        },
        'maximum': {
          style: 'points',
        }
      },
      legend: {
        position: 'none'
      }
    };

    if (isMinimalView) {
      options.intervals.lineWidth = 1;
    }

    options = { ...options, ...additionalOptions }

    options.hAxis.title = labels && labels.x ? labels.x : finalData[0][0];
    options.vAxis.title = labels && labels.y ? labels.y : finalData[0][1];
    options.colors = colors;


    return (
      <Chart
        chartType="LineChart"
        options={ options }
        data={ finalData }
        graph_id={ chartId }
        width={ "100%" }
        height={ "100%" }
      />
    );
  }
}

BoxPlot.propTypes = {
  chartId: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  isMinimalView: PropTypes.bool,
  additionalOptions: PropTypes.object,
  labels: PropTypes.object,
  colors: PropTypes.array,
  config: PropTypes.object
};

BoxPlot.defaultProps = {
  isMinimalView: false,
  additionalOptions: {},
  labels: {},
  colors: [ '#007BD7' ],
  config: {}
};
