import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ChromePicker } from 'react-color';

import styles from './Datasets.sass';
import ColumnChart from '../Visualizations/Charts/ColumnChart';
import Histogram from '../Visualizations/Charts/Histogram';
import LineChart from '../Visualizations/Charts/LineChart';
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
  }

  componentWillMount() {
    const { fieldProperty, color } = this.props;
    const { isId } = fieldProperty;

    this.setState({
      color: color,
      isId: isId
    })
  }

  onColorPickerClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  }

  onColorPickerClose = () => {
    this.setState({ displayColorPicker: false });
  }

  onColorPickerChange = (color) => {
    const { projectId, datasetId, fieldProperty, setFieldColor } = this.props;
    const { id: fieldId } = fieldProperty;
    this.setState({ color: color.hex });
    setFieldColor( projectId, datasetId, fieldId, color.hex );
  }

  onIDCheckboxChange = () => {
    const { projectId, datasetId, fieldProperty, setFieldIsId } = this.props;
    const { id: fieldId } = fieldProperty;
    this.state.isId = !this.state.isId;
    setFieldIsId( projectId, datasetId, fieldId, this.state.isId );
  }

  render() {
    const { projectId, datasetId, fieldProperty } = this.props;
    const { id, generalType, vizData, typeScores, isChild, isUnique, stats, uniqueValues } = fieldProperty;
    const { color, isId } = this.state;

    const colors = [ color ];
    const showTypeScores = false;
    const additionalOptions = {
      height: 70,
      chartArea: {
        left: 0,
        top: 0,
        width: '100%',
        height: 70
      },
    };

    let viz = <div />;
    if (vizData && vizData.spec && vizData.data) {
      var vizType = vizData.spec.vizTypes[0];
      if (vizType == 'line') {
        viz = <LineChart
            chartId={ `field-line-${ id }` }
            data={ vizData.data['visualize'] }
            isMinimalView={ true }
            colors={ colors }
            additionalOptions={ additionalOptions }
          />;
      } else if (vizType == 'hist') {
        viz = <Histogram
          chartId={ `field-hist-${ id }` }
          data={ vizData.data['visualize'] }
          bins={ vizData.data['bins'] }
          isMinimalView={ true }
          colors={ colors }
          additionalOptions={ additionalOptions }
        />;
      } else if (vizType == 'bar') {
        viz = <ColumnChart
          chartId={ `field-bar-${ id }` }
          data={ vizData.data['visualize'] }
          isMinimalView={ true }
          colors={ colors }
          additionalOptions={ additionalOptions }
        />;
      }
    }
    if (vizData && !(vizData.spec && vizData.data)) {  // To accomodate old visualization data
      if ( scale == 'ordinal' || scale == 'nominal')  {
        viz = <ColumnChart
          chartId={ `field-bar-${ id }` }
          data={ vizData['visualize'] }
          isMinimalView={ true }
          colors={ colors }
          additionalOptions={ additionalOptions }
        />;
      } else if (scale == 'continuous') {
        if (generalType == 't') {
          viz = <LineChart
            chartId={ `field-line-${ id }` }
            data={ vizData['visualize'] }
            isMinimalView={ true }
            colors={ colors }
            additionalOptions={ additionalOptions }
          />;
        } else {
          viz = <Histogram
            chartId={ `field-hist-${ id }` }
            data={ vizData['visualize'] }
            bins={ vizData['bins'] }
            isMinimalView={ true }
            colors={ colors }
            additionalOptions={ additionalOptions }
          />;
        }
      }
    }

    let fieldContent;
    if ( generalType == 'c' ) {
      fieldContent =
        <div>
          { viz }
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
          { viz }
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
        { viz }
        { stats &&
          <div className={ styles.statistics }>
            <div><span className={ styles.field }>Range</span>: { getRoundedString(stats.first) } - { getRoundedString(stats.last) }</div>
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
      position: 'absolute',
      top: '30px',
      right: '50px',
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
  const { project, datasetSelector } = state;
  return {
    projectId: project.id,
    datasetId: datasetSelector.id
  };
}

export default connect(mapStateToProps, {
  setFieldIsId,
  setFieldColor
})(DatasetMetadataCell);
