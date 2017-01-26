import React, { Component, PropTypes } from 'react';
import styles from './Landing.sass';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import { createProject, fetchPreloadedProjects, fetchUserProjects, wipeProjectState } from '../../actions/ProjectActions';

import { Menu, MenuDivider, MenuItem, Popover, Position } from "@blueprintjs/core";
import ProjectCreateModal from '../Base/ProjectCreateModal';
import ProjectButton from '../Base/ProjectButton';
import RaisedButton from '../Base/RaisedButton';
import DropDownMenu from '../Base/DropDownMenu';
import Loader from '../Base/Loader';
import Footer from './Footer';


export class ProjectListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectCreateModalOpen: true,
      sortField: 'updateDate',
      viewMode: 'normal'
    };
  }

  componentWillMount() {
    const { projects, userId } = this.props;
    this.props.fetchUserProjects(userId);
  }

  componentWillReceiveProps(nextProps) {
    const nextProjectId = nextProps.project.id;
    const nextUserId = nextProps.userId;

    if (this.props.userId != nextUserId) {
      if (nextUserId) {
        nextProps.fetchUserProjects(nextUserId);
      }
    }
  }

  closeProjectSettingsModal = () => {
    console.log('CLOSING PROJECT SETTINGS MODAL');
    this.setState({ projectCreateModalOpen: false });
  }

  _onClickCreateProject = () => {
    this.setState({ projectCreateModalOpen: true });
    const userId = this.props.userId;
  }

  onSelectProjectSortField = (sortField) => {
    this.setState({ sortField: sortField });
  }

  onSelectProjectViewMode = (viewMode) => {
    this.setState({ viewMode: viewMode });
  }

  render() {
    const { projects, userId, user } = this.props;
    const { userProjects, isFetchingUserProjects } = projects;
    const { sortField, viewMode } = this.state;

    const sortedProjects = userProjects
      .sort(function(a, b) {
        var aValue = a[sortField];
        var bValue = b[sortField];
        const sortOrder = ([ 'starred', 'updateDate', 'creationDate' ].indexOf(sortField) > -1) ? -1 : 1;

        return (aValue >= bValue) ? (aValue > bValue ? sortOrder : 0) : -sortOrder;
      });

    const compassMenu = (
        <Menu>
            <MenuItem iconName="graph" text="Graph" />
            <MenuItem iconName="map" text="Map" />
            <MenuItem iconName="th" text="Table" shouldDismissPopover={false} />
            <MenuItem iconName="zoom-to-fit" text="Nucleus" disabled={true} />
            <MenuDivider />
            <MenuItem iconName="cog" text="Settings...">
                <MenuItem iconName="add" text="Add new application" disabled={true} />
                <MenuItem iconName="remove" text="Remove application" />
            </MenuItem>
        </Menu>
    );

    return (
      <DocumentTitle title='DIVE | Projects'>
        <div className={ styles.centeredFill }>
          <div className={ styles.projectsContainer + ' ' + styles.myProjectsContainer }>
            <div className={ styles.projectListTopbar }>
              <div className={ styles.pageLabel }>Your Projects</div>
              <div className={ styles.pullRight }>
                <button
                  type="button"
                  className="pt-button pt-intent-primary pt-icon-add"
                  onClick={ this._onClickCreateProject }>
                  Create Project
                </button>
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
            { !isFetchingUserProjects && userId && userProjects.length > 0 &&
              <div className={ styles.projectListContainer }>
                { projects.isFetching &&
                  <div className={ styles.watermark }>Fetching projects...</div>
                }
                { sortedProjects.map((project) =>
                  <ProjectButton
                    key={ `project-button-id-${ project.id }` }
                    project={ project }
                    sortField={ sortField }
                    viewMode={ viewMode }
                  />
                )}
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
                <Loader text='Loading Your Projects' />
              </div>
            }
            <ProjectCreateModal
              userId={ userId }
              closeAction={ this.closeProjectSettingsModal }
              isOpen={ this.state.projectCreateModalOpen }
            />
          </div>
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
