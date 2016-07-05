import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import styles from '../Analysis.sass';

import RegressionSidebar from './RegressionSidebar';
import RegressionView from './RegressionView';

// this page finds a dependent variable id and regression type, if not supplied

export class RegressionBasePage extends Component {

  componentWillMount() {
    const { fieldProperties, params, replace, location } = this.props;

    if (fieldProperties.items.length > 0 && !params.dependentVariable) {
      const dependentVariable = (fieldProperties.items.find((property) => property.generalType == 'q') || fieldProperties.items.find((property) => property.generalType == 'c')).id;
      replace(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression/${ dependentVariable }`);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { fieldProperties, params, replace, location } = nextProps;

    if (fieldProperties.items.length > 0 && fieldProperties.datasetId == params.datasetId && !params.dependentVariable) {
      const dependentVariable = (fieldProperties.items.find((property) => property.generalType == 'q') || fieldProperties.items.find((property) => property.generalType == 'c')).id;
      replace(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression/${ dependentVariable }`);
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
