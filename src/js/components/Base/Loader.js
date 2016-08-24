import React, { Component, PropTypes } from 'react';

import styles from './Loader.sass';

export default class Loader extends Component {
  render() {
    const { text } = this.props;
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
  text: PropTypes.string
};

Loader.defaultProps = {
  text: ''
}
