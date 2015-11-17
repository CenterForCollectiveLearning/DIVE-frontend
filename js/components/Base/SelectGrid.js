import React, { Component, PropTypes } from 'react';
import styles from './SelectGrid.sass';

import SelectGridElement from './SelectGridElement.js';

export default class SelectGrid extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      selectedAll: false
    }
  }

  selectAll() {
    this.setState({ selectedAll: !this.state.selectedAll });

    const selectAll = (() => this.props.onSelectAllItems(this.state.selectedAll));
    setTimeout(selectAll, 100);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.items.every((item) => item.selected) != this.state.selectedAll) {
      this.setState({ selectedAll: !this.state.selectedAll });
    }
  }

  render() {
    return (
      <div className={ styles.selectGridContainer + (this.props.className ? ' ' + this.props.className : '') }>
        <div className={ styles.selectHeading } onClick={ this.selectAll.bind(this) }>
          <input type="checkbox" className={ this.state.selectedAll ? styles.checked : '' } checked={ this.state.selectedAll }/>
          <label>{ this.props.heading }</label>
        </div>
        <div className={ styles.selectGrid }>
          { this.props.items.map((item) =>
            <SelectGridElement
              id={ item.id }
              label={ item.name }
              selected={ item.selected }
              highlighted={ item.highlighted }
              onSelectItem={ this.props.onSelectItem }/>
          )}
        </div>
      </div>
    );
  }
}

SelectGrid.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array.isRequired,
  onSelectItem: PropTypes.func,
  onSelectAllItems: PropTypes.func,
  onHighlightItem: PropTypes.func
}
