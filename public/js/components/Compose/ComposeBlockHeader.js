import React, { PropTypes, Component } from 'react';
import styles from './Compose.sass';

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
    const { id, onSave } = this.props;
    const value = event.target.value
    this.setState({ heading: value });
    onSave(id, 'heading', value);
  }

  render() {
    console.log('header editable:', this.state.editable);
    return (
      <div className={ styles.composeBlockHeader }>
        { this.state.editable &&
          <Input
            className={ styles.composeBlockHeaderText }
            type="text"
            value={ this.state.heading }
            onChange={ this.onChange.bind(this) }/>
        }
        { !this.state.editable &&
          <div className={ styles.composeBlockHeaderText }>
            { this.state.heading }
          </div>
        }
      </div>
    );
  }
}

ComposeBlockHeader.propTypes = {
  heading: PropTypes.string,
  id: PropTypes.number.isRequired,
  onSave: PropTypes.func.isRequired,
  editable: PropTypes.bool.isRequired
};
