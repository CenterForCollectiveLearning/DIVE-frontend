import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './TextArea.sass';

export default class TextArea extends Component {
  render() {
    return (
      <textarea
        className={ styles.textarea
          + (this.props.className ? ' ' + this.props.className : '') }
        placeholder={ this.props.placeholder }
        onChange={ this.props.onChange }
        value={ this.props.value }/>
    );
  }
}

TextArea.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
}

TextArea.defaultProps = {
  placeholder: ""
}
