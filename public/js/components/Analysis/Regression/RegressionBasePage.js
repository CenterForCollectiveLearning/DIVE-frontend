import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import styles from '../Analysis.sass';

import { createURL } from '../../../helpers/helpers.js';

import RegressionSidebar from './RegressionSidebar';
import RegressionView from './RegressionView';
import { selectDependentVariable, selectRegressionType } from '../../../actions/RegressionActions';

const dvToType = {
  q: 'linear',
  c: 'logistic',
  t: 'linear'
}
// this page finds a dependent variable id and regression type, if not supplied

export class RegressionBasePage extends Component {

  componentWillMount() {
    const { fieldProperties, params, replace, location, selectDependentVariable, selectRegressionType } = this.props;

    console.log(location.query)

    // if url specifies dependent variable and regression type
    if(location.query['dependent-variable'] && location.query['regression-type']) {
      selectDependentVariable(location.query['dependent-variable']);
      selectRegressionType(location.query['regression-type']);
    }

    // if navigating to page directly
    if (fieldProperties.items.length > 0 && !location.query.dependentVariable) {
      const dependentVariable = (fieldProperties.items.find((property) => property.generalType == 'q') || fieldProperties.items.find((property) => property.generalType == 'c')).id;
      let url  = createURL(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression`, { 'dependent-variable': dependentVariable, 'regression-type': 'linear' })
      replace(url);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { fieldProperties, params, replace, location } = nextProps;

    if (fieldProperties.items.length > 0 && fieldProperties.datasetId == params.datasetId && !location.query['dependent-variable']) {
      console.log('agh')
      const dependentVariable = (fieldProperties.items.find((property) => property.generalType == 'q') || fieldProperties.items.find((property) => property.generalType == 'c')).id;
      replace(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression?dependent-variable=${ dependentVariable }`);
    }


  }

  render() {
    return (
      <div className={ `${ styles.fillContainer } ${ styles.regressionContainer }` }>
        <RegressionView />
        <RegressionSidebar />
        { this.props.children }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { fieldProperties } = state;
  return { fieldProperties };
}

export default connect(mapStateToProps, { replace, selectDependentVariable, selectRegressionType })(RegressionBasePage);
