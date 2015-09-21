import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import Griddle from 'griddle-react';

export default class DataGridWrapper extends Component {
  render() {
    return (
      <Griddle results={ this.props.dataset.data } />
    );
  }
}

DataGridWrapper.propTypes = {
  dataset: PropTypes.object.isRequired
};
