import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { updateProject, deleteProject } from '../../actions/ProjectActions.js';
import styles from '../App/App.sass';

import BlockingModal from './BlockingModal';
import RaisedButton from './RaisedButton';
import Input from './Input';
import TextArea from './TextArea';

class ProjectCreateModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectName: this.props.projectName,
      projectDescription: this.props.projectDescription
    };
  }

  submit() {
    const {updateProject, closeAction } = this.props;
    const { projectName, projectDescription } = this.state;

    // updateProject(, { title: projectName, description: projectDescription });
    closeAction();
  }

  enteredProjectNameInput(event) {
    this.setState({ projectName: event.target.value });
  }

  enteredProjectDescriptionInput(event) {
    this.setState({ projectDescription: event.target.value });
  }

  render() {
    const { closeAction } = this.props;
    const { projectName, projectDescription } = this.state;

    var footer =
      <div className={ styles.footerContent }>
        <div className={ styles.rightActions }>
          <RaisedButton primary normalHeight minWidth={ 100 } onClick={ this.submit.bind(this) }>Create</RaisedButton>
          <RaisedButton onClick={ closeAction }>Cancel</RaisedButton>
        </div>
      </div>;

    return (
      <BlockingModal
        scrollable={ false }
        closeAction={ this.props.closeAction }
        heading="Project Create"
        footer={ footer }>
        <div className={ styles.fillContainer }>
          <div className={ styles.controlSection }>
            <div className={ styles.label }>Project Name</div>
            <Input
              type="text"
              placeholder={ projectName }
              autofocus={ true }
              onChange={ this.enteredProjectNameInput.bind(this) }/>
          </div>
          <div className={ styles.controlSection }>
            <div className={ styles.label }>Project Description</div>
            <TextArea
              type="textarea"
              placeholder={ projectDescription }
              onChange={ this.enteredProjectDescriptionInput.bind(this) }/>
          </div>
        </div>
      </BlockingModal>
    );
  }
}

ProjectCreateModal.propTypes = {
  projectName: PropTypes.string,
  projectDescription: PropTypes.string,
  closeAction: PropTypes.func
};

ProjectCreateModal.defaultProps = {
  projectName: 'Project Title',
  projectDescription: 'Project Description'
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { updateProject, deleteProject })(ProjectCreateModal);
