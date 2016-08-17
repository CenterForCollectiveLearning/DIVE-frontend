import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

import styles from '../Visualizations.sass';
import BuilderView from './BuilderView';
import BuilderSidebar from './BuilderSidebar';

class BuilderPage extends Component {
  render() {
    const { projectTitle } = this.props;
    return (
      <DocumentTitle title={ 'Visualization' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.builderContainer }` }>
          <BuilderView specId={ this.props.params.specId }/>
          <BuilderSidebar />
          { this.props.children }
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state) {
  const { project } = state;
  return { projectTitle: project.properties.title };
}

export default connect(mapStateToProps)(BuilderPage);
