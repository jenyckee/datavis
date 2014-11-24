var express = require('express');
var mongoose = require('mongoose');
var async = require('async');

var router = express.Router();

mongoose.connect('mongodb://jenyckee:abc123@ds055990.mongolab.com:55990/infoviz');

var db = mongoose.connection;

var statementSchema = mongoose.Schema(
{
	id: Number,
	text: String,
	parties: [String]
});

var Statement = mongoose.model('statement', statementSchema, 'statement')

var recordSchema = mongoose.Schema(
{
	id: Number,
	stamp: Number,
	stmt1: Number,
	stmt2: Number,
	stmt3: Number,
	stmt4: Number,
	stmt5: Number,
	stmt6: Number,
	stmt7: Number,
	stmt8: Number,
	stmt9: Number,
	stmt10: Number,
	stmt11: Number,
	stmt12: Number,
	stmt13: Number,
	stmt14: Number,
	stmt15: Number,
	stmt16: Number,
	stmt17: Number,
	stmt18: Number,
	stmt19: Number,
	stmt20: Number,
	stmt21: Number,
	stmt22: Number,
	stmt23: Number,
	stmt24: Number,
	stmt25: Number,
	stmt26: Number,
	stmt27: Number,
	stmt28: Number,
	stmt29: Number,
	stmt30: Number,
	stmt31: Number,
	stmt32: Number,
	stmt33: Number,
	stmt34: Number,
	stmt35: Number,
	cat1: Number,
	cat2: Number,
	cat3: Number,
	cat4: Number,
	cat5: Number,
	cat6: Number,
	cat7: Number,
	cat8: Number,
	cat9: Number,
	cat10: Number,
	cat11: Number,
	cat12: Number,
	stelling1: Boolean,
	stelling2: Boolean,
	stelling3: Boolean,
	stelling4: Boolean,
	stelling5: Boolean,
	stelling6: Boolean,
	stelling7: Boolean,
	stelling8: Boolean,
	stelling9: Boolean,
	stelling10: Boolean,
	stelling11: Boolean,
	stelling12: Boolean,
	stelling13: Boolean,
	stelling14: Boolean,
	stelling15: Boolean,
	stelling16: Boolean,
	stelling17: Boolean,
	stelling18: Boolean,
	stelling19: Boolean,
	stelling20: Boolean,
	stelling21: Boolean,
	stelling22: Boolean,
	stelling23: Boolean,
	stelling24: Boolean,
	stelling25: Boolean,
	stelling26: Boolean,
	stelling27: Boolean,
	stelling28: Boolean,
	stelling29: Boolean,
	stelling30: Boolean,
	stelling31: Boolean,
	stelling32: Boolean,
	stelling33: Boolean,
	stelling34: Boolean,
	stelling35: Boolean
});

var Record = mongoose.model('record', recordSchema, 'record');

/* GET home page. */
router.get('/', function (req, res) {

	Statement.find({}, function (err, statements) {

		async.map(statements, 
			function (statement, done) {
				var condition = JSON.parse("{ \"stmt"+statement.id+"\" : 1 }");
				Record.count(condition, function (err, count) {
					if (err) {
						console.log("Error counting statement agreements")
						done(err);
					}
					else {
						done(null, { id : statement.id, text: statement.text, parties: statement.parties , agreements: count});
					}
				});
			}, 
			function (err, statementsWithCounts) {
			  	res.render('index', {
					stmts: statementsWithCounts,
					title: 'Stemtest Visualization'
				});
			}
		);
	});
});

module.exports = router;