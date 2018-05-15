var d3 = Object.assign(
    {},
    require('d3-selection'),
    require('d3-scale'),
    require('d3-axis'),
    require('d3-shape')
)

// data
var data = {};
    data.hockey = require('../data/hockey.json');
    data.baseball = require('../data/baseball.json');
    data.basketball = require('../data/basketball.json');
    data.football = require('../data/football.json');
    data.diamondbacks = require('../data/diamondbacks.json');
    data.bucks = require('../data/bucks.json');
    data.storm = require('../data/storm.json');
    data.marlins = require('../data/marlins.json');

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

        this.createChart('.uit-chart--diamondbacks');
        this.createChart('.uit-chart--bucks');
        this.createChart('.uit-chart--storm');
        this.createChart('.uit-chart--marlins');
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

        var graph = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

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
    },

    createChart(target) {
        var $target = $(target);
        var dataType = $(target).data('type');
        var margin = {top: 150, left: 30, right: 30, bottom: 10};
        var width = $target.width();
        var height = 8 * 24 + margin.top;

        $(target + ' svg').remove();

        var svg = d3.select(target)
            .append('svg')
            .attr('width', width)
            .attr('height', height)

        width = $target.width() - margin.left - margin.right;
        height = height - margin.top - margin.bottom;

        var x = d3.scaleLinear()
            .range([0, width]);

        var y = d3.scaleLinear()
            .range([0, height]);

        if (dataType === 'bucks') {
            yRange = 7;
        } else if (dataType === 'storm') {
            yRange = 8;
        } else if (dataType === 'marlins') {
            yRange = 6;
        } else {
            yRange = 5;
        }

        x.domain([data[dataType][0].Season, data[dataType][data[dataType].length - 1].Season ]);
        y.domain([1, yRange]);

        var graph = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        graph.append('g')
            .attr('class', 'grid-lines')
            .call(d3.axisLeft(y)
                .ticks(yRange)
                .tickSize(-width)
            )

        graph.append('g')
            .attr('class', 'grid-lines')
            .attr('transform', 'translate(0, -' + (margin.top - 20) + ')')
            .call(d3.axisTop(x)
                .ticks(data[dataType].length)
                .tickSize(-(height + margin.top - 20))
            )

        graph.append('text')
            .attr('class', 'uit-chart__playoff-label')
            .text('Playoffs')
            .attr('transform', 'translate(-20, -65) rotate(-90)');

        graph.append('text')
            .attr('class', 'uit-chart__league-label')
            .text('Finished in division')
            .attr('transform', 'translate(-20, 95) rotate(-90)');

        var line = d3.line()
            .x(function(d) { return x(d.Season) })
            .y(function(d) { return y(d.Division) });

        graph.append('path')
            .datum(data[dataType])
            .attr('class', 'uit-chart__rule')
            .attr('d', line)

        var season = graph.append('g')
            .attr('class', 'seasons')
            .selectAll('g.season')
            .data(data[dataType])
            .enter()
            .append('g')
            .attr('class', 'season');

        season.append('ellipse')
            .attr('class', 'uit-chart__season-marker')
            .attr('cx', function(d) { return x(d.Season) })
            .attr('cy', function(d) { return y(d.Division) })
            .attr('rx', 10)
            .attr('ry', 10);

        season.append('text')
            .attr('class', 'uit-chart__season-label')
            .attr('x', function(d) { return x(d.Season) })
            .attr('y', function(d) { return y(d.Division) })
            .text(function(d) { return d.Division })

        season.append('text')
            .attr('class', 'uit-chart__season-year')
            .attr('x', function(d) { return x(d.Season) })
            .attr('y', -margin.top + 14)
            .text(function(d) { return d.Season });

        season.filter(function(d) { return d.NLDS !== null })
            .append('ellipse')
            .attr('class', function(d) { return 'uit-chart__playoff-marker ' + (d.NLDS == 'Lost' ? 'uit-chart__playoff-marker--lost' : 'uit-chart__playoff-marker--win') })
            .attr('cy', -35 )
            .attr('cx', function(d) { return x(d.Season) } )
            .attr('rx', 10)
            .attr('ry', 10);

        season.filter(function(d) { return d.NLCS !== null })
            .append('ellipse')
            .attr('class', function(d) { return 'uit-chart__playoff-marker ' + (d.NLCS == 'Lost' ? 'uit-chart__playoff-marker--lost' : 'uit-chart__playoff-marker--win') })
            .attr('cy', -70 )
            .attr('cx', function(d) { return x(d.Season) } )
            .attr('rx', 10)
            .attr('ry', 10);

        season.filter(function(d) { return d.WS == 'Lost' })
            .append('ellipse')
            .attr('class', 'uit-chart__playoff-marker uit-chart__playoff-marker--lost')
            .attr('cy', -105 )
            .attr('cx', function(d) { return x(d.Season) } )
            .attr('rx', 10)
            .attr('ry', 10);

        var trophy = 'mlb';

        if (dataType === 'storm') {
            trophy = 'wnba'
        } else if (dataType === 'bucks') {
            trophy = 'nba'
        }

        season.filter(function(d) { return d.WS == 'Win' })
            .append('svg:image')
            .attr('x', function(d) { return x(d.Season) - 20 })
            .attr('y', -125)
            .attr('width', 40)
            .attr('height', 40)
            .attr('xlink:href', '@@assetPath@@/assets/images/' + trophy + '.png' );
    },
};
