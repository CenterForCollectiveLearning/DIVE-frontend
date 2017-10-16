import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  SELECT_FIELD_PROPERTY,
  REQUEST_FIELD_PROPERTIES,
  RECEIVE_FIELD_PROPERTIES,
  SELECT_FIELD_PROPERTY_VALUE,
  SELECT_AGGREGATION_FUNCTION,
  SELECT_TRANSFORMATION_FUNCTION,
  REQUEST_SET_FIELD_TYPE,
  RECEIVE_SET_FIELD_TYPE,
  REQUEST_SET_FIELD_IS_ID,
  RECEIVE_SET_FIELD_IS_ID,
  REQUEST_SET_FIELD_COLOR,
  RECEIVE_SET_FIELD_COLOR,
} from '../constants/ActionTypes';

import { fetch } from './api.js';

function requestFieldPropertiesDispatcher() {
  return {
    type: REQUEST_FIELD_PROPERTIES,
    requestedAt: Date.now()
  };
}

function receiveFieldPropertiesDispatcher(projectId, datasetId, json, selectedFieldPropertyNames) {

  const TRANSFORMATIONS = [
    {
      value: "linear",
      label: "x",
      selected: true
    },
    {
      value: "log",
      label: "log(x)",
      selected: false
    },
    {
      value: "square",
      label: <span>x<sup>2</sup></span>,
      selected: false
    }
  ];

  const TRANSFORMATIONS_NO_LOG = TRANSFORMATIONS.filter((t) => t.value != 'log');

  const AGGREGATIONS = [
    {
      value: "ALL_TYPES",
      label: "All Types",
      selected: true
    },
    {
      value: "AVG",
      label: "mean",
      selected: false
    },
    {
      value: "MIN",
      label: "min",
      selected: false
    },
    {
      value: "MAX",
      label: "max",
      selected: false
    }
  ];

  const allValuesMenuItem = {
    selected: true,
    value: "ALL VALUES",
    label: "All Values"
  };

  const cFieldProperties = json.fieldProperties
    .filter((property) => property.generalType == 'c')
    .map((property) =>
      new Object({
        ...property,
        selected: selectedFieldPropertyNames.indexOf(property.name) >= 0,
        values: property.uniqueValues ? [allValuesMenuItem, ...property.uniqueValues.map((value, i) =>
          new Object({
            selected: false,
            value: `${ value }`,
            label: value
          })
        )] : [allValuesMenuItem]
      })
    );

    const tFieldProperties = json.fieldProperties
      .filter((property) => property.generalType == 't')
      .map((property) =>
        new Object({
          ...property,
          selected: selectedFieldPropertyNames.indexOf(property.name) >= 0,
          aggregations: AGGREGATIONS,
          values: (property.uniqueValues && property.scale == 'ordinal') ? [allValuesMenuItem, ...property.uniqueValues.map((value, i) =>
            new Object({
              selected: false,
              value: `${ value }`,
              label: value
            })
          )] : [allValuesMenuItem]         
        })
      );


  const qFieldProperties = json.fieldProperties
    .filter((property) => property.generalType == 'q')
    .map((property) =>
      new Object({
        ...property,
        selected: selectedFieldPropertyNames.indexOf(property.name) >= 0,
        aggregations: AGGREGATIONS,
        transformations: (property.stats.min < 0) ? TRANSFORMATIONS_NO_LOG : TRANSFORMATIONS,
        values: (property.uniqueValues && property.scale == 'ordinal') ? [allValuesMenuItem, ...property.uniqueValues.map((value, i) =>
          new Object({
            selected: false,
            value: `${ value }`,
            label: value
          })
        )] : [allValuesMenuItem]
      })
    );


  return {
    type: RECEIVE_FIELD_PROPERTIES,
    projectId: projectId,
    datasetId: datasetId,
    interactionTerms: json.interactionTerms,
    fieldProperties: [ ...cFieldProperties, ...tFieldProperties, ...qFieldProperties ],
    receivedAt: Date.now()
  };
}

export function fetchFieldProperties(projectId, datasetId, selectedFieldPropertyNames) {
  return dispatch => {
    dispatch(requestFieldPropertiesDispatcher());
    return fetch(`/field_properties/v1/field_properties?project_id=${projectId}&dataset_id=${datasetId}`)
      .then(json => dispatch(receiveFieldPropertiesDispatcher(projectId, datasetId, json, selectedFieldPropertyNames)));
  };
}

