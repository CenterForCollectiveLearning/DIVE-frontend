import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { runRegression, getContributionToRSquared } from '../../../actions/RegressionActions';

import styles from '../Analysis.sass';

import DataGrid from '../../Base/DataGrid';
import HeaderBar from '../../Base/HeaderBar';
import RegressionTableRow from './RegressionTableRow';

import ColumnChart from '../../Visualizations/Charts/ColumnChart';

export class RegressionView extends Component {

  componentWillReceiveProps(nextProps) {
    const { dependentVariableName, independentVariableNames, runRegression, getContributionToRSquared } = this.props;
    const independentVariablesChanged = nextProps.independentVariableNames.length != independentVariableNames.length;
    const dependentVariableChanged = nextProps.dependentVariableName != dependentVariableName;

    if (nextProps.projectId && nextProps.datasetId && (dependentVariableChanged || independentVariablesChanged)) {
      runRegression(nextProps.projectId, nextProps.datasetId, nextProps.dependentVariableName, nextProps.independentVariableNames);
    }

    if (nextProps.projectId && nextProps.regressionResult.id && (nextProps.regressionResult.id != this.props.regressionResult.id)) {
      getContributionToRSquared(nextProps.projectId, nextProps.regressionResult.id);
    }
  }

  render() {
    const { regressionResult, contributionToRSquared, dependentVariableName } = this.props;

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
      ),
      {
        type: 'footerRow',
        field: 'rSquared',
        formattedField: 'R<sup>2</sup>',
        items: regressionResult.regressionsByColumn.map((column) => column.columnProperties.rSquared)
      },
      {
        type: 'footerRow',
        field: 'rSquaredAdjusted',
        formattedField: '<div>R</div><sup>2</sup>',
        items: regressionResult.regressionsByColumn.map((column) => column.columnProperties.rSquaredAdj)
      }
    ];

    var options = {
      backgroundColor: 'transparent',
      headerColor: 'white',
      headerHeight: 0,
      height: 300,
      width: 600,
      legend: { position: 'none' },
      orientation: 'vertical',
    };

    return (
      <div className={ styles.regressionViewContainer }>
        <div className={ styles.regressionCard }>
          <HeaderBar header={ <span>Cascading Linear Regressions of <strong className={ styles.dependentVariableTitle }>{ dependentVariableName }</strong></span> } />

          <div className={ styles.grid }>
            <DataGrid data={ data } customRowComponent={ RegressionTableRow }/>
          </div>

        </div>
        { (contributionToRSquared.length > 0) &&
          <div className={ styles.regressionCard }>
            <HeaderBar header={ <span>Contribution to R<sup>2</sup></span> } />

            <div className={ styles.contributionToRSquared }>
              <ColumnChart
                chartId={ `bar-${regressionResult.id}` }
                data={ contributionToRSquared }
                options={ options } />
            </div>
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { project, regressionSelector, datasetSelector, fieldProperties } = state;
  const { regressionResult, contributionToRSquared } = regressionSelector;

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
    regressionResult: regressionResult,
    contributionToRSquared: contributionToRSquared
  };
}

export default connect(mapStateToProps, { runRegression, getContributionToRSquared })(RegressionView);
