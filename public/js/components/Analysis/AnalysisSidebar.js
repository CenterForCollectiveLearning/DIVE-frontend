import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import { selectDataset, fetchDatasetsIfNeeded } from '../../actions/DatasetActions';
import styles from './Analysis.sass';

import DropDownMenu from '../Base/DropDownMenu';
import Sidebar from '../Base/Sidebar';
import SidebarGroup from '../Base/SidebarGroup';
import ToggleButtonGroup from '../Base/ToggleButtonGroup';

export class AnalysisSidebar extends Component {
  constructor(props) {
    super(props);

    this._handleTabsChange = this._handleTabsChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { project, datasets, datasetSelector, fieldProperties, fetchDatasetsIfNeeded, fetchFieldPropertiesIfNeeded } = this.props;

    const projectChanged = (nextProps.project.properties.id !== project.properties.id);
    const datasetChanged = (nextProps.datasetSelector.datasetId !== datasetSelector.datasetId);

    if (projectChanged || nextProps.project.properties.id) {
      fetchDatasetsIfNeeded(nextProps.project.properties.id);
    }
  }

  _handleTabsChange(tab){
    this.props.pushState(null, `/projects/${ this.props.project.properties.id }/analyze/${ tab }`);
  }

  render() {
    const tabItems = [
      {
        label: "Regression",
        type: "regression",
        selected: this.props.selectedTab == "regression"
      },
      {
        label: "Summary",
        type: "summary",
        selected: this.props.selectedTab == "summary"
      },
      {
        label: "Comparison",
        type: "comparison",
        selected: this.props.selectedTab == "comparison"
      }
    ];

    return (
      <Sidebar>
        <SidebarGroup>
          <ToggleButtonGroup
            toggleItems={ tabItems }
            displayTextMember="label"
            valueMember="type"
            onChange={ this._handleTabsChange.bind(this) } />
        </SidebarGroup>

        { this.props.datasets.items && this.props.datasets.items.length > 0 &&
          <SidebarGroup heading="Dataset">
            <DropDownMenu
              value={ `${this.props.datasetSelector.datasetId}` }
              options={ this.props.datasets.items }
              valueMember="datasetId"
              displayTextMember="title"
              onChange={ this.props.selectDataset } />
          </SidebarGroup>
        }
        { this.props.children }
      </Sidebar>
    );
  }
}

AnalysisSidebar.propTypes = {
  project: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object.isRequired,
  selectedTab: PropTypes.string.isRequired,
  children: PropTypes.node
};

function mapStateToProps(state) {
  const { project, datasets, datasetSelector } = state;
  return {
    project,
    datasets,
    datasetSelector
  };
}

export default connect(mapStateToProps, {
  selectDataset,
  fetchDatasetsIfNeeded,
  pushState
})(AnalysisSidebar);
