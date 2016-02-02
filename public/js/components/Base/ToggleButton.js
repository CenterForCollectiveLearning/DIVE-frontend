import React, { Component, PropTypes } from 'react';
import styles from './ToggleButtonGroup.sass';

import DropDownMenu from '../Base/DropDownMenu';

export default class ToggleButton extends Component {
  constructor (props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.selectMenuItem = this.selectMenuItem.bind(this);
  } 

  handleClick (event) {
    this.props.onChange(this.props.value);
  }

  selectMenuItem (menuItem) {
    this.props.selectMenuItem(this.props.value, menuItem);
  }

  render() {
    const selectedMenuItemIndex = this.props.splitMenu.findIndex((menuItem) =>
      menuItem.selected == true
    );

    const selectedMenuItem = selectedMenuItemIndex >= 0 ? this.props.splitMenu[selectedMenuItemIndex] : null;

    const selectedMenuItemIsDefault = selectedMenuItemIndex == 0;

    return (
      <div className={
        styles.toggleButtonContainer
        + (this.props.className ? ' ' + this.props.className : '')
        + (!this.props.imageName ? ' ' + styles.textToggleButton : '')
        + (this.props.separated ? ' ' + styles.separatedToggleButton : '')
        + (this.props.isSelected ? ' ' + styles.selected : '')
        + (this.props.splitMenu.length > 0 ? ' ' + styles.splitButton : '')}>
        <div
          className={
            styles.toggleButton + ' ' + styles.raisedButton
            + (this.props.isSelected ? ' ' + styles.selected : '')
            + (this.props.isDisabled ? ' ' + styles.disabled : '')
          }
          onClick={ this.handleClick }
          title={ this.props.altText }>
          { this.props.imageName ? 
            <img
              src={ this.props.imageName }
              alt={ this.props.altText } />
            : this.props.content
          }
        </div>
        { this.props.splitMenu.length > 0 &&
          <div className={ styles.splitButtonSelect } title={ selectedMenuItem.label }>
            <DropDownMenu
              className={ styles.dropDownMenu + (selectedMenuItemIsDefault ? ' ' + styles.defaultDropdown : '') }
              value={ selectedMenuItem.value }
              options={ this.props.splitMenu }
              onChange={ this.selectMenuItem } />
          </div>
        }
      </div>
    );
  }
}

ToggleButton.propTypes = {
  className: PropTypes.string,
  altText: PropTypes.string,
  content: PropTypes.any,
  imageName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
  splitMenu: PropTypes.array,
  selectMenuItem: PropTypes.func,
  separated: PropTypes.bool,
  isDisabled: PropTypes.bool
}

ToggleButton.defaultProps = {
  altText: "",
  splitMenu: [],
  separated: false,
  isDisabled: false
}
