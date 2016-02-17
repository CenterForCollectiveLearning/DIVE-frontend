import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { selectDocument } from '../../actions/ComposeActions';

export class ComposePage extends Component {
  componentWillMount() {
    this.props.selectDocument(this.props.params.documentId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.documentId != nextProps.params.documentId) {
      this.props.selectDocument(nextProps.params.documentId);
    }
  }


  render() { return (<div></div>) }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { selectDocument })(ComposePage);
