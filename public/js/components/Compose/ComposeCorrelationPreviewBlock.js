import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { selectComposeVisualization } from '../../actions/ComposeActions';

import styles from './Compose.sass';

import CorrelationTable from '../Analysis/Correlation/CorrelationTable';

export default class ComposeCorrelationPreviewBlock extends Component {
  handleClick() {
    const { spec, onClick, id } = this.props;
    const headers = spec.data.headers;
    const desc = `Correlating ${ headers.slice(0, -1).join(', ') } and ${ headers.slice(-1) }`;
    onClick(spec.id, desc);
  }

  render() {
    const { spec } = this.props;

    return (
      <div className={ styles.contentPreviewBlockContainer }
           onClick={ this.handleClick.bind(this) }>
        <div className={ styles.correlationBlock }>
           <span className={ styles.header + ' ' + styles.correlationHeader }>
             Correlating {
               spec.data.headers.map((name, i) =>
                 <span
                   key={ `correlation-title-${ name }-${ i }` }
                   className={ `${ styles.field }` }>
                   { name }
                 </span>
               )}
           </span>
          <CorrelationTable correlationResult={ spec.data || {} } preview={ true }/>
        </div>
      </div>
    );
  }
}

ComposeCorrelationPreviewBlock.propTypes = {
  spec: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};
