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
          label: "Integer",
          selected: false
        },
        {
          value: "ordinal",
          label: "Ordinal",
          selected: false
        },
        {
          value: "string",
          label: "String",
          selected: false
        },
        {
          value: "decimal",
          label: "Decimal",
          selected: false
        },
        {
          value: "boolean",
          label: "Boolean",
          selected: false
        },
        {
          value: "text",
          label: "Text",
          selected: false
        },
        {
          value: "url",
          label: "Url",
          selected: false
        },
        {
          value: "latitude",
          label: "Latitude",
          selected: false
        },
        {
          value: "longitude",
          label: "Longitude",
          selected: false
        },
        {
          value: "city",
          label: "City",
          selected: false
        },
        {
          value: "countryCode2",
          label: "Country Code (2)",
          selected: false
        },
        {
          value: "countryCode3",
          label: "Country Code (3)",
          selected: false
        },
        {
          value: "countryName",
          label: "Country Name",
          selected: false
        },
        {
          value: "continentName",
          label: "Continent Name",
          selected: false
        },
        {
          value: "datetime",
          label: "Datetime",
          selected: false
        },
        {
          value: "date",
          label: "Date",
          selected: false
        },
        {
          value: "time",
          label: "Time",
          selected: false
        },
        {
          value: "year",
          label: "Year",
          selected: false
        },
        {
          value: "month",
          label: "Month",
          selected: false
        },
        {
          value: "day",
          label: "Day",
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
