import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { createProject } from '../../actions/ProjectActions.js';
import styles from '../App/App.sass';

import { Button, Classes, Dialog } from '@blueprintjs/core';

import RaisedButton from './RaisedButton';
import Input from './Input';
import TextArea from './TextArea';

class ProjectSelectionModal extends Component {
  render() {
    const { projects, currentProjectId, closeAction, isOpen, onClickButton } = this.props;

    return (
      <Dialog
        onClose={ closeAction }
        title={ `Change Project (${ projects.length })` }
        iconName='projects'
        isOpen={ isOpen }
      >
        <div className={ Classes.DIALOG_BODY }>
          <div className="pt-button-group pt-vertical pt-fill">
            { projects.map((project) =>
              <Button
                text={ project.title }
                disabled={ (project.id == currentProjectId) }
                onClick={ () => onClickButton(project.id) }
              />
            ) }
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

ProjectSelectionModal.propTypes = {
  datasets: PropTypes.array,
  closeAction: PropTypes.func,
  isOpen: PropTypes.bool,
  currentProjectId: PropTypes.number,
  onClickButton: PropTypes.func
};

ProjectSelectionModal.defaultProps = {
  datasets: [],
  isOpen: false
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { createProject })(ProjectSelectionModal);
