import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

export default class AnovaText extends Component {
  render() {
    const { dependentVariableNames, independentVariableNames, anovaData } = this.props;

    console.log(anovaData);

    const independentVariableNamesString = independentVariableNames.length > 1 ?
      independentVariableNames
        .map((name) => <strong>{ name }</strong>)
        .reduce((previousValue, currentValue, index, array) =>
          <span><span>{ previousValue }</span><span>{ (index == array.length - 1 ? ', and ' : ', ') }</span><span>{ currentValue }</span></span>
        )
      : <strong>{ independentVariableNames }</strong>;


    const pValue = anovaData.stats[0].stats[4];
    let significanceRating;
    switch (true) {
      case (pValue <= 0.1):
        significanceRating = 'significant';
      case (pValue <= 0.05):
        significanceRating = 'very significant';
      case (pValue <= 0.01):
        significanceRating = 'extremely significant';
    }

    console.log(pValue, significanceRating, anovaData.stats[0].stats[4])

    const textParams = {
      anovaType: ( independentVariableNames.length > 1 ? 'two-way' : 'one-way' ),
      dependentVariableName: <strong>{ dependentVariableNames[0] }</strong>,
      independentVariableNames: independentVariableNamesString,
      rSquaredAdjustedText: <div className={ styles.rSquaredAdjust }><div className={ styles.r }>R</div><sup>2</sup></div>,
      rSquaredText: <div className={ styles.rSquared }><div className={ styles.r }>R</div><sup>2</sup></div>,
    }

    return (
      <div className={ styles.regressionSummary }>
        <p className="pt-running-text">
          A <strong>{ textParams.anovaType } analysis of variance (ANOVA)</strong> comparing the different groups of { textParams.dependentVariableName } by { textParams.independentVariableNames } indicates that the groups are distinct, and is <b>{ significanceRating }</b> with a p-value of { pValue }.
        </p>
      </div>
    );
  }
}

AnovaText.propTypes = {
  dependentVariableNames: PropTypes.array.isRequired,
  independentVariableNames: PropTypes.array.isRequired,
  anovaData: PropTypes.object.isRequired,
}
