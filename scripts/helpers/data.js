var request = require('sync-request');
var fs = require('fs-extra');
var gsjson = require('google-spreadsheet-to-json');
var deasync = require('deasync');
var config = require('../config.json');
var userHome = require('user-home');
var keys = require(userHome + '/.gu/interactives.json');

var data = {};

module.exports = function getData() {
    data.hockey = JSON.parse(fs.readFileSync('./scripts/data/hockey.json', 'utf8'));

    return data;
};