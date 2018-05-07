import React, { Component, PropTypes } from 'react';

import { fullOptions, minimalOptions } from '../VisualizationOptions';
import styles from '../Visualizations.sass';

import { Chart } from 'react-google-charts';

export default class LineChart extends Component {

  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, additionalOptions, colors, labels, config } = this.props;

    var finalData = data;

    var options = isMinimalView ? minimalOptions : fullOptions;

    options = {
      ...options,
      intervals: { style: 'boxes' },
      pointSize: 0,
      legend: {
        position: 'none'
      }
    }

    options = {
      ...options,
      ...additionalOptions
    }

    if (!isMinimalView) {
      options.hAxis = {
        ...options.hAxis,
        title: labels && labels.x ? labels.x : finalData[0][0],
        minValue: 'automatic'
      }
      options.vAxis.title = labels && labels.y ? labels.y : finalData[0][1];
    }

    options.colors = colors;

    return (
      <Chart
        chartType="LineChart"
        options={ options }
        data={ finalData }
        graph_id={ chartId }
        width={ "100%" }
        height={ "100%" }
        loader={ <div className={ styles.renderChartText + ' pt-monospace-text' }>Rendering Chart...</div> }
      />
    );
  }
}

LineChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  isMinimalView: PropTypes.bool,
  additionalOptions: PropTypes.object,
  labels: PropTypes.object,
  colors: PropTypes.array,
  config: PropTypes.object
};

LineChart.defaultProps = {
  isMinimalView: false,
  additionalOptions: {},
  labels: {},
  colors: [ '#007BD7' ],
  config: {}
};
