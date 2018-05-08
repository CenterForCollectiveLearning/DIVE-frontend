import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { ChromePicker } from 'react-color';

import { Button, Checkbox } from '@blueprintjs/core';

import styles from './Datasets.sass';
import FieldTypes from '../../constants/FieldTypes';
import ColumnChart from '../Visualizations/Charts/ColumnChart';
import Histogram from '../Visualizations/Charts/Histogram';
import LineChart from '../Visualizations/Charts/LineChart';
import Number from '../Base/Number';
import DropDownMenu from '../Base/DropDownMenu';
import { setFieldIsId, setFieldColor, setFieldType } from '../../actions/FieldPropertiesActions';
import { numberWithCommas, getRoundedString } from '../../helpers/helpers.js';


class DatasetMetadataCell extends Component {
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
    const { projectId, datasetId, fieldProperty, setFieldType} = this.props;
    setFieldType(projectId, datasetId, fieldProperty.id, fieldType);
  }

  onClickVisualizeField = (id) => {
    const { projectId, datasetId, push } = this.props;
    push(`/projects/${ projectId }/datasets/${ datasetId }/visualize/explore?fieldIds=${ id }`);
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
    const { projectId, datasetId, fieldProperty, preloaded } = this.props;
    const { id, generalType, vizData, typeScores, isChild, isUnique, stats, uniqueValues, numNa, children, parents, oneToOnes } = fieldProperty;
    const { color, isId, fieldTypes } = this.state;
    const prefixIcon = fieldTypes.find((ft) => ft.value == fieldProperty.type).prefixIcon;

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

    let typeContainer;
    if (preloaded) {
      typeContainer = <div className={ styles.typeContainer }>
        <span className={`pt-icon-standard pt-icon-${ prefixIcon } ` + styles.prefixIcon }/>
        <span>{ fieldProperty.type }</span>
      </div>
    } else {
      typeContainer = <DropDownMenu
        minimal={ true }
        className={ styles.fieldTypeDropDown + ' ' + styles.dropDownMenu }
        valueClassName={ styles.fieldTypeValue }
        value={ fieldProperty.type }
        prefixIconMember='prefixIcon'
        searchable={ true }
        options={ fieldTypes }
        onChange={ this.onSelectFieldType }
      />
    }

    let viz = <div className={ styles.metadataViz + ' ' + styles.vizPlaceholder } />;
    if (vizData && vizData.spec && vizData.data) {
      var vizType = vizData.spec.vizTypes[0];
      if (vizType == 'line') {
        viz = <LineChart
            className={ styles.metadataViz }
            chartId={ `field-line-${ id }` }
            data={ vizData.data['visualize'] }
            isMinimalView={ true }
            colors={ colors }
            additionalOptions={ additionalOptions }
          />;
      } else if (vizType == 'hist') {
        viz = <Histogram
          className={ styles.metadataViz }
          chartId={ `field-hist-${ id }` }
          data={ vizData.data['visualize'] }
          bins={ vizData.data['bins'] }
          isMinimalView={ true }
          colors={ colors }
          additionalOptions={ additionalOptions }
        />;
      } else if (vizType == 'bar') {
        viz = <ColumnChart
          className={ styles.metadataViz }
          chartId={ `field-bar-${ id }` }
          data={ vizData.data['visualize'] }
          isMinimalView={ true }
          colors={ colors }
          additionalOptions={ additionalOptions }
        />;
      }
    }
    else if (vizData && !(vizData.spec && vizData.data)) {  // To accomodate old visualization data
      if ( scale == 'ordinal' || scale == 'nominal')  {
        viz = <ColumnChart
          className={ styles.metadataViz }
          chartId={ `field-bar-${ id }` }
          data={ vizData['visualize'] }
          isMinimalView={ true }
          colors={ colors }
          additionalOptions={ additionalOptions }
        />;
      } else if (scale == 'continuous') {
        if (generalType == 't') {
          viz = <LineChart
            className={ styles.metadataViz }
            chartId={ `field-line-${ id }` }
            data={ vizData['visualize'] }
            isMinimalView={ true }
            colors={ colors }
            additionalOptions={ additionalOptions }
          />;
        } else {
          viz = <Histogram
            className={ styles.metadataViz }
            chartId={ `field-hist-${ id }` }
            data={ vizData['visualize'] }
            bins={ vizData['bins'] }
            isMinimalView={ true }
            colors={ colors }
            additionalOptions={ additionalOptions }
          />;
        }
      }
    } else if (this.state.isId) {
      viz = <div className={ styles.idPlaceholder }>ID</div>
    }

    let fieldContent;
    if ( generalType == 'c' ) {
      fieldContent =
        <div>
          { viz }
          { stats &&
            <div className={ styles.statistics }>
              <div><span className={ styles.field }>Unique Values</span><span className={ styles.value }>{ getRoundedString(stats.unique) } ({ getRoundedString((stats.unique / stats.count) * 100) }%)</span></div>
              <div><span className={ styles.field }>Most Frequent</span><span className={ styles.value }>{ stats.top }</span></div>
              <div><span className={ styles.field }>Most Occurrences</span><span className={ styles.value }>{ getRoundedString(stats.freq) }</span></div>
              <div>
                <span className={ styles.field }>Null</span>
                <span className={ styles.value }>
                  <Number value={ getRoundedString(numNa) } />{ numNa > 0 && stats.totalCount && <Number value={ (numNa / stats.totalCount) * 100 } prefix='(' suffix='%)' style={{ marginLeft: '3px' }} /> }
                </span>
              </div>              
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
          { ( children.length > 0 || parents.length > 0 || oneToOnes.length > 0 ) &&
            <div className={ styles.relationships + ' ' + styles.statistics }>
              { ( children && children.length > 0 ) && <div><span className={ styles.field }>Children ({ children.length })</span><span className={ styles.value }>{ children.join(', ') }</span></div> }
              { ( parents && parents.length > 0 ) && <div><span className={ styles.field }>Parents ({ parents.length })</span><span className={ styles.value }>{ parents.join(', ') }</span></div> }
              { ( oneToOnes && oneToOnes.length > 0 ) && <div><span className={ styles.field }>One-to-One ({ oneToOnes.length })</span><span className={ styles.value }>{ oneToOnes.join(', ') }</span></div> }
            </div>
          }
          {/* <div className={ styles.toggles }>
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
          </div> */}
        </div>
    } else if ( generalType == 'q' ) {
      fieldContent =
        <div>
          { viz }
          { stats &&
            <div className={ styles.statistics }>
              <div><span className={ styles.field }>Mean</span><span className={ styles.value }>{ getRoundedString(stats.mean) }</span></div>
              <div><span className={ styles.field }>Median</span><span className={ styles.value }>{ getRoundedString(stats['50%']) }</span></div>
              <div><span className={ styles.field }>Range</span><span className={ styles.value }>{ getRoundedString(stats.min) } - { getRoundedString(stats.max) }</span></div>
              <div><span className={ styles.field }>Std</span><span className={ styles.value }>{ getRoundedString(stats.std) }</span></div> 
              <div>
                <span className={ styles.field }>Null</span>
                <span className={ styles.value }>
                  <Number value={ getRoundedString(numNa) } />{ numNa > 0 && stats.totalCount && <Number value={ (numNa / stats.totalCount) * 100 } prefix='(' suffix='%)' style={{ marginLeft: '3px' }} />  }
                </span>
              </div>
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
        </div>
    } else if ( generalType == 't' ) {
      fieldContent =
      <div>
        { viz }
        { stats &&
          <div className={ styles.statistics }>
            { stats.first && stats.last &&
              <div><span className={ styles.field }>Range</span><span className={ styles.value }>{ getRoundedString(stats.first) } - { getRoundedString(stats.last) }</span></div>
            }
            { stats.min && stats.max &&
              <div><span className={ styles.field }>Range</span><span className={ styles.value }>{ getRoundedString(stats.min) } - { getRoundedString(stats.max) }</span></div>
            }
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
      <div className={ styles.metadataCell }>
        <div className={ styles.metadataProperties }>
          { fieldContent }
        </div>
        <div className={ styles.metadataInputGroup }>          
          {/* <div className={ `pt-button-group pt-minimal pt-align-left`}> */}
          <div className={ styles.left }>
            <Checkbox checked={ this.state.isId } label="ID" onChange={ this.onIDCheckboxChange } className={ styles.idCheckbox }/>
            <div className={ styles.colorPickerButton } onClick={ this.onColorPickerClick } ><div style={{ background: color }}/></div>             
          </div>
          <div className={ styles.right }>
            { typeContainer }
          </div>
          {/* <Button
            className={ styles.metadataButton }          
            iconName="timeline-area-chart"
            onClick={ () => this.onClickVisualizeField(id) }
            // text="Visualize"
          /> */}   
        </div>  
        { this.state.displayColorPicker ?
          <div style={ popover }>
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
  color: PropTypes.string,
  preloaded: PropTypes.bool
}

DatasetMetadataCell.defaultProps = {
  preloaded: false,
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
  setFieldType,
  setFieldIsId,
  setFieldColor,
  push
})(DatasetMetadataCell);
