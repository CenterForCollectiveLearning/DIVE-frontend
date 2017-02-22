import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { createProject } from '../../actions/ProjectActions.js';
import styles from './SelectionModal.sass';

import { Button, Classes, Dialog } from '@blueprintjs/core';

import ProjectButton from './ProjectButton';
import RaisedButton from './RaisedButton';
import Input from './Input';
import TextArea from './TextArea';

class ProjectSelectionModal extends Component {
  render() {
    const { projects, currentProjectId, closeAction, isOpen, onClickButton } = this.props;

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
                project={ project }
                minimal={ true }
                showId={ projectTitles.filter((projectTitle) => projectTitle == project.title).length > 1 }
              />
            ) }
          </div>
        </div>
        <div className={ Classes.DIALOG_FOOTER }>
            <div className={ Classes.DIALOG_FOOTER_ACTIONS }>
                <Button className="pt-intent-primary" iconName="add" onClick={ this.submit }>Go to Project</Button>
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
