import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { selectComposeVisualization } from '../../actions/ComposeActions';

import styles from './Compose.sass';

import _ from 'underscore';
import { ResizableBox } from 'react-resizable';
import Visualization from '../Visualizations/Visualization';

import { BLOCK_FORMATS } from '../../constants/BlockFormats';

export default class ComposeBlockVisualization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resizeCounter: 0
    }

    this.onResize = this.onResize.bind(this);
  }

  onResize(event, { element, size }) {
    const { id, onSave } = this.props;
    this.setState({ resizeCounter: this.state.resizeCounter + 1 });
    onSave(id, 'dimensions', size);
  }

  render() {
    const { spec, updatedAt, parentSize, format, editable } = this.props;

    const absoluteMaxWidth = parentSize ? parentSize[0] - 18 : 700;
    const isHalfWidthFormat = (format == BLOCK_FORMATS.TEXT_LEFT || format == BLOCK_FORMATS.TEXT_RIGHT);
    const maxWidth = parentSize && isHalfWidthFormat ?
      ((parentSize[0])*2/3) - 15 : absoluteMaxWidth;

    const width = isHalfWidthFormat ? 600 : absoluteMaxWidth;
    const height = isHalfWidthFormat ? 300 : 400;

    const visualizationComponent = <Visualization
      chartId={ `full-compose-visualization-${ spec.id }-${ updatedAt }-${ this.state.resizeCounter }` }
      containerClassName={ styles.fullComposeVisualization }
      visualizationTypes={ spec.vizTypes }
      spec={ spec }
      data={ spec.data }
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

ComposeBlockVisualization.propTypes = {
  spec: PropTypes.object.isRequired,
  updatedAt: PropTypes.number,
  parentSize: PropTypes.any,
  format: PropTypes.string,
  id: PropTypes.number.isRequired,
  onSave: PropTypes.func.isRequired,
  editable: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { selectComposeVisualization })(ComposeBlockVisualization);
