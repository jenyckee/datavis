function animateGrowingCircle(fromRadius, toRadius) {
    var animateFunction = function () {
        d3.select(this)
            .attr('r', fromRadius)
            .transition()
            .duration(1000)
            .attr('r', toRadius)
            .transition()
            .duration(1000)
            .attr('r', fromRadius)
            .each('end', animateFunction);
    };
    return animateFunction;
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

window.addEventListener('load', function () {
    var xPadding = 25;
    var yPadding = 25;
    var svg = d3.select("body").append("svg");

    var screenWidth = 250;
    var screenHeight = 250;

    svg.attr("width", screenWidth)
       .attr("height", screenHeight);

        // console.log(screenWidth);

    var circle = svg.append("circle")
                 .attr("cx", 100)
                 .attr("cy", 100)
                 .attr("r", 25)
                 .style("fill", '#9B59B6');

    circle.on('mouseenter', function () {
        circle.style('fill', '#AB69C6');
    })
    .on('mouseleave', function () {
        circle.style('fill', '#9B59B6')
    })
    .on('click', function () {
        var x = Math.random() * screenWidth;
        var y = Math.random() * screenHeight;
        circle
            .transition()
            .duration(1000)
            .ease('bounce')
            .attr('cx', randomIntFromInterval(25, screenWidth-25))
            .attr('cy', randomIntFromInterval(25, screenWidth-25));
    });
});