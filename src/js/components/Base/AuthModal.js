import React, { Component, PropTypes } from 'react';
import baseStyles from './AuthModal.sass';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

import Logo from '../../../assets/DIVE_logo_white.svg?name=Logo';


export class AuthModal extends Component {
  constructor(props) {
    super(props);

    this.goHome = this.goHome.bind(this);
  }

  goHome(){
    this.props.push(`/`);
  }

  render() {
    const styles = this.props.styles ? this.props.styles : baseStyles;

    return (
      <div className={
        styles.blockingModalMask
        + (this.props.blackBackground ? ' ' + styles.blackBackground : '' )
      }>
        <div className={ styles.blockingModalContainer }>
          <div className={ styles.topBar }>
            <div className={ styles.backHome } onClick={ this.goHome }>
              Back to DIVE
            </div>
          </div>
          <div className={
            styles.blockingModal
            + ' ' + this.props.className
            + (this.props.scrollable ? ' ' + styles.scrollable : '')
            }>
            <div className={ styles.modalHeader }>
              { this.props.closeAction &&
                <div className={ styles.actions }>
                  <div className={ styles.closeAction } onClick={ this.props.closeAction }>&times;</div>
                </div>
              }
              <div className={ styles.modalHeader }>
                <div className={ styles.logoContainer } onClick={ this.goHome }>
                  <div className={ styles.logoText }>
                    DIVE
                  </div>
                  <Logo className={ styles.logo } />
                </div>
              </div>
            </div>
            <div className={ styles.modalContent }>
              { this.props.children }
            </div>
            { this.props.footer &&
              <div className={ styles.modalFooter }>
                <div className={ styles.separator } />
                { this.props.footer }
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

AuthModal.propTypes = {
  heading: PropTypes.node,
  footer: PropTypes.node,
  styles: PropTypes.any,
  className: PropTypes.string,
  closeAction: PropTypes.func,
  children: PropTypes.node,
  scrollable: PropTypes.bool,
  blackBackground: PropTypes.bool
}

AuthModal.defaultProps = {
  heading: "",
  styles: null,
  footer: null,
  className: "",
  closeAction: null,
  scrollable: false,
  className: '',
  blackBackground: false
}


function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
  push
})(AuthModal);
