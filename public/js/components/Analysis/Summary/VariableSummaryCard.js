import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import HeaderBar from '../../Base/HeaderBar';
import VariableSummaryTable from './VariableSummaryTable';

export default class VariableSummaryCard extends Component {
  render() {
    const { summaryResult } = this.props;

    return (
      <Card>
        <HeaderBar header={ <span>Variable Summary</span> } />
        <div className={ styles.summaryVariableContainer }>
          { summaryResult.items.map((item, i) => {
            const columnHeaders = (item.type == 'c') ? summaryResult.categoricalHeaders : summaryResult.numericalHeaders;
            return <VariableSummaryTable
              key={ `variable-summary-table-${ i }` }
              stats={ item.stats }
              variableName={ item.field }
              columnHeaders={ columnHeaders }
              vizData={ item.vizData }/>;
            })
          }
        </div>
      </Card>
    );
  }
}

VariableSummaryCard.propTypes = {
  summaryResult: PropTypes.object.isRequired
}
