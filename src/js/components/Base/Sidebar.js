import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './Sidebar.sass';

export default class Sidebar extends Component {
  render() {
    return (
      <div className={ styles.sidebar + ' ' + this.props.className }>
        { this.props.children }
      </div>
    );
  }
}

Sidebar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
