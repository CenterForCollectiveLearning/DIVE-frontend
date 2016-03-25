import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replaceState } from 'redux-react-router';

import { fetchDatasets, selectDataset } from '../../actions/DatasetActions';
import styles from './Datasets.sass';

export class DatasetsPage extends Component {
  constructor(props) {
    super(props);

    const { replaceState, params, routes, project, datasetSelector, datasets, fetchDatasets, selectDataset } = this.props;

    if (routes.length < 4) {
      if (project.properties.id && !datasetSelector.loaded && !datasets.isFetching) {
        fetchDatasets(project.properties.id);
      } else if (datasetSelector.loaded) {
        if (datasetSelector.datasetId) {
          replaceState(null, `/projects/${ params.projectId }/datasets/${ datasetSelector.datasetId }/inspect`);
        } else {
          replaceState(null, `/projects/${ params.projectId }/datasets/upload`);
        }
      }
    } else {
        if (params.datasetId && params.datasetId != datasetSelector.datasetId) {
          selectDataset(params.projectId, params.datasetId);
        }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { replaceState, params, routes, project, datasetSelector, datasets, fetchDatasets } = nextProps;
    if (params.datasetId && params.datasetId != datasetSelector.datasetId) {
      selectDataset(params.projectId, params.datasetId);
    }

    if (routes.length < 4) {
      if ((project.properties.id && !datasetSelector.loaded && !datasets.isFetching) || (!datasets.isFetching && datasets.projectId != params.projectId)) {
        fetchDatasets(params.projectId);
      } else if (datasets.loaded && params.projectId == datasetSelector.projectId) {
        if (datasetSelector.datasetId && params.projectId == datasetSelector.projectId) {
          replaceState(null, `/projects/${ params.projectId }/datasets/${ datasetSelector.datasetId }/inspect`);
        } else {
          replaceState(null, `/projects/${ params.projectId }/datasets/upload`);
        }
      }
    }
  }

  render() {
    return (
      <div className={ styles.fillContainer + ' ' + styles.datasetPageContainer }>
        { this.props.children }
      </div>
    );
  }
}

DatasetsPage.propTypes = {
  project: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object.isRequired,
  children: PropTypes.node
};

function mapStateToProps(state) {
  const { project, datasets, datasetSelector, datasetId } = state;
  return {
    project,
    datasets,
    datasetSelector,
    datasetId
  }
}

export default connect(mapStateToProps, { fetchDatasets, selectDataset, replaceState })(DatasetsPage);
