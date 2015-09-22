import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { fetchDataset } from '../../actions/DatasetActions';

import baseStyles from '../../../css/flexbox.sass';
import styles from './Datasets.sass';

import DataGridWrapper from './DataGridWrapper';

export class DatasetInspectPage extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { project, params } = this.props;
    if (project.properties.id) {
      this.props.fetchDataset(project.properties.id, params.datasetId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.project.properties.id !== this.props.project.properties.id || nextProps.params.datasetId !== this.props.params.datasetId) {
      const { project, params } = nextProps;
      this.props.fetchDataset(project.properties.id, params.datasetId);
    }    
  }

  render() {
    const dataset = this.props.datasets.items.filter((dataset) =>
      dataset.dID == this.props.params.datasetId
    )[0];

    return (
      <div className={ baseStyles.fillContainer }>
        { dataset &&
          <DataGridWrapper dataset={ dataset } />
        }        
        { this.props.children }
      </div>
    );
  }
}

DatasetInspectPage.propTypes = {
  project: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired,
  children: PropTypes.node
};


function mapStateToProps(state) {
  const { project, datasets } = state;
  return { project, datasets };
}

export default connect(mapStateToProps, { fetchDataset })(DatasetInspectPage);
