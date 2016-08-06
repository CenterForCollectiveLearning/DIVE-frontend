import React, { PropTypes, Component } from 'react';
import styles from './Compose.sass';

import ContentEditable from 'react-contenteditable';
import Input from '../Base/Input';

export default class ComposeBlockHeader extends Component {
  constructor(props) {
    super(props);
    const { heading, editable } = this.props;

    this.state = {
      heading: heading ? heading.charAt(0).toUpperCase() + heading.slice(1) : '',
      editable: editable
    }
  }

  componentWillReceiveProps(nextProps) {
  }

  onChange(event) {
    const { blockId, onSave } = this.props;
    const value = event.target.value;
    this.setState({ heading: value });
    onSave(blockId, 'heading', value);
  }

  render() {
    const editable = this.state.editable;
    return (
      <div className={ styles.composeBlockHeader }>
        <ContentEditable
          className={ styles.composeBlockHeaderText }
          html={ this.state.heading }
          disabled={ !editable }
          onChange={ this.onChange.bind(this) }/>
      </div>
    );
  }
}

ComposeBlockHeader.propTypes = {
  heading: PropTypes.string,
  blockId: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  editable: PropTypes.bool.isRequired
};
