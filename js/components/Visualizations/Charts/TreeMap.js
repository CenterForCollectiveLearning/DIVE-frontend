import React, { Component, PropTypes } from 'react';

import * as GeneratingProcedures from '../../../constants/GeneratingProcedures';

import styles from '../Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class TreeMap extends Component {

  render() {
    const { data, generatingProcedure, isMinimalView, chartId, parent, options } = this.props;

    // Adding in dummy parent value
    const headerRow = data[0];

    const dataWithoutHeader = data.slice(0, data.length - 1)

    const dataWithParent = [
      [ headerRow[0], 'parent', headerRow[1] ],
      [ parent, null, 0],
      ...dataWithoutHeader.map((item) =>
        [ `${item[0]}`, parent, item[1] ]
      )
    ];

    return (
      <Chart chartType="TreeMap" options={ options } data={ dataWithParent } graph_id={ chartId }/>
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
