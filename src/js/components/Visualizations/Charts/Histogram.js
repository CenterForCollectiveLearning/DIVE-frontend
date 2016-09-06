import React, { Component, PropTypes } from 'react';

import styles from '../Visualizations.sass';

import { getPalette } from '../../../helpers/helpers';

var Chart = require('react-google-charts').Chart;

export default class Histogram extends Component {
  render() {
    const { data, bins, fieldNames, generatingProcedure, isMinimalView, chartId, options, labels } = this.props;

    var finalData = data;

    const fullHistogramOptions = {
      ...options,
      hAxis: {
        title: labels && labels.x ? labels.x : finalData[0][0],
        ticks: bins,
        slantedText: true,
        slantedTextAngle: 45,
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
      tooltip: {
        isHtml: true
      },
      legend: {
        position: 'none'
      }
    };

    const histogramOptions = isMinimalView ? options : fullHistogramOptions;

    return (
      <Chart
        key={ chartId }
        graph_id='chart' // # { chartId }
        chartType="ColumnChart"
        chartVersion="43"
        options={ histogramOptions }
        data={ finalData }
       />
    );
  }
}

Histogram.propTypes = {
  chartId: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  bins: PropTypes.array.isRequired,
  isMinimalView: PropTypes.bool,
  options: PropTypes.object,
  labels: PropTypes.object
};

Histogram.defaultProps = {
  isMinimalView: false,
  options: {},
  labels: {}
};
