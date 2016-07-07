import React, { Component, PropTypes } from 'react';

import styles from '../Visualizations.sass';

import { getPalette } from '../../../helpers/helpers';

var Chart = require('react-google-charts').Chart;

export default class BoxPlot extends Component {
  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, options, labels } = this.props;

    var finalData = data;

    var hashElements;
    if (labels && labels.x && labels.y) {
      hashElements = [labels.x, labels.y];
    } else {
      hashElements = [finalData[0][0], finalData[0][1]];
    }

    const colors = getPalette(hashElements);

    const fullBoxPlotOptions = {
      ...options,
      series: {
        0: {type: "candlesticks"},
        1: {type: "line", lineWidth: 0, pointSize: 1, color: 'black' },
        2: {type: "line", lineWidth: 0, pointSize: 1, color: 'black' },
      },
      legend: {
        position: 'none'
      },
      candlestick: {
        fallingColor: {
          fill: 'none'
        },
        risingColor: {
          fill: 'none'
        },
      }
    };

    const boxPlotOptions = isMinimalView ? options : fullBoxPlotOptions;

    return (
      <Chart chartType="CandlestickChart" chartVersion="43" options={ boxPlotOptions } data={ finalData } graph_id={ chartId }/>
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
