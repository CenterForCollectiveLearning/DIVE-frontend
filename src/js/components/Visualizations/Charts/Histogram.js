import React, { Component, PropTypes } from 'react';

import { fullOptions, minimalOptions } from '../VisualizationOptions';
import styles from '../Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class Histogram extends Component {
  render() {
    const { data, bins, fieldNames, generatingProcedure, isMinimalView, chartId, additionalOptions, colors, labels } = this.props;

    var finalData = data;

    var options = isMinimalView ? minimalOptions : fullOptions;
    options.hAxis.title = labels && labels.x ? labels.x : finalData[0][0];
    options.vAxis.title = labels && labels.y ? labels.y : finalData[0][1];
    options.colors = colors;

    if (isMinimalView) {

    } else {
      options = {
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
    }

    options = {
      ...options,
      ...additionalOptions
    }

    return (
      <Chart
        chartType="ColumnChart"
        chartVersion="43"
        key={ chartId }
        graph_id={ chartId }
        options={ options }
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
  additionalOptions: PropTypes.object,
  labels: PropTypes.object,
  colors: PropTypes.array
};

Histogram.defaultProps = {
  isMinimalView: false,
  additionalOptions: {},
  labels: {},
  colors: [ '#007BD7' ]
};
