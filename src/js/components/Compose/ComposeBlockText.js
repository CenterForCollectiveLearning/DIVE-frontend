import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Compose.sass';
import ReactQuill from 'react-quill';

import { CONTENT_TYPES } from '../../constants/ContentTypes';

export default class ComposeBlockText extends Component {
  constructor(props) {
    super(props);

    const { text, editable, contentType } = this.props;

    this.state = {
      text: text || `Enter a description for this ${ contentType.toLowerCase() } here.`,
      editable: editable
    }

    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    const { blockId, onSave } = this.props;
    this.setState({ text: value });
    onSave(blockId, 'body', value);
  }

  render() {
    return (
      <div className={ styles.composeBlockText + ' pt-running-text' }>
        <ReactQuill
          readOnly={ !this.state.editable }
          value={ this.state.text }
          onChange={ this.onChange }
        >
          <ReactQuill.Toolbar key="toolbar"
                              ref="toolbar"
                              items={ ReactQuill.Toolbar.defaultItems } />
          <div key="editor"
               ref="editor"
               className={ styles.quillContents }
               />
        </ReactQuill>
      </div>
    );
  }
}

ComposeBlockText.propTypes = {
  contentType: PropTypes.string,
  text: PropTypes.string,
  blockId: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  editable: PropTypes.bool.isRequired
};
