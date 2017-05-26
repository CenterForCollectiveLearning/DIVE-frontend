import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';

import { Button, Intent, NonIdealState } from '@blueprintjs/core';
import { fetchDatasets } from '../../actions/DatasetActions';
import { uploadDataset } from '../../actions/DatasetActions';
import styles from './Datasets.sass';

import ProjectTopBar from '../ProjectTopBar';
import Dropzone from 'react-dropzone';
import Loader from '../Base/Loader';
import HeaderBar from '../Base/HeaderBar';

export class DatasetUploadPage extends Component {
  componentWillMount() {
    const { project, datasets, params, fetchDatasets, fetchFieldPropertiesIfNeeded } = this.props;

    if (project.id && !datasets.fetchedAll && !datasets.isFetching) {
      fetchDatasets(params.projectId, false);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { project, datasets, datasetSelector, push, params, fetchDatasets } = nextProps;
    if (datasetSelector.id != this.props.datasetSelector.id) {
      push(`/projects/${ params.projectId }/datasets/${ datasetSelector.id }/inspect`);
    }

    if (project.id && !datasets.fetchedAll && !datasets.isFetching) {
      fetchDatasets(params.projectId, false);
    }
  }

  onDrop = (files) => {
    this.props.uploadDataset(this.props.project.id, files[0]);
  }

  onOpenClick = () => {
    this.refs.dropzone.open();
  }

  onPreloadedClick = () => {
    const { project, push } = this.props;
    push(`/projects/${ project.id }/datasets/preloaded`);
  }

  render() {
    const { projectTitle, datasetSelector } = this.props;

    return (
      <DocumentTitle title={ 'Upload' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
        <div className={ styles.fillContainer }>
          <ProjectTopBar paramDatasetId={ this.props.params.datasetId } routes={ this.props.routes } />
          <div
            className={ styles.datasetUploadBox }>
            { datasetSelector.isUploading &&
              <div className={ styles.uploadingZone + ' ' + styles.centeredFill }>
                { datasetSelector.progress && <Loader text={ datasetSelector.progress } /> }
                {/* { !datasetSelector.isUploading && datasetSelector.error &&
                  <NonIdealState
                    title='Error uploading dataset'
                    description={ datasetSelector.error }
                    visual='error'
                    action={ <div className={ styles.errorAction }>
                      <Button
                        onClick={ () => location.reload() }
                        iconName='refresh'
                        intent={ Intent.PRIMARY }
                        text="Refresh DIVE" />
                      </div>
                    }
                  />
                } */}
              </div>
            }
            { !datasetSelector.isUploading &&
              <Dropzone
                ref="dropzone"
                className={ styles.dropzone + ' ' + styles.centeredFill }
                onDrop={ this.onDrop }
                disableClick={ true }
                multiple={ false }
              >
                <Button
                  intent={ Intent.PRIMARY }
                  className="pt-large"
                  text="Upload Dataset"
                  onClick={ this.onOpenClick } />
                <div className={ styles.dragAndDrop }>or drag and drop files here</div>
                { !datasetSelector.error &&
                  <div className={ styles.uploadDescription }>
                    <div>Supported file types: CSV, TSV, and Excel.</div>
                  </div>
                }
                { datasetSelector.error &&
                  <div className={ styles.errorDescription }>
                    <div className="pt-callout pt-intent-danger pt-icon-error">
                      <h5>Upload Error</h5>
                      { datasetSelector.error } Please try another file.
                    </div>
                  </div>
                }
                <div className={ styles.separater }></div>
                <div className={ styles.preloadedNav }>Or select from <span className={ styles.link } onClick={ this.onPreloadedClick }>preloaded datasets</span></div>
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
