import React, { Component, PropTypes } from 'react';
import styles from './base.sass';

export default class ActionBox extends Component {
  render() {
    return (
      <div className={ styles.actionBox }>
        <div className={ styles.actionBoxHeader }>
          <h4>{ this.props.heading }</h4>
        </div>
        <div className={ styles.actionBoxContent }>
          { this.props.children }
        </div>
      </div>
    );
  }
}

ActionBox.propTypes = {
  heading: PropTypes.string,
  children: PropTypes.node,
}

ActionBox.defaultProps = {
  heading: "",
}
