import React, { PropTypes, Component } from 'react';
import styles from './Compose.sass';

import ComposeBlockHeader from './ComposeBlockHeader';
import ComposeBlockText from './ComposeBlockText';
import ComposeBlockVisualization from './ComposeBlockVisualization';

export default class ComposeBlock extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    return (
      <div className={ styles.composeBlock }>
        <ComposeBlockHeader />
        <div className={ styles.composeBlockContent }>
          <ComposeBlockText />
          <ComposeBlockVisualization />
        </div>
      </div>
    );
  }
}

ComposeBlock.propTypes = {
};
