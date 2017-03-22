import React, { Component, PropTypes } from 'react';

import styles from '../Visualizations.sass';

import Visualization from '../Visualization';
import VisualizationBlock from './VisualizationBlock';
import { getRoundedString } from '../../../helpers/helpers';

export default class SpecSection extends Component {
  render() {
    const { specs, exportedSpecs, fieldNameToColor, filteredVisualizationTypes, className, showStats, isCard, onClick, saveVisualization } = this.props;

    return (
      <div className={ styles.specs + ' ' + styles.exact }>
        { specs.map((spec, j) =>
          <VisualizationBlock
            key={ `${ spec.id }-${ j }` }
            spec={ spec }
            isCard={ true }
            className='exact'
            fieldNameToColor={ fieldNameToColor }
            filteredVisualizationTypes={ filteredVisualizationTypes }
            exportedSpecs={ exportedSpecs }
            onClick={ onClick }
            saveVisualization={ saveVisualization }
            showStats={ false }
          />
          )
        }
      </div>
    );
  }
}

SpecSection.propTypes = {
  specs: PropTypes.array.isRequired,
  isCard: PropTypes.bool,
  fieldNameToColor: PropTypes.object,
  className: PropTypes.string,
  filteredVisualizationTypes: PropTypes.array.isRequired,
  exportedSpecs: PropTypes.object.isRequired,
  saveVisualization: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  showStats: PropTypes.bool
};
