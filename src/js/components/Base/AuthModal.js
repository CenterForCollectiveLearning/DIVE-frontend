import React, { Component, PropTypes } from 'react';
import baseStyles from './AuthModal.sass';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

import { Button, Classes, Dialog } from '@blueprintjs/core';

import Logo from '../../../assets/DIVE_logo_white.svg?name=Logo';

import RaisedButton from './RaisedButton';
import Input from './Input';
import TextArea from './TextArea';

export class AuthModal extends Component {
  constructor(props) {
    super(props);

    this.goHome = this.goHome.bind(this);
  }

  goHome(){
    this.props.push(`/`);
  }

  render() {
    const { closeAction, isOpen, titleText, authType, footer, className } = this.props;
    const styles = this.props.styles ? this.props.styles : baseStyles;

    return (
      <Dialog
        className={ className }
        isOpen={ isOpen }
        canOutsideClickClose={ false }
        hasBackdrop={ true }
        backdropClassName={ styles.blockingModalMask + ' ' + styles.blackBackground }
      >
        <div className={ Classes.DIALOG_HEADER }>
          <span className={ "pt-icon-large " + ( authType == 'login' ? "pt-icon-log-in" : "pt-icon-user") }/>
          <h5>{ this.props.titleText }</h5>
          <Button
            className={ "pt-minimal " + styles.backButton }
            iconName="undo"
            onClick={ closeAction }
          />
        </div>
        <div className={ Classes.DIALOG_BODY }>
          { this.props.children }
        </div>
        { footer &&
          <div className={ Classes.DIALOG_FOOTER }>
            <div className={ styles.separator } />
            { footer }
          </div>
        }
      </Dialog>
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
  blackBackground: PropTypes.bool,
  isOpen: PropTypes.bool,
  authType: PropTypes.string
}

AuthModal.defaultProps = {
  heading: "",
  styles: null,
  footer: null,
  className: "",
  closeAction: null,
  scrollable: false,
  className: '',
  blackBackground: false,
  isOpen: false,
  authType: 'login'
}


function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
  push
})(AuthModal);
