import React, { Component, PropTypes } from 'react';
import styles from './RaisedButton.sass';

export default class RaisedButton extends Component {
  render() {
    return (
      <div
        className={
          styles.raisedButton
          + ' ' + this.props.className
          + (this.props.primary ? ' ' + styles.primary : '')
          + (this.props.fullWidth ? ' ' + styles.fullWidth : '')
          + (this.props.icon ? ' ' + styles.icon : '')
        }
        onClick={ this.props.onClick }>
        { this.props.label &&
          <div>
            { this.props.label }
          </div>
        }
        { this.props.children }
      </div>
    );
  }
}

RaisedButton.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  primary: PropTypes.bool,
  children: PropTypes.node,
  icon: PropTypes.bool,
  className: PropTypes.string,
  fullWidth: PropTypes.bool
}

RaisedButton.defaultProps = {
  label: "",
  primary: false,
  icon: false,
  className: "",
  fullWidth: false
}
