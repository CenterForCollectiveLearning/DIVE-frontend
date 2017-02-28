import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';

import styles from './Sidebar.sass';

import { HELPER_TEXT } from './HelperText'

export default class SidebarGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
      showHelperText: false
    }
  }

  _showHoverText = () => {
    this.setState({ showHelperText: true });
  }

  _hideHoverText = () => {
    this.setState({ showHelperText: false });
  }

  onClickCollapse = () => {
    this.setState({
        collapsed: !this.state.collapsed
    });
  }

  render() {
    const { className, helperText, helperTextPosition, collapsable, rightAction } = this.props;
    const { collapsed, showHelperText } = this.state;

    const noop = () => {};

    let popoverContent = (
      <div>
        <p>{ HELPER_TEXT[helperText] }</p>
      </div>
    );

    return (
      <div className={ styles.sidebarGroup +
        ( collapsed ? (' ' + styles.collapsed) : '')
      }>
        { this.props.heading &&
          <div className={ styles.sidebarGroupHeading } onClick={ collapsable ? this.onClickCollapse : noop}>
            <span className={ styles.headingName }>{ this.props.heading }</span>
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
                  <i
                    className={'fa fa-question-circle' + ' ' + styles.helperButton }
                  />
               </Popover>
              }
              { rightAction && <span className={ styles.rightAction }>{ rightAction }</span> }
              { collapsable && <span className={ styles.collapseArrow }/> }
            </div>
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
  heading: PropTypes.string,
  helperText: PropTypes.string,
  helperTextPosition: PropTypes.number,
  initialCollapse: PropTypes.bool,
  collapsable: PropTypes.bool,
  rightAction: PropTypes.node
};

SidebarGroup.defaultProps = {
  className: "",
  heading: "",
  helperTextPosition: Position.LEFT,
  collapsable: false
}
