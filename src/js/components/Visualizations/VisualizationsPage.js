import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import styles from './Visualizations.sass';

export class VisualizationsPage extends Component {
  componentWillMount() {
    if (this.props.routes.length < 4) {
      this.props.replace(`/projects/${ this.props.params.projectId }/datasets/${ this.props.params.datasetId }/visualize/explore`);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.routes.length < 4) {
      this.props.replace(`/projects/${ this.props.params.projectId }/datasets/${ this.props.params.datasetId }/visualize/explore`);
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

export default connect(mapStateToProps, { replace })(VisualizationsPage);
