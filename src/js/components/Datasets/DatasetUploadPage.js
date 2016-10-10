import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';

import { fetchDatasets } from '../../actions/DatasetActions';
import { uploadDataset } from '../../actions/DatasetActions';
import styles from './Datasets.sass';

import Dropzone from 'react-dropzone';
import Loader from '../Base/Loader';
import HeaderBar from '../Base/HeaderBar';
import RaisedButton from '../Base/RaisedButton';

export class DatasetUploadPage extends Component {
  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
    this.onOpenClick = this.onOpenClick.bind(this);
  }

  componentWillMount() {
    const { project, datasets, params, fetchDatasets, fetchFieldPropertiesIfNeeded } = this.props;

    if (project.id && !datasets.fetchedAll && !datasets.isFetching) {
      fetchDatasets(params.projectId, false);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { project, datasets, datasetSelector, push, params, fetchDatasets } = nextProps;
    if (datasetSelector.datasetId != this.props.datasetSelector.datasetId) {
      push(`/projects/${ params.projectId }/datasets/${ datasetSelector.datasetId }/inspect`);
    }

    if (project.id && !datasets.fetchedAll && !datasets.isFetching) {
      fetchDatasets(params.projectId, false);
    }
  }

  onDrop(files) {
    this.props.uploadDataset(this.props.project.id, files[0]);
  }

  onOpenClick() {
    this.refs.dropzone.open();
  }

  render() {
    const { projectTitle, datasetSelector } = this.props;
    return (
      <DocumentTitle title={ 'Upload' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
        <div className={ styles.fillContainer }>
          <div
            className={ styles.datasetUploadBox }>
            { datasetSelector.isUploading &&
              <div className={ styles.uploadingZone + ' ' + styles.centeredFill }>
                { datasetSelector.progress &&
                  <Loader text={ datasetSelector.progress } />
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
                <RaisedButton label="Upload dataset" primary={ true } onClick={ this.onOpenClick } />
                  <span>or drag and drop files here</span>
                  <span>Supported: CSV, TSV, JSON, EXCEL</span>
              </Dropzone>
            }
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

DatasetUploadPage.propTypes = {
  project: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object
};


function mapStateToProps(state) {
  const { project, datasets, datasetSelector } = state;
  return { project, projectTitle: project.title, datasets, datasetSelector };
}

export default connect(mapStateToProps, {
  uploadDataset,
  fetchDatasets,
  push
})(DatasetUploadPage);
