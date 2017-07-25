import moment from 'moment';
import React, { Component, PropTypes } from 'react';

import styles from './DatasetProperties.sass';

export default class DatasetPropertiesPane extends Component {

  render() {
    const { dataset, fieldProperties, rightActions } = this.props;
    const { nRows, nCols, fieldNames, isTimeSeries, creationDate, updateDate } = dataset.details;
    const numIds = fieldProperties.items.filter((fp) => fp.isId).length;
    const numFieldTypes = [ ...new Set(fieldProperties.items.map((fp) => fp.type)) ].length;

    return (
      <div className={ styles.datasetPropertiesPane }>
        <div className={ styles.left }>
          <div><span className={ styles.value }>{ nRows }</span> Rows</div>
          <div><span className={ styles.value }>{ nCols }</span> Columns</div>
          { numIds > 0 &&         
            <div><span className={ styles.value }>{ numIds }</span> { numIds == 1 ? 'ID Field' : 'ID Fields' }</div>    
          } 
          { numFieldTypes > 0 && 
            <div><span className={ styles.value }>{ numFieldTypes }</span> { numFieldTypes == 1 ? 'Field Type' : 'Field Types' }</div>
          }
        </div>
        { rightActions &&
          <div className={ styles.right }>
            { rightActions }
          </div>
        }
      </div>
    );
  }
}

DatasetPropertiesPane.propTypes = {
  dataset: PropTypes.object.isRequired,
  fieldProperties: PropTypes.object.isRequired,
  rightActions: PropTypes.node
}

DatasetPropertiesPane.defaultProps = {
  dataset: {},
  fieldProperties: {}
}
