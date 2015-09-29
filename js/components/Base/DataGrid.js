import React, { Component, PropTypes } from 'react';

import Griddle from 'griddle-react';
import styles from './base.sass';

export default class DataGrid extends Component {
  render() {
    const { data, tableClassName, containerClassName } = this.props;
    const columnWidth = 200;
    const nColumns = data.length ? Object.keys(data[0]).length : 0;
    return (
      <div className={ containerClassName } style={{ width: '100%', overflow: 'scroll' }}>
        <div style={{ width: `${nColumns * columnWidth}px`, minWidth: '100%', overflow: 'hidden' }}>
          <Griddle
            results={ data }
            resultsPerPage={ 300 }
            useFixedHeader={ true }
            useFixedLayout={ false }
            tableClassName={ tableClassName }
            useGriddleStyles={ false } />
        </div>
      </div>
    );
  }
}

DataGrid.propTypes = {
  data: PropTypes.array.isRequired,
  tableClassName: PropTypes.string,
  containerClassName: PropTypes.string
};

DataGrid.defaultProps = {
  tableClassName: "grid",
  containerClassName: "container"
}
