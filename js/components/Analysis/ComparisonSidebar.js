import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchFieldPropertiesIfNeeded } from '../../actions/FieldPropertiesActions';
import { selectIndependentVariable } from '../../actions/RegressionActions';
import styles from './Analysis.sass';

import AnalysisSidebar from './AnalysisSidebar';
import SidebarGroup from '../Base/SidebarGroup';
import ToggleButtonGroup from '../Base/ToggleButtonGroup';
import Select from 'react-select';

export class ComparisonSidebar extends Component {
  constructor(props) {
    super(props);

    this.selectIndependentVariable = this.selectIndependentVariable.bind(this);
  }

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

  selectIndependentVariable(independentVariableId) {
    this.props.selectIndependentVariable(independentVariableId);
  }

  render() {
    return (
      <AnalysisSidebar selectedTab="comparison">
        { this.props.fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Independent Variable">
            <Select
              value={ this.props.regressionSelector.independentVariableId }
              options={ this.props.fieldProperties.items.map((property, i) =>
                new Object({
                  value: property.id,
                  label: property.name 
                })
              )}
              onChange={ this.selectIndependentVariable }
              multi={ false }
              clearable={ false }
              searchable={ false } />
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

export default connect(mapStateToProps, { fetchFieldPropertiesIfNeeded, selectIndependentVariable })(ComparisonSidebar);
