import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { push, replace } from 'react-router-redux';
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
    const { project, params, datasetSelector, datasets, fetchDataset, fetchDatasets, fetchFieldPropertiesIfNeeded, replace } = nextProps;
    if (project.properties.id !== this.props.project.properties.id || (!datasets.fetchedAll && !datasets.isFetching)) {
      fetchDatasets(project.properties.id, false);
    }

    if (params.projectId !== this.props.params.projectId || params.datasetId !== this.props.params.datasetId) {
      fetchDataset(params.projectId, params.datasetId);
      fetchFieldPropertiesIfNeeded(params.projectId, params.datasetId);
    }

    if (datasetSelector.datasetId != this.props.datasetSelector.datasetId) {
      if (datasetSelector.datasetId) {
        replace(`/projects/${ params.projectId }/datasets/${ datasetSelector.datasetId }/inspect`);
      } else {
        replace(`/projects/${ params.projectId }/datasets/upload`);
      }
    }
  }

  onSelectDataset = (selectedValue) => {
    if (selectedValue) {
      this.props.replace(`/projects/${ this.props.project.properties.id }/datasets/${ selectedValue }/inspect`);
    }
  }

  onClickDeleteDataset = () => {
    const { deleteDataset, datasetSelector, project } = this.props;

    deleteDataset(project.properties.id, datasetSelector.datasetId);
  }

  onClickUploadDataset = () => {
    this.props.replace(`/projects/${ this.props.project.properties.id }/datasets/upload`);
  }

  render() {
    const { datasets, datasetSelector, fieldProperties, params, project, projectTitle } = this.props;
    const dataset = datasets.items.filter((dataset) =>
      dataset.datasetId == params.datasetId
    )[0];

    return (
      <DocumentTitle title={ 'Inspect' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
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
          { dataset && false && dataset.details &&
            <DatasetPropertiesPane dataset={ dataset } fieldProperties={ fieldProperties }/>
          }
          { dataset && dataset.details &&
            <DatasetDataGrid dataset={ dataset } fieldProperties={ fieldProperties }/>
          }

          { this.props.children }
        </div>
      </DocumentTitle>
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
  return { project, projectTitle: project.properties.title, datasets, datasetSelector, fieldProperties };
}

export default connect(mapStateToProps, {
  deleteDataset,
  fetchDataset,
  fetchDatasets,
  fetchFieldPropertiesIfNeeded,
  push,
  replace
})(DatasetInspectPage);
