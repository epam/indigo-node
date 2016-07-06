var indigo = require('./indigo');
var bingo = require('./bingo');

var IndigoRenderer = require('./indigo_renderer');
var IndigoInchi = require('./indigo_inchi');

module.exports = {
	Indigo: indigo.Indigo,
	IndigoException: indigo.IndigoException,
	Bingo: bingo.Bingo,
	BingoException: bingo.BingoException,
	IndigoRenderer: IndigoRenderer,
	IndigoInchi: IndigoInchi
};
