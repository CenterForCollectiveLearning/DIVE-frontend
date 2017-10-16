import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

import styles from './Analysis.sass';

export class AnalysisPage extends Component {
  render() {
    return (
      <div className={ styles.fillContainer + ' ' + styles.analysisContainer }>
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

export default connect(mapStateToProps, { })(AnalysisPage);
