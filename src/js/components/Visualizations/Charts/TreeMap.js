import React, { Component, PropTypes } from 'react';

import { fullOptions, minimalOptions } from '../VisualizationOptions';
import styles from '../Visualizations.sass';

import { Chart } from 'react-google-charts';

export default class TreeMap extends Component {

  render() {
    const { data, generatingProcedure, isMinimalView, chartId, parent, colors, labels, config } = this.props;

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

    var options = isMinimalView ? minimalOptions : fullOptions;
    // Viz Options
    options.hAxis.title = labels && labels.x ? labels.x : finalData[0][0];
    options.vAxis.title = labels && labels.y ? labels.y : finalData[0][1];
    options.colors = colors;

    options = {
      ...options,
      minColor: '#EEEEEE',
      maxColor: colors[0],
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
      <Chart
        chartType="TreeMap"
        options={ options }
        data={ dataWithParent }
        graph_id={ chartId }
        width={ "100%" }
        height={ "100%" }
        loader={ <div className={ styles.renderChartText + ' pt-monospace-text' }>Rendering Chart...</div> }
      />
    );
  }
}

TreeMap.propTypes = {
  chartId: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  parent: PropTypes.string.isRequired,
  isMinimalView: PropTypes.bool,
  options: PropTypes.object,
  labels: PropTypes.object,
  colors: PropTypes.array,
  config: PropTypes.object
};

TreeMap.defaultProps = {
  isMinimalView: false,
  options: {},
  labels: {},
  colors: [ '#007BD7' ],
  config: {}
};
