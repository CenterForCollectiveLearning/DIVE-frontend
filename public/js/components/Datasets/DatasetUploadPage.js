import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import { uploadDataset } from '../../actions/DatasetActions';
import styles from './Datasets.sass';

import Dropzone from 'react-dropzone';
import RaisedButton from '../Base/RaisedButton';
import ActionBox from '../Base/ActionBox';
import DatasetToolbar from './DatasetToolbar';

export class DatasetUploadPage extends Component {
  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
    this.onOpenClick = this.onOpenClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { datasetSelector, pushState, params } = nextProps;
    if (datasetSelector.datasetId != this.props.datasetSelector.datasetId) {
      pushState(null, `/projects/${ params.projectId }/data/${ datasetSelector.datasetId }/inspect`);
    }
  }

  onDrop(files) {
    this.props.uploadDataset(this.props.project.properties.id, files[0]);
  }

  onOpenClick() {
    this.refs.dropzone.open();
  }

  render() {
    const { datasetSelector } = this.props;
    return (
      <div className={ styles.fillContainer }>
        <DatasetToolbar uploadMode={ true }/>
        <ActionBox
          className={ styles.datasetUploadBox }
          contentClassName={ styles.datasetUploadBoxContent }
          heading="Upload Dataset">
          { datasetSelector.isUploading &&
            <div className={ styles.uploadingZone + ' ' + styles.centeredFill }>
              { datasetSelector.progress < 1 &&
                <div className={ styles.watermark }>Uploading dataset…&nbsp;{ Math.round(datasetSelector.progress * 100) }%</div>
              }
              { datasetSelector.progress == 1 && 
                <div className={ styles.watermark }>Processing dataset…</div>
              }
            </div>
          }
          { !datasetSelector.isUploading &&
            <Dropzone ref="dropzone" className={ styles.dropzone + ' ' + styles.centeredFill } onDrop={ this.onDrop } disableClick={ true }>
              { datasetSelector.uploadError &&
                <div className={ styles.errorDescription + ' ' + styles.watermark }>
                  { datasetSelector.uploadError }
                  <div className={ styles.separater }></div>
                </div>
              }
              <RaisedButton label="Select & upload a file" primary={ true } onClick={ this.onOpenClick } />
              <span>or drop files here to upload</span>
            </Dropzone>
          }
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
