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

    const rotatedRow = React.createClass({
      getDefaultProps: function() {
        return { className: '' };
      },
      render: function() {
        return (
          <div className={ styles.row + ' ' + this.props.className }>{ this.props.children }</div>
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

    const getRoundedString = function (num, decimalPlaces=3) {
      if (num != null) {
        return +parseFloat(num).toPrecision(decimalPlaces);
      }

      return '';
    };

    const invisibleFlex = {
      display: 'flex',
      flexGrow: '1',
      border: '0px',
      flexBasis: '0'
    };

    const headerFlex = {
      display: 'flex',
      flexDirection: 'row',
      flexGrow: `${items.length}`,
      border: '1px solid #D8D8D8',
      borderBottomWidth: '0',
      borderRightWidth: '0',
      flexBasis: '0'
    };
    if (type == 'noNumericalTableHeader') {
      return (
        <Row className={ styles.invisible }>
          <div style ={invisibleFlex}></div>
          <div style={headerFlex}>
            {items.map((value, i) =>
                <Column key={`header-${ i }`} className={ styles.headerColumn }>
                  <Cell>{ value }</Cell>
                </Column>
              )
            }
          </div>
        </Row>
      );
    }

    else if (type == 'numericalTableHeader') {
      return (
        <Row className = {styles.invisible}>
          <div className = {styles.qBlock + ' ' + styles.adjustment}></div>
          <div style ={invisibleFlex}></div>
            <div style={headerFlex}>
                {items.map((value, i) =>
                    <Column key={`header-${ i }`} className={ styles.headerColumn }>
                      <Cell>{ value }</Cell>
                    </Column>
                  )
                }
            </div>
        </Row>
      );
    }

    else if (type == 'numericalHeader') {



      return (

        <Row className={ styles.invisible }>
          <div  className = {styles.qBlock + ' ' + styles.adjustment}></div>
          <div style={invisibleFlex}></div>
          <div style={headerFlex}>
            <Column key={`header-numerical`} className={ styles.headerColumn }>
              <Cell>{ field }</Cell>
            </Column>
          </div>
        </Row>
      );
    }


    else if (type == 'quantitativeRow') {
      return (
        <Row className={ styles.headerRow }>
          <div  className = {styles.qBlock + ' ' + styles.header}> <div className = {styles.rotatedCell}>{field}</div></div>
          <Column className={styles.quantitativeColumn}>
            {items.map((object, i) =>
              <Row className={ styles.dataRow }>
                <Column className={ styles.headerColumn }>
                  <Cell title={ object.field }>
                    { object.field }
                  </Cell>
                </Column>
                { object.items.map((column, i) =>
                    <Column className={ styles.rowDataColumn } key={ `col-${ object.field }-${ i }` }>
                      <Cell className={ styles.coefficient }>
                        { getRoundedString(column) }
                      </Cell>
                    </Column>
                  )
                }
              </Row>
              )
            }
          </Column>

        </Row>
      );
    }




    return (
      <Row className={ styles.dataRow }>
        <Column className={ styles.headerColumn }>
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
