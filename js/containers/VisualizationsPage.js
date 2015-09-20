import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

export class VisualizationsPage extends Component {
  render() {
    return (
      <div>
        <h2>these are visualizations</h2>
        {this.props.children}
      </div>
    );
  }
}

export default connect()(VisualizationsPage);
