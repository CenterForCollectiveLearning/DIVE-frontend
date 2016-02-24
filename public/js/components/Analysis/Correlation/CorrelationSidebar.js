import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchFieldPropertiesIfNeeded } from '../../../actions/FieldPropertiesActions';
import styles from '../Analysis.sass';

import AnalysisSidebar from '../AnalysisSidebar';
import SidebarGroup from '../../Base/SidebarGroup';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';
import DropDownMenu from '../../Base/DropDownMenu';

export class CorrelationSidebar extends Component {
  componentWillMount(props) {
    const { project, datasetSelector, fieldProperties, fetchFieldPropertiesIfNeeded } = this.props;

    if (project.properties.id && datasetSelector.datasetId && !fieldProperties.items.length && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { project, datasetSelector, fieldProperties, fetchFieldPropertiesIfNeeded } = nextProps;
    const datasetIdChanged = datasetSelector.datasetId != this.props.datasetSelector.datasetId;

    if (project.properties.id && datasetSelector.datasetId && (datasetIdChanged || !fieldProperties.items.length) && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId)
    }
  }

  render() {
    return (
      <AnalysisSidebar selectedTab="correlation">
        { this.props.fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Correlation Variables">
            <ToggleButtonGroup
              toggleItems={ this.props.fieldProperties.items.map((item) =>
                new Object({
                  id: item.id,
                  name: item.name
                })
              )}
              valueMember="id"
              displayTextMember="name" />
          </SidebarGroup>
        }
      </AnalysisSidebar>
    );
  }
}

CorrelationSidebar.propTypes = {
  project: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object.isRequired,
  fieldProperties: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const { project, datasetSelector, fieldProperties } = state;
  return {
    project,
    datasetSelector,
    fieldProperties
  };
}

export default connect(mapStateToProps, { fetchFieldPropertiesIfNeeded })(CorrelationSidebar);
