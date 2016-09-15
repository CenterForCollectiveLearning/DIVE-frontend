import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { push } from 'react-router-redux';
import { fetchDataset, fetchDatasets, deleteDataset } from '../../actions/DatasetActions';
import { fetchFieldPropertiesIfNeeded } from '../../actions/FieldPropertiesActions';

import styles from './Datasets.sass';

import HeaderBar from '../Base/HeaderBar';
import RaisedButton from '../Base/RaisedButton';
import DropDownMenu from '../Base/DropDownMenu';
import DatasetDataGrid from './DatasetDataGrid';
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
        push(`/project/${ params.projectId }/dataset/${ datasetSelector.datasetId }/transform`);
      } else {
        push(`/project/${ params.projectId }/dataset/upload`);
      }
    }
  }

  openMergeDatasetsModal() {
    this.setState({ mergeDatasetsModalOpen: true });
  }

  closeMergeDatasetsModal() {
    this.setState({ mergeDatasetsModalOpen: false });
  }

  openPivotModal() {
    this.setState({ pivotModalOpen: true });
  }

  closePivotModal() {
    this.setState({ pivotModalOpen: false });
  }

  openColumnReductionModal() {
    this.setState({ reduceColumnsModalOpen: true });
  }

  closeColumnReductionModal() {
    this.setState({ reduceColumnsModalOpen: false });
  }

  onClickDeleteDataset() {
    const { deleteDataset, datasetSelector, project } = this.props;

    deleteDataset(project.properties.id, datasetSelector.datasetId);
  }

  render() {
    const { datasets, datasetSelector, fieldProperties, params, project, projectTitle } = this.props;
    const dataset = datasets.items.filter((dataset) =>
      dataset.datasetId == params.datasetId
    )[0];

    return (
      <DocumentTitle title={ 'Transform' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
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
                  <RaisedButton label="Reduce columns" onClick={ this.openColumnReductionModal.bind(this) }/>
                </div>
                <div className={ styles.headerControl }>
                  <RaisedButton label="Pivot" onClick={ this.openPivotModal.bind(this) }/>
                </div>
                <div className={ styles.headerControl }>
                  <RaisedButton label="Combine datasets" onClick={ this.openMergeDatasetsModal.bind(this) }/>
                </div>
              </div>
            }
          />

          { dataset && dataset.details &&
            <DatasetDataGrid dataset={ dataset } fieldProperties={ fieldProperties }/>
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
  return { project, projectTitle: project.properties.title, datasets, datasetSelector, fieldProperties };
}

export default connect(mapStateToProps, {
  deleteDataset,
  fetchDataset,
  fetchDatasets,
  fetchFieldPropertiesIfNeeded,
  push
})(DatasetTransformPage);
