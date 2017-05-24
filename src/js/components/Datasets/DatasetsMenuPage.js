import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push, replace } from 'react-router-redux';
import DocumentTitle from 'react-document-title';

import { fetchDatasets, selectDataset } from '../../actions/DatasetActions';
import styles from './Datasets.sass';

export class DatasetsMenuPage extends Component {
  // constructor(props) {
  //   super(props);

  //   const { push, replace, params, routes, project, datasetSelector, datasets, fetchDatasets, selectDataset } = this.props;

  //   if (routes.length < 4) {
  //     if (project.id && !datasetSelector.loaded && !datasets.isFetching) {
  //       fetchDatasets(project.id);
  //     } else if (datasetSelector.loaded) {
  //       if (datasetSelector.id) {
  //         replace(`/projects/${ params.projectId }/datasets/${ datasetSelector.id }/inspect`);
  //       } else {
  //         replace(`/projects/${ params.projectId }/datasets/upload`);
  //       }
  //     }
  //   } else {
  //       if (params.datasetId && params.datasetId != datasetSelector.id) {
  //         selectDataset(params.projectId, params.datasetId);
  //       }
  //   }
  // }

  // componentWillReceiveProps(nextProps) {
  //   const { push, replace, params, routes, project, datasetSelector, datasets, fetchDatasets } = nextProps;
  //   if (params.datasetId && params.datasetId != datasetSelector.id) {
  //     selectDataset(params.projectId, params.datasetId);
  //   }

  //   if (routes.length < 4) {
  //     if ((project.id && !datasetSelector.loaded && !datasets.isFetching) || (!datasets.isFetching && datasets.projectId != params.projectId)) {
  //       fetchDatasets(params.projectId);
  //     } else if (datasets.loaded && params.projectId == datasetSelector.projectId) {
  //       if (datasetSelector.id && params.projectId == datasetSelector.projectId) {
  //         replace(`/projects/${ params.projectId }/datasets/${ datasetSelector.id }/inspect`);
  //       } else {
  //         replace(`/projects/${ params.projectId }/datasets/upload`);
  //       }
  //     }
  //   }
  // }

  render() {
    const { projectTitle } = this.props;

    const menuOptions = [
      {
        title: 'Upload',
        iconName: 'file',
        description: 'Upload your dataset'
      },
      {
        title: 'Preloaded',
        iconName: 'file',
        description: 'Explore preloaded datasets'
      },
      {
        title: 'Inspect',
        iconName: 'file',
        description: 'View datasets in project'
      }
    ]

    return (
      <div className={ styles.fillContainer + ' ' + styles.datasetMenuPageContainer }>
        { menuOptions.map((e, i) => 
          <div
            key={ `menu-option-${ i }` }
            className={
              'pt-card pt-interactive ' +
              styles.menuOption
            }
          >
            <div className={ styles.top }>
              { e.title }
            </div>
            <p className={ styles.description }>{ e.description }</p>
          </div>
        )}
      </div>
    );
  }
}

DatasetsMenuPage.propTypes = {
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

export default connect(mapStateToProps, { fetchDatasets, selectDataset, push, replace })(DatasetsMenuPage);
