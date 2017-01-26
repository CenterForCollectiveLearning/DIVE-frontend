import React, { Component, PropTypes } from 'react';

import styles from './Loader.sass';

export default class Loader extends Component {

  onRefresh = () => {
    location.reload();
  }

  render() {
    const { text, error } = this.props;
    const parsedText = (Array.isArray(text)) ? text[0] : text;
    return (
      <div className={ styles.loader }>
        { !error && <div className="pt-spinner pt-medium pt-intent-primary">
          <div className="pt-spinner-svg-container">
            <svg viewBox="0 0 100 100">
              <path className="pt-spinner-track" d="M 50,50 m 0,-44.5 a 44.5,44.5 0 1 1 0,89 a 44.5,44.5 0 1 1 0,-89"></path>
              <path className="pt-spinner-head" d="M 94.5 50 A 44.5 44.5 0 0 0 50 5.5"></path>
            </svg>
          </div>
        </div> }
        { error &&
          <button
            type="button"
            className={ `${ styles.refreshButton } pt-button pt-intent-primary pt-large pt-icon-refresh` }
            onClick={ this.onRefresh }>
            Refresh DIVE
          </button>
        }
        { text &&
          <div className={ styles.text }>{ text }</div>
        }
      </div>
    );
  }
}

Loader.propTypes = {
  text: PropTypes.any,
  error: PropTypes.bool
};

Loader.defaultProps = {
  text: '',
  error: false
}
