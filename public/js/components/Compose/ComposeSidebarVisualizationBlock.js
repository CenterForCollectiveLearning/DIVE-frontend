import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { selectComposeVisualization } from '../../actions/ComposeActions';

import styles from './Compose.sass';

import Visualization from '../Visualizations/Visualization';

export class ComposeSidebarVisualizationBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: this.props.composeSelector.blocks.find((block) => block.exportedSpecId == this.props.spec.id) != undefined
    }
  }

  handleClick() {
    const { spec, selectComposeVisualization } = this.props;
    selectComposeVisualization(spec.id, spec.meta.desc);
    this.setState({ selected: !this.state.selected });
  }

  render() {
    const { spec } = this.props;

    return (
      <div className={ styles.visualizationPreviewBlockContainer
                       + (this.state.selected ? ' ' + styles.selectedVisualizationPreviewBlockContainer : '')}
           onClick={ this.handleClick.bind(this) }>
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
  const { composeSelector } = state;
  return { composeSelector };
}

export default connect(mapStateToProps, {
  selectComposeVisualization
})(ComposeSidebarVisualizationBlock);
