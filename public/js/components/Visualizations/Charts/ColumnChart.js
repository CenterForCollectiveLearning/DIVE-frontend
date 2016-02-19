import React, { Component, PropTypes } from 'react';

import styles from '../Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class ColumnChart extends Component {

  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, options } = this.props;

    const firstElement = data[1][0];
    var finalData = data;
    if (Array.isArray(firstElement)) {
      const header = data[0];
      const formattedValues = data.slice(1).map(function(d) {
          const bin = d[0];
          const value = d[1];
          const formattedBin = `${ bin[0] } - ${ bin[1] }`;
          return [ formattedBin, value ];
      })
      finalData = [ header, ...formattedValues ]
    }

    const columnChartOptions = {
      ...options,
      hAxis: {
        title: finalData[0][0],
        titleTextStyle: {
          color: '#333',
          bold: true,
          italic: false
        }
      },
      vAxis: {
        minValue: 0,
        title: finalData[0][1],
        titleTextStyle: {
          color: '#333',
          bold: true,
          italic: false
        }
      },
      legend: {
        position: 'none'
      }
    };

    return (
      <Chart chartType="ColumnChart" options={ columnChartOptions } data={ finalData } graph_id={ chartId }/>
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
