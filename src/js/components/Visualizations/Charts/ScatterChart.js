import React, { Component, PropTypes } from 'react';

import { fullOptions, minimalOptions } from '../VisualizationOptions';
import styles from '../Visualizations.sass';

import * as d3Scale from 'd3-scale';

import { Chart } from 'react-google-charts';

export default class ScatterChart extends Component {

  render() {
    const { data, width, height, fieldNames, generatingProcedure, isMinimalView, chartId, colors, labels, flip, additionalOptions, config } = this.props;

    var options = isMinimalView ? minimalOptions : fullOptions;

    let finalData;
    if (flip) {
      finalData = data.map((d) => [d[1], d[0]]);
    } else {
      finalData = data;
    }

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
      tooltip: {
        isHtml: true
      },
      vAxis: {
        ...options.vAxis,
        minValue: 'automatic',
        scaleType: config.display ? config.display.vScaleType : null
      },
      trendlines: {
        0: {
          type: 'linear',
          showR2: true,
          visibleInLegend: true
        },
      }
    }
    const minimumPointSize = isMinimalView ? 3 : 4;
    const pointSize = 15 * Math.exp(-(1/10) * finalData.length) + minimumPointSize;

    options.pointSize = pointSize;
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
        data={ finalData }
        width={ width }
        height={ height }
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
  flip: PropTypes.bool,
  width: PropTypes.string,
  height: PropTypes.string
};

ScatterChart.defaultProps = {
  isMinimalView: false,
  additionalOptions: {},
  labels: {},
  colors: [ '#007BD7' ],
  config: {},
  flip: false,
  width: "100%",
  height: "100%"
};
