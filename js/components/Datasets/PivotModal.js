import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pivotDatasetColumns } from '../../actions/DatasetActions';

import styles from './DatasetModal.sass';

import BlockingModal from '../Base/BlockingModal';
import RaisedButton from '../Base/RaisedButton';
import SelectGrid from '../Base/SelectGrid';
import Input from '../Base/Input';

class PivotModal extends Component {
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
      columns: columns,
      phase: 1,
      valueName: '',
      variableName: ''
    };
  }

  selectColumn(columnId, selected) {
    const columns = this.state.columns.slice().map((column) =>
      column.id == columnId ?
        new Object({ ...column, selected: selected })
        : column
    );
    this.setState({ columns: columns });
  }

  selectAllColumns(selected) {
    const columns = this.state.columns.slice().map((column) =>
      new Object({ ...column, selected: selected })
    );

    this.setState({ columns: columns });
  }

  clickedNext() {
    this.setState({ phase: 2 });
  }

  clickedBack() {
    this.setState({ phase: 1 });
  }

  submit() {
    const { pivotDatasetColumns, projectId, datasetId } = this.props;
    const { variableName, valueName, columns } = this.state;

    const selectedColumns = columns
      .filter((column) => column.selected)
      .map((column) => column.id);

    pivotDatasetColumns(projectId, datasetId, variableName, valueName, selectedColumns);
    this.props.closeAction();
  }

  enteredValueNameInput(event) {
    this.setState({ valueName: event.target.value });
  }

  enteredVariableNameInput(event) {
    this.setState({ variableName: event.target.value });
  }

  render() {
    const { phase, columns } = this.state;
    var heading, footer;

    switch(phase) {
      case 1:
        heading = "What is the dataset measuring?";
        footer = <div className={ styles.rightActions }><RaisedButton primary minWidth={ 100 } onClick={ this.clickedNext.bind(this) }>Next</RaisedButton></div>;
        break;
      case 2:
        heading = "Select columns that change with time";
        footer =
          <div className={ styles.rightActions }>
            <RaisedButton primary minWidth={ 100 } onClick={ this.submit.bind(this) }>Done</RaisedButton>
            <RaisedButton icon onClick={ this.clickedBack.bind(this) }><i className="fa fa-angle-left"></i></RaisedButton>
          </div>;
        break;
      default:
    }

    return (
      <BlockingModal
        scrollable={ phase != 1 }
        closeAction={ this.props.closeAction }
        heading={ <span>{ heading }</span> }
        footer={{ footer }}>
        <div style={{ display: "flex" }}>
          { phase == 1 &&
            <div>
              <div className={ styles.controlSection }>
                <div className={ styles.label }>To help us understand the data better, can you tell us <strong>what is being measured over time</strong>? (one word will do)</div>
                <Input
                  type="text"
                  placeholder="(e.g. Intensity, Sales, Temperature)"
                  onChange={ this.enteredValueNameInput.bind(this) }/>
              </div>
              <div className={ styles.controlSection }>
                <div className={ styles.label }>Can you describe the <strong>metric being used to measure time</strong>? (one word)</div>
                <Input
                  type="text"
                  placeholder="(e.g. Month, Timepoint, Year)"
                  onChange={ this.enteredVariableNameInput.bind(this) }
                  onSubmit={ this.clickedNext.bind(this) }/>
              </div>
            </div>
          }
          { phase == 2 &&
            <div className={ styles.scrollSectionContainer }>
              <div className={ styles.scrollSection }>
                <SelectGrid
                  heading="Columns changing with Time"
                  items={ columns }
                  onSelectAllItems={ this.selectAllColumns.bind(this) }
                  onSelectItem={ this.selectColumn.bind(this) }/>
              </div>
            </div>
          }
        </div>
      </BlockingModal>
    );
  }
}

PivotModal.propTypes = {
  projectId: PropTypes.string.isRequired,
  datasetId: PropTypes.string.isRequired,
  columnNames: PropTypes.array.isRequired,
  closeAction: PropTypes.func
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { pivotDatasetColumns })(PivotModal);
