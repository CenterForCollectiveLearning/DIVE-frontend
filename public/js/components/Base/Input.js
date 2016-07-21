import React, { Component, PropTypes } from 'react';
import styles from './Input.sass';

export default class Input extends Component {
  onInputKeyUp(e) {
    const ENTER_KEY_CODE = '13';
    if (e.keyCode == ENTER_KEY_CODE && this.props.onSubmit) {
      this.props.onSubmit();
    }
  }

  render() {
    return (
      <input
        autoComplete={ this.props.autocomplete }
        autoFocus={ this.props.autofocus }
        className={ styles.input
          + (this.props.large ? ' ' + styles.large : '')
          + (this.props.className ? ' ' + this.props.className : '') }
        type={ this.props.type }
        placeholder={ this.props.placeholder }
        onChange={ this.props.onChange }
        onKeyUp={ this.onInputKeyUp.bind(this) }
        readOnly={ this.props.readonly }
        value={ this.props.value }/>
    );
  }
}

Input.propTypes = {
  autocomplete: PropTypes.string,
  autofocus: PropTypes.bool,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  large: PropTypes.bool,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  value: PropTypes.string,
  readonly: PropTypes.bool
}

Input.defaultProps = {
  autocomplete: "off",
  large: false,
  type: "text",
  placeholder: ""
}
