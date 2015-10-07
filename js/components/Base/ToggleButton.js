import React, { Component, PropTypes } from 'react';
import styles from './base.sass';

import Select from 'react-select';

export default class ToggleButton extends Component {
  constructor (props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  } 

  handleClick (event) {
    this.props.onChange(this.props.value);
  }

  render() {
    const selectedAggregationFunctionIndex = this.props.splitMenu.findIndex((menuItem, i, menuItems) =>
      menuItem.selected == true
    );

    const selectedAggregationFunction = selectedAggregationFunctionIndex >= 0 ? this.props.splitMenu[selectedAggregationFunctionIndex].value : null;

    return (
      <div className={ styles.toggleButtonContainer  + (this.props.imageName ? '' : ' ' + styles.textToggleButton + ' ' + styles.splitButton) + (this.props.isSelected ? ' ' + styles.selected : '') }>
        <div
          className={ `${ styles.toggleButton } ${ styles.raisedButton }` + (this.props.isSelected ? ' ' + styles.selected : '') }
          onClick={ this.handleClick }
          title={ this.props.altText }>
          { this.props.imageName ? 
            <img
              src={ this.props.imageName }
              alt={ this.props.altText } />
            : this.props.altText
          }
        </div>
        { this.props.splitMenu.length > 0 &&
          <div className={ styles.splitButtonSelect }>
            <Select
              value={ selectedAggregationFunction }
              options={ this.props.splitMenu }
              multi={ false }
              clearable={ false }
              searchable={ false } />
          </div>
        }
      </div>
    );
  }
}

ToggleButton.propTypes = {
  altText: PropTypes.string,
  imageName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
  splitMenu: PropTypes.array
}

ToggleButton.defaultProps = {
  altText: "",
  splitMenu: []
}
