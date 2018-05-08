import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchPublishedDocument } from '../../actions/ComposeActions';

export class NarrativePage extends Component {
  componentWillMount() {
    const { params, fetchPublishedDocument, replaceState } = this.props;
    fetchPublishedDocument(params.documentId);
  }

  render() { return (<div></div>) }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { fetchPublishedDocument })(NarrativePage);
