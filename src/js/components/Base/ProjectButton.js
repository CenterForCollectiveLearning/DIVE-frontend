import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { deleteProjectNoReturnHome } from '../../actions/ProjectActions.js';

import styles from './ProjectButton.sass';

import RaisedButton from './RaisedButton';
import ProjectSettingsModal from './ProjectSettingsModal';

class ProjectButton extends Component {
  constructor(props) {
    super(props);

    this.onClickProjectButton = this.onClickProjectButton.bind(this);
    this.onClickDeleteProject = this.onClickDeleteProject.bind(this);
    this.onClickProjectSettings = this.onClickProjectSettings.bind(this);
    this.closeProjectSettingsModal = this.closeProjectSettingsModal.bind(this)

    this.state = {
      projectSettingsModalOpen: false,
    };
  }

  onClickProjectSettings(e) {
    this.setState({ projectSettingsModalOpen: true });
  }

  closeProjectSettingsModal() {
    this.setState({ projectSettingsModalOpen: false });
  }

  onClickProjectButton() {
    const { project } = this.props;
    this.props.push(`/projects/${ project.id }/datasets`);
  }

  onClickDeleteProject() {
    const { project, deleteProjectNoReturnHome } = this.props;
    deleteProjectNoReturnHome(project.id);
  }

  render() {
    const { project, className, format } = this.props;
    const { id, title, description, numDatasets, includedDatasets, numSpecs, numDocuments, creationDate, updateDate } = project;

    return (
      <div className={ styles.projectButton } onClick={ this.onClickProjectButton }>
        <div className={ styles.projectTop }>
          <div className={ styles.pullLeft }>
            <div className={ styles.projectTitle }>{ title }</div>
          </div>
          { !project.preloaded &&
            <div className={ styles.pullRight }>
              <RaisedButton icon={ true } onClick={ this.onClickProjectSettings }><i className="fa fa-cog" /></RaisedButton>
              <RaisedButton icon={ true } onClick={ this.onClickDeleteProject }><i className="fa fa-trash" /></RaisedButton>
            </div>
          }
        </div>
        { (description && description !== 'Project Description') &&
        <div className={ styles.projectMiddle }>
          <div className={ styles.pullLeft }>
              <div className={ styles.projectDescription }>{ description }</div>
          </div>
        </div>
        }
        <div className={ styles.projectMiddle }>
          <div className={ styles.pullLeft }>
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
                <span className={ styles.label }>Documents</span>
                <span className={ styles.value }>{ numDocuments }</span>
              </div>
            </div>
          </div>
          <div className={ styles.pullRight }>
            <div className={ styles.item }>
              <span className={ styles.label }>Created</span>
              <span className={ styles.value }>{ moment(creationDate).format('LLL') }</span>
            </div>
            <div className={ styles.item }>
              <span className={ styles.label }>Last Updated</span>
              <span className={ styles.value }>{ moment(updateDate).format('LLL') }</span>
            </div>
          </div>
        </div>
        { (numDatasets > 0) &&
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
        }
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
}

ProjectButton.defaultProps = {
  format: 'list'
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { deleteProjectNoReturnHome, push })(ProjectButton);
