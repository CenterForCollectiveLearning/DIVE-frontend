import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { updateProject, deleteProjectNoReturnHome, wipeProjectState } from '../../actions/ProjectActions.js';

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
    const { project, className, format, sortField, viewMode } = this.props;
    const { id, title, description, numDatasets, includedDatasets, numSpecs, numAnalyses, numDocuments, creationDate, updateDate, starred } = project;

    const showDatasets = (viewMode == 'expanded' && numDatasets > 0);
    if (this.state.deleted) { return ( <div/> )};
    return (
      <div className={ 'pt-card ' + styles.projectButton + ( showDatasets ? ' ' + styles.showDatasets : '') } onClick={ this.onClickProjectButton }>
        <div className={ styles.starContainer } onClick={ this.onClickStarProject }>
          <i className={ starred ? 'fa fa-star ' + styles.starred : 'fa fa-star-o' }></i>
        </div>
        <div className={ styles.projectButtonContent }>
          <div className={ styles.projectButtonContentTop }>
            <div className={ styles.projectLeft }>
              <div className={ styles.projectTitle }>{ title }</div>
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
        <div className={ styles.expandButton }>
          <div className={ styles.dropdown }>
            <div className={ styles.dropdownOption } onClick={ this.onClickProjectSettings }>Edit Properties</div>
            <div className={ styles.dropdownOption } onClick={ this.onClickDeleteProject }>Delete</div>
          </div>
        </div>

        { this.state.projectSettingsModalOpen &&
          <ProjectSettingsModal
            projectName={ title }
            projectDescription={ description }
            projectId={ id }
            closeAction={ this.closeProjectSettingsModal }/>
        }
      </div>
    )
  }
}

ProjectButton.propTypes = {
  className: PropTypes.string,
  format: PropTypes.string,
  project: PropTypes.object.isRequired,
  sortField: PropTypes.string,
  viewMode: PropTypes.string
}

ProjectButton.defaultProps = {
  format: 'list',
  viewMode: 'standard'
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { updateProject, deleteProjectNoReturnHome, wipeProjectState, push })(ProjectButton);
