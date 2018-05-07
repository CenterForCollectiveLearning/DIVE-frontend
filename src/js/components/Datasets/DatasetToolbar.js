import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { uploadDataset, deleteDataset, fetchDatasets } from '../../actions/DatasetActions';
import styles from './Datasets.sass';

import { Button, Intent } from '@blueprintjs/core';

import Toolbar from '../Base/Toolbar';
import DropDownMenu from '../Base/DropDownMenu';
import RaisedButton from '../Base/RaisedButton';
import filePicker from 'component-file-picker';

export class DatasetToolbar extends Component {
  componentWillMount() {
    const { projectId, datasets, fetchDatasets } = this.props;

    if (projectId && !datasets.fetchedAll && !datasets.isFetching) {
      fetchDatasets(projectId, false);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { projectId, datasets, fetchDatasets } = nextProps;
    if (projectId != this.projectId && !datasets.fetchedAll && !datasets.isFetching) {
      fetchDatasets(projectId, false);
    }
  }

  onSelectDataset = (selectedValue) => {
    if (selectedValue) {
      this.props.push(`/projects/${ this.props.projectId }/datasets/${ selectedValue }/inspect`);
    }
  }

  onClickDeleteDataset = () => {
    const { deleteDataset, selectedDatasetId, projectId } = this.props;

    deleteDataset(projectId, selectedDatasetId);
  }

  onClickUploadDataset = () => {
    const projectId = this.props.projectId;
    this.props.push(`/projects/${ projectId }/datasets/upload`);
  }

  render() {
    const { datasets, selectedDatasetId, isPreloadedProject, uploadMode, openColumnReductionModalAction, openPivotModalAction, openMergeModalAction } = this.props;

    return (
      <Toolbar rightActions=
        { !isPreloadedProject && selectedDatasetId && !uploadMode &&
          <div className={ styles.rightActions }>
            <Button
              iconName='trash'
              onClick={ this.onClickDeleteDataset }
            />
            <Button
              text="Reduce columns"
              onClick={ openColumnReductionModalAction }
            />
            <Button
              text="Pivot"
              onClick={ openPivotModalAction }
            />
            <Button
              text="Combine datasets"
              onClick={ openMergeModalAction }
            />
          </div>
        }
      >
        <div>
          <span>Dataset: </span>
          <div className={ styles.datasetSelectorContainer }>
            <DropDownMenu
              className={ styles.datasetSelector }
              value={ uploadMode ? null : parseInt(selectedDatasetId) }
              options={ datasets.items.length > 0 ? datasets.items : [] }
              valueMember="datasetId"
              displayTextMember="title"
              onChange={ this.onSelectDataset } />
          </div>
          { !isPreloadedProject && !uploadMode &&
            <RaisedButton label="Upload new dataset" onClick={ this.onClickUploadDataset } />
          }
        </div>
      </Toolbar>
    );
  }
}

DatasetToolbar.propTypes = {
  datasets: PropTypes.object.isRequired,
  projectId: PropTypes.string,
  selectedDatasetId: PropTypes.string,
  openColumnReductionModalAction: PropTypes.func,
  openPivotModalAction: PropTypes.func,
  openMergeModalAction: PropTypes.func,
  isPreloadedProject: PropTypes.bool,
  uploadMode: PropTypes.bool
};

function mapStateToProps(state) {
  const { datasets, project, datasetSelector } = state;
  return {
    datasets: datasets,
    projectId: (project.id ? `${ project.id }` : null),
    selectedDatasetId: `${ datasetSelector.id }`,
    preloadedProject: project.preloaded
  };
}

export default connect(mapStateToProps, { push, uploadDataset, deleteDataset, fetchDatasets })(DatasetToolbar);
