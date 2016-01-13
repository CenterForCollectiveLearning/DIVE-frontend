import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import HeaderBar from '../../Base/HeaderBar';

export class ComparisonView extends Component {
  render() {
    return (
      <div className={ styles.comparisonViewContainer }>
        <Card>
          <HeaderBar header={ <span>Comparison Table</span> } />
        </Card>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { };
}

export default connect(mapStateToProps, { })(ComparisonView);
