import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Button, Intent, NonIdealState } from '@blueprintjs/core';

import { selectDataset, fetchDatasets } from '../../../actions/DatasetActions';
import { runRegression, createExportedRegression } from '../../../actions/RegressionActions';
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
    const { projectId, datasetId, conditionals, fieldProperties, regressionType, dependentVariable, independentVariables, dependentVariableName, independentVariableNames, interactionTermIds, regressionResult, runRegression, fetchDatasets, tableLayout, recommendationType } = this.props;

    const conditionalsChanged = nextProps.conditionals.lastUpdated != conditionals.lastUpdated;
    const regressionTypeChanged = nextProps.regressionType != regressionType;
    const independentVariablesChanged = nextProps.independentVariableNames.length != independentVariableNames.length;
    const dependentVariableChanged = (nextProps.dependentVariableName != dependentVariableName);
    const dependentVariableExists = (nextProps.dependentVariableName != null);
    const interactionTermsChanged = nextProps.interactionTermIds != interactionTermIds;
    const tableLayoutChanged = nextProps.tableLayout != tableLayout;
    const recommendationTypeChanged = nextProps.recommendationType != recommendationType;
    const fieldPropertiesChanged = nextProps.fieldProperties.lastUpdated != fieldProperties.lastUpdated;
    const sidebarChanged = conditionalsChanged || dependentVariableChanged || independentVariablesChanged || fieldPropertiesChanged || regressionTypeChanged || interactionTermsChanged || tableLayoutChanged;

    if (nextProps.projectId && nextProps.datasetId && dependentVariableExists && nextProps.independentVariableNames.length > 0 && nextProps.regressionType && sidebarChanged) {
      runRegression(nextProps.projectId, nextProps.datasetId, nextProps.regressionType, nextProps.dependentVariable, nextProps.independentVariables, nextProps.interactionTermIds, nextProps.conditionals.items, nextProps.tableLayout);
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
    const { datasets, datasetId, regressionResult, recommendationResult, dependentVariableName, independentVariableNames, regressionType, tableLayout } = this.props;
    const { isSaving, isExporting, exportedRegressionId, exported, error, progress, loading, data } = regressionResult;
    const { table, contributionToRSquared } = data;

    const saved = (isSaving || (!isSaving && exportedRegressionId) || exported) ? true : false;

    const errorComponent = ( <div className={ styles.centeredFill }>
      <NonIdealState
        title='Error Running Regression'
        description={ error }
        visual='error'
        action={ <div className={ styles.errorAction }>
          <div>Please change your selection or</div>
          <Button
            onClick={ () => location.reload() }
            iconName='refresh'
            intent={ Intent.PRIMARY }
            text="Refresh DIVE" />
          </div>
      }
      />
    </div> );

    if ( !recommendationResult.loading && error && !loading && (!data.table || !data.table.fields || data.table.fields.length == 0)) {
      return errorComponent;
    }

    let tableCardHeader;
    if (dependentVariableName) {
      tableCardHeader = <span>Explaining <ColoredFieldItems fields={[ dependentVariableName ]} /> in terms of <ColoredFieldItems fields={ independentVariableNames } /></span>
    }

    var regressionContent = <div className={ styles.centeredFill } />;

    if (error) {
      return errorComponent;
    }

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
                    loading={ isExporting }
                  >
                    { !isExporting && "Share" }
                  </Button>
                </div>
                <div className={ styles.headerControl }>
                  <Button
                    onClick={ this.saveRegression }
                    loading={ isSaving }>
                    { !isSaving && !exportedRegressionId &&
                      <div><span className='pt-icon-standard pt-icon-star-empty' />Save</div>
                    }
                    { exportedRegressionId &&
                      <div><span className='pt-icon-standard pt-icon-star' />Saved</div>
                    }
                  </Button>
                </div>
            </div>
            }
          />
          { loading &&
            <Card header={ tableCardHeader }>
              <Loader text={ progress != null ? progress : 'Running regressions…' } />
            </Card>
          }
          { (!loading && table.regressionsByColumn && table.fields) &&
            <RegressionTableCard
              regressionType={ regressionType }
              dependentVariableName={ dependentVariableName }
              independentVariableNames={ independentVariableNames }
              regressionResult={ table || {} }
              contributionToRSquared={ contributionToRSquared }/>
          }

          { (!loading && contributionToRSquared.length > 0 && tableLayout == 'leaveOneOut') &&
            <ContributionToRSquaredCard id={ `${ table.id }` } contributionToRSquared={ contributionToRSquared } />
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
  const { recommendationResult, regressionResult } = regressionSelector;
  const { independentVariablesIds, dependentVariableId, regressionType, tableLayout, recommendationType } = ownProps;

  const dependentVariable = fieldProperties.items.find((property) => property.id == dependentVariableId);
  const dependentVariableName = dependentVariable ? dependentVariable.name : null;

  const independentVariables = fieldProperties.items
    .filter((property) => independentVariablesIds.indexOf(property.id) >= 0);

  const independentVariableNames = independentVariables.map((independentVariable) => independentVariable.name);

  return {
    conditionals,
    datasets,
    datasetSelector,
    fieldProperties,
    projectId: project.id,
    regressionType: regressionType,
    recommendationResult: recommendationResult,
    dependentVariable: dependentVariable,
    independentVariables: independentVariables,
    dependentVariableName: dependentVariableName,
    independentVariableNames: independentVariableNames,
    interactionTermIds: regressionSelector.interactionTermIds,
    datasetId: datasetSelector.id,
    regressionResult: regressionResult,
    tableLayout: tableLayout,
    recommendationType: recommendationType
  };
}

export default connect(mapStateToProps, {
  push,
  runRegression,
  createExportedRegression,
  selectDataset,
  fetchDatasets,
  clearAnalysis
})(RegressionView);
