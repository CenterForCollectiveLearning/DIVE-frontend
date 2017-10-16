import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import styles from './Datasets.sass';

export default class DatasetRow extends Component {
  render() {
    const { data } = this.props;
    const { items, rowType } = data;

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
      <Row className={ styles.row + ' ' + styles[rowType] }>
        { items && items.map((column, i) =>
          <Cell key={ `dataset-cell-${ i }` } className={ styles.cell + ' ' + styles[column.columnType] }>
            { column.value }
          </Cell>
        )}
      </Row>
    );
  }
}

DatasetRow.propTypes = {
  data: PropTypes.object.isRequired
}

DatasetRow.defaultProps = {
  data: {}
}
