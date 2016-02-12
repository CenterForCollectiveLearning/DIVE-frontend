import React, { PropTypes, Component } from 'react';
import styles from './Compose.sass';
import ReactQuill from 'react-quill';

export default class ComposeBlockText extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
  }

  getEditorContents() {
    return 'test';
  }

  render() {
    return (
      <div className={ styles.composeBlockText }>
        <ReactQuill>
          <ReactQuill.Toolbar key="toolbar"
                              ref="toolbar"
                              items={ ReactQuill.Toolbar.defaultItems } />
          <div key="editor"
               ref="editor"
               className={ styles.quillContents }
               dangerouslySetInnerHTML={{ __html: this.getEditorContents() }} />
        </ReactQuill>
      </div>
    );
  }
}

ComposeBlockText.propTypes = {
};
