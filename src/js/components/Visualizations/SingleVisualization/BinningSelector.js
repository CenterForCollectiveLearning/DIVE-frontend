import React, { Component, PropTypes } from 'react';

import styles from '../Visualizations.sass';
import _ from 'underscore';

import SidebarGroup from '../../Base/SidebarGroup';
import DropDownMenu from '../../Base/DropDownMenu';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';

export default class BinningSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      binning_type: 'auto',
      binning_procedure: 'freedman',
      num_bins: 7,
      ...this.props.config.data
    };
  }

  updateConfig = (k, v) => {
    var newStateModifier = {};
    newStateModifier[k] = v;
    this.setState(newStateModifier);
    this.props.selectBinningConfig(k, v);
  }

  render() {
    const binningTypes = [
      { label: 'Auto', value: 'auto' },
      { label: 'Manual', value: 'manual' }
    ].map((binningType) =>
      new Object({ ...binningType, selected: binningType.value == this.state['binning_type'] })
    );

    const numBins = _.range(1, 26).map((num) =>
      new Object({
        label: `${ num }`,
        value: num,
        selected: num == this.state['num_bins']
      })
    );

    const binningProcedures = [
      { label: 'Freedman', value: 'freedman' },
      { label: 'Square Root', value: 'square_root' },
      { label: 'Doane', value: 'doane' },
      { label: 'Rice', value: 'rice' },
      { label: 'Sturges', value: 'sturges' }
    ].map((binningProcedure) =>
      new Object({ ...binningProcedure, selected: binningProcedure.value == this.state['binning_procedure'] })
    );

    const headerName = this.props.name ? "Binning of " + this.props.name : "Binning Configuration"

    return (
      <SidebarGroup heading={headerName}>
        <div className={ styles.binningConfigContainer }>
          <div className={ styles.fieldGroup + ' ' + styles.binningConfigBlock }>
            <div className={ styles.fieldGroupLabel }>Type</div>
            <ToggleButtonGroup
              buttonClassName={ styles.binningTypesToggleButton }
              toggleItems={ binningTypes }
              valueMember="value"
              displayTextMember="label"
              onChange={ (v) => this.updateConfig('binning_type', v) } />
          </div>
          { this.state['binning_type'] == 'auto' &&
            <div className={ styles.fieldGroup + ' ' + styles.binningConfigBlock }>
              <div className={ styles.fieldGroupLabel }>Procedure</div>
              <DropDownMenu
                className={ styles.sidebarDropdown }
                value={ this.state['binning_procedure'] }
                options={ binningProcedures }
                valueMember="value"
                displayTextMember="label"
                onChange={ (v) => this.updateConfig('binning_procedure', v) }/>
            </div>
          }
          { this.state['binning_type'] == 'manual' &&
            <div className={ styles.fieldGroup + ' ' + styles.binningConfigBlock }>
              <div className={ styles.fieldGroupLabel }>Bin Count</div>
              <DropDownMenu
                className={ styles.sidebarDropdown }
                value={ this.state['num_bins'] }
                options={ numBins }
                valueMember="value"
                displayTextMember="label"
                onChange={ (v) => this.updateConfig('num_bins', v) }/>
            </div>
          }
        </div>
      </SidebarGroup>
    );
  }
}

BinningSelector.propTypes = {
  config: PropTypes.object.isRequired,
  selectBinningConfig: PropTypes.func
};
