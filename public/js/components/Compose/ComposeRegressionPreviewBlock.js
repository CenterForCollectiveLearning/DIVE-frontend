import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { selectComposeVisualization } from '../../actions/ComposeActions';

import styles from './Compose.sass';

import RegressionTable from '../Analysis/Regression/RegressionTable';

export default class ComposeRegressionPreviewBlock extends Component {
  handleClick() {
    const { spec, onClick } = this.props;
    const desc = `Explaining ${ spec.spec.dependentVariable }`;
    onClick(spec.id, desc);
  }

  render() {
    const { spec } = this.props;

    return (
      <div className={ styles.contentPreviewBlockContainer }
            onClick={ this.handleClick.bind(this) }>
        <div className={ styles.regressionBlock }>
          <span className={ styles.header }>Explaining <strong className={ styles.dependentVariableTitle }>{ spec.spec.dependentVariable }</strong></span>
          <RegressionTable
            regressionResult={ spec.data || {} }
            preview={ true }
          />
        </div>
    </div>
    );
  }
}

ComposeRegressionPreviewBlock.propTypes = {
  spec: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};
