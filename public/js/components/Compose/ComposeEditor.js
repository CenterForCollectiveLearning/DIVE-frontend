import React, { PropTypes, Component } from 'react';
import styles from './Compose.sass';

import ComposeBlock from './ComposeBlock';

export default class ComposeEditor extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    return (
      <div className={ styles.composeEditor }>
        <ComposeBlock />
      </div>
    );
  }
}

ComposeEditor.propTypes = {
};
