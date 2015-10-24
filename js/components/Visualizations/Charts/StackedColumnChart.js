import React, { Component, PropTypes } from 'react';

import * as GeneratingProcedures from '../../../constants/GeneratingProcedures';

import styles from '../Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class StackedColumnChart extends Component {

  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, options } = this.props;

    return (
      <Chart chartType="ColumnChart" options={ options } data = { data } graph_id={ chartId }/>
    );
  }
}

StackedColumnChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  generatingProcedure: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  fieldNames: PropTypes.object.isRequired,
  isMinimalView: PropTypes.bool,
  options: PropTypes.object
};

StackedColumnChart.defaultProps = {
  isMinimalView: false,
  options: {}
};
