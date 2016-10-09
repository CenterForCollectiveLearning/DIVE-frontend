import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchFieldPropertiesIfNeeded } from '../../../actions/FieldPropertiesActions';
import { selectBinningConfigX, selectBinningConfigY, selectSegmentationIndependentVariable, selectSegmentationVariable, selectSegmentationFunction, selectSegmentationWeightVariable, selectConditional } from '../../../actions/SegmentationActions';
import styles from '../Analysis.sass';

import ConditionalSelector from '../../Base/ConditionalSelector';
import Sidebar from '../../Base/Sidebar';
import SidebarGroup from '../../Base/SidebarGroup';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';
import DropDownMenu from '../../Base/DropDownMenu';
import BinningSelector from '../../Visualizations/SingleVisualization/BinningSelector';

export class SegmentationSidebar extends Component {
  componentWillMount(props) {
    const { project, datasetSelector, fieldProperties, fetchFieldPropertiesIfNeeded } = this.props;

    if (project.id && datasetSelector.datasetId && !fieldProperties.items.length && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.id, datasetSelector.datasetId)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { project, datasetSelector, fieldProperties, fetchFieldPropertiesIfNeeded } = nextProps;
    const datasetIdChanged = datasetSelector.datasetId != this.props.datasetSelector.datasetId;

    if (project.id && datasetSelector.datasetId && (datasetIdChanged || !fieldProperties.loaded) && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.id, datasetSelector.datasetId)
    }
  }

  render() {
    const { fieldProperties, segmentationSelector, selectSegmentationIndependentVariable, selectBinningConfigX, selectBinningConfigY, conditionals, selectConditional } = this.props;
    const { segmentationVariablesIds, segmentationVariableId } = segmentationSelector;

    const nonSegmentationVariables = fieldProperties.items.filter((item) => segmentationVariablesIds.indexOf(item.id) < 0)
    const segmentationOptions = [{'id': 'count', 'name' : 'count'}, ...nonSegmentationVariables.filter((item) => item.generalType == 'q')]
    const numSegmentationVariables = fieldProperties.items.filter((item) => item.generalType == 'q' && segmentationVariablesIds.indexOf(item.id) >= 0 )
    const n_q = numSegmentationVariables.length;

    return (
      <Sidebar>
        { this.props.fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Segmentation Variables">
            { fieldProperties.items.filter((property) => property.generalType == 'c').length > 0 &&
              <div className={ styles.fieldGroup }>
                <div className={ styles.fieldGroupLabel }>Categorical</div>
                <ToggleButtonGroup
                  toggleItems={ fieldProperties.items.filter((property) => property.generalType == 'c').map((item) =>
                    new Object({
                      id: item.id,
                      name: item.name,
                      disabled: (item.id == segmentationVariableId) || item.isId,
                      color: item.color
                    })
                  )}
                  displayTextMember="name"
                  valueMember="id"
                  colorMember="color"
                  externalSelectedItems={ segmentationVariablesIds }
                  separated={ true }
                  onChange={ selectSegmentationIndependentVariable } />
              </div>
            }
            { fieldProperties.items.filter((property) => property.generalType == 't').length > 0 &&
              <div className={ styles.fieldGroup }>
                <div className={ styles.fieldGroupLabel }>Temporal</div>
                <ToggleButtonGroup
                  toggleItems={ fieldProperties.items.filter((property) => property.generalType == 't').map((item) =>
                    new Object({
                      id: item.id,
                      name: item.name,
                      disabled: (item.id == segmentationVariableId),
                      color: item.color
                    })
                  )}
                  valueMember="id"
                  colorMember="color"
                  displayTextMember="name"
                  externalSelectedItems={ segmentationVariablesIds }
                  separated={ true }
                  onChange={ selectSegmentationIndependentVariable } />
              </div>
            }
            { fieldProperties.items.filter((property) => property.generalType == 'q').length > 0 &&
              <div className={ styles.fieldGroup }>
                <div className={ styles.fieldGroupLabel }>Quantitative</div>
                <ToggleButtonGroup
                  toggleItems={ fieldProperties.items.filter((property) => property.generalType == 'q').map((item) =>
                    new Object({
                      id: item.id,
                      name: item.name,
                      disabled: (item.id == segmentationVariableId) || item.isId,
                      color: item.color
                    })
                  )}
                  valueMember="id"
                  colorMember="color"
                  displayTextMember="name"
                  externalSelectedItems={ segmentationVariablesIds }
                  separated={ true }
                  onChange={ selectSegmentationIndependentVariable } />
              </div>
            }
          </SidebarGroup>
        }
        { this.props.fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Aggregate on">
            <DropDownMenu
              value={ this.props.segmentationSelector.segmentationVariableId }
              options= {segmentationOptions}
              valueMember="id"
              displayTextMember="name"
              onChange={ this.props.selectSegmentationVariable }/>
          </SidebarGroup>
        }
        { this.props.segmentationSelector.segmentationVariableId != 'count' &&
          <SidebarGroup heading="By">
            <DropDownMenu
              value={ this.props.segmentationSelector.segmentationFunction}
              options={ [{ 'id':'SUM', 'name':'sum' }, { 'id':'MEAN', 'name':'mean' }] }
              valueMember="id"
              displayTextMember="name"
              onChange={ this.props.selectSegmentationFunction }/>
          </SidebarGroup>
        }
        { this.props.segmentationSelector.segmentationFunction == 'MEAN' && this.props.segmentationSelector.segmentationVariableId != 'count' &&
          <SidebarGroup heading="Weighted by:">
            <DropDownMenu
              value={ this.props.segmentationSelector.weightVariableId}
              options={ [{ 'id':'UNIFORM', 'name':'uniform' }, ...this.props.fieldProperties.items.filter((item) => item.generalType == 'q')] }
              valueMember="id"
              displayTextMember="name"
              onChange={ this.props.selectSegmentationWeightVariable }/>
          </SidebarGroup>
        }
        { n_q >= 1 &&
          <BinningSelector
            config={ this.props.segmentationSelector.binningConfigX }
            selectBinningConfig={ selectBinningConfigX }
            name={ numSegmentationVariables[0].name }/>
        }
        { n_q == 2 &&
          <BinningSelector
            config={ this.props.segmentationSelector.binningConfigY }
            selectBinningConfig={ selectBinningConfigY }
            name={ numSegmentationVariables[1].name }/>
        }
        { fieldProperties.items.length != 0 && conditionals.items.length != 0 &&
          <SidebarGroup heading="Filter by field">
            { conditionals.items.map((conditional, i) =>
              <div key={ `conditional-selector-${ i }` }>
                <ConditionalSelector
                  fieldId={ conditional.fieldId }
                  combinator={ conditional.combinator }
                  operator={ conditional.operator }
                  value={ conditional.value }
                  conditionalIndex={ i }
                  fieldProperties={ fieldProperties.items }
                  selectConditionalValue={ selectConditional }/>
              </div>
            )}
          </SidebarGroup>
        }
      </Sidebar>
    );
  }
}

SegmentationSidebar.propTypes = {
  project: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object.isRequired,
  fieldProperties: PropTypes.object.isRequired,
  segmentationSelector: PropTypes.object.isRequired,
  conditionals: PropTypes.object
};

function mapStateToProps(state) {
  const { project, conditionals, datasetSelector, fieldProperties, segmentationSelector } = state;
  return {
    project,
    datasetSelector,
    fieldProperties,
    segmentationSelector,
    conditionals
  };
}

export default connect(mapStateToProps, { fetchFieldPropertiesIfNeeded, selectBinningConfigX, selectBinningConfigY, selectSegmentationIndependentVariable, selectSegmentationVariable, selectSegmentationFunction, selectSegmentationWeightVariable, selectConditional })(SegmentationSidebar);
