engineApp.directive("ontologyEditor", ["$window", "$timeout", "d3Service",
  ($window, $timeout, d3Service) ->
    return (
      restrict: "EA"
      scope:
        data: "="
        overlaps: "="
        hierarchies: "="
        uniques: "="
        stats: "="
        label: "@"
        onClick: "&"
        selected: '='
      link: (scope, ele, attrs) ->
        d3Service.d3().then (d3) ->
          margin = parseInt(attrs.margin) or 20
          barHeight = parseInt(attrs.barHeight) or 20
          barPadding = parseInt(attrs.barPadding) or 5
          svg = d3.select(ele[0]).append("svg").style("width", "100%").style("height", "100%")
          $window.onresize = ->
            scope.$apply()
            return

          scope.$watch (->
            angular.element($window)[0].innerWidth
          ), ->
            scope.render(scope.data, scope.overlaps, scope.hierarchies, scope.uniques, scope.stats)

          scope.$watchCollection "[data,overlaps,hierarchies,uniques,stats]", ((newData) ->
            scope.render(newData[0], newData[1], newData[2], newData[3], newData[4])
          ), true
          scope.render = (data, overlaps, hierarchies, uniques, stats) ->
            svg.selectAll("*").remove()
            unless (data and overlaps and hierarchies and uniques and stats)
              return
            if renderTimeout
              clearTimeout(renderTimeout)

            # Margins and Positioning
            boxWidth = 200
            margins =
              left: 20
            boxMargins =
              x: 20
              y: 20
            attributesYOffset = 80

            renderTimeout = $timeout( ->
              # Arrowhead marker definition
              svg.append("defs").append("marker").attr("id", "arrowhead").attr("refX", 3).attr("refY", 2).attr("markerWidth", 6).attr("markerHeight", 4).attr("orient", "auto").append("path").attr("d", "M 0,0 V 4 L3,3 Z")

              # Attribute overlap color scale
              colorScale = d3.scale.category10()
              colorScale.domain(Object.keys(overlaps))

              dIDToDataset = {}
              for dataset in data
                dIDToDataset[dataset.dID] = dataset

              # Create parent group elements for each dataset
              g = svg.selectAll("g")
                .data(data)
              .enter()
                .append("g")
                .attr("class", "box")
                .attr("transform", "translate(" + boxMargins.x + "," + boxMargins.y + ")")

              # Box
              rect = g.append("rect")
                .attr("height", 500)
                .attr("width", boxWidth)
                .attr("x", (d, i) -> i * (boxWidth + margins.left))
                .attr("rx", 3)
                .attr("ry", 3)
                .attr("stroke", "#AEAEAE")
                .attr("stroke-width", 1)
                .attr("fill", (d) -> "#FFFFFF")
                .on("mousemove", (p) ->
                  d3.select(this).classed("hover", true)
                  d = d3.select(@parentNode).datum()
                  scope.selected =
                    type: 'object'
                    title: d.title
                    filetype: d.filetype
                    rows: d.rows
                    cols: d.cols
                  scope.$apply()
                )
                .on("mouseout", (p) ->
                  d3.select(this).classed("hover", false)
                  # scope.selected = null
                  # scope.$apply()
                )
              # Title #
              text = g.append("text")
                .attr("fill", "#000000")
                .attr("x", (d, i) -> (i * (boxWidth + margins.left)) + (boxWidth / 2))
                .attr("y", 30)
                .attr("text-anchor", "middle")
                .attr("class", "title")
                .text((d) -> d.title)

              # Attributes
              # TODO Unpack this
              tspan = g.append("g")
              .attr("transform", (d, i) ->
                x = i * (boxWidth + margins.left)
                y = attributesYOffset
                "translate(" + x + "," + y + ")"
              ).attr("class", "attributes")
              .each((d) ->
                dID = d.dID
                unique_cols = uniques[dID]
                texts = d3.select(this)
                  .selectAll("g text")
                  .data(d.column_attrs)
                .enter()
                .append("g")
                  .attr("class", "attr")
                  .attr("transform", (d, i) -> "translate(0," + (i * 35) + ")")
                .on("mousemove", (p) ->
                  d3.select(this).selectAll('rect').classed("hover", true)

                  dID = d3.select(@parentNode).datum().dID

                  d = d3.select(this).datum()
                  columnID = d.column_id
                  unique = uniques[dID][columnID]
                  columnStats = stats[dID][d.name]

                  scope.selected =
                    type: 'attribute'
                    columnType: d.type
                    unique: unique
                    columnStats: columnStats
                  scope.$apply()
                )
                .on("mouseout", (p) ->
                  d3.select(this).selectAll('rect').classed("hover", false)
                  scope.selected = null
                  scope.$apply()
                )
                .on("click", (p) ->
                  dID = d3.select(@parentNode).datum().dID

                  d3.select(this)
                    .append("g")
                    .text("test")
                    .classed("expanded", true)
                )

                texts.append("rect")
                  .attr("height", 35)
                  .attr("width", boxWidth)
                  .attr("fill-opacity", 0.0)
                  .attr("stroke", "#AEAEAE")

                texts.append("text")
                  .attr("x", 10)
                  .attr("y", 22)
                  .attr("fill", "#000000")
                  .attr("font-size", 14)
                  .attr("font-weight", "light")
                  .text((d, i) ->
                    # Add asterisk if column is unique
                    unique = (if unique_cols[i] then "*" else "")
                    d.name + unique + " (" + d.type + ")"
                  )
              )

              ##############
              # Relationships and hierarchies
              ##############
              attributePositions = {}

              extractTransform = (str) ->
                split = str.split(',')
                x = split[0].split('(')[1]
                y = split[1].split(')')[0]
                [parseInt(x), parseInt(y)]

              # Get left and right positions for each node (relative to parent)
              d3.selectAll("g.attr").each (d, i) ->
                attrName = d.name
                column_id = d.column_id
                [x, y] = extractTransform(d3.select(this).attr("transform"))
                bbox = d3.select(this).node().getBBox()
                h = bbox.height
                w = bbox.width

                # Top-level parent boxes
                parentBBox = d3.select(@parentNode.parentNode).node().getBBox()
                parentLeft = parentBBox.x
                parentTop = parentBBox.y


               # Final Positions
                finalLeftX = parentLeft + margins.left + 5
                finalLeftY = parentTop + y + boxMargins.y + attributesYOffset + (h / 2)
                finalRightX = parentLeft + margins.left + w - 5
                finalRightY = parentTop + y + boxMargins.y + attributesYOffset + (h / 2)

                dID = d3.select(@parentNode).datum().dID
                attributePositions[dID] = {} unless dID of attributePositions
                attributePositions[dID][column_id] =
                  l: [
                    finalLeftX
                    finalLeftY
                  ]
                  r: [
                    finalRightX
                    finalRightY
                  ]

                return

              links = []
              linkValues = []
              OVERLAP_THRESHOLD = 0.25

              # Reshape overlaps into pairs of (dID, columnID)
              for datasetPair, columnPairs of overlaps
                datasets = datasetPair.split("\t")
                for columnPair, overlap of columnPairs
                  columns = columnPair.split("\t")
                  if overlap > OVERLAP_THRESHOLD
                    linkValues.push(overlap)
                    links.push [
                      [datasets[0], columns[0]]
                      [datasets[1], columns[1]]
                    ]

              for link, i in links
                overlap = linkValues[i]
                [l_dID, l_col] = link[0]
                [r_dID, r_col] = link[1]
                l_dTitle = dIDToDataset[l_dID].title
                r_dTitle = dIDToDataset[r_dID].title
                l_cTitle = dIDToDataset[l_dID].column_attrs[l_col]?.name
                r_cTitle = dIDToDataset[r_dID].column_attrs[r_col]?.name

                attrPositionsA = attributePositions[l_dID][l_col]
                attrPositionsB = attributePositions[r_dID][r_col]

                if attrPositionsA and attrPositionsB
                  attrAL = attrPositionsA.l
                  attrAR = attrPositionsA.r
                  attrBL = attrPositionsB.l
                  attrBR = attrPositionsB.r
                  finalAPos = attrAR
                  finalBPos = attrBL

                  g = svg
                    .append("g")
                    .attr("class", "arrow-container")

                  visibleArrow = g.append("path")
                    .datum(link)
                    .attr("marker-end", "url(#arrowhead)")
                    .attr("d", "M" + finalAPos[0] + "," + finalAPos[1] + "L" + finalBPos[0] + "," + finalBPos[1])
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                    .attr("class", "visible-arrow")

                  hoverArrow = g.append("path")
                    .datum(
                      overlap: overlap
                      l_dTitle: l_dTitle
                      r_dTitle: r_dTitle
                      l_cTitle: l_cTitle
                      r_cTitle: r_cTitle
                    )
                    .attr("marker-end", "url(#arrowhead)")
                    .attr("d", "M" + finalAPos[0] + "," + finalAPos[1] + "L" + finalBPos[0] + "," + finalBPos[1])
                    .attr('shape-rendering', 'crispEdges')
                    .style('opacity', 0.0)
                    .attr("stroke-width", 10)
                    .attr("stroke", "white")
                    .on("mousemove", (p) ->
                      d3.select(@parentNode).select("path.visible-arrow").attr("stroke-width", 2)

                      d = d3.select(this).datum()

                      scope.selected =
                        type: 'relationship'
                        l_dTitle: p.l_dTitle
                        r_dTitle: p.r_dTitle
                        l_cTitle: p.l_cTitle
                        r_cTitle: p.r_cTitle
                        overlap: p.overlap

                      scope.$apply()
                    )
                    .on("mouseout", (p) ->
                      d3.select(@parentNode).select("path.visible-arrow").attr("stroke-width", 1)

                      scope.selected = null
                      scope.$apply()
                    )
            , 200)
    )
])