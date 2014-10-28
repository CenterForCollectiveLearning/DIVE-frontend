# engineApp.directive('maxheight',
#   ($window) ->
#     return (
#       restrict: 'A'
#       link: (scope, elem, attrs) ->
#         elem.css('height', $(window).height() - $('header').outerHeight())
#       )
# )