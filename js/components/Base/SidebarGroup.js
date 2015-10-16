import React, { Component, PropTypes } from 'react';

import styles from './Sidebar.sass';

export default class SidebarGroup extends Component {
  render() {
    return (
      <div className={ styles.sidebarGroup }>
        <h3 className={ styles.sidebarGroupHeading }>{ this.props.heading }</h3>
        <div className={ styles.sidebarGroupContent}>
          { this.props.children }
        </div>
      </div>
    );
  }
}

SidebarGroup.propTypes = {
  children: PropTypes.node,
  heading: PropTypes.string
};

SidebarGroup.defaultProps = {
  heading: ""
}
