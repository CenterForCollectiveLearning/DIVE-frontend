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
    this.onSelectUploadDataset = this.onSelectUploadDataset.bind(this);
    this.onSelectDeleteDataset = this.onSelectDeleteDataset.bind(this);
  }

  onSelectDataset(selectedValue) {
    if (selectedValue) {
      this.props.pushState(null, `/projects/${this.props.projectId}/data/${selectedValue}/inspect`);
    }
  }

  onSelectDeleteDataset() {
    const { deleteDataset, selectedDatasetId, project } = this.props;

    deleteDataset(project.properties.id, selectedDatasetId);
  }

  onSelectUploadDataset() {
    const projectId = this.props.project.properties.id;
    const { uploadDataset } = this.props;

    filePicker(function(files) {
      uploadDataset(projectId, files[0]);
    });
  }

  render() {
    return (
      <div className={ styles.toolbar }>
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
        { !this.props.project.properties.preloaded && this.props.selectedDatasetId &&
          <div className={ styles.rightActions }>
            <RaisedButton icon={ true } onClick={ this.onSelectDeleteDataset }>
              <i className="fa fa-trash"></i>
            </RaisedButton>
            <RaisedButton label="Upload new dataset" onClick={ this.onSelectUploadDataset } />
          </div>
        }
      </div>
    );
  }
}

DatasetToolbar.propTypes = {
  datasets: PropTypes.array.isRequired,
  projectId: PropTypes.string.isRequired,
  selectedDatasetId: PropTypes.string
};

function mapStateToProps(state) {
  const { project } = state;
  return { project };
}

export default connect(mapStateToProps, { pushState, uploadDataset, deleteDataset })(DatasetToolbar);
