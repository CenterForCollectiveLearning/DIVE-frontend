import _ from 'underscore';
import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import * as d3Scale from 'd3-scale';

import BareDataGrid from '../../Base/BareDataGrid';
import Number from '../../Base/Number';
import { useWhiteFontFromBackgroundRGBString } from '../../../helpers/helpers';

export default class CorrelationTable extends Component {

  render() {
    const { correlationResult, preview } = this.props;

    const backgroundColorScale = d3Scale.scaleLinear().domain([-1, 0, 1]).range(['red', 'white', 'green']);
    const fontColorScale = d3Scale.scaleThreshold().domain([-1, 0, 1]).range(['white', 'black', 'white']);

    const renderDataColumn = function(property, customStyles={}) {
      return (
        <div style={ customStyles } className={ styles.dataCell }>
          { !preview &&
            <Number className={ styles.coefficient } value={ property[0] } />
          }
          { !preview &&
            <Number className={ styles.standardError } value={ property[0] } prefix='(' suffix=')' />
          }
      </div>
      );
    }

    const data = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: preview ? _.range(correlationResult.headers.length + 1).map((i) => <div></div>) : ["", ...correlationResult.headers.map((column) => <div className={ styles.tableCell }>{ column }</div>) ]
      },
      ...correlationResult.rows.map(function(row) {
        return new Object({
          rowClass: styles.dataRow,
          columnClass: styles.dataColumn,
          items: [ ( preview ? '' : row.field ), ...row.data.map(function(column){
            if (column[0] == null) { return ""; }
            var backgroundColor = backgroundColorScale(column[0]);
            var whiteFont = useWhiteFontFromBackgroundRGBString(backgroundColor);

            return (renderDataColumn(
              column,
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
      <div className={ styles.aggregationTable }>
        <div className={ styles.gridWithRowFieldLabel }>
          <BareDataGrid data={ data } preview={ preview }/>
        </div>
      </div>
    );
  }
}

CorrelationTable.defaultProps = {
  preview: false
}

CorrelationTable.propTypes = {
  correlationResult: PropTypes.object.isRequired,
  preview: PropTypes.bool
}
