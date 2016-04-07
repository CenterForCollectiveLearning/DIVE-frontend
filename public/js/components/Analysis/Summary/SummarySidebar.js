import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchFieldPropertiesIfNeeded } from '../../../actions/FieldPropertiesActions';
import { selectSummaryIndependentVariable, selectAggregationVariable, selectAggregationFunction, selectAggregationWeightVariable } from '../../../actions/SummaryActions';
import styles from '../Analysis.sass';

import Sidebar from '../../Base/Sidebar';
import SidebarGroup from '../../Base/SidebarGroup';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';
import DropDownMenu from '../../Base/DropDownMenu';

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

    if (project.properties.id && datasetSelector.datasetId && (datasetIdChanged || !fieldProperties.loaded) && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId)
    }
  }

  render() {
    const { fieldProperties, summarySelector, selectSummaryIndependentVariable } = this.props;
    const nonComparisonVariables = this.props.fieldProperties.items.filter((item) => this.props.summarySelector.comparisonVariablesIds.indexOf(item.id) < 0)
    const aggregationOptions = [{'id': 'count', 'name' : 'count'}, ...nonComparisonVariables.filter((item) => item.generalType == 'q')]
    return (
      <Sidebar>
        { this.props.fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Comparison Variables">
            { fieldProperties.items.filter((property) => property.generalType == 'c').length > 0 &&
              <div className={ styles.fieldGroup }>
                <div className={ styles.fieldGroupLabel }>Categorical</div>
                <ToggleButtonGroup
                  toggleItems={ fieldProperties.items.filter((property) => property.generalType == 'c').map((item) =>
                    new Object({
                      id: item.id,
                      name: item.name,
                      disabled: (item.id == summarySelector.aggregationVariableId) || ( item.generalType == 'c' && item.isUnique)
                    })
                  )}
                  displayTextMember="name"
                  valueMember="id"
                  externalSelectedItems={ summarySelector.comparisonVariablesIds }
                  separated={ true }
                  onChange={ selectSummaryIndependentVariable } />
              </div>
            }
            { fieldProperties.items.filter((property) => property.generalType == 't').length > 0 &&
              <div className={ styles.fieldGroup }>
                <div className={ styles.fieldGroupLabel }>Temporal</div>
                <ToggleButtonGroup
                  toggleItems={ fieldProperties.items.filter((property) => property.generalType == 't').map((item) =>
                    new Object({
                      id: item.id,
                      name: item.name,
                      disabled: (item.id == summarySelector.aggregationVariableId)
                    })
                  )}
                  valueMember="id"
                  displayTextMember="name"
                  externalSelectedItems={ summarySelector.comparisonVariablesIds }
                  separated={ true }
                  onChange={ selectSummaryIndependentVariable } />
              </div>
            }
            { fieldProperties.items.filter((property) => property.generalType == 'q').length > 0 &&
              <div className={ styles.fieldGroup }>
                <div className={ styles.fieldGroupLabel }>Quantitative</div>
                <ToggleButtonGroup
                  toggleItems={ fieldProperties.items.filter((property) => property.generalType == 'q').map((item) =>
                    new Object({
                      id: item.id,
                      name: item.name,
                      disabled: (item.id == summarySelector.aggregationVariableId)
                    })
                  )}
                  valueMember="id"
                  displayTextMember="name"
                  externalSelectedItems={ summarySelector.comparisonVariablesIds }
                  separated={ true }
                  onChange={ selectSummaryIndependentVariable } />
              </div>
            }
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

      </Sidebar>
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

export default connect(mapStateToProps, { fetchFieldPropertiesIfNeeded, selectSummaryIndependentVariable, selectAggregationVariable, selectAggregationFunction, selectAggregationWeightVariable })(SummarySidebar);
