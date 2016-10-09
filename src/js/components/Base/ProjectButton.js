import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { deleteProjectNoReturnHome, wipeProjectState } from '../../actions/ProjectActions.js';

import styles from './ProjectButton.sass';

import RaisedButton from './RaisedButton';
import ProjectSettingsModal from './ProjectSettingsModal';

class ProjectButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectSettingsModalOpen: false,
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

  onClickDeleteProject = (e) => {
    const { project, deleteProjectNoReturnHome } = this.props;
    e.stopPropagation()
    e.preventDefault()
    deleteProjectNoReturnHome(project.id);
  }

  render() {
    const { project, className, format, sortField } = this.props;
    const { id, title, description, numDatasets, includedDatasets, numSpecs, numDocuments, creationDate, updateDate } = project;

    const starred = false;

    return (
      <div className={ styles.projectButton } onClick={ this.onClickProjectButton }>
        <div className={ styles.starContainer }>
          <i className={ starred ? 'fa fa-star ' + styles.starred : 'fa fa-star-o' }></i>
        </div>
        <div className={ styles.projectLeft }>
          <div className={ styles.projectTitle }>{ title }</div>
          <div className={ styles.projectMetaData }>
            { description !== 'Project Description' &&
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
              <span className={ styles.value }>{ numSpecs }</span>
            </div>
            <div className={ styles.item }>
              <span className={ styles.label }>Stories</span>
              <span className={ styles.value }>{ numDocuments }</span>
            </div>
          </div>
          {/* <div className={ styles.pullRight }>
            <div className={ styles.item }>
              <span className={ styles.label }>Created</span>
              <span className={ styles.value }>{ moment(creationDate).format('LLL') }</span>
            </div>
            <div className={ styles.item }>
              <span className={ styles.label }>Last Updated</span>
              <span className={ styles.value }>{ moment(updateDate).format('LLL') }</span>
            </div>
          </div> */}
          <div className={ styles.expandButton }>
            <div className={ styles.chevron }>﹀</div>
            <div className={ styles.dropdown }>
              <div className={ styles.dropdownOption } onClick={ this.onClickProjectSettings }>Edit Properties</div>
              <div className={ styles.dropdownOption } onClick={ this.onClickDeleteProject }>Delete</div>
            </div>
          </div>
        </div>

        {/* { (numDatasets > 0) &&
        <div className={ styles.projectBottom }>
          <div className={ styles.item }>
            <span className={ styles.label }>Datasets</span>
            <span className={ styles.values }>
              { includedDatasets.map((dataset) =>
                <div className={ styles.projectUpdateDate } key={ `project-dataset-${ dataset.id }`}>{ dataset.title }</div>
              )}
            </span>
          </div>
        </div>
        } */}
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
  sortField: PropTypes.string
}

ProjectButton.defaultProps = {
  format: 'list'
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { deleteProjectNoReturnHome, wipeProjectState, push })(ProjectButton);
