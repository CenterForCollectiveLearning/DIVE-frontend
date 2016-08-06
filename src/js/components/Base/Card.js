import React, { Component, PropTypes } from 'react';

import styles from './Card.sass';

import HeaderBar from './HeaderBar';

export default class Card extends Component {
  render() {
    return (
      <div className={ styles.card }>
        { this.props.header &&
          <HeaderBar header={ this.props.header } textClassName={ styles.cardHeader }/>
        }
        { this.props.children }
      </div>
    );
  }
}

Card.propTypes = {
  header: PropTypes.any,
  children: PropTypes.node.isRequired
};
