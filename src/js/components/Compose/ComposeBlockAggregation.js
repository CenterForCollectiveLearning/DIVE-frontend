import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import styles from './Compose.sass';

import _ from 'underscore';
import { ResizableBox } from 'react-resizable';
import AggregationTable from '../Analysis/Aggregation/AggregationTable';
import AggregationTableOneD from '../Analysis/Aggregation/AggregationTableOneD';

import { BLOCK_FORMATS } from '../../constants/BlockFormats';

export default class ComposeBlockAggregation extends Component {
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

    const { oneDimensionalContingencyTable, twoDimensionalContingencyTable } = spec.data;
    const { aggregationVariablesNames, dependentVariableName, aggregationFunction } = spec.spec;

    const absoluteMaxWidth = parentSize ? parentSize[0] - 18 : 908;
    const isHalfWidthFormat = (format == BLOCK_FORMATS.TEXT_LEFT || format == BLOCK_FORMATS.TEXT_RIGHT);
    const maxWidth = parentSize && isHalfWidthFormat ?
      ((parentSize[0])*2/3) - 15 : absoluteMaxWidth;

    const width = isHalfWidthFormat ? 620 : absoluteMaxWidth;
    const height = isHalfWidthFormat ? 300 : null;

    let component = <div />;
    if (oneDimensionalContingencyTable && oneDimensionalContingencyTable.rows) {
      component = <AggregationTableOneD
        aggregationResult={ oneDimensionalContingencyTable }
        aggregationVariablesNames={ aggregationVariablesNames }
      />
    } else if (twoDimensionalContingencyTable && twoDimensionalContingencyTable.rows) {
      component = <AggregationTable
        aggregationResult={ twoDimensionalContingencyTable }
        aggregationVariablesNames={ aggregationVariablesNames }
      />
    }

    console.log('In ComposeBlockAggregation render');
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
            { component }
          </ResizableBox>
        }
        { !editable &&
          <div style={{ width: width, height: height }} className={ styles.resizableContainer }>
            { component }
          </div>
        }
      </div>
    );
  }
}

ComposeBlockAggregation.propTypes = {
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
