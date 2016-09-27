import React, { Component, PropTypes } from 'react';
import styles from './Landing.sass';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { logoutUser } from '../../actions/AuthActions'

import Link from '../Base/Link';
import HomePage from './HomePage';

import Logo from '../../../assets/DIVE_logo_white.svg?name=Logo';


export class LandingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userOptionsOpen: true,
    };
  }

  componentWillMount() {
    const { user, push } = this.props;
    if (user.isAuthenticated) {
      // push('/projects')
    }
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
      <DocumentTitle title='DIVE | Landing'>
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
                { user && user.username &&
                  <div className={ styles.linkContainer }>
                    <Link route="/preloaded">Preloaded Projects</Link>
                    <Link route="/projects">Your Projects</Link>
                    <div className={ styles.userOptions + ( this.state.userOptionsOpen ? ' ' + styles.open : '' )} >
                      <div className={ styles.usernameAndChevron }>
                        <span className={ styles.username }>{ user.username }</span>
                        { this.state.userOptionsOpen ? <span className={ styles.chevron }>&#65088;</span> : <span className={ styles.chevron }>&#65087;</span> }
                        <div className={ styles.userOptionsMenu }>
                          <Link route="/settings">Settings</Link>
                          <Link onClick={ this.props.logoutUser }>Sign Out</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                { (!user || !user.username) &&
                  <div className={ styles.linkContainer }>
                    <Link route="/login">Log In</Link>
                  </div>
                }
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

export default connect(mapStateToProps, { push, logoutUser })(LandingPage);
