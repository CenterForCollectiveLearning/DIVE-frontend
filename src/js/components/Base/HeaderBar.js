import React, { Component, PropTypes } from 'react';

import styles from './HeaderBar.sass';

export default class HeaderBar extends Component {
  render() {
    const { className, textClassName, header, subheader, actions } = this.props;

    return (
      <div className={
        styles.headerBar
        + (className ? ' ' + className : '')
        + (header ? ' ' + styles.hasHeaderText : '')
      }>
        <div className={
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
        </div>
        <div className={ styles.rightActions } >
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
  textClassName: PropTypes.string
};
