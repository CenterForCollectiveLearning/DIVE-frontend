import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from './Compose.sass';

import ColoredFieldItems from '../Base/ColoredFieldItems';
import AggregationTable from '../Analysis/Aggregation/AggregationTable';
import AggregationTableOneD from '../Analysis/Aggregation/AggregationTableOneD';

export default class ComposeAggregationPreviewBlock extends Component {
  handleClick = () => {
    const { spec, onClick, id } = this.props;
    const headers = spec.spec.aggregationVariablesNames;
    const desc = `Aggregating ${ headers.slice(0, -1).join(', ') } and ${ headers.slice(-1) }`;
    onClick(spec.id, desc);
  }

  render() {
    const { spec } = this.props;

    const { oneDimensionalContingencyTable, twoDimensionalContingencyTable } = spec.data;
    const { aggregationVariablesNames, dependentVariableName } = spec.spec;
    return (
      <div className={ styles.contentPreviewBlockContainer + ' pt-card pt-interactive'}
           onClick={ this.handleClick }>
        <div className={ styles.correlationBlock }>
           <span className={ styles.header + ' ' + styles.correlationHeader }>
             Aggregating <ColoredFieldItems fields={ aggregationVariablesNames } />
           </span>
            { (oneDimensionalContingencyTable && oneDimensionalContingencyTable.rows) &&
              <AggregationTableOneD
                aggregationResult={ oneDimensionalContingencyTable }
                aggregationVariablesNames={ aggregationVariablesNames }
                preview={ true }
              />
            }
            { (twoDimensionalContingencyTable && twoDimensionalContingencyTable.rows) &&
              <AggregationTable
                aggregationResult={ twoDimensionalContingencyTable }
                aggregationVariablesNames={ aggregationVariablesNames }
                preview={ true }
              />
            }     
        </div>
      </div>
    );
  }
}

ComposeAggregationPreviewBlock.propTypes = {
  spec: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};
