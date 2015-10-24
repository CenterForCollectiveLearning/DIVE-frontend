import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

export default class RowRenderer extends Component {
  render() {
    const { data } = this.props;
    const { items, type, field } = data;

    const Column = React.createClass({
      getDefaultProps: function() {
        return { className: '' };
      },
      render: function() {
        return (
          <div className={ styles.column + ' ' + this.props.className }>{ this.props.children }</div>
        );
      }
    });

    const Row = React.createClass({
      getDefaultProps: function() {
        return { className: '' };
      },
      render: function() {
        return (
          <div className={ styles.row + ' ' + this.props.className }>{ this.props.children }</div>
        );
      }
    });

    const Cell = React.createClass({
      getDefaultProps: function() {
        return { className: '', title: null };
      },
      render: function() {
        return (
          <div title={ this.props.title } className={ styles.cell + ' ' + this.props.className }>{ this.props.children }</div>
        );
      }
    });

    if (type == 'tableHeader') {
      return (
        <Row className={ styles.headerRow }>
          <Column className={ styles.headerColumn }>
            <Cell>Variables</Cell>
          </Column>
          { _.range(data.size).map((i) =>
              <Column key={`header-${ i }`} className={ styles.headerColumn }>
                <Cell>({ i + 1 })</Cell>
              </Column>
            )
          }
        </Row>
      );
    }

    const getRoundedString = function (num, decimalPlaces=2) {
      return num ? `${ parseFloat(num).toFixed(decimalPlaces) }` : '';
    };

    if (type == 'footerRow') {
      return (
        <Row className={ styles.footerRow }>
          <Column className={ styles.footerColumn + ' ' + styles.rowTitle }>
            <Cell className={ styles[`field-${ field }`] }><div dangerouslySetInnerHTML={{__html: data.formattedField}} /></Cell>
          </Column>
          { items.map((value, i) =>
              <Column className={ styles.rowDataColumn } key={ `col-${ field }-${ i }` }>
                <Cell>{ getRoundedString(value, 3) }</Cell>
              </Column>
            )
          }
        </Row>
      );
    }
    const getCoefficientString = function (column) {
      if (!column) {
        return '';
      }

      const { coefficient, pValue } = column;

      if (!coefficient) {
        return '';
      }

      var pValueString = ''
      if (pValue < 0.01){
        pValueString = '***';
      } else if (pValue < 0.05) {
        pValueString = '**';
      } else if (pValue < 0.1) {
        pValueString = ''
      }
      return getRoundedString(coefficient) + pValueString;
    };

    const getStandardErrorString = function (column) {
      if (!column) {
        return '';
      }

      if (!column.standardError) {
        return '';
      }
      return `(${ getRoundedString(column.standardError) })`;
    };

    return (
      <Row className={ styles.dataRow }>
        <Column className={ styles.rowTitle }>
          <Cell title={ field }>
            { field }
          </Cell>
        </Column>
        { items.map((column, i) =>
            <Column className={ styles.rowDataColumn } key={ `col-${ field }-${ i }` }>
              <Cell className={ styles.coefficient }>
                { getCoefficientString(column) }
              </Cell>
              <Cell className={ styles.standardError }>
                { getStandardErrorString(column) }
              </Cell>
            </Column>
          )
        }
      </Row>
    );
  }
}
// 
RowRenderer.propTypes = {
  data: PropTypes.object.isRequired
}

RowRenderer.defaultProps = {
  data: {}
}
