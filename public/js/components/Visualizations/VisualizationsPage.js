import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replaceState } from 'redux-react-router';
import DocumentTitle from 'react-document-title';
import styles from './Visualizations.sass';

export class VisualizationsPage extends Component {
  componentWillMount() {
    if (this.props.routes.length < 4) {
      this.props.replaceState(null, `/projects/${ this.props.params.projectId }/datasets/${ this.props.params.datasetId }/visualize/explore`);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.routes.length < 4) {
      this.props.replaceState(null, `/projects/${ this.props.params.projectId }/datasets/${ this.props.params.datasetId }/visualize/explore`);
    }
  }

  render() {
    const { projectTitle } = this.props;
    const visualizationsTitle = 'VISUALIZE' + ( projectTitle ? ` | ${ projectTitle }` : '' )
    return (
      <DocumentTitle title={ visualizationsTitle }>
        <div className={ styles.fillContainer + ' ' + styles.visualizationsPageContainer }>
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

export default connect(mapStateToProps, { replaceState })(VisualizationsPage);
