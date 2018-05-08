import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';

import styles from './Sidebar.sass';

import { HELPER_TEXT } from './HelperText'

export default class SidebarCategoryGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: props.initialCollapse,
      showHelperText: false
    }
  }

  _showHoverText() {
    this.setState({ showHelperText: true });
  }

  _hideHoverText() {
    this.setState({ showHelperText: false });
  }

  onClickCollapse() {
    this.setState({
        collapsed: !this.state.collapsed
    });
  }

  render() {
    const { className, helperText, helperTextPosition, iconName, collapsable, initialCollapse, rightAction } = this.props;
    const { collapsed, showHelperText } = this.state;

    let popoverContent = (
      <div>
        <p>{ HELPER_TEXT[helperText] }</p>
      </div>
    );

    return (
      <div className={ styles.sidebarGroup + ' ' +
        styles.sidebarCategoryGroup +
        ( collapsed ? (' ' + styles.collapsed) : '')
      }>
        { this.props.heading &&
          <div className={ styles.sidebarGroupHeading + ' ' + styles.sidebarCategoryGroupHeading } onClick={ this.onClickCollapse.bind(this) }>
            <span className={ styles.headingName }>{ iconName && <span className={ `pt-icon-standard pt-icon-${ iconName } ` + styles.icon }  />} { this.props.heading }</span>
              <div className={ styles.pullRight }>
              { helperText &&
                <Popover content={ popoverContent }
                  interactionKind={ PopoverInteractionKind.HOVER }
                  popoverClassName="pt-popover-content-sizing"
                  position={ helperTextPosition }
                  useSmartPositioning={ false }
                  useSmartArrowPositioning={ true }
                  transitionDuration={ 100 }
                  hoverOpenDelay={ 100 }
                  hoverCloseDelay={ 100 }
                >
                  <span className={ 'pt-icon-standard pt-icon-help ' + styles.helperButton } />
               </Popover>
              }
              { rightAction && <span className={ styles.rightAction }>{ rightAction }</span> }
              { collapsable && <span className={ styles.collapseArrow }/> }
            </div>
          </div>
        }
        <div className={ styles.sidebarGroupContent + ' ' + styles.sidebarCategoryGroupContent + ' ' +
          ( this.props.className ? (' ' + this.props.className) : '') +
          (this.props.stacked ? ' ' + styles.stacked : '')
        }>
          { this.props.children }

        </div>
      </div>
    );
  }
}

SidebarCategoryGroup.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  heading: PropTypes.string,
  helperText: PropTypes.string,
  helperTextPosition: PropTypes.number,
  initialCollapse: PropTypes.bool,
  collapsable: PropTypes.bool,
  iconName: PropTypes.string,
  rightAction: PropTypes.node
};

SidebarCategoryGroup.defaultProps = {
  className: "",
  heading: "",
  helperTextPosition: Position.LEFT,
  initialCollapse: false,
  collapsable: true
}
