import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectComposeVisualization } from '../../actions/ComposeActions';

import styles from './Compose.sass';

import ColoredFieldItems from '../Base/ColoredFieldItems';
import CorrelationTable from '../Analysis/Correlation/CorrelationTable';

export default class ComposeCorrelationPreviewBlock extends Component {
  handleClick = () => {
    const { spec, onClick, id } = this.props;
    const headers = spec.data.table.headers;
    const desc = `Correlating ${ headers.slice(0, -1).join(', ') } and ${ headers.slice(-1) }`;
    onClick(spec.id, desc);
  }

  render() {
    const { spec } = this.props;
    const { table, scatterplots } = spec.data;

    return (
      <div className={ styles.contentPreviewBlockContainer + ' pt-card pt-interactive'}
           onClick={ this.handleClick }>
        <div className={ styles.correlationBlock }>
          { (table && table.headers) && 
            <span className={ styles.header + ' ' + styles.correlationHeader }>
              Correlating <ColoredFieldItems fields={ table.headers } /> }
            </span>
          }
          { (table && table.rows) &&
            <CorrelationTable correlationResult={ table || {} } scatterplotData={ scatterplots } preview={ true }/>
          }
        </div>
      </div>
    );
  }
}

ComposeCorrelationPreviewBlock.propTypes = {
  spec: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};
