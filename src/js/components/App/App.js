import React, { Component, PropTypes } from 'react';
import styles from './App.sass';
import { push } from 'react-router-redux';

import { createAnonymousUserIfNeeded, deleteAnonymousData, clearCookies } from '../../actions/UserActions';
import { connect } from 'react-redux';

// this seems real dumb;
require('react-select/less/select.less');
require('../../../css/app.less');
require('../../../css/griddle.less');

export class App extends Component {
  constructor(props) {
    super(props);

    if (!this.props.user.id) {
      this.props.createAnonymousUserIfNeeded();
    }
  }

  componentDidMount() {
    window.onbeforeunload = this.onUnload;
  }

  componentWillUnmount() {
    window.onbeforeunload = null;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.user.id && !nextProps.user.id) {
      this.props.createAnonymousUserIfNeeded();
    }
  }

  onUnload = () => {
    const { user, deleteAnonymousData } = this.props;
    if ( user.anonymous ) {
      clearCookies();
      deleteAnonymousData(user.id);
    }
  }

  render() {
    return (
      <div className={ styles.fillContainer + ' ' + styles.appContainer }>
        { this.props.children }
      </div>
    );
  }
}

App.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node
};

function mapStateToProps(state) {
  const { user } = state;
  return {
    user: user
  };
}

export default connect(mapStateToProps, { createAnonymousUserIfNeeded, deleteAnonymousData, clearCookies, push })(App);
