import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

export class GalleryPage extends Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default connect()(GalleryPage);
