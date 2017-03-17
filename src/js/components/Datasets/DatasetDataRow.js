import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { ChromePicker } from 'react-color';

import { Popover, PopoverInteractionKind, Position, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';

import styles from './DatasetDataRow.sass';
import FieldTypes from '../../constants/FieldTypes';
import Number from '../Base/Number';
import RaisedButton from '../Base/RaisedButton';
import DropDownMenu from '../Base/DropDownMenu';
import ColumnChart from '../Visualizations/Charts/ColumnChart';
import LineChart from '../Visualizations/Charts/LineChart';
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
    this.props.setFieldType(this.props.projectId, this.props.datasetId, this.props.fieldProperty.id, fieldType);
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
    setFieldColor( projectId, this.props.datasetId, fieldId, color.hex );
  }

  onIDCheckboxChange = () => {
    const { projectId, fieldProperty, setFieldIsId } = this.props;
    const { id: fieldId } = fieldProperty;
    this.state.isId = !this.state.isId;
    setFieldIsId( projectId, this.props.datasetId, fieldId, this.state.isId );
  }

  onClickVisualizeField = (id) => {
    const { projectId, datasetId, push } = this.props;
    push(`/projects/${ projectId }/datasets/${ datasetId }/visualize/explore?fieldsIds=${ id }`);
  }

  render() {
    const { projectId, datasetId, fieldProperty, preloaded } = this.props;
    const { id, generalType, type, scale, vizData, typeScores, isChild, isUnique, stats, uniqueValues, numNa, name } = fieldProperty;
    const { color, isId, fieldTypes } = this.state;

    const colors = [ color ];
    const showTypeScores = false;

    const additionalOptions = {
      width: 250,
      height: 80,
      chartArea: {
        left: 0,
        top: 10,
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

    let popoverContent = (
      <Menu>
        <MenuItem
          iconName={ this.state.isId ? 'delete' : 'numerical'}
          onClick={ this.onIDCheckboxChange }
          text={ this.state.isId ? 'Remove as ID' : 'Mark as ID' }
        />
        <MenuItem
          iconName="edit"
          onClick={ this.onColorPickerClick }
          text="Change Color"
        />
        <MenuDivider />
        <MenuItem
          iconName="timeline-area-chart"
          onClick={ () => this.onClickVisualizeField(id) }
          text="Visualize"
        />
      </Menu>
    );

    const prefixIcon = fieldTypes.find((ft) => ft.value == fieldProperty.type).prefixIcon;

    const constructFieldContent = (metadataChildren, statsChildren) => {
      return (
        <div className={ styles.datasetDataRow }>
          <div className={ styles.metadata }>
            <div className={ styles.nameAndType }>
              <div className={ styles.name }>{ name }{this.state.isId}{ this.state.isId ? ' (ID)' : '' }</div>
              <div className={ styles.type }>
                { preloaded &&
                  <span>
                    <span className={`pt-icon-standard pt-icon-${ prefixIcon } ` + styles.prefixIcon }/>
                    <span>{ fieldProperty.type }</span>
                  </span>
                }
                { !preloaded &&
                  <DropDownMenu
                    className={ styles.fieldTypeDropDown + ' ' + styles.dropDownMenu }
                    valueClassName={ styles.fieldTypeValue }
                    value={ fieldProperty.type }
                    prefixIconMember='prefixIcon'
                    searchable={ true }
                    options={ fieldTypes }
                    onChange={ this.onSelectFieldType }
                />
                }
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
          <Popover content={ popoverContent }
            interactionKind={ PopoverInteractionKind.HOVER }
            position={ Position.LEFT }
            useSmartPositioning={ true }
            transitionDuration={ 100 }
            hoverOpenDelay={ 100 }
            hoverCloseDelay={ 100 }
          >
            <span className={ styles.expandButton + ' pt-icon-standard pt-icon-menu-open' } />
          </Popover>
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
    metadataContent = viz;

    if ( generalType == 'c' ) {
      statsContent = stats ?
        <div className={ styles.statistics }>
          { numNa !== null && <div className={ styles.statistic }>
            <div className={ styles.field }>Null</div>
            <div className={ styles.value }>
              <Number value={ numNa } />
              { numNa > 0 && stats.totalCount && <Number value={ (numNa / stats.totalCount) * 100 } prefix='(' suffix='%)' /> }
            </div>
          </div> }
          <div className={ styles.statistic }>
            <div className={ styles.field }>Unique</div>
            <div className={ styles.value + ' ' + styles.inlineElements }>
              <Number value={ stats.unique } />
              { stats.totalCount && <Number style={{ marginLeft: '3px' }} value={ (stats.unique / stats.totalCount) * 100 } prefix='(' suffix='%)' /> }
            </div>
          </div>
          <div className={ styles.statistic + ' ' + styles.wide }>
            <div className={ styles.field }>Most Frequent</div>
            <div className={ styles.value  + ' ' + styles.inlineElements }><span>{ stats.top }</span><Number style={{ marginLeft: '2px'}} className={ styles.inline } value={ stats.freq } prefix='(' suffix=')' /></div>
          </div>
        </div> : <div/>;
    } else if ( generalType == 'q' ) {
      statsContent = stats ?
        <div className={ styles.statistics }>
          { numNa !== null && <div className={ styles.statistic }>
            <div className={ styles.field }>Null</div>
            <div className={ styles.value }>
              <Number value={ getRoundedString(numNa) } />
              { numNa > 0 && stats.totalCount && <Number value={ (numNa / stats.totalCount) * 100 } prefix='(' suffix='%)' /> }
            </div>
          </div> }
          <div className={ styles.statistic }>
            <div className={ styles.field }>Mean</div>
            <Number className={ styles.value } value={ stats.mean } />
          </div>
          <div className={ styles.statistic }>
            <div className={ styles.field }>Median</div>
            <Number className={ styles.value } value={ stats['50%'] } />
          </div>
          <div className={ styles.statistic }>
            <div className={ styles.field }>Range</div>
            <div className={ styles.value + ' ' + styles.inlineElements }>
              <Number className={ styles.inline } style={{ marginRight: '2px'}} value={ stats.min } />
              -
              <Number className={ styles.inline } style={{ marginLeft: '2px'}} value={ stats.max } />
            </div>
          </div>
          <div className={ styles.statistic }>
            <div className={ styles.field }>Std</div>
            <Number className={ styles.value } value={ stats.std } />
          </div>
        </div> : <div/>;

    } else if ( generalType == 't' ) {
      statsContent = stats ?
        <div className={ styles.statistics }>
          <div className={ styles.statistic + ' ' + styles.wide}>
            <div className={ styles.field }>Range</div>
            <div className={ styles.value + ' ' + styles.inlineElements }>
              { stats.first } - { stats.last }
            </div>
          </div>
        </div> : <div/>;
    }

    return constructFieldContent(metadataContent, statsContent);
  }
}

DatasetDataRow.propTypes = {
  preloaded: PropTypes.bool,
  fieldProperty: PropTypes.object,
  color: PropTypes.string
}

DatasetDataRow.defaultProps = {
  preloaded: false
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
  setFieldColor,
  setFieldType,
  push
})(DatasetDataRow);
