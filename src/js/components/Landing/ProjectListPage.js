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


export class ProjectListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortField: 'updateDate'
    };
  }

  componentWillMount() {
    const { projects, userId } = this.props;
    this.props.fetchPreloadedProjects(userId);
    this.props.fetchUserProjects(userId);
  }

  componentWillReceiveProps(nextProps) {
    const nextProjectId = nextProps.project.id;
    const nextUserId = nextProps.userId;

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

  onSelectProjectSortField = (sortField) => {
    this.setState({ sortField: sortField });
  }

  render() {
    const { projects, userId, user } = this.props;
    const { userProjects, isFetchingUserProjects } = projects;
    const { sortField } = this.state;

    const sortedProjects = userProjects
      .sort(function(a, b) {
        var aValue = a[sortField];
        var bValue = b[sortField];
        const sortOrder = ([ 'starred', 'updateDate', 'creationDate' ].indexOf(sortField) > -1) ? -1 : 1;

        return (aValue >= bValue) ? (aValue > bValue ? sortOrder : 0) : -sortOrder;
      });

    return (
      <DocumentTitle title='DIVE | Projects'>
        <div className={ styles.centeredFill }>
          <div className={ styles.ctaBox }>
            {/* <div className={ styles.ctaContainer }>
              <RaisedButton
                label="Create Project"
                primary={ true }
                onClick={ this._onUploadClick.bind(this) }
                className={ styles.uploadButton } />
            </div> */}
          </div>
          { !isFetchingUserProjects && userId && userProjects.length > 0 &&
            <div className={ styles.projectsContainer + ' ' + styles.myProjectsContainer }>
              <div className={ styles.projectListTopbar }>
                <div className={ styles.pageLabel }>Your Projects</div>
                <div className={ styles.pullRight }>
                  <RaisedButton
                    label="+ Create Project"
                  <div className={ styles.sortTypeDropdownContainer }>
                    <DropDownMenu
                      value={ sortField }
                      options={ [
                        { value: 'updateDate', label: 'Last Modified' },
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
          { !isFetchingUserProjects && userProjects.length == 0 &&
            <div className={ styles.projectsContainer + ' ' + styles.myProjectsContainer }>
              <div className={ styles.projectListSidebar }></div>
              <div className={ styles.watermark }>
                You have no projects &#x2639;
              </div>
            </div>
          }
          { isFetchingUserProjects && userId &&
            <div className={ styles.projectsContainer + ' ' + styles.myProjectsContainer }>
              <div className={ styles.projectListSidebar }></div>
              <Loader text='Loading your projects' />
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

export default connect(mapStateToProps, { fetchPreloadedProjects, fetchUserProjects, createProject, wipeProjectState, push })(ProjectListPage);
