import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import styles from './Compose.sass';

import _ from 'underscore';
import { ResizableBox } from 'react-resizable';
import StatsTable from '../Analysis/Comparison/StatsTable';
import NumericalComparisonText from '../Analysis/Comparison/NumericalComparisonText';
import AnovaTable from '../Analysis/Comparison/AnovaTable';
import AnovaText from '../Analysis/Comparison/AnovaText';
import PairwiseComparisonCard from '../Analysis/Comparison/PairwiseComparisonCard';
import AnovaBoxplotCard from '../Analysis/Comparison/AnovaBoxplotCard';

import { BLOCK_FORMATS } from '../../constants/BlockFormats';

export default class ComposeBlockComparison extends Component {
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
    const { anovaBoxplot, pairwiseComparison, anova, numericalComparison } = spec.data;

    const absoluteMaxWidth = parentSize ? parentSize[0] - 18 : 908;
    const isHalfWidthFormat = (format == BLOCK_FORMATS.TEXT_LEFT || format == BLOCK_FORMATS.TEXT_RIGHT);
    const maxWidth = parentSize && isHalfWidthFormat ?
      ((parentSize[0])*2/3) - 15 : absoluteMaxWidth;

    const width = isHalfWidthFormat ? 620 : absoluteMaxWidth;
    const height = isHalfWidthFormat ? 300 : null;

    let content = <div>
      { numericalComparison && 
        <StatsTable numericalData={ numericalComparison } />
      }
      { anova &&
        <AnovaTable anovaData={ anova } />
      }
      { pairwiseComparison && pairwiseComparison.rows && pairwiseComparison.rows.length > 0 &&
        <PairwiseComparisonCard
          pairwiseComparisonData={ pairwiseComparison }
        />
      }
      { anovaBoxplot && anovaBoxplot.data &&
        <AnovaBoxplotCard
          anovaBoxplotData={ anovaBoxplot }
        />
      }
    </div>;
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
            { content }
          </ResizableBox>
        }
        { !editable &&
          <div style={{ width: width, height: height }} className={ styles.resizableContainer }>
            { content }
          </div>
        }
      </div>
    );
  }
}

ComposeBlockComparison.propTypes = {
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
