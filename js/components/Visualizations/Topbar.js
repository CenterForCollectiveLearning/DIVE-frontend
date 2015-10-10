import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchDatasetsIfNeeded } from '../../actions/DatasetActions';
import { fetchFieldPropertiesIfNeeded, selectFieldProperty, selectAggregationFunction } from '../../actions/FieldPropertiesActions';
import { selectDataset, selectVisualizationType } from '../../actions/VisualizationActions';
import styles from './visualizations.sass';

import Select from 'react-select';
import ToggleButtonGroup from '../Base/ToggleButtonGroup';

export class Topbar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={ styles.topbar }>
      </div>
    );
  }
}

Topbar.propTypes = {
};

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps, { })(Topbar);
