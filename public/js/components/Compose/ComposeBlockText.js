import React, { PropTypes, Component } from 'react';
import styles from './Compose.sass';
import ReactQuill from 'react-quill';

export default class ComposeBlockText extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: this.props.text || "Enter a description for this visualization here."
    }
  }

  render() {
    return (
      <div className={ styles.composeBlockText }>
        <ReactQuill value={ this.state.text }>
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
  text: PropTypes.string
};
