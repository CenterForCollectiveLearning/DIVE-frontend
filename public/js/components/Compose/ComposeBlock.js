import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import styles from './Compose.sass';

import ComposeBlockHeader from './ComposeBlockHeader';
import ComposeBlockText from './ComposeBlockText';
import ComposeBlockVisualization from './ComposeBlockVisualization';

import { saveBlock } from '../../actions/ComposeActions'
import { BLOCK_FORMATS } from '../../constants/BlockFormats';


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
        <ComposeBlockHeader
          id={ block.exportedSpecId }
          onSave={ this.props.saveBlock }
          heading={ block.heading }
          editable={ this.props.editable} />
        <div className={ styles.composeBlockContent + ' ' + styles[block.format] }>
          { spec &&
            <ComposeBlockVisualization
                      id={ block.exportedSpecId }
                      editable={ this.props.editable}
                      onSave={ this.props.saveBlock }
                      format={ block.format }
                      parentSize={ this.refs.composeBlock ? [ this.refs.composeBlock.offsetWidth, this.refs.composeBlock.offsetHeight ] : null }
                      spec={ spec }
                      updatedAt={ this.props.updatedAt } />
          }
          <ComposeBlockText
            id={ block.exportedSpecId }
            editable={ this.props.editable}
            onSave={ this.props.saveBlock }
            text={ block.body } />;


    var formatBlock = <div></div>;
    switch (block.format) {
      case BLOCK_FORMATS.TEXT_LEFT:
        formatBlock =
          <div className={ styles.flexrow }>
            <div className={ styles.flexcolumn }>
              { composeHeader }
              { composeText }
            </div>
            { composeVisualization }
          </div>;
        break;

      case BLOCK_FORMATS.TEXT_RIGHT:
        formatBlock =
          <div className={ styles.flexrow }>
            { composeVisualization }
            <div className={ styles.flexcolumn }>
              { composeHeader }
              { composeText }
            </div>
          </div>;
        break;

      case BLOCK_FORMATS.TEXT_TOP:
        formatBlock =
          <div className={ styles.flexcolumn }>
            { composeHeader }
            { composeText }
            { composeVisualization }
          </div>;
        break;

      default:
        formatBlock =
          <div className={ styles.flexcolumn }>
            { composeHeader }
            { composeVisualization }
            { composeText }
          </div>;
        break;
    }


    return (
      <div ref="composeBlock" className={ styles.composeBlock + ' ' + styles[block.format] }>
        { formatBlock }
      </div>
    );
  }
}

ComposeBlock.propTypes = {
  block: PropTypes.object.isRequired,
  exportedSpecs: PropTypes.object.isRequired,
  updatedAt: PropTypes.number,
  editable: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  const { exportedSpecs } = state;
  return { exportedSpecs };
}

export default connect(mapStateToProps, {
  saveBlock
})(ComposeBlock);
