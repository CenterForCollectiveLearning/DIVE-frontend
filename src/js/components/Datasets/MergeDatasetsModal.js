import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { mergeDatasets } from '../../actions/DatasetActions';

import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';

import styles from './DatasetModal.sass';

import SelectGrid from '../Base/SelectGrid';
import Input from '../Base/Input';
import DropDownMenu from '../Base/DropDownMenu';

class MergeDatasetsModal extends Component {
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
      columns: columns, // keys to join on
      phase: 1,
      rightDatasetId: null,
      mergeMethod: [
        {
          label: 'left',
          value: 'left',
          selected: true
        },
        {
          label: 'right',
          value: 'right',
          selected: false
        },
        {
          label: 'inner',
          value: 'inner',
          selected: false
        },
        {
          label: 'outer',
          value: 'outer',
          selected: false
        },
      ]
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

  clickedNext() {
    if (this.state.rightDatasetId) {
      this.setState({ phase: 2 });
    } else {
      this.setState({ error: "Please select a dataset to merge with." })
    }
  }

  clickedBack() {
    this.setState({ phase: 1 });
  }

  submit() {
    const { mergeDatasets, projectId, datasetId } = this.props;
    const { rightDatasetId, mergeMethod, columns } = this.state;

    const selectedColumns = columns
      .filter((column) => column.selected)
      .map((column) => column.id);

    if (!selectedColumns.length) {
      this.setState({ error: "Please select columns to join datasets on."});
      return;
    }

    const selectedMergeMethod = mergeMethod
      .filter((method) => method.selected)
      .map((method) => method.value)[0];

    mergeDatasets(projectId, datasetId, rightDatasetId, selectedColumns, selectedMergeMethod);
    this.props.closeAction();
  }

  onSelectRightDataset(datasetId) {
    this.setState({ rightDatasetId: datasetId, error: null });
  }

  onSelectMergeMethod(mergeMethodValue) {
    const mergeMethod = this.state.mergeMethod.map((method) =>
      new Object({ ...method, selected: (method.value == mergeMethodValue) })
    );
    this.setState({ mergeMethod: mergeMethod });
  }

  render() {
    const { phase, columns, error } = this.state;
    var heading, footer, phaseFooter;

    switch(phase) {
      case 1:
        heading = "Merge with which dataset?";
        phaseFooter =
          <div className={ styles.rightActions }>
            <Button
              intent={ Intent.PRIMARY }
              onClick={ this.clickedNext.bind(this) }>Next</Button>
          </div>;
        break;
      case 2:
        heading = "Select columns to merge over";
        phaseFooter =
          <div className={ styles.rightActions }>
            <Button primary minWidth={ 100 } onClick={ this.submit.bind(this) }>Done</Button>
            <Button icon onClick={ this.clickedBack.bind(this) }><i className="fa fa-angle-left"></i></Button>
          </div>;
        break;
      default:
    }

    footer =
      <div className={ styles.footerContent }>
        <div className={ styles.footerLabel }>
          { error &&
            <label className={ styles.error }>{ error }</label>
          }
        </div>
        { phaseFooter }
      </div>;

    const datasets = this.props.datasets.filter((dataset) => dataset.datasetId != this.props.datasetId);

    return (
      <BlockingModal
        scrollable={ phase != 1 }
        closeAction={ this.props.closeAction }
        heading={ <span>{ heading }</span> }
        footer={ footer }>
        <div style={{ display: "flex", width: "100%" }}>
          { phase == 1 &&
            <div style={{ display: "flex", width: "100%" }}>
              <div className={ styles.controlSection }>
                <div className={ styles.label }>Which dataset should we merge with?</div>
                <DropDownMenu
                  value={ this.state.rightDatasetId }
                  options={ datasets }
                  valueMember="datasetId"
                  displayTextMember="title"
                  onChange={ this.onSelectRightDataset.bind(this) }/>
              </div>
            </div>
          }
          { phase == 2 &&
            <div style={{ display: "flex", "flexDirection": "column" }}>
              <div className={ styles.controlSection + ' ' + styles.shortControl }>
                <div className={ styles.label }>How should we merge the datasets?</div>
                <DropDownMenu
                  value={ this.state.mergeMethod.filter((method) => method.selected).value }
                  options={ this.state.mergeMethod }
                  onChange={ this.onSelectMergeMethod.bind(this) }/>
              </div>
              <div className={ styles.controlSection + ' ' + styles.scrollableControl }>
                <div className={ styles.label }>Which columns should we merge on?</div>
                <div className={ styles.scrollSectionContainer }>
                  <div className={ styles.scrollSection }>
                    <SelectGrid
                      heading="Columns to merge on"
                      items={ columns }
                      onSelectAllItems={ this.selectAllColumns.bind(this) }
                      onSelectItem={ this.selectColumn.bind(this) }/>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </BlockingModal>
    );
  }
}

MergeDatasetsModal.propTypes = {
  projectId: PropTypes.string.isRequired,
  datasetId: PropTypes.string.isRequired,
  columnNames: PropTypes.array.isRequired,
  datasets: PropTypes.array.isRequired,
  closeAction: PropTypes.func
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { mergeDatasets })(MergeDatasetsModal);
