


function statementSelector(stmts){

  var selector = d3.select("#statementselector").append('ul')
                    .attr('class', "pagination");


  var selections = selector.selectAll('li')
                    .data(stmts)
                    .enter().append('li')
                    .on("mouseover", onStatementSelected)
                    .on("mouseout", onStatementUnSelected);



  selections
    .append("a").text(function(d){ return d3.format(",")(d.id)});
}



statementSelector(stmts);

// Callback when a statement has been selected
function onStatementSelected(statement){
  burstHighlight(statement.parties);
  displayStatement(statement);
  doubleHistogram(statement);
}

function onStatementUnSelected(statement){
  burstUnhighlightAll();
  clearDisplayStatement(statement);
}

/*
$("#statementselector li").hover(function(index){
  var li = $(this);
  console.log(li);
});
*/
