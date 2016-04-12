import React, { Component, PropTypes } from 'react';
import styles from './Landing.sass';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import DocumentTitle from 'react-document-title';
import { createProject, fetchPreloadedProjects, fetchUserProjects, wipeProjectState } from '../../actions/ProjectActions';

import RaisedButton from '../Base/RaisedButton';

export class ProjectListPage extends Component {
  componentWillMount() {
    const { projects, userId } = this.props;
    this.props.fetchPreloadedProjects(userId);
    this.props.fetchUserProjects(userId);
  }

  componentWillReceiveProps(nextProps) {
    const nextProjectId = nextProps.project.properties.id;
    const nextUserId = nextProps.userId;

    if (this.props.project.properties.id != nextProjectId) {
      this.props.wipeProjectState();
      this.props.pushState(null, `/projects/${ nextProjectId }/datasets/upload`);
    }

    if (this.props.userId != nextUserId) {
      nextProps.fetchPreloadedProjects(nextUserId);
      if (nextUserId) {
        nextProps.fetchUserProjects(nextUserId);
      }
    }
  }

  _onUploadClick() {
    const userId = this.props.userId;
    const projectTitle = 'Project Title';
    const projectDescription = 'Project Description'
    this.props.createProject(userId, projectTitle, projectDescription);
  }

  render() {
    const { projects, userId } = this.props;
    const { userProjects, preloadedProjects } = projects;
    return (
      <DocumentTitle title='DIVE | Projects'>
        <div className={ styles.centeredFill }>
          <div className={ styles.ctaBox }>
            <div className={ styles.ctaContainer }>
              <RaisedButton
                label="Create Project"
                primary={ true }
                onClick={ this._onUploadClick.bind(this) }
                className={ styles.uploadButton } />
            </div>
          </div>
          { userId && userProjects.length > 0 &&
            <div className={ styles.projectsContainer + ' ' + styles.myProjectsContainer }>
              <div className={ styles.projectTypeContainer }>
                <div className={ styles.flexbox }>
                  <div className={ styles.secondaryCopy + ' ' + styles.emphasis }>Your projects:</div>
                </div>
                <div className={ styles.projectListContainer }>
                  { projects.isFetching &&
                    <div className={ styles.watermark }>Fetching projects...</div>
                  }
                  { userProjects.map((project) =>
                    <a key={ `project-button-id-${ project.id }` } href={ `/projects/${ project.id }/datasets` } className={ styles.projectButton }>{ project.title }</a>
                  )}
                </div>
              </div>
            </div>
          }
          <div className={ styles.projectsContainer + ' ' + styles.preloadedProjectsContainer }>
            <div className={ styles.projectTypeContainer }>
              <div className={ styles.flexbox }>
                <div className={ styles.secondaryCopy + ' ' + styles.emphasis }>Or explore preloaded projects:</div>
              </div>
              <div className={ styles.projectListContainer }>
                { projects.isFetching &&
                  <div className={ styles.watermark }>Fetching projects...</div>
                }
                { preloadedProjects.map((project) =>
                  <a key={ `project-button-id-${ project.id }` } href={ `/projects/${ project.id }/datasets` } className={ styles.projectButton }>{ project.title }</a>
                )}
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}


function mapStateToProps(state) {
  const { project, projects, user } = state;
  return { project, projects, userId: user.id };
}

export default connect(mapStateToProps, { fetchPreloadedProjects, fetchUserProjects, createProject, wipeProjectState, pushState })(ProjectListPage);
