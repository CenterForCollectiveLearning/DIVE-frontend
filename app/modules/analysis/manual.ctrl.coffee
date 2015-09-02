angular.module('diveApp.analysis').controller('ManualCtrl', ($scope, $rootScope, DataService, PropertiesService, StatisticsDataService, pIDRetrieved) ->

  # UI Parameters
  @OPERATORS = [
    title: 'Add'
    value: '+'
  ,
    title: 'Subtract'
    value: '-'
  ,
    title: 'Multiply'
    value: '*'
  ,
    title: 'Divide'
    value: '/'
  ,
    title: 'Compose'
    value: 'compose'
  ,
    title: 'Raised to:'
    value: 'power'
  ,
    title: 'Base log Argument'
    value:'log'
  ]

  @MODES = [
    title: 'Regression'
  ,
    title:'Comparison'
  ]

  @MODELS = [
    title: 'Linear Regression'
    value: 'lr'
  ,
    title: 'Discrete Regression'
    value: 'dr'
  ,
    title: 'Polynomial Regression'
    value: 'pr'
  ,
    title: 'General Regression'
    value: 'gr'
  ]

  @ESTIMATORS = [
    title: 'Ordinary Least Squares'
    value: 'ols'
  ,
    title: 'Weighted Least Squares',
    value: 'wls',
  ,
    title: 'Generalized Least Squares',
    value: 'gls'
  ]

  @BOOLEAN = [
    title: 'Yes'
    value: true
  ,
    title: 'No',
    value: false
  ]


  @selectedDataset = null
  @indep=[]
  @selectedParams =
    dID: ''
    model: 'lr'
    arguments:
      estimator: @ESTIMATORS[0].value,
      userInput: {}
      compare:
        dataLabels:[],
        independent:true

    funDict: {x:{array:[]}, sin:{array:[]}, cos:{array:[]}, tan:{array:[]}, arcsin:{array:[]}, arccos:{array:[]}, arctan:{array:[]}, totalEquation:{array:[]}}

  @numIndepLabels=[0]
  @unprocessedDataLabels = []
  @checkNonNull = (list) ->
    bool=false
    for i in list
      if i != null && i != undefined
        bool = true

    return bool

  @checkNoNulls = (list)->
    bool=true
    for i in list
      if i==null || i==undefined
        bool = false

    return bool

  @addIndepLabel = () ->
    @numIndepLabels.push(@numIndepLabels.length)

  @removeIndepLabel = () ->
    theLabel = @numIndepLabels.pop()
    @indep[theLabel]=null
    @onSelectIndep()
    @refreshStatistics()

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
  @getNonNullLabels = (list) ->
    theList=[]
    for i in list
      if i != null && i != undefined
        theList.push(i.label)

    return theList

  @onSelectIndep = () ->
    @selectedParams.arguments.indep=@getNonNullLabels(@indep)
    @refreshStatistics()

  @onSelectDataLabel = () ->
    for i in [0..@unprocessedDataLabels.length-1]
      if @unprocessedDataLabels[i]!= null && @unprocessedDataLabels[i]!= undefined
        @selectedParams.arguments.compare.dataLabels[i]=@unprocessedDataLabels[i].label

      else
        @selectedParams.arguments.compare.dataLabels[i]=null

    if @checkNoNulls(@selectedParams.arguments.compare.dataLabels)
      @refreshStatistics()

  @onSelectDep = () ->
    if @dep
      @selectedParams.arguments.dep = @dep.label
      if !@checkNonNull(@indep)
        @selectedParams.arguments.indep=[]
        for property in @properties
          if property.label != @dep.label
            @selectedParams.arguments.indep.push(property.label)

        @refreshStatistics()

      else
        @refreshStatistics()

  @refreshStatistics = () ->
    if @mode == 'Comparison'
      @selectedParams.model=null
      _params =
        spec: @selectedParams

      StatisticsDataService.getStatisticsData(_params).then((data) =>
        @statsData = data['stats_data']
        @formatCompareDict()
      )

    else if @selectedParams['model']!=undefined && @selectedParams['model']!=null && @mode = "Regression"
      _params =
        spec: @selectedParams

      _timeparams =
        numInputs: @selectedParams.arguments.indep.length,
        sizeArray:@size,
        funcArraySize:1

      if @selectedParams.arguments.indep.length>0 && @dep
        StatisticsDataService.getRegressionTime(_timeparams).then((data) =>
          console.log("Got stats time", data)
          @timeTest = data
          if @timeTest > 3
            @sigLoadTime=true
        )

        date=new Date()
        time=date.getTime()

        StatisticsDataService.getStatisticsData(_params).then((data) =>
          date=new Date()
          console.log('time it took for test',(date.getTime()-time)/1000.0)
          console.log("Got stats data", data)
          @statsData = data['stats_data']
          param = data['params']
          if param.arguments.indep.toString()==@selectedParams.arguments.indep.toString() && @selectedParams.arguments.model!=null
            @formatTableDict()

          @sigLoadTime=false
        )

      else
        @formattedDataDict=null

  @getAttributes = (type = {}) ->
    if @properties
      _attr = @properties.slice()

    return _attr

  @datasetsLoaded = false
  @propertiesLoaded = false

  @retrieveProperties = () ->
    PropertiesService.getAttributes({ pID: $rootScope.pID, dID: @selectedDataset.dID }).then((properties) =>
      @propertiesLoaded = true
      @properties = properties
      @size = properties[0].stats.count
      console.log("Retrieved properties")
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

  @formattedData
  @formattedDataDict
  @formattedCompareDict

  #separates statsData by the different keys (considers only std and regression coefficient)
  @separateStatDataByKeys = ()->
      indexi = Number.MAX_SAFE_INTEGER
      htmlDict = {'r-squared':[]}
      length = Object.keys(@statsData).length-1

      for key in @statsData['keys']
          htmlDict[key]={}
          htmlDict[key]['regCoeff']=[]
          htmlDict[key]['std']=[]

      for i in [0..@statsData['list'].length-1]
        key=@statsData['list'][i]
        iter=@statsData['sizeList'][i]
        htmlDict['r-squared'].push(@statsData[key]['rsquared'])
        for j in key.split('\'')
          if !(j==', ') && !(j=='(') && !(j==')') && !(j==',)')  && !(j=='') && !(j=='(u') && !(j==', u')
            htmlDict[j]['regCoeff'][i]=@statsData[key]['params']['x'+String(iter)]
            htmlDict[j]['std'][i]=@statsData[key]['std']['x'+String(iter)]
            iter=iter-1

      @formattedData = htmlDict

#formats the separated data such that it could be implemented by the datatable
  @formatStatData = () ->
    data = []

    for key in @statsData['keys']
      block1 = [key]
      block2 = [key]

      for i in @formattedData[key]['regCoeff']
        if i == undefined
          block1.push("")

        else
          block1.push(i)

      for i in @formattedData[key]['std']
        if i == undefined
          block2.push("")

        else
          block2.push(i)

      data.push(block1)
      data.push(block2)

    block3 = ['R-SQUARED']
    for i in @formattedData['r-squared']
      block3.push(i)

    data.push(block3)
    return data


#creates a dicitionary of all of the information datatable requires to make a regression table
  @formatTableDict = () ->
    @separateStatDataByKeys()
    data = {}
    data['data']=@formatStatData()
    headers = ['VARIABLES']
    for i in [1..@formattedData[@statsData['keys'][0]]['regCoeff'].length]
      headers.push('('+String(i)+')')

    data['headers']=headers
    mergecells = []
    for i in [0..@statsData['keys'].length-1]
      mergecells.push({row: 2*i, col: 0, rowspan: 2, colspan:1})

    data['mergecells']=mergecells
    @formattedDataDict = data
    return true

#creates a dictionary of all of the information datable requires to make a table of some statistical results
  @formatCompareDict = () ->
    data={}
    theData = []
    for i in Object.keys(@statsData)
      block=[i]
      for j in @statsData[i]
        block.push(j)

      theData.push(block)

    data['data']=theData
    data['headers']=['STAT TEST', 'TEST STATISTIC', 'P VALUE']
    @formattedCompareDict = data
    return true
  @
)
