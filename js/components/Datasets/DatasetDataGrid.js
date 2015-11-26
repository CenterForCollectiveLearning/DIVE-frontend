import React, { Component, PropTypes } from 'react';

import styles from './Datasets.sass';
import DatasetRow from './DatasetRow';
import DataGrid from '../Base/DataGrid';

export default class DatasetDataGrid extends Component {
  render() {
    const { dataset, fieldProperties } = this.props;

    var dataRows = [];
    var headerRows = [];

    if (fieldProperties.items.length) {
      const createRow = function(key, i, value) {
        const fieldProperty = fieldProperties.items.find((fieldProperty) => fieldProperty.index == i);
        return {
          id: fieldProperty.id,
          index: i,
          value: value,
          columnType: fieldProperty.type,
          columnGeneralType: fieldProperty.generalType
        }
      }
      const createHeaderRow = ((key, i) => createRow(key, i, key));

      const headerRow = Object.keys(dataset.data[0]).map(createHeaderRow);

      dataRows = dataset.data.map(function(row, i) {
        const createDataRow = ((key, j) => createRow(key, j, row[key]));
        return {
          rowType: 'data',
          items: Object.keys(row).map(createDataRow)
        };
      });

      headerRows = [
        {
          rowType: 'header',
          items: headerRow
        }
      ];

    }


    return (
      <div className={ styles.gridContainer }>
        <div className={ styles.xScrollLayer }>
          <DataGrid
            containerClassName={ styles.headerTable }
            datasetId={ `${ dataset.datasetId }` }
            data={ headerRows }
            customRowComponent={ DatasetRow }/>
          <div className={ styles.grid }>
            <div className={ styles.yScrollLayer }>
              <DataGrid
                containerClassName={ styles.dataTable }
                datasetId={ `${ dataset.datasetId }` }
                data={ dataRows }
                customRowComponent={ DatasetRow }/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DatasetDataGrid.propTypes = {
  dataset: PropTypes.object.isRequired,
  fieldProperties: PropTypes.object.isRequired
}

DatasetDataGrid.defaultProps = {
  dataset: {},
  fieldProperties: {}
}
