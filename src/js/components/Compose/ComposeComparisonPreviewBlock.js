import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from './Compose.sass';

import ColoredFieldItems from '../Base/ColoredFieldItems';
// import ComparisonTable from '../Analysis/Comparison/ComparisonTable';
// import ComparisonTableOneD from './Analysis/Aggregation/AggregationTableOneD';

export default class ComposeComparisonPreviewBlock extends Component {
  handleClick = () => {
    const { spec, onClick, id } = this.props;
    // const headers = spec.data.table.headers;
    // const desc = `Aggregating ${ headers.slice(0, -1).join(', ') } and ${ headers.slice(-1) }`;
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
