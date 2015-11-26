import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { mergeDatasets } from '../../actions/DatasetActions';

import styles from './DatasetModal.sass';

import BlockingModal from '../Base/BlockingModal';
import RaisedButton from '../Base/RaisedButton';
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
    const { mergeDatasets, projectId, datasetId } = this.props;
    const { rightDatasetId, mergeMethod, columns } = this.state;

    const selectedColumns = columns
      .filter((column) => column.selected)
      .map((column) => column.id);

    mergeDatasets(projectId, datasetId, rightDatasetId, selectedColumns, mergeMethod);
    this.props.closeAction();
  }

  onSelectRightDataset(event) {
    console.log(event);
    this.setState({ rightDatasetId: event.target.value });
  }

  render() {
    const { phase, columns } = this.state;
    var heading, footer;
    console.log(this.props);

    switch(phase) {
      case 1:
        heading = "Merge with which dataset?";
        footer = <div className={ styles.rightActions }><RaisedButton primary minWidth={ 100 } onClick={ this.clickedNext.bind(this) }>Next</RaisedButton></div>;
        break;
      case 2:
        heading = "Select columns to merge over";
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
        noContentPadding={ phase == 1 }
        closeAction={ this.props.closeAction }
        heading={ <span>{ heading }</span> }
        footer={{ footer }}>
        <div>
          { phase == 1 &&
            <div>
              <div className={ styles.controlSection }>
                <div className={ styles.label }>Which dataset should we merge with?</div>
                <DropDownMenu
                  value={ this.state.rightDatasetId }
                  options={ this.props.datasets }
                  valueMember="datasetId"
                  displayTextMember="title"
                  onChange={ this.onSelectRightDataset.bind(this) }/>
              </div>
            </div>
          }
          { phase == 2 &&
            <div>
              <DropDownMenu
                value={ this.state.mergeMethod.filter((method) => method.selected).value }
                options={ this.state.mergeMethod }
                onChange={ this.onSelectRightDataset.bind(this) }/>
              <SelectGrid
                heading="Columns to merge on"
                items={ columns }
                onSelectAllItems={ this.selectAllColumns.bind(this) }
                onSelectItem={ this.selectColumn.bind(this) }/>
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
