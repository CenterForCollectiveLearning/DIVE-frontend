angular.module('diveApp.analysis').controller('ManualCtrl', ($scope, $rootScope, DataService, PropertiesService, StatisticsDataService, pIDRetrieved) ->

  # UI Parameters
  @MODELS = [
      title: 'Linear Regression'
      value: 'lr'
    ,
      title: 'Discrete Regression'
      value: 'dr'
  ]

  @ESTIMATORS = [
      title: 'Ordinary Least Squares'
      value: 'ols'
  ]

  @selectedDataset = null

  @selectedParams =
    dID: ''
    model: @MODELS[0].value
    arguments: 
      estimator: @ESTIMATORS[0].value

  @onSelectDataset = (d) ->
    @setDataset(d)
    return

  @setDataset = (d) ->
    @selectedDataset = d
    @selectedParams.dID = d.dID

    @retrieveProperties()
    return

  @onSelectModel = () ->
    @refreshStatistics()

  @onSelectEstimator = () ->
    @refreshStatistics()

  @onSelectIndep = () ->
    if @indep
      @selectedParams.arguments.indep = @indep.label
    @refreshStatistics()

  @onSelectDep = () ->
    if @dep
      @selectedParams.arguments.dep = @dep.label
    @refreshStatistics()

  @refreshStatistics = () ->
    if @selectedParams['model']
      _params =
        spec: @selectedParams

      StatisticsDataService.getStatisticsData(_params).then((data) =>
        console.log("Got stats data", data.stats_data)
        @statsData = data.stats_data
      )

  @getAttributes = (type = {}) ->
    if @properties
      _attr = @properties.slice()

    return _attr

  @datasetsLoaded = false
  @propertiesLoaded = false

  @retrieveProperties = () ->
    PropertiesService.getProperties({ pID: $rootScope.pID, dID: @selectedDataset.dID }).then((properties) =>
      @propertiesLoaded = true
      @properties = properties
    )
    return

  pIDRetrieved.promise.then((r) =>
    DataService.getDatasets().then((datasets) =>
      @datasetsLoaded = true
      @datasets = datasets
      @setDataset(datasets[0])
      console.log("Datasets loaded!", @datasets)
    )
  )

  @
)
