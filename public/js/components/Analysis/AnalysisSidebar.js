import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { selectDataset, fetchDatasets } from '../../actions/DatasetActions';
import { clearAnalysis } from '../../actions/AnalysisActions';
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
    const { project, datasets, datasetSelector, fieldProperties, fetchDatasets, fetchFieldPropertiesIfNeeded } = this.props;

    const projectChanged = (nextProps.project.properties.id !== project.properties.id);
    const datasetChanged = (nextProps.datasetSelector.datasetId !== datasetSelector.datasetId);

    if (projectChanged || nextProps.project.properties.id) {
      fetchDatasets(nextProps.project.properties.id);
    }
  }

  _handleTabsChange(tab) {
    this.props.push(`/projects/${ this.props.project.properties.id }/datasets/${ this.props.datasetSelector.datasetId }/analyze/${ tab }`);
  }

  clickDataset(datasetId) {
    const { project, selectedTab, clearAnalysis, selectDataset, push } = this.props;
    clearAnalysis();
    selectDataset(project.properties.id, datasetId);
    push(`/projects/${ project.properties.id }/datasets/${ datasetId }/analyze/${ selectedTab }`);
  }

  render() {
    const { selectedTab, datasets, datasetSelector, children } = this.props;

    const tabItems = [
      {
        label: "Summary",
        type: "summary",
        selected: selectedTab == "summary"
      },
      {
        label: "Correlation",
        type: "correlation",
        selected: selectedTab == "correlation"
      },
      {
        label: "Regression",
        type: "regression",
        selected: selectedTab == "regression"
      },
      {
        label: "Comparison",
        type: "comparison",
        selected: selectedTab == "comparison"
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

        { datasets.items && datasets.items.length > 0 &&
          <SidebarGroup heading="Dataset">
            <DropDownMenu
              value={ parseInt(datasetSelector.datasetId) }
              options={ datasets.items }
              valueMember="datasetId"
              displayTextMember="title"
              onChange={ this.clickDataset.bind(this) } />
          </SidebarGroup>
        }
        { children }
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
  fetchDatasets,
  clearAnalysis,
  push
})(AnalysisSidebar);