function shouldFetchFieldProperties(state) {
  const fieldProperties = state.fieldProperties;
  if (fieldProperties.isFetching) {
    return false;
  }
  return true;
}

export function fetchFieldPropertiesIfNeeded(projectId, datasetId, selectedFieldPropertyNames=[]) {
  return (dispatch, getState) => {
    if (shouldFetchFieldProperties(getState())) {
      return dispatch(fetchFieldProperties(projectId, datasetId, selectedFieldPropertyNames));
    }
  };
}

// export function selectFieldProperty(selectedFieldPropertyId) {
//   return {
//     type: SELECT_FIELD_PROPERTY,
//     selectedFieldPropertyId: selectedFieldPropertyId,
//     receivedAt: Date.now()
//   }
// }

export function selectFieldPropertyValue(selectedFieldPropertyId, selectedFieldPropertyValueId) {
  return {
    type: SELECT_FIELD_PROPERTY_VALUE,
    selectedFieldPropertyId: selectedFieldPropertyId,
    selectedFieldPropertyValueId: selectedFieldPropertyValueId
  }
}

export function selectAggregationFunction(selectedFieldPropertyId, selectedFieldPropertyValueId) {
  return {
    type: SELECT_AGGREGATION_FUNCTION,
    selectedFieldPropertyId: selectedFieldPropertyId,
    selectedFieldPropertyValueId: selectedFieldPropertyValueId
  }
}

export function selectTransformationFunction(selectedFieldPropertyId, selectedFieldPropertyValueId) {
  return {
    type: SELECT_TRANSFORMATION_FUNCTION,
    selectedFieldPropertyId: selectedFieldPropertyId,
    selectedFieldPropertyValueId: selectedFieldPropertyValueId
  }
}

function requestSetFieldTypeDispatcher(projectId, fieldId, fieldType) {
  return {
    type: REQUEST_SET_FIELD_TYPE,
    fieldId: fieldId,
    fieldType: fieldType
  };
}

function receiveSetFieldTypeDispatcher(fieldProperty) {
  return {
    type: RECEIVE_SET_FIELD_TYPE,
    fieldProperty: fieldProperty
  };
}

export function setFieldType(projectId, datasetId, fieldId, fieldType) {
  const params = {
    project_id: projectId,
    dataset_id: datasetId,
    type: fieldType
  };

  return (dispatch) => {
    dispatch(requestSetFieldTypeDispatcher(projectId, datasetId, fieldId, fieldType));
    return fetch(`/datasets/v1/fields/${ fieldId }`, {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(json => dispatch(receiveSetFieldTypeDispatcher(json)));
  };
}

function requestSetFieldIsIdDispatcher(projectId, datasetId, fieldId, fieldIsId) {
  return {
    type: REQUEST_SET_FIELD_IS_ID,
    fieldId: fieldId,
    fieldIsId: fieldIsId
  };
}

function receiveSetFieldIsIdDispatcher(fieldProperty) {
  return {
    type: RECEIVE_SET_FIELD_IS_ID,
    fieldProperty: fieldProperty
  };
}

export function setFieldIsId(projectId, datasetId, fieldId, fieldIsId) {
  const params = {
    project_id: projectId,
    dataset_id: datasetId,
    isId: fieldIsId
  };

  return (dispatch) => {
    dispatch(requestSetFieldIsIdDispatcher(projectId, datasetId, fieldId, fieldIsId));
    return fetch(`/datasets/v1/fields/${ fieldId }`, {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(json => dispatch(receiveSetFieldIsIdDispatcher(json)));
  };
}

function requestSetFieldColorDispatcher(projectId, datasetId, fieldId, fieldColor) {
  return {
    type: REQUEST_SET_FIELD_COLOR,
    fieldId: fieldId,
    fieldColor: fieldColor
  };
}

function receiveSetFieldColorDispatcher(fieldProperty) {
  return {
    type: RECEIVE_SET_FIELD_COLOR,
    fieldProperty: fieldProperty
  };
}

export function setFieldColor(projectId, datasetId, fieldId, fieldColor) {
  const params = {
    project_id: projectId,
    dataset_id: datasetId,
    color: fieldColor
  };

  return (dispatch) => {
    dispatch(requestSetFieldColorDispatcher(projectId, datasetId, fieldId, fieldColor));
    return fetch(`/datasets/v1/fields/${ fieldId }`, {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(json => dispatch(receiveSetFieldColorDispatcher(json)));
  };
}
