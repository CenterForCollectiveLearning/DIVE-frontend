import React, { Component, PropTypes } from 'react';
import styles from './base.sass';

export default class Tab extends Component {
  handleClick() {

  }
  render() {
    return (
      <div
        className={ styles.tab + (this.props.selected ? ' ' + styles.selected : '')}
        onClick={this.props.onClick}>
        { this.props.label }
      </div>
    );
  }
}

Tab.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  route: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func
}

Tab.defaultProps = {
  selected: false,
  route: null
}
