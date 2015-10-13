import React, { Component, PropTypes } from 'react';
import styles from './base.sass';

export default class Loader extends Component {
  render() {
    console.log("Loaded:", this.props.loaded);
    return (
      <div className={ styles.fillContainer }>
        {
          !this.props.loaded &&
          <div className={ styles.loader }>{ this.props.label }</div>
        }
      </div>
    );
  }
}

Loader.propTypes = {
  loaded: PropTypes.bool.isRequired,
  label: PropTypes.string,
}

Loader.defaultProps = {
  label: ""
}
