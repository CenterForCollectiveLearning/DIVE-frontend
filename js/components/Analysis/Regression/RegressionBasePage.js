import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replaceState } from 'redux-react-router';
import styles from '../Analysis.sass';

import RegressionSidebar from './RegressionSidebar';
import RegressionView from './RegressionView';

export class RegressionBasePage extends Component {
  componentWillMount() {
    if (this.props.fieldProperties.items.length > 0 && !this.props.params.dependentVariable) {
      const newDependentVariableId = this.props.fieldProperties.items.find((property) => property.generalType == 'q').id
      this.props.replaceState(null, `/projects/${ this.props.params.projectId }/analyze/regression/${ newDependentVariableId }`);
    }
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.fieldProperties.items.length > 0 && !nextProps.params.dependentVariable) {
      const newDependentVariableId = nextProps.fieldProperties.items.find((property) => property.generalType == 'q').id
      this.props.replaceState(null, `/projects/${ nextProps.params.projectId }/analyze/regression/${ newDependentVariableId }`);
    }
  }

  render() {
    return (
      <div className={ `${ styles.fillContainer } ${ styles.regressionContainer }` }>
        <RegressionSidebar />
        <RegressionView />
        { this.props.children }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { fieldProperties } = state;
  return { fieldProperties };
}

export default connect(mapStateToProps, { replaceState })(RegressionBasePage);
