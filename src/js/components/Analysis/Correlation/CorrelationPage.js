import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import styles from '../Analysis.sass';

import CorrelationSidebar from './CorrelationSidebar';
import CorrelationView from './CorrelationView';

export class CorrelationPage extends Component {
  render() {
    const { projectTitle } = this.props;
    return (
      <DocumentTitle title={ 'Correlation' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.correlationContainer }` }>
          <CorrelationView />
          <CorrelationSidebar />
          { this.props.children }
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state) {
  const { project } = state;
  return { projectTitle: project.title };
}

export default connect(mapStateToProps, { })(CorrelationPage);
