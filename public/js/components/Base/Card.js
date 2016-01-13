import React, { Component, PropTypes } from 'react';

import styles from './Card.sass';

export default class Card extends Component {
  render() {
    return (
      <div className={ styles.card }>
        { this.props.children }
      </div>
    );
  }
}

Card.propTypes = {
  children: PropTypes.node.isRequired
};
