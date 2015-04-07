var d3,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

d3 = require('d3');

angular.module('diveApp.property').directive("ontologyEditor", [
  "$window", "$timeout", "PropertyService", function($window, $timeout, PropertyService) {
    return {
      restrict: "EA",
      scope: {
        data: "=",
        overlaps: "=",
        hierarchies: "=",
        uniques: "=",
        stats: "=",
        label: "@",
        onClick: "&",
        selected: '='
      },
      link: function(scope, ele, attrs) {
        var barHeight, barPadding, margin, svg;
        margin = parseInt(attrs.margin) || 20;
        barHeight = parseInt(attrs.barHeight) || 20;
        barPadding = parseInt(attrs.barPadding) || 5;
        svg = d3.select(ele[0]).append("svg").style("width", "100%").style("height", "100%");
        $window.onresize = function() {
          scope.$apply();
        };
        scope.$watch((function() {
          return angular.element($window)[0].innerWidth;
        }), function() {
          return scope.render(scope.data, scope.overlaps, scope.hierarchies, scope.uniques, scope.stats);
        });
        scope.$watchCollection("[data,overlaps,hierarchies,uniques,stats]", (function(newData) {
          return scope.render(newData[0], newData[1], newData[2], newData[3], newData[4]);
        }), true);
        return scope.render = function(data, overlaps, hierarchies, uniques, stats) {
          var attributesYOffset, boxHeight, boxMargins, boxWidth, cellHeight, cellWidth, margins, renderTimeout, selection_made;
          svg.selectAll("*").remove();
          if (!(data && overlaps && hierarchies && uniques && stats)) {
            return;
          }
          if (renderTimeout) {
            clearTimeout(renderTimeout);
          }
          boxWidth = 200;
          boxHeight = 500;
          cellHeight = 35;
          cellWidth = 200;
          margins = {
            left: 20
          };
          boxMargins = {
            x: 20,
            y: 20 + 36
          };
          attributesYOffset = 80;
          selection_made = false;
          return renderTimeout = $timeout(function() {
            var addToMenu, attributePositions, buildMenus, calculateAttributePositions, calculateHierarchies, calculateLinks, colorScale, dIDToDataset, dataset, defs, dehoverAllEle, deselectAllEle, dragDataset, dragLink, drawLinks, extractTransform, g, hierarchyLibrary, hoverEle, link_types, links, overlapLibrary, saveOntology, save_g, selectEle, showLinkMenu, showMenu, title_g, tspan, _i, _len;
            defs = svg.append("defs");
            defs.append("marker").attr("id", "arrowhead").attr("refX", 8).attr("refY", 4).attr("markerWidth", 8).attr("markerHeight", 8).attr("orient", "auto").append("path").attr("d", "M 0,0 L 8,4 L 0,8 Q 4,4 0,0 Z ");
            defs.append("marker").attr("id", "circlehead").attr("refX", 2).attr("refY", 2).attr("markerWidth", 4).attr("markerHeight", 4).attr("orient", "auto").append("circle").attr("cx", 2).attr("cy", 2).attr("r", 2).style("fill", "black");
            colorScale = d3.scale.category10();
            colorScale.domain(Object.keys(overlaps));
            dIDToDataset = {};
            for (_i = 0, _len = data.length; _i < _len; _i++) {
              dataset = data[_i];
              dIDToDataset[dataset.dID] = dataset;
            }
            extractTransform = function(str) {
              var split, x, y;
              split = str.split(',');
              x = split[0].split('(')[1];
              y = split[1].split(')')[0];
              return [parseInt(x), parseInt(y)];
            };
            attributePositions = {};
            calculateAttributePositions = function(dID) {
              var calcPos;
              calcPos = function(selection) {
                return selection.each(function(d, i) {
                  var attr_t, bbox, box_t, col_t, column_id, h, overall_t, w;
                  dID = d3.select(this.parentNode).datum().dID;
                  column_id = d.column_id;
                  bbox = d3.select(this).node().getBBox();
                  h = bbox.height;
                  w = bbox.width;
                  box_t = d3.transform(d3.select(this.parentNode.parentNode).attr("transform")).translate;
                  col_t = d3.transform(d3.select(this.parentNode).attr("transform")).translate;
                  attr_t = d3.transform(d3.select(this).attr("transform")).translate;
                  overall_t = [box_t[0] + col_t[0] + attr_t[0], box_t[1] + col_t[1] + attr_t[1]];
                  if (!(dID in attributePositions)) {
                    attributePositions[dID] = {};
                  }
                  return attributePositions[dID][column_id] = {
                    left: [overall_t[0], overall_t[1] + h / 2],
                    right: [overall_t[0] + w, overall_t[1] + h / 2]
                  };
                });
              };
              if (!dID) {
                attributePositions = {};
                return calcPos(d3.selectAll("g.attr"));
              } else {
                attributePositions[dID] = {};
                return calcPos(d3.select("#box_" + dID).selectAll("g.attr"));
              }
            };
            hierarchyLibrary = {};
            calculateHierarchies = function() {
              var columnPair, columnPairs, columns, datasetPair, datasets, rel, _results;
              _results = [];
              for (datasetPair in hierarchies) {
                columnPairs = hierarchies[datasetPair];
                datasets = datasetPair.split("\t");
                _results.push((function() {
                  var _results1;
                  _results1 = [];
                  for (columnPair in columnPairs) {
                    rel = columnPairs[columnPair];
                    columns = columnPair.split("\t");
                    _results1.push(hierarchyLibrary[[datasets.join(), columns.join()].join()] = rel);
                  }
                  return _results1;
                })());
              }
              return _results;
            };
            links = [];
            link_types = ["11", "1N", "N1"];
            overlapLibrary = {};
            calculateLinks = function() {
              var OVERLAP_THRESHOLD, columnPair, columnPairs, columns, datasetPair, datasets, key, linkValues, overlap, _results;
              links = [];
              linkValues = [];
              OVERLAP_THRESHOLD = 0.25;
              _results = [];
              for (datasetPair in overlaps) {
                columnPairs = overlaps[datasetPair];
                datasets = datasetPair.split("\t");
                _results.push((function() {
                  var _results1;
                  _results1 = [];
                  for (columnPair in columnPairs) {
                    overlap = columnPairs[columnPair];
                    columns = columnPair.split("\t");
                    key = [datasets.join(), columns.join()].join();
                    overlapLibrary[key] = overlap;
                    _results1.push(links.push(key));
                  }
                  return _results1;
                })());
              }
              return _results;
            };
            drawLinks = function(dID) {
              var calculatePath, enter_g, line_g;
              calculatePath = function(link) {
                var a_box_x, attrA_pos, attrB_pos, b_box_x, ctrl_pt, finalA_pos, finalB_pos, l_col, l_dID, link_type, r_col, r_dID, svg_w, _ref;
                _ref = link.split(","), l_dID = _ref[0], r_dID = _ref[1], l_col = _ref[2], r_col = _ref[3];
                link_type = hierarchyLibrary[link];
                try {
                  if (link_type === "N1") {
                    attrA_pos = attributePositions[l_dID][l_col];
                    attrB_pos = attributePositions[r_dID][r_col];
                  } else {
                    attrA_pos = attributePositions[r_dID][r_col];
                    attrB_pos = attributePositions[l_dID][l_col];
                  }
                } catch (_error) {}
                if (attrA_pos && attrB_pos) {
                  a_box_x = attrA_pos.left[0];
                  b_box_x = attrB_pos.left[0];
                  if (l_dID !== r_dID) {
                    if (a_box_x > b_box_x) {
                      finalA_pos = attrA_pos.left;
                      finalB_pos = attrB_pos.right;
                    } else {
                      finalA_pos = attrA_pos.right;
                      finalB_pos = attrB_pos.left;
                    }
                    return "M" + finalA_pos[0] + "," + finalA_pos[1] + "L" + finalB_pos[0] + "," + finalB_pos[1];
                  } else {
                    svg_w = parseInt(svg.style("width").split("px")[0]);
                    if (a_box_x > svg_w / 2) {
                      finalA_pos = attrA_pos.right;
                      finalB_pos = attrB_pos.right;
                      ctrl_pt = [finalA_pos[0] + Math.abs(finalA_pos[1] - finalB_pos[1]), (finalA_pos[1] + finalB_pos[1]) / 2];
                    } else {
                      finalA_pos = attrA_pos.left;
                      finalB_pos = attrB_pos.left;
                      ctrl_pt = [finalA_pos[0] - Math.abs(finalA_pos[1] - finalB_pos[1]), (finalA_pos[1] + finalB_pos[1]) / 2];
                    }
                    return "M" + finalA_pos[0] + " " + finalA_pos[1] + "Q" + ctrl_pt[0] + " " + ctrl_pt[1] + "," + finalB_pos[0] + " " + finalB_pos[1];
                  }
                } else {
                  return "M0,0";
                }
              };
              console.log("Links: ", links.length);
              if (!dID) {
                line_g = svg.selectAll("g.arrow-container").data(links);
                enter_g = line_g.enter().append("g").attr("class", "arrow-container").on("mouseenter", function(p) {
                  var l_cTitle, l_col, l_dID, l_dTitle, r_cTitle, r_col, r_dID, r_dTitle, _ref, _ref1, _ref2;
                  hoverEle(this);
                  if (!selection_made) {
                    _ref = p.split(","), l_dID = _ref[0], r_dID = _ref[1], l_col = _ref[2], r_col = _ref[3];
                    l_dTitle = dIDToDataset[l_dID].title;
                    r_dTitle = dIDToDataset[r_dID].title;
                    l_cTitle = (_ref1 = dIDToDataset[l_dID].column_attrs[l_col]) != null ? _ref1.name : void 0;
                    r_cTitle = (_ref2 = dIDToDataset[r_dID].column_attrs[r_col]) != null ? _ref2.name : void 0;
                    scope.selected = {
                      type: 'relationship',
                      l_dTitle: l_dTitle,
                      r_dTitle: r_dTitle,
                      l_cTitle: l_cTitle,
                      r_cTitle: r_cTitle,
                      overlap: overlapLibrary[p],
                      hierarchy: hierarchyLibrary[p]
                    };
                    return scope.$apply();
                  }
                }).on("mouseleave", dehoverAllEle).on("click", function(p, i) {
                  var l_cTitle, l_col, l_dID, l_dTitle, r_cTitle, r_col, r_dID, r_dTitle, _ref, _ref1, _ref2;
                  if (d3.event.defaultPrevented) {
                    return;
                  }
                  deselectAllEle();
                  selectEle(this);
                  _ref = p.split(","), l_dID = _ref[0], r_dID = _ref[1], l_col = _ref[2], r_col = _ref[3];
                  l_dTitle = dIDToDataset[l_dID].title;
                  r_dTitle = dIDToDataset[r_dID].title;
                  l_cTitle = (_ref1 = dIDToDataset[l_dID].column_attrs[l_col]) != null ? _ref1.name : void 0;
                  r_cTitle = (_ref2 = dIDToDataset[r_dID].column_attrs[r_col]) != null ? _ref2.name : void 0;
                  scope.selected = {
                    type: 'relationship',
                    l_dTitle: l_dTitle,
                    r_dTitle: r_dTitle,
                    l_cTitle: l_cTitle,
                    r_cTitle: r_cTitle,
                    overlap: overlapLibrary[p],
                    hierarchy: hierarchyLibrary[p]
                  };
                  return scope.$apply();
                }).on("dblclick", function(p, i) {
                  deselectAllEle();
                  dehoverAllEle();
                  delete hierarchyLibrary[p];
                  links.splice(i, 1);
                  return d3.select(this).remove();
                }).on("contextmenu", showLinkMenu);
                enter_g.append("path").attr("class", "visible-arrow").attr("marker-end", function(d) {
                  if (hierarchyLibrary[d] !== "11") {
                    return "url(#arrowhead)";
                  } else {
                    return "url(#circlehead)";
                  }
                }).attr("marker-start", "url(#circlehead)").attr("d", function(d) {
                  return calculatePath(d);
                }).attr("fill", "transparent").attr("stroke", "black").attr("stroke-width", 1);
                return enter_g.append("path").attr("class", "hover-arrow").attr("d", function(d) {
                  return calculatePath(d);
                }).attr("shape-rendering", "crispEdges").attr("stroke-width", 15).attr("stroke", "white").style("opacity", 0);
              } else {
                return d3.selectAll(".arrow-container").filter(function(d, i) {
                  return __indexOf.call(d.split(","), dID) >= 0;
                }).selectAll("path").attr("d", function(d) {
                  return calculatePath(d);
                }).attr("marker-end", function(d) {
                  if (hierarchyLibrary[d] !== "11") {
                    return "url(#arrowhead)";
                  } else {
                    return "url(#circlehead)";
                  }
                });
              }
            };
            showLinkMenu = function(p, i) {
              var el, l_col, l_dID, l_x, link, m, organizeMenu, r_col, r_dID, r_x, _ref;
              link = this;
              _ref = p.split(","), l_dID = _ref[0], r_dID = _ref[1], l_col = _ref[2], r_col = _ref[3];
              l_x = attributePositions[l_dID][l_col].left[0];
              r_x = attributePositions[r_dID][r_col].left[0];
              organizeMenu = function() {
                var option;
                svg.select("#link_menu").selectAll("g.link_type").selectAll("text").text(function(d, i) {
                  if (d === "11") {
                    return "1 - 1";
                  } else if (d === "1N") {
                    if (l_x < r_x) {
                      return "1 -> N";
                    } else {
                      return "N <- 1";
                    }
                  } else if (d === "N1") {
                    if (l_x < r_x) {
                      return "N <- 1";
                    } else {
                      return "1 -> N";
                    }
                  } else {
                    return "??";
                  }
                });
                option = svg.select("#link_menu").selectAll("g.link_type").filter(function(d, i) {
                  return d === hierarchyLibrary[p];
                }).on("click", function(d, i) {
                  svg.select("#link_menu").selectAll("g.link_type").filter(function(d, i) {
                    return d !== hierarchyLibrary[p];
                  }).attr("transform", function(d, i) {
                    return "translate(0," + (i + 1) * cellHeight + ")";
                  });
                  return svg.select("#link_menu").selectAll("g.link_type").on("click", function(d, i) {
                    hierarchyLibrary[p] = d;
                    svg.select("#link_menu").selectAll("g.link_type").attr("transform", "translate(0, 0)");
                    drawLinks(p.split(",")[0]);
                    return organizeMenu();
                  });
                });
                option = option[0][0];
                deselectAllEle();
                selectEle(option);
                selectEle(link);
                return option.parentNode.appendChild(option);
              };
              m = d3.mouse(this);
              el = svg.select("#link_menu").attr("display", "").attr("transform", "translate(" + (m[0] - (cellWidth / 2) + 10) + "," + (m[1] - 10) + ")");
              el = el[0][0];
              el.parentNode.appendChild(el);
              return organizeMenu();
            };
            buildMenus = function() {
              var link_menu, link_option, menu, p, _j, _len1;
              for (_j = 0, _len1 = data.length; _j < _len1; _j++) {
                p = data[_j];
                menu = svg.append("g").attr("class", "menu").attr("id", "menu_" + p.dID).attr("display", "none").on("mouseleave", function() {
                  return d3.select(this).attr("display", "none");
                });
                menu.append("rect").attr("width", cellWidth).attr("height", cellHeight).attr("x", 0).attr("y", 0).attr("rx", 3).attr("ry", 3).attr("fill", "#FFFFFF").style("stroke", "#AEAEAE").style("stroke-width", 1);
              }
              link_menu = svg.append("g").attr("id", "link_menu").attr("display", "none").on("mouseleave", function() {
                deselectAllEle();
                d3.select(this).attr("display", "none");
                return d3.select(this).selectAll("g.link_type").attr("transform", "translate(0,0)");
              });
              link_menu.append("rect").attr("x", 0).attr("y", 0).attr("rx", 3).attr("ry", 3).attr("width", boxWidth * 2 / 3).attr("height", link_types.length * cellHeight).style("opacity", 0);
              link_option = link_menu.selectAll("g.link_type").data(link_types).enter().append("g").attr("class", "link_type").attr("transform", "translate(0, 0)").on("mouseenter", function() {
                return hoverEle(this);
              }).on("mouseleave", dehoverAllEle);
              link_option.append("rect").attr("width", cellWidth / 2).attr("height", cellHeight).attr("x", 0).attr("y", 0).attr("rx", 3).attr("ry", 3).attr("fill", "#FFFFFF").style("stroke", "#AEAEAE").style("stroke-width", 1);
              return link_option.append("text").attr("x", 10).attr("y", 22).attr("fill", "#000000").attr("font-size", 14).attr("font-weight", "light");
            };
            addToMenu = function(p, dID, g_attr) {
              var column_id, menu, offset, option;
              column_id = p.column_id;
              menu = svg.select("g#menu_" + dID);
              offset = menu.selectAll("g.menu_attr")[0].length;
              option = menu.append("g").attr("class", "menu_attr").attr("transform", "translate(0," + (cellHeight * offset) + ")").on("mouseenter", function() {
                hoverEle(this);
                if (!selection_made) {
                  scope.selected = {
                    type: 'attribute',
                    columnType: p.type,
                    unique: uniques[dID][column_id],
                    columnStats: stats[dID][p.name]
                  };
                  return scope.$apply();
                }
              }).on("mouseleave", dehoverAllEle).on("click", function() {
                var min_y, x, y, _ref;
                min_y = cellHeight * d3.select("#box_" + dID).selectAll("g.attr")[0].length;
                d3.select("#box_" + dID).selectAll("g.attr").filter(function(d, i) {
                  return d.column_id > column_id;
                }).attr("transform", function(d, i) {
                  var x, y, _ref;
                  _ref = extractTransform(d3.select(this).attr("transform")), x = _ref[0], y = _ref[1];
                  min_y = Math.min(min_y, y);
                  return "translate(" + x + "," + (y + cellHeight) + ")";
                });
                d3.select(g_attr).attr("transform", "translate(0," + min_y + ")");
                d3.select("#box_" + dID).select(".attributes")[0][0].appendChild(g_attr);
                _ref = extractTransform(d3.select(this).attr("transform")), x = _ref[0], y = _ref[1];
                d3.select("#menu_" + dID).selectAll(".menu_attr").attr("transform", function() {
                  var dx, dy, _ref1;
                  _ref1 = extractTransform(d3.select(this).attr("transform")), dx = _ref1[0], dy = _ref1[1];
                  if (dy > y) {
                    return "translate(0," + (dy - cellHeight) + ")";
                  } else {
                    return "translate(0," + dy + ")";
                  }
                });
                calculateAttributePositions(dID);
                drawLinks(dID);
                return d3.select(this).remove();
              });
              option.append("rect").attr("width", cellWidth).attr("height", cellHeight).attr("x", 0).attr("y", 0).attr("rx", 3).attr("ry", 3).attr("fill", "#FFFFFF").attr("stroke", "#AEAEAE").style("stroke-width", 1);
              return option.append("text").attr("x", 10).attr("y", 22).attr("fill", "#000000").attr("font-size", 14).attr("font-weight", "light").text(function() {
                var unique;
                unique = uniques[dID][column_id] ? "*" : "";
                return p.name + unique + " (" + p.type + ")";
              });
            };
            showMenu = function(dID, m) {
              var el;
              el = svg.select("g.menu#menu_" + dID).attr("display", "").attr("transform", "translate(" + (m[0] - 10) + "," + (m[1] - 10) + ")")[0][0];
              return el.parentNode.appendChild(el);
            };
            selectEle = function(g) {
              d3.select(g).selectAll("path.visible-arrow,rect").classed("selected", true);
              return selection_made = true;
            };
            deselectAllEle = function() {
              svg.selectAll(".selected").classed("selected", false);
              selection_made = false;
              scope.selected = null;
              return scope.$apply();
            };
            hoverEle = function(g) {
              dehoverAllEle();
              return d3.select(g).selectAll("path.visible-arrow,rect").classed("hover", true);
            };
            dehoverAllEle = function() {
              svg.selectAll(".hover").classed("hover", false);
              if (!selection_made) {
                scope.selected = null;
                return scope.$apply();
              }
            };
            saveOntology = function() {
              var dist, el, hier, link, ontologies, _j, _len1;
              ontologies = {};
              svg.select(".save").select("text").text("Saving...");
              el = svg.select(".cover")[0][0];
              el.parentNode.appendChild(el);
              for (_j = 0, _len1 = links.length; _j < _len1; _j++) {
                link = links[_j];
                dist = overlapLibrary[link];
                hier = hierarchyLibrary[link];
                ontologies[link] = [dist, hier];
              }
              return PropertyService.updateProperties(ontologies, function(data) {
                return setTimeout(function() {
                  svg.select(".save").select("text").text("Save Ontologies");
                  el = svg.select(".cover")[0][0];
                  return el.parentNode.insertBefore(el, el.parentNode.firstChild);
                }, 200);
              });
            };
            dragDataset = d3.behavior.drag().on("dragstart", function(d) {
              var el, svg_h, svg_w;
              d3.event.sourceEvent.stopPropagation();
              el = d3.select(this.parentNode)[0][0];
              el.parentNode.appendChild(el);
              d.dragstart = d3.mouse(this);
              svg_w = parseInt(svg.style("width").split("px")[0]);
              svg_h = parseInt(svg.style("height").split("px")[0]);
              return d.dragmax = [svg_w - boxMargins.x, svg_h - boxMargins.y];
            }).on("drag", function(d) {
              var dID, m, x, y, _ref;
              m = d3.mouse(this);
              _ref = extractTransform(d3.select(this.parentNode).attr("transform")), x = _ref[0], y = _ref[1];
              x += m[0] - d.dragstart[0];
              y += m[1] - d.dragstart[1];
              x = Math.min(Math.max(boxMargins.x, x), d.dragmax[0]);
              y = Math.min(Math.max(boxMargins.y, y), d.dragmax[1]);
              d3.select(this.parentNode).attr("transform", "translate(" + x + ", " + y + ")");
              dID = d3.select(this.parentNode).attr("id").split("_")[1];
              calculateAttributePositions(dID);
              return drawLinks(dID);
            }).on("dragend", function(d) {
              var child, el;
              el = d3.select(this.parentNode)[0][0];
              child = d3.select(this.parentNode.parentNode).select(".arrow-container")[0][0];
              return el.parentNode.insertBefore(el, child);
            });
            dragLink = d3.behavior.drag().on("dragstart", function(d) {
              var column_id, dID, m, temp_arrow;
              d3.event.sourceEvent.stopPropagation();
              dID = d3.select(this.parentNode).datum().dID;
              column_id = d3.select(this).datum().column_id;
              m = d3.mouse(svg[0][0]);
              return temp_arrow = svg.append("path").datum([[dID, column_id], null]).attr("id", "temp_link").attr("marker-end", "url(#arrowhead)").attr("d", "M" + m[0] + "," + m[1]).attr("stroke", "black").attr("stroke-width", 2);
            }).on("drag", function(d) {
              var m, path_str;
              m = d3.mouse(svg[0][0]);
              path_str = d3.select("#temp_link").attr("d").split("L")[0] + "L" + m[0] + "," + m[1];
              return d3.select("#temp_link").attr("d", path_str);
            }).on("dragend", function(d) {
              var column_id, column_id2, dID, dID2, dst, key, key2, link_data, overlap, start;
              link_data = d3.select("#temp_link").datum();
              start = d3.select("#temp_link").attr("d").split("M")[1].split("L")[0].split(",").map(function(j) {
                return parseInt(j);
              });
              dst = d3.selectAll("g.attr").filter(function(d, i) {
                var m;
                m = d3.mouse(this);
                return (m[0] > 0) && (m[1] > 0) && (m[0] < cellWidth) && (m[1] < cellHeight);
              });
              if (dst[0].length > 0) {
                dID2 = d3.select(dst[0][0].parentNode).datum().dID;
                column_id2 = dst.datum().column_id;
                dID = link_data[0][0];
                column_id = link_data[0][1];
                if (dID !== dID2 || (dID === dID2 && column_id !== column_id2)) {
                  key = [dID, dID2, column_id, column_id2].join();
                  key2 = [dID2, dID, column_id2, column_id].join();
                  overlap = overlapLibrary[key] ? overlapLibrary[key] : 0;
                  overlapLibrary[key] = overlapLibrary[key] || overlapLibrary[key2] || 0;
                  hierarchyLibrary[key] = "1N";
                  links.push(key);
                  drawLinks();
                }
              }
              return d3.select("#temp_link").remove();
            });
            svg.append("rect").attr("class", "cover").attr("width", "100%").attr("height", "100%").style("opacity", 0).on("click", function() {
              deselectAllEle();
              return svg.selectAll("#link_menu,.menu").attr("display", "none");
            });
            svg.on("contextmenu", function() {
              return d3.event.preventDefault();
            });
            g = svg.selectAll("g.box").data(data).enter().append("g").attr("class", "box").attr("id", function(d) {
              return "box_" + d.dID;
            }).attr("transform", function(d, i) {
              var x, y;
              x = boxMargins.x + i * (boxWidth + margins.left);
              y = boxMargins.y;
              return "translate(" + x + ", " + y + ")";
            });
            title_g = g.append("g").attr("class", "title").attr("transform", "translate(0, 0)").call(dragDataset).on("mouseenter", function(p) {
              var d;
              hoverEle(this);
              if (!selection_made) {
                d = d3.select(this.parentNode).datum();
                scope.selected = {
                  type: 'object',
                  title: d.title,
                  filetype: d.filetype,
                  rows: d.rows,
                  cols: d.cols
                };
                return scope.$apply();
              }
            }).on("mouseleave", dehoverAllEle).on("click", function(p) {
              var d;
              if (d3.event.defaultPrevented) {
                return;
              }
              deselectAllEle();
              selectEle(this);
              d = d3.select(this.parentNode).datum();
              scope.selected = {
                type: 'object',
                title: d.title,
                filetype: d.filetype,
                rows: d.rows,
                cols: d.cols
              };
              return scope.$apply();
            }).on("contextmenu", function(p, i) {
              var m;
              m = d3.mouse(svg[0][0]);
              return showMenu(p.dID, d3.mouse(svg[0][0]));
            });
            title_g.append("rect").attr("height", attributesYOffset).attr("width", cellWidth).attr("x", 0).attr("y", 0).attr("rx", 3).attr("ry", 3).attr("stroke", "#AEAEAE").attr("stroke-width", 1).attr("fill", "#FFFFFF");
            title_g.append("text").attr("fill", "#000000").attr("x", cellWidth / 2).attr("y", 30).attr("text-anchor", "middle").attr("class", "title").text(function(d) {
              return d.title;
            });
            tspan = g.append("g").attr("transform", function(d, i) {
              return "translate(0," + attributesYOffset + ")";
            }).attr("class", "attributes").each(function(d) {
              var dID, texts, unique_cols;
              dID = d.dID;
              unique_cols = uniques[dID];
              texts = d3.select(this).selectAll("g text").data(d.column_attrs).enter().append("g").attr("class", "attr").attr("id", function(d, i) {
                return "attr_" + dID + "_" + i;
              }).attr("transform", function(d, i) {
                return "translate(0," + (i * cellHeight) + ")";
              }).call(dragLink).on("mouseenter", function(p) {
                var columnID, columnStats, unique;
                hoverEle(this);
                if (!selection_made) {
                  dID = d3.select(this.parentNode).datum().dID;
                  d = d3.select(this).datum();
                  columnID = d.column_id;
                  unique = uniques[dID][columnID];
                  columnStats = stats[dID][d.name];
                  scope.selected = {
                    type: 'attribute',
                    columnType: d.type,
                    unique: unique,
                    columnStats: columnStats
                  };
                  return scope.$apply();
                }
              }).on("mouseleave", dehoverAllEle).on("click", function(p) {
                var columnID, columnStats, unique;
                if (d3.event.defaultPrevented) {
                  return;
                }
                deselectAllEle();
                selectEle(this);
                dID = d3.select(this.parentNode).datum().dID;
                d = d3.select(this).datum();
                columnID = d.column_id;
                unique = uniques[dID][columnID];
                columnStats = stats[dID][d.name];
                scope.selected = {
                  type: 'attribute',
                  columnType: d.type,
                  unique: unique,
                  columnStats: columnStats
                };
                return scope.$apply();
              }).on("dblclick", function(p) {
                var column_id, g_attr, i, ind, selection, x, y, _j, _len1, _ref;
                d3.event.preventDefault();
                _ref = extractTransform(d3.select(this).attr("transform")), x = _ref[0], y = _ref[1];
                d3.select(this.parentNode).selectAll(".attr").attr("transform", function() {
                  var dx, dy, _ref1;
                  _ref1 = extractTransform(d3.select(this).attr("transform")), dx = _ref1[0], dy = _ref1[1];
                  if (dy > y) {
                    return "translate(" + dx + ", " + (dy - cellHeight) + ")";
                  } else {
                    return "translate(" + dx + "," + dy + ")";
                  }
                });
                dID = d3.select(this.parentNode).datum().dID;
                column_id = '' + d3.select(this).datum().column_id;
                ind = [];
                selection = d3.selectAll("g.arrow-container").filter(function(d, i) {
                  var key;
                  key = d.split(",");
                  if ((dID === key[0] && column_id === key[2]) || (dID === key[1] && column_id === key[3])) {
                    ind.push(i);
                    return true;
                  } else {
                    return false;
                  }
                }).remove();
                ind.reverse();
                for (_j = 0, _len1 = ind.length; _j < _len1; _j++) {
                  i = ind[_j];
                  links.splice(i, 1);
                }
                calculateAttributePositions(dID);
                drawLinks(dID);
                deselectAllEle();
                dehoverAllEle();
                g_attr = d3.select(this).remove();
                return addToMenu(p, dID, g_attr[0][0]);
              });
              texts.append("rect").attr("height", cellHeight).attr("width", cellWidth).attr("stroke", "#AEAEAE").attr("stroke-width", 1).attr("fill", "#FFFFFF");
              return texts.append("text").attr("x", 10).attr("y", 22).attr("fill", "#000000").attr("font-size", 14).attr("font-weight", "light").text(function(d, i) {
                var unique;
                unique = (unique_cols[i] ? "*" : "");
                return d.name + unique + " (" + d.type + ")";
              });
            });
            calculateHierarchies();
            calculateLinks();
            calculateAttributePositions();
            drawLinks();
            buildMenus();
            save_g = svg.append("g").attr("class", "save").attr("transform", function() {
              var svg_w;
              svg_w = parseInt(svg.style("width").split("px")[0]);
              return "translate(" + (svg_w - 250) / 2 + ", 0)";
            }).on("mouseenter", function() {
              return hoverEle(this);
            }).on("mouseleave", dehoverAllEle).on("click", function() {
              return saveOntology();
            });
            save_g.append("rect").attr("width", 250).attr("height", 36);
            return save_g.append("text").attr("text-anchor", "middle").attr("x", 250 / 2).attr("y", 23).text("Save Ontologies");
          }, 200);
        };
      }
    };
  }
]);
