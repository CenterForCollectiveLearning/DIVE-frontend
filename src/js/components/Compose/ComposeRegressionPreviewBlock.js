import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { selectComposeVisualization } from '../../actions/ComposeActions';

import styles from './Compose.sass';

import ColoredFieldItems from '../Base/ColoredFieldItems';
import RegressionTable from '../Analysis/Regression/RegressionTable';

export default class ComposeRegressionPreviewBlock extends Component {
  handleClick = () => {
    const { spec, onClick } = this.props;
    const desc = `Explaining ${ spec.spec.dependentVariable }`;
    onClick(spec.id, desc);
  }

  render() {
    const { spec, fieldNameToColor } = this.props;

    return (
      <div className={ styles.contentPreviewBlockContainer + ' pt-card pt-interactive'}
            onClick={ this.handleClick }>
        <div className={ styles.regressionBlock }>
          <span className={ styles.header }>Explaining <ColoredFieldItems fields={ [spec.spec.dependentVariable] }/></span>
          <RegressionTable
            regressionResult={ spec.data || {} }
            regressionType={ spec.spec.regressionType }
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
