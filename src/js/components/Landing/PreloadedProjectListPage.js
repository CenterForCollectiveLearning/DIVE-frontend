import React, { Component, PropTypes } from 'react';
import styles from './Landing.sass';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import { createProject, fetchPreloadedProjects, fetchUserProjects, wipeProjectState } from '../../actions/ProjectActions';

import ProjectButton from '../Base/ProjectButton';
import RaisedButton from '../Base/RaisedButton';
import DropDownMenu from '../Base/DropDownMenu';
import Loader from '../Base/Loader';
import Footer from './Footer';


export class PreloadedProjectListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortField: 'title'
    };
  }

  componentWillMount() {
    const { projects, userId } = this.props;
    this.props.fetchPreloadedProjects(userId);
  }

  componentWillReceiveProps(nextProps) {
    const nextProjectId = nextProps.project.id;
    const nextUserId = nextProps.userId;

    if (this.props.project.id != nextProjectId) {
      this.props.wipeProjectState();
      this.props.push(`/projects/${ nextProjectId }/datasets/upload`);
    }

    if (this.props.userId != nextUserId) {
      nextProps.fetchPreloadedProjects(nextUserId);
    }
  }

  render() {
    const { projects, userId, user } = this.props;
    const { preloadedProjects, isFetchingPreloadedProjects } = projects;

    return (
      <DocumentTitle title='DIVE | Preloaded Projects'>
        <div className={ styles.centeredFill }>
          { !isFetchingPreloadedProjects && preloadedProjects.length > 0 &&
            <div className={ styles.projectsContainer + ' ' + styles.myProjectsContainer }>
              <div className={ styles.projectListTopbar }>
                <div className={ styles.pageLabel }>Preloaded Projects</div>
                <div className={ styles.pullRight }>
                  <div className={ styles.sortTypeDropdownContainer }>
                    <DropDownMenu
                      value={ sortField }
                      options={ [
                        { value: 'creationDate', label: 'Created' },
                        { value: 'title', label: 'Project Name' },
                        { value: 'starred', label: 'Starred' },
                      ]}
                      valueMember='value'
                      displayTextMember='label'
                      prefix="Sort By"
                      onChange={ this.onSelectProjectSortField } />
                  </div>
                </div>
              </div>
              <div className={ styles.projectListContainer }>
                { projects.isFetching &&
                  <div className={ styles.watermark }>Fetching projects...</div>
                }
                { sortedProjects.map((project) =>
                  <ProjectButton
                    key={ `project-button-id-${ project.id }` }
                    project={ project }
                    sortField={ sortField }
                  />
                )}
              </div>
            </div>
          }
          { !isFetchingPreloadedProjects && preloadedProjects.length == 0 &&
            <div className={ styles.projectsContainer + ' ' + styles.myProjectsContainer }>
              <div className={ styles.projectListSidebar }></div>
              <div className={ styles.watermark }>
                No preloaded projects exist &#x2639;
              </div>
            </div>
          }
          { isFetchingPreloadedProjects &&
            <div className={ styles.projectsContainer + ' ' + styles.myProjectsContainer }>
              <div className={ styles.projectListSidebar }></div>
            <Loader text='Loading Preloaded Projects' />
            </div>
          }
        </div>
      </DocumentTitle>
    );
  }
}


function mapStateToProps(state) {
  const { project, projects, user } = state;
  return { project, projects, user: user, userId: user.id };
}

export default connect(mapStateToProps, { fetchPreloadedProjects, fetchUserProjects, createProject, wipeProjectState, push })(PreloadedProjectListPage);
