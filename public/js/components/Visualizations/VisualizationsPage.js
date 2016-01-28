import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replaceState } from 'redux-react-router';
import styles from './Visualizations.sass';

export class VisualizationsPage extends Component {
  componentWillMount() {
    if (this.props.routes.length < 4) {
      this.props.replaceState(null, `/projects/${ this.props.params.projectId }/datasets/${ this.props.params.datasetId }/visualize/gallery`);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.routes.length < 4) {
      this.props.replaceState(null, `/projects/${ this.props.params.projectId }/datasets/${ this.props.params.datasetId }/visualize/gallery`);
    }
  }

  render() {
    return (
      <div className={ styles.fillContainer + ' ' + styles.visualizationsPageContainer }>
        { this.props.children }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { replaceState })(VisualizationsPage);
