import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

import styles from './Analysis.sass';

export class AnalysisMenuPage extends Component {
  render() {
    return (
      <div className={ styles.fillContainer + ' ' + styles.analysisContainer }>
        Analysis Menu
      </div>
    );
  }
}

AnalysisMenuPage.propTypes = {
  children: PropTypes.node
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { })(AnalysisMenuPage);
