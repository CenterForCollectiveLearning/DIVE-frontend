import React, { Component, PropTypes } from 'react';

import * as GeneratingProcedures from '../../../constants/GeneratingProcedures';

import styles from '../Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class PieChart extends Component {

  render() {
    const { data, generatingProcedure, isMinimalView, chartId, options } = this.props;

    return (
      <Chart chartType="PieChart" options={ options } data={ data } graph_id={ chartId }/>
    );
  }
}

PieChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  generatingProcedure: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  isMinimalView: PropTypes.bool,
  options: PropTypes.object
};

PieChart.defaultProps = {
  isMinimalView: false,
  options: {}
};
