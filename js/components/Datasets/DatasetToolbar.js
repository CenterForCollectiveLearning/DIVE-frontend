import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import { uploadDataset, deleteDataset } from '../../actions/DatasetActions';
import styles from './datasets.sass';

import DropDownMenu from '../Base/DropDownMenu';
import RaisedButton from '../Base/RaisedButton';
import filePicker from 'component-file-picker';

export class DatasetToolbar extends Component {
  constructor(props) {
    super(props);
    this.onSelectDataset = this.onSelectDataset.bind(this);
    this.onClickUploadDataset = this.onClickUploadDataset.bind(this);
    this.onClickDeleteDataset = this.onClickDeleteDataset.bind(this);
  }

  onSelectDataset(selectedValue) {
    if (selectedValue) {
      this.props.pushState(null, `/projects/${this.props.projectId}/data/${selectedValue}/inspect`);
    }
  }

  onClickDeleteDataset() {
    const { deleteDataset, selectedDatasetId, projectId } = this.props;

    deleteDataset(projectId, selectedDatasetId);
  }

  onClickUploadDataset() {
    const projectId = this.props.projectId;
    this.props.pushState(null, `/projects/${ projectId }/data/upload`);
  }

  render() {
    return (
      <div className={ styles.toolbar }>
        <div className={ styles.leftActions }>
          <span>Dataset: </span>
          <div className={ styles.datasetSelectorContainer }>
            <DropDownMenu
              className={ styles.datasetSelector }
              value={ this.props.selectedDatasetId }
              options={ this.props.datasets }
              valueMember="datasetId"
              displayTextMember="title"
              onChange={ this.onSelectDataset } />
          </div>
          { !this.props.preloadedProject &&
            <RaisedButton label="Upload new dataset" onClick={ this.onSelectUploadDataset } />
          }
        </div>
        { !this.props.preloadedProject && this.props.selectedDatasetId &&            
          <div className={ styles.rightActions }>
            <RaisedButton icon={ true } onClick={ this.onSelectDeleteDataset }>
              <i className="fa fa-trash"></i>
            </RaisedButton>
            <RaisedButton label="Reduce columns" onClick={ this.props.openColumnReductionModalAction }/>
          </div>
        }
      </div>
    );
  }
}

DatasetToolbar.propTypes = {
  datasets: PropTypes.array.isRequired,
  projectId: PropTypes.string.isRequired,
  selectedDatasetId: PropTypes.string,
  openColumnReductionModalAction: PropTypes.func
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { pushState, uploadDataset, deleteDataset })(DatasetToolbar);
