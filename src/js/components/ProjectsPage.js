import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { push } from 'react-router-redux';
import { fetchProjectIfNeeded, fetchUserProjects } from '../actions/ProjectActions.js';
import { closeFeedbackModal } from '../actions/FeedbackActions.js';

import {
  AUTH_ERROR
} from '../constants/ActionTypes';

import styles from './App/App.sass';

import ProjectSidebar from './ProjectSidebar';
import ProjectTopBar from './ProjectTopBar';
import FeedbackModal from './Base/FeedbackModal';

export class ProjectsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      feedbackModalOpen: false,
    };
  }

  componentDidMount() {
    const { params, user, error, projects, fetchProjectIfNeeded, fetchUserProjects, push } = this.props;

    if (user.isAuthenticated && !user.anonymous && !user.confirmed) {
      push('/auth/unconfirmed');
    }

    if (params.projectId) {
      fetchProjectIfNeeded(params.projectId);
    }
    if (user.id) {
      window.amplitude.setUserId(user.id);
      window.amplitude.setUserProperties({ email: user.email, username: user.username });
    }

    if (user.id && !projects.isFetchingUserProjects && !projects.userProjectsLoaded) {
      fetchUserProjects(user.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { params, user, error, projects, fetchProjectIfNeeded, fetchUserProjects, push } = nextProps;

    if (error.type == AUTH_ERROR) {
      push('/unauthorized');
    }

    if (params.projectId) {
      fetchProjectIfNeeded(params.projectId);
    }

    if (user.id) {
      window.amplitude.setUserId(user.id);
      window.amplitude.setUserProperties({ email: user.email, username: user.username });
    }

    if (user.id && !projects.isFetchingUserProjects && !projects.userProjectsLoaded) {
      fetchUserProjects(user.id);
    }
  }

  openFeedbackModal = () => {
    this.setState({ feedbackModalOpen: true });
  }

  closeFeedbackModal = () => {
    this.setState({ feedbackModalOpen: false });
    this.props.closeFeedbackModal();
  }

  render() {
    const { project, user, feedback, location } = this.props;
    const documentTitle = project.title ? `DIVE | ${ project.title }`: 'DIVE';

    return (
      <DocumentTitle title={ documentTitle }>
        <div className={ styles.fillContainer + ' ' + styles.projectContainer }>
          <ProjectSidebar paramDatasetId={ this.props.params.datasetId } routes={ this.props.routes } />
          <div className={ styles.projectRightContainer }>
            { this.props.children }
          </div>
          <div
            className={ styles.feedbackButton }
            onClick={ this.openFeedbackModal }
          >
              <span>Give Feedback</span>
              <span className={ styles.smile }>&#x263a;</span>
          </div>
          <FeedbackModal
            isOpen={ this.state.feedbackModalOpen }
            user={ user }
            project={ project }
            feedback={ feedback }
            location={ location }
            closeAction={ this.closeFeedbackModal }/>
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
  const { projects, project, feedback, user, error } = state;
  return {
    error,
    projects,
    project,
    feedback,
    user
  };
}

export default connect(mapStateToProps, {
  fetchProjectIfNeeded,
  fetchUserProjects,
  closeFeedbackModal,
  push
})(ProjectsPage);
