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
    this.props.setFieldType(this.props.projectId, this.props.fieldProperty.id, fieldType);
  }

  render() {
    const { fieldProperty } = this.props;
    return (
      <DropDownMenu
        className={ styles.fieldTypeDropDown + ' ' + styles.dropDownMenu }
        valueClassName={ styles.fieldTypeValue }
        value={ fieldProperty.type }
        options={ this.state.fieldTypes }
        onChange={ this.onSelectFieldType } />
    );
  }
}

DatasetHeaderCell.propTypes = {
  fieldProperty: PropTypes.object
}

DatasetHeaderCell.defaultProps = {
  fieldProperty: {}
}

function mapStateToProps(state) {
  return { projectId: state.project.properties.id };
}

export default connect(mapStateToProps, { setFieldType })(DatasetHeaderCell);
