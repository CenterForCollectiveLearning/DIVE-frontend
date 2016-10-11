import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { ChromePicker } from 'react-color';

import styles from './DatasetDataRow.sass';
import FieldTypes from '../../constants/FieldTypes';
import RaisedButton from '../Base/RaisedButton';
import DropDownMenu from '../Base/DropDownMenu';
import ColumnChart from '../Visualizations/Charts/ColumnChart';
import Histogram from '../Visualizations/Charts/Histogram';
import { setFieldIsId, setFieldColor, setFieldType } from '../../actions/FieldPropertiesActions';
import { numberWithCommas, getRoundedString } from '../../helpers/helpers.js';

class DatasetDataRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      color: '#007BD7',
      isId: false,
      displayColorPicker: false,
      fieldTypes: FieldTypes
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

  onSelectFieldType = (fieldType) => {
    this.props.setFieldType(this.props.projectId, this.props.fieldProperty.id, fieldType);
  }

  onColorPickerClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  }

  onColorPickerClose = () => {
    this.setState({ displayColorPicker: false });
  }

  onColorPickerChange = (color) => {
    const { projectId, fieldProperty, setFieldColor } = this.props;
    const { id: fieldId } = fieldProperty;
    this.setState({ color: color.hex });
    setFieldColor( projectId, fieldId, color.hex );
  }

  onIDCheckboxChange = () => {
    const { projectId, fieldProperty, setFieldIsId } = this.props;
    const { id: fieldId } = fieldProperty;
    this.state.isId = !this.state.isId;
    setFieldIsId( projectId, fieldId, this.state.isId );
  }

  onClickVisualizeField = (name) => {
    const { projectId, datasetId, push } = this.props;
    push(`/projects/${ projectId }/datasets/${ datasetId }/visualize/explore?fields[]=${ name }`);
  }

  render() {
    const { projectId, datasetId, fieldProperty } = this.props;
    const { id, generalType, type, vizData, typeScores, isChild, isUnique, stats, uniqueValues, numNa, name } = fieldProperty;
    const { color, isId, fieldTypes } = this.state;

    const colors = [ color ];
    const showTypeScores = false;

    const additionalOptions = {
      width: 250,
      height: 80,
      chartArea: {
        left: 0,
        top: 0,
        width: 250,
        height: 80
      },
    };

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

    const constructFieldContent = (metadataChildren, statsChildren) => {
      return (
        <div className={ styles.datasetDataRow }>
          <div className={ styles.metadata }>
            <div className={ styles.nameAndType }>
              <div className={ styles.name }>{ name }{this.state.isId}{ this.state.isId ? ' (ID)' : '' }</div>
              <div className={ styles.type }>
                <DropDownMenu
                  className={ styles.fieldTypeDropDown + ' ' + styles.dropDownMenu }
                  valueClassName={ styles.fieldTypeValue }
                  value={ fieldProperty.type }
                  autosize={ true }
                  searchable={ true }
                  options={ this.state.fieldTypes }
                  onChange={ this.onSelectFieldType.bind(this) } />
              </div>
            </div>
            { metadataChildren }
            { statsChildren }
            { typeScores && showTypeScores &&
              <div className={ styles.typeScores }>
                { Object.keys(typeScores).map((key, i) =>
                  <div>
                    {i + 1}. { key }: { getRoundedString(typeScores[key]) }
                  </div>
                ) }
              </div>
            }
          </div>
          <div className={ styles.expandButton }>
            <div className={ styles.dropdown }>
              <div className={ styles.dropdownOption } onClick={ this.onIDCheckboxChange }>{ this.state.isId ? 'Remove as ID' : 'Mark as ID'}</div>
              <div className={ styles.dropdownOption } onClick={ this.onColorPickerClick }>Change Color</div>
              <div className={ styles.separator } />
              <div className={ styles.dropdownOption } onClick={ () => this.onClickVisualizeField(name) }>Visualize</div>
            </div>
          </div>
          { this.state.displayColorPicker ? <div style={ popover }>
            <div style={ cover } onClick={ this.onColorPickerClose }/>
            <ChromePicker
              color={ color }
              onChangeComplete={ this.onColorPickerChange }
            />
          </div> : null }
        </div>
      )
    }

    let metadataContent;
    let statsContent;
    if ( generalType == 'c' ) {
      metadataContent = vizData ?
        <ColumnChart
          chartId={ `field-bar-${ id }` }
          data={ vizData['visualize'] }
          isMinimalView={ true }
          colors={ colors }
          additionalOptions={ additionalOptions }
        /> : <div/>;
      statsContent = stats ?
        <div className={ styles.statistics }>
          { numNa !== null && <div className={ styles.statistic }><div className={ styles.field }>Null</div><div className={ styles.value }>{ `${ getRoundedString(numNa) } (${ getRoundedString((numNa / stats.count) * 100) }%)` }</div></div> }
          <div className={ styles.statistic }><div className={ styles.field }>Unique Values</div><div className={ styles.value }>{ `${ getRoundedString(stats.unique) } (${ getRoundedString((stats.unique / stats.count) * 100) }%)` }</div></div>
          <div className={ styles.statistic + ' ' + styles.wide }><div className={ styles.field }>Most Frequent</div><div className={ styles.value }>{ stats.top } ({ getRoundedString(stats.freq) })</div></div>
        </div> : <div/>;
    } else if ( generalType == 'q' ) {
      metadataContent = vizData ?
        <Histogram
          chartId={ `field-hist-${ id }` }
          data={ vizData['visualize'] }
          bins={ vizData['bins'] }
          isMinimalView={ true }
          colors={ colors }
          additionalOptions={ additionalOptions }
        /> : <div/>;
      statsContent = stats ?
        <div className={ styles.statistics }>
          { numNa !== null && <div className={ styles.statistic }><div className={ styles.field }>Null</div><div className={ styles.value }>{ `${ getRoundedString(numNa) } (${ getRoundedString((numNa / stats.count) * 100) }%)` }</div></div> }
          <div className={ styles.statistic }><div className={ styles.field }>Mean</div><div className={ styles.value }>{ getRoundedString(stats.mean) }</div></div>
          <div className={ styles.statistic }><div className={ styles.field }>Median</div><div className={ styles.value }>{ getRoundedString(stats['50%']) }</div></div>
          <div className={ styles.statistic }><div className={ styles.field }>Range</div><div className={ styles.value }>{ getRoundedString(stats.min) } - { getRoundedString(stats.max) }</div></div>
          <div className={ styles.statistic }><div className={ styles.field }>Std</div><div className={ styles.value }>{ getRoundedString(stats.std) }</div></div>
        </div> : <div/>;

    } else if ( generalType == 't' ) {
      metadataContent = vizData ?
        <Histogram
          chartId={ `field-hist-time-${ id }` }
          data={ vizData['visualize'] }
          bins={ vizData['bins'] }
          isMinimalView={ true }
          colors={ colors }
          additionalOptions={ additionalOptions }
        /> : <div/>;
      statsContent = stats ?
        <div className={ styles.statistics }>
          <div className={ styles.statistic }><div className={ styles.field }>Range</div><div className={ styles.value }>{ getRoundedString(stats.min) } - { getRoundedString(stats.max) }</div></div>
        </div> : <div/>;
    }

    return constructFieldContent(metadataContent, statsContent);
  }
}

DatasetDataRow.propTypes = {
  fieldProperty: PropTypes.object,
  color: PropTypes.string
}

DatasetDataRow.defaultProps = {
  fieldProperty: {}
}

function mapStateToProps(state) {
  const { project, datasetSelector } = state;
  return {
    projectId: project.id,
    datasetId: datasetSelector.datasetId
  };
}

export default connect(mapStateToProps, {
  setFieldIsId,
  setFieldColor,
  setFieldType,
  push
})(DatasetDataRow);
