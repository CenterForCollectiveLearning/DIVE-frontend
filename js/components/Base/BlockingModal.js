import React, { Component, PropTypes } from 'react';
import baseStyles from './BlockingModal.sass';

export default class BlockingModal extends Component {
  render() {
    const styles = this.props.styles ? this.props.styles : baseStyles; 
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
  styles: PropTypes.any,
  children: PropTypes.node
}

BlockingModal.defaultProps = {
  heading: "",
  styles: null
}
