import React, { Component, PropTypes } from 'react';
import styles from './base.sass';

export default class ToggleButton extends Component {
  constructor (props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  } 

  handleClick (event) {
    this.props.onChange(this.props.value);
  }

  render() {
    return (
      <div
        className={ `${ styles.toggleButton } ${ styles.raisedButton }` + (this.props.isSelected ? ' ' + styles.selected : '') }
        onClick={ this.handleClick }>
        { this.props.imageName &&
          <img
            src={ this.props.imageName }
            alt={ this.props.altText } />
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
  value: PropTypes.string.isRequired
}
