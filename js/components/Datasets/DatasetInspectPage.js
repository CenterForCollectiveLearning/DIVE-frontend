import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import { fetchDataset } from '../../actions/DatasetActions';
import { fetchFieldPropertiesIfNeeded } from '../../actions/FieldPropertiesActions';

import styles from './Datasets.sass';

import DatasetDataGrid from './DatasetDataGrid';
import DatasetToolbar from './DatasetToolbar';
import DatasetRow from './DatasetRow';
import ReduceColumnsModal from './ReduceColumnsModal';

export class DatasetInspectPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnReductionModalOpen: false
    }
  }

  componentWillMount() {
    const { project, params, fetchDataset, fetchFieldPropertiesIfNeeded } = this.props;
    fetchDataset(params.projectId, params.datasetId);
    fetchFieldPropertiesIfNeeded(params.projectId, params.datasetId);
  }

  componentWillReceiveProps(nextProps) {
    const { fetchDataset, fetchFieldPropertiesIfNeeded, pushState, project, params, datasetSelector } = nextProps;
    if (params.projectId !== this.props.params.projectId || params.datasetId !== this.props.params.datasetId) {
      fetchDataset(params.projectId, params.datasetId);
      fetchFieldPropertiesIfNeeded(params.projectId, params.datasetId);
    }

    if (datasetSelector.datasetId != this.props.datasetSelector.datasetId) {
      pushState(null, `/projects/${ this.props.params.projectId }/data/${ datasetSelector.datasetId }/inspect`);
    }
  }

  openColumnReductionModal() {
    this.setState({ columnReductionModalOpen: true });
  }

  closeColumnReductionModal() {
    this.setState({ columnReductionModalOpen: false });
  }

  render() {
    const { datasets, fieldProperties, params, project } = this.props;
    const dataset = datasets.items.filter((dataset) =>
      dataset.datasetId == params.datasetId
    )[0];

    return (
      <div className={ styles.fillContainer + ' ' + styles.datasetContainer }>
        { datasets.items.length > 0 &&
          <DatasetToolbar
            openColumnReductionModalAction={ this.openColumnReductionModal.bind(this) }/>
        }
        { dataset && dataset.details &&
          <DatasetDataGrid dataset={ dataset } fieldProperties={ fieldProperties }/>
        }
        { this.state.columnReductionModalOpen &&
          <ReduceColumnsModal
            projectId={ params.projectId }
            datasetId={ params.datasetId }
            closeAction={ this.closeColumnReductionModal.bind(this) }
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
  fieldProperties: PropTypes.object.isRequired,
  children: PropTypes.node
};


function mapStateToProps(state) {
  const { project, datasets, datasetSelector, fieldProperties } = state;
  return { project, datasets, datasetSelector, fieldProperties };
}

export default connect(mapStateToProps, { fetchDataset, fetchFieldPropertiesIfNeeded, pushState })(DatasetInspectPage);
