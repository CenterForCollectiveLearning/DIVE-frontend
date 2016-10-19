import React, { Component, PropTypes } from 'react';

import styles from './Loader.sass';
import RaisedButton from './RaisedButton';

export default class Loader extends Component {

  onRefresh = () => {
    location.reload();
  }

  render() {
    const { text, error } = this.props;
    const parsedText = (Array.isArray(text)) ? text[0] : text;
    return (
      <div className={ styles.loader }>
        { !error && <div className={ styles.square }/> }
        { error &&
          <RaisedButton label="Refresh DIVE" primary={ true } onClick={ this.onRefresh } />
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
