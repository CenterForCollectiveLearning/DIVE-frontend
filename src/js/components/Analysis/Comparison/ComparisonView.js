import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Button, Intent, NonIdealState } from '@blueprintjs/core';

import styles from '../Analysis.sass';

import { selectDataset, fetchDatasets } from '../../../actions/DatasetActions';
import { runComparison } from '../../../actions/ComparisonActions';
import { clearAnalysis } from '../../../actions/AnalysisActions';

import Card from '../../Base/Card';
import Loader from '../../Base/Loader';
import StatsTable from './StatsTable';
import NumericalComparisonText from './NumericalComparisonText'
import AnovaTable from './AnovaTable';
import AnovaText from './AnovaText';
import PairwiseComparisonCard from './PairwiseComparisonCard';
import AnovaBoxplotCard from './AnovaBoxplotCard';

import HeaderBar from '../../Base/HeaderBar';
import RaisedButton from '../../Base/RaisedButton';
import DropDownMenu from '../../Base/DropDownMenu';
import ColoredFieldItems from '../../Base/ColoredFieldItems';

export class ComparisonView extends Component {

  componentWillMount() {
    const {
      projectId,
      datasets,
      datasetId,
      fetchDatasets,
      independentVariableNames,
      dependentVariableNames,
      runComparison,
      canRunAnova,
      canRunNumericalComparison,
      conditionals
    } = this.props;

    if (projectId && (!datasetId || (!datasets.isFetching && !datasets.loaded))) {
      fetchDatasets(projectId);
    }

    if (projectId && datasetId && (canRunAnova || canRunNumericalComparison)) {
      runComparison(projectId, datasetId, dependentVariableNames, independentVariableNames, conditionals.items)
    }

    clearAnalysis();
  }

  componentWillReceiveProps(nextProps) {
    const {
      conditionals,
      independentVariableNames,
      dependentVariableNames,
      runComparison,
    } = this.props;

    const {
      projectId: nextProjectId,
      datasetId: nextDatasetId,
      conditionals: nextConditionals,
      independentVariableNames: nextIndependentVariableNames,
      dependentVariableNames: nextDependentVariableNames,
      independentVariableNamesAndTypes: nextIndependentVariableNamesAndTypes,
      canRunNumericalComparison: nextCanRunNumericalComparison,
      canRunAnova: nextCanRunAnova
    } = nextProps;

    const conditionalsChanged = nextProps.conditionals.lastUpdated != conditionals.lastUpdated;
    const independentVariablesChanged = nextIndependentVariableNames.length != independentVariableNames.length;
    const dependentVariablesChanged = nextDependentVariableNames.length != dependentVariableNames.length;
    const sideBarChanged = independentVariablesChanged || dependentVariablesChanged || conditionalsChanged;

    if (nextProjectId && nextDatasetId && sideBarChanged && (nextCanRunAnova || nextCanRunNumericalComparison)) {
      runComparison(nextProjectId, nextDatasetId, nextDependentVariableNames, nextIndependentVariableNames, nextConditionals.items);
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

  render() {
    const { datasets, datasetId, fieldNameToColor, comparisonResult, independentVariableNames, dependentVariableNames, canRunNumericalComparison } = this.props;
    const { loading, progress, error } = comparisonResult;
    const { anovaBoxplot, pairwiseComparison, anova, numericalComparison } = comparisonResult.data;

    const atLeastTwoVariablesSelectedOfOneType = independentVariableNames.length >= 2 || dependentVariableNames.length >= 2;
    const anovaResultNotEmpty = anova && anova.stats && anova.stats.length > 0;
    const anovaCanBeDisplayed = independentVariableNames.length && dependentVariableNames.length && anovaResultNotEmpty;

    let cardHeader;
    if (canRunNumericalComparison) {
      const numericalComparisonFields = independentVariableNames.length ? independentVariableNames : dependentVariableNames;
      cardHeader = <span>Comparing Distributions of <ColoredFieldItems fields={ numericalComparisonFields } /></span>
    } else if (anovaCanBeDisplayed) {
      cardHeader = <span>ANOVA Table Comparing <ColoredFieldItems fields={ independentVariableNames } /> by <ColoredFieldItems fields={ dependentVariableNames } /></span>
    }

    const errorComponent = ( <div className={ styles.centeredFill }>
      <NonIdealState
        title='Error Running Comparison'
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

    if (!loading && error) {
      return errorComponent;
    }

    var comparisonContent = <div></div>;

    if (loading) {
      comparisonContent = <Card header={ cardHeader }>
        <Loader text={ progress != null ? progress : 'Running comparison…' } />
      </Card>
    } else {
      if (canRunNumericalComparison && numericalComparison) {
        comparisonContent =
          <Card header={ cardHeader }>
            <StatsTable numericalData={ numericalComparison } />
          </Card>

      } else if (anovaCanBeDisplayed && anova) {
        comparisonContent =
          <div>
            <Card header={ cardHeader } helperText='anova' >
              <AnovaTable anovaData={ anova } />
              <AnovaText
                dependentVariableNames={ dependentVariableNames }
                independentVariableNames={ independentVariableNames }
                anovaData={ anova }
              />
            </Card>
            { pairwiseComparison && pairwiseComparison.rows && pairwiseComparison.rows.length > 0 &&
              <PairwiseComparisonCard
                pairwiseComparisonData={ pairwiseComparison }
              />
            }
            { anovaBoxplot && anovaBoxplot.data &&
              <AnovaBoxplotCard
                anovaBoxplotData={ anovaBoxplot }
              />
            }
          </div>
        } else {
        comparisonContent = <div className={ styles.centeredFill }>
          <NonIdealState
            title='Too Few Variables Selected'
            description='To run a comparison, please select two or more variables'
            visual='variable'
          />
        </div>
      }
    }

    return (
      <div className={ styles.analysisViewContainer }>
        { comparisonContent }
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { project, datasets, comparisonSelector, datasetSelector, fieldProperties, conditionals } = state;
  const { independentVariablesIds, dependentVariablesIds } = ownProps;

  const independentVariableNames = fieldProperties.items
    .filter((property) => independentVariablesIds.indexOf(property.id) >= 0)
    .map((field) => field.name);

  const dependentVariableNames = fieldProperties.items
    .filter((property) => dependentVariablesIds.indexOf(property.id) >= 0)
    .map((field) => field.name);

  const qIndependentVariableCount = fieldProperties.items
    .filter((fp) => independentVariablesIds.indexOf(fp.id) >= 0 && fp.generalType == 'q').length;

  const qDependentVariableCount = fieldProperties.items
    .filter((fp) => dependentVariablesIds.indexOf(fp.id) >= 0 && fp.generalType == 'q').length;

  const canRunNumericalComparison = (qIndependentVariableCount >= 2 || qDependentVariableCount >= 2);
  const canRunAnova = independentVariableNames.length >= 1 && dependentVariableNames.length >= 1;


  return {
    datasets,
    datasetSelector,
    comparisonResult: comparisonSelector.comparisonResult,
    projectId: project.id,
    datasetId: datasetSelector.id,
    canRunAnova,
    canRunNumericalComparison,
    independentVariableNames,
    dependentVariableNames,
    conditionals,
    independentVariablesIds,
    dependentVariablesIds
  };
}

export default connect(mapStateToProps, {
  runComparison,
  selectDataset,
  fetchDatasets,
  clearAnalysis
})(ComparisonView);
