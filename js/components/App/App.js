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
