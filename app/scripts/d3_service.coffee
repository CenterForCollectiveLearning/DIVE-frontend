# Dependency injection
# http://www.ng-newsletter.com/posts/d3-on-angular.html
angular.module("d3", []).factory("d3Service", ["$document", "$window", "$q", "$rootScope",
  ($document, $window, $q, $rootScope) ->
    onScriptLoad = ->
      
      # Load client in the browser
      $rootScope.$apply ->
        d.resolve $window.d3
        return

      return
    d = $q.defer()
    d3service = d3: ->
      d.promise

    scriptTag = $document[0].createElement("script")
    scriptTag.type = "text/javascript"
    scriptTag.async = true
    scriptTag.src = "http://d3js.org/d3.v3.min.js"
    scriptTag.onreadystatechange = ->
      onScriptLoad()  if @readyState is "complete"
      return

    scriptTag.onload = onScriptLoad
    s = $document[0].getElementsByTagName("body")[0]
    s.appendChild scriptTag
    return d3service
])