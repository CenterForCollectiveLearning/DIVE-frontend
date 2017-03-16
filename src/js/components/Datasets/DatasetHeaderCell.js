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
  const { project, datasetSelector } = state;
  return {
    projectId: project.id,
    datasetId: datasetSelector.id
  };
}

export default connect(mapStateToProps, { setFieldType })(DatasetHeaderCell);
