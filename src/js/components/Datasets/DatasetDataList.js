import React, { Component, PropTypes } from 'react';

import styles from './Datasets.sass';
import DatasetDataRow from './DatasetDataRow';

export default class DatasetDataList extends Component {

  render() {
    const { dataset, fieldProperties } = this.props;
    return (
      <div className={ styles.datasetDataList }>
        {
          fieldProperties.items.map((fieldProperty) =>
            <DatasetDataRow
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
