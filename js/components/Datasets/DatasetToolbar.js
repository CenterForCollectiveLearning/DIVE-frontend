import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import { uploadDataset } from '../../actions/DatasetActions';
import styles from './Datasets.sass';

import { DropDownMenu, FlatButton } from 'material-ui-io';
import filePicker from 'component-file-picker';

export class DatasetToolbar extends Component {
  constructor(props) {
    super(props);
    this.onSelectDataset = this.onSelectDataset.bind(this);
    this.onSelectUploadDataset = this.onSelectUploadDataset.bind(this);
  }

  onSelectDataset(e, selectedIndex, menuItem) {
    if (menuItem.payload) {
      this.props.pushState(null, `/projects/${this.props.projectTitle}/datasets/${menuItem.payload}/inspect`);
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
    const { selectedDatasetId } = this.props;
    var selectedIndex = this.props.datasets.findIndex((dataset, i, datasets) =>
      dataset.dID == selectedDatasetId
    );

    var menuItems = this.props.datasets.map((dataset, i) =>
      new Object({
        payload: dataset.dID,
        text: dataset.title
      })
    );

    if (selectedIndex < 0) {
      menuItems.unshift({
        payload: '',
        text: 'Select Dataset'
      });
      selectedIndex = selectedIndex + 1;
    }

    return (
      <div className={ styles.toolbar }>
        <span>Dataset: </span>
        <DropDownMenu selectedIndex={ selectedIndex } menuItems={ menuItems } onChange={ this.onSelectDataset } />
        { selectedDatasetId &&
          <div className={ styles.rightActions }>
            <FlatButton label="Upload new dataset" primary={ true } hoverColor="#2D5365" onClick={ this.onSelectUploadDataset } />
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
