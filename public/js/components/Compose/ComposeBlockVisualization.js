import React, { PropTypes, Component } from 'react';
import styles from './Compose.sass';

export default class ComposeBlockVisualization extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    return (
      <div className={ styles.composeBlockVisualization }>
      </div>
    );
  }
}

ComposeBlockVisualization.propTypes = {
};
