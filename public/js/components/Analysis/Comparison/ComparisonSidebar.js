import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchFieldPropertiesIfNeeded } from '../../../actions/FieldPropertiesActions';
import { selectIndependentVariable, selectDependentVariable } from '../../../actions/ComparisonActions';
import styles from '../Analysis.sass';

import Sidebar from '../../Base/Sidebar';
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

    if (project.properties.id && datasetSelector.datasetId && (datasetIdChanged || !fieldProperties.items.length) && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId)
    }
  }

  render() {
    const { fieldProperties, comparisonSelector, selectIndependentVariable, selectDependentVariable } = this.props;
    return (
      <Sidebar selectedTab="comparison">
        { fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Independent Variables">
            <ToggleButtonGroup
              toggleItems={ fieldProperties.items.map((item) =>
                new Object({
                  id: item.id,
                  name: item.name,
                  disabled: (comparisonSelector.dependentVariablesIds.indexOf(item.id) >= 0)

                })
              )}
              valueMember="id"
              displayTextMember="name"
              externalSelectedItems={ comparisonSelector.independentVariablesIds }
              separated={ true }
              onChange={ selectIndependentVariable } />
          </SidebarGroup>
        }
        { fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Dependent Variables">
            <ToggleButtonGroup
              toggleItems={ fieldProperties.items.filter((property) => property.generalType == 'q').map((item) =>
                new Object({
                  id: item.id,
                  name: item.name,
                  disabled: (comparisonSelector.independentVariablesIds.indexOf(item.id) >= 0 || item.generalType == 'c')
                })
              )}
              valueMember="id"
              displayTextMember="name"
              externalSelectedItems={ comparisonSelector.dependentVariablesIds }
              separated={ true }
              onChange={ selectDependentVariable } />
          </SidebarGroup>
        }
      </Sidebar>
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

export default connect(mapStateToProps, { fetchFieldPropertiesIfNeeded, selectIndependentVariable, selectDependentVariable })(ComparisonSidebar);
