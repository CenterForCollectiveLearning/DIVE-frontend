import React, { Component, PropTypes } from 'react';

import * as GeneratingProcedures from '../../../constants/GeneratingProcedures';

import styles from '../Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class ColumnChart extends Component {

  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, options } = this.props;

    return (
      <Chart chartType="ColumnChart" options={ options } data={ data } graph_id={ chartId }/>
    );
  }
}

ColumnChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  isMinimalView: PropTypes.bool,
  options: PropTypes.object
};

ColumnChart.defaultProps = {
  isMinimalView: false,
  options: {}
};
