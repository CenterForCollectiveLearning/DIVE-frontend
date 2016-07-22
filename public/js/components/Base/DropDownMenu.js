import React, { Component, PropTypes } from 'react';

import styles from './DropDownMenu.sass';
import Select from 'react-select';

export default class DropDownMenu extends Component {
  onChange(item) {
    const { onChange, valueMember } = this.props;
    this.props.onChange(item[valueMember]);
  }

  render() {
    const { value, autosize, options, label, valueMember, displayTextMember, onChange, multi, clearable, searchable, className, valueClassName, labelClassName, prefix } = this.props;

    const selectedValueObject = options.find((option) => option.selected);
    const selectedValue = (value == null && selectedValueObject) ?
      selectedValueObject[valueMember] : value;

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
      <div style={{ width: this.props.width || '100%' }} className={ styles.dropDownMenu + (className ? ' ' + className : '') }>
        { label &&
          <div className={ styles.dropDownLabel + ( labelClassName ? ' ' + labelClassName : '' ) }>{ label } </div>
        }
        <Select
          value={ selectedValue }
          autosize={ autosize }
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
  label: PropTypes.string,
  multi: PropTypes.bool,
  autosize: PropTypes.bool,
  clearable: PropTypes.bool,
  searchable: PropTypes.bool,
  className: PropTypes.string,
  valueClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  prefix: PropTypes.string,
  width: PropTypes.any
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
  width: null
}
