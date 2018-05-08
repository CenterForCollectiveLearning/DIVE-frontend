import _ from 'underscore';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as d3Scale from 'd3-scale';

import Number from '../../Base/Number';
import BareDataGrid from '../../Base/BareDataGrid';
import styles from '../Visualizations.sass';
import { getRoundedString, useWhiteFontFromBackgroundRGBString } from '../../../helpers/helpers';

import { Chart } from 'react-google-charts';

export default class ColorGrid extends Component {

  render() {
    const { data, fieldNames, generatingProcedure, isMinimalView, additionalOptions, colors, labels, config } = this.props;
    const preview = isMinimalView;

    var tableHeader = data[0];  // Skip first value
    var tableRows = data.slice(1);

    // Parse out fields included for error bars in stacked bar
    var errorBarIndices = [];
    tableHeader.forEach(function(e, i) {
      if (typeof e === 'object') {
        errorBarIndices.push(i);
      }
    });

    var parsedTableHeader = tableHeader.filter((e, i) => errorBarIndices.indexOf(i) == -1);
    var parsedTableRows = tableRows;
    if ( errorBarIndices.length ) {
      parsedTableRows = tableRows.map((row) =>
        row.filter((e, i) => errorBarIndices.indexOf(i) == -1)
      )
    }

    const allValues = tableRows.reduce(function(previousValue, currentValue) {
      return [...previousValue, ...currentValue.slice(1) ];
    }, []);

    // Calibrate scales
    const min = Math.min(...allValues)
    const max = Math.max(...allValues)
    const backgroundColorScale = d3Scale.scaleLinear().domain([min, max]).range(['white', colors[0]]);
    const fontColorScale = d3Scale.scaleThreshold().domain([min, max]).range(['black', 'white']);

    const renderDataColumn = function(property, customStyles={}) {
      return (
        <div style={ customStyles } className={ styles.dataCell }>
          { !preview &&
            <div className={ styles.value }>
              <Number value={ getRoundedString(property, 3, true) } />
            </div>
          }
      </div>
      );
    }

    const finalTableData = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: preview ? _.range(parsedTableHeader.length).map((i) => <div></div>) : [...parsedTableHeader.map((column) => <div className={ styles.tableCell }>{ column }</div>) ]
      },
      ...parsedTableRows.map(function(row) {
        return new Object({
          rowClass: styles.dataRow,
          columnClass: styles.dataColumn,
          items: [ ( preview ? '' : row[0] ), ...row.slice(1).map(function(value){
            if (value === null) { return ''; }
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

    return (
      <div className={ styles.colorGrid }>
        { isMinimalView &&
          <BareDataGrid data={ finalTableData } preview={ preview }/>
        }
        { !isMinimalView &&
          <div>
            <div className={ styles.columnFieldLabel }>{ labels.x }</div>
            <div className={ styles.gridWithRowFieldLabel }>
              <div className={ styles.rowFieldLabel }>{ labels.y }</div>
              <BareDataGrid data={ finalTableData } preview={ preview }/>
            </div>
          </div>
        }
      </div>
    );
  }
}

ColorGrid.propTypes = {
  chartId: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  isMinimalView: PropTypes.bool,
  additionalOptions: PropTypes.object,
  labels: PropTypes.object,
  colors: PropTypes.array,
  config: PropTypes.object
};

ColorGrid.defaultProps = {
  isMinimalView: false,
  additionalOptions: {},
  labels: {},
  colors: [ '#007BD7' ],
  config: {}
};
