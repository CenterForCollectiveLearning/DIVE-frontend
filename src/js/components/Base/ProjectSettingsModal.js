import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { updateProject, deleteProject } from '../../actions/ProjectActions.js';
import styles from '../App/App.sass';

import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';

import RaisedButton from './RaisedButton';
import Input from './Input';
import TextArea from './TextArea';

class ProjectSettingsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectName: this.props.projectName,
      projectDescription: this.props.projectDescription
    };
  }

  submit = () => {
    const { projectId, updateProject, closeAction } = this.props;
    const { projectName, projectDescription } = this.state;

    updateProject(projectId, { title: projectName, description: projectDescription });
    closeAction();
  }

  enteredProjectNameInput = (event) => {
    this.setState({ projectName: event.target.value });
  }

  enteredProjectDescriptionInput = (event) => {
    this.setState({ projectDescription: event.target.value });
  }

  onClickDeleteProject = () => {
    const { projectId, deleteProject } = this.props;
    deleteProject(projectId);
  }

  render() {
    const { closeAction, isOpen } = this.props;
    const { projectName, projectDescription } = this.state;

    return (
      <Dialog
        onClose={ closeAction }
        title='Edit Project Settings'
        isOpen={ isOpen }
      >
        <div className={ Classes.DIALOG_BODY }>
           <div className={ styles.controlSection }>
              <div className={ styles.label }>Title</div>
              <Input
                type="text"
                placeholder={ projectName }
                autofocus={ true }
                value={ projectName }
                onChange={ this.enteredProjectNameInput }/>
            </div>
            <div className={ styles.controlSection }>
              <div className={ styles.label }>Description</div>
              <TextArea
                className='pt-input pt-fill'
                type="textarea"
                placeholder={ projectDescription }
                value={ projectDescription }
                onChange={ this.enteredProjectDescriptionInput }/>
            </div>
        </div>
        <div className={ Classes.DIALOG_FOOTER }>
            <div className={ Classes.DIALOG_FOOTER_ACTIONS }>
                <Button intent={ Intent.DANGER } iconName="trash" onClick={ this.onClickDeleteProject }>Delete</Button>
                <Button intent={ Intent.PRIMARY } onClick={ this.submit }>Save Changes</Button>
            </div>
        </div>
      </Dialog>
    );
  }
}

ProjectSettingsModal.propTypes = {
  projectId: PropTypes.number.isRequired,
  projectName: PropTypes.string.isRequired,
  projectDescription: PropTypes.string.isRequired,
  closeAction: PropTypes.func,
  isOpen: PropTypes.bool
};

ProjectSettingsModal.defaultProps = {
  projectTitle: 'Project Title',
  projectDescription: 'Project Description',
  isOpen: false
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { updateProject, deleteProject })(ProjectSettingsModal);
