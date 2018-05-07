import React, { Component, PropTypes } from 'react';
import styles from './SelectContainerBox.sass';

export default class SelectableBlock extends Component {
  handleClick() {
    this.props.onClick(this.props.value);
  }

  render() {
    return (
      <div
        className={
          styles.selectableBlock
          + (this.props.className ? ' ' + this.props.className : '')
          + (this.props.selected ? ' ' + styles.selected : '')
        }
        onClick={ this.handleClick.bind(this) }>
        { this.props.children }
      </div>
    );
  }
}

SelectableBlock.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  value: PropTypes.any,
  selected: PropTypes.bool
}

SelectableBlock.defaultProps = {
  selected: false
}
