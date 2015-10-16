import React, { Component, PropTypes } from 'react';

import ToggleButton from './ToggleButton';
import styles from './ToggleButtonGroup.sass';

export default class ToggleButtonGroup extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(item) {
    this.props.onChange(item);
  }

  render() {
    return (
      <div className={ styles.toggleButtonGroup }>
        { this.props.toggleItems.map((item) =>
          <ToggleButton
            key={ item[this.props.valueMember] }
            altText={ item[this.props.displayTextMember] }
            imageName={ this.props.imageNameMember ? `/assets/${item[this.props.imageNameMember]}${this.props.imageNameSuffix}` : null }
            onChange={ this.handleClick }
            isSelected={ item.selected }
            splitMenu={ item.splitMenu ? item.splitMenu : [] }
            selectMenuItem={ this.props.selectMenuItem }
            value={ item[this.props.valueMember].toString() } />
        )}
      </div>
    );
  }
}

ToggleButtonGroup.propTypes = {
  toggleItems: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  valueMember: PropTypes.string.isRequired,
  displayTextMember: PropTypes.string.isRequired,
  imageNameMember: PropTypes.string,
  imageNameSuffix: PropTypes.string,
  selectMenuItem: PropTypes.func
};
