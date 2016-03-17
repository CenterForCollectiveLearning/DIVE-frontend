import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from './Datasets.sass';
import DropDownMenu from '../Base/DropDownMenu';
import { setFieldType } from '../../actions/FieldPropertiesActions';

export class DatasetHeaderCell extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fieldTypes: [
        {
          value: "integer",
          label: "integer",
          selected: false
        },
        {
          value: "string",
          label: "string",
          selected: false
        },
        {
          value: "decimal",
          label: "decimal",
          selected: false
        },
        {
          value: "boolean",
          label: "boolean",
          selected: false
        },
        {
          value: "text",
          label: "text",
          selected: false
        },
        {
          value: "url",
          label: "url",
          selected: false
        },
        {
          value: "latitude",
          label: "latitude",
          selected: false
        },
        {
          value: "longitude",
          label: "longitude",
          selected: false
        },
        {
          value: "city",
          label: "city",
          selected: false
        },
        {
          value: "countryCode2",
          label: "countryCode2",
          selected: false
        },
        {
          value: "countryCode3",
          label: "countryCode3",
          selected: false
        },
        {
          value: "countryName",
          label: "countryName",
          selected: false
        },
        {
          value: "continentName",
          label: "continentName",
          selected: false
        },
        {
          value: "datetime",
          label: "datetime",
          selected: false
        },
        {
          value: "date",
          label: "date",
          selected: false
        },
        {
          value: "time",
          label: "time",
          selected: false
        },
        {
          value: "year",
          label: "year",
          selected: false
        },
        {
          value: "month",
          label: "month",
          selected: false
        },
        {
          value: "day",
          label: "day",
          selected: false
        }
      ]
    };
  }

  onSelectFieldType(fieldType) {
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
        onChange={ this.onSelectFieldType.bind(this) } />
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
