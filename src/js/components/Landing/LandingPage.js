import React, { Component, PropTypes } from 'react';
import styles from './Landing.sass';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { logoutUser } from '../../actions/AuthActions'

import Link from '../Base/Link';
import HomePage from './HomePage';
import { wipeProjectState } from '../../actions/ProjectActions';

import Logo from '../../../assets/DIVE_logo_white.svg?name=Logo';


export class LandingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userOptionsOpen: true,
    };
  }

  componentWillMount() {
    const { user, push, wipeProjectState } = this.props;
    if (user.isAuthenticated) {
      // push('/projects')
    }
    // Wipe project on landing page
    wipeProjectState();
  }

  _onClickLogo(){
    this.props.push(`/`);
  }

  _getSelectedTab(){
    const tabList = ["/projects", "/about"];
    const _validTab = function (tabValue) {
      return tabList.indexOf(tabValue) > -1;
    }

    if ((this.props.routes.length > 2) && _validTab(this.props.routes[2].path)) {
      return this.props.routes[2].path;
    }
    return "";
  }

  openUserOptionsMenu = () => {
    this.setState({ userOptionsOpen: true });
  }

  closeUserOptionsMenu = () => {
    this.setState({ userOptionsOpen: false });
  }

  render() {
    const { user } = this.props;
    return (
      <DocumentTitle title='DIVE | Coming Soon'>
        <div className={ styles.fillContainer + ' ' + styles.landingPage }>
          <div className={ styles.background }>
          </div>
          <div className={ styles.landingPageContent + ( this.props.children ? ' ' + styles.landingPageProjects : ' ' + styles.landingPageHome) }>
            <div className={ styles.header }>
              <div className={ styles.logoContainer } onClick={ this._onClickLogo.bind(this) }>
                <div className={ styles.logoText }>
                  DIVE
                </div>
                <Logo className={ styles.logo } />
              </div>
              <div className={ styles.topRightControls }>
                <div className={ styles.linkContainer }>
                  <a className={ styles.link } href="https://staging.usedive.com">For Beta Testers</a>
                </div>
              </div>
            </div>
            <div className={ styles.centeredFill }>
              { this.props.children ||
                <HomePage />
              }
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

LandingPage.propTypes = {
  children: PropTypes.node
};

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}

export default connect(mapStateToProps, { wipeProjectState, push, logoutUser })(LandingPage);
