import React, { Component, PropTypes } from 'react';
import styles from './Landing.sass';

import MediaLabLogo from '../../../assets/MIT_ML_Logo_K_RGB.svg?name=MediaLabLogo';
import MacroConnectionsLogo from '../../../assets/MacroConnections_Logo_K_RGB.svg?name=MacroConnectionsLogo';

export default class Footer extends Component {
  render() {
    return (
      <div className={ styles.section + ' ' + styles.footer }>
        <div className={ styles.logos }>
          <a href="http://macro.media.mit.edu" target="_blank"><MacroConnectionsLogo className={ styles.macroConnectionsLogo } /></a>
          <a href="http://media.mit.edu" target="_blank"><MediaLabLogo className={ styles.mediaLabLogo } /></a>
        </div>
      </div>
    );
  }
}
