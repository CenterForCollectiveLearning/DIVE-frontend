import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import VariableSummaryRow from './VariableSummaryRow';

export default class VariableSummaryCard extends Component {
  render() {
    const { summaryResult } = this.props;
    const summaryStats = summaryResult.summaryStats

    return (
      <Card>
        <div className={styles.summaryVariableContainer}>
          { summaryStats.items.map(function(obj){
              if (obj.type == 'c'){
                return <VariableSummaryRow stats={obj.stats} variableName={obj.field} columnHeaders={summaryStats.categoricalHeaders} />
              } else {
                return <VariableSummaryRow stats={obj.stats} variableName={obj.field} columnHeaders={summaryStats.numericalHeaders} />
              }
            })
          }
        </div>
      </Card>
    );
  }
}

// RegressionTableCard.propTypes = {
//   dependentVariableName: PropTypes.string,
//   independentVariableNames: PropTypes.object.isRequired
// }
