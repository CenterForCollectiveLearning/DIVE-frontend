import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import { fetchDataset } from '../../actions/DatasetActions';

import styles from './datasets.sass';

import DataGrid from '../Base/DataGrid';
import DatasetToolbar from './DatasetToolbar';
import ReduceColumnsModal from './ReduceColumnsModal';
import PivotModal from './PivotModal';
import MergeDatasetsModal from './MergeDatasetsModal';

export class DatasetInspectPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reduceColumnsModalOpen: false,
      pivotModalOpen: false,
      mergeDatasetsModalOpen: false
    }
  }

  componentWillMount() {
    const { project, params } = this.props;
    this.props.fetchDataset(params.projectId, params.datasetId);
  }

  componentWillReceiveProps(nextProps) {
    const { fetchDataset, pushState, project, params, datasetSelector } = nextProps;
    if (params.projectId !== this.props.params.projectId || params.datasetId !== this.props.params.datasetId) {
      fetchDataset(params.projectId, params.datasetId);
    }

    if (datasetSelector.datasetId != this.props.datasetSelector.datasetId) {
      pushState(null, `/projects/${ this.props.params.projectId }/data/${ datasetSelector.datasetId }/inspect`);
    }
  }

  openMergeDatasetsModal() {
    this.setState({ mergeDatasetsModalOpen: true });
  }

  closeMergeDatasetsModal() {
    this.setState({ mergeDatasetsModalOpen: false });
  }

  openPivotModal() {
    this.setState({ pivotModalOpen: true });
  }

  closePivotModal() {
    this.setState({ pivotModalOpen: false });
  }

  openColumnReductionModal() {
    this.setState({ reduceColumnsModalOpen: true });
  }

  closeColumnReductionModal() {
    this.setState({ reduceColumnsModalOpen: false });
  }

  render() {
    const { datasets, params, project } = this.props;
    const dataset = datasets.items.filter((dataset) =>
      dataset.datasetId == params.datasetId
    )[0];

    return (
      <div className={ styles.fillContainer + ' ' + styles.datasetContainer }>
        { datasets.items.length > 0 &&
          <DatasetToolbar
            openMergeModalAction={ this.openMergeDatasetsModal.bind(this) }
            openPivotModalAction={ this.openPivotModal.bind(this) }
            openColumnReductionModalAction={ this.openColumnReductionModal.bind(this) }/>
        }
        { dataset && dataset.details &&
          <DataGrid
            datasetId={ `${ dataset.datasetId }` }
            data={ dataset.data }
            containerClassName={ styles.gridContainer }
            tableClassName={ styles.grid }/>
        }
        { this.state.reduceColumnsModalOpen &&
          <ReduceColumnsModal
            projectId={ params.projectId }
            datasetId={ params.datasetId }
            closeAction={ this.closeColumnReductionModal.bind(this) }
            columnNames={ dataset.details.fieldNames }/>
        }
        { this.state.mergeDatasetsModalOpen &&
          <MergeDatasetsModal
            projectId={ params.projectId }
            datasetId={ params.datasetId }
            datasets={ datasets.items }
            closeAction={ this.closeMergeDatasetsModal.bind(this) }
            columnNames={ dataset.details.fieldNames }/>
        }
        { this.state.pivotModalOpen &&
          <PivotModal
            projectId={ params.projectId }
            datasetId={ params.datasetId }
            closeAction={ this.closePivotModal.bind(this) }
            columnNames={ dataset.details.fieldNames }/>
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
  const { project, datasets, datasetSelector } = state;
  return { project, datasets, datasetSelector };
}

export default connect(mapStateToProps, { fetchDataset, pushState })(DatasetInspectPage);
