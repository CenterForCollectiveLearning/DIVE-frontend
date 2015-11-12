import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { fetchDataset } from '../../actions/DatasetActions';

import styles from './datasets.sass';

import DataGrid from '../Base/DataGrid';
import DatasetToolbar from './DatasetToolbar';

export class DatasetInspectPage extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { project, params } = this.props;
    if (project.properties.id) {
      this.props.fetchDataset(project.properties.id, params.datasetId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.project.properties.id !== this.props.project.properties.id || nextProps.params.datasetId !== this.props.params.datasetId) {
      const { project, params } = nextProps;
      this.props.fetchDataset(project.properties.id, params.datasetId);
    }
  }

  render() {
    const { datasets, params } = this.props;
    const dataset = datasets.items.filter((dataset) =>
      dataset.datasetId == params.datasetId
    )[0];

    return (
      <div className={ styles.fillContainer + ' ' + styles.datasetContainer }>
        { datasets.items.length > 0 &&
          <DatasetToolbar datasets={ datasets.items } projectId={ params.projectId } selectedDatasetId={ params.datasetId }/>
        }
        { dataset && dataset.details &&
          <DataGrid
            data={ dataset.data }
            containerClassName={ styles.gridContainer }
            tableClassName={ styles.grid }/>
        }
        { this.props.children }
      </div>
    );
  }
}

DatasetInspectPage.propTypes = {
  project: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired,
  children: PropTypes.node
};


function mapStateToProps(state) {
  const { project, datasets } = state;
  return { project, datasets };
}

export default connect(mapStateToProps, { fetchDataset })(DatasetInspectPage);
