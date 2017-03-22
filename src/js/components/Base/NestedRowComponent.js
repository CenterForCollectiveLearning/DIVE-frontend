import React, { Component, PropTypes } from 'react';

import styles from './BareDataGrid.sass';

export default class NestedRowComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: props.collapsed
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collapsed != this.props.collapsed) {
      this.setState({ collapsed: nextProps.collapsed });
    }
  }

  collapseNestedRow = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    const { row, i, nColumns, columnWidth, minimumColumnWidth } = this.props;
    const { collapsed } = this.state;

    const Column = React.createClass({
      getDefaultProps: function() {
        return { className: '' };
      },
      render: function() {
        return (
          <div style={{ 'width': `${ 100/nColumns }%`, minWidth: minimumColumnWidth, 'maxWidth': `${ 100/nColumns }%` }} className={ styles.column + ' ' + this.props.className }>{ this.props.children }</div>
        );
      }
    });

    const Row = React.createClass({
      getDefaultProps: function() {
        return { className: '' };
      },
      render: function() {
        return (
          <div className={ styles.row + ' ' + this.props.className } onClick={ this.props.onClick }>{ this.props.children }</div>
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

    // Creating first row based on values
    const firstChildRow = row.children[0];
    const parentRow = {
      rowClass: firstChildRow.rowClass,
      columnClass: firstChildRow.columnClass,
      items: [
        row.parentName,
        ...firstChildRow.items.slice(1).map((column) => ((column !== '') ? '✓' : ''))
      ]
    };

    return (
      <div className={ styles.nestedRow + ( collapsed ? (' ' + styles.collapsed) : '') }>
        { <Row
            key={ `header-${ parentRow.rowClass }-${ i }]`}
            className={ parentRow.rowClass }
            onClick={ this.collapseNestedRow }
          >{
            parentRow.items.map((column, j) =>
              <Column
                key={ `header-${ parentRow.rowClass }-${ i }-${ parentRow.columnClass }-${ j }`}
                className={ parentRow.columnClass + ((j == 0) ? (' ' + styles.rowLabel) : '')}
              >
                { column }
                { (j == 0) && <span className={ styles.collapseArrow } />}
              </Column>
            )
          }
        </Row> }
      { !collapsed && row.children.map(function(actualRow, k) {
        return <div>
          <Row key={ `${ actualRow.rowClass }-${ i }-${ k }`} className={ actualRow.rowClass }>{
            actualRow.items.map((column, j) =>
              <Column key={ `${ actualRow.rowClass }-${ i }-${ actualRow.columnClass }-${ j }-${ k }`} className={ actualRow.columnClass + ((j == 0) ? (' ' + styles.nestedRowLabel) : '')}>{ column }</Column>
            )
          }</Row>
        </div>
      }) }
    </div>
    );
  }
}

NestedRowComponent.defaultProps = {
  collapsed: false,
  i: 0
}

NestedRowComponent.propTypes = {
  row: PropTypes.object.isRequired,
  collapsed: PropTypes.bool,
  i: PropTypes.number,
  columnWidth: PropTypes.number,
  minimumColumnWidth: PropTypes.number,
  nColumns: PropTypes.number,
};
