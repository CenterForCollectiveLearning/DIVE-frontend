import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push, replace } from 'react-router-redux';
import DocumentTitle from 'react-document-title';

import { fetchDatasets, selectDataset } from '../../actions/DatasetActions';
import styles from './Datasets.sass';

export class DatasetsPage extends Component {
  constructor(props) {
    super(props);

    const { push, replace, params, routes, project, datasetSelector, datasets, fetchDatasets, selectDataset } = this.props;

    if (routes.length < 4) {
      if (project.id && !datasetSelector.loaded && !datasets.isFetching) {
        fetchDatasets(project.id);
      } else if (datasetSelector.loaded) {
        if (datasetSelector.id) {
          replace(`/projects/${ params.projectId }/datasets/${ datasetSelector.id }/inspect`);
        } else {
          replace(`/projects/${ params.projectId }/datasets/upload`);
        }
      }
    } else {
        if (params.datasetId && params.datasetId != datasetSelector.id) {
          selectDataset(params.projectId, params.datasetId);
        }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { push, replace, params, routes, project, datasetSelector, datasets, fetchDatasets } = nextProps;
    if (params.datasetId && params.datasetId != datasetSelector.id) {
      selectDataset(params.projectId, params.datasetId);
    }

    if (routes.length < 4) {
      if ((project.id && !datasetSelector.loaded && !datasets.isFetching) || (!datasets.isFetching && datasets.projectId != params.projectId)) {
        fetchDatasets(params.projectId);
      } else if (datasets.loaded && params.projectId == datasetSelector.projectId) {
        if (datasetSelector.id && params.projectId == datasetSelector.projectId) {
          replace(`/projects/${ params.projectId }/datasets/${ datasetSelector.id }/inspect`);
        } else {
          replace(`/projects/${ params.projectId }/datasets/upload`);
        }
      }
    }
  }

  render() {
    const { projectTitle } = this.props;

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
    datasetId,
    projectTitle: project.title
  }
}

export default connect(mapStateToProps, { fetchDatasets, selectDataset, push, replace })(DatasetsPage);
