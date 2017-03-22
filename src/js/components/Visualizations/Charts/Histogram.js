import React, { Component, PropTypes } from 'react';

import { fullOptions, minimalOptions } from '../VisualizationOptions';
import styles from '../Visualizations.sass';

import { Chart } from 'react-google-charts';

export default class Histogram extends Component {
  render() {
    const { data, bins, fieldNames, generatingProcedure, isMinimalView, chartId, additionalOptions, colors, labels, config } = this.props;

    var finalData = data;

    var options = isMinimalView ? minimalOptions : fullOptions;

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
          },
          scaleType: config.vScaleType,
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

    options.hAxis.title = labels && labels.x ? labels.x : finalData[0][0];
    options.vAxis.title = labels && labels.y ? labels.y : finalData[0][1];
    options.colors = colors;

    return (
      <Chart
        loader={ <div className={ styles.renderChartText + ' pt-monospace-text' }>Rendering Chart...</div> }
        chartType="ColumnChart"
        graph_id={ chartId }
        options={ options }
        data={ finalData }
        width={ "100%" }
        height={ "100%" }
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
  colors: PropTypes.array,
  config: PropTypes.object
};

Histogram.defaultProps = {
  isMinimalView: false,
  additionalOptions: {},
  labels: {},
  colors: [ '#007BD7' ],
  config: {}
};
