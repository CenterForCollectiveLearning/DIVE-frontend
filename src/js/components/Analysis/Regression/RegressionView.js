import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Button, NonIdealState } from '@blueprintjs/core';

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

    if (projectId && (!datasetSelector.id || (!datasets.isFetching && !datasets.loaded))) {
      fetchDatasets(projectId);
    }

    clearAnalysis();
  }

  componentWillReceiveProps(nextProps) {
    const { projectId, datasetId, conditionals, regressionType, dependentVariableName, independentVariableNames, interactionTermIds, regressionResult, runRegression, getContributionToRSquared, fetchDatasets, tableLayout, recommendationType } = this.props;

    const conditionalsChanged = nextProps.conditionals.lastUpdated != conditionals.lastUpdated;
    const regressionTypeChanged = nextProps.regressionType != regressionType;
    const independentVariablesChanged = nextProps.independentVariableNames.length != independentVariableNames.length;
    const dependentVariableChanged = (nextProps.dependentVariableName != dependentVariableName);
    const dependentVariableExists = (nextProps.dependentVariableName != null);
    const interactionTermsChanged = nextProps.interactionTermIds != interactionTermIds;
    const tableLayoutChanged = nextProps.tableLayout != tableLayout;
    const recommendationTypeChanged = nextProps.recommendationType != recommendationType;
    const sidebarChanged = conditionalsChanged || dependentVariableChanged || independentVariablesChanged || regressionTypeChanged || interactionTermsChanged || tableLayoutChanged;

    if (nextProps.projectId && nextProps.datasetId && dependentVariableExists && nextProps.independentVariableNames.length > 0 && nextProps.regressionType && sidebarChanged) {
      runRegression(nextProps.projectId, nextProps.datasetId, nextProps.regressionType, nextProps.dependentVariableName, nextProps.independentVariableNames, nextProps.interactionTermIds, nextProps.conditionals.items, nextProps.tableLayout);
    }

    if (nextProps.projectId && nextProps.regressionResult.data && nextProps.regressionResult.data.id && independentVariableNames.length > 1 && (sidebarChanged || regressionResult.data == null || (nextProps.regressionResult.data.id != regressionResult.data.id)) && (tableLayout == 'leaveOneOut')) {
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
    const { datasets, datasetId, regressionResult, recommendationResult, contributionToRSquared, dependentVariableName, independentVariableNames, regressionType, tableLayout } = this.props;
    const saved = (regressionResult.isSaving || (!regressionResult.isSaving && regressionResult.exportedRegressionId) || regressionResult.exported) ? true : false;

    if ( !recommendationResult.loading && !regressionResult.loading && (!regressionResult.data || !regressionResult.data.fields || regressionResult.data.fields.length == 0)) {
      return (
        <div className={ styles.regressionViewContainer }></div>
      );
    }

    let tableCardHeader;
    if (dependentVariableName) {
      tableCardHeader = <span>Explaining <ColoredFieldItems fields={[ dependentVariableName ]} /> in terms of <ColoredFieldItems fields={ independentVariableNames } /></span>
    }

    var regressionContent = <div className={ styles.centeredFill } />;

    if (independentVariableNames.length == 0) {
      if (recommendationResult.loading) {
        regressionContent = <div className={ styles.centeredFill }>
          <Card header={ tableCardHeader }>
            { recommendationResult.loading &&
              <Loader text={ recommendationResult.progress != null ? recommendationResult.progress : 'Recommending initial state' } />
            }
          </Card>
        </div>
      } else {
        regressionContent = <div className={ styles.centeredFill }>
          <NonIdealState
            title='Too Few Independent Variables Selected'
            description='To run a regression, please select one or more independent variables'
            visual='variable'
          />
        </div>
      }
    }
    else if (independentVariableNames.length >= 1) {
      regressionContent =
        <div className={ styles.regressionViewContainer }>
          <HeaderBar
            actions={
              <div className={ styles.headerControlRow }>
                <div className={ styles.headerControl }>
                  <Button
                    iconName='share'
                    onClick={ this.onClickShare }
                    loading={ regressionResult.isExporting }
                  >
                    { !regressionResult.isExporting && "Share" }
                  </Button>
                </div>
                <div className={ styles.headerControl }>
                  <Button
                    onClick={ this.saveRegression }
                    loading={ regressionResult.isSaving }>
                    { !regressionResult.isSaving && !regressionResult.exportedRegressionId &&
                      <div><span className='pt-icon-standard pt-icon-star-empty' />Save</div>
                    }
                    { regressionResult.exportedRegressionId &&
                      <div><span className='pt-icon-standard pt-icon-star' />Saved</div>
                    }
                  </Button>
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

          { (contributionToRSquared.length > 0 && regressionResult.data && tableLayout == 'leaveOneOut') &&
            <ContributionToRSquaredCard id={ `${ regressionResult.data.id }` } contributionToRSquared={ contributionToRSquared } />
          }
        </div>
      ;
    }

    return (
      <div className={ styles.analysisViewContainer }>
        { regressionContent }
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { project, datasets, conditionals, regressionSelector, datasetSelector, fieldProperties } = state;
  const { recommendationResult, progress, error, regressionResult, contributionToRSquared } = regressionSelector;
  const { independentVariablesIds, dependentVariableId, regressionType, tableLayout, recommendationType } = ownProps;

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
    recommendationResult: recommendationResult,
    dependentVariableName: dependentVariableName,
    independentVariableNames: independentVariableNames,
    interactionTermIds: regressionSelector.interactionTermIds,
    datasetId: datasetSelector.id,
    regressionResult: regressionResult,
    contributionToRSquared: contributionToRSquared,
    tableLayout: tableLayout,
    recommendationType: recommendationType
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
