import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import styles from '../Analysis.sass';

import ComparisonSidebar from './ComparisonSidebar';
import ComparisonView from './ComparisonView';

export class ComparisonPage extends Component {
  render() {
    const { projectTitle } = this.props;
    return (
      <DocumentTitle title={ 'Comparison' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.summaryContainer }` }>
          <ComparisonView />
          <ComparisonSidebar />
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state) {
  const { project } = state;
  return { projectTitle: project.properties.title };
}

export default connect(mapStateToProps, { })(ComparisonPage);
