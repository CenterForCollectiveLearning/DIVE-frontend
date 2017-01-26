import React, { Component, PropTypes } from 'react';

import styles from './DataGrid.sass';
import {
  Table,
  Column,
  ColumnHeaderCell,
  Cell,
} from '@blueprintjs/table';

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

    const renderCell = (rowIndex) => {
      return <Cell>{`${(rowIndex * 10).toFixed(2)}`}</Cell>
    };

    // console.log(data);

    const numRows = data.length;
    const columnHeaders = Object.keys(data[0]);
    const columns = columnHeaders.map((columnHeader) =>
      data.map((row) => row[columnHeader] )
    );

    // console.log(columns);

    return (
      <div className={ containerClassName }>
        <div>
          { this.state.loading &&
            <div className={ styles.watermark }>Loading...</div>
          }
          { !this.state.loading &&
            <Table
              numRows={ numRows }
              defaultColumnWidth={ 100 }
            >
              {
                columns.map((column, index) =>
                  <Column
                    name={ columnHeaders[index] }
                    renderCell={ renderCell }
                  />
                )
              }
              />
            </Table>
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
