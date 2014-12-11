// Number of participating users in the db
// TODO: Remove this magic constant (get it from the db)
var numberOfUsers = 100;
var chartsvg;

// Mapping of step names to colors.
var colors = {
"NVA" :"#FBE700",
//"PS" : "#D21F1F",
"PS" : "#9c5454",
//"MR" : "#1C72C2",
"MR" : "#4f7192",
"CD&V" :"#F26C00",
"OpenVLD" : "#1C76C7",
//"SP.A" : "#D11F1F",
"SP.A" : "#f00000",
//"CDH" : "#E46600",
"CDH" : "#af896a",
"Groen" : "#5DA115",
//"Ecolo" : "#5DA115",
"Ecolo" : "#5d7740",
//"VB" :"#DFB300",
"VB" :"#b38600",
//"PVDA" : "#760000",
"PVDA" : "#6d3b3b",
//"FDF" : "#AC0157",
"FDF" : "#713d57",
//"PP" : "#797979",
"PP" : "#797979",
//"LDD" : "#73A6BE",
"LDD" : "#7aa4b8",
//"Anderen" : "#E7E7E7"
"Anderen" : "#b3b3b3"
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

    // Conversion to whole % (p.e. 0.1 -> 10)
    function getAgreements(statement){
      return statement.agreements * 100;
    }

    // d3 expects an array of data
    var statementarray = [statement];

    // Bar colors for agreements and disagreements
    var agreementsColor = 'palegreen'
    var disagreementsColor = 'tomato';

    // Number of bars in the diagram (needed to compute width of each bar)
    var numberOfBars = 3;
    var interBarSpace = 80;

    //var testdata = [4, 8, 15, 99, 50, 99];

    var margin = {top: 20, right: 30, bottom: 30, left: 40},
      width = 500 - margin.left - margin.right,   // total available width for bars
      height = 200 - margin.top - margin.bottom;  // total available height for bars (positive OR negative)

    var barWidth = (width / numberOfBars) - 100;

    var y = d3.scale.linear()
              .domain([0, 100]) // Working on a % scale
              .range([height,0]);

   chartsvg = d3.select("#percentagebars")
                    .append("svg")
                    .attr('class', "chart");

    var barchart = chartsvg
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", (height + margin.top + margin.bottom)*2);



    // Bars
    //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    var heightscale = d3.scale.linear()
                      .domain([0, 100]) // Working on a % scale
                      .range([0, height]);

    // Agreements <> disagreements
    //****************************
    var bar = barchart.selectAll("g")
                .data(statementarray)
              .enter().append("g")
                .attr("transform", function(d, i) {
                   return "translate(" + (margin.left-10 + interBarSpace) + "," + margin.top +")";});

    // Agreements
    bar.append("rect")
        .attr("y", function(d) {
                    return y(normalizeToUsers(getAgreements(d))); // y-co from top
                    })
        .attr("height", function(d) {return heightscale(getAgreements(d));})
        .attr("width", barWidth - 1)
        .attr("fill", agreementsColor);

    // Disagreements
    bar.append("rect")
        .attr("y", function(d) {
          return y(0);})
        .attr("height", function(d) { return heightscale(getDisagreements(getAgreements(d)));
        })
        .attr("width", barWidth - 1)
        .attr("fill", disagreementsColor);

    function getDisagreements(agreements){
      return 100 - agreements;
    }

  // Parliament/Government: Agree/Disagreeing parties
  //**************************************
  // Fetching data
  var flemishParties = ["NVA", "CD&V", "SP.A", "OpenVLD", "Groen", "VB"];
  var govParties = ["NVA", "CD&V", "OpenVLD"];  // flemish parties in government
  var agreeingparties = adaptPartiesToBurst(statement.parties);

  // Main control parliament bar
  d3.text("out.csv", function(rawData){
    var partydata = parsePartyData(rawData);
    var partyvotes = sumOfPartyVotes(partydata);  // sum votes of all provinces per party

    // Flemish parties is federal parliament
    var sumOfVotes = computeTotal(partyvotes);  // sum of all votes, flemish parliament parties
    var partyvotespercent = new Map();
    partyvotes.forEach(function(val, key){
      partyvotespercent.set(key, convertToPercent(val, sumOfVotes));
    });
    drawParliamentBar(partyvotespercent);

    // Flemish parties in federal government
    var govpartyvotes = filterGovParties(partyvotes);
    var sumOfGovVotes = computeTotal(govpartyvotes);
    var govpartyvotespercent = new Map();
    govpartyvotes.forEach(function(val, key){
      govpartyvotespercent.set(key, convertToPercent(val, sumOfGovVotes));
    });
    drawGovernmentBar(govpartyvotespercent);
    drawAxes();
    drawLabels();
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

  function filterGovParties(partyvotes){
    var result = partyvotes;
    partyvotes.forEach(function(val, key) {
      if(govParties.indexOf(key) == -1){
        result.delete(key);
      }
    });
    return result;
  }

  // Draw the parliament bar
  //------------------------


  // Draws the parliamentbar, partyvotes (map<party, % of votes)
  function drawParliamentBar(partyvotes){
    var bar2 = barchart.append("g")
                      .attr("transform","translate(" + (margin.left-10 +  barWidth + 2*interBarSpace ) + "," + margin.top + ")");

    // Agreeing parties (en generating an array with disagreeing parties meanwhile)
      var disagreeingparties = new Array();

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

// Government: Agree/Disagreeing parties
//**************************************

  function drawGovernmentBar(partyvotes){
    var bar3 = barchart.append("g")
                     .attr("transform","translate(" + (margin.left-10 + 2*barWidth + 3*interBarSpace) + "," + margin.top + ")");

  // Agreeing parties (en generating an array with disagreeing parties meanwhile)
    var disagreeingparties = new Array();
    var previousY = y(0);

    for(var i in govParties){
      var currparty = govParties[i];
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

        bar3.append("rect")
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
      bar3.append("rect")
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
          .call(yAxis1)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Agreeing");

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
          .call(yAxis2)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -98)
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Disagreeing");

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

  function drawLabels(){
      var lbl1 = barchart.append("g")
                          .attr("class", "axis")
                          .append("text")
                            .attr("y", 330);

      lbl1.append("tspan")
          .attr("dy", "1.2em")
          .attr("x", 156)
          .attr("style", "text-anchor:end")
          .text("% of people")

      lbl1.append("tspan")
          .attr("dy", "1.2em")
          .attr("x", 158)
          .attr("style", "text-anchor:end")
          .text("(dis)agreeing");

      var lbl2 = barchart.append("g")
                          .attr("class", "axis")
                          .append("text")
                            .attr("y", 330);

      lbl2.append("tspan")
          .attr("dy", "1.2em")
          .attr("x", 295)
          .attr("style", "text-anchor:end")
          .text("% of participating");

      lbl2.append("tspan")
          .attr("dy", "1.2em")
          .attr("x", 303)
          .attr("style", "text-anchor:end")
          .text("parties in parliament");

      lbl2.append("tspan")
          .attr("dy", "1.2em")
          .attr("x", 302)
          .attr("style", "text-anchor:end")
          .text("relative to no. votes");


      var lbl3 = barchart.append("g")
                          .attr("class", "axis")
                          .append("text")
                            .attr("y", 330);

      lbl3.append("tspan")
          .attr("dy", "1.2em")
          .attr("x", 415)
          .attr("style", "text-anchor:end")
          .text("% of participating");

      lbl3.append("tspan")
          .attr("dy", "1.2em")
          .attr("x", 423)
          .attr("style", "text-anchor:end")
          .text("parties in government");

      lbl3.append("tspan")
          .attr("dy", "1.2em")
          .attr("x", 422)
          .attr("style", "text-anchor:end")
          .text("relative to no. votes");
  }
}

function removeDoubleHistogram(statement){
  if(chartsvg)
    chartsvg.remove();
}
doubleHistogram(data.stmts[0]);
