import React, { Component, PropTypes } from 'react';

import styles from '../Visualizations.sass';

import { getPalette } from '../../../helpers/helpers';

var Chart = require('react-google-charts').Chart;

export default class BoxPlot extends Component {
  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, options, labels } = this.props;

    var firstRow = [
      data[0][0],
      '',
      {id: 'bottom',  type:'number', role:'interval' },
      {id: 'firstQuartile',  type:'number', role:'interval' },
      {id: 'median',  type:'number', role:'interval' },
      {id: 'mean',  type:'number', role:'interval' },
      {id: 'thirdQuartile',  type:'number', role:'interval' },
      {id: 'top',  type:'number', role:'interval' }
    ];

    const finalData=[ firstRow, ...data.slice(1) ];

    console.log(finalData)

    const fullBoxPlotOptions = {
      ...options,
      lineWidth: 0,
      series: [{'color': '#D3362D'}],
      hAxis: {
        gridlines: {color: '#fff'}
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
