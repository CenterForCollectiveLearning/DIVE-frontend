import React, { PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import styles from './app.sass';

import { Link } from 'react-router';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

require("font-awesome-webpack");
// this seems real dumb;
require('react-select/less/select.less');
require('../../../css/react-select.less');
require('../../../css/plottable.less');
require('../../../css/griddle.less');

export class App extends BaseComponent {
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.user.loaded !== this.props.user.loaded) {
  //     this.props.createAnonymousUserIfNeeded();
  //     this.props.createProjectIfNeeded('Project Title', 'Description', 'Anonymous User');
  //   }
  //   if (nextProps.project.properties.id !== this.props.project.properties.id) {
  //     if (this.props.routes.length < 2) {
  //       this.props.pushState(null, `/projects/${nextProps.project.properties.id}/datasets/upload`);
  //     }
  //   }
  // }

  render() {
    return (
      <div className={ styles.fillContainer }>
        { this.props.children }
      </div>
    );
  }
}

App.propTypes = {
  pushState: PropTypes.func.isRequired,
  user: PropTypes.object,
  children: PropTypes.node
};

function mapStateToProps(state) {
  const { user } = state;
  return {
    user: user
  };
}

export default connect(mapStateToProps, { pushState })(App);
