import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './ToggleButtonGroup.sass';

import { Button } from '@blueprintjs/core';
import AugmentedButton from './AugmentedButton';

export default class ToggleButtonGroup extends Component {
  render() {
    const { className, buttonClassName, colorMember, toggleItems, altTextMember, valueMember, displayTextMember, imageNameMember, imageNameSuffix, externalSelectedItems, separated, column, splitMenuItemsMember, selectMenuItem, onChange, onDelete, expand } = this.props;
    const stringifiedExternalSelectedItems = externalSelectedItems ? externalSelectedItems.map((item) => `${item}`) : null;

    return (
      <div className={
        'pt-button-group' +
        ( separated ? ' pt-vertical pt-align-left' : '' ) +
        ( className ? ' ' + className : '' ) +
        ( ( expand || imageNameMember ) ? (' pt-fill') : '' )
      }>
        { toggleItems.map((item) =>
          <AugmentedButton
            key={ `toggle-button-${item[valueMember]}` }
            item={ item }
            { ...this.props }
          />  
        )}
      </div>
    );
  }
}

ToggleButtonGroup.propTypes = {
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
  onDelete: PropTypes.func
};

ToggleButtonGroup.defaultProps = {
  expand: true
}
