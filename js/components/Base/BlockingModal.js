import React, { Component, PropTypes } from 'react';
import styles from './BlockingModal.sass';

export default class BlockingModal extends Component {
  render() {
    return (
      <div className={ styles.blockingModalMask }>
        <div className={ styles.blockingModalContainer }>
          <div className={ styles.blockingModal }>
            <div className={ styles.modalHeader }>
              <span>{ this.props.heading }</span>
            </div>
            <div className={ styles.modalContent }>
              { this.props.children }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

BlockingModal.propTypes = {
  heading: PropTypes.node,
  children: PropTypes.node
}

BlockingModal.defaultProps = {
  heading: "",
}
