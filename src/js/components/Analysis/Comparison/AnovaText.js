import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getRoundedString } from '../../../helpers/helpers';
import Number from '../../Base/Number';
import styles from '../Analysis.sass';

export default class AnovaText extends Component {
  render() {
    const { dependentVariableNames, independentVariableNames, anovaData, pairwiseComparisonData } = this.props;

    const independentVariableNamesString = independentVariableNames.length > 1 ?
      independentVariableNames
        .map((name) => <b>{ name }</b>)
        .reduce((previousValue, currentValue, index, array) =>
          <span><span>{ previousValue }</span><span>{ (index == array.length - 1 ? ', and ' : ', ') }</span><span>{ currentValue }</span></span>
        )
      : <b>{ independentVariableNames }</b>;

    const F = anovaData.stats[0].stats[3]
    const pValue = anovaData.stats[0].stats[4];
    const numGroups = anovaData.stats[0].stats[0] + 1;

    let numComparisons;
    let numDistinct;
    if (pairwiseComparisonData && pairwiseComparisonData.rows) {
      numComparisons = pairwiseComparisonData.rows.length;
      numDistinct = pairwiseComparisonData.rows.filter((r) => r[5] < 0.05).length;      
    }

    let significanceRating;
    let distinct = false;
    switch (true) {
      case (pValue <= 0.1):
        significanceRating = 'significant';
      case (pValue <= 0.05):
        distinct = true;
        significanceRating = 'very significant';
      case (pValue <= 0.01):
        significanceRating = 'extremely significant';
    }

    const textParams = {
      anovaType: ( independentVariableNames.length > 1 ? 'two-way' : 'one-way' ),
      dependentVariableName: <b>{ dependentVariableNames[0] }</b>,
      independentVariableNames: independentVariableNamesString,
      rSquaredAdjustedText: <div className={ styles.rSquaredAdjust }><div className={ styles.r }>R</div><sup>2</sup></div>,
      rSquaredText: <div className={ styles.rSquared }><div className={ styles.r }>R</div><sup>2</sup></div>,
    }

    return (
      <div className={ styles.anovaSummary }>
        <p className="pt-running-text">
          A { textParams.anovaType } analysis of variance (ANOVA) comparing <b>{ textParams.dependentVariableName }</b> by <b>{ textParams.independentVariableNames }</b> indicates that the different groups of <b>{ textParams.independentVariableNames }</b> are <b>{ distinct ? '' : 'not' } distinct</b>, <b>{ significanceRating }</b> with a p-value of <b>{ getRoundedString(pValue) }</b> (F = { getRoundedString(F) }; significance cut-off p &lt; 0.05).
        </p>
        { pairwiseComparisonData && pairwiseComparisonData.rows && <p className="pt-running-text">
          Post-hoc pairwise comparisons between { numGroups } groups of <b>{ textParams.independentVariableNames }</b> using the Tukey HSD test indicated that <b>{ textParams.dependentVariableName }</b> is significantly distinct (p &lt; 0.05) between { numDistinct } groups.
        </p> }
      </div>
    );
  }
}

AnovaText.propTypes = {
  dependentVariableNames: PropTypes.array.isRequired,
  independentVariableNames: PropTypes.array.isRequired,
  anovaData: PropTypes.object.isRequired,
  pairwiseComparisonData: PropTypes.object.isRequired
}
