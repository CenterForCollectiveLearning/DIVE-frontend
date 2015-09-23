import React, { Component, PropTypes } from 'react';

import ToggleButton from './ToggleButton';
import styles from './base.sass';

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
      <div className={styles.toggleButtonGroup}>
        { this.props.toggleItems.map((item) =>
          <ToggleButton
            altText={ item[this.props.displayTextMember] }
            imageName={ `../../../assets/${item[this.props.imageNameMember]}${this.props.imageNameSuffix}` }
            onChange={ this.handleClick }
            isSelected={ item.selected }
            value={ item[this.props.valueMember] } />
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
  imageNameSuffix: PropTypes.string
};
