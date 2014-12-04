// Number of participating users in the db
// TODO: Remove this magic constant (get it from the db)
var numberOfUsers = 100;
var chartsvg;

function normalizeToUsers(number){
  return (number/numberOfUsers)*100;
}

function doubleHistogram(statement){

    // Clearing previous chart
    removeDoubleHistogram();

    // d3 expects an array of data
    var statement = [statement];

    // Bar colors for agreements and disagreements
    var agreementsColor = 'forestgreen'
    var disagreementsColor = 'crimson';

    // Number of bars in the diagram (needed to compute width of each bar)
    var numberOfBars = 3;
    var interBarSpace = 100;

    //var testdata = [4, 8, 15, 99, 50, 99];

    var margin = {top: 20, right: 30, bottom: 30, left: 40},
      width = 500 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

    var barWidth = (width / numberOfBars) - interBarSpace;

    var y = d3.scale.linear()
              .domain([0, 100]) // Working on a % scale
              .range([height, 0]);

   chartsvg = d3.select("#statements")
                    .append("svg")
                    .attr('class', "chart");

    var chart = chartsvg
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", (height + margin.top + margin.bottom)*2);



    // Bars
    //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // Agreements <> disagreements
    //****************************
    var bar = chart.selectAll("g")
                .data(statement)
              .enter().append("g")
                .attr("transform", function(d, i) {
                   return "translate(" + (margin.left + (i * barWidth)) + "," + margin.top +")";});

    // Agreements
    bar.append("rect")
        .attr("y", function(d) {return y(normalizeToUsers(d.agreements));}) // y-co from top
        .attr("height", function(d) {return height - y(normalizeToUsers(d.agreements));})
        .attr("width", barWidth - 1)
        .attr("fill", agreementsColor);

    // Disagreements
    bar.append("rect")
        .attr("y", function(d) {
          return y(0);})
          //return y(normalizeToUsers(getDisagreements(d.agreements)));})
        .attr("height", function(d) {
          return height - y(normalizeToUsers(getDisagreements(d.agreements)));
        })
        .attr("width", barWidth - 1)
        .attr("fill", disagreementsColor);

    function getDisagreements(agreements){
      return numberOfUsers - agreements;
    }

  // Parliament: Agree/Disagreeing parties
  //**************************************
  // TODO

  // Axes
  var yAxis1 = d3.svg.axis()
            .scale(y)
            .orient('left');

  chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate ("+ (margin.left/2 + 5) + "," + margin.top + ")")
        .call(yAxis1);

  // Hack for 2nd axis
  var y2 = d3.scale.linear()
            .domain([0, 100]) // Working on a % scale
            .range([0, height]);

  var yAxis2 = d3.svg.axis()
            .scale(y2)
            .orient('left');

  chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate ("+ (margin.left/2 + 5) + "," + (margin.top + height) + ")")
        .call(yAxis2);

  var x = d3.scale.linear()
          .domain([0,1])
          .range([0, width]);

  var xAxis = d3.svg.axis()
              .scale(x)
              .tickValues([])
              .outerTickSize([0]);

  chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + (margin.left/2 + 5) + "," + (margin.top + height) + ")")
        .call(xAxis);


/*  chart.append("path")
        .attr("transform", "translate ("+ (margin.left/2 + 5) + "," + (margin.top + height) + ")")
        .attr("d", "M0,0" + "L" + width + ",0 ")
        .attr("style", "stroke:#000000;");
        /*.attr("x1", "0")
        .attr("y1", "0")
        .attr("x2", width)
        .attr("y2", "0")
        .attr("style", "stroke:rgb(0,0,0)");
*/
  console.log(y);

}


function removeDoubleHistogram(statement){
  if(chartsvg)
    chartsvg.remove();
}
doubleHistogram(data.stmts[0]);
