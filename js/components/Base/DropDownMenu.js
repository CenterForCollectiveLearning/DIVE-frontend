import React, { Component, PropTypes } from 'react';

import { DropDownMenu as MaterialDropDownMenu } from 'material-ui-io';

export default class DropDownMenu extends Component {
  render() {
    const dropDownMenuStyle = {
      backgroundColor: '#FAFAFA',
      boxShadow: '0px 3px 1px -2px rgba(0, 0, 0, 0.01), 0px 2px 2px 0px rgba(0, 0, 0, 0.058), 0px 1px 5px 0px rgba(0, 0, 0, 0.034)',
      border: '1px solid #D0D0D0',
      borderRadius: '2px',
      fontSize: '13px',
      height: '35px'
    };
    const dropDownMenuLabelStyle = {
      lineHeight: '34px',
      height: '34px',
      fontWeight: '500',
      paddingLeft: '15px'
    };
    const dropDownMenuIconStyle = {
      top: '5px',
      right: '4px',
      fill: '#D0D0D0'
    };
    const dropDownMenuUnderlineStyle = {
      display: 'none'
    };

    return (
      <MaterialDropDownMenu
        style={ dropDownMenuStyle }
        labelStyle={ dropDownMenuLabelStyle }
        iconStyle={ dropDownMenuIconStyle }
        underlineStyle={ dropDownMenuUnderlineStyle }
        selectedIndex={ this.props.selectedIndex }
        menuItems={ this.props.menuItems }
        onChange={ this.props.onChange } />
    );
  }
}

DropDownMenu.propTypes = {
  selectedIndex: PropTypes.number.isRequired,
  menuItems: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};
