import React, { Component, PropTypes } from 'react';

import Griddle from 'griddle-react';
import styles from './datasets.sass';

export default class DataGridWrapper extends Component {
  render() {
    const { dataset } = this.props;
    const columnWidth = 200;
    return (
      <div style={{ width: '100%', overflow: 'scroll' }}>
        { dataset.details &&
          <div style={{ width: `${dataset.details.cols * columnWidth}px`, minWidth: '100%', overflow: 'hidden' }}>
            <Griddle
              results={ dataset.data }
              resultsPerPage={ 300 }
              useFixedHeader={ true }
              useFixedLayout={ false }
              tableClassName={ styles.grid }
              useGriddleStyles={ false } />
          </div>
        }
      </div>
    );
  }
}

DataGridWrapper.propTypes = {
  dataset: PropTypes.object.isRequired
};
