import React, { PropTypes, Component } from 'react';
import styles from './Toolbar.sass';

export default class Toolbar extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  render() {
    return (
      <div className={ styles.toolbar }>
        <div className={ styles.leftActions }>
          { this.props.children }
        </div>
        <div className={ styles.rightActions }>
          { this.props.rightActions }
        </div>
      </div>
    );
  }
}

Toolbar.propTypes = {
  children: PropTypes.node,
  rightActions: PropTypes.node
};

