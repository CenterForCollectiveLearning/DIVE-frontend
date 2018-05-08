import React, { Component, PropTypes } from 'react';

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
