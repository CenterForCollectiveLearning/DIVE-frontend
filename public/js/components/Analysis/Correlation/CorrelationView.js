import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import { selectDataset, fetchDatasets } from '../../../actions/DatasetActions';
import { getCorrelations, getCorrelationScatterplot } from '../../../actions/CorrelationActions';
import { clearAnalysis } from '../../../actions/AnalysisActions';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import HeaderBar from '../../Base/HeaderBar';
import DropDownMenu from '../../Base/DropDownMenu';
import CorrelationTable from './CorrelationTable';
import CorrelationScatterplotCard from './CorrelationScatterplotCard';

export class CorrelationView extends Component {
  componentWillMount() {
    const { projectId, datasetId, correlationVariableNames, getCorrelations, fetchDatasets } = this.props

    if (projectId && datasetId && correlationVariableNames.length) {
      getCorrelations(projectId, datasetId, correlationVariableNames)
    }
  }


  clickDataset(datasetId) {
    const { projectId, clearAnalysis, selectDataset, pushState } = this.props;
    clearAnalysis();
    selectDataset(projectId, datasetId);
    pushState(null, `/projects/${ projectId }/datasets/${ datasetId }/analyze/correlation`);
  }

  componentWillReceiveProps(nextProps) {
    const { projectId, datasetId, correlationVariableNames, getCorrelations, getCorrelationScatterplot, correlationResult } = this.props

    const projectChanged = (nextProps.projectId !== projectId);
    const datasetChanged = (nextProps.datasetId !== datasetId);

    if (nextProps.projectId && nextProps.datasetId) {
      if (projectChanged && nextProps.projectId) {
        fetchDatasets(nextProps.projectId);
      }
    }

    const correlationVariableChanged = nextProps.correlationVariableNames.length != correlationVariableNames.length;
    const twoVariablesSelected = nextProps.correlationVariableNames.length >= 2;
    if (nextProps.projectId && nextProps.datasetId && correlationVariableChanged && twoVariablesSelected) {
      getCorrelations(nextProps.projectId, nextProps.datasetId, nextProps.correlationVariableNames)
    }

    if (nextProps.projectId && nextProps.correlationResult.data && nextProps.correlationResult.data.id && (this.props.correlationResult.data == null || (nextProps.correlationResult.data.id != this.props.correlationResult.data.id))) {
      getCorrelationScatterplot(nextProps.projectId, nextProps.correlationResult.data.id);
    }
  }

  render() {
    const { correlationResult, correlationVariableNames, correlationScatterplots, datasets, datasetId } = this.props;
    const twoCorrelationVariablesSelected = correlationVariableNames.length >= 2;
    const correlationResultHasElements = correlationResult.data && correlationResult.data.rows && correlationResult.data.rows.length > 0;

    var correlationContent;
    if (twoCorrelationVariablesSelected ) {
      correlationContent =
        <div>
          <Card header={
              <span>Correlating {
                correlationVariableNames.map((name, i) =>
                  <span
                    key={ `correlation-title-${ name }-${ i }` }
                    className={ `${ styles.titleField }` }>
                    { name }
                  </span>
                )}
              </span>
            }>
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
      ;
    }

    return (
      <div className={ styles.aggregationViewContainer }>
        <HeaderBar
          header="Correlation Analysis"
          actions={
            datasets.items && datasets.items.length > 0 ?
              <div className={ styles.headerControl }>
                <DropDownMenu
                  prefix="Dataset"
                  width={ 240 }
                  value={ parseInt(datasetId) }
                  options={ datasets.items }
                  valueMember="datasetId"
                  displayTextMember="title"
                  onChange={ this.clickDataset.bind(this) } />
              </div>
            : ''
          }/>
        { correlationContent }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { project, datasets, correlationSelector, datasetSelector, fieldProperties } = state;
  const { correlationScatterplots } = correlationSelector;

  const correlationVariableNames = fieldProperties.items
    .filter((property) => correlationSelector.correlationVariableIds.indexOf(property.id) >= 0)
    .map((field) => field.name);

  return {
    datasets: datasets,
    datasetSelector: datasetSelector,
    projectId: project.properties.id,
    datasetId: datasetSelector.datasetId,
    correlationResult: correlationSelector.correlationResult,
    correlationVariableNames: correlationVariableNames,
    correlationScatterplots: correlationScatterplots
  }
}

export default connect(mapStateToProps, {
  pushState,
  getCorrelations,
  getCorrelationScatterplot,
  selectDataset,
  fetchDatasets,
  clearAnalysis
})(CorrelationView);
