import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import { uploadDataset } from '../../actions/DatasetActions';
import styles from './datasets.sass';

// this seems real dumb;
require('react-select/less/select.less');
require('../../../css/react-select.less');
import Select from 'react-select';

import RaisedButton from '../Base/RaisedButton';
import filePicker from 'component-file-picker';

export class DatasetToolbar extends Component {
  constructor(props) {
    super(props);
    this.onSelectDataset = this.onSelectDataset.bind(this);
    this.onSelectUploadDataset = this.onSelectUploadDataset.bind(this);
  }

  onSelectDataset(selectedValue) {
    if (selectedValue) {
      this.props.pushState(null, `/projects/${this.props.projectTitle}/datasets/${selectedValue}/inspect`);
    }
  }

  onSelectUploadDataset() {
    const projectId = this.props.project.properties.id;
    const { uploadDataset } = this.props;

    filePicker(function(files) {
      uploadDataset(projectId, files[0]);
    });
  }

  render() {
    const menuItems = this.props.datasets.map((dataset, i) =>
      new Object({
        value: dataset.datasetId,
        label: dataset.title
      })
    );

    return (
      <div className={ styles.toolbar }>
        <span>Dataset: </span>
        <div className={ styles.datasetSelectorContainer }>
          <Select
            className={ styles.datasetSelector }
            value={ this.props.selectedDatasetId }
            options={ menuItems }
            onChange={ this.onSelectDataset }
            multi={ false }
            clearable={ false }
            searchable={ false } />
        </div>
        { this.props.selectedDatasetId &&
          <div className={ styles.rightActions }>
            <RaisedButton label="Upload new dataset" onClick={ this.onSelectUploadDataset } />
          </div>
        }
      </div>
    );
  }
}

DatasetToolbar.propTypes = {
  datasets: PropTypes.array.isRequired,
  projectTitle: PropTypes.string.isRequired,
  selectedDatasetId: PropTypes.string
};

function mapStateToProps(state) {
  const { project } = state;
  return { project };
}

export default connect(mapStateToProps, { pushState, uploadDataset })(DatasetToolbar);
