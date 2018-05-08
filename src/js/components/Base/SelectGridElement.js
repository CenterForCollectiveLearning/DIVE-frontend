import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './SelectGrid.sass';

export default class SelectGridElement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: this.props.selected || false
    };
  }

  selectItem() {
    this.setState({ selected: !this.state.selected });
    const selectItem = (() => this.props.onSelectItem(this.props.id, this.state.selected));
    setTimeout(selectItem, 100);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected != this.state.selected) {
      this.setState({ selected: nextProps.selected });
    }
  }

  render() {
    const { label, className } = this.props;
    const { selected } = this.state;
    return (
      <div title={ label } onClick={ this.selectItem.bind(this) } className={ styles.selectGridElement + (className ? ' ' + className : '') }>
        <input type="checkbox" className={ selected ? styles.checked : '' } checked={ selected } />
        <label>{ label }</label>
      </div>
    );
  }
}

SelectGridElement.propTypes = {
  className: PropTypes.string,
  id: PropTypes.any,
  label: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  highlighted: PropTypes.bool,
  onSelectItem: PropTypes.func,
  onHighlightItem: PropTypes.func
}
