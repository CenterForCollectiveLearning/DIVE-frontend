import React, { Component, PropTypes } from 'react';

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
        <div className={ styles.headerRightActions }>
          { helperText &&
            <i
              onMouseOut={ this._hideHoverText.bind(this) }
              onMouseOver={ this._showHoverText.bind(this) }
              className={'fa fa-question-circle' + ' ' + styles.helperButton }
            />
          }
          { helperText && showHelperText &&
            <div className={ styles.helperText }>{ HELPER_TEXT[helperText] }</div>
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
