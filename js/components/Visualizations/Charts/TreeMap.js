import React, { Component, PropTypes } from 'react';

import * as GeneratingProcedures from '../../../constants/GeneratingProcedures';

import styles from '../Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class TreeMap extends Component {

  render() {
    const { data, generatingProcedure, isMinimalView, chartId, parent, options } = this.props;

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

    const rows = [
      [ parent, null, 0],
      ...data.map((item) =>
        [ `${item[col1]}`, parent, item[col2] ]
      )
    ];

    const columns = [
      {
        'type': 'string',
        'label' : col1
      }, 
      {
        'type': 'string',
        'label' : 'Parent'
      }, 
      {
        'type' : 'number',
        'label' : col2
      }
    ];

    return (
      <Chart chartType="TreeMap" options={ options } columns={ columns } rows={ rows } graph_id={ chartId }/>
    );
  }
}

TreeMap.propTypes = {
  chartId: PropTypes.string.isRequired,
  generatingProcedure: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  parent: PropTypes.string.isRequired,
  isMinimalView: PropTypes.bool,
  options: PropTypes.object
};

TreeMap.defaultProps = {
  isMinimalView: false,
  options: {}
};

