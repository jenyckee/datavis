var Cdv = {id: "cdv", name: "CD&V" }
var Groen = { id: "grn", name: "Groen" }
var Nva = { id: "nva", name: "N-VA" }
var OpenVld = { id: "vld", name: "OpenVld" }
var Spa = { id: "spa", name: "SP.A" }
var VlaamsBelang = { id: "vlb", name: "Vlaams Belang"}

var parties = [Cdv, Groen, Nva, OpenVld, Spa, VlaamsBelang]

var body = d3.select("#parties")
             .selectAll("div")
             .data(parties)
             .enter()
             .append("a").attr("href", "#")
             .append("div")
             .attr("class", function(party) { return "party "+party.id; })
             // .attr("style", "left: 0px; right: 0px; position: absolute; top: 38px; display: block;")
             .append("div").attr("class", "logo");
            