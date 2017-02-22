import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { fetchProjectIfNeeded, fetchUserProjects } from '../actions/ProjectActions.js';
import { closeFeedbackModal } from '../actions/FeedbackActions.js';

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
    const { params, user, projects, fetchProjectIfNeeded, fetchUserProjects } = this.props;
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
    const { params, user, projects, fetchProjectIfNeeded, fetchUserProjects } = nextProps;
    
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
            <ProjectTopBar paramDatasetId={ this.props.params.datasetId } routes={ this.props.routes } />
            { this.props.children }
          </div>
          <div
            className={ styles.feedbackButton }
            onClick={ this.openFeedbackModal }
          >
              <span>Give Feedback</span>
              <span className={ styles.smile }>&#x263a;</span>
          </div>
          { this.state.feedbackModalOpen &&
            <FeedbackModal
              user={ user }
              project={ project }
              feedback={ feedback }
              location={ location }
              closeAction={ this.closeFeedbackModal }/>
          }
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
  const { projects, project, feedback, user } = state;
  return {
    projects,
    project,
    feedback,
    user
  };
}

export default connect(mapStateToProps, {
  fetchProjectIfNeeded,
  fetchUserProjects,
  closeFeedbackModal
})(ProjectsPage);
