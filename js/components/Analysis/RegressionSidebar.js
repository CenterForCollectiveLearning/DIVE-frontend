import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchFieldPropertiesIfNeeded } from '../../actions/FieldPropertiesActions';
import { selectIndependentVariable, selectDependentVariable } from '../../actions/RegressionActions';
import styles from './Analysis.sass';

import AnalysisSidebar from './AnalysisSidebar';
import SidebarGroup from '../Base/SidebarGroup';
import ToggleButtonGroup from '../Base/ToggleButtonGroup';
import DropDownMenu from '../Base/DropDownMenu';

export class RegressionSidebar extends Component {
  componentWillMount(props) {
    const { project, datasetSelector, fieldProperties, fetchFieldPropertiesIfNeeded } = this.props;

    if (project.properties.id && datasetSelector.datasetId && !fieldProperties.items.length && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { project, datasetSelector, fieldProperties, fetchFieldPropertiesIfNeeded } = nextProps;

    if (project.properties.id && datasetSelector.datasetId && !fieldProperties.items.length && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId)
    }
  }

  render() {
    return (
      <AnalysisSidebar selectedTab="regression">
        { this.props.fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Dependent Variable">
            <DropDownMenu
              value={ this.props.regressionSelector.dependentVariableId }
              options={ this.props.fieldProperties.items }
              valueMember="id"
              displayTextMember="name"
              onChange={ this.props.selectDependentVariable }/>
          </SidebarGroup>
        }
        { this.props.fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Independent Variables">
            <ToggleButtonGroup
              toggleItems={ this.props.fieldProperties.items.map((item) =>
                new Object({
                  id: item.id,
                  name: item.name
                })
              )}
              valueMember="id"
              displayTextMember="name"
              externalSelectedItems={ this.props.regressionSelector.independentVariableIds }
              onChange={ this.props.selectIndependentVariable } />
          </SidebarGroup>
        }

      </AnalysisSidebar>
    );
  }
}

RegressionSidebar.propTypes = {
  project: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object.isRequired,
  fieldProperties: PropTypes.object.isRequired,
  regressionSelector: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const { project, datasetSelector, fieldProperties, regressionSelector } = state;
  return {
    project,
    datasetSelector,
    fieldProperties,
    regressionSelector
  };
}

export default connect(mapStateToProps, { fetchFieldPropertiesIfNeeded, selectIndependentVariable, selectDependentVariable })(RegressionSidebar);
