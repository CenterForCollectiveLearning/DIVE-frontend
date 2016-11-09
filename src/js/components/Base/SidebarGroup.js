import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from './Sidebar.sass';

export default class SidebarGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false
    }
  }

  onClickCollapse() {
    this.setState({
        collapsed: !this.state.collapsed
    });
  }

  render() {
    const { collapsed } = this.state;
    return (
      <div className={ styles.sidebarGroup +
        ( collapsed ? (' ' + styles.collapsed) : '')
      }>
        { this.props.heading &&
          <div className={ styles.sidebarGroupHeading } onClick={ this.onClickCollapse.bind(this) }>
            <span className={ styles.headingName }>{ this.props.heading }</span>
            <span className={ styles.collapseArrow }/>
          </div>
        }

        <div className={ styles.sidebarGroupContent +
          ( this.props.className ? (' ' + this.props.className) : '') +
          (this.props.stacked ? ' ' + styles.stacked : '')
        }>
          { this.props.children }
        </div>
      </div>
    );
  }
}

SidebarGroup.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  heading: PropTypes.string
};

SidebarGroup.defaultProps = {
  className: "",
  heading: ""
}
