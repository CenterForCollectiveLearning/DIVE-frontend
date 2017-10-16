import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { push } from 'react-router-redux';
import { fetchDataset, fetchDatasets, deleteDataset } from '../../actions/DatasetActions';
import { fetchFieldPropertiesIfNeeded } from '../../actions/FieldPropertiesActions';

import { Button, Intent } from '@blueprintjs/core';

import stylesDatasets from './Datasets.sass';
import stylesTransform from './DatasetTransform.sass';
const styles = { ...stylesDatasets, ...stylesTransform };

import HeaderBar from '../Base/HeaderBar';
import RaisedButton from '../Base/RaisedButton';
import DropDownMenu from '../Base/DropDownMenu';
import DatasetDataList from './DatasetDataList';
import DatasetRow from './DatasetRow';
import ReduceColumnsModal from './ReduceColumnsModal';
import PivotModal from './PivotModal';
import MergeDatasetsModal from './MergeDatasetsModal';

export class DatasetTransformPage extends Component {
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

    if (project.id && !datasets.fetchedAll && !datasets.isFetching) {
      fetchDatasets(params.projectId, false);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { project, params, datasetSelector, datasets, fetchDataset, fetchDatasets, fetchFieldPropertiesIfNeeded, push } = nextProps;
    if (project.id !== this.props.project.id || (!datasets.fetchedAll && !datasets.isFetching)) {
      fetchDatasets(project.id, false);
    }

    if (params.projectId !== this.props.params.projectId || params.datasetId !== this.props.params.datasetId) {
      fetchDataset(params.projectId, params.datasetId);
      fetchFieldPropertiesIfNeeded(params.projectId, params.datasetId);
    }

    if (datasetSelector.id != this.props.datasetSelector.id) {
      if (datasetSelector.id) {
        push(`/projects/${ params.projectId }/datasets/${ datasetSelector.id }/transform`);
      } else {
        push(`/projects/${ params.projectId }/datasets/upload`);
      }
    }
  }

  openMergeDatasetsModal = () => {
    this.setState({ mergeDatasetsModalOpen: true });
  }

  closeMergeDatasetsModal = () => {
    this.setState({ mergeDatasetsModalOpen: false });
  }

  openPivotModal = () => {
    this.setState({ pivotModalOpen: true });
  }

  closePivotModal = () => {
    this.setState({ pivotModalOpen: false });
  }

  openColumnReductionModal = () => {
    this.setState({ reduceColumnsModalOpen: true });
  }

  closeColumnReductionModal = () => {
    this.setState({ reduceColumnsModalOpen: false });
  }

  onClickDeleteDataset = () => {
    const { deleteDataset, datasetSelector, project } = this.props;

    deleteDataset(project.id, datasetSelector.id);
  }

  render() {
    const { datasets, datasetSelector, fieldProperties, params, project, projectTitle } = this.props;
    const dataset = datasets.items.filter((dataset) =>
      dataset.id == params.datasetId
    )[0];

    return (
      <DocumentTitle title={ 'Transform' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
        <div className={ styles.fillContainer + ' ' + styles.datasetContainer }>
          <HeaderBar
            actions={
              <div className={ styles.headerControlRow }>
                <div className={ styles.headerControl }>
                  <Button
                    iconName='trash'
                    onClick={ this.onClickDeleteDataset }
                  />
                </div>
              </div>
            }
          />
          <div className={ styles.transformActions }>
            <div className={ styles.transformAction }>
              <Button
                text="Reduce columns"
                onClick={ this.openColumnReductionModal }
              />
            </div>
            <div className={ styles.transformAction }>
              <Button
                text="Pivot"
                onClick={ this.openPivotModal }
              />
            </div>
            <div className={ styles.transformAction }>
              <Button
                text="Combine datasets"
                onClick={ this.openMergeDatasetsModal }
              />
            </div>
          </div>

          { dataset && dataset.details &&
            <DatasetDataList dataset={ dataset } fieldProperties={ fieldProperties }/>
          }
          { dataset && dataset.details && this.state.reduceColumnsModalOpen &&
            <ReduceColumnsModal
              projectId={ params.projectId }
              datasetId={ params.datasetId }
              closeAction={ this.closeColumnReductionModal.bind(this) }
              columnNames={ dataset.details.fieldNames }/>
          }
          { dataset && dataset.details && this.state.mergeDatasetsModalOpen &&
            <MergeDatasetsModal
              projectId={ params.projectId }
              datasetId={ params.datasetId }
              datasets={ datasets.items }
              closeAction={ this.closeMergeDatasetsModal.bind(this) }
              columnNames={ dataset.details.fieldNames }/>
          }
          { dataset && dataset.details && this.state.pivotModalOpen &&
            <PivotModal
              projectId={ params.projectId }
              datasetId={ params.datasetId }
              closeAction={ this.closePivotModal.bind(this) }
              columnNames={ dataset.details.fieldNames }/>
          }
          { this.props.children }
        </div>
      </DocumentTitle>
    );
  }
}

DatasetTransformPage.propTypes = {
  project: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired,
  fieldProperties: PropTypes.object.isRequired,
  children: PropTypes.node
};


function mapStateToProps(state) {
  const { project, datasets, datasetSelector, fieldProperties } = state;
  return { project, projectTitle: project.title, datasets, datasetSelector, fieldProperties };
}

export default connect(mapStateToProps, {
  deleteDataset,
  fetchDataset,
  fetchDatasets,
  fetchFieldPropertiesIfNeeded,
  push
})(DatasetTransformPage);
