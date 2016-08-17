import moment from 'moment';
import React, { Component, PropTypes } from 'react';

import styles from './Datasets.sass';
import DatasetRow from './DatasetRow';
import MetadataRow from './MetadataRow';
import DatasetHeaderCell from './DatasetHeaderCell';
import DatasetMetadataCell from './DatasetMetadataCell';
import DataGrid from '../Base/DataGrid';

export default class DatasetPropertiesPane extends Component {

  render() {
    const { dataset, fieldProperties } = this.props;
    const { nRows, nCols, fieldNames, isTimeSeries, creationDate, updateDate } = dataset.details;
    return (
      <div className={ styles.datasetPropertiesPane }>
        Rows: { nRows }
        Columns: { nCols }
        Created at: { moment(creationDate).format('LLL') }
        Updated at: { moment(updateDate).format('LLL') }
        <div>Cross-Sectional</div>
        <div>Longitudinal</div>
        <div>Time Series</div>
      </div>
    );
  }
}

DatasetPropertiesPane.propTypes = {
  dataset: PropTypes.object.isRequired,
  fieldProperties: PropTypes.object.isRequired
}

DatasetPropertiesPane.defaultProps = {
  dataset: {},
  fieldProperties: {}
}
