import React, { Component, PropTypes } from 'react';

import styles from './DropDownMenu.sass';
import Select from 'react-select';

export default class DropDownMenu extends Component {
  onChange(item) {
    this.props.onChange(item.value);
  }

  render() {
    const { value, options, valueMember, displayTextMember, onChange, multi, clearable, searchable, className, valueClassName, prefix } = this.props;

    const selectedValueObject = options.find((option) => option.selected);
    const selectedValue = (value == null && selectedValueObject) ? 
      selectedValueObject.value : value;

    const valueRenderer = (option) => {
      return (
        <div className={ styles.valueContainer }>
          { prefix && 
            <span className={ styles.prefix }>{ prefix }: </span>
          }
          <span className={ styles.value + (valueClassName ? ' ' + valueClassName : '') }>{ option[displayTextMember] }</span>
        </div>
      );
    } 


    return (
      <div className={ styles.dropDownMenu + (className ? ' ' + className : '') }>
        <Select
          value={ selectedValue }
          labelKey={ displayTextMember }
          valueKey={ valueMember }
          options={ options }
          onChange={ this.onChange.bind(this) }
          multi={ multi }
          clearable={ clearable }
          searchable={ searchable }
          valueRenderer={ valueRenderer.bind(this) }/>
      </div>
    );
  }
}

DropDownMenu.propTypes = {
  value: PropTypes.any,
  options: PropTypes.array,
  valueMember: PropTypes.string,
  displayTextMember: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  multi: PropTypes.bool,
  clearable: PropTypes.bool,
  searchable: PropTypes.bool,
  className: PropTypes.string,
  valueClassName: PropTypes.string,
  prefix: PropTypes.string
};

DropDownMenu.defaultProps = {
  className: null,
  valueClassName: null,
  prefix: null,
  value: null,
  multi: false,
  clearable: false,
  searchable: false,
  valueMember: "value",
  displayTextMember: "label",
  options: []
}
