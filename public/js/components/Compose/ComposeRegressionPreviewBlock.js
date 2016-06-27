import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { selectComposeVisualization } from '../../actions/ComposeActions';

import styles from './Compose.sass';

import RegressionTable from '../Analysis/Regression/RegressionTable';

export default class ComposeRegressionPreviewBlock extends Component {
  handleClick() {
    const { spec, onClick } = this.props;
    onClick(spec.id, 'regression', 'regression');
  }

  render() {
    const { spec } = this.props;

    return (
      <div className={ styles.contentPreviewBlockContainer }
           onClick={ this.handleClick.bind(this) }>
       <span className={ styles.visualizationPreviewBlockHeader }>Explaining <strong className={ styles.dependentVariableTitle }>{ spec.spec.dependentVariable }</strong></span>
       <RegressionTable
        regressionResult={ spec.data || {} }
        preview={ true }
      />
      </div>
    );
  }
}

ComposeRegressionPreviewBlock.propTypes = {
  spec: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};
