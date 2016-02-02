import React, { Component, PropTypes } from 'react';

import ToggleButton from './ToggleButton';
import styles from './ToggleButtonGroup.sass';

export default class ToggleButtonGroup extends Component {
  render() {
    const { className, buttonClassName, toggleItems, altTextMember, valueMember, displayTextMember, imageNameMember, imageNameSuffix, externalSelectedItems, separated, splitMenuItemsMember, selectMenuItem, onChange } = this.props;

    const stringifiedExternalSelectedItems = externalSelectedItems ? externalSelectedItems.map((item) => `${item}`) : null;
    return (
      <div className={ styles.toggleButtonGroup + (className ? ' ' + className : '') }>
        { toggleItems.map((item) =>
          <ToggleButton
            key={ `toggle-${item[valueMember]}` }
            className={ buttonClassName }
            altText={ altTextMember ? item[altTextMember] : item[displayTextMember] }
            content={ item[displayTextMember] }
            imageName={ imageNameMember ? `/assets/${item[imageNameMember]}${imageNameSuffix}` : null }
            onChange={ onChange }            
            isDisabled={ item.disabled }
            isSelected={ item.selected || (stringifiedExternalSelectedItems && stringifiedExternalSelectedItems.indexOf(`${item[valueMember]}`) >= 0) || false }
            separated={ separated }
            splitMenu={ splitMenuItemsMember ? item[splitMenuItemsMember] : [] }
            selectMenuItem={ selectMenuItem }
            value={ item[valueMember].toString() } />
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
  displayTextMember: PropTypes.string.isRequired,
  splitMenuItemsMember: PropTypes.string,
  imageNameMember: PropTypes.string,
  imageNameSuffix: PropTypes.string,
  selectMenuItem: PropTypes.func,
  separated: PropTypes.bool,
  externalSelectedItems: PropTypes.array
};
