import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { runRegression } from '../../../actions/RegressionActions';

import styles from '../Analysis.sass';

import DataGrid from '../../Base/DataGrid';
import RegressionTableRow from './RegressionTableRow';

export class RegressionView extends Component {

  componentWillReceiveProps(nextProps) {
    const { dependentVariableName, independentVariableNames, runRegression } = this.props;
    const independentVariablesChanged = nextProps.independentVariableNames.length != independentVariableNames.length;
    const dependentVariableChanged = nextProps.dependentVariableName != dependentVariableName;

    if (nextProps.projectId && nextProps.datasetId && (dependentVariableChanged || independentVariablesChanged)) {
      runRegression(nextProps.projectId, nextProps.datasetId, nextProps.dependentVariableName, nextProps.independentVariableNames);
    }
  }

  render() {
    const { regressionResult } = this.props;

    if (!regressionResult.fields) {
      return (
        <div className={ styles.regressionViewContainer }></div>
      );
    }

    const data = [
      {
        type: 'tableHeader',
        size: regressionResult.numColumns
      },
      ...regressionResult.fields.map((field) =>
        new Object({
          type: 'dataRow',
          field: field,
          items: regressionResult.regressionsByColumn.map((column) => 
            column.regression.propertiesByField.find((property) => property.field == field)
          )
        })
      )
    ];

    return (
      <div className={ styles.regressionViewContainer }>
        <div className={ styles.grid }>
          <DataGrid data={ data } customRowComponent={ RegressionTableRow }/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { project, regressionSelector, datasetSelector, fieldProperties } = state;
  const { regressionResult } = regressionSelector;

  const dependentVariable = fieldProperties.items.find((property) => property.id == regressionSelector.dependentVariableId);
  const dependentVariableName = dependentVariable ? dependentVariable.name : null;

  const independentVariableNames = fieldProperties.items
    .filter((property) => regressionSelector.independentVariableIds.indexOf(property.id) >= 0)
    .map((independentVariable) => independentVariable.name);

  return {
    projectId: project.properties.id,
    dependentVariableName: dependentVariableName,
    independentVariableNames: independentVariableNames,
    datasetId: datasetSelector.datasetId,
    regressionResult: regressionResult
  };
}

export default connect(mapStateToProps, { runRegression })(RegressionView);
