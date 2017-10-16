import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Toolbar.sass';

export default class Toolbar extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  render() {
    return (
      <div className={ styles.toolbar
          + (this.props.className ? ' ' + this.props.className : '')
          + (this.props.foreground ? ' ' + styles.foreground : '')
        }>
        <div className={ styles.leftActions }>
          { this.props.children }
        </div>
        <div className={ styles.rightActions }>
          { this.props.rightActions }
        </div>
      </div>
    );
  }
}

Toolbar.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  rightActions: PropTypes.node,
  foreground: PropTypes.bool
};

Toolbar.defaultProps = {
  className: '',
  foreground: false
}

