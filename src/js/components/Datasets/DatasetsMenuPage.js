import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push, replace } from 'react-router-redux';
import DocumentTitle from 'react-document-title';

import { fetchDatasets, selectDataset } from '../../actions/DatasetActions';
import styles from './Datasets.sass';

import ProjectTopBar from '../ProjectTopBar';

export class DatasetsMenuPage extends Component {
  onMenuOptionClick = (route) => {
    this.props.push(`/projects/${ this.props.projectId }/datasets/${ route }`);
  }

  render() {
    const { paramDatasetId, projectTitle, datasetSelector, datasets } = this.props;

    const datasetId = paramDatasetId || datasetSelector.id || (datasets.items.length > 0 && datasets.items[0].datasetId);

    const menuOptions = [
      {
        title: 'Upload',
        iconName: 'cloud-upload',
        description: 'Upload your dataset',
        disabled: false,
        route: 'upload'
      },
      {
        title: 'Preloaded',
        iconName: 'add-to-folder',
        description: 'Explore preloaded datasets',
        disabled: false,
        route: 'preloaded'
      },
      {
        title: 'Inspect',
        iconName: 'eye-open',
        description: 'View datasets in project',
        disabled: !datasetId,
        route: `${ datasetId }/inspect`
      }
    ]

    return (
      <div className={ styles.fillContainer }>
        <ProjectTopBar paramDatasetId={ this.props.params.datasetId } routes={ this.props.routes } />
        <div className={ styles.fillContainer + ' ' + styles.datasetMenuPageContainer + ' ' + styles.centeredFill }>
          { menuOptions.map((e, i) => 
            <div
              key={ `menu-option-${ i }` }
              onClick={ () => this.onMenuOptionClick(e.route) }
              className={
                'pt-card pt-interactive ' +
                styles.menuOption + 
                ( e.disabled ? ' ' + styles.disabled : '')
              }
            >
              <div className={ styles.top }>
                <h5>{ e.title }</h5>
                <span className={ `pt-icon pt-icon-${ e.iconName } ${ styles.menuOptionIcon }` } />
              </div>
              <p className={ styles.description }>{ e.description }</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

DatasetsMenuPage.propTypes = {
  project: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object.isRequired,
  children: PropTypes.node
};

function mapStateToProps(state) {
  const { project, datasets, datasetSelector, datasetId } = state;
  return {
    project,
    projectId: project.id,
    datasets,
    datasetSelector,
    paramDatasetId: datasetId,
    projectTitle: project.title
  }
}

export default connect(mapStateToProps, { fetchDatasets, selectDataset, push, replace })(DatasetsMenuPage);
