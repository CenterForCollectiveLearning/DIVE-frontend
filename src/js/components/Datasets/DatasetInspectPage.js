import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { fetchDataset, fetchDatasets, deleteDataset } from '../../actions/DatasetActions';
import { fetchFieldPropertiesIfNeeded } from '../../actions/FieldPropertiesActions';

import styles from './Datasets.sass';

import HeaderBar from '../Base/HeaderBar';
import RaisedButton from '../Base/RaisedButton';
import DropDownMenu from '../Base/DropDownMenu';
import DatasetPropertiesPane from './DatasetPropertiesPane';
import DatasetDataGrid from './DatasetDataGrid';
import DatasetRow from './DatasetRow';
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

    this.onSelectDataset = this.onSelectDataset.bind(this);
    this.onClickUploadDataset = this.onClickUploadDataset.bind(this);
    this.onClickDeleteDataset = this.onClickDeleteDataset.bind(this);
  }

  componentWillMount() {
    const { project, datasets, params, fetchDataset, fetchDatasets, fetchFieldPropertiesIfNeeded } = this.props;
    fetchDataset(params.projectId, params.datasetId);
    fetchFieldPropertiesIfNeeded(params.projectId, params.datasetId);

    if (project.properties.id && !datasets.fetchedAll && !datasets.isFetching) {
      fetchDatasets(params.projectId, false);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { project, params, datasetSelector, datasets, fetchDataset, fetchDatasets, fetchFieldPropertiesIfNeeded, push } = nextProps;
    if (project.properties.id !== this.props.project.properties.id || (!datasets.fetchedAll && !datasets.isFetching)) {
      fetchDatasets(project.properties.id, false);
    }

    if (params.projectId !== this.props.params.projectId || params.datasetId !== this.props.params.datasetId) {
      fetchDataset(params.projectId, params.datasetId);
      fetchFieldPropertiesIfNeeded(params.projectId, params.datasetId);
    }

    if (datasetSelector.datasetId != this.props.datasetSelector.datasetId) {
      if (datasetSelector.datasetId) {
        push(`/projects/${ params.projectId }/datasets/${ datasetSelector.datasetId }/inspect`);
      } else {
        push(`/projects/${ params.projectId }/datasets/upload`);
      }
    }
  }

  onSelectDataset(selectedValue) {
    if (selectedValue) {
      this.props.push(`/projects/${ this.props.project.properties.id }/datasets/${ selectedValue }/inspect`);
    }
  }

  onClickDeleteDataset() {
    const { deleteDataset, datasetSelector, project } = this.props;

    deleteDataset(project.properties.id, datasetSelector.datasetId);
  }

  onClickUploadDataset() {
    this.props.push(`/projects/${ this.props.project.properties.id }/datasets/upload`);
  }

  render() {
    const { datasets, datasetSelector, fieldProperties, params, project } = this.props;
    const dataset = datasets.items.filter((dataset) =>
      dataset.datasetId == params.datasetId
    )[0];

    return (
      <div className={ styles.fillContainer + ' ' + styles.datasetContainer }>
        <HeaderBar
          actions={
            <div className={ styles.headerControlRow }>
              <div className={ styles.headerControl }>
                <RaisedButton icon onClick={ this.onClickDeleteDataset }>
                  <i className="fa fa-trash"></i>
                </RaisedButton>
              </div>
              <div className={ styles.headerControl }>
                <RaisedButton label="Upload new dataset" onClick={ this.onClickUploadDataset } />
              </div>
            </div>
          }
        />
        { dataset && dataset.details &&
          <DatasetPropertiesPane dataset={ dataset } fieldProperties={ fieldProperties }/>
        }
        { dataset && dataset.details &&
          <DatasetDataGrid dataset={ dataset } fieldProperties={ fieldProperties }/>
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

export default connect(mapStateToProps, {
  deleteDataset,
  fetchDataset,
  fetchDatasets,
  fetchFieldPropertiesIfNeeded,
  push
})(DatasetInspectPage);
