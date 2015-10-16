import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ActionBox from '../Base/ActionBox';

import { fetchDatasetsIfNeeded } from '../../actions/DatasetActions';
import styles from './transformation.sass';

export class TransformationPage extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.project.properties.id !== this.props.project.properties.id) {
      this.props.fetchDatasetsIfNeeded(nextProps.project.properties.id);
    }
  }

  render() {
    return (
      <div className={ styles.fillContainer }>
        <ActionBox heading="Select Datasets to Merge">
          { this.props.datasets.items.map(dataset =>
            <div>{ dataset.title }</div>
          )}
        </ActionBox>
        { this.props.children }
      </div>
    );
  }
}

TransformationPage.propTypes = {
  project: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired,
  children: PropTypes.node
};

function mapStateToProps(state) {
  const { project, datasets } = state;
  return {
    project,
    datasets
  }
}

export default connect(mapStateToProps, { fetchDatasetsIfNeeded })(TransformationPage);
