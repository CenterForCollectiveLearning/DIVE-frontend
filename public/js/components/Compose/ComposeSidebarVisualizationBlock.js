import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { selectComposeVisualization } from '../../actions/ComposeActions';

import styles from './Compose.sass';

import Visualization from '../Visualizations/Visualization';

export class ComposeSidebarVisualizationBlock extends Component {
  handleClick() {
    const { spec, selectComposeVisualization } = this.props;
    selectComposeVisualization(spec.id, spec.meta.desc);
  }

  render() {
    const { spec } = this.props;

    return (
      <div onClick={ this.handleClick.bind(this) } className={ styles.visualizationPreviewBlockContainer }>
        <Visualization
          headerClassName={ styles.sidebarVisualizationHeader }
          containerClassName={ styles.sidebarVisualizationContainer }
          visualizationTypes={ spec.vizTypes }
          spec={ spec }
          data={ spec.data }
          isMinimalView={ true }
          showHeader={ true } />
      </div>
    );
  }
}

ComposeSidebarVisualizationBlock.propTypes = {
  spec: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
  selectComposeVisualization
})(ComposeSidebarVisualizationBlock);
