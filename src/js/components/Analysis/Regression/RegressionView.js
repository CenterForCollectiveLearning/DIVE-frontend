import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { selectDataset, fetchDatasets } from '../../../actions/DatasetActions';
import { runRegression, getContributionToRSquared, createExportedRegression } from '../../../actions/RegressionActions';
import { clearAnalysis } from '../../../actions/AnalysisActions';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import Loader from '../../Base/Loader';
import HeaderBar from '../../Base/HeaderBar';
import RaisedButton from '../../Base/RaisedButton';
import DropDownMenu from '../../Base/DropDownMenu';
import ColoredFieldItems from '../../Base/ColoredFieldItems';
import RegressionTableCard from './RegressionTableCard';
import ContributionToRSquaredCard from './ContributionToRSquaredCard';

export class RegressionView extends Component {

  componentWillMount() {
    const { projectId, datasets, conditionals, datasetSelector, fetchDatasets } = this.props;

    if (projectId && (!datasetSelector.datasetId || (!datasets.isFetching && !datasets.loaded))) {
      fetchDatasets(projectId);
    }

    clearAnalysis();
  }

  componentWillReceiveProps(nextProps) {
    const { projectId, datasetId, conditionals, regressionType, dependentVariableName, independentVariableNames, interactionTermIds, regressionResult, runRegression, getContributionToRSquared, fetchDatasets } = this.props;

    const conditionalsChanged = nextProps.conditionals.lastUpdated != conditionals.lastUpdated;
    const regressionTypeChanged = nextProps.regressionType != regressionType;
    const independentVariablesChanged = nextProps.independentVariableNames.length != independentVariableNames.length;
    const dependentVariableChanged = (nextProps.dependentVariableName != dependentVariableName);
    const dependentVariableExists = (nextProps.dependentVariableName != null);
    const interactionTermsChanged = nextProps.interactionTermIds != interactionTermIds;
    const sidebarChanged = conditionalsChanged || dependentVariableChanged || independentVariablesChanged || regressionTypeChanged || interactionTermsChanged;

    if (nextProps.projectId && nextProps.datasetId && dependentVariableExists && nextProps.regressionType && sidebarChanged) {
      runRegression(nextProps.projectId, nextProps.datasetId, nextProps.regressionType, nextProps.dependentVariableName, nextProps.independentVariableNames, nextProps.interactionTermIds, nextProps.conditionals.items);
    }

    if (nextProps.projectId && nextProps.regressionResult.data && nextProps.regressionResult.data.id && (sidebarChanged || regressionResult.data == null || (nextProps.regressionResult.data.id != regressionResult.data.id))) {
      getContributionToRSquared(nextProps.projectId, nextProps.regressionResult.data.id, nextProps.conditionals.items);
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

  saveRegression = (saveAction = true) => {
    const { projectId, regressionResult, createExportedRegression } = this.props;
    createExportedRegression(projectId, regressionResult.data.id, regressionResult.data, regressionResult.conditionals, regressionResult.config, saveAction);
  }

  onClickShare = () => {
    setShareWindow(window.open('about:blank'));
    this.saveRegression(false);
  }

  render() {
    const { datasets, datasetId, regressionResult, contributionToRSquared, dependentVariableName, independentVariableNames, regressionType } = this.props;
    const saved = (regressionResult.isSaving || (!regressionResult.isSaving && regressionResult.exportedRegressionId) || regressionResult.exported) ? true : false;

    if ( !regressionResult.loading && (!regressionResult.data || !regressionResult.data.fields || regressionResult.data.fields.length == 0)) {
      return (
        <div className={ styles.regressionViewContainer }></div>
      );
    }

    let tableCardHeader;
    if (dependentVariableName) {
      tableCardHeader = <span>Explaining <ColoredFieldItems fields={[ dependentVariableName ]} /> in terms of <ColoredFieldItems fields={ independentVariableNames } /></span>
    }

    return (
      <div className={ styles.analysisViewContainer }>
        <HeaderBar
          actions={
            <div className={ styles.headerControlRow }>
              <div className={ styles.headerControl }>
                <RaisedButton onClick={ this.onClickShare }>
                  { regressionResult.isExporting && "Exporting..." }
                  { !regressionResult.isExporting && "Share" }
                </RaisedButton>
              </div>
              <div className={ styles.headerControl }>
                <RaisedButton onClick={ this.saveRegression } active={ saved }>
                  { !regressionResult.isSaving && regressionResult.exportedRegressionId && <i className="fa fa-star"></i> }
                  { !regressionResult.exportedRegressionId && <i className="fa fa-star-o"></i> }
                </RaisedButton>
              </div>
          </div>
        }

      />
        { regressionResult.loading &&
          <Card header={ tableCardHeader }>
            <Loader text={ regressionResult.progress != null ? regressionResult.progress : 'Running regressions…' } />
          </Card>
        }
        { (!regressionResult.loading && regressionResult.data) &&
          <RegressionTableCard
            regressionType={ regressionType }
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

function mapStateToProps(state, ownProps) {
  const { project, datasets, conditionals, regressionSelector, datasetSelector, fieldProperties } = state;
  const { progress, error, regressionResult, contributionToRSquared } = regressionSelector;
  const { independentVariablesIds, dependentVariableId, regressionType } = ownProps;

  console.log('regressionType', regressionType);

  const dependentVariable = fieldProperties.items.find((property) => property.id == dependentVariableId);
  const dependentVariableName = dependentVariable ? dependentVariable.name : null;

  const independentVariableNames = fieldProperties.items
    .filter((property) => independentVariablesIds.indexOf(property.id) >= 0)
    .map((independentVariable) => independentVariable.name);

  return {
    conditionals,
    datasets,
    datasetSelector,
    projectId: project.id,
    regressionType: regressionType,
    dependentVariableName: dependentVariableName,
    independentVariableNames: independentVariableNames,
    interactionTermIds: regressionSelector.interactionTermIds,
    datasetId: datasetSelector.datasetId,
    regressionResult: regressionResult,
    contributionToRSquared: contributionToRSquared,
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
