import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchDatasetsIfNeeded } from '../actions/ProjectActions.js';
import styles from '../../css/app.css';

import BaseComponent from '../components/BaseComponent';
import DatasetToolbar from '../components/DatasetToolbar';

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
        <div className={styles.toolbar}>
          <span>Dataset: </span>
          <DatasetToolbar datasets={datasets.items}/>
        </div>
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
