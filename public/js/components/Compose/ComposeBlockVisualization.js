import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { nextVisualizationFormat } from '../../actions/ComposeActions';

import styles from './Compose.sass';

import _ from 'underscore';
import { ResizableBox } from 'react-resizable';
import Visualization from '../Visualizations/Visualization';

export default class ComposeBlockVisualization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resizeCounter: 0
    }

    this.onResize = this.onResize.bind(this);
  }

  onResize(event, { element, size }) {
    this.setState({ resizeCounter: this.state.resizeCounter + 1 });
  }

  onClickVisualization(e) {
    this.props.nextVisualizationFormat(this.props.spec.id);
  }

  render() {
    const { spec, updatedAt, nextVisualizationFormat } = this.props;
    return (
      <div className={ styles.composeBlockVisualization }>
        <ResizableBox
          className={ styles.resizableContainer }
          onResize={ _.debounce(this.onResize, 500) }
          width={ 400 }
          height={ 200 }>
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
    );
  }
}

ComposeBlockVisualization.propTypes = {
  spec: PropTypes.object.isRequired,
  updatedAt: PropTypes.number
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
  nextVisualizationFormat
})(ComposeBlockVisualization);
