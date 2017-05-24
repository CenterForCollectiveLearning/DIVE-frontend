import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { fetchProjectIfNeeded, createAUID } from '../actions/ProjectActions.js';
import { logoutUser } from '../actions/AuthActions';

import { Popover, PopoverInteractionKind, Position, Menu, MenuItem } from '@blueprintjs/core';

import styles from './App/App.sass';

import Link from './Base/Link';
import DropDownMenu from './Base/DropDownMenu';
import RaisedButton from './Base/RaisedButton';
import Tabs from './Base/Tabs';
import Tab from './Base/Tab';
import TabGroup from './Base/TabGroup';
import ProjectSettingsModal from './Base/ProjectSettingsModal';

import Logo from '../../assets/DIVE_logo_white.svg?name=Logo';


export class ProjectSidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectSettingsModalOpen: false,
      secondaryNavOpen: false
    };
  }

  _getTabs = () => {
    const { paramDatasetId, user, projects, project, datasets, datasetSelector } = this.props;
    const datasetId = paramDatasetId || datasetSelector.id || (datasets.items.length > 0 && datasets.items[0].datasetId);

    const tabs = [{
      name: 'datasets',
      iconName: 'document',
      baseRoute: 'datasets',
      children: [
        {
          name: 'upload',
          iconName: 'cloud-upload',
          route: 'upload'
        },
        {
          name: 'preloaded',
          iconName: 'add-to-folder',
          route: 'preloaded'
        },
        {
          name: 'inspect',
          iconName: 'eye-open',
          route: ( datasetId ? `/${ datasetId }/inspect` : '/' ),
          disabled: !datasets.items.length
        }
      ]
    }, {
      name: 'visualize',
      iconName: 'timeline-area-chart',
      baseRoute: ( `/${ datasetId }/visualize/explore` ),
      disabled: !datasetId,
      children: []
    }, {
      name: 'analyze',
      iconName: 'function',
      disabled: !datasetId,
      baseRoute: ( `/${ datasetId }/analyze` ),
      children: [
        {
          name: 'aggregate',
          iconName: 'group-objects'
        },
        {
          name: 'correlate',
          iconName: 'scatter-plot'
        },
        {
          name: 'comparison',
          iconName: 'comparison'
        },
        {
          name: 'regression',
          iconName: 'th'
        }
      ]
    }, {
      name: 'stories',
      iconName: 'share',
      disabled: !datasetId,
      children: [],
      baseRoute: ( `/${ datasetId }/compose` )
    }]

    return tabs;
  }

  _getTabList = () => {
    const tabs = this._getTabs();
    const topLevelTabs = tabs.map((t) => t.name);
    const secondLevelTabs = tabs.map((t) => t.children.map((c) => c.name )).reduce((a, b) => a.concat(b));
    return topLevelTabs.concat(secondLevelTabs);
  }

  _toggleSecondaryNav = () => {
    this.setState({ secondaryNavOpen: !this.state.secondaryNavOpen });
  }

  __handleTabsChange = (tab) => {
    if (tab.props.value !== this._getSelectedTab()) {
      this.props.push(`/projects/${ this.props.project.id }/${ tab.props.route }`);
    }
  }

  _getSelectedTab = () => {
    const tabList = this._getTabList();
    const isValidTab = ((tabValue) => tabList.indexOf(tabValue) > -1 );
    const getTabValue = ((tabValue) => {
      const splitTabValue = tabValue.split('/');
      return splitTabValue.length > 1 && isValidTab(splitTabValue[1]) ? splitTabValue[1] : splitTabValue[0];
    });

    const lastPath = this.props.routes.slice().reverse().find((route) => {
      return isValidTab(getTabValue(route.path));
    });    

    if (lastPath) {
      return getTabValue(lastPath.path);
    } else {
      return 'datasets';
    }
  }

  _handleTabsChange = (tab) => {
    if (tab.props.value !== this._getSelectedTab()) {
      this.props.push(`/projects/${ this.props.project.id }/${ tab.props.route }`);
    }
  }

  _onClickLogo = () => {
    this.props.push((this.props.user.anonymous ? '/' : '/projects'));
  }

  onClickRegister = () => {
    this.props.push('/auth/register');
  }

  _logout = () => {
    this.props.logoutUser();
  }

  onSelectProject = (projectId) => {
    this.props.push(`/projects/${ projectId }/datasets`);
  }

  onClickProjectSettings = () => {
    this.setState({ projectSettingsModalOpen: true });
  }

  closeProjectSettingsModal = () => {
    this.setState({ projectSettingsModalOpen: false });
  }

  render() {
    const { paramDatasetId, user, projects, project, datasets, datasetSelector } = this.props;

    const datasetId = paramDatasetId || datasetSelector.id || (datasets.items.length > 0 && datasets.items[0].datasetId);
    const tabs = this._getTabs();

    let popoverContent = (
      <Menu>
        <MenuItem
          iconName="edit"
          onClick={ this.onClickProjectSettings }
          text="Edit Project Properties"
        />
        <MenuItem
          iconName="log-out"
          onClick={ this._logout }
          text={ `Log out of ${ user.username }` }
        />
      </Menu>
    );
    return (
      <div className={ styles.projectSidebar }>
        <div className={ styles.top }>
          <div className={ styles.logoContainer } onClick={ this._onClickLogo }>
            <div className={ styles.logoText }>
              DIVE
            </div>
            <Logo className={ styles.logo } />
          </div>
          {/* <div className={ styles.projectTitle } onClick={ this.onClickProjectSettings }>{ project.title }</div> */}
        </div>

        <Tabs selectedTab={ this._getSelectedTab() } onChange={ this._handleTabsChange } >
          { tabs.map((tabGroup, i) =>
            <TabGroup 
              key={ `tab-group-${ i }` }
              value={ tabGroup.name }
              heading={ `${ i + 1 }. ${ tabGroup.name }` }
              iconName={ tabGroup.iconName }
              disabled={ tabGroup.disabled }
              route={ (tabGroup.children ? `${ tabGroup.baseRoute }/menu` : '') }
            >
              { tabGroup.children.map((tab, j) =>
                <Tab 
                  key={ `tab-${ i }-${ j }` }
                  label={ tab.name }
                  value={ tab.name }
                  disabled={ tab.disabled }
                  iconName={ tab.iconName } 
                  route={ `${ tabGroup.baseRoute }/${ tab.route }` }
                />
              )}
            </TabGroup>
          )}
        </Tabs>

        {/* <Tab label="Transform" value="transform" route={ `datasets${ datasetId ? `/${ datasetId }/transform` : '/combine' }` } active={ !datasetSelector.preloaded } disabled={ !datasets.items.length }/> */}
        {/* <Tabs value={ this._getSelectedTab() } onChange={ this._handleTabsChange } >
          <TabGroup heading="1. Data" value="datasets" iconName='document' route={ `datasets/menu` }>
            <Tab label="Upload" value="upload" route={ `datasets/upload` } />
            <Tab label="Preloaded" value="preloaded" route={ `datasets/preloaded` } />
            <Tab label="Inspect" value="inspect" route={ `datasets${ datasetId ? `/${ datasetId }/inspect` : '/' }` } disabled={ !datasets.items.length }/>
          </TabGroup>
          <TabGroup heading="2. Visualize" value="explore" disabled={ !datasetId } iconName='timeline-area-chart' route={ `datasets/${ datasetId }/visualize/explore` }>
            {/* <Tab label="Explore" value="explore" route={ `datasets/${ datasetId }/visualize/explore` } disabled={ !datasetId }/>
          </TabGroup>
          <TabGroup heading="3. Analyze" value="analyze" disabled={ !datasetId } iconName='variable' route={ `datasets/${ datasetId }/analyze/menu` }>
            <Tab label="Aggregation" value="aggregation" route={ `datasets/${ datasetId }/analyze/aggregation` } disabled={ !datasetId }/>
            <Tab label="Comparison" value="comparison" route={ `datasets/${ datasetId }/analyze/comparison` } disabled={ !datasetId }/>
            <Tab label="Correlation" value="correlation" route={ `datasets/${ datasetId }/analyze/correlation` } disabled={ !datasetId }/>
            <Tab label="Regression" value="regression" route={ `datasets/${ datasetId }/analyze/regression` } disabled={ !datasetId }/>
          </TabGroup>
          <TabGroup heading="4. Stories" value="compose" disabled={ !datasetId } iconName='share' route={ `compose` }>
            {/* <Tab label="Compose" value="compose" route={ `compose` } disabled={ !datasets.items.length }/>
            <Tab label="Saved" value="saved" route={ `compose/saved` } disabled={ true }/>
          </TabGroup>
        </Tabs> */}
        <div className={ styles.bottom + ' pt-dark'}>
          { user.anonymous &&
            <div className={ styles.anonymousUserBottom }>
              <div className={ styles.temporary }>Temporary Project</div>
              <Link className={ styles.register + " pt-button pt-minimal pt-icon-user" } route="/auth/register">Create Account</Link>
            </div>
          }
          { !user.anonymous && project.title &&
            <div>
              <Popover content={ popoverContent }
                interactionKind={ PopoverInteractionKind.HOVER }
                position={ Position.TOP_LEFT }
                useSmartPositioning={ true }
                transitionDuration={ 100 }
                hoverOpenDelay={ 100 }
                hoverCloseDelay={ 100 }
              >
                <div>
                  <span className={ styles.username }>{ user.username }</span>
                  <span className={ styles.expandButton + ' pt-icon-standard pt-icon-menu-open' } />
                </div>
              </Popover>
              <ProjectSettingsModal
                projectName={ project.title }
                projectDescription={ project.description }
                projectId={ project.id }
                isOpen={ this.state.projectSettingsModalOpen }
                closeAction={ this.closeProjectSettingsModal } />
            </div>
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { project, projects, user, datasets, datasetSelector } = state;
  return {
    project,
    projects,
    user,
    datasets,
    datasetSelector
  };
}

export default connect(mapStateToProps, { push, logoutUser })(ProjectSidebar);
