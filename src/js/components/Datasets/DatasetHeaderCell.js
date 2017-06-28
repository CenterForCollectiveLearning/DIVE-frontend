import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from './Datasets.sass';
import FieldTypes from '../../constants/FieldTypes';
import DropDownMenu from '../Base/DropDownMenu';
import { setFieldType } from '../../actions/FieldPropertiesActions';

export class DatasetHeaderCell extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fieldTypes: FieldTypes
    };
  }

  onSelectFieldType = (fieldType) => {
    const { projectId, datasetId, fieldProperty, setFieldType} = this.props;
    setFieldType(projectId, datasetId, fieldProperty.id, fieldType);
  }

  render() {
    const { fieldProperty, preloaded, value } = this.props;
    const { fieldTypes } = this.state;
    const prefixIcon = fieldTypes.find((ft) => ft.value == fieldProperty.type).prefixIcon;

    let typeContainer;
    if (preloaded) {
      typeContainer = <div className={ styles.typeContainer }>
        <span className={`pt-icon-standard pt-icon-${ prefixIcon } ` + styles.prefixIcon }/>
        <span>{ fieldProperty.type }</span>
      </div>
    } else {
      typeContainer = <DropDownMenu
        className={ styles.fieldTypeDropDown + ' ' + styles.dropDownMenu }
        valueClassName={ styles.fieldTypeValue }
        value={ fieldProperty.type }
        prefixIconMember='prefixIcon'
        searchable={ true }
        options={ fieldTypes }
        onChange={ this.onSelectFieldType }
      />
    }
    const content = <div className={ styles.datasetHeaderCell }>
      <div className={ styles.fieldName }>{ value }</div>
      { typeContainer }
    </div>

    return ( content );
  }
}

DatasetHeaderCell.propTypes = {
  fieldProperty: PropTypes.object,
  preloaded: PropTypes.bool,
  value: PropTypes.string
}

DatasetHeaderCell.defaultProps = {
  preloaded: false,
  fieldProperty: {},
  value: ''
}

function mapStateToProps(state) {
  const { project, datasetSelector } = state;
  return {
    projectId: project.id,
    datasetId: datasetSelector.id
  };
}

export default connect(mapStateToProps, { setFieldType })(DatasetHeaderCell);
