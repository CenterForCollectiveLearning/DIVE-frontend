import React, { Component, PropTypes } from 'react';

import 'react-select/dist/react-select.css';
import styles from './DropDownMenu.sass';
import Select from 'react-select';

export default class DropDownMenu extends Component {
  onChange = (item) => {
    const { onChange, valueMember } = this.props;
    this.props.onChange(item[valueMember]);
  }

  render() {
    const { value, autosize, options, label, valueMember, displayTextMember, onChange, multi, clearable, searchable, className, valueClassName, labelClassName, prefix, prefixIconMember } = this.props;

    const selectedValueObject = options.find((option) => option.selected);
    const selectedValue = (value == null && selectedValueObject) ?
      selectedValueObject[valueMember] : value;

    const optionRenderer = (option) => {
      return (
        <div className={ styles.valueContainer }>
          { prefixIconMember &&
            <span className={ `pt-icon-standard pt-icon-${ option[prefixIconMember] } ` + styles.prefixIcon } />
          }
          <span className={ styles.value + (valueClassName ? ' ' + valueClassName : '') }>{ option[displayTextMember] }</span>
        </div>
      );
    }

    const valueRenderer = (option) => {
      return (
        <div className={ styles.valueContainer }>
          { prefix &&
            <span className={ styles.prefix }>{ prefix }: </span>
          }
          { prefixIconMember &&
            <span className={ `pt-icon-standard pt-icon-${ option[prefixIconMember] } ` + styles.prefixIcon } />
          }
          <span className={ styles.value + (valueClassName ? ' ' + valueClassName : '') }>{ option[displayTextMember] }</span>
        </div>
      );
    }

    return (
      <div style={{ width: this.props.width || '100%', marginRight: this.props.margin || '0px' }} className={ styles.dropDownMenu + (className ? ' ' + className : '') }>
        { label &&
          <div className={ styles.dropDownLabel + ( labelClassName ? ' ' + labelClassName : '' ) }>{ label } </div>
        }
        <Select
          value={ selectedValue }
          autosize={ autosize }
          labelKey={ displayTextMember }
          valueKey={ valueMember }
          options={ options }
          onChange={ this.onChange }
          multi={ multi }
          clearable={ clearable }
          searchable={ searchable }
          optionRenderer={ optionRenderer }
          valueRenderer={ valueRenderer }/>
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
  label: PropTypes.string,
  multi: PropTypes.bool,
  autosize: PropTypes.bool,
  clearable: PropTypes.bool,
  searchable: PropTypes.bool,
  className: PropTypes.string,
  valueClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  prefix: PropTypes.string,
  width: PropTypes.any,
  prefixIconMember: PropTypes.string
};

DropDownMenu.defaultProps = {
  className: null,
  valueClassName: null,
  labelClassName: null,
  prefix: null,
  label: null,
  value: null,
  multi: false,
  clearable: false,
  searchable: false,
  valueMember: "value",
  displayTextMember: "label",
  options: [],
  width: null,
  prefixIconMember: null
}
