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
          + (this.props.buttonStyle ? ' ' + styles[this.props.buttonStyle] : '')
          + (this.props.primary ? ' ' + styles.primary : '')
          + (this.props.normalHeight ? ' ' + styles.normalHeight : '')
          + (this.props.fullWidth ? ' ' + styles.fullWidth : '')
          + (this.props.icon ? ' ' + styles.icon : '')
          + (this.props.active ? ' ' + styles.active : '')
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
  buttonStyle: PropTypes.string,
  onClick: PropTypes.func,
  primary: PropTypes.bool,
  normalHeight: PropTypes.bool,
  children: PropTypes.node,
  icon: PropTypes.bool,
  marginTop: PropTypes.bool,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  active: PropTypes.bool,
  minWidth: PropTypes.number,
  altText: PropTypes.any
}

RaisedButton.defaultProps = {
  label: "",
  buttonStyle: '',
  altText: null,
  primary: false,
  normalHeight: false,
  icon: false,
  className: "",
  fullWidth: false,
  disabled: false,
  active: false,
  marginTop: false,
  minWidth: 0
}
