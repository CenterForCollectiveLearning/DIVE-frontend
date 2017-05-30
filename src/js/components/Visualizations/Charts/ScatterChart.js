import React, { Component, PropTypes } from 'react';

import { fullOptions, minimalOptions } from '../VisualizationOptions';
import styles from '../Visualizations.sass';

import { Chart } from 'react-google-charts';

export default class ScatterChart extends Component {

  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, colors, labels, flip, additionalOptions, config } = this.props;

    var options = isMinimalView ? minimalOptions : fullOptions;

    console.log(data);
    let finalData;
    if (flip) {
      finalData = data.map((d) => [d[1], d[0]]);
    } else {
      finalData = data;
    }
    console.log(finalData);

    options = {
      ...options,
      hAxis: {
        ...options.hAxis,
        minValue: 'automatic',
        scaleType: config.display ? config.display.hScaleType : null
      },
      legend: {
        ...options.legend,
        position: 'none'
      },
      vAxis: {
        ...options.vAxis,
        minValue: 'automatic',
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

    console.log(options);

    return (
      <Chart
        graph_id={ chartId }
        chartType="ScatterChart"
        options={ options }
        data={ finalData }
        width={ "100%" }
        height={ "80px" }
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
  config: PropTypes.object,
  flip: PropTypes.bool
};

ScatterChart.defaultProps = {
  isMinimalView: false,
  additionalOptions: {},
  labels: {},
  colors: [ '#007BD7' ],
  config: {},
  flip: false
};
