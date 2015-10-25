import React, { Component, PropTypes } from 'react';

import * as GeneratingProcedures from '../../../constants/GeneratingProcedures';

import styles from '../Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class ScatterChart extends Component {

  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, options } = this.props;

    return (
      <Chart chartType="ScatterChart" options={ options } data = { data } graph_id={ chartId }/>
    );
  }
}

ScatterChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  generatingProcedure: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  fieldNames: PropTypes.object.isRequired,
  isMinimalView: PropTypes.bool,
  options: PropTypes.object
};

ScatterChart.defaultProps = {
  isMinimalView: false,
  options: {}
};
