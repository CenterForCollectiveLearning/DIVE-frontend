import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import styles from './Compose.sass';

import ComposeBlockHeader from './ComposeBlockHeader';
import ComposeBlockText from './ComposeBlockText';
import ComposeBlockVisualization from './ComposeBlockVisualization';
import ToggleButtonGroup from '../Base/ToggleButtonGroup';
import RaisedButton from '../Base/RaisedButton';

import { saveBlock } from '../../actions/ComposeActions'
import { BLOCK_FORMATS } from '../../constants/BlockFormats';

export class ComposeBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exportedSpec: null,
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

    this.onClickRemoveBlock = this.onClickRemoveBlock.bind(this);
  }

  componentWillMount() {
    const exportedSpec = this.props.exportedSpecs.items.find((spec) => spec.id == this.props.block.exportedSpecId);
    this.setStateBlockFormat(this.props.format);
    this.setState({ exportedSpec: exportedSpec });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.exportedSpecs.updatedAt != this.props.exportedSpecs.updatedAt) {
      const exportedSpec = nextProps.exportedSpecs.items.find((spec) => spec.id == nextProps.block.exportedSpecId);
      this.setState({ exportedSpec: exportedSpec });
    }
    if (nextProps.format != this.props.format) {
      this.setStateBlockFormat(nextProps.format);
    }
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

  onClickRemoveBlock() {
    const { spec, selectComposeVisualization } = this.props;
    selectComposeVisualization(spec.id, spec.meta.desc);
  }

  render() {
    const { exportedSpec, updatedAt } = this.state;
    const { block, editable } = this.props;

    const spec = exportedSpec ? exportedSpec : block.spec;

    const composeHeader =
      <ComposeBlockHeader id={ block.exportedSpecId } onSave={ this.props.saveBlock } heading={ block.heading } editable={ this.props.editable } />;

    const composeVisualization = spec &&
      <ComposeBlockVisualization
                id={ block.exportedSpecId }
                editable={ editable }
                onSave={ this.props.saveBlock }
                format={ block.format }
                parentSize={ this.refs.composeBlock ? [ this.refs.composeBlock.offsetWidth, this.refs.composeBlock.offsetHeight ] : null }
                spec={ spec }
                updatedAt={ this.props.updatedAt } />;

    const composeText =
      <ComposeBlockText
            id={ block.exportedSpecId }
            editable={ editable }
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
        <div className={ styles.composeVisualizationControls }>
          <ToggleButtonGroup
            toggleItems={ this.state.formatTypes }
            className={ styles.visualizationOverlayControl }
            buttonClassName={ styles.visualizationOverlayButton }
            altTextMember="label"
            displayTextMember="content"
            valueMember="value"
            onChange={ this.selectBlockFormat.bind(this) } />
          <RaisedButton
            className={ styles.visualizationOverlayButton + ' ' + styles.visualizationOverlayControl }
            icon
            altText="Remove"
            onClick={ this.onClickRemoveBlock }>
            <i className="fa">&times;</i>
          </RaisedButton>
        </div>
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
