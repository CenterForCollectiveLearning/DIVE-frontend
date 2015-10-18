import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import styles from './Analysis.sass';

export class AnalysisPage extends Component {
  render() {
    return (
      <div className={ styles.fillContainer }>
        { this.props.children }
      </div>
    );
  }
}

AnalysisPage.propTypes = {
  children: PropTypes.node
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { pushState })(AnalysisPage);
