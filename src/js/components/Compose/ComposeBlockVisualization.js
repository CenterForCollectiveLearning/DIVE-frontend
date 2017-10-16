import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './Compose.sass';

import _ from 'underscore';
import { ResizableBox } from 'react-resizable';
import Visualization from '../Visualizations/Visualization';

import { BLOCK_FORMATS } from '../../constants/BlockFormats';

export default class composeBlockVisualization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resizeCounter: 0
    }

    this.onResize = this.onResize.bind(this);
  }

  onResize(event, { element, size }) {
    const { blockId, onSave } = this.props;
    this.setState({ resizeCounter: this.state.resizeCounter + 1 });
    onSave(blockId, 'dimensions', size);
  }

  render() {
    const { chartId, spec, updatedAt, parentSize, format, editable, fieldNameToColor } = this.props;

    const absoluteMaxWidth = parentSize ? parentSize[0] - 18 : 908;
    const isHalfWidthFormat = (format == BLOCK_FORMATS.TEXT_LEFT || format == BLOCK_FORMATS.TEXT_RIGHT);
    const maxWidth = parentSize && isHalfWidthFormat ?
      ((parentSize[0])*2/3) - 15 : absoluteMaxWidth;

    const width = isHalfWidthFormat ? 620 : absoluteMaxWidth;
    const height = isHalfWidthFormat ? 300 : null;

    const visualizationComponent = <Visualization
      chartId={ `full-compose-visualization-${ chartId }-${ updatedAt }-${ this.state.resizeCounter }` }
      containerClassName={ styles.fullComposeVisualization }
      visualizationTypes={ spec.vizTypes }
      fieldNameToColor={ fieldNameToColor }
      spec={ spec }
      bins={ spec.data.bins }
      data={ spec.data.visualize }
      config={ spec.config }
      isMinimalView={ false }
      showHeader={ false }/>

    return (
      <div ref="composeBlockVisualization" className={ styles.composeBlockVisualization }>
        { editable &&
          <ResizableBox
            key={ `resize-${ spec.id }-${ format }` }
            className={ styles.resizableContainer }
            onResize={ _.debounce(this.onResize, 500) }
            width={ width }
            height={ height }
            minConstraints={ [200, 200] }
            maxConstraints={ [maxWidth, 600] }>
            { visualizationComponent }
          </ResizableBox>
        }
        { !editable &&
          <div style={{ width: width, height: height }} className={ styles.resizableContainer }>
            { visualizationComponent }
          </div>
        }
      </div>
    );
  }
}

composeBlockVisualization.propTypes = {
  spec: PropTypes.object.isRequired,
  updatedAt: PropTypes.number,
  parentSize: PropTypes.any,
  format: PropTypes.string,
  blockId: PropTypes.string.isRequired,
  chartId: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  editable: PropTypes.bool.isRequired,
  fieldNameToColor: PropTypes.object,
};
