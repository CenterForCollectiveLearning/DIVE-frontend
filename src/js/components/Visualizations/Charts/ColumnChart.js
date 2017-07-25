import React, { Component, PropTypes } from 'react';

import { fullOptions, minimalOptions } from '../VisualizationOptions';
import styles from '../Visualizations.sass';

import { Chart } from 'react-google-charts';

export default class ColumnChart extends Component {
  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, additionalOptions, colors, labels, config } = this.props;

    var finalData = data;
    finalData[0] = [ { id: finalData[0][0], label: finalData[0][0], type: 'string' }, ...finalData[0].slice(1) ];

    var options = isMinimalView ? minimalOptions : fullOptions;

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
          },
          scaleType: config.display ? config.display.vScaleType : null
        },
        legend: {
          position: config.display ? config.display.legendPosition : 'none'
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
  colors: PropTypes.array,
  config: PropTypes.object
};

ColumnChart.defaultProps = {
  isMinimalView: false,
  additionalOptions: {},
  labels: {},
  colors: [ '#007BD7' ],
  config: {}
};
