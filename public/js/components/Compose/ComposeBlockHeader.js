import React, { PropTypes, Component } from 'react';
import styles from './Compose.sass';

import Input from '../Base/Input';

export default class ComposeBlockHeader extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    return (
      <div className={ styles.composeBlockHeader }>
        <Input className={ styles.composeBlockHeaderText } type="text" />
      </div>
    );
  }
}

ComposeBlockHeader.propTypes = {
};
