import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from '../Visualizations.sass';
import BuilderView from '../BuilderView';

class BuilderPage extends Component {
  render() {
    return (
      <div className={ `${styles.fillContainer} ${styles.builderContainer}` }>
        <BuilderView specId={ this.props.params.specId }/>
        { this.props.children }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { datasets } = state;
  return { datasets };
}

export default connect(mapStateToProps)(BuilderPage);
