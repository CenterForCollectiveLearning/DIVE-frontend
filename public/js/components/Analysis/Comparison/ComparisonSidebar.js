import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchFieldPropertiesIfNeeded } from '../../../actions/FieldPropertiesActions';
import { selectComparisonVariable, selectAggregationVariable, selectAggregationFunction, selectComparisonWeightVariable} from '../../../actions/ComparisonActions';
import styles from '../Analysis.sass';

import AnalysisSidebar from '../AnalysisSidebar';
import SidebarGroup from '../../Base/SidebarGroup';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';
import DropDownMenu from '../../Base/DropDownMenu';

export class ComparisonSidebar extends Component {
  componentWillMount(props) {
    const { project, datasetSelector, fieldProperties, fetchFieldPropertiesIfNeeded } = this.props;

    if (project.properties.id && datasetSelector.datasetId && !fieldProperties.items.length && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { project, datasetSelector, fieldProperties, fetchFieldPropertiesIfNeeded } = nextProps;
    const datasetIdChanged = datasetSelector.datasetId != this.props.datasetSelector.datasetId;

    if (project.properties.id && datasetSelector.datasetId && datasetIdChanged && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId)
    }
  }



  render() {
    return (
      <AnalysisSidebar selectedTab="comparison">
        { this.props.fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Comparison Variables">
            <ToggleButtonGroup
              toggleItems={ this.props.fieldProperties.items.map((item) =>
                new Object({
                  id: item.id,
                  name: item.name,
                  disabled: (item.id == this.props.comparisonSelector.aggregationVariableId || item.generalType == 'q')
                })
              )}
              valueMember="id"
              displayTextMember="name"
              externalSelectedItems={ this.props.comparisonSelector.comparisonVariablesIds }
              onChange={ this.props.selectComparisonVariable } />
          </SidebarGroup>
        }
        { this.props.fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Aggregate on">
            <DropDownMenu
              value={ this.props.comparisonSelector.aggregationVariableId }
              options= {[{'id': 'count', 'name' : 'count'}, ...this.props.fieldProperties.items.filter((item) => item.generalType == 'q')]}
              valueMember="id"
              displayTextMember="name"
              onChange={ this.props.selectAggregationVariable}/>
          </SidebarGroup>
        }
        { this.props.comparisonSelector.aggregationVariableId != 'count' &&
          <SidebarGroup heading="By">
            <DropDownMenu
              value={ this.props.comparisonSelector.aggregationFunction}
              options={ [{'id':'SUM', 'name':'sum'}, {'id':'MEAN', 'name':'mean'}] }
              valueMember="id"
              displayTextMember="name"
              onChange={ this.props.selectAggregationFunction}/>
          </SidebarGroup>
        }
        { this.props.comparisonSelector.aggregationFunction == 'MEAN' && this.props.comparisonSelector.aggregationVariableId != 'count' &&
          <SidebarGroup heading="Weighted by:">
            <DropDownMenu
              value={ this.props.comparisonSelector.weightVariableId}
              options={ [{'id':'UNIFORM', 'name':'uniform'}, ...this.props.fieldProperties.items.filter((item) => item.generalType == 'q')] }
              valueMember="id"
              displayTextMember="name"
              onChange={ this.props.selectComparisonWeightVariable}/>
          </SidebarGroup>
        }

      </AnalysisSidebar>
    );
  }
}

ComparisonSidebar.propTypes = {
  project: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object.isRequired,
  fieldProperties: PropTypes.object.isRequired,
  comparisonSelector: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const { project, datasetSelector, fieldProperties, comparisonSelector } = state;
  return {
    project,
    datasetSelector,
    fieldProperties,
    comparisonSelector
  };
}

export default connect(mapStateToProps, { fetchFieldPropertiesIfNeeded, selectComparisonVariable, selectAggregationVariable, selectAggregationFunction, selectComparisonWeightVariable})(ComparisonSidebar);
