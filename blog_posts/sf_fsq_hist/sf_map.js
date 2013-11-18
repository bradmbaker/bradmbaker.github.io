makeMap = function(resp) {
//pull in the foursquare data
//set up some variables 
var places = new Array();
var route = new Object();

//get the space ready

var width = Math.max(960, window.innerWidth),
    height = Math.max(500, window.innerHeight*2/3);

var tiler = d3.geo.tile()
    .size([width, height]);

var projection = d3.geo.mercator()
    .center([-122.41, 37.79])
    .scale((1 << 23) / 7 / Math.PI)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(renderTiles, "highroad")
    .call(renderTiles, "buildings");



//loop through the data received by fsq for checkins be added to the place variable
    $(resp.checkins.items).each(function(i) {
         places[i] =  {name: this.venue.name, location: Array(this.venue.location.lng ,  this.venue.location.lat) };
        });

//setting up the route type of data
route = {
  type: "LineString",
  coordinates: [
    ]
  };

//adding in the data for each each coordinate into the routes
$(places).each(function(i) {
             if(i<places.length) {
                    route.coordinates[i] = (this.location) 
                                  }
});


//actually adding in the routes to the page
svg.append("path")
    .datum(route)
    .attr("class", "route")
    .attr("d", path);


//adding in points to the page
var point = svg.append("g")
    .attr("class", "points")
    .selectAll("g")
    .data(places)
    .enter().append("g")
    .attr("transform", function(d) { return "translate(" + projection(d.location) + ")"; })
    .attr("class","show_text")
    .text(function(d) {return d.name;});

//adding some slick looking circles to each point.
point.append("circle")
    .attr("r", 4.5)
    .style("fill","blue");


///tbd tooltips
$(svg).ready( function() {
  $("g.show_text").on("mouseenter",function(d) {
     $(this).children("circle").attr("r",10)
     $("#location_text").text($(this).text())
   })

$("g.show_text").on("mouseleave",function(d) {
     $(this).children("circle").attr("r",4.5)
     $("#location_text").text("Explore SF")
   })

});









function renderTiles(svg, type) {
  svg.append("g")
      .attr("class", type)
    .selectAll("g")
      .data(tiler
        .scale(projection.scale() * 2 * Math.PI)
        .translate(projection([0, 0])))
    .enter().append("g")
      .each(function(d) {
        var g = d3.select(this);
        d3.json("http://" + ["a", "b", "c"][(d[0] * 31 + d[1]) % 3] + ".tile.openstreetmap.us/vectiles-" + type + "/" + d[2] + "/" + d[0] + "/" + d[1] + ".json", function(error, json) {
          g.selectAll("path")
              .data(json.features.sort(function(a, b) { return a.properties.sort_key - b.properties.sort_key; }))
            .enter().append("path")
              .attr("class", function(d) { return d.properties.kind; })
              .attr("d", path);
        });
      });
}
}
