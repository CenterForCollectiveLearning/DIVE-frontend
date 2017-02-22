import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { updateProject, deleteProjectNoReturnHome, wipeProjectState } from '../../actions/ProjectActions.js';

import { Button, Popover, PopoverInteractionKind, Position, Menu, MenuItem } from '@blueprintjs/core';

import styles from './ProjectButton.sass';

import RaisedButton from './RaisedButton';
import ProjectSettingsModal from './ProjectSettingsModal';

class ProjectButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectSettingsModalOpen: false,
      deleted: false
    };
  }

  closeProjectSettingsModal = () => {
    this.setState({ projectSettingsModalOpen: false });
  }

  onClickProjectButton = (e) => {
    const { project, wipeProjectState, push } = this.props;
    const { projectSettingsModalOpen } = this.state;
    if (!projectSettingsModalOpen) {
      wipeProjectState();
      push(`/projects/${ project.id }/datasets`);
    }
  }

  onClickProjectSettings = (e) => {
    e.stopPropagation()
    e.preventDefault()
    this.setState({ projectSettingsModalOpen: true });
  }

  onClickStarProject = (e) => {
    e.stopPropagation()
    e.preventDefault()

    const { project, updateProject } = this.props;
    const { title, description, starred } = project;

    updateProject(project.id, {
      title: title,
      description: description,
      starred: !starred
    });
  }

  onClickDeleteProject = (e) => {
    const { project, deleteProjectNoReturnHome } = this.props;
    e.stopPropagation()
    e.preventDefault()
    this.setState({ deleted: true });
    deleteProjectNoReturnHome(project.id);
  }

  render() {
    const { project, className, minimal, showId, format, sortField, viewMode } = this.props;
    const { id, title, description, numDatasets, includedDatasets, numSpecs, numAnalyses, numDocuments, creationDate, updateDate, starred } = project;

    const showDatasets = (viewMode == 'expanded' && numDatasets > 0);
    if (this.state.deleted) { return ( <div/> )};

    let popoverContent = (
      <Menu>
        <MenuItem
          iconName="edit"
          onClick={ this.onClickProjectSettings }
          text="Edit Properties"
        />
        <MenuItem
          iconName="trash"
          onClick={ this.onClickDeleteProject }
          text="Delete"
        />
      </Menu>
    );

    return (
      <div className={ 'pt-card pt-interactive ' + styles.projectButton + ( showDatasets ? ' ' + styles.showDatasets : '') + (minimal ? ' ' + styles.minimal : '')} onClick={ this.onClickProjectButton }>
        { !minimal &&
          <div className={ styles.starContainer } onClick={ this.onClickStarProject }>
            <i className={ starred ? 'fa fa-star ' + styles.starred : 'fa fa-star-o' }></i>
          </div>
        }
        <div className={ styles.projectButtonContent }>
          <div className={ styles.projectButtonContentTop }>
            <div className={ styles.projectLeft }>
              <div className={ styles.projectTitle }>{ title } { showId && <span>({ project.id })</span>}</div>
              <div className={ styles.projectMetaData }>
                { ( description && description !== 'Project Description' ) &&
                  <div className={ styles.projectDescription }>{ description }</div>
                }
                { sortField == 'updateDate' &&
                  <div className={ styles.projectDescription }>Last Modified: { moment(updateDate).format('LLL') }</div>
                }
                { sortField == 'creationDate' &&
                  <div className={ styles.projectDescription }>Created: { moment(creationDate).format('LLL') }</div>
                }
              </div>
            </div>
            { !minimal &&
              <div className={ styles.projectRight }>
                <div className={ styles.metadata }>
                  <div className={ styles.item }>
                    <span className={ styles.label }>Datasets</span>
                    <span className={ styles.value }>{ numDatasets }</span>
                  </div>
                  <div className={ styles.item }>
                    <span className={ styles.label }>Visualizations</span>
                    <span className={ styles.value }>{ numSpecs }</span>
                  </div>
                  <div className={ styles.item }>
                    <span className={ styles.label }>Analyses</span>
                    <span className={ styles.value }>{ numAnalyses }</span>
                  </div>
                  <div className={ styles.item }>
                    <span className={ styles.label }>Stories</span>
                    <span className={ styles.value }>{ numDocuments }</span>
                  </div>
                </div>
              </div>
            }
          </div>
          { showDatasets &&
            <div className={ styles.projectButtonContentBottom }>
              <div className={ styles.item }>
                <span className={ styles.label }>Datasets</span>
                <span className={ styles.values }>
                  { includedDatasets.map((dataset) =>
                    <div className={ styles.projectUpdateDate } key={ `project-dataset-${ dataset.id }`}>{ dataset.title }</div>
                  )}
                </span>
              </div>
            </div>
          }
        </div>
        { minimal &&
          <div className={ 'pt-button-group ' + styles.rightButtons }>
            <Button onClick={ this.onClickProjectSettings } iconName='edit' />
            <Button onClick={ this.onClickDeleteProject } iconName='trash' />
          </div>
        }
        { !minimal &&
          <Popover content={ popoverContent }
            interactionKind={ PopoverInteractionKind.HOVER }
            position={ Position.LEFT }
            useSmartPositioning={ true }
            transitionDuration={ 100 }
            hoverOpenDelay={ 100 }
            hoverCloseDelay={ 100 }
          >
            <span className={ styles.expandButton + ' pt-icon-standard pt-icon-menu-open' } />
          </Popover>
        }
        <ProjectSettingsModal
          projectName={ title }
          projectDescription={ description }
          projectId={ id }
          isOpen={ this.state.projectSettingsModalOpen }
          closeAction={ this.closeProjectSettingsModal }/>
      </div>
    )
  }
}

ProjectButton.propTypes = {
  className: PropTypes.string,
  format: PropTypes.string,
  project: PropTypes.object.isRequired,
  sortField: PropTypes.string,
  viewMode: PropTypes.string,
  minimal: PropTypes.bool,
  showId: PropTypes.bool
}

ProjectButton.defaultProps = {
  format: 'list',
  viewMode: 'standard',
  minimal: false,
  showId: false
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { updateProject, deleteProjectNoReturnHome, wipeProjectState, push })(ProjectButton);
