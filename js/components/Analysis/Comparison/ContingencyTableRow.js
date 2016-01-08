import React, { Component, PropTypes } from 'react';
import _ from 'underscore';

import styles from '../Analysis.sass';

export default class ContingencyTableRow extends Component {
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
            <Cell></Cell>
          </Column>
          {items.map((value, i) =>
              <Column key={`header-${ i }`} className={ styles.headerColumn }>
                <Cell>({ value })</Cell>
              </Column>
            )
          }
        </Row>
      );
    }

    const getRoundedString = function (num, decimalPlaces=3) {
      if (num) {
        return +parseFloat(num).toPrecision(decimalPlaces);
      }

      return '';
    };

    // if (type == 'footerRow') {
    //   return (
    //     <Row className={ styles.footerRow }>
    //       <Column className={ styles.footerColumn + ' ' + styles.rowTitle }>
    //         <Cell className={ styles[`field-${ field }`] }><div dangerouslySetInnerHTML={{__html: data.formattedField}} /></Cell>
    //       </Column>
    //       { items.map((value, i) =>
    //           <Column className={ styles.rowDataColumn } key={ `col-${ field }-${ i }` }>
    //             <Cell>{ getRoundedString(value, 3) }</Cell>
    //           </Column>
    //         )
    //       }
    //     </Row>
    //   );
    // }


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
                { getRoundedString(column) }
              </Cell>
            </Column>
          )
        }
      </Row>
    );
  }
}

ContingencyTableRow.propTypes = {
  data: PropTypes.object.isRequired
}

ContingencyTableRow.defaultProps = {
  data: {}
}
