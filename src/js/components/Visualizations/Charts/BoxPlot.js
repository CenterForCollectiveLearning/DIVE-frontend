import React, { Component, PropTypes } from 'react';

import styles from '../Visualizations.sass';

import { getPalette } from '../../../helpers/helpers';

var Chart = require('react-google-charts').Chart;

export default class BoxPlot extends Component {
  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, options, labels } = this.props;

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

    const fullBoxPlotOptions = {
      ...options,
      backgroundColor: 'transparent',
      lineWidth: 0,
      chartArea: {
        top: '5%',
        height: '78%',
        left: '15%',
        width: '80%'
      },
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
      legend: { position: 'none' },
    };

    const boxPlotOptions = isMinimalView ? options : fullBoxPlotOptions;

    return (
      <Chart chartType="LineChart" chartVersion="43" options={ boxPlotOptions } data={ finalData } graph_id={ chartId }/>
    );
  }
}

BoxPlot.propTypes = {
  chartId: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  isMinimalView: PropTypes.bool,
  options: PropTypes.object,
  labels: PropTypes.object
};

BoxPlot.defaultProps = {
  isMinimalView: false,
  options: {},
  labels: {}
};
