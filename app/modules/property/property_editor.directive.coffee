d3 = require('d3')

angular.module('diveApp.property').directive("ontologyEditor", ["$window", "$timeout", "PropertyService"
  ($window, $timeout, PropertyService) ->
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
          cellHeight = 35
          cellWidth = 200
          margins =
            left: 20
          boxMargins =
            x: 20
            y: 20 + 36
          attributesYOffset = 80
          
          selection_made = false

          renderTimeout = $timeout( ->
            # Arrowhead marker definition
            defs = svg.append("defs")

            defs.append("marker").attr("id", "arrowhead")
              .attr("refX", 8).attr("refY", 4)
              .attr("markerWidth", 8).attr("markerHeight", 8)
              .attr("orient", "auto").append("path").attr("d", "M 0,0 L 8,4 L 0,8 Q 4,4 0,0 Z ")
              # .attr("fill", "transparent").attr("stroke", "black").attr("stroke-width", 1)
            defs.append("marker").attr("id", "circlehead")
              .attr("refX", 2).attr("refY", 2)
              .attr("markerWidth", 4).attr("markerHeight", 4)
              .attr("orient", "auto").append("circle")
              .attr("cx", 2).attr("cy", 2).attr("r", 2)
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
            
            hierarchyLibrary = {}
            calculateHierarchies = () ->
              for datasetPair, columnPairs of hierarchies
                datasets = datasetPair.split("\t")
                for columnPair, rel of columnPairs
                  columns = columnPair.split("\t")
                  hierarchyLibrary[[datasets.join(), columns.join()].join()] = rel
            
            links = []
            link_types = ["11", "1N", "N1"]
            overlapLibrary = {}
            calculateLinks = () ->
              links = []
              linkValues = []
              OVERLAP_THRESHOLD = 0.25
              # Reshape overlaps into pairs of (dID, columnID)
              for datasetPair, columnPairs of overlaps
                datasets = datasetPair.split("\t")
                for columnPair, overlap of columnPairs
                  columns = columnPair.split("\t")

                  key = [datasets.join(),columns.join()].join()
                  overlapLibrary[key] = overlap

                  # if overlap > OVERLAP_THRESHOLD
                  links.push key

            drawLinks = (dID) ->

              calculatePath = (link) ->
                [l_dID, r_dID, l_col, r_col] = link.split(",")
                link_type = hierarchyLibrary[link]

                if link_type == "1N"
                  attrA_pos = attributePositions[l_dID][l_col]
                  attrB_pos = attributePositions[r_dID][r_col]
                else
                  attrA_pos = attributePositions[r_dID][r_col]
                  attrB_pos = attributePositions[l_dID][l_col]

                if attrA_pos and attrB_pos
                  a_box_x = attrA_pos.left[0]
                  b_box_x = attrB_pos.left[0]
                  
                  if l_dID != r_dID
                    if a_box_x > b_box_x
                      finalA_pos = attrA_pos.left
                      finalB_pos = attrB_pos.right
                    else
                      finalA_pos = attrA_pos.right
                      finalB_pos = attrB_pos.left

                    "M" + finalA_pos[0] + "," + finalA_pos[1] + "L" + finalB_pos[0] + "," + finalB_pos[1]
                  else
                    svg_w = parseInt(svg.style("width").split("px")[0])

                    if a_box_x > svg_w / 2
                      finalA_pos = attrA_pos.right
                      finalB_pos = attrB_pos.right
                      ctrl_pt = [finalA_pos[0] + Math.abs(finalA_pos[1] - finalB_pos[1]), (finalA_pos[1] + finalB_pos[1])/2]
                    else
                      finalA_pos = attrA_pos.left
                      finalB_pos = attrB_pos.left
                      ctrl_pt = [finalA_pos[0] - Math.abs(finalA_pos[1] - finalB_pos[1]), (finalA_pos[1] + finalB_pos[1])/2]

                    "M" + finalA_pos[0] + " " + finalA_pos[1] + "Q" + ctrl_pt[0] + " " + ctrl_pt[1] + "," + finalB_pos[0] + " " + finalB_pos[1]
                else
                  "M0,0"

              console.log "Links: ", links.length
              if (!dID)
                line_g = svg.selectAll("g.arrow-container").data(links)
                enter_g = line_g.enter()
                  .append("g").attr("class", "arrow-container")
                  .on("mouseenter", (p) ->                    
                    hoverEle(this)                    
                    
                    if !selection_made
                      [l_dID, r_dID, l_col, r_col] = p.split(",")
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
                        overlap: overlapLibrary[p]
                        hierarchy: hierarchyLibrary[p]
                      scope.$apply()
                  )
                  .on("mouseleave", dehoverAllEle)
                  .on("click", (p, i) ->
                    if d3.event.defaultPrevented
                      return
                    deselectAllEle()
                    selectEle(this)

                    [l_dID, r_dID, l_col, r_col] = p.split(",")

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
                      # overlap: overlapLibrary[p] or overlapLibrary[[r_dID, l_dID, r_col, l_col].join()] or 0
                      overlap: overlapLibrary[p]
                      hierarchy: hierarchyLibrary[p]
                    scope.$apply()
                  )
                  .on("dblclick", (p, i) ->
                    deselectAllEle()
                    dehoverAllEle()
                    delete hierarchyLibrary[p]
                    links.splice(i, 1)
                    d3.select(this).remove()
                  )
                  .on("contextmenu", showLinkMenu)                
                enter_g.append("path").attr("class", "visible-arrow")
                  .attr("marker-end", (d) -> if hierarchyLibrary[d] != "11" then "url(#arrowhead)" else "url(#circlehead)")
                  .attr("marker-start", "url(#circlehead)")
                  .attr("d", (d) -> calculatePath(d))
                  .attr("fill", "transparent")
                  .attr("stroke", "black").attr("stroke-width", 1)

                enter_g.append("path").attr("class", "hover-arrow")
                  .attr("d", (d) -> calculatePath(d))
                  .attr("shape-rendering", "crispEdges")
                  .attr("stroke-width", 15)
                  .attr("stroke", "white")
                  .style("opacity", 0)
                  
              else
                d3.selectAll(".arrow-container").filter((d, i) -> dID in d.split(","))
                  .selectAll("path")
                  .attr("d", (d) -> calculatePath(d))
                  .attr("marker-end", (d) -> if hierarchyLibrary[d] != "11" then "url(#arrowhead)" else "url(#circlehead)")

            showLinkMenu = (p, i) ->
              link = this
              [l_dID, r_dID, l_col, r_col] = p.split(",")
              l_x = attributePositions[l_dID][l_col].left[0]
              r_x = attributePositions[r_dID][r_col].left[0]

              organizeMenu = () ->

                svg.select("#link_menu").selectAll("g.link_type")
                  .selectAll("text").text((d, i) ->
                    if d == "11"
                      "1 - 1"
                    else if d == "1N"
                      if l_x < r_x then "1 -> N" else "N <- 1"
                    else if d == "N1"
                      if l_x < r_x then "N <- 1" else "1 -> N"
                    else
                      "??"
                  )
                option = svg.select("#link_menu").selectAll("g.link_type").filter((d, i) -> d == hierarchyLibrary[p])
                  .on("click", (d, i) ->
                    svg.select("#link_menu").selectAll("g.link_type").filter((d, i) -> d != hierarchyLibrary[p])
                      .attr("transform", (d, i) -> "translate(0," + (i+1) * cellHeight + ")")
                    svg.select("#link_menu").selectAll("g.link_type")
                      .on("click", (d, i) ->
                        hierarchyLibrary[p] = d
                        svg.select("#link_menu").selectAll("g.link_type").attr("transform", "translate(0, 0)")
                        drawLinks(p.split(",")[0])
                        organizeMenu()
                      )
                  )

                option = option[0][0]
                deselectAllEle()
                selectEle(option)
                selectEle(link)
                option.parentNode.appendChild(option)

              m = d3.mouse(this)              
              el = svg.select("#link_menu").attr("display", "")
                .attr("transform", "translate(" + (m[0] - (cellWidth/2) + 10) + "," + (m[1] - 10) + ")")              
              el = el[0][0]
              el.parentNode.appendChild(el)
              organizeMenu()

            buildMenus = () ->
              # data menu
              for p in data
                menu = svg.append("g").attr("class", "menu")
                  .attr("id", "menu_" + p.dID)
                  .attr("display", "none")
                  .on("mouseleave", () ->
                    d3.select(this).attr("display", "none")
                  )
                menu.append("rect")
                  .attr("width", cellWidth).attr("height", cellHeight)
                  .attr("x", 0).attr("y", 0)
                  .attr("rx", 3).attr("ry", 3)
                  .attr("fill", "#FFFFFF")
                  .style("stroke", "#AEAEAE").style("stroke-width", 1)
              # link menu
              link_menu = svg.append("g").attr("id", "link_menu")
                .attr("display", "none")
                # .attr("transform", "translate(100, 100)")
                .on("mouseleave", () -> 
                  deselectAllEle()
                  d3.select(this).attr("display", "none")
                  d3.select(this).selectAll("g.link_type").attr("transform", "translate(0,0)")
                )

              link_menu.append("rect")
                .attr("x", 0).attr("y", 0).attr("rx", 3).attr("ry", 3)
                .attr("width", boxWidth * 2/3).attr("height", link_types.length * cellHeight)
                .style("opacity", 0)

              link_option = link_menu.selectAll("g.link_type").data(link_types).enter()
                .append("g").attr("class", "link_type")
                .attr("transform", "translate(0, 0)")
                # .attr("transform", (d, i) -> "translate(0," + i * cellHeight + ")")
                .on("mouseenter", () -> hoverEle(this))
                .on("mouseleave", dehoverAllEle)

              link_option.append("rect").attr("width", cellWidth / 2).attr("height", cellHeight)
                .attr("x", 0).attr("y", 0).attr("rx", 3).attr("ry", 3)
                .attr("fill", "#FFFFFF").style("stroke", "#AEAEAE").style("stroke-width", 1)

              link_option.append("text")
                .attr("x", 10).attr("y", 22).attr("fill", "#000000")
                .attr("font-size", 14).attr("font-weight", "light")
                # .text((d) -> d)

            addToMenu = (p, dID, g_attr) ->
              
              column_id = p.column_id
              menu = svg.select("g#menu_"+ dID)
              offset = menu.selectAll("g.menu_attr")[0].length

              option = menu.append("g").attr("class", "menu_attr")
                .attr("transform", "translate(0," + (cellHeight * offset) + ")")
                .on("mouseenter", () -> 
                  hoverEle(this)
                  if !selection_made
                    scope.selected =
                      type: 'attribute'
                      columnType: p.type
                      unique: uniques[dID][column_id]
                      columnStats: stats[dID][p.name]
                    scope.$apply()
                )
                .on("mouseleave", dehoverAllEle)
                .on("click", () ->
                  # min_y = null
                  min_y = cellHeight * d3.select("#box_" + dID).selectAll("g.attr")[0].length
                  d3.select("#box_" + dID).selectAll("g.attr").filter((d, i) ->
                    d.column_id > column_id
                  )
                  .attr("transform", (d, i) ->
                    [x, y] = extractTransform(d3.select(this).attr("transform"))
                    min_y = Math.min(min_y, y)
                    "translate(" + x + "," + (y + cellHeight) + ")"
                  )
                  d3.select(g_attr).attr("transform", "translate(0," + min_y + ")")
                  d3.select("#box_" + dID).select(".attributes")[0][0].appendChild(g_attr)

                  [x, y] = extractTransform(d3.select(this).attr("transform"))

                  d3.select("#menu_" + dID).selectAll(".menu_attr").attr("transform", () -> 
                    [dx, dy] = extractTransform(d3.select(this).attr("transform"))
                    if dy > y
                      "translate(0," + (dy - cellHeight) + ")"
                    else
                      "translate(0," + dy + ")"
                  )
                  calculateAttributePositions(dID)
                  drawLinks(dID)
                  d3.select(this).remove()
                )

              option.append("rect").attr("width", cellWidth).attr("height", cellHeight)
                .attr("x", 0).attr("y", 0).attr("rx", 3).attr("ry", 3)
                .attr("fill", "#FFFFFF").attr("stroke", "#AEAEAE")
                .style("stroke-width", 1)

              option.append("text")
                .attr("x", 10).attr("y", 22).attr("fill", "#000000")
                .attr("font-size", 14).attr("font-weight", "light")
                .text(() ->
                  unique = if uniques[dID][column_id] then "*" else ""
                  p.name + unique + " (" + p.type + ")"
                )

            showMenu = (dID, m) ->
              el = svg.select("g.menu#menu_" + dID).attr("display", "")
                .attr("transform", "translate(" + (m[0] - 10) + "," + (m[1] - 10) + ")")[0][0]
              el.parentNode.appendChild(el)

            selectEle = (g) ->
              d3.select(g).selectAll("path.visible-arrow,rect").classed("selected", true)
              selection_made = true
            
            deselectAllEle = () ->
              svg.selectAll(".selected").classed("selected", false)
              selection_made = false
              scope.selected = null
              scope.$apply()

            hoverEle = (g) ->
              dehoverAllEle()
              d3.select(g).selectAll("path.visible-arrow,rect").classed("hover", true)

            dehoverAllEle = () ->
              svg.selectAll(".hover").classed("hover", false)
              if (!selection_made)
                scope.selected = null
                scope.$apply()

            saveOntology = () ->
              ontologies = {}
              svg.select(".save").select("text").text("Saving...")
              
              el = svg.select(".cover")[0][0]
              el.parentNode.appendChild(el)

              for link in links
                dist = overlapLibrary[link]
                hier = hierarchyLibrary[link]
                ontologies[link] = [dist, hier]

              PropertyService.updateProperties(ontologies, (data) -> 
                setTimeout( () ->
                  svg.select(".save").select("text").text("Save Ontologies")
                  el = svg.select(".cover")[0][0]
                  el.parentNode.insertBefore(el, el.parentNode.firstChild)
                , 200)
              )

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
                m = d3.mouse(svg[0][0])
                path_str = d3.select("#temp_link").attr("d").split("L")[0] + "L" + m[0] + "," + m[1]
                d3.select("#temp_link").attr("d", path_str)
              )
              .on("dragend", (d) ->
                link_data = d3.select("#temp_link").datum()
                
                start = d3.select("#temp_link").attr("d").split("M")[1].split("L")[0].split(",").map (j) -> parseInt(j)

                dst = d3.selectAll("g.attr").filter((d, i) ->
                  m = d3.mouse(this)
                  (m[0] > 0) and (m[1] > 0) and (m[0] < cellWidth) and (m[1] < cellHeight)
                )

                if dst[0].length > 0
                  dID2 = d3.select(dst[0][0].parentNode).datum().dID
                  column_id2 = dst.datum().column_id

                  dID = link_data[0][0]
                  column_id = link_data[0][1]

                  if dID != dID2 or (dID == dID2 and column_id != column_id2)
                    key = [dID, dID2, column_id, column_id2].join()
                    key2 = [dID2, dID, column_id2, column_id].join()
                    overlap = if overlapLibrary[key] then overlapLibrary[key] else 0
                    overlapLibrary[key] = overlapLibrary[key] or overlapLibrary[key2] or 0
                    hierarchyLibrary[key] = "1N"
                    links.push key
                    drawLinks()
                
                d3.select("#temp_link").remove()
              )

            # d3.select("body").on("keydown", () ->
            #   if d3.event.keyCode == 68
            #     svg.selectAll(".arrow-container").remove()
            #     alert "redrawing all links!"
            #     drawLinks()
            #   else if d3.event.keyCode == 83
            #     saveOntology()
            # )

            svg.append("rect")
              .attr("class", "cover")
              .attr("width", "100%")
              .attr("height", "100%")
              .style("opacity", 0)
              .on("click", () ->
                deselectAllEle()
                svg.selectAll("#link_menu,.menu").attr("display", "none")
              )
            svg.on("contextmenu", () ->
              d3.event.preventDefault()
            )

            g = svg.selectAll("g.box")
              .data(data)
              .enter()
              .append("g")
              .attr("class", "box")
              .attr("id", (d) -> "box_" + d.dID)
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
              .on("mouseenter", (p) ->
                hoverEle(this)
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
              .on("mouseleave", dehoverAllEle)
              .on("click", (p) ->               
                if (d3.event.defaultPrevented)
                  return
                deselectAllEle()
                selectEle(this)

                d = d3.select(@parentNode).datum()
                scope.selected =
                  type: 'object'
                  title: d.title
                  filetype: d.filetype
                  rows: d.rows
                  cols: d.cols
                scope.$apply()
              )
              .on("contextmenu", (p, i) ->
                m = d3.mouse(svg[0][0])
                showMenu(p.dID, d3.mouse(svg[0][0]))
              )

            title_g.append("rect")
              .attr("height", attributesYOffset)
              .attr("width", cellWidth)
              .attr("x", 0).attr("y", 0)
              .attr("rx", 3).attr("ry", 3)
              .attr("stroke", "#AEAEAE")
              .attr("stroke-width", 1)
              .attr("fill", "#FFFFFF")
              # .style("fill-opacity", 0)
            title_g.append("text")
              .attr("fill", "#000000")
              .attr("x", cellWidth/2)
              .attr("y", 30)
              .attr("text-anchor", "middle")
              .attr("class", "title")
              .text((d) -> d.title)
            # Attributes
            # TODO Unpack this
            tspan = g.append("g")
              .attr("transform", (d, i) -> "translate(0," + attributesYOffset + ")")
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
                  .attr("transform", (d, i) -> "translate(0," + (i * cellHeight) + ")")
                  .call(dragLink)
                  .on("mouseenter", (p) ->
                    hoverEle(this)
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
                  .on("mouseleave", dehoverAllEle)
                  .on("click", (p) ->
                    if d3.event.defaultPrevented
                      return
                    deselectAllEle()
                    selectEle(this)
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
                  .on("dblclick", (p) ->
                    d3.event.preventDefault()
                    [x, y] = extractTransform(d3.select(this).attr("transform"))
                    d3.select(this.parentNode).selectAll(".attr").attr("transform", () ->
                      [dx, dy] = extractTransform(d3.select(this).attr("transform"))
                      if (dy > y)
                        "translate(" + dx + ", " + (dy - cellHeight) + ")"
                      else
                        "translate(" + dx + "," + dy + ")"
                    )
                    dID = d3.select(@parentNode).datum().dID
                    column_id = '' + d3.select(this).datum().column_id
                    ind = []
                    selection = d3.selectAll("g.arrow-container").filter((d, i) ->
                      key = d.split(",")
                      if (dID == key[0] and column_id == key[2]) or (dID == key[1] and column_id == key[3])
                        ind.push i
                        true
                      else
                        false
                    ).remove()
                    ind.reverse()
                    for i in ind
                      links.splice(i, 1)

                    calculateAttributePositions(dID)
                    drawLinks(dID)
                    deselectAllEle()
                    dehoverAllEle()
                    g_attr = d3.select(this).remove()
                    addToMenu(p, dID, g_attr[0][0])
                  )

                texts.append("rect")
                  .attr("height", cellHeight)
                  .attr("width", cellWidth)
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
            calculateHierarchies()
            calculateLinks()
            # console.log links, linkValues

            calculateAttributePositions()
            # # console.log attributePositions
            drawLinks()
            buildMenus()

            save_g = svg.append("g").attr("class", "save")
              .attr("transform", () ->
                svg_w = parseInt(svg.style("width").split("px")[0])
                "translate(" + (svg_w - 250)/2 + ", 0)"
              )
              .on("mouseenter", () -> hoverEle(this))
              .on("mouseleave", dehoverAllEle)
              .on("click", () -> saveOntology())
            save_g.append("rect").attr("width", 250).attr("height", 36)
            save_g.append("text").attr("text-anchor", "middle")
              .attr("x", 250/2).attr("y", 23).text("Save Ontologies")

          , 200)
    )
])