import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import styles from './Compose.sass';

import Sidebar from '../Base/Sidebar';
import SidebarGroup from '../Base/SidebarGroup';

export class ComposeSidebar extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    return (
      <Sidebar>
      </Sidebar>
    );
  }
}

ComposeSidebar.propTypes = {
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
  pushState
})(ComposeSidebar);
