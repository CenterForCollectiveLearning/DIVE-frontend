import React, { Component, PropTypes } from 'react';

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
    const { data, id, tableClassName, containerClassName } = this.props;

    const columnWidth = 200;
    const minimumColumnWidth = 105;

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
              { data.map((row, i) =>
                <Row key={ `${ row.rowClass }-${ i }`} className={ row.rowClass }>{
                  row.items.map((column, j) =>
                    <Column key={ `${ row.rowClass }-${ i }-${ row.columnClass }-${ j }`} className={ row.columnClass }>{ column }</Column>
                  )
                }</Row>
              )}
            </div>
          }
        </div>
      </div>
    );
  }
}

BareDataGrid.propTypes = {
  data: PropTypes.array.isRequired
};
