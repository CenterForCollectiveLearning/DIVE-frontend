import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { deleteProjectNoReturnHome, wipeProjectState } from '../../actions/ProjectActions.js';

import styles from './ProjectButton.sass';

import Input from './Input';
import RaisedButton from './RaisedButton';
import ProjectSettingsModal from './ProjectSettingsModal';

class ProjectButton extends Component {
  constructor(props) {
    super(props);

    const { project } = this.props;
    const { title } = project;

    // this.saveProjectTitle = _.debounce(saveProjectTitle, 800);

    this.state = {
      title: title,
      editableProjectTitle: true,
      projectSettingsModalOpen: false,
    };
  }

  onTitleChange = (e) => {
    const title = e.target.value;
    this.setState({ title: title });
    // this.saveDocumentTitle(this.props.selectedDocument.id, title);
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

  onClickProjectTitle = (e) => {
    this.setState({ editableProjectTitle: !this.state.editableProjectTitle });
  }

  render() {
    const { project, className, format } = this.props;
    const { id, description, numDatasets, includedDatasets, numSpecs, numDocuments, creationDate, updateDate } = project;
    const { projectSettingsModalOpen, editableProjectTitle, title } = this.state;

    return (
      <div className={ styles.projectButton }>
        <div className={ styles.projectTop }>
          <div className={ styles.pullLeft }>
            { !editableProjectTitle &&
              <div className={ styles.projectTitle } onClick={ this.clickProjectTitle }>{ title }</div>
            }
            { editableProjectTitle &&
              <input className={ styles.projectTitle } onChange={ this.onTitleChange } value={ title }/>
            }
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
        { projectSettingsModalOpen &&
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

export default connect(mapStateToProps, { deleteProjectNoReturnHome, wipeProjectState, push })(ProjectButton);
