d3 = require('d3')

angular.module('diveApp.property').directive("ontologyEditor", ["$window", "$timeout",
  ($window, $timeout) ->
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
          boxHeight = 500
          margins =
            left: 20
          boxMargins =
            x: 20
            y: 20
          attributesYOffset = 80
          
          selection_made = false

          renderTimeout = $timeout( ->
            # Arrowhead marker definition
            defs = svg.append("defs")

            defs.append("marker").attr("id", "arrowhead")
              .attr("refX", 3).attr("refY", 2)
              .attr("markerWidth", 6).attr("markerHeight", 4)
              .attr("orient", "auto").append("path").attr("d", "M 0,0 V 4 L3,3 Z")
            defs.append("marker").attr("id", "circlehead")
              .attr("refX", 5).attr("refY", 5)
              .attr("markerWidth", 10).attr("markerHeight", 10)
              .attr("orient", "auto").append("circle")
              .attr("cx", 5).attr("cy", 5).attr("r", 2)
              .style("fill", "black")

            # Attribute overlap color scale
            colorScale = d3.scale.category10()
            colorScale.domain(Object.keys(overlaps))
            dIDToDataset = {}
            for dataset in data
              dIDToDataset[dataset.dID] = dataset
            # Create parent group elements for each dataset
            extractTransform = (str) ->
              split = str.split(',')
              x = split[0].split('(')[1]
              y = split[1].split(')')[0]
              [parseInt(x), parseInt(y)]

            attributePositions = {}
            calculateAttributePositions = (dID) ->
              calcPos = (selection) ->
                selection.each( (d, i) ->
                  dID = d3.select(@parentNode).datum().dID
                  column_id = d.column_id

                  bbox = d3.select(this).node().getBBox()
                  h = bbox.height
                  w = bbox.width

                  box_t = d3.transform(d3.select(this.parentNode.parentNode).attr("transform")).translate
                  col_t = d3.transform(d3.select(this.parentNode).attr("transform")).translate
                  attr_t = d3.transform(d3.select(this).attr("transform")).translate
                  overall_t = [
                    box_t[0] + col_t[0] + attr_t[0],
                    box_t[1] + col_t[1] + attr_t[1]
                  ]

                  attributePositions[dID] = {} unless dID of attributePositions
                  attributePositions[dID][column_id] = {
                    left: [overall_t[0], overall_t[1] + h/2 ]
                    right: [overall_t[0] + w, overall_t[1] + h/2 ]
                  }

                )
              if (!dID)
                attributePositions = {}
                calcPos(d3.selectAll("g.attr"))
              else
                attributePositions[dID] = {}
                calcPos(d3.select("#box_" + dID).selectAll("g.attr"))
            
            # links = []
            # linkValues = []
            # link_overlaps = {}
            links = []
            calculateLinks = () ->
              links = []
              linkValues = []
              OVERLAP_THRESHOLD = 0.25
              # Reshape overlaps into pairs of (dID, columnID)
              for datasetPair, columnPairs of overlaps
                datasets = datasetPair.split("\t")
                for columnPair, overlap of columnPairs
                  columns = columnPair.split("\t")

                  if overlap > OVERLAP_THRESHOLD
                    ind = links.length
                    links.push [
                      [datasets[0], columns[0]]
                      [datasets[1], columns[1]]
                      overlap
                    ]

            drawLinks = (dID) ->

              calculatePath = (link) ->
                [l_dID, l_col] = link[0]
                [r_dID, r_col] = link[1]
                attrA_pos = attributePositions[l_dID][l_col]
                attrB_pos = attributePositions[r_dID][r_col]

                if attrA_pos and attrB_pos
                  l_box_x = extractTransform(d3.select("#box_" + l_dID).attr("transform"))[0]
                  r_box_x = extractTransform(d3.select("#box_" + r_dID).attr("transform"))[0]

                  if l_box_x > r_box_x
                    finalA_pos = attrA_pos.left
                    finalB_pos = attrB_pos.right
                  else
                    finalA_pos = attrA_pos.right
                    finalB_pos = attrB_pos.left

                  "M" + finalA_pos[0] + "," + finalA_pos[1] + "L" + finalB_pos[0] + "," + finalB_pos[1]
                else
                  "M0,0"

              if (!dID)
                line_g = svg.selectAll("g.arrow-container").data(links)
                console.log links
                enter_g = line_g.enter()
                  .append("g").attr("class", "arrow-container")

                enter_g.append("path").attr("class", "visible-arrow")
                  .attr("marker-end", "url(#circlehead)")
                  .attr("marker-start", "url(#circlehead)")
                  .attr("d", (d) -> calculatePath(d))
                  .attr("stroke", "black").attr("stroke-width", 1)

                enter_g.append("path").attr("class", "hover-arrow")
                  .attr("d", (d) -> calculatePath(d))
                  .attr("shape-rendering", "crispEdges")
                  .attr("stroke-width", 15)
                  .attr("stroke", "white")
                  .style("opacity", 0)
                  .on("mousemove", (p) ->                    
                    d3.select(@parentNode).select("path.visible-arrow").classed("hover", true)
                    
                    if !selection_made
                      [l_dID, l_col] = p[0]
                      [r_dID, r_col] = p[1]
                      l_dTitle = dIDToDataset[l_dID].title
                      r_dTitle = dIDToDataset[r_dID].title
                      l_cTitle = dIDToDataset[l_dID].column_attrs[l_col]?.name
                      r_cTitle = dIDToDataset[r_dID].column_attrs[r_col]?.name

                      scope.selected =
                        type: 'relationship'
                        l_dTitle: l_dTitle
                        r_dTitle: r_dTitle
                        l_cTitle: l_cTitle
                        r_cTitle: r_cTitle
                        overlap: p[2]
                      scope.$apply()
                  )
                  .on("mouseout", (p) ->
                    d3.select(@parentNode).select("path.visible-arrow").classed("hover", false)
                    if !selection_made
                      scope.selected = null
                      scope.$apply()
                  )
                  .on("click", (p, i) ->
                    if d3.event.defaultPrevented
                      return
                    d3.selectAll(".selected").classed("selected", false)
                    d3.select(@parentNode).select("path.visible-arrow").classed("selected", true)
                    selection_made = true
                    [l_dID, l_col] = p[0]
                    [r_dID, r_col] = p[1]
                    l_dTitle = dIDToDataset[l_dID].title
                    r_dTitle = dIDToDataset[r_dID].title
                    l_cTitle = dIDToDataset[l_dID].column_attrs[l_col]?.name
                    r_cTitle = dIDToDataset[r_dID].column_attrs[r_col]?.name

                    scope.selected =
                      type: 'relationship'
                      l_dTitle: l_dTitle
                      r_dTitle: r_dTitle
                      l_cTitle: l_cTitle
                      r_cTitle: r_cTitle
                      overlap: p[2]
                    scope.$apply()
                  )
                  .on("dblclick", (p, i) ->
                    d3.select(@parentNode).select("path.visible-arrow").classed("selected", false)
                    selection_made = false
                    links.splice(i, 1)
                    d3.select(@parentNode).remove()
                  )

              else
                d3.selectAll(".arrow-container").filter((d, i) -> dID in d.map (j) -> j[0])
                  .selectAll("path")
                  .attr("d", (d) -> calculatePath(d))

            dragDataset = d3.behavior.drag()
              .on("dragstart", (d) ->
                d3.event.sourceEvent.stopPropagation()

                el = d3.select(this.parentNode)[0][0]
                el.parentNode.appendChild(el)
                d.dragstart = d3.mouse(this)
                svg_w = parseInt(svg.style("width").split("px")[0])
                svg_h = parseInt(svg.style("height").split("px")[0])
                d.dragmax = [svg_w - boxMargins.x, svg_h - boxMargins.y]
              )
              .on("drag", (d) ->
                m = d3.mouse(this)
                [x, y] = extractTransform(d3.select(this.parentNode).attr("transform"))                
                x += m[0] - d.dragstart[0]
                y += m[1] - d.dragstart[1]
                x = Math.min(Math.max(boxMargins.x, x), d.dragmax[0])
                y = Math.min(Math.max(boxMargins.y, y), d.dragmax[1])
                d3.select(this.parentNode).attr("transform", "translate(" + x + ", " + y + ")")
                dID = d3.select(this.parentNode).attr("id").split("_")[1]
                calculateAttributePositions(dID)
                drawLinks(dID)
                # console.log attributePositions
              )
              .on("dragend", (d) ->
                el = d3.select(this.parentNode)[0][0]
                child = d3.select(this.parentNode.parentNode).select(".arrow-container")[0][0]
                el.parentNode.insertBefore(el, child)
              )

            dragLink = d3.behavior.drag()
              .on("dragstart", (d) ->
                d3.event.sourceEvent.stopPropagation()
                dID = d3.select(@parentNode).datum().dID
                column_id = d3.select(this).datum().column_id
                m = d3.mouse(svg[0][0])
                temp_arrow = svg.append("path").datum([[dID, column_id], null])
                  .attr("id", "temp_link")
                  .attr("marker-end", "url(#arrowhead)")
                  .attr("d", "M" + m[0] + "," + m[1])
                  .attr("stroke", "black")
                  .attr("stroke-width", 2)
              )
              .on("drag", (d) ->
                # console.log d3.mouse(svg[0][0])
                m = d3.mouse(svg[0][0])
                path_str = d3.select("#temp_link").attr("d").split("L")[0] + "L" + m[0] + "," + m[1]
                d3.select("#temp_link").attr("d", path_str)
              )
              .on("dragend", (d) ->
                link_data = d3.select("#temp_link").datum()
                
                start = d3.select("#temp_link").attr("d").split("M")[1].split("L")[0].split(",").map (j) -> parseInt(j)

                dst = d3.selectAll("g.attr").filter((d, i) ->
                  m = d3.mouse(this)
                  (m[0] > 0) and (m[1] > 0) and (m[0] < boxWidth) and (m[1] < 35)
                )

                if dst[0].length > 0
                  dID = d3.select(dst[0][0].parentNode).datum().dID
                  column_id = dst.datum().column_id

                  dID2 = link_data[0][0]
                  column_id2 = link_data[0][1]

                  if (dID != dID2)

                    link_data[1] = [dID, column_id]
                    link_data.push 0

                    ## more efficient search?
                    for datasetPair, columnPairs of overlaps
                      datasets = datasetPair.split("\t")
                      if (dID == datasets[0] and dID2 == datasets[1]) or (dID == datasets[1] and dID2 == datasets[0]) 
                        for columnPair, overlap of columnPairs
                          columns = columnPair.split("\t").map (j) -> parseInt(j)
                          if (column_id == columns[0] and column_id2 == columns[1]) or (column_id == columns[1] and column_id2 == columns[0])
                            link_data[2] = overlap
                            break
                        break                    
                    links.push(link_data)
                    drawLinks()
                
                d3.select("#temp_link").remove()
              )

            # d3.select("body").on("keydown", () ->
            #   if d3.event.keyCode == 68
            #     svg.selectAll(".arrow-container").remove()
            #     alert "draw now!"
            #     drawLinks()
            # )

            svg.append("rect")
              .attr("width", "100%")
              .attr("height", "100%")
              .style("opacity", 0)
              .on("click", () -> 
                svg.selectAll(".selected").classed("selected", false)
                selection_made = false
                scope.selected = null
                scope.$apply()
              )

            g = svg.selectAll("g")
              .data(data)
              .enter()
              .append("g")
              .attr("class", "box")
              .attr("id", (d) -> "box_" + d.dID)
              # .attr("transform", "translate(" + boxMargins.x + "," + boxMargins.y + ")")
              .attr("transform", (d, i) ->
                x = boxMargins.x + i * (boxWidth + margins.left)
                y = boxMargins.y
                "translate(" + x + ", " + y + ")"
              )
            
            # Title #
            title_g = g.append("g")
              .attr("class", "title")
              .attr("transform", "translate(0, 0)")
              .call(dragDataset)
              .on("mousemove", (p) ->
                d3.select(this).selectAll("rect").classed("hover", true)
                if !selection_made
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
                d3.select(this).selectAll("rect").classed("hover", false)
                if !selection_made
                  scope.selected = null
                  scope.$apply()
              )
              .on("click", (p) ->
                if (d3.event.defaultPrevented)
                  return
                d3.selectAll(".selected").classed("selected", false)
                d3.select(this).selectAll("rect").classed("selected", true)
                selection_made = true
                d = d3.select(@parentNode).datum()
                scope.selected =
                  type: 'object'
                  title: d.title
                  filetype: d.filetype
                  rows: d.rows
                  cols: d.cols
                scope.$apply()
              )
            title_g.append("rect")
              .attr("height", attributesYOffset)
              .attr("width", boxWidth)
              .attr("x", 0).attr("y", 0)
              .attr("rx", 3).attr("ry", 3)
              .attr("stroke", "#AEAEAE")
              .attr("stroke-width", 1)
              .attr("fill", "#FFFFFF")
              # .style("fill-opacity", 0)
            title_g.append("text")
              .attr("fill", "#000000")
              .attr("x", boxWidth/2)
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
                "translate(" + 0 + "," + y + ")"
              )
              .attr("class", "attributes")
              .each((d) ->
                dID = d.dID
                unique_cols = uniques[dID]
                texts = d3.select(this)
                  .selectAll("g text")
                  .data(d.column_attrs)
                  .enter()
                  .append("g")
                  .attr("class", "attr")
                  .attr("id", (d, i) -> "attr_" + dID + "_" + i)
                  .attr("transform", (d, i) -> "translate(0," + (i * 35) + ")")
                  .call(dragLink)
                  .on("mousemove", (p) ->
                    d3.select(this).selectAll('rect').classed("hover", true)
                    if !selection_made
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
                    if !selection_made
                      scope.selected = null
                      scope.$apply()
                  )
                  .on("click", (p) ->
                    if d3.event.defaultPrevented
                      return
                    selection_made = true
                    d3.selectAll(".selected").classed("selected", false)
                    d3.select(this).selectAll("rect").classed("selected", true)
                    dID = d3.select(@parentNode).datum().dID
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
                    # d3.select(this)
                    #   .append("g")
                    #   .text("test")
                    #   .classed("expanded", true)
                  )
                texts.append("rect")
                  .attr("height", 35)
                  .attr("width", boxWidth)
                  # .attr("fill-opacity", 0.0)
                  .attr("stroke", "#AEAEAE")
                  .attr("stroke-width", 1)
                  .attr("fill", "#FFFFFF")
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

            calculateLinks()
            # console.log links, linkValues

            calculateAttributePositions()
            # console.log attributePositions

            drawLinks()

          , 200)
    )
])