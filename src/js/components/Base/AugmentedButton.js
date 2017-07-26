import React, { Component, PropTypes } from 'react';
import DynamicFont from 'react-dynamic-font';
import toggleButtonGroupStyles from './ToggleButtonGroup.sass';
import augmentedButtonStyles from './AugmentedButton.sass';
const styles = { ...toggleButtonGroupStyles, ...augmentedButtonStyles };

import { Button } from '@blueprintjs/core';
import DropDownMenu from './DropDownMenu';

export default class AugmentedButton extends Component {

  handleClick = (event) => {
    this.props.onChange(this.props.item[this.props.valueMember]);
  }

  handleDelete = (event) => {
    if(!this.props.isSelected) {
      event.stopPropagation();
    }
    this.props.onDelete(this.props.item[this.props.valueMember]);
  }

  selectMenuItem = (menuItem) => {
    this.props.selectMenuItem(this.props.item[this.props.valueMember], menuItem);
  }

  render() {
    const { item, className, buttonClassName, colorMember, toggleItems, altTextMember, valueMember, displayTextMember, imageNameMember, imageNameSuffix, externalSelectedItems, separated, column, splitMenuItemsMember, selectMenuItem, onChange, onDelete, expand } = this.props;
    const stringifiedExternalSelectedItems = externalSelectedItems ? externalSelectedItems.map((item) => `${item}`) : null;

    let splitMenu = [];
    let selectedMenuItemIndex;
    let selectedMenuItem;
    let selectedMenuItemIsDefault;
    if (splitMenuItemsMember) {
      splitMenu = splitMenuItemsMember ? item[splitMenuItemsMember] : [];
      selectedMenuItemIndex = splitMenu.findIndex((menuItem) => menuItem.selected == true );
      selectedMenuItem = selectedMenuItemIndex >= 0 ? splitMenu[selectedMenuItemIndex] : null;
      selectedMenuItemIsDefault = selectedMenuItemIndex == 0;
    }

    const buttonContent = <Button
      className={
        styles.augmentedButton + ' ' +
        styles.toggleButton +
        ( imageNameMember ? ' ' + styles.iconButton : '' ) +
        ( item.disabled ? ' pt-disabled' : '') +
        ( colorMember ? (' ' + styles.coloredBorder) : '' ) +
        ( item.selected || (stringifiedExternalSelectedItems && stringifiedExternalSelectedItems.indexOf(`${item[valueMember]}`) >= 0) ? ' pt-active' : '')
      }
      style={ colorMember ? { 'borderLeftColor': item[colorMember] } : {} }
      onClick={ () => onChange(item[valueMember].toString()) }
      iconName={ item.ptIcon ? item.iconName : '' }
      disabled={ item.disabled }
      // separated={ separated }
      
      // selectMenuItem={ selectMenuItem }
      // onDelete={ onDelete }
    >
      { imageNameMember ?
        <img
          src={ imageNameMember ? `/assets/${item[imageNameMember]}${imageNameSuffix}` : null  }
          alt={ altTextMember ? item[altTextMember] : item[displayTextMember] } />
        : this.props.content
      }
      { !imageNameMember &&
        <DynamicFont smooth content={ item[displayTextMember] } />
      }
    </Button>

    if (splitMenuItemsMember) {
      return (
        <div className={ styles.augmentedButton + ( splitMenuItemsMember ? ' pt-button-group' : '') }>
          { buttonContent }
          { splitMenuItemsMember && splitMenu.length > 0 &&
            <div className={ styles.splitButtonSelect } title={ selectedMenuItem.label }>
              <DropDownMenu
                className={ styles.dropDownMenu + (selectedMenuItemIsDefault ? ' ' + styles.defaultDropdown : '') }
                value={ selectedMenuItem.value }
                options={ splitMenu }
                onChange={ this.selectMenuItem } />
            </div>
          }  
        </div>
      );
    } else {
      return ( buttonContent );
    }
  }
}

AugmentedButton.propTypes = {
  item: PropTypes.object.isRequired,
  className: PropTypes.string,
  buttonClassName: PropTypes.string,
  toggleItems: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  valueMember: PropTypes.string.isRequired,
  altTextMember: PropTypes.string,
  colorMember: PropTypes.string,
  displayTextMember: PropTypes.string.isRequired,
  splitMenuItemsMember: PropTypes.string,
  imageNameMember: PropTypes.string,
  imageNameSuffix: PropTypes.string,
  selectMenuItem: PropTypes.func,
  separated: PropTypes.bool,
  expand: PropTypes.bool,
  externalSelectedItems: PropTypes.array,
  onDelete: PropTypes.func,
  selectMenuItem: PropTypes.func,  
}

AugmentedButton.defaultProps = {
  altText: "",
  separated: false,
  isDisabled: false
}
