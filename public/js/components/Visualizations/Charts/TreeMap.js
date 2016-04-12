import React, { Component, PropTypes } from 'react';

import styles from '../Visualizations.sass';

var Chart = require('react-google-charts').Chart;

export default class TreeMap extends Component {

  render() {
    const { data, generatingProcedure, isMinimalView, chartId, parent, options } = this.props;

    // Adding in dummy parent value
    const headerRow = data[0];

    const dataWithoutHeader = data.slice(1, data.length)

    const dataWithParent = [
      [ headerRow[0], 'parent', headerRow[1] ],
      [ parent, null, 0],
      ...dataWithoutHeader.map((item) =>
        [ `${item[0]}`, parent, item[1] ]
      )
    ];

    function generateTooltip(row, size, value) {
      return `
        <div style="padding: 8px 12px; background-color: white;" className=${ styles.tooltip } class="tooltip">
          <div style="white-space: nowrap; font-size: 14px;">${ data[row][0] }</div>
          <div style="font-weight: 500; font-size: 18px; padding-top: 4px;">${ size }</div>
        </div>
      `;
    }

    const treeMapOptions = {
      ...options,
      minColor: '#F3595C',
      maxColor: '#78C466',
      textStyle: {
        ...options.textStyle,
        fontSize: 20,
        bold: true
      },
      showTooltips: true,
      generateTooltip: generateTooltip,
      tooltip: {
        trigger: 'both'
      }
    }

    return (
      <Chart chartType="TreeMap" chartVersion="43" options={ treeMapOptions } data={ dataWithParent } graph_id={ chartId }/>
    );
  }
}

TreeMap.propTypes = {
  chartId: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  parent: PropTypes.string.isRequired,
  isMinimalView: PropTypes.bool,
  options: PropTypes.object
};

TreeMap.defaultProps = {
  isMinimalView: false,
  options: {}
};
