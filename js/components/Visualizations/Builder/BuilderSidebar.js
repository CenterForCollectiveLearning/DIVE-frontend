import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import { selectBuilderVisualizationType, selectBuilderSortOrder, selectBuilderSortField } from '../../../actions/VisualizationActions';
import { fetchFieldPropertiesIfNeeded } from '../../../actions/FieldPropertiesActions';
import styles from '../Visualizations.sass';

import Sidebar from '../../Base/Sidebar';
import SidebarGroup from '../../Base/SidebarGroup';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';
import DropDownMenu from '../../Base/DropDownMenu';
import RaisedButton from '../../Base/RaisedButton';

export class BuilderSidebar extends Component {
  constructor(props) {
    super(props);

    this.onClickGallery = this.onClickGallery.bind(this);
  }

  componentWillMount() {
    const { project, datasetSelector } = this.props;
  }

  componentWillReceiveProps(nextProps) {
    const { project, datasetSelector, selectBuilderVisualizationType } = this.props;

    if (nextProps.visualization.spec.id && !nextProps.visualization.visualizationType) {
      selectBuilderVisualizationType(nextProps.visualization.spec.vizTypes[0]);
    }
  }

  onClickGallery() {
    this.props.pushState(null, `/projects/${ this.props.project.properties.id }/visualize/gallery${ this.props.gallerySelector.queryString }`);
  }

  render() {
    const { selectBuilderVisualizationType, selectBuilderSortField, selectBuilderSortOrder, filters, visualization, sortOrders } = this.props;

    var visualizationTypes = [];

    if (visualization.spec.vizTypes) {
      visualizationTypes = filters.visualizationTypes.map((filter) =>
        new Object({
          type: filter.type,
          imageName: filter.imageName,
          label: filter.label,
          disabled: visualization.spec.vizTypes.indexOf(filter.type) < 0,
          selected: filter.type == visualization.visualizationType
        })
      );
    }

    return (
      <Sidebar>
        <SidebarGroup>
          <RaisedButton label="Back to Gallery" onClick={ this.onClickGallery } fullWidth={ true }/>
        </SidebarGroup>
        { visualization.visualizationType &&
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
        { visualization.visualizationType == 'hist' &&
          <SidebarGroup heading="Sort Field">
            <ToggleButtonGroup
              toggleItems={ visualization.sortFields }
              valueMember="id"
              displayTextMember="name"
              onChange={ selectBuilderSortField } />
          </SidebarGroup>
        }
        { visualization.visualizationType == 'hist' &&
          <SidebarGroup heading="Sort Order">
            <ToggleButtonGroup
              toggleItems={ visualization.sortOrders }
              valueMember="id"
              displayTextMember="name"
              onChange={ selectBuilderSortOrder } />
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
  visualization: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { project, datasetSelector, filters, visualization, gallerySelector } = state;
  return {
    project,
    datasetSelector,
    filters,
    visualization,
    gallerySelector
  };
}

export default connect(mapStateToProps, {
  selectBuilderVisualizationType,
  selectBuilderSortOrder,
  selectBuilderSortField,
  pushState
})(BuilderSidebar);
