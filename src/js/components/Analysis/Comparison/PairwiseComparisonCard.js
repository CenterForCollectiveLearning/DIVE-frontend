import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import HeaderBar from '../../Base/HeaderBar';

import BareDataGrid from '../../Base/BareDataGrid';
import { getRoundedString } from '../../../helpers/helpers';


export default class PairwiseComparisonCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { id, pairwiseComparisonData } = this.props;

    const data = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: pairwiseComparisonData.columnHeaders
      },
      ...pairwiseComparisonData.rows.map(function(object) {
        return new Object({
          rowClass: styles.dataRow,
          columnClass: styles.dataColumn,
          items: [ ...object.map((value) => <div className={ styles.dataCell }>{ getRoundedString(value) }</div>) ]
        })
      })
    ];

    return (
      <Card header={ <span>Pairwise Comparison with Tukey Post-hoc Test</span> }>
        <div className={ styles.aggregationTable }>
          <BareDataGrid data={ data }/>
        </div>
      </Card>
    );
  }
}

PairwiseComparisonCard.propTypes = {
  id: PropTypes.string,
  pairwiseComparisonData: PropTypes.object.isRequired
}
