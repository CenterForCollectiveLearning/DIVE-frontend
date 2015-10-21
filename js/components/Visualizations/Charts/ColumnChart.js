import React, { Component, PropTypes } from 'react';

import * as GeneratingProcedures from '../../../constants/GeneratingProcedures';

import styles from '../Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class ColumnChart extends Component {

  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, options } = this.props;

    var col1, col2, xLabel, yLabel = '';

    switch(generatingProcedure) {
      case GeneratingProcedures.VALUE_COUNT:
        col1 = 'value';
        col2 = 'count';
        xLabel = fieldNames.fieldA.name;
        yLabel = 'count';
        break;

      case GeneratingProcedures.VALUE_AGGREGATION:
        col1 = 'value';
        col2 = 'agg';
        xLabel = fieldNames.groupedField.name;
        yLabel = fieldNames.aggField.name;
        break;

      case GeneratingProcedures.VALUE_VALUE:
        col1 = 'x';
        col2 = 'y';
        xLabel = fieldNames.fieldA.name;
        yLabel = fieldNames.fieldB.name;
        break;

      case GeneratingProcedures.BIN_AGGREGATION:
        col1 = 'bin';
        col2 = 'value';
        xLabel = fieldNames.binningField.name;
        yLabel = fieldNames.aggFieldA.name;
        break;

      default:
        return;
    }

    const rows = data.map((item) =>
      [ item[col1], item[col2] ]
    );

    const columns = [
      {
        'type': 'string',
        'label' : xLabel
      }, 
      {
        'type' : 'number',
        'label' : yLabel
      }
    ];

    return (
      <Chart chartType="ColumnChart" options={ options } columns={ columns } rows={ rows } graph_id={ chartId }/>
    );
  }
}

ColumnChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  generatingProcedure: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  fieldNames: PropTypes.object.isRequired,
  isMinimalView: PropTypes.bool,
  options: PropTypes.object
};

ColumnChart.defaultProps = {
  isMinimalView: false,
  options: {}
};

