// Number of participating users in the db
// TODO: Remove this magic constant (get it from the db)
var numberOfUsers = 100;
var chartsvg;

// Mapping of step names to colors.
var colors = {
"NVA" :"#FBE700",
"PS" : "#D21F1F",
"MR" : "#1C72C2",
"CD&V" :"#F26C00",
"OpenVLD" : "#1C76C7",
"SP.A" : "#D11F1F",
"CDH" : "#E46600",
"Groen" : "#5DA115",
"Ecolo" : "#5DA115",
"VB" :"#DFB300",
"PVDA" : "#760000",
"FDF" : "#AC0157",
"PP" : "#797979",
"LDD" : "#73A6BE",
"Anderen" : "#E7E7E7"
};

function adaptPartiesToBurst(parties){
  return parties.map(function(party){
    if(party == "N-VA")
      return "NVA";
    else if(party == "Vlaams Belang")
      return "VB";
    else
      return party;
  });
}

function normalizeToUsers(number){
  return (number/numberOfUsers)*100;
}

function doubleHistogram(statement){

    // Clearing previous chart
    removeDoubleHistogram();

    // d3 expects an array of data
    var statementarray = [statement];

    // Bar colors for agreements and disagreements
    var agreementsColor = 'forestgreen'
    var disagreementsColor = 'crimson';

    // Number of bars in the diagram (needed to compute width of each bar)
    var numberOfBars = 3;
    var interBarSpace = 100;

    //var testdata = [4, 8, 15, 99, 50, 99];

    var margin = {top: 20, right: 30, bottom: 30, left: 40},
      width = 500 - margin.left - margin.right,   // total available width for bars
      height = 200 - margin.top - margin.bottom;  // total available height for bars (positive OR negative)

    var barWidth = (width / numberOfBars) - interBarSpace;

    var y = d3.scale.linear()
              .domain([0, 100]) // Working on a % scale
              .range([height,0]);

   chartsvg = d3.select("#statements")
                    .append("svg")
                    .attr('class', "chart");

    var barchart = chartsvg
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", (height + margin.top + margin.bottom)*2);



    // Bars
    //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // Agreements <> disagreements
    //****************************
    var bar = barchart.selectAll("g")
                .data(statementarray)
              .enter().append("g")
                .attr("transform", function(d, i) {
                   return "translate(" + (margin.left + (i * barWidth)) + "," + margin.top +")";});

    // Agreements
    bar.append("rect")
        .attr("y", function(d) {
                    return y(normalizeToUsers(d.agreements)); // y-co from top
                    })
        .attr("height", function(d) {return height - y(normalizeToUsers(d.agreements));})
        .attr("width", barWidth - 1)
        .attr("fill", agreementsColor);

    // Disagreements
    bar.append("rect")
        .attr("y", function(d) {
          return y(0);})
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
  // Fetching data
  var flemishParties = ["NVA", "CD&V", "SP.A", "OpenVLD", "Groen", "VB"];
  var agreeingparties = adaptPartiesToBurst(statement.parties);

  // Main control parliament bar
  d3.text("out.csv", function(rawData){
    var partydata = parsePartyData(rawData);
    var partyvotes = sumOfPartyVotes(partydata);  // sum votes of all provinces per party
    var sumOfVotes = computeTotal(partyvotes);  // sum of all votes
    var partyvotespercent = new Map();
    partyvotes.forEach(function(val, key){

      partyvotespercent.set(key, convertToPercent(val, sumOfVotes))
    });
    drawParliamentBar(partyvotespercent);
    drawAxes();
  });
  // Parsing data
  function parsePartyData(f_csv){
    var rows = d3.csv.parseRows(f_csv);
    var allpartyvotes = buildHierarchy(rows);
    return allpartyvotes.children;
  }
  // Computes sum of all values in map
  function computeTotal(map){
    var result = 0;
    map.forEach(function(val, key){
      result = result + val;
    });
    return result;
  }
  // Converts no. votes to %
  function convertToPercent(item, total){
    return (item/total)*100;
  }

  // Draw the parliament bar
  //------------------------
  // Returns a Map with <key,value> pairs: key = partyname, value = no. votes
  function sumOfPartyVotes(allpartyvotes){
    var result = new Map();
    for(var i in allpartyvotes){
      if(flemishParties.indexOf(allpartyvotes[i].name) != -1){
        var votes = allpartyvotes[i].children.map(function(province){
          return province.size;
      });
      result.set(allpartyvotes[i].name, votes.reduce(function(prev, curr) {
        return prev + curr;
      }));
    }
  }
  return result;
}
  // Draws the parliamentbar, partyvotes (map<party, % of votes)
  function drawParliamentBar(partyvotes){
    var bar2 = barchart.append("g")
                      .attr("transform","translate(" + (margin.left +  barWidth + interBarSpace ) + "," + margin.top + ")");
  //  console.log(parlbar);
    // Agreeing parties (en generating an array with disagreeing parties meanwhile)
      var disagreeingparties = new Array();
      var heightscale = d3.scale.linear()
                          .domain([0, 100]) // Working on a % scale
                          .range([0, height]);
      var previousY = y(0);
      for(var i in flemishParties){
        var currparty = flemishParties[i];
        if(agreeingparties.indexOf(currparty) == -1){ // getting disagreeing parties
          disagreeingparties.push(currparty);
        }
        else{
          // Computing y-coördinate
          var votes;
          if(partyvotes.has(currparty)){
            votes = partyvotes.get(currparty);
          }
          else {
            console.warn("VIS2 -- couldn't find votes of party");
            votes = null;
          }

          bar2.append("rect")
              .attr("y", y(votes) - (y(0) - previousY)) // y-co from top
              .attr("height", heightscale(votes))
              .attr("width", barWidth - 1)
              .attr("fill", colors[currparty])
              .attr("party", currparty)
              .attr("votes", votes);


        previousY = y(votes) - (y(0) - previousY);
        }
      }
      // Disagreeing parties
      nextY = y(0);
      for(var j in disagreeingparties){
        var currparty = disagreeingparties[j];

        // Computing y-coördinate
        var votes;
        if(partyvotes.has(currparty)){
          votes = partyvotes.get(currparty);
        }
        else {
          console.warn("VIS2 -- couldn't find votes of party");
          votes = null;
        }
        bar2.append("rect")
            .attr("y", nextY)
            .attr("height", heightscale(votes))
            .attr("width", barWidth - 1)
            .attr("fill", colors[currparty])
            .attr("party", currparty)
            .attr("votes", votes);

            nextY = nextY + heightscale(votes);
      }
  }


  // Axes
  function drawAxes(){
    var yAxis1 = d3.svg.axis()
              .scale(y)
              .orient('left');

    barchart.append("g")
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

    barchart.append("g")
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

    barchart.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(" + (margin.left/2 + 5) + "," + (margin.top + height) + ")")
          .call(xAxis);
  }

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
}


function removeDoubleHistogram(statement){
  if(chartsvg)
    chartsvg.remove();
}
doubleHistogram(data.stmts[0]);