import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import styles from './Compose.sass';

import ComposeBlockHeader from './ComposeBlockHeader';
import ComposeBlockText from './ComposeBlockText';
import ComposeBlockVisualization from './ComposeBlockVisualization';
import ToggleButtonGroup from '../Base/ToggleButtonGroup';
import RaisedButton from '../Base/RaisedButton';

import { saveBlock, removeComposeBlock } from '../../actions/ComposeActions'
import { BLOCK_FORMATS } from '../../constants/BlockFormats';
import { CONTENT_TYPES } from '../../constants/ContentTypes';

export class ComposeBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exportedSpec: null,
      contentType: null,
      selectedBlockFormat: BLOCK_FORMATS.TEXT_LEFT,
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
    const { block, exportedSpecs } = this.props;

    const exportedSpec = exportedSpecs.items.find((spec) => spec.id == block.exportedSpecId);
    this.setStateBlockFormat(block.format);

    const contentType = block.contentType || (exportedSpec ? CONTENT_TYPES.VISUALIZATION : CONTENT_TYPES.TEXT);
    this.setState({ exportedSpec: exportedSpec, contentType: contentType });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.exportedSpecs.updatedAt != this.props.exportedSpecs.updatedAt) {
      const exportedSpec = nextProps.exportedSpecs.items.find((spec) => spec.id == nextProps.block.exportedSpecId);
      this.setState({ exportedSpec: exportedSpec });
    }

    if (nextProps.block.format != this.props.block.format && nextProps.block.format != this.state.selectedBlockFormat) {
      this.setStateBlockFormat(nextProps.block.format);
    }
  }

  setStateBlockFormat(blockFormat) {
    const formats = this.state.formatTypes.map((formatType) =>
      new Object({ ...formatType, selected: formatType.value == blockFormat })
    );

    this.setState({ formatTypes: formats, selectedBlockFormat: blockFormat });
  }

  selectBlockFormat(blockFormat) {
    const { block, saveBlock } = this.props;

    if (block.format != blockFormat){
      saveBlock(block.uuid, 'format', blockFormat);
    }

    this.setStateBlockFormat(blockFormat);
  }

  onClickRemoveBlock() {
    const { block, removeComposeBlock } = this.props;
    removeComposeBlock(block.uuid);
  }

  getBlockContent() {
    const { exportedSpec, selectedBlockFormat } = this.state;
    const { block, editable } = this.props;

    const spec = exportedSpec ? exportedSpec : block.spec;

    const composeHeader =
      <ComposeBlockHeader blockId={ block.uuid } onSave={ this.props.saveBlock } heading={ block.heading } editable={ this.props.editable } />;

    const composeVisualization = spec &&
      <ComposeBlockVisualization
                blockId={ block.uuid }
                chartId={ `visualization-${ block.uuid }-${ spec.id }` }
                editable={ editable }
                onSave={ this.props.saveBlock }
                format={ selectedBlockFormat }
                parentSize={ this.refs.composeBlock ? [ this.refs.composeBlock.offsetWidth, this.refs.composeBlock.offsetHeight ] : null }
                spec={ spec } />;

    const composeText =
      <ComposeBlockText
            blockId={ block.uuid }
            editable={ editable }
            onSave={ this.props.saveBlock }
            text={ block.body } />;

    let formatBlock;

    switch (selectedBlockFormat) {
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

    return formatBlock;
  }

  getBlockControls() {
    const { formatTypes, contentType } = this.state;

    let blockControls;

    const removeBlockButton = 
      <RaisedButton
        className={ styles.visualizationOverlayButton + ' ' + styles.visualizationOverlayControl }
        icon
        altText="Remove"
        onClick={ this.onClickRemoveBlock }>
        <i className="fa">&times;</i>
      </RaisedButton>;


    switch (contentType){
      case CONTENT_TYPES.TEXT:
        blockControls =
          <div className={ styles.composeVisualizationControls }>
            { removeBlockButton }
          </div>;
        break;

      case CONTENT_TYPES.VISUALIZATION:
        blockControls =
          <div className={ styles.composeVisualizationControls }>
            <ToggleButtonGroup
              toggleItems={ formatTypes }
              className={ styles.visualizationOverlayControl }
              buttonClassName={ styles.visualizationOverlayButton }
              altTextMember="label"
              displayTextMember="content"
              valueMember="value"
              onChange={ this.selectBlockFormat.bind(this) } />
            { removeBlockButton }
          </div>;
        break;
    }

    return blockControls;
  }

  render() {
    const { selectedBlockFormat } = this.state;
    const { editable } = this.props;

    const formatBlock = this.getBlockContent();
    const blockControls = this.getBlockControls();

    return (
      <div ref="composeBlock" className={ styles.composeBlock + ' ' + styles[selectedBlockFormat] + (editable ? ' ' + styles.editable : '') }>
        { blockControls }
        { formatBlock }
      </div>
    );
  }
}

ComposeBlock.propTypes = {
  block: PropTypes.object.isRequired,
  exportedSpecs: PropTypes.object.isRequired,
  editable: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  const { exportedSpecs } = state;
  return { exportedSpecs };
}

export default connect(mapStateToProps, {
  saveBlock,
  removeComposeBlock
})(ComposeBlock);
