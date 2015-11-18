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
    const { selected, selectStates } = this.state;

    this.setState({ selected: (selected == selectStates.ALL ? selectStates.NONE : selectStates.ALL) });
    this.props.onSelectAllItems(selected != selectStates.ALL);
  }

  componentWillReceiveProps(nextProps) {
    const { selectStates } = this.state;

    if (nextProps.items.every((item) => item.selected)) {
      this.setState({ selected: selectStates.ALL });
    } else if (nextProps.items.every((item) => !item.selected)) {
      this.setState({ selected: selectStates.NONE });
    } else {        
      this.setState({ selected: selectStates.SOME });
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
        { this.props.onSelectAllItems &&
          <div className={ styles.selectHeading } onClick={ this.selectAll.bind(this) }>
            <input type="checkbox" className={ checkedClass } checked={ this.state.selected == this.state.selectStates.ALL }/>
            <label>{ this.props.heading }</label>
          </div>
        }
        <div className={ styles.selectGrid }>
          { this.props.items.map((item) =>
            <SelectGridElement
              key={ `select-grid-element-${ item.id }` }
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
