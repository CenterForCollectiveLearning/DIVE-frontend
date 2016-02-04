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
      'binning_type': 'procedural',
      'binning_procedure': 'freedman',
      'num_bins': 7,
      ...this.props.config
    };

    this.updateConfig = this.updateConfig.bind(this);
  }

  updateConfig(newConfig) {
    const config = { ...this.state, ...newConfig };
    this.setState(config);
    this.props.selectBinningConfig(config);
  }

  onSelectBinningType(binningType) {
    this.updateConfig({ 'binning_type': binningType });
  }

  onSelectBinningProcedure(binningProcedure) {
    this.updateConfig({ 'binning_procedure': binningProcedure });
  }

  onSelectNumBins(numBins) {
    this.updateConfig({ 'num_bins': numBins });
  }

  render() {
    const binningTypes = [
      { label: 'Procedural', value: 'procedural' },
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

    return (
      <SidebarGroup heading="Binning Configuration">
        <div className={ styles.binningConfigContainer }>
          <div className={ styles.fieldGroup + ' ' + styles.binningConfigBlock }>
            <div className={ styles.fieldGroupLabel }>Type</div>
            <ToggleButtonGroup
              buttonClassName={ styles.binningTypesToggleButton }
              toggleItems={ binningTypes }
              valueMember="value"
              displayTextMember="label"
              onChange={ this.onSelectBinningType.bind(this) } />
          </div>
          { this.state['binning_type'] == 'procedural' &&
            <div className={ styles.fieldGroup + ' ' + styles.binningConfigBlock }>
              <div className={ styles.fieldGroupLabel }>Procedure</div>
              <DropDownMenu
                className={ styles.sidebarDropdown }
                value={ this.state['binning_procedure'] }
                options={ binningProcedures }
                valueMember="value"
                displayTextMember="label"
                onChange={ this.onSelectBinningProcedure.bind(this) }/>
            </div>
          }
          { this.state['binning_type'] == 'manual' &&
            <div className={ styles.fieldGroup + ' ' + styles.binningConfigBlock }>
              <div className={ styles.fieldGroupLabel }>Number of Bins</div>
              <DropDownMenu
                className={ styles.sidebarDropdown }
                value={ this.state['num_bins'] }
                options={ numBins }
                valueMember="value"
                displayTextMember="label"
                onChange={ this.onSelectNumBins.bind(this) }/>
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
