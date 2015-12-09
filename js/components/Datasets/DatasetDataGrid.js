import React, { Component, PropTypes } from 'react';

import styles from './Datasets.sass';
import DatasetRow from './DatasetRow';
import DatasetHeaderCell from './DatasetHeaderCell';
import DataGrid from '../Base/DataGrid';

export default class DatasetDataGrid extends Component {

  render() {
    const { dataset, fieldProperties } = this.props;

    var dataRows = [];
    var headerRows = [];

    if (fieldProperties.items.length) {
      const createCellContent = function (value, children) {
        return (
          <span key={ `cell-content-${ value }` } title={ value } className={ styles.cellContent }>
            <span className={ styles.fieldValue }>{ value }</span>
            { children }
          </span>
        );
      };

      const createDataCellContent = ((value) => createCellContent(value));

      const createHeaderCellContent = function(value, fieldProperty, context) {
        return createCellContent(value,
          <DatasetHeaderCell key={ `header-cell-${ value }` } fieldProperty={ fieldProperty } />
        );
      };

      const createCell = function(key, i, value, cellContentGenerator) {
        const fieldProperty = fieldProperties.items.find((fieldProperty) => fieldProperty.index == i);
        return {
          id: fieldProperty.id,
          index: i,
          value: cellContentGenerator(value, fieldProperty, this),
          columnType: fieldProperty.type,
          columnGeneralType: fieldProperty.generalType
        }
      }

      const createHeaderCell = ((key, i) => createCell(key, i, key, createHeaderCellContent));

      const headerRow = Object.keys(dataset.data[0]).map(createHeaderCell);

      dataRows = dataset.data.map(function(row, i) {
        const createDataCell = ((key, j) => createCell(key, j, row[key], createDataCellContent));
        return {
          rowType: 'data',
          items: Object.keys(row).map(createDataCell)
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
        <div className={ styles.scrollContainer }>
          <DataGrid
            containerClassName={ styles.headerRowTable }
            datasetId={ `${ dataset.datasetId }` }
            data={ headerRows }
            customRowComponent={ DatasetRow }/>
          <DataGrid
            containerClassName={ styles.dataRowsTable }
            datasetId={ `${ dataset.datasetId }` }
            data={ dataRows }
            customRowComponent={ DatasetRow }/>
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
