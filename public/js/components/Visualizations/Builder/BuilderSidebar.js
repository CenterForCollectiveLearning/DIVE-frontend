import _ from 'underscore';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import { selectBuilderVisualizationType, selectBuilderSortOrder, selectBuilderSortField, selectVisualizationConditional, selectVisualizationConfig } from '../../../actions/VisualizationActions';
import { fetchFieldPropertiesIfNeeded } from '../../../actions/FieldPropertiesActions';
import styles from '../Visualizations.sass';

import Sidebar from '../../Base/Sidebar';
import SidebarGroup from '../../Base/SidebarGroup';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';
import DropDownMenu from '../../Base/DropDownMenu';
import RaisedButton from '../../Base/RaisedButton';

import ConditionalSelector from './ConditionalSelector';
import BinningSelector from './BinningSelector';

export class BuilderSidebar extends Component {

  componentWillMount() {
    const { project, datasetSelector, fieldProperties, fetchFieldPropertiesIfNeeded } = this.props;
    if (project.properties.id && datasetSelector.datasetId && !fieldProperties.items.length && !fieldProperties.isFetching) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId);
    }
  }

  componentDidUpdate(previousProps) {
    const { project, visualization, datasetSelector, fieldProperties, selectBuilderVisualizationType, fetchFieldPropertiesIfNeeded } = this.props;

    if (visualization.spec.id && !visualization.visualizationType) {
      selectBuilderVisualizationType(visualization.spec.vizTypes[0]);
    }

    if (project.properties.id && !fieldProperties.isFetching && fieldProperties.items.length == 0) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId);
    }
  }

  render() {
    const { fieldProperties, selectBuilderVisualizationType, selectBuilderSortField, selectBuilderSortOrder, selectVisualizationConditional, selectVisualizationConfig, filters, visualization } = this.props;

    if (!visualization.lastUpdated) {
      return (<div></div>);
    }

    const visualizationTypes = filters.visualizationTypes.filter((visualizationType) =>
      (visualization.spec.vizTypes.indexOf(visualizationType.type) > -1)
    ).map((visualizationType) =>
      new Object({ ...visualizationType, selected: visualizationType.type == visualization.visualizationType })
    );

    return (
      <Sidebar>
        { visualization.visualizationType && visualizationTypes.length > 1 &&
          <SidebarGroup heading="Visualization type">
            <ToggleButtonGroup
              toggleItems={ visualizationTypes }
              displayTextMember="label"
              valueMember="type"
              imageNameMember="imageName"
              imageNameSuffix=".chart.svg"
              onChange={ selectBuilderVisualizationType } />
          </SidebarGroup>
        }
        { (visualization.visualizationType == 'bar') &&
          <SidebarGroup heading="Sort by">
            <div className={ styles.sortGroup }>
              <ToggleButtonGroup
                className={ styles.sortFields }
                toggleItems={ visualization.sortFields }
                valueMember="id"
                displayTextMember="name"
                onChange={ selectBuilderSortField } />
              <ToggleButtonGroup
                className={ styles.sortOrder }
                toggleItems={ visualization.sortOrders.map((sortOrder) => new Object({...sortOrder, icon: <i className={ sortOrder.iconName }></i> })) }
                valueMember="id"
                displayTextMember="icon"
                altTextMember="name"
                onChange={ selectBuilderSortOrder } />
            </div>
          </SidebarGroup>
        }
        { visualization.visualizationType == 'hist' &&
          <BinningSelector
            config={ visualization.spec.config }
            selectBinningConfig={ selectVisualizationConfig } />
        }
        { visualization.visualizationType &&
          <SidebarGroup heading="Filter by field">
            { visualization.conditionals.map((conditional, i) =>
              <div key={ `conditional-selector-${ i }` }>
                <ConditionalSelector
                  conditionalIndex={ i }
                  fieldProperties={ fieldProperties.items }
                  selectConditionalValue={ selectVisualizationConditional }/>
              </div>
            )}
          </SidebarGroup>
        }
      </Sidebar>
    );
  }
}

BuilderSidebar.propTypes = {
  project: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  visualization: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const { project, datasetSelector, filters, visualization, fieldProperties } = state;
  return {
    project,
    datasetSelector,
    filters,
    visualization,
    fieldProperties
  };
}

export default connect(mapStateToProps, {
  selectBuilderVisualizationType,
  selectBuilderSortOrder,
  selectBuilderSortField,
  fetchFieldPropertiesIfNeeded,
  selectVisualizationConditional,
  selectVisualizationConfig,
  pushState
})(BuilderSidebar);
