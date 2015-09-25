import React, { Component, PropTypes } from 'react';
import styles from './base.sass';

export default class RaisedButton extends Component {
  render() {
    return (
      <div
        className={ styles.raisedButton + (this.props.primary ? ' ' + styles.primary : '') }
        onClick={ this.props.onClick }>
        <div className={ styles.label }>
          { this.props.label }
        </div>
      </div>
    );
  }
}

RaisedButton.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  primary: PropTypes.bool
}
