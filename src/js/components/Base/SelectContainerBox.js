import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './SelectContainerBox.sass';

export default class SelectContainerBox extends Component {
  render() {
    return (
      <div className={ styles.selectContainerBox + (this.props.className ? ' ' + this.props.className : '') }>
        { this.props.children }
      </div>
    );
  }
}

SelectContainerBox.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}
