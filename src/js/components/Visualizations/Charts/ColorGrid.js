import _ from 'underscore';
import React, { Component, PropTypes } from 'react';

import * as d3Scale from 'd3-scale';

import BareDataGrid from '../../Base/BareDataGrid';
import styles from '../Visualizations.sass';
import { getRoundedString, useWhiteFontFromBackgroundRGBString } from '../../../helpers/helpers';

var Chart = require('react-google-charts').Chart;

export default class ColorGrid extends Component {

  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, chartId, options } = this.props;

    console.log('Rendering ColorGrid');
    console.log(data);

    const backgroundColorScale = d3Scale.scaleLinear().domain([-1, 0, 1]).range(['red', 'white', 'green']);
    const fontColorScale = d3Scale.scaleThreshold().domain([-1, 0, 1]).range(['white', 'black', 'white']);
    const rowFieldName = data[0][0];
    const tableHeader = data[0];  // Skip first value
    const tableRows = data.slice(1);
    const preview = isMinimalView;

    const renderDataColumn = function(property, customStyles={}) {
      return (
        <div style={ customStyles } className={ styles.dataCell }>
          { !preview &&
            <div className={ styles.value }>
              { getRoundedString(property, 2, true) }
            </div>
          }
      </div>
      );
    }

    const finalTableData = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: preview ? _.range(tableHeader + 1).map((i) => <div></div>) : [...tableHeader.map((column) => <div className={ styles.tableCell }>{ column }</div>) ]
      },
      ...tableRows.map(function(row) {
        return new Object({
          rowClass: styles.dataRow,
          columnClass: styles.dataColumn,
          items: [ ...row.map(function(value){
            if (value == null) { return ""; }
            var backgroundColor = backgroundColorScale(value);
            var whiteFont = useWhiteFontFromBackgroundRGBString(backgroundColor);

            return (renderDataColumn(
              value,
              { backgroundColor: backgroundColor,
                color: whiteFont ? 'white': 'black',
                height: '100%'
              }
            ));
          })]
        })
      })
    ];

    console.log(finalTableData)

    return (
      <div className={ styles.colorGrid }>
        <BareDataGrid data={ finalTableData } preview={ preview }/>
      </div>
    );
  }
}

ColorGrid.propTypes = {
  chartId: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  isMinimalView: PropTypes.bool,
  options: PropTypes.object
};

ColorGrid.defaultProps = {
  isMinimalView: false,
  options: {}
};
