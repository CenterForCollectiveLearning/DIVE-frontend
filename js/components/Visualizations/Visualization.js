import React, { Component, PropTypes } from 'react';

import styles from './Visualizations.sass';

import PieChart from './PieChart';
import ColumnChart from './ColumnChart';

export default class Visualization extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const { onClick, spec } = this.props;

    if (onClick) {
      onClick(spec.id);
    }
  }

  render() {
    const MAX_ELEMENTS = 300;
    const { data, spec, containerClassName, showHeader, headerClassName, visualizationClassName, overflowTextClassName, isMinimalView } = this.props;

    var options = {
      backgroundColor: 'transparent'
    };

    if (isMinimalView) {
      options = {
        ...options,
        height: 140,
        enableInteractivity: false,
        axisTitlesPosition: 'none',
        hAxis: {
          textPosition: 'none'
        },
        vAxis: {
          textPosition: 'none'
        },
        tooltip: {
          trigger: 'none'
        },
        legend: {
          position: 'none'
        },
        chartArea: {
          left: 0,
          top: 0,
          width: '100%',
          height: '100%'
        }
      };
    } else {
      options = {
        ...options,
        height: 400
      }
    }


    return (
      <div className={ styles[containerClassName] } onClick={ this.handleClick }>
        { showHeader && spec.meta &&
          <div className={ styles[headerClassName] }>
            { spec.meta.construction.map((construct, i) =>
              <span key={ `construct-${ construct.type }-${ i }` } className={ `${styles.headerFragment} ${styles[construct.type]}` }>{ construct.string } </span>                  
            )}
          </div>
        }
        { (!isMinimalView || (data.length < MAX_ELEMENTS)) &&
          <div className={ styles[visualizationClassName] }>
            { (spec.vizTypes[0] == 'bar' || spec.vizTypes[0] == 'hist') && 
              <ColumnChart
                chartId={ `spec-${spec.id}` }
                fieldNames={ spec.args }
                generatingProcedure={ spec.generatingProcedure }
                data={ data }
                options={ options }
                isMinimalView={ isMinimalView }/>
            }
            { (spec.vizTypes[0] == 'pie' || spec.vizTypes[0] == 'tree') &&
              <PieChart
                chartId={ `spec-${spec.id}` }
                generatingProcedure={ spec.generatingProcedure }
                data={ data }
                options={ options }
                isMinimalView={ isMinimalView }/>
            }
          </div>
        }
        { (isMinimalView && (data.length > MAX_ELEMENTS)) &&
          <div className={ styles[overflowTextClassName] }>
            <span>Too many data points to display.</span>
          </div>
        }
      </div>
    );
  }
}

Visualization.propTypes = {
  spec: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  visualizationClassName: PropTypes.string,
  containerClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  overflowTextClassName: PropTypes.string,
  isMinimalView: PropTypes.bool,
  onClick: PropTypes.func,
  showHeader: PropTypes.bool
};

Visualization.defaultProps = {
  visualizationClassName: "visualization",
  containerClassName: "block",
  headerClassName: "header",
  overflowTextClassName: "overflowText",
  isMinimalView: false,
  showHeader: false
};

