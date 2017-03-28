import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from './Compose.sass';

import { formatPlaintextListWithCommas } from '../../helpers/helpers';
import ColoredFieldItems from '../Base/ColoredFieldItems';
import AnovaBoxplotCard from '../Analysis/Comparison/AnovaBoxplotCard';

export default class ComposeComparisonPreviewBlock extends Component {
  handleClick = () => {
    const { spec, onClick } = this.props;
    const { dependentVariablesNames, independentVariablesNames } = spec.spec;

    let desc;
    if ((independentVariablesNames.length >= 2 && dependentVariablesNames.length == 0) || (independentVariablesNames.length == 0 && dependentVariablesNames.length >= 2)) {
      const numericalComparisonFields = independentVariablesNames.length ? independentVariablesNames : dependentVariablesNames;
      desc = `Comparing Distributions of ${ formatPlaintextListWithCommas(numericalComparisonFields) }`;
    } else {
      desc = `Comparing ${ formatPlaintextListWithCommas(independentVariablesNames)} by ${ formatPlaintextListWithCommas(dependentVariablesNames) }`;
    }

    onClick(spec.id, desc);
  }

  render() {
    const { spec } = this.props;

    const { dependentVariablesNames, independentVariablesNames } = spec.spec;
    const { anovaBoxplot, pairwiseComparison, anova, numericalComparison } = spec.data;

    const canRunAnova = independentVariablesNames.length >= 1 && dependentVariablesNames.length >= 1;

    let cardHeader;
    if ((independentVariablesNames.length >= 2 && dependentVariablesNames.length == 0) || (independentVariablesNames.length == 0 && dependentVariablesNames.length >= 2)) {
      const numericalComparisonFields = independentVariablesNames.length ? independentVariablesNames : dependentVariablesNames;
      cardHeader = <span>Comparing Distributions of <ColoredFieldItems fields={ numericalComparisonFields } /></span>
    } else {
      cardHeader = <span>Comparing <ColoredFieldItems fields={ independentVariablesNames } /> by <ColoredFieldItems fields={ dependentVariablesNames } /></span>
    }

    return (
      <div className={ styles.contentPreviewBlockContainer + ' pt-card pt-interactive'}
           onClick={ this.handleClick }>
        <div className={ styles.correlationBlock }>
           <span className={ styles.header + ' ' + styles.correlationHeader }>
              { cardHeader }
              { anovaBoxplot && anovaBoxplot.data &&
                <AnovaBoxplotCard
                  id={ `preview-${ spec.id }`}
                  anovaBoxplotData={ anovaBoxplot }
                  showHeader={ false }
                  isMinimalView={ true }
                />
              }
           </span>
        </div>
      </div>
    );
  }
}

ComposeComparisonPreviewBlock.propTypes = {
  spec: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};
