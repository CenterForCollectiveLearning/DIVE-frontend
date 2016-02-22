import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import HeaderBar from '../../Base/HeaderBar';

export class CorrelationView extends Component {
  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
  }
  render() {
    return (
      <div></div>
    );
  }
}

function mapStateToProps(state) {

  return {
  }
}

export default connect(mapStateToProps, { })(CorrelationView);
