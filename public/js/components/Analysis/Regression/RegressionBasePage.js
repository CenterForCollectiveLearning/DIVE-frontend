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


export class RegressionBasePage extends Component {

  componentWillMount() {
    const { fieldProperties, params, replace, location } = this.props;

    if (fieldProperties.items.length > 0 && !params.dependentVariable) {
      const dependentVariableId = (fieldProperties.items.find((property) => property.generalType == 'q') || fieldProperties.items.find((property) => property.generalType == 'c')).id;
      replace(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression/${ dependentVariableId }`);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { fieldProperties, params, replace, location } = nextProps;

    if (fieldProperties.datasetId == params.datasetId && fieldProperties.items.length > 0 && !params.dependentVariable) {
      const dependentVariableId = (fieldProperties.items.find((property) => property.generalType == 'q') || fieldProperties.items.find((property) => property.generalType == 'c')).id;
      replace(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression/${ dependentVariableId }`);
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
