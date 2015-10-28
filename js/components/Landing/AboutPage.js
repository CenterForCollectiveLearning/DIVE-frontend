import React, { Component, PropTypes } from 'react';
import styles from './landing.sass';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import Tabs from '../Base/Tabs';
import Tab from '../Base/Tab';

var Logo = require('babel!svg-react!../../../assets/DIVE_logo_white.svg?name=Logo');

export class AboutPage extends Component {
  _onClickLogo(){
    this.props.pushState(null, `/`);
  }

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
            <div className={ styles.logoContainer } onClick={ this._onClickLogo.bind(this) }>
              <Logo className={ styles.logo } />
              <div className={ styles.logoText }>
                DIVE
              </div>
            </div>
            <Tabs className={ styles.landingTabs }>
              <Tab label="ABOUT" value="about" route="/about" className={ styles.landingTab } />
            </Tabs>
          </div>
          <div className={ styles.aboutContainer }>
            <div className={ styles.textBox }>
              <span><a href="/"><strong>DIVE</strong></a> automates data processing, lowering the barrier to understanding data so you can focus on interpreting results, not technical minutiae.</span>
            </div>
            <div className={ styles.separater }></div>
            <div className={ styles.textBox }>
              <span><a href="/"><strong>DIVE</strong></a> was created by <a target="_blank" href="https://twitter.com/KevinZengHu">Kevin Hu</a>, <a target="_blank" href="https://twitter.com/gurubavan">Guru Mahendran</a>, and <a target="_blank" href="https://twitter.com/cesifoti">César Hidalgo</a> in the <a target="_blank" href="http://macro.media.mit.edu">Macro Connections Group</a> at the <a target="_blank" href="http://media.mit.edu">MIT Media Lab</a>.</span>
            </div>
          </div>
          <div className={ styles.spacer }></div>
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

export default connect(mapStateToProps, { pushState })(AboutPage);
