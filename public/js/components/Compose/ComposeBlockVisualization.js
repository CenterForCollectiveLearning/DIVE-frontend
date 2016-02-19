import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import styles from './Compose.sass';

import _ from 'underscore';
import { ResizableBox } from 'react-resizable';
import ToggleButtonGroup from '../Base/ToggleButtonGroup';
import Visualization from '../Visualizations/Visualization';

import { BLOCK_FORMATS } from '../../constants/BlockFormats';

export default class ComposeBlockVisualization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editable: this.props.editable,
      resizeCounter: 0,
      formatTypes: [
        {
          label: "Visualization on top",
          content: <i className="fa fa-caret-up"></i>,
          value: BLOCK_FORMATS.TEXT_BOTTOM,
          selected: false
        },
        {
          label: "Visualization on bottom",
          content: <i className="fa fa-caret-down"></i>,
          value: BLOCK_FORMATS.TEXT_TOP,
          selected: false
        },
        {
          label: "Visualization on left",
          content: <i className="fa fa-caret-left"></i>,
          value: BLOCK_FORMATS.TEXT_RIGHT,
          selected: false
        },
        {
          label: "Visualization on right",
          content: <i className="fa fa-caret-right"></i>,
          value: BLOCK_FORMATS.TEXT_LEFT,
          selected: true
        }
      ]
    }

    this.onResize = this.onResize.bind(this);
  }

  componentWillMount() {
    this.setStateBlockFormat(this.props.format);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.format != this.props.format) {
      this.setStateBlockFormat(nextProps.format);
    }
  }

  onResize(event, { element, size }) {
    const { id, onSave } = this.props;
    this.setState({ resizeCounter: this.state.resizeCounter + 1 });
    onSave(id, 'dimensions', size);
  }

  setStateBlockFormat(blockFormat) {
    const formats = this.state.formatTypes.map((formatType) =>
      new Object({ ...formatType, selected: formatType.value == blockFormat })
    );
    this.setState({ formatTypes: formats });
  }

  selectBlockFormat(blockFormat) {
    const { id, onSave } = this.props;
    onSave(id, 'format', blockFormat);
    this.setStateBlockFormat(blockFormat);
  }

  render() {
    console.log('rendering composeBlockVisualization');
    const { spec, updatedAt, parentSize, format } = this.props;

    const absoluteMaxWidth = parentSize ? parentSize[0] - 18 : 700;
    const isHalfWidthFormat = (format == BLOCK_FORMATS.TEXT_LEFT || format == BLOCK_FORMATS.TEXT_RIGHT);
    const maxWidth = parentSize && isHalfWidthFormat ?
      ((parentSize[0])*2/3) - 15 : absoluteMaxWidth;

    const width = isHalfWidthFormat ? 600 : absoluteMaxWidth;
    const height = isHalfWidthFormat ? 300 : 400;

    return (
      <div ref="composeBlockVisualization" className={ styles.composeBlockVisualization }>
        { this.state.editable &&
          <div>
          <div className={ styles.composeVisualizationControls }>
            <ToggleButtonGroup
              toggleItems={ this.state.formatTypes }
              buttonClassName={ styles.visualizationOverlayButton }
              altTextMember="label"
              displayTextMember="content"
              valueMember="value"
              column={ true }
              onChange={ this.selectBlockFormat.bind(this) } />
          </div>
          <ResizableBox
            key={ `resize-${ spec.id }-${ format }` }
            className={ styles.resizableContainer }
            onResize={ _.debounce(this.onResize, 500) }
            width={ width }
            height={ height }
            minConstraints={ [200, 200] }
            maxConstraints={ [maxWidth, 600] }>
            <Visualization
              chartId={ `full-compose-visualization-${ spec.id }-${ updatedAt }-${ this.state.resizeCounter }` }
              containerClassName={ styles.fullComposeVisualization }
              visualizationTypes={ spec.vizTypes }
              spec={ spec }
              data={ spec.data }
              isMinimalView={ false }
              showHeader={ false }/>
          </ResizableBox>
        </div>
      }
      { !this.state.editable &&
        <Visualization
          chartId={ `full-compose-visualization-${ spec.id }-${ updatedAt }-${ this.state.resizeCounter }` }
          containerClassName={ styles.fullComposeVisualization }
          visualizationTypes={ spec.vizTypes }
          spec={ spec }
          data={ spec.data }
          isMinimalView={ false }
          showHeader={ false }/>
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

export default connect(mapStateToProps, {})(ComposeBlockVisualization);
