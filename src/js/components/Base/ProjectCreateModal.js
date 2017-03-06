import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { createProject } from '../../actions/ProjectActions.js';
import styles from '../App/App.sass';

import { Button, Classes, Dialog } from '@blueprintjs/core';

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
    const { createProject, closeAction, user } = this.props;
    const { projectTitle, projectDescription } = this.state;

    createProject(user.id, projectTitle, projectDescription);
    closeAction();
  }

  enteredProjectNameInput = (event) => {
    this.setState({ projectTitle: event.target.value });
  }

  enteredProjectDescriptionInput = (event) => {
    this.setState({ projectDescription: event.target.value });
  }

  clickRegister = () => {
    this.props.push('/auth/register');
  }

  render() {
    const { user, closeAction, isOpen } = this.props;
    const { projectTitle, projectDescription } = this.state;

    return (
      <Dialog
        className={ styles.projectCreateModal }
        onClose={ closeAction }
        title='Create New Project'
        isOpen={ isOpen }
      >
        <div className={ Classes.DIALOG_BODY }>
          { user.anonymous &&
            <div className='pt-callout pt-intent-warning pt-icon-info-sign'>
              <h5>Temporary Project</h5>
              Because you are not logged in, your project will be deleted by the end of your session. To save projects, please <span className={ styles.registerLink } onClick={ this.clickRegister }>create an account</span>.
            </div>
          }
           <div className={ styles.controlSection }>
              <div className={ styles.label }>Title</div>
              <Input
                type="text"
                placeholder={ projectTitle }
                autofocus={ true }
                onChange={ this.enteredProjectNameInput }/>
            </div>
            <div className={ styles.controlSection }>
              <div className={ styles.label }>Description</div>
              <TextArea
                className='pt-input pt-fill'
                type="textarea"
                placeholder={ projectDescription }
                onChange={ this.enteredProjectDescriptionInput }/>
            </div>

        </div>
        <div className={ Classes.DIALOG_FOOTER }>
            <div className={ Classes.DIALOG_FOOTER_ACTIONS }>
                <Button className="pt-intent-primary" iconName="add" onClick={ this.submit }>Create</Button>
            </div>
        </div>
      </Dialog>
    );
  }
}

ProjectCreateModal.propTypes = {
  user: PropTypes.object.isRequired,
  projectTitle: PropTypes.string,
  projectDescription: PropTypes.string,
  closeAction: PropTypes.func,
  isOpen: PropTypes.bool
};

ProjectCreateModal.defaultProps = {
  projectTitle: 'Project Title',
  projectDescription: 'Project Description',
  isOpen: false
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { createProject, push })(ProjectCreateModal);
