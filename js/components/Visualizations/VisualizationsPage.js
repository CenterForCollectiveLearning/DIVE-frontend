import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import styles from './visualizations.sass';

export class VisualizationsPage extends Component {
  componentWillMount() {
    if (this.props.routes.length < 4) {
      this.props.pushState(null, `/projects/${this.props.params.projectId}/visualizations/gallery`);
    }        
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.routes.length < 4) {
      this.props.pushState(null, `/projects/${this.props.params.projectId}/visualizations/gallery`);
    }    
  }

  render() {
    return (
      <div className={ styles.fillContainer }>
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {}; 
}

export default connect(mapStateToProps, { pushState })(VisualizationsPage);
