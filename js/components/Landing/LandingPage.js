import React, { Component, PropTypes } from 'react';
import styles from './landing.sass';
import { connect } from 'react-redux';
import { fetchPreloadedProjects } from '../../actions/ProjectActions.js';

import RaisedButton from '../Base/RaisedButton';

import Tabs from '../Base/Tabs';
import Tab from '../Base/Tab';

var Logo = require('babel!svg-react!../../../assets/DIVE_logo_white.svg?name=Logo');

export class LandingPage extends Component {

  constructor(props) {
    super(props);

    this._handleTabsChange = this._handleTabsChange.bind(this);
  }

  componentWillMount() {
    if (this.props.projects.items.length == 0) {
      this.props.fetchPreloadedProjects();
    }
  }

  _handleTabsChange(tab){
    this.props.pushState(null, `/${tab.props.route}`);
  }

  _getSelectedTab(){
    const tabList = ["team", "about", "login"];
    const _validTab = function (tabValue) {
      return tabList.indexOf(tabValue) > -1;
    }

    if ((this.props.routes.length > 2) && _validTab(this.props.routes[2].path)) {
      return this.props.routes[2].path;
    }
    return "";
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
          <div className={styles.header}>
            <div className={styles.logoContainer} href="/">
              <Logo className={styles.logo} />
              <div className={styles.logoText}>
                DIVE
              </div>
            </div>
            <Tabs
              value={ this._getSelectedTab() }
              onChange={ this._handleTabsChange.bind(this) }
              className={ styles.landingTabs }>
              <Tab label="ABOUT" value="about" route="about" className={ styles.landingTab } />
              <Tab label="LOGIN" value="login" route="login" className={ styles.landingTab } />
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
              <div className={ styles.secondaryCopy }>Or explore our preloaded projects:</div>
            </div>
            <div className={ styles.projectListContainer }>
              { this.props.projects.items.map((project) =>
                <a key={ `project-button-id-${ project.id }` } href={ `/projects/${ project.id }/visualize` } className={ styles.projectButton }>{ project.title }</a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LandingPage.propTypes = {
  children: PropTypes.node
};

function mapStateToProps(state) {
  const { projects } = state;
  return { projects };
}

export default connect(mapStateToProps, { fetchPreloadedProjects })(LandingPage);
