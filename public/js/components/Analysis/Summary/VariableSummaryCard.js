import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import VariableSummaryRow from './VariableSummaryRow';

export default class VariableSummaryCard extends Component {
  render() {
    const { summaryResult } = this.props;

    return (
      <Card>
        <div className={styles.summaryVariableColumn}>
          { summaryResult.items.map(function(obj){
              if (obj.type == 'c'){
                return <VariableSummaryRow stats={obj.stats} variableName={obj.field} columnHeaders={summaryResult.categoricalHeaders} vizData={obj.vizData}/>
              } else {
                return <VariableSummaryRow stats={obj.stats} variableName={obj.field} columnHeaders={summaryResult.numericalHeaders} vizData={obj.vizData}/>
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
