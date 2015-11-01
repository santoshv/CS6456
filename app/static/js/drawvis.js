$(function(){
  $.ajax({
      contentType: 'application/json; charset=utf-8',
      url:'/data/retrieve_schema_list',
      dataType: 'text',
      success: function (results) {
        console.log(results);
    },
    error: function (request, status, error) {
        //alert(error);
    }
  });
});

function draw_plot(){
  $.ajax({
      contentType: 'application/json; charset=utf-8',
      url:'/data/get_scatterplot_points',
      dataType: 'text',
      data: "dbid=2&fname=profit&ftype=1&filters=1*profit*1*10,2*category*Coffee",
      success: function (results) {
        var svg1 = d3.select("#viz")
              .append("svg")
              .attr("width", 900)
              .attr("height", 600)
              .attr("class","gestvizsvg");
        var results1 = JSON.parse(results);
        //Width and height
        var w = 900/results1.length;
        var h = 250;
        var top_flag = 0;

        var color_x = d3.scale.category10();
        var color = d3.scale.ordinal().domain([0,1,2,3,4,5,6,7,8,9]).range(color_x.range()); 
        
        var svg_x = -w;
        var cluster = new Array();
        for (var i = 0; i < results1.length; i++){
            console.log(results1[i]);
            cluster.push(results1[i]["cluster"]);
          var svg = d3.select(".gestvizsvg")
              .append("svg")
              .attr("width", w)
              .attr("height", h)
              .attr("y", function(d) {
                if (i%2 == 1){
                    return "250";
                }
                return 0;
              })
              .attr("x", function(d) {
                svg_x = svg_x + w;
                return svg_x;
              });

          var recs = results1[i]["recs"];
          
          var max = Math.max(...recs);
          var min = Math.min(...recs);

          var cur_x = 10;
          
          svg.selectAll("circle")
             .data(recs)
             .enter()
             .append("circle")
             .attr("cx", function(d) {
                if (cur_x > w-20){
                    cur_x = 10;
                }
                else cur_x = cur_x+20;
                return cur_x;
             })
             .attr("cy", function(d) {
                return ((d/max)*h)+20;
             })
             .attr("r", 5)
             .style("fill", color(i));
            
        }
        var legendRectSize = 18;
        var legendSpacing = 4;
        var legend = svg1.selectAll('.legend')
                          .data(cluster)
                          .enter()
                          .append('g')
                          .attr('class', 'legend')
                          .attr('transform', function(d, i) {
                            var horz = i*w;
                            var vert = 550;
                            return 'translate(' + horz + ',' + vert + ')';
                          });
        legend.append('rect')
              .attr('width', legendRectSize)
              .attr('height', legendRectSize)
              .style('fill', function(d, ind) {
                return color(ind);

              })
              .style('stroke', function(d, ind) {
                return color(ind);

              });
        legend.append('text')
          .attr('x', legendRectSize + legendSpacing)
          .attr('y', 15)
          .text(function(d) { console.log(d); return d; });
    },
    error: function (request, status, error) {
        //alert(error);
    }
  });
}

