import React, { Component, PropTypes } from 'react';

import styles from './Datasets.sass';
import DatasetRow from './DatasetRow';
import MetadataRow from './MetadataRow';
import DatasetHeaderCell from './DatasetHeaderCell';
import DatasetMetadataCell from './DatasetMetadataCell';
import DataGrid from '../Base/DataGrid';

export default class DatasetDataGrid extends Component {

  render() {
    const { dataset, fieldProperties } = this.props;

    var dataRows = [];
    var headerRows = [];
    var metadataRows = [];

    if (fieldProperties.items.length && fieldProperties.datasetId == dataset.datasetId) {
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

      const createMetadataCellContent = function(value, fieldProperty, context) {
        return (
          <span key={ `cell-content-${ value }` } title={ value } className={ styles.cellContent }>
            <DatasetMetadataCell key={ `metadata-cell-${ value }` } fieldProperty={ fieldProperty } />
          </span>
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
      const createMetadataCell = ((key, i) => createCell(key, i, key, createMetadataCellContent));

      const headerRow = [...dataset.data[0].keys()].map(createHeaderCell);
      const metadataRow = [...dataset.data[0].keys()].map(createMetadataCell);

      dataRows = dataset.data.map(function(row, i) {
        const createDataCell = ((key, j) => createCell(key, j, row.get(key), createDataCellContent));
        return {
          rowType: 'data',
          items: [...row.keys()].map(createDataCell)
        };
      });


      headerRows = [
        {
          rowType: 'header',
          items: headerRow
        }
      ];


      metadataRows = [
        {
          rowType: 'metadata',
          items: metadataRow
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
            containerClassName={ styles.metadataRowTable }
            datasetId={ `${ dataset.datasetId }` }
            data={ metadataRows }
            customRowComponent={ MetadataRow }/>
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
