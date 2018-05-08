import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Landing.sass';

import MediaLabLogo from '../../../assets/ML_logo.svg?name=MediaLabLogo';
import CollectiveLearningLogo from '../../../assets/CL_logo.svg?name=CollectiveLearningLogo';

export default class Footer extends Component {
  render() {
    return (
      <div className={ styles.section + ' ' + styles.footer }>
        <div className={ styles.logos }>
          <a href="http://macro.media.mit.edu" target="_blank"><CollectiveLearningLogo className={ styles.collectiveLearningLogo } /></a>
          <a href="http://media.mit.edu" target="_blank"><MediaLabLogo className={ styles.mediaLabLogo } /></a>
        </div>
      </div>
    );
  }
}
