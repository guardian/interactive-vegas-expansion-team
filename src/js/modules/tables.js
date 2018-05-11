var d3 = require('d3');

// data
var data = {};
    data.hockey = require('../data/hockey.json');
    data.baseball = require('../data/baseball.json');
    data.basketball = require('../data/basketball.json');
    data.football = require('../data/football.json');

module.exports =  {
    init: function() {
        this.createTables();
        this.bindings();
    },

    bindings: function() {
        $(window).resize(function() {
            this.createTables();
        }.bind(this));
    },

    createTables: function() {
        this.createTable('.uit-table--hockey-comparison');
        this.createTable('.uit-table--baseball-comparison');
        this.createTable('.uit-table--basketball-comparison');
        this.createTable('.uit-table--football-comparison');
    },

    createTable: function(target) {
        var $target = $(target);
        var dataType = $(target).data('type');
        var margin = {top: 24, left: 160, right: 40, bottom: 10};
        var width = $target.width();
        var height = (data[dataType].length * 40) + margin.top + margin.bottom;
        var isMobile = 480 > width ? true : false;

        if (isMobile) {
            margin = {top: 24, left: 12, right: 12, bottom: 0};
            $target.addClass('is-mobile');
        } else {
            $target.removeClass('is-mobile');
        }

        $(target + ' svg').remove();

        var svg = d3.select(target)
            .append('svg')
            .attr('width', width)
            .attr('height', height)

        width = $target.width() - margin.left - margin.right;
        height = height - margin.top - margin.bottom;

        var y = d3.scaleBand()
                .range([0, height])
                .padding(isMobile ? 0.6 : 0.3);

        var x = d3.scaleLinear()
            .range([0, width]);

        y.domain(data[dataType].map(function(d) { return d.Team }));
        x.domain([0, 100]);

        var ticks = dataType === 'hockey' ? 10 : 4;

        svg.append('g')
            .attr('class', 'grid-lines')
            .attr('transform', 'translate(' + margin.left + ', 0)')
            .call(d3.axisTop(x)
                .ticks(ticks)
                .tickSize(-(height + margin.top + margin.bottom))
                .tickFormat(function(d) { return d == 0 ? d + '%' : d})
            )
            .selectAll('.tick text')
            .attr('y', 12)
            .attr('x', 0)

        var graph = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        if ($target.data('ref')) {
            var ref = svg.append('g')
                .attr('class', 'reference-tick')
                .attr('transform', 'translate(' + (x($target.data('ref')) + margin.left) + ', 12)');

            ref.append('rect')
                .attr('class', 'reference-tick__line')
                .attr('y', 5)
                .attr('width', 1)
                .attr('height', height + margin.bottom + margin.top);

            ref.append('text')
                .attr('class', 'reference-tick__label')
                .text('Knights')
        }

        var team = graph.selectAll('g.team')
            .data(data[dataType])
            .enter()
            .append('g')
            .attr('class', function(d) { return 'team' + (d.Team == 'Las Vegas Knights' ? ' knights' : '') });

        team.append('text')
            .attr('y', function(d) { return (isMobile ? -16 : 0) + y(d.Team) })
            .attr('x', isMobile ? 0 : -6)
            .attr('class', 'team-name')
            .text(function(d) { return d.Team });

        team.append('text')
            .attr('y', function(d) { return y(d.Team) })
            .attr('x', -6)
            .attr('class', 'team-year')
            .text(function(d) { return d.Year + '-' + (d.Year + 1).toString().substring(2) });

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
