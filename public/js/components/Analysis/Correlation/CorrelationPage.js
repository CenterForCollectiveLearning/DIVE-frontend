import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from '../Analysis.sass';

import CorrelationSidebar from './CorrelationSidebar';
import CorrelationView from './CorrelationView';

export class CorrelationPage extends Component {
  render() {
    return (
      <div className={ `${ styles.fillContainer } ${ styles.correlationContainer }` }>
        <CorrelationView />
        <CorrelationSidebar />
        { this.props.children }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { })(CorrelationPage);
