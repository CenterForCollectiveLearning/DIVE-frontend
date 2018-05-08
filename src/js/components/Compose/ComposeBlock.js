import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import styles from './Compose.sass';

import ComposeBlockHeader from './ComposeBlockHeader';
import ComposeBlockText from './ComposeBlockText';
import ComposeBlockVisualization from './ComposeBlockVisualization';
import ComposeBlockRegression from './ComposeBlockRegression';
import ComposeBlockCorrelation from './ComposeBlockCorrelation';
import ComposeBlockAggregation from './ComposeBlockAggregation';
import ComposeBlockComparison from './ComposeBlockComparison';
import ToggleButtonGroup from '../Base/ToggleButtonGroup';
import RaisedButton from '../Base/RaisedButton';

import { Button, Intent } from '@blueprintjs/core';

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
          label: "Content on top",
          ptIcon: true,
          iconName: "chevron-up",
          value: BLOCK_FORMATS.TEXT_BOTTOM,
          selected: false
        },
        {
          label: "Content on bottom",
          ptIcon: true,
          iconName: "chevron-down",
          value: BLOCK_FORMATS.TEXT_TOP,
          selected: false
        },
        {
          label: "Content on left",
          ptIcon: true,
          iconName: "chevron-left",
          value: BLOCK_FORMATS.TEXT_RIGHT,
          selected: false
        },
        {
          label: "Content on right",
          ptIcon: true,
          iconName: "chevron-right",
          value: BLOCK_FORMATS.TEXT_LEFT,
          selected: true
        }
      ]
    }
  }

  getExportedSpec(props) {
    const { block, exportedSpecs, exportedAnalyses } = props;

    let specs = [];
    switch(block.contentType) {
      case CONTENT_TYPES.VISUALIZATION:
        specs = exportedSpecs.items;
        break;
      case CONTENT_TYPES.REGRESSION:
        specs = exportedAnalyses.data.regression;
        break;
      case CONTENT_TYPES.CORRELATION:
        specs = exportedAnalyses.data.correlation;
        break;
      case CONTENT_TYPES.COMPARISON:
        specs = exportedAnalyses.data.comparison;
        break;
      case CONTENT_TYPES.AGGREGATION:
        specs = exportedAnalyses.data.aggregation;
        break;                
      default:
        specs = exportedSpecs.items;
        break;
    }

    const exportedSpec = specs.find((spec) => spec.id == block.exportedSpecId);
    return exportedSpec; 
  }

  componentWillMount() {
    const { block } = this.props;

    this.setStateBlockFormat(block.format);

    const exportedSpec = this.getExportedSpec(this.props);

    if (block.contentType) {
      this.setState({ contentType: block.contentType });
    } else {
      this.autoSetContentType(exportedSpec);
    }

    this.setState({ exportedSpec: exportedSpec });
  }

  autoSetContentType = (hasSpec) => {
    const contentType = hasSpec ? CONTENT_TYPES.VISUALIZATION : CONTENT_TYPES.TEXT;
    this.setState({ autoSetContentType: true, contentType: contentType });
  }

  componentWillReceiveProps(nextProps) {
    const updatedSpecs = nextProps.exportedSpecs.updatedAt != this.props.exportedSpecs.updatedAt;
    const updatedAnalyses = nextProps.exportedAnalyses.updatedAt != this.props.exportedAnalyses.updatedAt;

    if (updatedSpecs || updatedAnalyses) {
      const exportedSpec = this.getExportedSpec(nextProps);
      
      this.setState({ exportedSpec: exportedSpec });
      if (nextProps.block.contentType) {
        this.setState({ contentType: nextProps.block.contentType });
      } else {
        this.autoSetContentType(exportedSpec);
      }
    }

    if (nextProps.block.format != this.props.block.format && nextProps.block.format != this.state.selectedBlockFormat) {
      this.setStateBlockFormat(nextProps.block.format);
    }
  }

  setStateBlockFormat = (blockFormat) => {
    const formats = this.state.formatTypes.map((formatType) =>
      new Object({ ...formatType, selected: formatType.value == blockFormat })
    );

    this.setState({ formatTypes: formats, selectedBlockFormat: blockFormat });
  }

  selectBlockFormat = (blockFormat) => {
    const { block, saveBlock } = this.props;

    if (block.format != blockFormat){
      saveBlock(block.uuid, 'format', blockFormat);
    }

    this.setStateBlockFormat(blockFormat);
  }

  onClickRemoveBlock = () => {
    const { block, removeComposeBlock } = this.props;
    removeComposeBlock(block.uuid);
  }

  onClickMoveBlockUp = () => {
    const { block, moveComposeBlock } = this.props;
    moveComposeBlock(block.uuid, -1);
  }

  onClickMoveBlockDown = () => {
    const { block, moveComposeBlock } = this.props;
    moveComposeBlock(block.uuid, 1);
  }

  getBlockContent = () => {
    const { exportedSpec, selectedBlockFormat } = this.state;
    const { block, editable, fieldNameToColor } = this.props;

    const spec = exportedSpec ? exportedSpec : block.spec;

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
                    fieldNameToColor={ fieldNameToColor }
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
      case CONTENT_TYPES.AGGREGATION:
        composeContent = spec &&
          <ComposeBlockAggregation
                    blockId={ block.uuid }
                    chartId={ `correlation-${ block.uuid }-${ spec.id }` }
                    editable={ editable }
                    onSave={ this.props.saveBlock }
                    format={ selectedBlockFormat }
                    parentSize={ this.refs.composeBlock ? [ this.refs.composeBlock.offsetWidth, this.refs.composeBlock.offsetHeight ] : null }
                    spec={ spec } />;
        break;
      case CONTENT_TYPES.COMPARISON:
        composeContent = spec &&
          <ComposeBlockComparison
                    blockId={ block.uuid }
                    chartId={ `correlation-${ block.uuid }-${ spec.id }` }
                    editable={ editable }
                    onSave={ this.props.saveBlock }
                    format={ selectedBlockFormat }
                    parentSize={ this.refs.composeBlock ? [ this.refs.composeBlock.offsetWidth, this.refs.composeBlock.offsetHeight ] : null }
                    spec={ spec } />;
        break;                
    }

    const composeText =
      <ComposeBlockText
            contentType={ block.contentType }
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

  getBlockControls = () => {
    const { formatTypes, contentType } = this.state;
    const { index, length } = this.props;

    let blockControls;

    const moveUpButton =
      <Button
        minWidth={ 24 }
        disabled={ index == 0 }
        altText="Move block up"
        onClick={ this.onClickMoveBlockUp }
        iconName="pt-icon-arrow-up"
      />

    const moveDownButton =
      <Button
        minWidth={ 24 }
        disabled={ index == length - 1 }
        altText="Move block down"
        onClick={ this.onClickMoveBlockDown }
        iconName="pt-icon-arrow-down" />

    const removeBlockButton =
      <Button
        className={ styles.visualizationOverlayButton + ' ' + styles.visualizationOverlayControl }
        minWidth={ 24 }
        altText="Remove"
        onClick={ this.onClickRemoveBlock }
        iconName="pt-icon-small-cross" />

    switch (contentType){
      case CONTENT_TYPES.TEXT:
        blockControls =
          <div className={ styles.composeVisualizationControls }>
            <div className={ "pt-button-group " + styles.visualizationOverlayControl }>
              { moveUpButton }
              { moveDownButton }
            </div>
            { removeBlockButton }
          </div>;
        break;

      case CONTENT_TYPES.VISUALIZATION:
      case CONTENT_TYPES.AGGREGATION:
      case CONTENT_TYPES.COMPARISON:      
      case CONTENT_TYPES.REGRESSION:
      case CONTENT_TYPES.CORRELATION:
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
            <div className={ "pt-button-group " + styles.visualizationOverlayControl }>
              { moveUpButton }
              { moveDownButton }
            </div>
            { removeBlockButton }
          </div>;
        break;
    }

    return blockControls;
  }

  render() {
    const { selectedBlockFormat } = this.state;
    const { editable, block } = this.props;

    if (block.exportedSpecId || block.contentType == 'TEXT') {
      const formatBlock = this.getBlockContent();
      const blockControls = this.getBlockControls();

      return (
        <div ref="composeBlock" className={ styles.composeBlock + ' ' + styles[selectedBlockFormat] + (editable ? ' ' + styles.editable : '') }>
          { blockControls }
          { formatBlock }
        </div>
      );
    } else {
      return (<div />);
    }
  }
}

ComposeBlock.propTypes = {
  block: PropTypes.object.isRequired,
  exportedSpecs: PropTypes.object.isRequired,
  exportedAnalyses: PropTypes.object.isRequired,
  editable: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
  fieldNameToColor: PropTypes.object
};

function mapStateToProps(state) {
  const { exportedSpecs, exportedAnalyses } = state;
  return { exportedSpecs, exportedAnalyses };
}

export default connect(mapStateToProps, {
  saveBlock,
  removeComposeBlock,
  moveComposeBlock
})(ComposeBlock);
