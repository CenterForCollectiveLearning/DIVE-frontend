import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchDatasetsIfNeeded } from '../../actions/DatasetActions';
import { fetchFieldPropertiesIfNeeded, selectFieldProperty, selectAggregationFunction } from '../../actions/FieldPropertiesActions';
import { selectDataset, selectVisualizationType } from '../../actions/VisualizationActions';
import styles from './visualizations.sass';

import Select from 'react-select';
import RaisedButton from '../Base/RaisedButton';
import ToggleButtonGroup from '../Base/ToggleButtonGroup';

export class Topbar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // TODO Move this to state
    const menuItems = [
      { value: 'recommended', label: 'Recommended' },
      { value: 'correlation', label: 'Correlation' },
      { value: 'gini', label: 'Gini' },
      { value: 'normality', label: 'Normality' },
      { value: 'variance', label: 'Variance' },
    ]
    return (
      <div className={ styles.topbar }>
        <div className={ styles.rightActions }>
          <RaisedButton label="Share" onClick={ this.share } />
          <div className={ styles.topbarGroup }>
            <Select
              value={ 'Recommended' }
              options={ menuItems }
              onChange={ this.props.selectSort }
              multi={ false }
              clearable={ false }
              searchable={ false }
              className={ styles.topbarSelect }
            />
            <span className={ styles.topbarHeading }>Sorting Metric</span>
          </div>
        </div>
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
