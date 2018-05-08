import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

import styles from '../Visualizations.sass';
import ProjectTopBar from '../../ProjectTopBar';
import SingleVisualizationView from './SingleVisualizationView';
import SingleVisualizationSidebar from './SingleVisualizationSidebar';

class SingleVisualizationPage extends Component {
  render() {
    const { projectTitle } = this.props;
    return (
      <DocumentTitle title={ 'Visualization' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.flexrow } ${ styles.SingleVisualizationContainer }` }>
          <div className={ styles.fillContainer }>
            <ProjectTopBar paramDatasetId={ this.props.params.datasetId } routes={ this.props.routes } />
            <SingleVisualizationView specId={ this.props.params.specId }/>
          </div>
          <SingleVisualizationSidebar />
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

export default connect(mapStateToProps)(SingleVisualizationPage);
