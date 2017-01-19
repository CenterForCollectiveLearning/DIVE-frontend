import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { createProject } from '../../actions/ProjectActions.js';
import styles from '../App/App.sass';

import { Button, Classes, Dialog, Tooltip } from '@blueprintjs/core';

import RaisedButton from './RaisedButton';
import Input from './Input';
import TextArea from './TextArea';

class ProjectCreateModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectTitle: this.props.projectTitle,
      projectDescription: this.props.projectDescription
    };
  }

  submit = () => {
    const { createProject, closeAction, userId } = this.props;
    const { projectTitle, projectDescription } = this.state;

    createProject(userId, projectTitle, projectDescription);
    closeAction();
  }

  enteredProjectNameInput(event) {
    this.setState({ projectTitle: event.target.value });
  }

  enteredProjectDescriptionInput(event) {
    this.setState({ projectDescription: event.target.value });
  }

  render() {
    const { closeAction } = this.props;
    const { projectTitle, projectDescription } = this.state;

    return (
      <Dialog
        onClose={ this.props.closeAction }
        title="Dialog header"
        { ...this.state }
      >
        <div className={ Classes.DIALOG_BODY }>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna alqua.
        </div>
        <div className={ Classes.DIALOG_FOOTER }>
            <div className={ Classes.DIALOG_FOOTER_ACTIONS }>
                <Button>Secondary</Button>
                <Button className="pt-intent-primary" onClick={this.handleClose}>Primary</Button>
            </div>
        </div>
      </Dialog>
    );


    // return (
    //   <div className="pt-dialog">
    //     <div className="pt-dialog-header">
    //       <span className="pt-icon-large pt-icon-inbox"></span>
    //       <h5>Create a project</h5>
    //       <button aria-label="Close" className="pt-dialog-close-button pt-icon-small-cross" onClick={ this.props.closeAction }></button>
    //     </div>
    //     <div className="pt-dialog-body">
    //     <div className={ styles.fillContainer }>
    //       <div className={ styles.controlSection }>
    //         <div className={ styles.label }>Title</div>
    //         <Input
    //           type="text"
    //           placeholder={ projectTitle }
    //           autofocus={ true }
    //           onChange={ this.enteredProjectNameInput.bind(this) }/>
    //       </div>
    //       <div className={ styles.controlSection }>
    //         <div className={ styles.label }>Description</div>
    //         <TextArea
    //           type="textarea"
    //           placeholder={ projectDescription }
    //           onChange={ this.enteredProjectDescriptionInput.bind(this) }/>
    //       </div>
    //     </div>
    //     </div>
    //     <div className="pt-dialog-footer">
    //       <div className="pt-dialog-footer-actions">
    //         <button type="button" className="pt-button" onClick={ closeAction }>Cancel</button>
    //         <button type="submit" className="pt-button pt-intent-primary" onClick={ this.submit }>Create</button>
    //       </div>
    //     </div>
    //   </div>
    // );
  }
}

ProjectCreateModal.propTypes = {
  userId: PropTypes.number.isRequired,
  projectTitle: PropTypes.string,
  projectDescription: PropTypes.string,
  closeAction: PropTypes.func
};

ProjectCreateModal.defaultProps = {
  projectTitle: 'Project Title',
  projectDescription: 'Project Description'
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { createProject })(ProjectCreateModal);
