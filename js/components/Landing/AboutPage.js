import React, { Component, PropTypes } from 'react';
import styles from './landing.sass';
import { connect } from 'react-redux';

import Tabs from '../Base/Tabs';
import Tab from '../Base/Tab';

var Logo = require('babel!svg-react!../../../assets/DIVE_logo_white.svg?name=Logo');

export class AboutPage extends Component {
  render() {
    return (
      <div className={ styles.fillContainer + ' ' + styles.landingPage }>
        <div className={ styles.background }>
          <div className={ styles.innerBackground }>
            <div className={ styles.grid }></div>
          </div>
        </div>
        <div className={ styles.fillContainer + ' ' + styles.landingPageContent }>
          <div className={ styles.header }>
            <div className={ styles.logoContainer } href="/">
              <Logo className={ styles.logo } />
              <div className={ styles.logoText }>
                DIVE
              </div>
            </div>
            <Tabs className={ styles.landingTabs }>
              <Tab label="ABOUT" value="about" route="about" className={ styles.landingTab } />
            </Tabs>
          </div>
          <div className={ styles.ctaBox }>
            <div className={ styles.primaryCopy }>
              <span>Stop Processing Data and Start <strong>Understanding It</strong></span>
            </div>
            <div className={ styles.secondaryCopy }>
              Merge and query datasets, conduct statistical analyses, and explore
              automatically generated visualizations within seconds.
            </div>
            <div className={ styles.ctaContainer }>
              <RaisedButton
                label="Upload Dataset"
                primary={ true }
                onClick={ this.onOpenClick }
                className={ styles.uploadButton } />
            </div>
          </div>
          <div className={ styles.separater }></div>
          <div className={ styles.preloaded }>
            <div className={ styles.flexbox }>
              <div className={ styles.secondaryCopy + ' ' + styles.emphasis }>Or explore our preloaded projects:</div>
            </div>
            <div className={ styles.projectListContainer }>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AboutPage.propTypes = {
  children: PropTypes.node
};

function mapStateToProps(state) {
  return {  };
}

export default connect(mapStateToProps, { })(AboutPage);
