import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { getCorrelations, getCorrelationScatterplot } from '../../../actions/CorrelationActions';

import styles from '../Analysis.sass';

import CorrelationTable from './CorrelationTable';
import CorrelationScatterplotCard from './CorrelationScatterplotCard';
import Card from '../../Base/Card';
import HeaderBar from '../../Base/HeaderBar';

export class CorrelationView extends Component {
  componentWillMount() {
    const {projectId, datasetId, correlationVariableNames, getCorrelations } = this.props

    if (projectId && datasetId && correlationVariableNames.length) {
      getCorrelations(projectId, datasetId, correlationVariableNames)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { correlationVariableNames, getCorrelations, getCorrelationScatterplot, correlationResult } = this.props

    const correlationVariableChanged = nextProps.correlationVariableNames.length != correlationVariableNames.length;
    const twoVariablesSelected = nextProps.correlationVariableNames.length >= 2;
    if (nextProps.projectId && nextProps.datasetId && correlationVariableChanged && twoVariablesSelected) {
      getCorrelations(nextProps.projectId, nextProps.datasetId, nextProps.correlationVariableNames)
    }

    if (nextProps.projectId && nextProps.correlationResult && nextProps.correlationResult.id && (nextProps.correlationResult.id != this.props.correlationResult.id)) {
      getCorrelationScatterplot(nextProps.projectId, nextProps.correlationResult.id);
    }

  }
  render() {
    const { correlationResult, correlationVariableNames, correlationScatterplots } = this.props;
    const twoCorrelationVariablesSelected = correlationVariableNames.length >= 2;
    const correlationResultHasElements = correlationResult.data && correlationResult.data.rows && correlationResult.data.rows.length > 0;

    console.log(correlationResult);
    if (twoCorrelationVariablesSelected ) {
      return (
        <div className={ styles.aggregationViewContainer }>
          <Card>
            <HeaderBar header={
              <span>Correlating {
                correlationVariableNames.map((name, i) =>
                  <span
                    key={ `correlation-title-${ name }-${ i }` }
                    className={ `${ styles.titleField }` }>
                    { name }
                  </span>
                )
              }
              </span>
            } />
            { correlationResult.loading &&
              <div className={ styles.watermark }>
                { correlationResult.progress != null ? correlationResult.progress : 'Running correlations…' }
              </div>
            }
            { (!correlationResult.loading && correlationResultHasElements) &&
              <CorrelationTable correlationResult={ correlationResult.data || {} } />
            }
          </Card>
          { (correlationResultHasElements && correlationScatterplots.length > 0) &&
            <CorrelationScatterplotCard
              data={ correlationScatterplots }
            />
          }
        </div>
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
  const { correlationScatterplots } = correlationSelector;

  const correlationVariableNames = fieldProperties.items
    .filter((property) => correlationSelector.correlationVariableIds.indexOf(property.id) >= 0)
    .map((field) => field.name);

  return {
    projectId: project.properties.id,
    datasetId: datasetSelector.datasetId,
    correlationResult: correlationSelector.correlationResult,
    correlationVariableNames: correlationVariableNames,
    correlationScatterplots: correlationScatterplots
  }
}

export default connect(mapStateToProps, { getCorrelations, getCorrelationScatterplot })(CorrelationView);
