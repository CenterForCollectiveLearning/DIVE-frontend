import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import * as d3Scale from 'd3-scale';

import BareDataGrid from '../../Base/BareDataGrid';
import { getRoundedString } from '../../../helpers/helpers';

export default class CorrelationTable extends Component {

  render() {
    const { correlationResult } = this.props;

    const backgroundColorScale = d3Scale.scaleLinear().domain([-1, 0, 1]).range(['red', 'white', 'green']);
    const fontColorScale = d3Scale.scaleThreshold().domain([-1, 0, 1]).range(['white', 'black', 'white']);

    const renderDataColumn = function(property, customStyles={}) {
      return (
        <div style={ customStyles } className={ styles.dataCell }>
          <div className={ styles.coefficient }>
            { getRoundedString(property[0], 2, true) }
          </div>
          <div className={ styles.standardError }>
            ({ getRoundedString(property[1], 2, true) })
          </div>
        </div>
      );
    }

    const data = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: ["", ...correlationResult.headers.map((column) => <div className={ styles.tableCell }>{ column }</div>) ]
      },
      ...correlationResult.rows.map(function(row) {
        return new Object({
          rowClass: styles.dataRow,
          columnClass: styles.dataColumn,
          items: [ row.field, ...row.data.map(function(column){
            if (column[0] == null) { return "";}
            return (renderDataColumn(
              column,
              { backgroundColor: backgroundColorScale(column[0]),
                color: fontColorScale(column[0])
              }
            ));
          })]
        })
      })
    ];

    return (
      <div className={ styles.aggregationTable }>
        <div className={ styles.gridWithRowFieldLabel }>
          <BareDataGrid data={ data } />
        </div>
      </div>
    );
  }
}

CorrelationTable.propTypes = {
  correlationResult: PropTypes.object.isRequired
}
