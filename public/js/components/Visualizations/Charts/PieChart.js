import React, { Component, PropTypes } from 'react';

import styles from '../Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class PieChart extends Component {

  render() {
    const { data, generatingProcedure, isMinimalView, chartId, options } = this.props;

    const pieData = data.map((row) =>
      [`${ row[0] }`, row[1]]
    );

    return (
      <Chart chartType="PieChart" options={ options } data={ pieData } graph_id={ chartId }/>
    );
  }
}

PieChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  isMinimalView: PropTypes.bool,
  options: PropTypes.object
};

PieChart.defaultProps = {
  isMinimalView: false,
  options: {}
};
