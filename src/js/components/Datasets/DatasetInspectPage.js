import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

import { push, replace } from 'react-router-redux';
import { parseFromQueryObject, updateQueryString } from '../../helpers/helpers';
import { setInspectQueryString as setPersistedQueryString, getInitialState, fetchDataset, fetchDatasets, deleteDataset } from '../../actions/DatasetActions';
import { fetchFieldPropertiesIfNeeded } from '../../actions/FieldPropertiesActions';
import { deselectPreloadedDataset } from '../../actions/PreloadedDatasetActions';

import { Button, Intent } from '@blueprintjs/core';

import styles from './Datasets.sass';


import ProjectTopBar from '../ProjectTopBar';
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

    if (datasetSelector.id != this.props.datasetSelector.id) {
      if (datasetSelector.id) {
        push(`/projects/${ params.projectId }/datasets/${ datasetSelector.id }/inspect`);
      } else {
        push(`/projects/${ params.projectId }/datasets/upload`);
      }
    }

    if (datasetSelector.id == null) {
      this.props.push(`/projects/${ params.projectId }/datasets/upload`);
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

  onClickDeleteDataset = (e) => {
    const { deleteDataset, datasetSelector, project } = this.props;
    e.stopPropagation();
    e.preventDefault();
    deleteDataset(project.id, datasetSelector.id);
  }

  onClickDeselectPreloadedDataset = (projectId, datasetId, e, nextDataset=null) => {
    const { deselectPreloadedDataset } = this.props;
    e.stopPropagation();
    e.preventDefault();
    deselectPreloadedDataset(projectId, datasetId, nextDataset);
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
    const { datasets, datasetSelector, fieldProperties, params, project, selectedLayoutType, deselectPreloadedDataset } = this.props;
    const dataset = datasets.items.filter((dataset) =>
      dataset.id == params.datasetId
    )[0];

    const nextDataset = datasets.items.filter((d) => d.id != datasetSelector.id)[0];

    return (
      <DocumentTitle title={ 'Inspect' + ( project.title ? ` | ${ project.title }` : '' ) }>
        <div className={ styles.fillContainer + ' ' + styles.datasetContainer }>
          <ProjectTopBar paramDatasetId={ this.props.params.datasetId } routes={ this.props.routes } />
          <HeaderBar
            sidebar={ false }
            actions={
              <div className={ styles.pageRightActions }>
                <Button
                  intent={ Intent.PRIMARY }
                  iconName="upload"
                  onClick={ this.onClickUploadDataset }
                  text="Upload New Dataset" />
                { datasetSelector.preloaded &&
                  <Button
                    iconName='remove'
                    text='Remove'
                    onClick={ (e) => this.onClickDeselectPreloadedDataset(project.id, dataset.id, e, nextDataset )} />
                }
                { !datasetSelector.preloaded &&
                  <Button
                    iconName='trash'
                    onClick={ (e) => this.onClickDeleteDataset(e) } />
                }
              </div>
            }
          />
          { dataset && dataset.details &&
            <DatasetPropertiesPane 
              dataset={ dataset }
              fieldProperties={ fieldProperties }
              rightActions={ 
                <ToggleButtonGroup
                  className={ styles.formatToggle }
                  toggleItems={ datasetSelector.layoutTypes }
                  valueMember="id"
                  displayTextMember="label"
                  expand={ false }
                  separated={ false }
                  externalSelectedItems={ [ selectedLayoutType ] }
                  onChange={ (v) => this.clickQueryStringTrackedItem({ selectedLayoutType: v }) } />
              }
            />
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
  deselectPreloadedDataset,
  setPersistedQueryString,
  push,
  replace
})(DatasetInspectPage);
