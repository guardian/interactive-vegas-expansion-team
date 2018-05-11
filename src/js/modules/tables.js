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
        var width = $target.width();
        var height = $target.height();

        var svg = d3.select(target)
            .append('svg')
            .attr('width', width)
            .attr('height', height)

        var margin = {top: 24, left: 160, right: 40, bottom: 10};
            width = $target.width() - margin.left - margin.right;
            height = $target.height() - margin.top - margin.bottom;

        var y = d3.scaleBand()
                .range([0, height])
                .paddingInner(0.2);

        var x = d3.scaleLinear()
            .range([0, width]);

        y.domain(data.hockey.map(function(d) { return d.Team }));
        x.domain([0, 100]);

        svg.append('g')
            .attr('class', 'grid-lines')
            .attr('transform', 'translate(' + margin.left + ', 0)')
            .call(d3.axisTop(x)
                .ticks(10)
                .tickSize(-height)
                .tickFormat(function(d) { return d + '%' })
            )
            .selectAll('.tick text')
            .attr('y', 10)
            .attr('x', 2)

        var graph = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var team = graph.selectAll('g.team')
            .data(data.hockey)
            .enter()
            .append('g')
            .attr('class', function(d) { return 'team' + (d.Team == 'Las Vegas Knights' ? ' knights' : '') });

        team.append('text')
            .attr('y', function(d) { return y(d.Team) })
            .attr('x', -margin.left)
            .attr('class', 'team-name')
            .text(function(d) { return d.Team });

        team.append('text')
            .attr('y', function(d) { return y(d.Team) })
            .attr('x', -margin.left)
            .attr('class', 'team-year')
            .text(function(d) { return d.Year });

        team.append('text')
            .attr('y', function(d) { return y(d.Team) })
            .attr('x', function(d) { return x(d.Percentage) })
            .attr('class', 'team-percentage')
            .text(function(d) { return d.Percentage + '%' });

        team.append('rect')
            .attr('y', function(d) { return y(d.Team) })
            .attr('x', 0)
            .attr('width', function(d) { return x(d.Percentage) })
            .attr('height', y.bandwidth());
    }
};
