import _ from 'underscore';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from '../Analysis.sass';

import * as d3Scale from 'd3-scale';

import BareDataGrid from '../../Base/BareDataGrid';
import Number from '../../Base/Number';
import { useWhiteFontFromBackgroundRGBString } from '../../../helpers/helpers';

import ScatterChart from '../../Visualizations/Charts/ScatterChart';

export default class CorrelationTable extends Component {

  render() {
    const { correlationResult, scatterplotData, preview } = this.props;

    const backgroundColorScale = d3Scale.scaleLinear().domain([-1, 0, 1]).range(['red', 'white', 'green']);
    const fontColorScale = d3Scale.scaleThreshold().domain([-1, 0, 1]).range(['white', 'black', 'white']);

    if (!correlationResult || !scatterplotData) {
      return <div />;
    }

    var additionalOptions = {
      pointSize: 2,
      chartArea: {
        width: '100%',
        height: '100%'
      },
      hAxis: {
        title: ''
      },
      vAxis: {
        title: ''
      }
    };

    const renderDataColumn = function(property, customStyles={}) {
      let significance = '';
      const pValue = property[1];
      if (pValue < 0.05) {
        significance = '*'
      } else if (pValue < 0.01) {
        significance = '**'
      } else if (pValue < 0.001) {
        significance = '***'
      }
      return (
        <div style={ customStyles } className={ styles.dataCell }>
          { !preview &&
            <Number className={ styles.coefficient } value={ property[0] } suffix={ significance } />
          }
          { !preview &&
            <Number className={ styles.standardError } value={ property[1] } prefix='(' suffix=')' />
          }
      </div>
      );
    }

    const renderScatterplotCell = function(scatterplotData, customStyles={}) {
      return (
        <div style={ customStyles } className={ styles.dataCell }>
          <div className={ styles.correlationScatterplot }>
            <ScatterChart
              chartId={ `scatterplot-${ scatterplotData.x }-${ scatterplotData.y }` }
              data={ scatterplotData.data }
              additionalOptions={ additionalOptions }
              flip={ false }
              height="80px"
            />
          </div>
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
        const rowField = row.field;

        return new Object({
          rowClass: styles.dataRow,
          columnClass: `${ styles.dataColumn } ${ styles.correlationDataColumn }`,
          items: [ ( preview ? '' : row.field ), ...row.data.map(function(column, i){
            const columnField = correlationResult.headers[i];

            if (column[0] == null) {
              const d = scatterplotData.find((d) => (d.x == rowField && d.y == columnField) || (d.y == rowField && d.x == columnField));

              if (d) {
                return (renderScatterplotCell(d));
              } else {
                return "";
              }
            }
            if (rowField == columnField) {
              return (<div className={ styles.correlationDiagonal } />);
            }

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
  scatterplotData: PropTypes.array.isRequired,
  preview: PropTypes.bool
}
