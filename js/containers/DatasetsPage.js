import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchDatasetsIfNeeded } from '../actions/ProjectActions.js';

import BaseComponent from '../components/BaseComponent';
import DatasetList from '../components/DatasetList';

export class DatasetsPage extends BaseComponent {
  componentWillReceiveProps(nextProps) {
    if (nextProps.project.properties.id !== this.props.project.properties.id) {
      const { project } = nextProps;
      this.props.fetchDatasetsIfNeeded(project.properties.id);
    }    
  }

  render() {
    const { datasets } = this.props;
    return (
      <div>
        <h2>dataset list</h2>
        <DatasetList datasets={datasets.items}/>
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

export default connect(mapStateToProps, { fetchDatasetsIfNeeded })(DatasetsPage);
