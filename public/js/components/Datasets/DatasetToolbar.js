import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import { uploadDataset, deleteDataset, fetchDatasetsIfNeeded } from '../../actions/DatasetActions';
import styles from './Datasets.sass';

import Toolbar from '../Base/Toolbar';
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

    if (projectId && !datasets.fetchedAll && !datasets.isFetching) {
      fetchDatasetsIfNeeded(projectId, false);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { projectId, datasets, fetchDatasetsIfNeeded } = nextProps;
    if (projectId != this.projectId && !datasets.fetchedAll && !datasets.isFetching) {
      fetchDatasetsIfNeeded(projectId, false);
    }
  }

  onSelectDataset(selectedValue) {
    if (selectedValue) {
      this.props.pushState(null, `/projects/${ this.props.projectId }/datasets/${ selectedValue }/inspect`);
    }
  }

  onClickDeleteDataset() {
    const { deleteDataset, selectedDatasetId, projectId } = this.props;

    deleteDataset(projectId, selectedDatasetId);
  }

  onClickUploadDataset() {
    const projectId = this.props.projectId;
    this.props.pushState(null, `/projects/${ projectId }/datasets/upload`);
  }

  render() {
    const { datasets, selectedDatasetId, isPreloadedProject, uploadMode, openColumnReductionModalAction, openPivotModalAction, openMergeModalAction } = this.props;

    return (
      <Toolbar rightActions=
        { !isPreloadedProject && selectedDatasetId && !uploadMode &&
          <div className={ styles.rightActions }>
            <RaisedButton icon={ true } onClick={ this.onClickDeleteDataset }>
              <i className="fa fa-trash"></i>
            </RaisedButton>
            <RaisedButton label="Reduce columns" onClick={ openColumnReductionModalAction }/>
            <RaisedButton label="Pivot" onClick={ openPivotModalAction }/>
            <RaisedButton label="Combine datasets" onClick={ openMergeModalAction }/>
          </div>
        }
      >
        <div>
          <span>Dataset: </span>
          <div className={ styles.datasetSelectorContainer }>
            <DropDownMenu
              className={ styles.datasetSelector }
              value={ uploadMode ? null : selectedDatasetId }
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
    projectId: (project.properties.id ? `${ project.properties.id }` : null),
    selectedDatasetId: `${ datasetSelector.datasetId }`,
    preloadedProject: project.properties.preloaded
  };
}

export default connect(mapStateToProps, { pushState, uploadDataset, deleteDataset, fetchDatasetsIfNeeded })(DatasetToolbar);
