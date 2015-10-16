import React, { Component, PropTypes } from 'react';

import Griddle from 'griddle-react';

export default class DataGrid extends Component {
  render() {
    const { data, tableClassName, containerClassName, useFixedWidth } = this.props;
    const columnWidth = 200;
    const nColumns = data.length ? Object.keys(data[0]).length : 0;
    const innerContainerStyle = {
      width: `${nColumns * columnWidth}px`,
      minWidth: '100%',
      overflow: 'hidden'
    };
    return (
      <div className={ containerClassName } style={{ width: '100%', overflow: 'scroll' }}>
        <div style={ useFixedWidth ? innerContainerStyle : {} }>
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
  containerClassName: PropTypes.string,
  useFixedWidth: PropTypes.bool
};

DataGrid.defaultProps = {
  tableClassName: "grid",
  containerClassName: "container",
  useFixedWidth: true
}
