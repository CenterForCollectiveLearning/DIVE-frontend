import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { push, replace } from 'react-router-redux';
import { fetchDataset, fetchDatasets, deleteDataset, selectLayoutType } from '../../actions/DatasetActions';
import { fetchFieldPropertiesIfNeeded } from '../../actions/FieldPropertiesActions';

import styles from './Datasets.sass';

import HeaderBar from '../Base/HeaderBar';
import RaisedButton from '../Base/RaisedButton';
import DropDownMenu from '../Base/DropDownMenu';
import ToggleButtonGroup from '../Base/ToggleButtonGroup';
import DatasetPropertiesPane from './DatasetPropertiesPane';
import DatasetDataList from './DatasetDataList';
import DatasetDataGrid from './DatasetDataGrid';
import DatasetRow from './DatasetRow';
import ReduceColumnsModal from './ReduceColumnsModal';
import PivotModal from './PivotModal';
import MergeDatasetsModal from './MergeDatasetsModal';

export class DatasetInspectPage extends Component {
  constructor(props) {
    super(props);
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
    const { project, params, datasetSelector, datasets, fetchDataset, fetchDatasets, fetchFieldPropertiesIfNeeded, replace } = nextProps;
    if (project.id !== this.props.project.id || (!datasets.fetchedAll && !datasets.isFetching)) {
      fetchDatasets(project.id, false);
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
      this.props.replace(`/projects/${ this.props.project.id }/datasets/${ selectedValue }/inspect`);
    }
  }

  onClickLayoutType = (layoutType) => {
    const { selectLayoutType } = this.props;
    selectLayoutType(layoutType);
  }

  onClickDeleteDataset = () => {
    const { deleteDataset, datasetSelector, project } = this.props;

    deleteDataset(project.id, datasetSelector.datasetId);
  }

  onClickUploadDataset = () => {
    this.props.replace(`/projects/${ this.props.project.id }/datasets/upload`);
  }

  render() {
    const { datasets, datasetSelector, fieldProperties, params, project, projectTitle } = this.props;
    const { layoutTypes } = datasetSelector;
    const selectedLayoutType = layoutTypes.find((e) => e.selected).id;
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
                  <ToggleButtonGroup
                    toggleItems={ datasetSelector.layoutTypes }
                    valueMember="id"
                    displayTextMember="label"
                    expand={ false }
                    separated={ false }
                    onChange={ this.onClickLayoutType } />
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
          { dataset && dataset.details && ( selectedLayoutType == 'table' ) &&
            <DatasetDataGrid dataset={ dataset } fieldProperties={ fieldProperties }/>
          }
          { dataset && dataset.details && ( selectedLayoutType == 'list' ) &&
            <DatasetDataList dataset={ dataset } fieldProperties={ fieldProperties }/>
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
  return { project, projectTitle: project.title, datasets, datasetSelector, fieldProperties };
}

export default connect(mapStateToProps, {
  deleteDataset,
  fetchDataset,
  fetchDatasets,
  fetchFieldPropertiesIfNeeded,
  selectLayoutType,
  push,
  replace
})(DatasetInspectPage);
