import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import styles from './Compose.sass';

import ComposeBlockHeader from './ComposeBlockHeader';
import ComposeBlockText from './ComposeBlockText';
import ComposeBlockVisualization from './ComposeBlockVisualization';

import { saveBlock } from '../../actions/ComposeActions'

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
    if (exportedSpec) {
      var spec = exportedSpec;
    } else {
      var spec = block.spec;
    }
    console.log('Spec:', spec);
    return (
      <div ref="composeBlock" className={ styles.composeBlock }>
        <ComposeBlockHeader id={ block.exportedSpecId } onSave={ this.props.saveBlock } heading={ block.heading } />
        <div className={ styles.composeBlockContent + ' ' + styles[block.format] }>
          { spec &&
            <ComposeBlockVisualization
                      id={ block.exportedSpecId }
                      onSave={ this.props.saveBlock }
                      format={ block.format }
                      parentSize={ this.refs.composeBlock ? [ this.refs.composeBlock.offsetWidth, this.refs.composeBlock.offsetHeight ] : null }
                      spec={ spec }
                      updatedAt={ this.props.updatedAt } />
          }
          <ComposeBlockText
            id={ block.exportedSpecId }
            onSave={ this.props.saveBlock }
            text={ block.body } />
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

export default connect(mapStateToProps, {
  saveBlock
})(ComposeBlock);
