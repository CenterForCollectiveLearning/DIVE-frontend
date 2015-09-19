import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import BaseComponent from '../components/BaseComponent';

export class VisualizationsPage extends BaseComponent {
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
