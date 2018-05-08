import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './Compose.sass';

import { formatPlaintextListWithCommas } from '../../helpers/helpers';
import ColoredFieldItems from '../Base/ColoredFieldItems';
import AggregationTable from '../Analysis/Aggregation/AggregationTable';
import AggregationTableOneD from '../Analysis/Aggregation/AggregationTableOneD';

export default class ComposeAggregationPreviewBlock extends Component {
  handleClick = () => {
    const { spec, onClick } = this.props;
    const { aggregationVariablesNames, dependentVariableName, aggregationFunction, id } = spec.spec;
    let desc = `Aggregating ${ formatPlaintextListWithCommas(aggregationVariablesNames) }`;
    if (dependentVariableName == 'count') {
      desc += ` by count`;
    } else {
      desc += (` by ${ aggregationFunction ? aggregationFunction.toLowerCase() : '' } of ${ dependentVariableName }`);
    }
    onClick(spec.id, desc);
  }

  render() {
    const { spec } = this.props;

    const { oneDimensionalContingencyTable, twoDimensionalContingencyTable } = spec.data;
    const { aggregationVariablesNames, dependentVariableName, aggregationFunction } = spec.spec;

    var header = <span>
      Aggregating <ColoredFieldItems fields={ aggregationVariablesNames } />
      { (dependentVariableName == 'count') ? <span> by count</span> : <span> by { (aggregationFunction ? aggregationFunction.toLowerCase() : '') } of <ColoredFieldItems fields={ [ dependentVariableName ] } /></span>}
    </span>;
    return (
      <div className={ styles.contentPreviewBlockContainer + ' pt-card pt-interactive'}
           onClick={ this.handleClick }>
        <div className={ styles.correlationBlock }>
           <span className={ styles.header + ' ' + styles.correlationHeader }>
             { header }
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
