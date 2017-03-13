import React, { Component, PropTypes } from 'react';

import { fullOptions, minimalOptions } from '../VisualizationOptions';
import styles from '../Visualizations.sass';

import { Chart } from 'react-google-charts';

export default class ScatterChart extends Component {

  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, colors, labels, additionalOptions, config } = this.props;

    var options = isMinimalView ? minimalOptions : fullOptions;

    options = {
      ...options,
      hAxis: {
        scaleType: config.display ? config.display.hScaleType : null
      },
      legend: {
        ...options.legend,
        position: 'none'
      },
      vAxis: {
        scaleType: config.display ? config.display.vScaleType : null
      }
    }

    options.hAxis.title = labels && labels.x ? labels.x : data[0][0];
    options.vAxis.title = labels && labels.y ? labels.y : data[0][1];
    options.colors = colors;

    options = {
      ...options,
      ...additionalOptions,
    }

    return (
      <Chart
        graph_id={ chartId }
        chartType="ScatterChart"
        options={ options }
        data={ data }
        width={ "100%" }
        height={ "100%" }
        loader={ <div className={ styles.renderChartText + ' pt-monospace-text' }>Rendering Chart...</div> }
       />
    );
  }
}

ScatterChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  isMinimalView: PropTypes.bool,
  additionalOptions: PropTypes.object,
  labels: PropTypes.object,
  colors: PropTypes.array,
  config: PropTypes.object
};

ScatterChart.defaultProps = {
  isMinimalView: false,
  additionalOptions: {},
  labels: {},
  colors: [ '#007BD7' ],
  config: {}
};
