import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import styles from './Compose.sass';

import ComposeBlockHeader from './ComposeBlockHeader';
import ComposeBlockText from './ComposeBlockText';
import ComposeBlockVisualization from './ComposeBlockVisualization';

export class ComposeBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exportedSpec: null
    }
  }

  componentWillMount() {
    const exportedSpec = this.props.exportedSpecs.items.find((spec) => spec.id == this.props.block.exportedSpecId);
    this.setState({ exportedSpec: exportedSpec });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.exportedSpecs.updatedAt != this.props.exportedSpecs.updatedAt) {
      const exportedSpec = nextProps.exportedSpecs.items.find((spec) => spec.id == nextProps.block.exportedSpecId);
      this.setState({ exportedSpec: exportedSpec });
    }

  }

  render() {
    const { exportedSpec, updatedAt } = this.state;
    const { block } = this.props;
    return (
      <div className={ styles.composeBlock }>
        <ComposeBlockHeader heading={ block.heading } />
        <div className={ styles.composeBlockContent + ' ' + styles[block.format] }>
          <ComposeBlockVisualization spec={ exportedSpec } updatedAt={ this.props.updatedAt }/>
          <ComposeBlockText text={ block.body } />
        </div>
      </div>
    );
  }
}

ComposeBlock.propTypes = {
  block: PropTypes.object.isRequired,
  exportedSpecs: PropTypes.object.isRequired,
  updatedAt: PropTypes.number
};

function mapStateToProps(state) {
  const { exportedSpecs } = state;
  return { exportedSpecs };
}

export default connect(mapStateToProps, {})(ComposeBlock);
