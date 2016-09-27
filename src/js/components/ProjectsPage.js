import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { fetchProjectIfNeeded, fetchUserProjects } from '../actions/ProjectActions.js';

import styles from './App/App.sass';

import ProjectSidebar from './ProjectSidebar';
import ProjectTopBar from './ProjectTopBar';

export class ProjectsPage extends Component {
  componentDidMount() {
    const { params, user, projects, fetchProjectIfNeeded, fetchUserProjects } = this.props;
    if (params.projectId) {
      fetchProjectIfNeeded(params.projectId);
    }
    if (user.id) {
      window.amplitude.setuserid(`${ user.id }: ${ user.email }`);
    }

    if (user.id && !projects.isFetchingUserProjects && !projects.userProjectsLoaded) {
      fetchUserProjects(user.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { user, projects, fetchUserProjects } = nextProps;

    if (user.id) {
      window.amplitude.setuserid(`${ user.id }: ${ user.email }`);
    }

    if (user.id && !projects.isFetchingUserProjects && !projects.userProjectsLoaded) {
      fetchUserProjects(user.id);
    }
  }

  render() {
    const { project } = this.props;
    const documentTitle = project.properties.title ? `DIVE | ${ project.properties.title }`: 'DIVE';

    return (
      <DocumentTitle title={ documentTitle }>
        <div className={ styles.fillContainer + ' ' + styles.projectContainer }>
          <ProjectSidebar paramDatasetId={ this.props.params.datasetId } routes={ this.props.routes } />
          <div className={ styles.projectRightContainer }>
            <ProjectTopBar paramDatasetId={ this.props.params.datasetId } routes={ this.props.routes } />
            { this.props.children }
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

ProjectsPage.propTypes = {
  children: PropTypes.node,
  projects: PropTypes.object,
  project: PropTypes.object,
  user: PropTypes.object
};

function mapStateToProps(state) {
  const { projects, project, user } = state;
  return {
    projects,
    project,
    user
  };
}

export default connect(mapStateToProps, { fetchProjectIfNeeded, fetchUserProjects })(ProjectsPage);
