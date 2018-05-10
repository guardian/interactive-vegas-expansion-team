var d3 = require('d3');

// data
var data = {};
    data.hockey = require('../data/hockey.json');

module.exports =  {
    init: function() {
        this.createTable('.uit-table--hockey-comparison');
    },

    createTable: function(target) {
        var $target = $(target);
        var margin = {top: 20, left: 40, right: 0, bottom: 0};
        var width = $target.width() - margin.left;
        var height = $target.height() - margin.top;

        var svg = d3.select(target)
            .append('svg')
            .attr('width', width + margin.left)
            .attr('height', height + margin.top)

        var x = d3.scaleBand()
                .range([margin.left, width])
                .paddingInner(0.1);

        x.domain(data.hockey.map(function(d) { return d.Team }));

        var y = d3.scaleLinear()
            .range([height, margin.top]);

        y.domain([0, 100]);

        console.log(y);

        svg.append('g')
            .attr('class', 'grid-lines')
            .call(d3.axisLeft(y)
                .ticks(10)
                .tickSize(-width)
                .tickFormat(function(d) { return d + '%' })
            )
            .selectAll('.tick text')
            .attr('y', -10)
            .attr('x', 0)

        svg.selectAll('g.team')
            .data(data.hockey)
            .enter()
            .append('g')
            .attr('class', function(d) { return 'team' + (d.Team == 'Vegas Golden Knights' ? ' knights' : '') })
            .append('rect')
            .attr('x', function(d) { return x(d.Team) })
            .attr('y', function(d) { console.log(d); return y(d.Percentage) })
            .attr('height', function(d) { return height - y(d.Percentage)})
            .attr('width', x.bandwidth());
    }
};
