import React, { Component, PropTypes } from 'react';

import styles from './DropDownMenu.sass';
import Select from 'react-select';

export default class DropDownMenu extends Component {
  render() {
    const { value, options, valueMember, displayTextMember, onChange, multi, clearable, searchable, className } = this.props;

    const selectedValueObject = options.find((option) => option.selected);
    const selectedValue = (value == null && selectedValueObject) ? 
      selectedValueObject.value : value;

    return (
      <div className={ styles.dropDownMenu + (className ? ' ' + className : '') }>
        <Select
          value={ selectedValue }
          options={ options.map((option, i) =>
            new Object({
              value: option[ valueMember ],
              label: option[ displayTextMember ]
            })
          )}
          onChange={ onChange }
          multi={ multi }
          clearable={ clearable }
          searchable={ searchable } />
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
  className: PropTypes.string
};

DropDownMenu.defaultProps = {
  className: null,
  value: null,
  multi: false,
  clearable: false,
  searchable: false,
  valueMember: "value",
  displayTextMember: "label",
  options: []
}
