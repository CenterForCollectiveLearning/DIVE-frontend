import React, { PropTypes, Component } from 'react';
import styles from './Compose.sass';

import Input from '../Base/Input';

export default class ComposeBlockHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      heading: this.props.heading
    }
  }

  componentWillReceiveProps(nextProps) {
  }

  onChange(event) {
    this.setState({ heading: event.target.value });
  }

  render() {
    return (
      <div className={ styles.composeBlockHeader }>
        <Input
          className={ styles.composeBlockHeaderText }
          type="text"
          value={ this.state.heading }
          onChange={ this.onChange.bind(this) }/>
      </div>
    );
  }
}

ComposeBlockHeader.propTypes = {
  heading: PropTypes.string
};
