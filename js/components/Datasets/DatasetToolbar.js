import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import { uploadDataset, deleteDataset, fetchDatasetsIfNeeded } from '../../actions/DatasetActions';
import styles from './datasets.sass';

import DropDownMenu from '../Base/DropDownMenu';
import RaisedButton from '../Base/RaisedButton';
import filePicker from 'component-file-picker';

export class DatasetToolbar extends Component {
  constructor(props) {
    super(props);
    this.onSelectDataset = this.onSelectDataset.bind(this);
    this.onClickUploadDataset = this.onClickUploadDataset.bind(this);
    this.onClickDeleteDataset = this.onClickDeleteDataset.bind(this);
  }

  componentWillMount() {
    const { projectId, datasets, fetchDatasetsIfNeeded } = this.props;

    if (!datasets.fetchedAll && !datasets.isFetching) {
      fetchDatasetsIfNeeded(projectId);
    }
  }

  onSelectDataset(selectedValue) {
    if (selectedValue) {
      this.props.pushState(null, `/projects/${this.props.projectId}/data/${selectedValue}/inspect`);
    }
  }

  onClickDeleteDataset() {
    const { deleteDataset, selectedDatasetId, projectId } = this.props;

    deleteDataset(projectId, selectedDatasetId);
  }

  onClickUploadDataset() {
    const projectId = this.props.projectId;
    this.props.pushState(null, `/projects/${ projectId }/data/upload`);
  }

  render() {
    const { datasets, selectedDatasetId, isPreloadedProject, openColumnReductionModalAction, openPivotModalAction, openMergeModalAction } = this.props;

    return (
      <div className={ styles.toolbar }>
        <div className={ styles.leftActions }>
          <span>Dataset: </span>
          <div className={ styles.datasetSelectorContainer }>
            <DropDownMenu
              className={ styles.datasetSelector }
              value={ selectedDatasetId }
              options={ datasets.items }
              valueMember="datasetId"
              displayTextMember="title"
              onChange={ this.onSelectDataset } />
          </div>
          { !isPreloadedProject &&
            <RaisedButton label="Upload new dataset" onClick={ this.onClickUploadDataset } />
          }
        </div>
        { !isPreloadedProject && selectedDatasetId &&            
          <div className={ styles.rightActions }>
            <RaisedButton icon={ true } onClick={ this.onSelectDeleteDataset }>
              <i className="fa fa-trash"></i>
            </RaisedButton>
            <RaisedButton label="Reduce columns" onClick={ openColumnReductionModalAction }/>
            <RaisedButton label="Pivot" onClick={ openPivotModalAction }/>
            <RaisedButton label="Combine datasets" onClick={ openMergeModalAction }/>
          </div>
        }
      </div>
    );
  }
}

DatasetToolbar.propTypes = {
  datasets: PropTypes.object.isRequired,
  projectId: PropTypes.string.isRequired,
  selectedDatasetId: PropTypes.string,
  openColumnReductionModalAction: PropTypes.func,
  openPivotModalAction: PropTypes.func,
  openMergeModalAction: PropTypes.func,
  isPreloadedProject: PropTypes.bool
};

function mapStateToProps(state) {
  const { datasets, project, datasetSelector } = state;
  return {
    datasets: datasets,
    projectId: `${ project.properties.id }`,
    selectedDatasetId: `${ datasetSelector.datasetId }`,
    preloadedProject: project.properties.preloaded
  };
}

export default connect(mapStateToProps, { pushState, uploadDataset, deleteDataset, fetchDatasetsIfNeeded })(DatasetToolbar);
