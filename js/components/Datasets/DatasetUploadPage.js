import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import { uploadDataset } from '../../actions/DatasetActions';
import styles from './datasets.sass';

import RaisedButton from '../Base/RaisedButton';
import ActionBox from '../Base/ActionBox';
import Dropzone from 'react-dropzone';

export class DatasetUploadPage extends Component {
  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
    this.onOpenClick = this.onOpenClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { datasetSelector, pushState, params } = this.props;
    const nextDatasetId = nextProps.datasetSelector.datasetId
    if (nextDatasetId && !datasetSelector.datasetId) {
      pushState(null, `/projects/${ params.projectId }/data/${ nextDatasetId }/inspect`);
    }
  }

  onDrop(files) {
    this.props.uploadDataset(this.props.project.properties.id, files[0]);
  }

  onOpenClick() {
    this.refs.dropzone.open();
  }

  render() {
    return (
      <div className={ styles.fillContainer }>
        <ActionBox heading="Upload Dataset">
          <Dropzone ref="dropzone" className={ styles.dropzone + ' ' + styles.centeredFill } onDrop={ this.onDrop } disableClick={ true }>
            <RaisedButton label="Select & upload a file" primary={ true } onClick={ this.onOpenClick } />
            <span>or drop files here to upload</span>
          </Dropzone>
        </ActionBox>
      </div>
    );
  }
}

DatasetUploadPage.propTypes = {
  project: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object
};


function mapStateToProps(state) {
  const { project, datasetSelector } = state;
  return { project, datasetSelector };
}

export default connect(mapStateToProps, { uploadDataset, pushState })(DatasetUploadPage);
