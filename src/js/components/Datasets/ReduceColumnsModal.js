import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduceDatasetColumns } from '../../actions/DatasetActions';

import styles from './DatasetModal.sass';

import BlockingModal from '../Base/BlockingModal';
import RaisedButton from '../Base/RaisedButton';
import SelectGrid from '../Base/SelectGrid';

class ReduceColumnsModal extends Component {
  constructor(props) {
    super(props);

    const columns = props.columnNames.map((fieldName, i) =>
      new Object({
        id: i,
        name: fieldName,
        selected: false,
        highlighted: false
      })
    );

    this.state = {
      error: null,
      columns: columns
    };
  }

  selectColumn(columnId, selected) {
    const columns = this.state.columns.slice().map((column) =>
      column.id == columnId ?
        new Object({ ...column, selected: selected })
        : column
    );
    this.setState({ columns: columns, error: null });
  }

  selectAllColumns(selected) {
    const columns = this.state.columns.slice().map((column) =>
      new Object({ ...column, selected: selected })
    );

    this.setState({ columns: columns, error: null });
  }

  submit() {
    const { reduceDatasetColumns, projectId, datasetId } = this.props;

    const selectedColumns = this.state.columns
      .filter((column) => column.selected)
      .map((column) => column.id);

    if (!selectedColumns.length) {
      this.setState({ error: "Please select columns to keep."});
      return;
    }

    reduceDatasetColumns(projectId, datasetId, selectedColumns);
    this.props.closeAction();
  }

  render() {
    return (
      <BlockingModal
        scrollable
        closeAction={ this.props.closeAction }
        heading={
          <span>Select Columns to Display</span>
        }
        footer={
          <div className={ styles.footerContent }>
            <div className={ styles.footerLabel }>
              { this.state.error &&
                <label className={ styles.error }>{ this.state.error }</label>
              }
            </div>
            <div className={ styles.rightActions }>
              <RaisedButton primary onClick={ this.submit.bind(this) }>Choose columns</RaisedButton>
            </div>
          </div>
        }>
        <div className={ styles.scrollSectionContainer }>
          <div className={ styles.scrollSection }>
            <SelectGrid
              heading="Columns to display"
              items={ this.state.columns }
              onSelectAllItems={ this.selectAllColumns.bind(this) }
              onSelectItem={ this.selectColumn.bind(this) }/>
          </div>
        </div>
      </BlockingModal>
    );
  }
}

ReduceColumnsModal.propTypes = {
  projectId: PropTypes.string.isRequired,
  datasetId: PropTypes.string.isRequired,
  columnNames: PropTypes.array.isRequired,
  closeAction: PropTypes.func
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { reduceDatasetColumns })(ReduceColumnsModal);
