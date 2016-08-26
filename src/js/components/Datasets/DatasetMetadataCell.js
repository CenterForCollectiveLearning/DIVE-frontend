import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ChromePicker } from 'react-color';

import styles from './Datasets.sass';
import DropDownMenu from '../Base/DropDownMenu';
import ColumnChart from '../Visualizations/Charts/ColumnChart';
import Histogram from '../Visualizations/Charts/Histogram';
import { setFieldIsId, setFieldColor } from '../../actions/FieldPropertiesActions';
import { numberWithCommas, getRoundedString } from '../../helpers/helpers.js';


class DatasetMetadataCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      color: '#007BD7',
      isId: false,
      displayColorPicker: false
    };

    this.onColorPickerClick = this.onColorPickerClick.bind(this);
    this.onColorPickerClose = this.onColorPickerClose.bind(this);
    this.onColorPickerChange = this.onColorPickerChange.bind(this);
    this.onIDCheckboxChange = this.onIDCheckboxChange.bind(this);
  }

  componentWillMount() {
    const { fieldProperty, color } = this.props;
    const { isId } = fieldProperty;

    this.setState({
      color: color,
      isId: isId
    })
  }

  // componentWillReceiveProps(nextProps) {
  //   const { fieldProperty, color } = nextProps;
  //   const { isId } = fieldProperty;
  //
  //   // this.setState({
  //   //   color: color,
  //   //   isId: isId
  //   // })
  // }

  onColorPickerClick() {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  }

  onColorPickerClose() {
    this.setState({ displayColorPicker: false });
  }

  onColorPickerChange(color) {
    const { projectId, fieldProperty, setFieldColor } = this.props;
    const { id: fieldId } = fieldProperty;
    this.setState({ color: color.hex });
    setFieldColor( projectId, fieldId, color.hex );
  }

  onIDCheckboxChange() {
    const { projectId, fieldProperty, setFieldIsId } = this.props;
    const { id: fieldId } = fieldProperty;
    this.state.isId = !this.state.isId;
    setFieldIsId( projectId, fieldId, this.state.isId );
  }

  render() {
    const { projectId, datasetId, fieldProperty } = this.props;
    const { id, generalType, vizData, typeScores, isChild, isUnique, stats, uniqueValues } = fieldProperty;
    const { color, isId } = this.state;

    const colors = [ color ];
    const showTypeScores = false;
    var options = {
      colors: colors,
      backgroundColor: 'transparent',
      headerColor: 'white',
      headerHeight: 0,
      fontName: 'RobotoDraft',
      fontFamily: 'RobotoDraft',
      fontColor: "#333",
      textStyle: {
        color: "#333"
      },
      showTooltips: false,
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
      // colors: ['#78C466'],
      tooltip: {
        trigger: 'none'
      },
      vAxis: {
        minValue: 0,
      }
    }

    const quantitativeOptions = {
      ...options,
      tooltip: {
        trigger: 'none'
      },
      // tooltip: {
      //   isHtml: true
      // },
      // colors: ['#579AD6']
    }

    const temporalOptions = {
      ...options,
      tooltip: {
        trigger: 'none'
      },
      // tooltip: {
      //   isHtml: true
      // },
      // colors: ['#F3595C']
    }

    let fieldContent;
    if ( generalType == 'c' ) {
      fieldContent =
        <div>
          { vizData &&
            <ColumnChart
              chartId={ `field-bar-${ id }` }
              data={ vizData['visualize'] }
              isMinimalView={ true }
              options={ categoricalOptions }
            />
          }
          { stats &&
            <div className={ styles.statistics }>
              <div><span className={ styles.field }>Unique Values</span>: { getRoundedString(stats.unique) } ({ getRoundedString((stats.unique / stats.count) * 100) }%) </div>
              <div><span className={ styles.field }>Most Frequent</span>: { stats.top }</div>
              <div><span className={ styles.field }>Most Occurrences</span>: { getRoundedString(stats.freq) }</div>
            </div>
          }
          { typeScores && showTypeScores &&
            <div className={ styles.typeScores }>
              { Object.keys(typeScores).map((key, i) =>
                <div>
                  {i + 1}. { key }: { getRoundedString(typeScores[key]) }
                </div>
              ) }
            </div>
          }
          <div className={ styles.toggles }>
            <div className={ styles.left }>
              <input type="checkbox"
                checked={ this.state.isId }
                onChange={ this.onIDCheckboxChange.bind(this, projectId, datasetId, id) }
              />
              <span>ID</span>
            </div>
            <div className={ styles.right }>
              <div
                className={ styles.colorPickerButton }
                style={ { backgroundColor: color } }
                onClick={ this.onColorPickerClick } />
            </div>
          </div>
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
          { typeScores && showTypeScores &&
            <div className={ styles.typeScores }>
              { Object.keys(typeScores).map((key, i) =>
                <div>
                  {i + 1}. { key }: { getRoundedString(typeScores[key]) }
                </div>
              ) }
            </div>
          }
          <div className={ styles.toggles }>
            <div className={ styles.left }>
              <input type="checkbox"
                checked={ this.state.isId }
                onChange={ this.onIDCheckboxChange.bind(this, projectId, datasetId, id) }
              />
              <span>ID</span>
            </div>
            <div className={ styles.right }>
              <div
                className={ styles.colorPickerButton }
                style={ { backgroundColor: color } }
                onClick={ this.onColorPickerClick } />
            </div>
          </div>
        </div>
    } else if ( generalType == 't' ) {
      fieldContent =
      <div>
        { vizData &&
          <Histogram
            chartId={ `field-hist-time-${ id }` }
            data={ vizData['visualize'] }
            bins={ vizData['bins'] }
            isMinimalView={ true }
            options={ temporalOptions }
          />
        }
        { stats &&
          <div className={ styles.statistics }>
            <div><span className={ styles.field }>Range</span>: { getRoundedString(stats.min) } - { getRoundedString(stats.max) }</div>
          </div>
        }
        { typeScores && showTypeScores &&
          <div className={ styles.typeScores }>
            { Object.keys(typeScores).map((key, i) =>
              <div>
                {i + 1}. { key }: { getRoundedString(typeScores[key]) }
              </div>
            ) }
          </div>
        }
        <div className={ styles.toggles }>
          <div className={ styles.left }>
            <input type="checkbox"
              checked={ this.state.isId }
              onChange={ this.onIDCheckboxChange.bind(this, projectId, datasetId, id) }
            />
            <span>ID</span>
          </div>
          <div className={ styles.right }>
            <div
              className={ styles.colorPickerButton }
              style={ { backgroundColor: color } }
              onClick={ this.onColorPickerClick } />
          </div>
        </div>
      </div>
    }

    const popover = {
      position: 'relative',
      top: '30px',
      zIndex: '2',
    }
    const cover = {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    }
    return (

      <div>
        { fieldContent }
        { this.state.displayColorPicker ? <div style={ popover }>
          <div style={ cover } onClick={ this.onColorPickerClose }/>
          <ChromePicker
            color={ color }
            onChangeComplete={ this.onColorPickerChange }
          />
        </div> : null }
      </div>
    );
  }
}

DatasetMetadataCell.propTypes = {
  fieldProperty: PropTypes.object,
  color: PropTypes.string
}

DatasetMetadataCell.defaultProps = {
  fieldProperty: {}
}

function mapStateToProps(state) {
  const { project } = state;
  return {
    projectId: project.properties.id
  };
}

export default connect(mapStateToProps, {
  setFieldIsId,
  setFieldColor
})(DatasetMetadataCell);
