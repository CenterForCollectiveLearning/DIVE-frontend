import React, { Component } from 'react';
import PropTypes from 'prop-types';
import baseStyles from './AuthModal.sass';
import { push, goBack } from 'react-router-redux';
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

  goHome = () => {
    this.props.push(`/`);
  }

  goBack = () => {
    this.props.goBack();
  }

  render() {
    const { closeAction, isOpen, titleText, iconName, footer, className } = this.props;
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
          <span className={ "pt-icon-large pt-icon-" + iconName }/>
          <h5>{ this.props.titleText }</h5>
          <div className={ styles.rightButtons }>
            <Button
              className={ "pt-minimal" }
              iconName="undo"
              onClick={ this.goBack }
            />
            <Button
              className={ "pt-minimal" }
              iconName="home"
              onClick={ this.goHome }
            />
          </div>
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
  iconName: PropTypes.string
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
  iconName: 'log-in'
}


function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
  push,
  goBack
})(AuthModal);
