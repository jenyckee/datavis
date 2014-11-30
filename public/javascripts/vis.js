var Cdv = {id: "cdv", name: "CD&V" }
var Groen = { id: "grn", name: "Groen" }
var Nva = { id: "nva", name: "N-VA" }
var OpenVld = { id: "vld", name: "OpenVld" }
var Spa = { id: "spa", name: "SP.A" }
var VlaamsBelang = { id: "vlb", name: "Vlaams Belang" }

var parties = [Cdv, Groen, Nva, OpenVld, Spa, VlaamsBelang]

// var partysection = d3.select("#parties")
//                      .selectAll("div")
//                      .data(parties)
//                      .enter()
//                      .append("a").attr("href", "#").attr("class", "")
//                      .append("div")
//                      .attr("class", function(party) { return "col-md-2 party "+party.id; })
//                      .append("div").attr("class", "logo");


var barColor = 'steelblue';

// function segColor(c){ return {low:"#807dba", mid:"#e08214",high:"#41ab5d"}[c]; }

function histoGram(fD) {
    // fD = statement objects from db
    // fD.forEach(function(d){d.total=d.freq.low+d.freq.mid+d.freq.high;});

    // Getting only the statement & no. agreements
    var fD = fD.map(function(d){return [d.text,d.agreements];});


    //console.log(fD)

    var hG={},    hGDim = {t: 60, r: 0, b: 30, l: 0};
    hGDim.w = 500 - hGDim.l - hGDim.r,
    hGDim.h = 300 - hGDim.t - hGDim.b;

    //create svg for histogram.
    var hGsvg = d3.select("#statements").append("svg")
        .attr("width", hGDim.w + hGDim.l + hGDim.r)
        .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
        .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

    // create function for x-axis mapping.
    var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
            .domain(fD.map(function(d) { return d[0]; }));

    // Add x-axis to the histogram svg.
    // hGsvg.append("g").attr("class", "x axis")
    //     .attr("transform", "translate(0," + hGDim.h + ")")
    //     .call(d3.svg.axis().scale(x).orient("bottom"));

    // Create function for y-axis map.
    var y = d3.scale.linear().range([hGDim.h, 0])
            .domain([0, d3.max(fD, function(d) { return d[1]; })]);

    // Create bars for histogram to contain rectangles and freq labels.
    var bars = hGsvg.selectAll(".bar").data(fD).enter()
            .append("g").attr("class", "bar");

    //create the rectangles.
    bars.append("rect")
        .attr("x", function(d) { return x(d[0]); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("width", x.rangeBand())
        .attr("height", function(d) { return hGDim.h - y(d[1]); })
        .attr('fill',barColor)
        .on("mouseover",mouseover)// mouseover is defined below.
        .on("mouseout",mouseout);// mouseout is defined below.

    //Create the frequency labels above the rectangles.
    bars.append("text").text(function(d){ return d3.format(",")(d[1])})
        .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
        .attr("y", function(d) { return y(d[1])-5; })
        .attr("text-anchor", "middle");

    function mouseover(d){  // utility function to be called on mouseover.
        // filter for selected state.
        // var st = stmts.filter(function(s){ return s.Text == d[0];})[0],
        //     nD = d3.keys(st.agreements).map(function(s){ return {type:s, freq:st.freq[s]};});

        // // call update functions of pie-chart and legend.
        // pC.update(nD);
        // leg.update(nD);
        d3.select("#statement-info").text(d[0])
    }

    function mouseout(d){
    // utility function to be called on mouseout.
        // // reset the pie-chart and legend.
        // pC.update(tF);
        // leg.update(tF);
    }

    return hG;
}

histoGram(stmts);
