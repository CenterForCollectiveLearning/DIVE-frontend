import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { wipeProjectState } from '../../actions/ProjectActions.js';
import styles from './SelectionModal.sass';

import { Button, Classes, Dialog } from '@blueprintjs/core';

import ProjectButton from './ProjectButton';
import RaisedButton from './RaisedButton';
import Input from './Input';
import TextArea from './TextArea';

class ProjectSelectionModal extends Component {
  onSelectProject(projectId) {
    const { push, wipeProjectState } = this.props;
    wipeProjectState();
    push(`/projects/${ projectId }/datasets`);
  }

  render() {
    const { projects, currentProjectId, closeAction, isOpen } = this.props;

    const projectTitles = projects.map((p) => p.title);
    return (
      <Dialog
        className={ styles.selectionModal }
        onClose={ closeAction }
        title={ `Change Project (${ projects.length })` }
        iconName='projects'
        isOpen={ isOpen }
      >
        <div className={ Classes.DIALOG_BODY }>
          <div className={ styles.listContainer }>
            { projects.map((project) =>
              <ProjectButton
                key={ `project-button-${ project.id }` }
                project={ project }
                minimal={ true }
                showId={ projectTitles.filter((projectTitle) => projectTitle == project.title).length > 1 }
                selected={ project.id == currentProjectId }
                onClickButton={ () => this.onSelectProject(project.id) }
              />
            ) }
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
  currentProjectId: PropTypes.number
};

ProjectSelectionModal.defaultProps = {
  datasets: [],
  isOpen: false
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { push, wipeProjectState })(ProjectSelectionModal);
