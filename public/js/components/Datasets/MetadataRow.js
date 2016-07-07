import React, { Component, PropTypes } from 'react';
import _ from 'underscore';

import styles from './Datasets.sass';

export default class MetadataRow extends Component {
  render() {
    const { data } = this.props;
    const { items, rowType } = data;

    console.log(data);
    console.log(items, rowType);

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

MetadataRow.propTypes = {
  data: PropTypes.object.isRequired
}

MetadataRow.defaultProps = {
  data: {}
}
