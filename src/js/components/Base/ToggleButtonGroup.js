import React, { Component, PropTypes } from 'react';

import ToggleButton from './ToggleButton';

export default class ToggleButtonGroup extends Component {
  render() {
    const { className, buttonClassName, colorMember, toggleItems, altTextMember, valueMember, displayTextMember, imageNameMember, imageNameSuffix, externalSelectedItems, separated, column, splitMenuItemsMember, selectMenuItem, onChange, onDelete, expand } = this.props;

    const stringifiedExternalSelectedItems = externalSelectedItems ? externalSelectedItems.map((item) => `${item}`) : null;

    return (
      <div className={
        'pt-button-group' +
        ( separated ? ' pt-vertical pt-align-left' : '' ) +
        ( className ? ' ' + className : '' ) +
        ( expand ? (' pt-fill') : '' )
      }>
        { toggleItems.map((item) =>
          <button
            key={ `toggle-${item[valueMember]}` }
            className={
              'pt-button' +
              ( item.disabled ? ' pt-disabled' : '') +
              ( item.selected || (stringifiedExternalSelectedItems && stringifiedExternalSelectedItems.indexOf(`${item[valueMember]}`) >= 0) ? ' pt-active' : '')
            }
            color={ colorMember ? item[colorMember] : null }
            separated={ separated }
            onClick={ () => onChange(item[valueMember].toString()) }
            splitMenu={ splitMenuItemsMember ? item[splitMenuItemsMember] : [] }
            selectMenuItem={ selectMenuItem }
            onDelete={ onDelete }
          >
            { imageNameMember ?
              <img
                src={ imageNameMember ? `/assets/${item[imageNameMember]}${imageNameSuffix}` : null  }
                alt={ altTextMember ? item[altTextMember] : item[displayTextMember] } />
              : this.props.content
            }
            { !imageNameMember &&
              item[displayTextMember]
            }
          </button>
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
