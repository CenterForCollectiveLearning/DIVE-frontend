import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { getCorrelations } from '../../../actions/CorrelationActions';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import HeaderBar from '../../Base/HeaderBar';

export class CorrelationView extends Component {
  componentWillReceiveProps(nextProps) {
    const { correlationVariableNames, getCorrelations } = this.props
    const correlationVariableChanged = nextProps.correlationVariableNames.length != correlationVariableNames.length;
    const twoVariablesSelected = nextProps.correlationVariableNames.length >= 2;
    if (nextProps.projectId && nextProps.datasetId && correlationVariableChanged && twoVariablesSelected) {
      console.log("asdfasdf")
      getCorrelations(nextProps.projectId, nextProps.datasetId, nextProps.correlationVariableNames)
    }

  }
  render() {
    const { correlationResult, correlationVariableNames } = this.props;
    const twoCorrelationVariablesSelected = correlationVariableNames.length >= 2;
    const correlationResultHasElements = correlationResult && correlationResult.rows &&  correlationResult.rows.length > 0;

    console.log(twoCorrelationVariablesSelected);
    console.log(correlationResultHasElements);
    if (twoCorrelationVariablesSelected && correlationResultHasElements) {
      return (
        <div> { correlationResult.rows } </div>
      );
    }

    else {
      return (
        <div> </div>
      );
    }
  }
}

function mapStateToProps(state) {
  const { project, correlationSelector, datasetSelector, fieldProperties } = state;
  const correlationVariableNames = fieldProperties.items
    .filter((property) => correlationSelector.correlationVariableIds.indexOf(property.id) >= 0)
    .map((field) => field.name);

  return {
    projectId: project.properties.id,
    datasetId: datasetSelector.datasetId,
    correlationResult: correlationSelector.correlationResult,
    correlationVariableNames: correlationVariableNames,
  }
}

export default connect(mapStateToProps, { getCorrelations })(CorrelationView);
