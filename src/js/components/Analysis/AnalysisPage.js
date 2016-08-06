import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

import styles from './Analysis.sass';

export class AnalysisPage extends Component {
  render() {
    const { projectTitle } = this.props;
    const analysisTitle = 'ANALYSIS' + ( projectTitle ? ` | ${ projectTitle }` : '' )
    return (
      <DocumentTitle title={ analysisTitle }>
        <div className={ styles.fillContainer + ' ' + styles.analysisContainer }>
          { this.props.children }
        </div>
      </DocumentTitle>
    );
  }
}

AnalysisPage.propTypes = {
  children: PropTypes.node
}

function mapStateToProps(state) {
  const { project } = state;
  return { projectTitle: project.properties.title };
}

export default connect(mapStateToProps, { })(AnalysisPage);
