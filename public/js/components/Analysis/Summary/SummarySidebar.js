import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchFieldPropertiesIfNeeded } from '../../../actions/FieldPropertiesActions';
import { selectBinningConfigX, selectBinningConfigY, selectSummaryIndependentVariable, selectAggregationVariable, selectAggregationFunction, selectAggregationWeightVariable } from '../../../actions/SummaryActions';
import styles from '../Analysis.sass';

import AnalysisSidebar from '../AnalysisSidebar';
import SidebarGroup from '../../Base/SidebarGroup';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';
import DropDownMenu from '../../Base/DropDownMenu';
import BinningSelector from '../../Visualizations/Builder/BinningSelector';

export class SummarySidebar extends Component {
  componentWillMount(props) {
    const { project, datasetSelector, fieldProperties, fetchFieldPropertiesIfNeeded } = this.props;

    if (project.properties.id && datasetSelector.datasetId && !fieldProperties.items.length && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { project, datasetSelector, fieldProperties, fetchFieldPropertiesIfNeeded } = nextProps;
    const datasetIdChanged = datasetSelector.datasetId != this.props.datasetSelector.datasetId;

    if (project.properties.id && datasetSelector.datasetId && (datasetIdChanged || !fieldProperties.items.length) && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId)
    }
  }

  render() {
    const nonComparisonVariables = this.props.fieldProperties.items.filter((item) => this.props.summarySelector.comparisonVariablesIds.indexOf(item.id) < 0)
    const aggregationOptions = [{'id': 'count', 'name' : 'count'}, ...nonComparisonVariables.filter((item) => item.generalType == 'q')]
    const numComparisonVariables = this.props.fieldProperties.items.filter((item) => item.generalType == 'q' && this.props.summarySelector.comparisonVariablesIds.indexOf(item.id) >= 0 )
    const numQuantitative = numComparisonVariables.length;
    const { selectBinningConfigX, selectBinningConfigY } = this.props;
    return (
      <AnalysisSidebar selectedTab="summary">
        { this.props.fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Comparison Variables">
            <ToggleButtonGroup
              toggleItems={ this.props.fieldProperties.items.map((item) =>
                new Object({
                  id: item.id,
                  name: item.name,
                  disabled: (item.id == this.props.summarySelector.aggregationVariableId)
                })
              )}
              valueMember="id"
              displayTextMember="name"
              externalSelectedItems={ this.props.summarySelector.comparisonVariablesIds }
              onChange={ this.props.selectSummaryIndependentVariable } />
          </SidebarGroup>
        }
        { this.props.fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Aggregate on">
            <DropDownMenu
              value={ this.props.summarySelector.aggregationVariableId }
              options= {aggregationOptions}
              valueMember="id"
              displayTextMember="name"
              onChange={ this.props.selectAggregationVariable }/>
          </SidebarGroup>
        }
        { this.props.summarySelector.aggregationVariableId != 'count' &&
          <SidebarGroup heading="By">
            <DropDownMenu
              value={ this.props.summarySelector.aggregationFunction}
              options={ [{ 'id':'SUM', 'name':'sum' }, { 'id':'MEAN', 'name':'mean' }] }
              valueMember="id"
              displayTextMember="name"
              onChange={ this.props.selectAggregationFunction }/>
          </SidebarGroup>
        }
        { this.props.summarySelector.aggregationFunction == 'MEAN' && this.props.summarySelector.aggregationVariableId != 'count' &&
          <SidebarGroup heading="Weighted by:">
            <DropDownMenu
              value={ this.props.summarySelector.weightVariableId}
              options={ [{ 'id':'UNIFORM', 'name':'uniform' }, ...this.props.fieldProperties.items.filter((item) => item.generalType == 'q')] }
              valueMember="id"
              displayTextMember="name"
              onChange={ this.props.selectAggregationWeightVariable }/>
          </SidebarGroup>
        }
        { numQuantitative >= 1 &&
          <BinningSelector
            config={ this.props.summarySelector.binningConfigX }
            selectBinningConfig={ selectBinningConfigX }
            name={ numComparisonVariables[0].name }/>
        }
        { numQuantitative == 2 &&
          <BinningSelector
            config={ this.props.summarySelector.binningConfigY }
            selectBinningConfig={ selectBinningConfigY }
            name={ numComparisonVariables[1].name }/>
        }

      </AnalysisSidebar>
    );
  }
}

SummarySidebar.propTypes = {
  project: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object.isRequired,
  fieldProperties: PropTypes.object.isRequired,
  summarySelector: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const { project, datasetSelector, fieldProperties, summarySelector } = state;
  return {
    project,
    datasetSelector,
    fieldProperties,
    summarySelector
  };
}

export default connect(mapStateToProps, { fetchFieldPropertiesIfNeeded, selectBinningConfigX, selectBinningConfigY, selectSummaryIndependentVariable, selectAggregationVariable, selectAggregationFunction, selectAggregationWeightVariable })(SummarySidebar);
