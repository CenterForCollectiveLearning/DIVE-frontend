import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchDataset } from '../../actions/DatasetActions';

import baseStyles from '../../../css/flexbox.sass';
import styles from './Datasets.sass';

export class DatasetInspectPage extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.project.properties.id !== this.props.project.properties.id || nextProps.params.datasetId !== this.props.params.datasetId) {
      const { project, params } = nextProps;
      this.props.fetchDataset(project.properties.id, params.datasetId);
    }    
  }

  render() {
    return (
      <div className={ baseStyles.fillContainer }>
        inspecting dataset
        { this.props.children }
      </div>
    );
  }
}

DatasetInspectPage.propTypes = {
  project: PropTypes.object.isRequired,
  children: PropTypes.node
};


function mapStateToProps(state) {
  const { project } = state;
  return { project };
}

export default connect(mapStateToProps, { fetchDataset })(DatasetInspectPage);
