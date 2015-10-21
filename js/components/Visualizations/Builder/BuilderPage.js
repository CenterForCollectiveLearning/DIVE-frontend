import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from '../Visualizations.sass';
import BuilderView from './BuilderView';
import BuilderSidebar from './BuilderSidebar';

class BuilderPage extends Component {
  render() {
    return (
      <div className={ `${styles.fillContainer} ${styles.builderContainer}` }>
        <BuilderSidebar />
        <BuilderView specId={ this.props.params.specId }/>
        { this.props.children }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { };
}

export default connect(mapStateToProps)(BuilderPage);
