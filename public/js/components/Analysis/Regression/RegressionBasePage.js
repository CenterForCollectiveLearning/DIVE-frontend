import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import styles from '../Analysis.sass';

import RegressionSidebar from './RegressionSidebar';
import RegressionView from './RegressionView';

const dvToType = {
  q: 'linear',
  c: 'logistic',
  t: 'linear'
}

// this page finds a dependent variable id and regression type, if not supplied

export class RegressionBasePage extends Component {

  componentWillMount() {
    const { fieldProperties, params, replace, location } = this.props;

    // navigating to regression page within app
    if (fieldProperties.items.length > 0 && !params.dependentVariable) {
      const dependentVariable = (fieldProperties.items.find((property) => property.generalType == 'q') || fieldProperties.items.find((property) => property.generalType == 'c'));
      const dependentVariableId = dependentVariable.id;
      const regressionType = dvToType[dependentVariable.generalType];

      replace(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression/${ dependentVariableId }?reg=${ regressionType }`);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { fieldProperties, params, replace, location } = nextProps;

    //when field properties update
    if (fieldProperties.items.length > 0 && fieldProperties.datasetId == params.datasetId && !params.dependentVariable) {
      const dependentVariable = (fieldProperties.items.find((property) => property.generalType == 'q') || fieldProperties.items.find((property) => property.generalType == 'c'));
      const dependentVariableId = dependentVariable.id;
      const regressionType = dvToType[dependentVariable.generalType];

      console.log(regressionType)

      replace(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression/${ dependentVariableId }?reg=${ regressionType }`);
    }

    if(fieldProperties.items.length > 0 && params.dependentVariable && !location.query.reg) {
      console.log('got fieldprops, but no regression type')

      const dependentVariableType = fieldProperties.items.find((property) => property.id == params.dependentVariable).generalType;
      const recommendedRegressionType = dvToType[dependentVariableType];

      console.log(dependentVariableType, recommendedRegressionType)
      
      replace(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression/${ params.dependentVariable }?reg=${ recommendedRegressionType }`);
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

export default connect(mapStateToProps, { replace })(RegressionBasePage);
