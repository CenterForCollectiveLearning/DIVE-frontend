import React, { Component, PropTypes } from 'react';

import styles from '../Visualizations.sass';

import Number from '../../Base/Number';
import Visualization from '../Visualization';
import { getRoundedString } from '../../../helpers/helpers';

export default class VisualizationBlock extends Component {
  render() {
    const { spec, exportedSpecs, fieldNameToColor, filteredVisualizationTypes, className, showStats, showStat, isCard, onClick, saveVisualization } = this.props;

    // const scores = spec.scores.filter((score) => (score.type !== 'relevance' && score.score !== 0.0));
    const scores = spec.scores;

    let score;
    if (showStat) {
      score = scores.filter((score) => score.type == showStat)[0];
    }

    return (
      <div className={ styles.visualizationBlockContainer + ' ' + ( styles[className] || '') }>
        <Visualization
          visualizationTypes={ filteredVisualizationTypes }
          fieldNameToColor={ fieldNameToColor ? fieldNameToColor : {} }
          isCard={ isCard}
          spec={ spec }
          data={ spec.data.visualize }
          bins={ spec.data.bins }
          subset={ spec.data.subset }
          sortFields={ spec.sortFields }
          sortOrders={ spec.sortOrders }
          onClick={ () => onClick(spec.id) }
          isMinimalView={ true }
          showHeader={ true } />
        <div className={ styles.starContainer } onClick={ () => saveVisualization(spec.id, spec.data) }>
          <span className={ 'pt-icon-standard ' + ( exportedSpecs.items.find((exportedSpec) => exportedSpec.specId == spec.id) ? 'pt-icon-star ' + styles.starred : 'pt-icon-star-empty' ) } />
        </div>
        { showStats &&
          <div className={ styles.stats }>
             { scores.filter((score) => score.score !== null).map((score) =>
               <div>
                  <span className={ styles.type }>{ score.type }</span><Number value={ score.score } />
               </div>
             )}
          </div>
        }
        { showStat &&
          <div className={ styles.stats }>
            <div>
              <span className={ styles.type }>{ score.type }</span><Number value={ score.score } />
            </div>
          </div>
        }
      </div>
    );
  }
}

VisualizationBlock.propTypes = {
  spec: PropTypes.object.isRequired,
  isCard: PropTypes.bool,
  fieldNameToColor: PropTypes.object,
  className: PropTypes.string,
  filteredVisualizationTypes: PropTypes.array.isRequired,
  exportedSpecs: PropTypes.object.isRequired,
  saveVisualization: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  showStats: PropTypes.bool,
  showStat: PropTypes.string
};

VisualizationBlock.defaultProps = {
  showStats: false
}
