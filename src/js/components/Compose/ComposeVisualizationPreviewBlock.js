import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { selectComposeVisualization } from '../../actions/ComposeActions';

import styles from './Compose.sass';

import Visualization from '../Visualizations/Visualization';

export default class ComposeVisualizationPreviewBlock extends Component {
  handleClick = () => {
    const { spec, onClick } = this.props;
  }

  render() {
    const { spec, fieldNameToColor } = this.props;

    return (
      <div className={ styles.contentPreviewBlockContainer + ' pt-card pt-interactive' }
           onClick={ this.handleClick }>
        <Visualization
          headerClassName={ styles.visualizationPreviewBlockHeader }
          fieldNameToColor={ fieldNameToColor }
          visualizationTypes={ spec.vizTypes }
          spec={ spec }
          config={ spec.config }
          data={ spec.data.visualize }
          bins={ spec.data.bins }
          isMinimalView={ true }
          showHeader={ true } />
      </div>
    );
  }
}

ComposeVisualizationPreviewBlock.propTypes = {
  spec: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  fieldNameToColor: PropTypes.object,
};
