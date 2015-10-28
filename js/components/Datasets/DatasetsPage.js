import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replaceState } from 'redux-react-router';

import { fetchDatasetsIfNeeded } from '../../actions/DatasetActions';
import styles from './datasets.sass';

export class DatasetsPage extends Component {
  constructor(props) {
    super(props);

    const { replaceState, params, routes, project, datasetSelector, datasets } = this.props;

    if (routes.length < 4) {
      if (project.properties.id && !datasetSelector.loaded && !datasets.isFetching) {
        fetchDatasetsIfNeeded(project.properties.id);
      } else if (datasetSelector.loaded) {
        if (datasetSelector.datasetId) {
          replaceState(null, `/projects/${ params.projectId }/data/${ datasetSelector.datasetId }/inspect`);
        } else {
          replaceState(null, `/projects/${ params.projectId }/data/upload`);
        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { replaceState, params, routes, project, datasetSelector, datasets } = nextProps;

    if (this.props.project.properties.id !== project.properties.id) {
      if (routes.length < 4) {
        if (project.properties.id && !datasetSelector.loaded && !datasets.isFetching) {
          fetchDatasetsIfNeeded(project.properties.id);
        } else if (datasetSelector.loaded) {
          if (datasetSelector.datasetId) {
            replaceState(null, `/projects/${ params.projectId }/data/${ datasetSelector.datasetId }/inspect`);
          } else {
            replaceState(null, `/projects/${ params.projectId }/data/upload`);
          }
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

export default connect(mapStateToProps, { fetchDatasetsIfNeeded, replaceState })(DatasetsPage);
