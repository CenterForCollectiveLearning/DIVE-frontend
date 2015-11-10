import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replaceState } from 'redux-react-router';

import { fetchDatasetsIfNeeded } from '../../actions/DatasetActions';
import { selectTransformDataset } from '../../actions/TransformActions';
import styles from './Transform.sass';

import ActionBox from '../Base/ActionBox';
import RaisedButton from '../Base/RaisedButton';
import SelectContainerBox from '../Base/SelectContainerBox';
import SelectableBlock from '../Base/SelectableBlock';

export class TransformPage extends Component {
  componentWillMount() {
    if (this.props.project.properties.id) {
      this.props.fetchDatasetsIfNeeded(this.props.project.properties.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.datasets.items.length || (nextProps.project.properties.id !== this.props.project.properties.id)) {
      this.props.fetchDatasetsIfNeeded(nextProps.project.properties.id);
    }
  }

  render() {
    const { transformSelector, datasets, selectTransformDataset } = this.props;
    const { selectedDatasetIds } = transformSelector;
    return (
      <div className={ styles.transformPageContainer }>
        <ActionBox
          className={ styles.actionBox }
          heading="Select Dataset(s) to Transform or Merge">
          <SelectContainerBox>
            { datasets && datasets.items.map((dataset) =>
              <SelectableBlock
                selected={ selectedDatasetIds.indexOf(dataset.datasetId) >= 0 }
                value={ dataset.datasetId }
                onClick={ selectTransformDataset }>
                { dataset.title }
              </SelectableBlock>
            )}
          </SelectContainerBox>
          <div className={ styles.footer }>
            <div className={ styles.footerText }>
              Select 1 or more datasets to transform or merge.
            </div>
            <div className={ styles.footerAction }>
              <RaisedButton primary={ true } disabled={ selectedDatasetIds.length == 0 }>
                { selectedDatasetIds.length > 1 ? "Merge Datasets" : "Transform Dataset" }
              </RaisedButton>
            </div>
          </div>
        </ActionBox>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { datasets, project, transformSelector } = state;
  return { datasets, project, transformSelector };
}

export default connect(mapStateToProps, { replaceState, fetchDatasetsIfNeeded, selectTransformDataset })(TransformPage);
