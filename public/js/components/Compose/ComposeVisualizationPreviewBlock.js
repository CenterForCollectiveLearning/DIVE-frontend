import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { selectComposeVisualization } from '../../actions/ComposeActions';

import styles from './Compose.sass';

import Visualization from '../Visualizations/Visualization';

export default class ComposeVisualizationPreviewBlock extends Component {
  handleClick() {
    const { spec, onClick } = this.props;
    onClick(spec.id, spec.meta.desc);
  }

  render() {
    const { spec } = this.props;

    return (
      <div className={ styles.visualizationPreviewBlockContainer }
           onClick={ this.handleClick.bind(this) }>
        <Visualization
          headerClassName={ styles.visualizationPreviewBlockHeader }
          visualizationTypes={ spec.vizTypes }
          spec={ spec }
          data={ spec.data }
          isMinimalView={ true }
          showHeader={ true } />
      </div>
    );
  }
}

ComposeVisualizationPreviewBlock.propTypes = {
  spec: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};
