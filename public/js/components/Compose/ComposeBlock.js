import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import styles from './Compose.sass';

import ComposeBlockHeader from './ComposeBlockHeader';
import ComposeBlockText from './ComposeBlockText';
import ComposeBlockVisualization from './ComposeBlockVisualization';
import ComposeBlockRegression from './ComposeBlockRegression';
import ComposeBlockCorrelation from './ComposeBlockCorrelation';
import ToggleButtonGroup from '../Base/ToggleButtonGroup';
import RaisedButton from '../Base/RaisedButton';

import { saveBlock, removeComposeBlock, moveComposeBlock } from '../../actions/ComposeActions'
import { BLOCK_FORMATS } from '../../constants/BlockFormats';
import { CONTENT_TYPES } from '../../constants/ContentTypes';

export class ComposeBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exportedSpec: null,
      contentType: null,
      autoSetContentType: false,
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
    this.onClickMoveBlockUp = this.onClickMoveBlockUp.bind(this);
    this.onClickMoveBlockDown = this.onClickMoveBlockDown.bind(this);
  }

  componentWillMount() {
    const { block, exportedSpecs, exportedRegressions, exportedCorrelations } = this.props;

    let specs;
    switch(block.contentType) {
      case CONTENT_TYPES.VISUALIZATION:
        specs = exportedSpecs;
        break;
      case CONTENT_TYPES.REGRESSION:
        specs = exportedRegressions;
        break;
      case CONTENT_TYPES.CORRELATION:
        specs = exportedCorrelations;
        break;
      default:
        specs = exportedSpecs;
        break;
    }

    const exportedSpec = specs.items.find((spec) => spec.id == block.exportedSpecId);
    console.log('in componentWillMount', exportedSpec, specs.items, block.exportedSpecId);
    this.setStateBlockFormat(block.format);

    if (block.contentType) {
      this.setState({ contentType: block.contentType });
    } else {
      this.autoSetContentType(exportedSpec);
    }

    this.setState({ exportedSpec: exportedSpec });
  }

  autoSetContentType(hasSpec) {
    const contentType = hasSpec ? CONTENT_TYPES.VISUALIZATION : CONTENT_TYPES.TEXT;
    console.log('in autoSetContentType', hasSpec, contentType);
    this.setState({ autoSetContentType: true, contentType: contentType });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.exportedSpecs.updatedAt != this.props.exportedSpecs.updatedAt) {
      const exportedSpec = nextProps.exportedSpecs.items.find((spec) => spec.id == nextProps.block.exportedSpecId);
      this.setState({ exportedSpec: exportedSpec });
      if (this.state.autoSetContentType) {
        this.autoSetContentType(exportedSpec);
      }
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

  onClickMoveBlockUp() {
    const { block, moveComposeBlock } = this.props;
    moveComposeBlock(block.uuid, -1);
  }

  onClickMoveBlockDown() {
    const { block, moveComposeBlock } = this.props;
    moveComposeBlock(block.uuid, 1);
  }

  getBlockContent() {
    const { exportedSpec, selectedBlockFormat } = this.state;
    const { block, editable } = this.props;

    const spec = exportedSpec ? exportedSpec : block.spec;

    console.log('in getBlockContent', block, spec)

    const composeHeader =
      <ComposeBlockHeader blockId={ block.uuid } onSave={ this.props.saveBlock } heading={ block.heading } editable={ this.props.editable } />;

    let composeContent;
    switch(block.contentType) {
      case CONTENT_TYPES.VISUALIZATION:
        composeContent = spec &&
          <ComposeBlockVisualization
                    blockId={ block.uuid }
                    chartId={ `visualization-${ block.uuid }-${ spec.id }` }
                    editable={ editable }
                    onSave={ this.props.saveBlock }
                    format={ selectedBlockFormat }
                    parentSize={ this.refs.composeBlock ? [ this.refs.composeBlock.offsetWidth, this.refs.composeBlock.offsetHeight ] : null }
                    spec={ spec } />;
        break;
      case CONTENT_TYPES.REGRESSION:
        composeContent = spec &&
          <ComposeBlockRegression
                    blockId={ block.uuid }
                    chartId={ `regression-${ block.uuid }-${ spec.id }` }
                    editable={ editable }
                    onSave={ this.props.saveBlock }
                    format={ selectedBlockFormat }
                    parentSize={ this.refs.composeBlock ? [ this.refs.composeBlock.offsetWidth, this.refs.composeBlock.offsetHeight ] : null }
                    spec={ spec } />;
        break;
      case CONTENT_TYPES.CORRELATION:
        composeContent = spec &&
          <ComposeBlockCorrelation
                    blockId={ block.uuid }
                    chartId={ `correlation-${ block.uuid }-${ spec.id }` }
                    editable={ editable }
                    onSave={ this.props.saveBlock }
                    format={ selectedBlockFormat }
                    parentSize={ this.refs.composeBlock ? [ this.refs.composeBlock.offsetWidth, this.refs.composeBlock.offsetHeight ] : null }
                    spec={ spec } />;
        break;
      default:
        specs = exportedSpecs;
        break;
    }

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
            { composeContent }
          </div>;
        break;

      case BLOCK_FORMATS.TEXT_RIGHT:
        formatBlock =
          <div className={ styles.flexrow }>
            { composeContent }
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
            { composeContent }
          </div>;
        break;

      default:
        formatBlock =
          <div className={ styles.flexcolumn }>
            { composeHeader }
            { composeContent }
            { composeText }
          </div>;
        break;
    }

    return formatBlock;
  }

  getBlockControls() {
    const { formatTypes, contentType } = this.state;
    const { index, length } = this.props;

    let blockControls;

    const moveUpButton =
      <RaisedButton
        className={ styles.visualizationOverlayButton + ' ' + styles.visualizationOverlayControl }
        icon
        minWidth={ 24 }
        disabled={ index == 0 }
        altText="Move block up"
        onClick={ this.onClickMoveBlockUp }>
        <i className="fa fa-long-arrow-up"></i>
      </RaisedButton>;

    const moveDownButton =
      <RaisedButton
        className={ styles.visualizationOverlayButton + ' ' + styles.visualizationOverlayControl }
        icon
        minWidth={ 24 }
        disabled={ index == length - 1 }
        altText="Move block down"
        onClick={ this.onClickMoveBlockDown }>
        <i className="fa fa-long-arrow-down"></i>
      </RaisedButton>;

    const removeBlockButton =
      <RaisedButton
        className={ styles.visualizationOverlayButton + ' ' + styles.visualizationOverlayControl }
        icon
        minWidth={ 24 }
        altText="Remove"
        onClick={ this.onClickRemoveBlock }>
        <i className="fa">&times;</i>
      </RaisedButton>;


    switch (contentType){
      case CONTENT_TYPES.TEXT:
        blockControls =
          <div className={ styles.composeVisualizationControls }>
            { moveUpButton }
            { moveDownButton }
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
            { moveUpButton }
            { moveDownButton }
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
  exportedRegressions: PropTypes.object.isRequired,
  exportedCorrelations: PropTypes.object.isRequired,
  editable: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired
};

function mapStateToProps(state) {
  const { exportedSpecs, exportedRegressions, exportedCorrelations } = state;
  return { exportedSpecs, exportedRegressions, exportedCorrelations };
}

export default connect(mapStateToProps, {
  saveBlock,
  removeComposeBlock,
  moveComposeBlock
})(ComposeBlock);
