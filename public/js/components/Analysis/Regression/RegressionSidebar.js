import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import { fetchFieldPropertiesIfNeeded } from '../../../actions/FieldPropertiesActions';
import { selectIndependentVariable } from '../../../actions/RegressionActions';
import styles from '../Analysis.sass';

import AnalysisSidebar from '../AnalysisSidebar';
import SidebarGroup from '../../Base/SidebarGroup';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';
import DropDownMenu from '../../Base/DropDownMenu';

export class RegressionSidebar extends Component {
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

  onSelectDependentVariable(dependentVariable) {
    this.props.pushState(null, `/projects/${ this.props.project.properties.id }/analyze/regression/${ dependentVariable }`);
  }

  render() {
    const { fieldProperties, regressionSelector, selectIndependentVariable } = this.props;

    return (
      <AnalysisSidebar selectedTab="regression">
        { fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Dependent Variable (Y)">
            <DropDownMenu
              value={ regressionSelector.dependentVariableId }
              options={ fieldProperties.items.filter((item) => item.generalType == 'q') }
              valueMember="id"
              displayTextMember="name"
              onChange={ this.onSelectDependentVariable.bind(this) }/>
          </SidebarGroup>
        }
        { fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Explanatory Factors (X)">
            <ToggleButtonGroup
              toggleItems={ fieldProperties.items.map((item) =>
                new Object({
                  id: item.id,
                  name: item.name,
                  disabled: (item.id == regressionSelector.dependentVariableId) || regressionSelector.dependentVariableId == null || ( item.generalType == 'c' && item.isUnique)
                })
              )}
              valueMember="id"
              displayTextMember="name"
              externalSelectedItems={ regressionSelector.independentVariableIds }
              onChange={ selectIndependentVariable } />
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

export default connect(mapStateToProps, { fetchFieldPropertiesIfNeeded, selectIndependentVariable, pushState })(RegressionSidebar);
