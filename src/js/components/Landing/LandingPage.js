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
      opaqueNavbar: false
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

  _onClickLogo = () => {
    this.props.push(`/`);
  }

  _getSelectedTab = () => {
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

  _handleScroll = (e) => {
    const scrollThreshold = 200;
    this.setState({ opaqueNavbar: (e.target.scrollTop > scrollThreshold) });
  }

  render() {
    const { user, location } = this.props;
    const onLandingPage = (location.pathname == '/');

    return (
      <DocumentTitle title='DIVE | Landing'>
        <div className={ styles.fillContainer + ' ' + styles.landingPage } onScroll={ this._handleScroll }>
          <div className={ styles.background } />
          <div
            className={ styles.landingPageContent + ( this.props.children ? ' ' + styles.landingPageProjects : ' ' + styles.landingPageHome) }
          >
          <nav className={ 'pt-navbar pt-dark pt-fixed-top ' + styles.header + ( onLandingPage ? ( this.state.opaqueNavbar ? ' ' + styles.opaque : '') : ' ' + styles.opaque) }>
            <div className="pt-navbar-group pt-align-left">
              <div className={ 'pt-navbar-heading ' + styles.logoContainer } onClick={ this._onClickLogo }>
                <Logo className={ styles.logo } />
                <div className={ styles.logoText }>DIVE</div>
              </div>
            </div>
              <div className="pt-navbar-group pt-align-right">
                { user && user.username &&
                  <div>
                    <Link className="pt-button pt-minimal pt-icon-projects" route="/projects">Projects</Link>
                    <span className="pt-navbar-divider"></span>
                    <div className="pt-button pt-minimal pt-icon-log-out" onClick={ this.props.logoutUser }>Log Out</div>
                  </div>
                }
                { (!user || !user.username) &&
                  <Link className="pt-button pt-minimal pt-icon-log-in" route="/login">Log In</Link>
                }
              </div>
            </nav>
            <div className={ styles.centeredFill }>
              { this.props.children || <HomePage /> }
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
