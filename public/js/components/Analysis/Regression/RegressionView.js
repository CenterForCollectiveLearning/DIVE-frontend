import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { selectDataset, fetchDatasets } from '../../../actions/DatasetActions';
import { runRegression, getContributionToRSquared, createExportedRegression } from '../../../actions/RegressionActions';
import { clearAnalysis } from '../../../actions/AnalysisActions';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import HeaderBar from '../../Base/HeaderBar';
import RaisedButton from '../../Base/RaisedButton';
import DropDownMenu from '../../Base/DropDownMenu';
import RegressionTableCard from './RegressionTableCard';
import ContributionToRSquaredCard from './ContributionToRSquaredCard';

export class RegressionView extends Component {

  constructor(props) {
    super(props);

    this.saveRegression = this.saveRegression.bind(this);
    this.onClickShare = this.onClickShare.bind(this);
  }

  componentWillMount() {
    const { projectId, datasets, datasetSelector, fetchDatasets } = this.props;

    if (projectId && (!datasetSelector.datasetId || (!datasets.isFetching && !datasets.loaded))) {
      fetchDatasets(projectId);
    }

    clearAnalysis();
  }

  componentWillReceiveProps(nextProps) {
    const { projectId, datasetId, dependentVariableName, independentVariableNames, regressionResult, runRegression, getContributionToRSquared, fetchDatasets } = this.props;
    const independentVariablesChanged = nextProps.independentVariableNames.length != independentVariableNames.length;
    const dependentVariableChanged = (nextProps.dependentVariableName != dependentVariableName);
    const dependentVariableExists = (nextProps.dependentVariableName != null);

    if (nextProps.projectId && nextProps.datasetId && dependentVariableExists && (dependentVariableChanged || independentVariablesChanged)) {
      runRegression(nextProps.projectId, nextProps.datasetId, nextProps.dependentVariableName, nextProps.independentVariableNames);
    }

    if (nextProps.projectId && nextProps.regressionResult.data && nextProps.regressionResult.data.id && (this.props.regressionResult.data == null || (nextProps.regressionResult.data.id != this.props.regressionResult.data.id))) {
      getContributionToRSquared(nextProps.projectId, nextProps.regressionResult.data.id);
    }
  }

  componentDidUpdate(previousProps) {
    const { projectId, datasetId, datasets, fetchDatasets } = this.props
    const projectChanged = (previousProps.projectId !== projectId);
    const datasetChanged = (previousProps.datasetId !== datasetId);

    if (projectChanged || (projectId && (!datasetId || (!datasets.isFetching && !datasets.loaded)))) {
      fetchDatasets(projectId);
    }
  }

  clickDataset(datasetId) {
    const { projectId, clearAnalysis, selectDataset, push } = this.props;
    clearAnalysis();
    selectDataset(projectId, datasetId);
    push(`/projects/${ projectId }/datasets/${ datasetId }/analyze/regression`);
  }

  saveRegression(saveAction = true) {
    const { projectId, regressionResult, createExportedRegression } = this.props;
    createExportedRegression(projectId, regressionResult.data.id, regressionResult.data, saveAction);
  }

  onClickShare() {
    setShareWindow(window.open('about:blank'));
    this.saveRegression(false);
  }

  render() {
    const { datasets, datasetId, regressionResult, contributionToRSquared, dependentVariableName, independentVariableNames } = this.props;
    const disabled = (regressionResult.isSaving || (!regressionResult.isSaving && regressionResult.exportedRegressionId) || regressionResult.exported) ? true : false;

    if ( !regressionResult.loading && (!regressionResult.data || !regressionResult.data.fields || regressionResult.data.fields.length == 0)) {
      return (
        <div className={ styles.regressionViewContainer }></div>
      );
    }

    console.log(regressionResult.exportedRegressionId)
    return (
      <div className={ styles.regressionViewContainer }>
        <HeaderBar
          header="Regression Analysis"
          actions={
            <div className={ styles.headerControlRow }>
              <div className={ styles.headerControl }>
                <RaisedButton onClick={ this.onClickShare }>
                  { regressionResult.isExporting && "Exporting..." }
                  { !regressionResult.isExporting && "Share" }
                </RaisedButton>
              </div>
              <div className={ styles.headerControl }>
                <RaisedButton onClick={ this.saveRegression } disabled={ disabled }>
                  { !regressionResult.isSaving && regressionResult.exportedRegressionId && <i className="fa fa-star"></i> }
                  { !regressionResult.exportedRegressionId && <i className="fa fa-star-o"></i> }
                </RaisedButton>
              </div>
              <div className={ styles.headerControl }>
                { datasets.items && datasets.items.length > 0 ?
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
              : '' }
            </div>
          </div>
        }/>
        { regressionResult.loading &&
          <Card header={ <span>Explaining <strong className={ styles.dependentVariableTitle }>{ dependentVariableName }</strong></span> }>
            <div className={ styles.watermark }>
              { regressionResult.progress != null ? regressionResult.progress : 'Running regressions…' }
            </div>
          </Card>
        }
        { (!regressionResult.loading && regressionResult.data) &&
          <RegressionTableCard
            dependentVariableName={ dependentVariableName }
            independentVariableNames={ independentVariableNames }
            regressionResult={ regressionResult.data || {} }
            contributionToRSquared={ contributionToRSquared }/>
        }

        { (contributionToRSquared.length > 0 && regressionResult.data) &&
          <ContributionToRSquaredCard id={ `${ regressionResult.data.id }` } contributionToRSquared={ contributionToRSquared } />
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { project, datasets, regressionSelector, datasetSelector, fieldProperties } = state;
  const { progress, error, regressionResult, contributionToRSquared } = regressionSelector;

  const dependentVariable = fieldProperties.items.find((property) => property.id == regressionSelector.dependentVariableId);
  const dependentVariableName = dependentVariable ? dependentVariable.name : null;

  const independentVariableNames = fieldProperties.items
    .filter((property) => regressionSelector.independentVariableIds.indexOf(property.id) >= 0)
    .map((independentVariable) => independentVariable.name);

  return {
    datasets: datasets,
    datasetSelector: datasetSelector,
    projectId: project.properties.id,
    dependentVariableName: dependentVariableName,
    independentVariableNames: independentVariableNames,
    datasetId: datasetSelector.datasetId,
    regressionResult: regressionResult,
    contributionToRSquared: contributionToRSquared
  };
}

export default connect(mapStateToProps, {
  push,
  runRegression,
  getContributionToRSquared,
  createExportedRegression,
  selectDataset,
  fetchDatasets,
  clearAnalysis
})(RegressionView);
