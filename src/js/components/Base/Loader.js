import React, { Component, PropTypes } from 'react';

import styles from './Loader.sass';

export default class Loader extends Component {
  render() {
    const { text } = this.props;
    const parsedText = (Array.isArray(text)) ? text[0] : text;
    return (
      <div className={ styles.loader }>
        <div className={ styles.square }/>
        { text &&
          <div className={ styles.text }>{ text }</div>
        }
      </div>
    );
  }
}

Loader.propTypes = {
  text: PropTypes.any
};

Loader.defaultProps = {
  text: ''
}
