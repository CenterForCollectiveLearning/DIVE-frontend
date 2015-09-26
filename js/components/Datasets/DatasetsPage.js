import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import { fetchDatasetsIfNeeded } from '../../actions/DatasetActions';
import styles from './datasets.sass';

import DatasetToolbar from './DatasetToolbar';

export class DatasetsPage extends Component {
  constructor(props) {
    super(props);

    if (this.props.routes.length < 4) {
      this.props.pushState(null, `/projects/${this.props.params.projectId}/datasets/upload`);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.project.properties.id !== this.props.project.properties.id) {
      const { project } = nextProps;
      this.props.fetchDatasetsIfNeeded(project.properties.id);
    }
  }

  render() {
    const { datasets, params } = this.props;
    return (
      <div className={ styles.fillContainer }>
        { datasets.items.length > 0 &&
          <DatasetToolbar datasets={ datasets.items } projectId={ params.projectId } selectedDatasetId={ params.datasetId }/>
        }
        {this.props.children}
      </div>
    );
  }
}

DatasetsPage.propTypes = {
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

export default connect(mapStateToProps, { fetchDatasetsIfNeeded, pushState })(DatasetsPage);
