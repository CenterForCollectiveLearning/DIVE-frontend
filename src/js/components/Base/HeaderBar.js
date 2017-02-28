import React, { Component, PropTypes } from 'react';

import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';
import { HELPER_TEXT } from './HelperText'
import styles from './HeaderBar.sass';

export default class HeaderBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showHelperText: false
    }
  }

  _showHoverText() {
    this.setState({ showHelperText: true });
  }

  _hideHoverText() {
    this.setState({ showHelperText: false });
  }


  render() {
    const { className, textClassName, header, subheader, actions, helperText } = this.props;
    const { showHelperText } = this.state;

    let popoverContent = (
      <div>
        <p>{ HELPER_TEXT[helperText] }</p>
      </div>
    );

    return (
      <div className={
        styles.headerBar
        + (className ? ' ' + className : '')
        + (header ? ' ' + styles.hasHeaderText : '')
      }>
        <h4 className={
          styles.headerText
          + (textClassName ? ' ' + textClassName : '')
          + (subheader ? '' : ' ' + styles.singleLine)
        }>
          { header }
          { subheader &&
            <div className={ styles.subheaderText }>
              { subheader }
            </div>
          }
        </h4>
        <div className={ styles.headerRightActions }>
          { helperText &&
            <Popover content={ popoverContent }
              interactionKind={ PopoverInteractionKind.HOVER_TARGET_ONLY }
              popoverClassName="pt-popover-content-sizing"
              position={ Position.LEFT }
              useSmartPositioning={ true }
              transitionDuration={ 100 }
              hoverOpenDelay={ 100 }
              hoverCloseDelay={ 100 }
            >
              <span
                className={'pt-icon pt-icon-help ' + styles.helperButton }
              />
           </Popover>
          }
        </div>
        <div className={ styles.pageRightActions } >
          { actions }
        </div>
      </div>
    );
  }
}

HeaderBar.propTypes = {
  header: PropTypes.any,
  subheader: PropTypes.any,
  actions: PropTypes.node,
  className: PropTypes.string,
  textClassName: PropTypes.string,
  helperText: PropTypes.string
};
