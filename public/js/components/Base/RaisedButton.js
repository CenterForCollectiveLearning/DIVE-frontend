import React, { Component, PropTypes } from 'react';
import styles from './RaisedButton.sass';

export default class RaisedButton extends Component {
  render() {
    const style = {
      minWidth: this.props.minWidth
    };

    return (
      <div
        title={ this.props.altText }
        style={ style }
        className={
          styles.raisedButton
          + ' ' + this.props.className
          + (this.props.primary ? ' ' + styles.primary : '')
          + (this.props.fullWidth ? ' ' + styles.fullWidth : '')
          + (this.props.icon ? ' ' + styles.icon : '')
          + (this.props.disabled ? ' ' + styles.disabled : '')
          + (this.props.marginTop ? ' ' + styles.marginTop : '')
          + (this.props.centered ? ' ' + styles.centered : '')
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
  marginTop: PropTypes.bool,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  minWidth: PropTypes.number,
  altText: PropTypes.any
}

RaisedButton.defaultProps = {
  label: "",
  altText: null,
  primary: false,
  icon: false,
  className: "",
  fullWidth: false,
  disabled: false,
  marginTop: false,
  minWidth: 0
}
