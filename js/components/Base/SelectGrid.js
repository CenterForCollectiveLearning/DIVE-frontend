import React, { Component, PropTypes } from 'react';
import styles from './SelectGrid.sass';

export default class SelectGrid extends Component {
  render() {
    return (
      <div className={ styles.selectGrid + (this.props.className ? ' ' + this.props.className : '') }>
        { this.props.items.map((item) =>
          <div title={ item.name } className={ styles.gridElement }>
            <input type="checkbox" checked={ item.selected }/>
            <label>{ item.name }</label>
          </div>
        )}
      </div>
    );
  }
}

SelectGrid.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array.isRequired
}
