# Dependency injection
# http://www.ng-newsletter.com/posts/d3-on-angular.html
angular.module("d3Plus", []).factory "d3PlusService", [
  "$document"
  "$window"
  "$q"
  "$rootScope"
  ($document, $window, $q, $rootScope) ->
    onScriptLoad = ->
      
      # Load client in the browser
      $rootScope.$apply ->
        d.resolve $window.d3Plus
        return

      return
    d = $q.defer()
    d3service = d3Plus: ->
      d.promise

    scriptTag = $document[0].createElement("script")
    scriptTag.type = "text/javascript"
    scriptTag.async = true
    scriptTag.src = "https://raw.githubusercontent.com/alexandersimoes/d3plus/master/d3plus.js" # TODO Ultimately don't hotlink this...obviously
    scriptTag.onreadystatechange = ->
      onScriptLoad()  if @readyState is "complete"
      return

    scriptTag.onload = onScriptLoad
    s = $document[0].getElementsByTagName("body")[0]
    s.appendChild scriptTag
    return d3service
]