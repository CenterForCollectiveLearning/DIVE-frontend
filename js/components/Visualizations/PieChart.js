import React, { Component, PropTypes } from 'react';

import * as GeneratingProcedures from '../../constants/GeneratingProcedures';

import styles from './Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class PieChart extends Component {

  render() {
    const { data, generatingProcedure, isMinimalView, chartId, options } = this.props;

    var col1, col2 = '';

    switch(generatingProcedure) {
      case GeneratingProcedures.VALUE_COUNT:
        col1 = 'value';
        col2 = 'count';
        break;

      case GeneratingProcedures.VALUE_AGGREGATION:
        col1 = 'value';
        col2 = 'agg';
        break;

      default:
        return;
    }

    const rows = data.map((item) =>
      [ `${item[col1]}`, item[col2] ]
    );

    const columns = [
      {
        'type': 'string',
        'label' : col1
      }, 
      {
        'type' : 'number',
        'label' : col2
      }
    ];

    return (
      <Chart chartType="PieChart" options={ options } columns={ columns } rows={ rows } graph_id={ chartId }/>
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

