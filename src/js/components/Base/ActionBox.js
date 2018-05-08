import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './ActionBox.sass';

export default class ActionBox extends Component {
  render() {
    return (
      <div className={ styles.actionBox + (this.props.className ? ' ' + this.props.className : '') }>
        <div className={ styles.actionBoxHeader }>
          <h4>{ this.props.heading }</h4>
        </div>
        <div className={ styles.actionBoxContent + (this.props.contentClassName ? ' ' + this.props.contentClassName : '') }>
          { this.props.children }
        </div>
      </div>
    );
  }
}

ActionBox.propTypes = {
  heading: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  contentClassName: PropTypes.string
}

ActionBox.defaultProps = {
  heading: ""
}
