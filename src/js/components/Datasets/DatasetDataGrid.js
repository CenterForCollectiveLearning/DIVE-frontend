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

    if (!dataset.data) {
      return;
    }    

    var dataRows = [];
    var headerRows = [];
    var metadataRows = [];

    if (fieldProperties.items.length && fieldProperties.datasetId == dataset.id) {
      const createCellContent = function (value, children) {
        return (
          <div
            key={ `cell-content-${ value }` }
            title={ value }
            className={ styles.cellContent + ' ' + styles.dataCellContent + ' ' + ((value === null) ? ' ' + styles.nullContent : '')}
          >
            <span className={ styles.fieldValue }>{ value }</span>
            { children }
          </div>
        );
      };

      const createDataCellContent = ((value) => createCellContent(value));

      const createHeaderCellContent = function(value, fieldProperty, context) {
        return (
          <DatasetHeaderCell key={ `header-cell-${ value }` } value={ value } fieldProperty={ fieldProperty } preloaded={ dataset.preloaded }/>
        );
      };

      const createMetadataCellContent = function(value, fieldProperty, context) {
        const color = fieldProperties.fieldNameToColor[fieldProperty.name] || null;
        return (
          <div key={ `cell-content-${ fieldProperty.id }` } title={ value } className={ styles.cellContent }>
            <DatasetMetadataCell key={ `metadata-cell-${ fieldProperty.id }` } fieldProperty={ fieldProperty } color={ color } preloaded={ dataset.preloaded }/>
          </div>
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
            datasetId={ `${ dataset.id }` }
            data={ headerRows }
            customRowComponent={ DatasetRow }/>
          <DataGrid
            preloaded={ dataset.preloaded }
            containerClassName={ styles.metadataRowTable }
            datasetId={ `${ dataset.id }` }
            data={ metadataRows }
            customRowComponent={ MetadataRow }/>
          <DataGrid
            containerClassName={ styles.dataRowsTable }
            datasetId={ `${ dataset.id }` }
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
