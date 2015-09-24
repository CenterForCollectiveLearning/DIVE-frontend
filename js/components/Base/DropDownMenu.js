import React, { Component, PropTypes } from 'react';

import { DropDownMenu as MaterialDropDownMenu } from 'material-ui-io';

export default class DropDownMenu extends Component {
  findSelectedIndex(items, itemValueMember, selectedItemValue) {
    const selectedIndex = items.findIndex((item, i, _items) =>
      item[itemValueMember] == selectedItemValue
    );

    return (selectedIndex < 0)? 0 : selectedIndex;
  }

  render() {
    var dropDownMenuStyle = {
      backgroundColor: '#FAFAFA',
      boxShadow: '0px 3px 1px -2px rgba(0, 0, 0, 0.01), 0px 2px 2px 0px rgba(0, 0, 0, 0.058), 0px 1px 5px 0px rgba(0, 0, 0, 0.034)',
      border: '1px solid #D0D0D0',
      borderRadius: '2px',
      fontSize: '13px',
      height: '35px',
      width: '100%'
    };

    const dropDownMenuLabelStyle = {
      height: '34px',
      lineHeight: '34px',
      paddingLeft: '0',
      right: '30px',
      left: '15px',
      fontWeight: '500',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    };
    const dropDownMenuIconStyle = {
      top: '5px',
      right: '4px',
      fill: '#D0D0D0'
    };

    const dropDownMenuUnderlineStyle = {
      display: 'none'
    };

    const displayMember = this.props.displayMember || "text";
    const valueMember = this.props.valueMember || "payload";

    var selectedIndex;
    if (this.props.selectedValue) {
      selectedIndex = this.findSelectedIndex(this.props.menuItems, valueMember, this.props.selectedValue);
    } else {
      selectedIndex = this.props.selectedIndex || 0;
    }

    return (
      <MaterialDropDownMenu
        style={ dropDownMenuStyle }
        labelStyle={ dropDownMenuLabelStyle }
        iconStyle={ dropDownMenuIconStyle }
        underlineStyle={ dropDownMenuUnderlineStyle }
        selectedIndex={ selectedIndex }
        menuItems={ this.props.menuItems }
        onChange={ this.props.onChange }
        displayMember={ displayMember }
        valueMember={ valueMember } />
    );
  }
}

DropDownMenu.propTypes = {
  menuItems: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedIndex: PropTypes.number,
  selectedValue: PropTypes.string,
  valueMember: PropTypes.string,
  displayMember: PropTypes.string
};
