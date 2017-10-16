import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './Datasets.sass';
import DatasetDataRow from './DatasetDataRow';

export default class DatasetDataList extends Component {

  render() {
    const { preloaded, dataset, fieldProperties } = this.props;
    return (
      <div className={ styles.datasetDataList }>
        {
          fieldProperties.items.map((fieldProperty) =>
            <DatasetDataRow
              preloaded={ dataset.preloaded }
              key={ `dataset-data-row-${ fieldProperty.id }` }
              fieldProperty={ fieldProperty }
              color = { fieldProperties.fieldNameToColor[fieldProperty.name] }
            />
          )
        }
      </div>
    );
  }
}

DatasetDataList.propTypes = {
  dataset: PropTypes.object.isRequired,
  fieldProperties: PropTypes.object.isRequired
}

DatasetDataList.defaultProps = {
  dataset: {},
  fieldProperties: {}
}
