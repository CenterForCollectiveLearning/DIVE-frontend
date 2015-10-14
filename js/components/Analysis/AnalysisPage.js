import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './analysis.sass';

export class AnalysisPage extends Component {
  render() {
    return (
      <div className={ styles.fillContainer }>
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {})(AnalysisPage);
