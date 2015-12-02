import React, { Component, PropTypes } from 'react';

import Griddle from 'griddle-react';
import styles from './DataGrid.sass';

export default class DataGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id != this.props.id) {
      this.setState({ loading: true });
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    const { data, tableClassName, containerClassName, useFixedWidth, customRowComponent } = this.props;

    const columnWidth = 200;
    const nColumns = data.length ? Object.keys(data[0]).length : 0;
    const innerContainerStyle = {
      width: `${ nColumns * columnWidth }px`,
      minWidth: '100%',
      overflow: 'hidden'
    };

    return (
      <div className={ containerClassName }>
        <div style={ useFixedWidth ? innerContainerStyle : {} }>
          { this.state.loading &&
            <div className={ styles.watermark }>Loading...</div>
          }
          { !this.state.loading &&
            <Griddle
              results={ data }
              resultsPerPage={ 300 }
              useFixedHeader={ true }
              useFixedLayout={ false }
              tableClassName={ tableClassName }
              useGriddleStyles={ false }
              useCustomRowComponent={ customRowComponent ? true : false }
              customRowComponent={ customRowComponent }/>
          }
        </div>
      </div>
    );
  }
}

DataGrid.propTypes = {
  id: PropTypes.string,
  data: PropTypes.array.isRequired,
  tableClassName: PropTypes.string,
  containerClassName: PropTypes.string,
  useFixedWidth: PropTypes.bool,
  customRowComponent: PropTypes.any
};

DataGrid.defaultProps = {
  tableClassName: "grid",
  containerClassName: "container",
  useFixedWidth: true,
  customRowComponent: null
}
