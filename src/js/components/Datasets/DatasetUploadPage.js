import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';

import { fetchDatasets } from '../../actions/DatasetActions';
import { uploadDataset } from '../../actions/DatasetActions';
import styles from './Datasets.sass';

import Dropzone from 'react-dropzone';
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

    if (project.properties.id && !datasets.fetchedAll && !datasets.isFetching) {
      fetchDatasets(params.projectId, false);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { project, datasets, datasetSelector, push, params, fetchDatasets } = nextProps;
    if (datasetSelector.datasetId != this.props.datasetSelector.datasetId) {
      push(`/projects/${ params.projectId }/datasets/${ datasetSelector.datasetId }/inspect`);
    }

    if (project.properties.id && !datasets.fetchedAll && !datasets.isFetching) {
      fetchDatasets(params.projectId, false);
    }
  }

  onDrop(files) {
    this.props.uploadDataset(this.props.project.properties.id, files[0]);
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
                  <div className={ styles.watermark }>{ datasetSelector.progress }</div>
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
  return { project, projectTitle: project.properties.title, datasets, datasetSelector };
}

export default connect(mapStateToProps, {
  uploadDataset,
  fetchDatasets,
  push
})(DatasetUploadPage);
