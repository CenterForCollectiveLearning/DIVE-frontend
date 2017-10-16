import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';

import { Button, AnchorButton, Intent } from '@blueprintjs/core';

import { fetchDatasets } from '../../actions/DatasetActions';
import { fetchPreloadedDatasets, selectPreloadedDataset, deselectPreloadedDataset } from '../../actions/PreloadedDatasetActions';
import { chunk } from '../../helpers/helpers';
import datasetsStyles from './Datasets.sass';
import preloadedDatasetsStyles from './PreloadedDatasets.sass';
const styles = {
  ...datasetsStyles,
  ...preloadedDatasetsStyles
}

import ProjectTopBar from '../ProjectTopBar';
import Dropzone from 'react-dropzone';
import Loader from '../Base/Loader';
import HeaderBar from '../Base/HeaderBar';

export class DatasetPreloadedPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
        searchQuery: ''
    };
  }

  componentWillMount() {
    const { project, datasets, preloadedDatasets, fetchDatasets, fetchPreloadedDatasets } = this.props;

    if (project.id && !datasets.fetchedAll && !datasets.isFetching) {
      fetchDatasets(params.projectId);
    }

    if (project.id && !preloadedDatasets.fetchedAll && !preloadedDatasets.isFetching) {
      fetchPreloadedDatasets(project.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { project, datasets, preloadedDatasets, fetchDatasets, fetchPreloadedDatasets } = nextProps;

    if (project.id !== this.props.project.id || (!datasets.fetchedAll && !datasets.isFetching)) {
      fetchDatasets(project.id);
    }

    if (project.id && !preloadedDatasets.fetchedAll && !preloadedDatasets.isFetching) {
      fetchPreloadedDatasets(project.id);
    }
  }

  render() {
    const { project, datasets, datasetSelector, preloadedDatasets, selectPreloadedDataset, deselectPreloadedDataset, push } = this.props;

    const rows = chunk(preloadedDatasets.items, 3)

    // Workaround for deselect to work properly
    const unselectedDatasets = datasets.items.filter((d) => d.id != datasetSelector.id );
    const nextDataset = unselectedDatasets[0];

    return (
      <DocumentTitle title={ 'Preloaded' + ( project.title ? ` | ${ project.title }` : '' ) }>        
        <div className={ styles.fillContainer }>
          <ProjectTopBar paramDatasetId={ this.props.params.datasetId } routes={ this.props.routes } />
          <div className={ styles.fillContainer + ' ' + styles.preloadedDatasetsContainer }>
            <div className={ styles.headerControlRow + ' ' + styles.datasetSearch }>
              <div className='pt-input-group'>
                <span className='pt-icon pt-icon-search' />
                <input
                  className='pt-input'
                  type="search"
                  placeholder="search..."
                />
              </div>
            </div>
            { preloadedDatasets.isFetching &&
              <Loader text='Loading preloaded datasets' />
            }
            { !preloadedDatasets.isFetching && rows.length && rows.map((row, i) =>
              <div className= { styles.row } key={ `row-${ i }` }>
                { row.map((d) =>
                  <div
                    key={ d.id }
                    className={
                      'pt-card pt-interactive ' +
                      styles.selectButton + ' ' +
                      styles.preloadedDataset
                    }
                  >
                    <div className={ styles.top }>
                      <h5>{ d.title }</h5>
                      { d.infoUrl &&
                        <AnchorButton
                          className={ styles.infoLink + ' pt-minimal' }
                          href={ d.infoUrl }
                          target='_blank'
                          iconName='info-sign'
                        />
                      }
                    </div>
                    <p className={ styles.description }>{ d.description }</p>
                    <div className={ styles.bottom }>
                      <div className={ styles.metadata }>
                        <div className={ styles.tags }>
                          { d.tags && d.tags.map((t) =>
                              <span key={ `${ d.id }-tag-${ t }` } className={ 'pt-tag' }>{ t }</span>
                          )}
                        </div>
                      </div>
                      { d.selected &&
                        <div className={ styles.preloadedDatasetButtons }>
                          <Button
                            className={ styles.selectButton }
                            intent={ Intent.SUCCESS }
                            iconName='tick'
                            text='Selected'
                            onClick={ () => deselectPreloadedDataset(project.id, d.id, nextDataset) }
                          />
                          <Button
                            style={{ marginLeft: '10px'}}
                            intent={ Intent.PRIMARY }
                            iconName='eye-open'
                            text='Inspect'
                            onClick={ () => push(`/projects/${ project.id }/datasets/${ d.id }/inspect`) }
                          />
                        </div>
                      }
                      { !d.selected &&
                        <div className={ styles.preloadedDatasetButtons }>
                          <Button
                            className={ styles.selectButton }
                            text='Select'
                            onClick={ () => selectPreloadedDataset(project.id, d.id) }
                          />
                        </div>
                      }
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state) {
  const { project, datasets, datasetSelector, preloadedDatasets } = state;
  return { project, datasets, datasetSelector, preloadedDatasets };
}

export default connect(mapStateToProps, {
  fetchDatasets,
  fetchPreloadedDatasets,
  selectPreloadedDataset,
  deselectPreloadedDataset,
  push
})(DatasetPreloadedPage);
