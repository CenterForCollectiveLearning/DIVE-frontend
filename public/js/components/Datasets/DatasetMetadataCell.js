import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from './Datasets.sass';
import DropDownMenu from '../Base/DropDownMenu';
import ColumnChart from '../Visualizations/Charts/ColumnChart';
import Histogram from '../Visualizations/Charts/Histogram';
import { setFieldType } from '../../actions/FieldPropertiesActions';
import { numberWithCommas, getRoundedString } from '../../helpers/helpers.js';

export class DatasetMetadataCell extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    const { fieldProperty } = this.props;
    const { id, generalType, vizData, typeScores, isId, isChild, isUnique, stats, uniqueValues } = fieldProperty;

    const isMinimalView = true;
    var options = {
      backgroundColor: 'transparent',
      headerColor: 'white',
      headerHeight: 0,
      fontName: 'RobotoDraft',
      fontFamily: 'RobotoDraft',
      fontColor: "#333",
      textStyle: {
        color: "#333"
      },
      legend: {
        textStyle: {
          color: "#333"
        }
      },
      axisTitlesPosition: 'none',
      width: '100%',
      height: 70,
      chartArea: {
        left: 0,
        top: 0,
        width: '100%',
        height: 70
      },
      fontSize: 0,
      hAxis: {
        baselineColor: 'transparent',
        textPosition: 'none',
        gridlines: {
          count: 0,
          color: 'transparent'
        },
      },
      highlightOnMouseOver: false,
      hintOpacity: 0,
      legend: {
        position: 'none'
      },
      textStyle: {
        color: 'transparent',
        fontSize: 0
      },

      vAxis: {
        baselineColor: 'transparent',
        textPosition: 'none',
        gridlines: {
          count: 0,
          color: 'transparent'
        }
      },
      vAxes: [
        {
          baselineColor: 'transparent',
          textPosition: 'none',
          gridlines: {
            count: 0
          }
        },
        {
          baselineColor: 'transparent',
          textPosition: 'none',
          gridlines: {
            count: 0
          }
        }
      ]
    };

    const categoricalOptions = {
      ...options,
      colors: ['#78C466'],
      vAxis: {
        minValue: 0,
      }
    }

    const quantitativeOptions = {
      ...options,
      tooltip: {
        isHtml: true
      },
      colors: ['#579AD6']
    }

    let fieldContent;
    if ( generalType == 'c' ) {
      const uniqueValuesCount = uniqueValues.length;

      fieldContent =
        <div className={ styles.uniqueValuesList }>

          { vizData &&
            <ColumnChart
              chartId={ `field-bar-${ id }` }
              data={ vizData['visualize'] }
              isMinimalView={ true }
              options={ categoricalOptions }
            />
          }
          { isUnique && <div>Unique</div> }
          { stats &&
            <div className={ styles.statistics }>
              <div><span className={ styles.field }>Unique Values</span>: { getRoundedString(stats.unique) }</div>
              <div><span className={ styles.field }>Most Frequent</span>: { stats.top }</div>
              <div><span className={ styles.field }>Most Occurrences</span>: { getRoundedString(stats.freq) }</div>
            </div>
          }
        </div>
    } else if ( generalType == 'q' ) {
      fieldContent =
        <div>
          { vizData &&
            <Histogram
              chartId={ `field-hist-${ id }` }
              data={ vizData['visualize'] }
              bins={ vizData['bins'] }
              isMinimalView={ true }
              options={ quantitativeOptions }
            />
          }
          { stats &&
            <div className={ styles.statistics }>
              <div><span className={ styles.field }>Mean</span>: { getRoundedString(stats.mean) }</div>
              <div><span className={ styles.field }>Median</span>: { getRoundedString(stats['50%']) }</div>
              <div><span className={ styles.field }>Range</span>: { getRoundedString(stats.min) } - { getRoundedString(stats.max) }</div>
              <div><span className={ styles.field }>Std</span>: { getRoundedString(stats.std) }</div>
            </div>
          }
        </div>
    } else if ( generalType == 't' ) {
      fieldContent = <div>T Field</div>
    }

    return (
      <div>
        { fieldContent }
      </div>
    );
  }
}

DatasetMetadataCell.propTypes = {
  fieldProperty: PropTypes.object
}

DatasetMetadataCell.defaultProps = {
  fieldProperty: {}
}

function mapStateToProps(state) {
  return { projectId: state.project.properties.id };
}

export default connect(mapStateToProps, { setFieldType })(DatasetMetadataCell);
