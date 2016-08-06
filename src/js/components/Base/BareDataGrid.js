import React, { Component, PropTypes } from 'react';

import NestedRowComponent from './NestedRowComponent';
import styles from './BareDataGrid.sass';

export default class BareDataGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id != this.props.id) {
      this.setState({ loading: true });
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    const { data, id, tableClassName, containerClassName, preview } = this.props;

    const columnWidth = preview ? 0 : 200;
    const minimumColumnWidth = preview ? 0 : 105;

    const nColumns = data.length ? data[0].items.length : 0;
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

    return (
      <div className={ styles.gridContainer }>
        <div className={ styles.outerGrid }>
          { this.state.loading &&
            <div className={ styles.watermark }>Loading...</div>
          }
          { !this.state.loading &&
            <div className={ styles.innerGrid }>
              { data.map(function (row, i) {
                if (row.isNested) {
                  return <NestedRowComponent
                    key={ i }
                    i={ i }
                    row={ row }
                    columnWidth={ columnWidth }
                    minimumColumnWidth={ minimumColumnWidth }
                    nColumns={ nColumns }
                    collapsed={ row.children.length > 3 }
                  />
                } else {
                  return <Row key={ `${ row.rowClass }-${ i }`} className={ row.rowClass }>{
                    row.items.map((column, j) =>
                      <Column key={ `${ row.rowClass }-${ i }-${ row.columnClass }-${ j }`} className={ row.columnClass + ((j == 0) ? (' ' + styles.rowLabel) : '')}>{ column }</Column>
                    )
                  }</Row>
                }
              })}
            </div>
          }
        </div>
      </div>
    );
  }
}

BareDataGrid.defaultProps = {
  preview: false
}

BareDataGrid.propTypes = {
  data: PropTypes.array.isRequired,
  preview: PropTypes.bool
};
