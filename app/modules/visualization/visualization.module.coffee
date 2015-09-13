angular = require('angular')
_ = require('underscore')

angular.module('diveApp.visualization', [ 'diveApp.services' ])

angular.module('diveApp.visualization').filter('trust', ($sce) ->
  return (val) ->
    return $sce.trustAsHtml(val)
)

angular.module('diveApp.visualization').filter('constructionToSentence', ->
  (construction) ->
    _formatted_terms = _.map(construction, (term, i) ->
      type = term.type
      termString = term.string
      if i is 0
        termString = termString.charAt(0).toUpperCase() + termString.slice(1)
      return "<span class='term-type-#{type}'>#{termString}</span>"
    )
    sentence = _formatted_terms.join(' ') + '.'
    return sentence
)

require('./builder.ctrl')
require('./gallery.ctrl')
require('./visualization.ctrl')
require('./visualizations.ctrl')

require('./visualizationplot.directive')
require('../base/datatable.directive')
