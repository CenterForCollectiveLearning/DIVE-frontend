import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

import { push, replace } from 'react-router-redux';
import { parseFromQueryObject, updateQueryString } from '../../helpers/helpers';
import { setInspectQueryString as setPersistedQueryString, getInitialState, fetchDataset, fetchDatasets, deleteDataset } from '../../actions/DatasetActions';
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
  componentWillMount() {
    const { project, datasets, params, fetchDataset, fetchDatasets, fetchFieldPropertiesIfNeeded, persistedQueryString, pathname, replace } = this.props;
    fetchDataset(params.projectId, params.datasetId);
    fetchFieldPropertiesIfNeeded(params.projectId, params.datasetId);

    if (project.id && !datasets.fetchedAll && !datasets.isFetching) {
      fetchDatasets(params.projectId, false);
    }

    if ( persistedQueryString ) {
      replace(`${ pathname }${ persistedQueryString }`);
    } else {
      this.setRecommendedInitialState();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { queryObject: currentQueryObject } = this.props;
    const { queryObject: nextQueryObject, project, params, datasetSelector, datasets, fetchDataset, fetchDatasets, fetchFieldPropertiesIfNeeded, replace, push } = nextProps;
    if (project.id !== this.props.project.id || (!datasets.fetchedAll && !datasets.isFetching)) {
      fetchDatasets(project.id, false);
    }

    const shouldRecommendInitialState = Object.keys(currentQueryObject) == 0 && Object.keys(nextQueryObject).length == 0;
    if ( shouldRecommendInitialState ) {
      this.setRecommendedInitialState();
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

  setRecommendedInitialState() {
    const { project, datasetSelector, pathname, queryObject, replace, setPersistedQueryString } = this.props;

    const initialState = getInitialState();
    const newQueryString = updateQueryString(queryObject, initialState);
    setPersistedQueryString(newQueryString);
    replace(`${ pathname }${ newQueryString }`);
  }

  onSelectDataset = (selectedValue) => {
    if (selectedValue) {
      this.props.replace(`/projects/${ this.props.project.id }/datasets/${ selectedValue }/inspect`);
    }
  }

  onClickDeleteDataset = () => {
    const { deleteDataset, datasetSelector, project } = this.props;

    deleteDataset(project.id, datasetSelector.datasetId);
  }

  onClickUploadDataset = () => {
    this.props.replace(`/projects/${ this.props.project.id }/datasets/upload`);
  }

  clickQueryStringTrackedItem = (newObj) => {
    const { pathname, queryObject, setPersistedQueryString, push } = this.props;
    const newQueryString = updateQueryString(queryObject, newObj);
    setPersistedQueryString(newQueryString);
    push(`${ pathname }${ newQueryString }`);
  }

  render() {
    const { datasets, datasetSelector, fieldProperties, params, project, selectedLayoutType } = this.props;
    const dataset = datasets.items.filter((dataset) =>
      dataset.datasetId == params.datasetId
    )[0];

    return (
      <DocumentTitle title={ 'Inspect' + ( project.title ? ` | ${ project.title }` : '' ) }>
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
                    externalSelectedItems={ [ selectedLayoutType ] }
                    onChange={ (v) => this.clickQueryStringTrackedItem({ selectedLayoutType: v }) } />
                </div>
                <div className={ styles.headerControl }>
                  <RaisedButton buttonStyle='blueAction' label="+ Upload new dataset" onClick={ this.onClickUploadDataset } />
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

function mapStateToProps(state, ownProps) {
  const { project, datasets, datasetSelector, fieldProperties } = state;
  const pathname = ownProps.location.pathname;
  const queryObject = ownProps.location.query;

  return {
    project,
    datasets,
    datasetSelector,
    fieldProperties,
    queryObject: queryObject,
    pathname: pathname,
    persistedQueryString: datasetSelector.inspectQueryString,
    selectedLayoutType: parseFromQueryObject(queryObject, 'selectedLayoutType', false)
  };
}

export default connect(mapStateToProps, {
  deleteDataset,
  fetchDataset,
  fetchDatasets,
  fetchFieldPropertiesIfNeeded,
  setPersistedQueryString,
  push,
  replace
})(DatasetInspectPage);
