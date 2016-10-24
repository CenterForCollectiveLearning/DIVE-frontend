import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { createProject } from '../../actions/ProjectActions.js';
import styles from '../App/App.sass';

import BlockingModal from './BlockingModal';
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

  submit() {
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
        heading="Create a Project"
        footer={ footer }>
        <div className={ styles.fillContainer }>
          <div className={ styles.controlSection }>
            <div className={ styles.label }>Title</div>
            <Input
              type="text"
              placeholder={ projectTitle }
              autofocus={ true }
              onChange={ this.enteredProjectNameInput.bind(this) }/>
          </div>
          <div className={ styles.controlSection }>
            <div className={ styles.label }>Description</div>
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
