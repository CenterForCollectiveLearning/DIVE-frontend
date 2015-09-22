import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import { fetchDatasetsIfNeeded } from '../../actions/DatasetActions';
import baseStyles from '../../../css/flexbox.sass';
import styles from './Datasets.sass';

import DatasetToolbar from './DatasetToolbar';

export class DatasetsPage extends Component {
  constructor(props) {
    super(props);

    // ghetto redirect
    if (this.props.routes.length < 4) {
      this.props.pushState(null, `/projects/${this.props.params.projectTitle}/datasets/upload`);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.project.properties.id !== this.props.project.properties.id) {
      const { project } = nextProps;
      this.props.fetchDatasetsIfNeeded(project.properties.id);
    }    
  }

  render() {
    const { datasets } = this.props;
    return (
      <div className={ baseStyles.fillContainer }>
        { datasets.items.length > 0 &&
          <DatasetToolbar datasets={ datasets.items } projectTitle={ this.props.params.projectTitle } selectedDatasetId={ this.props.params.datasetId }/>
        }
        {this.props.children}
      </div>
    );
  }
}

DatasetsPage.propTypes = {
  datasets: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
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
