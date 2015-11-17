import React, { Component, PropTypes } from 'react';
import styles from './SelectGrid.sass';

import SelectGridElement from './SelectGridElement.js';

export default class SelectGrid extends Component {
  constructor(props) {
    super(props);

    
    
    this.state = {
      selected: 0,
      selectStates: {
        NONE: 0,
        SOME: 1,
        ALL: 2
      }
    };
  }

  selectAll() {
    this.setState({ selected: (this.state.selected == this.state.selectStates.ALL ? this.state.selectStates.NONE : this.state.selectStates.ALL) });

    const selectAll = (() => this.props.onSelectAllItems(this.state.selected == this.state.selectStates.ALL));
    setTimeout(selectAll, 100);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.items.every((item) => item.selected)) {
      this.setState({ selected: this.state.selectStates.ALL });
    } else if (nextProps.items.every((item) => !item.selected)) {
      this.setState({ selected: this.state.selectStates.NONE });
    } else {        
      this.setState({ selected: this.state.selectStates.SOME });
    }
  }

  render() {
    var checkedClass = '';

    if (this.state.selected == this.state.selectStates.ALL) {
      checkedClass = styles.checked;
    } else if (this.state.selected == this.state.selectStates.SOME) {
      checkedClass = styles.checked + ' ' + styles.halfChecked;
    }

    return (
      <div className={ styles.selectGridContainer + (this.props.className ? ' ' + this.props.className : '') }>
        <div className={ styles.selectHeading } onClick={ this.selectAll.bind(this) }>
          <input type="checkbox" className={ checkedClass } checked={ this.state.selected == this.state.selectStates.ALL }/>
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
