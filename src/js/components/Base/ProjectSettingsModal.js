import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { updateProject, deleteProject } from '../../actions/ProjectActions.js';
import styles from '../App/App.sass';

import BlockingModal from './BlockingModal';
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

  submit() {
    const { projectId, updateProject, closeAction } = this.props;
    const { projectName, projectDescription } = this.state;

    updateProject(projectId, { title: projectName, description: projectDescription });
    closeAction();
  }

  enteredProjectNameInput(event) {
    this.setState({ projectName: event.target.value });
  }

  enteredProjectDescriptionInput(event) {
    this.setState({ projectDescription: event.target.value });
  }

  onClickDeleteProject() {
    const { projectId, deleteProject } = this.props;
    deleteProject(projectId);
  }

  render() {
    const { closeAction } = this.props;
    const { projectName, projectDescription } = this.state;

    var footer =
      <div className={ styles.footerContent }>
        <RaisedButton icon altText="Delete project" onClick={ this.onClickDeleteProject.bind(this) }>
          <i className="fa fa-trash"></i>
        </RaisedButton>

        <div className={ styles.rightActions }>
          <RaisedButton primary minWidth={ 100 } onClick={ this.submit.bind(this) }>Save</RaisedButton>
          <RaisedButton onClick={ closeAction }>Cancel</RaisedButton>
        </div>
      </div>;

    return (
      <BlockingModal
        scrollable={ false }
        closeAction={ this.props.closeAction }
        heading="Project Settings"
        footer={ footer }>
        <div className={ styles.fillContainer }>
          <div className={ styles.controlSection }>
            <div className={ styles.label }>Project Name</div>
            <Input
              type="text"
              placeholder={ projectName }
              value={ projectName }
              onChange={ this.enteredProjectNameInput.bind(this) }/>
          </div>
          <div className={ styles.controlSection }>
            <div className={ styles.label }>Project Description</div>
            <TextArea
              type="textarea"
              placeholder={ projectDescription }
              value={ projectDescription }
              onChange={ this.enteredProjectDescriptionInput.bind(this) }/>
          </div>
        </div>
      </BlockingModal>
    );
  }
}

ProjectSettingsModal.propTypes = {
  projectId: PropTypes.number.isRequired,
  projectName: PropTypes.string.isRequired,
  projectDescription: PropTypes.string.isRequired,
  closeAction: PropTypes.func
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { updateProject, deleteProject })(ProjectSettingsModal);
