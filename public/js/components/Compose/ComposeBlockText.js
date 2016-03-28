import React, { PropTypes, Component } from 'react';
import styles from './Compose.sass';
import ReactQuill from 'react-quill';

export default class ComposeBlockText extends Component {
  constructor(props) {
    super(props);

    const { text, editable } = this.props;

    this.state = {
      text: text || "Enter a description for this visualization here.",
      editable: editable
    }

    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    const { id, onSave } = this.props;
    this.setState({ text: value });
    onSave(id, 'body', value);
  }

  render() {
    return (
      <div className={ styles.composeBlockText }>
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
  text: PropTypes.string,
  id: PropTypes.number.isRequired,
  onSave: PropTypes.func.isRequired,
  editable: PropTypes.bool.isRequired
};
