import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';

import { fetchDatasets } from '../../actions/DatasetActions';
import { uploadDataset } from '../../actions/DatasetActions';
import { chunk } from '../../helpers/helpers';
import datasetsStyles from './Datasets.sass';
import preloadedDatasetsStyles from './PreloadedDatasets.sass';
const styles = {
  ...datasetsStyles,
  ...preloadedDatasetsStyles
}

import Dropzone from 'react-dropzone';
import Loader from '../Base/Loader';
import HeaderBar from '../Base/HeaderBar';

export class DatasetPreloadedPage extends Component {
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
    const fileSize = files[0].size;
    const fileSizeLimit = 1000; // 100 * (1000 * 1000);

    this.props.uploadDataset(this.props.project.id, files[0]);
  }

  onOpenClick() {
    this.refs.dropzone.open();
  }

  render() {
    const { projectTitle, datasetSelector } = this.props;

    const preloadedDatasets = [
      {
        id: 1,
        title: 'Test dataset A',
        description: 'Test description A'
      },
      {
        id: 2,
        title: 'Test dataset B',
        description: 'Test description A'
      },
      {
        id: 3,
        title: 'Test dataset C',
        description: 'Test description A'
      },
      {
        id: 4,
        title: 'Test dataset D',
        description: 'Test description A'
      }
    ]

    const rows = chunk(preloadedDatasets, 3)

    return (
      <DocumentTitle title={ 'Preloaded' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
        <div className={ styles.fillContainer + ' ' + styles.preloadedDatasetsContainer }>
          <div className={ styles.headerControlRow + ' ' + styles.datasetSearch }>
            <div className='pt-input-group'>
              <span className='pt-icon pt-icon-search' />
              <input
                className='pt-input'
                type="search"
                placeholder="search..."
              />
            </div>
          </div>
          { rows.map((row) =>
            <div className= { styles.row }>
              { row.map((d) =>
                <div
                  key={ d.id }
                  className={
                    'pt-card pt-interactive ' +
                    styles.preloadedDataset
                  }
                >
                  <h5>{ d.title }</h5>
                  <p>{ d.description }</p>
                </div>
              )}
            </div>
          )}

        </div>
      </DocumentTitle>
    );
  }
}

DatasetPreloadedPage.propTypes = {
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
})(DatasetPreloadedPage);
