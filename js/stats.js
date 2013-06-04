window.onload = function() {
    var url = "http://s3.amazonaws.com/pushpinapp/stats.json"

    $.get(url, function(json) {
        if (json) {
            $('#total-edits').html(json.total_edits);

            numberOfEditsInLast24Hours = 0;
            var now = moment(new Date);
            _.each(json.recent_edits, function(edit) {
                var editDate = moment(edit.date);

                if (now.diff(editDate, 'minutes') < 1440)
                  numberOfEditsInLast24Hours++;
            });
            $('#last-24').html(numberOfEditsInLast24Hours);
            $('#total-users').html(json.top_users.length);

            graph(json.edits_by_day);
        }
    });

    graph = function(data) {
        var margin = {top: 20, right: 20, bottom: 30, left: 30},
            width = 1100 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var area = d3.svg.area()
            .x(function(d) { return x((new Date(d.day)).getTime()); })
            .y0(height)
            .y1(function(d) { return y(d.count); });

        var svg = d3.select(".edits-by-day").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(data, function(d) { return (new Date(d.day)).getTime(); }));
        y.domain([0, d3.max(data, function(d) { return d.count; })]);

        // area chart
        // svg.append("path")
        //     .datum(data)
        //     .attr("class", "area")
        //     .attr("d", area);

        svg.selectAll(".bar").data(data).enter().append('rect')
          .attr("class", "bar")
          .attr("x", function(d) { return x((new Date(d.day)).getTime()); })
          .attr("width", 4)
          .attr("y", function(d) { return y(d.count); })
          .attr("height", function(d) { return height - y(d.count); });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-5em")
            .attr("dx", "-40px")
            .style("text-anchor", "end")
            .text("Edits");
  }
}