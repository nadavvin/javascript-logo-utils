//sandbox

//reference: http://www.cs.berkeley.edu/~bh/v2ch14/manual.html

//add support in jrunscript
if(typeof console == 'undefined') {
	if(typeof print == 'function') {
		console = {};
		console.log = function() {
			print(JSON.stringify(arguments));
		}
	}
}

var example_program = "forward 100\nprint \"test";

var tokens = ["\n", " ", '"', ';'];
var tokensNames = ["end_line_n", "space", "strMark", "semicolon"];
/*var tokens = {
	"end_line_n": "\n",
	"space": " "
};*/

var git = {
	'runtime': [],
	'stack': [],
	'data': [],
	'func_ref': {}
};

var built_in_exec_func = ['forward', 'print'];

var states = {
	"nothing": 0,
	"comment": 1,
	"func": 3,
	"param": 4,
	"error": 5
}

function State() {
	this.state;
	this.expect = {};
	this.expectWithWord = {};
}

var sNothing	= new State();
var sExecute	= new State();
var sParam		= new State();
var sFunc		= new State();
var sError		= new State();
var sComment	= new State();

sNothing.state = states.nothing;
sNothing.expect[tokensNames.end_line_n] = sNothing;
sNothing.expect[tokensNames.space]		= sNothing;
sNothing.expect[tokensNames.strMark]	= sError;
sNothing.expect[tokensNames.semicolon] = sComment;

sNothing.expectWithWord[tokensNames.end_line_n] = sExecute;
sNothing.expectWithWord[tokensNames.space] = sExecute;

sFunc.state = states.func;

sComment.state = states.comment;
sComment.except[tokensNames.end_line_n] = sNothing;

parser(example_program);


function parser(p) {
	var word = "";
	var state = sNothing;
	
	var c, token;
	for(var i=0;i<p.length;i++) {
		
		if(tokens.indexOf(p[i]) > -1) {
			var n = tokens.indexOf(p[i]);
			token = tokensNames[n];
			console.log(n, tokensNames);
			//console.log(token, p[i]);return;
			if(!word.length) {
				state = state.expect[token];
			} else {
				if(typeof(state) == 'object' && state !== null && typeof(state.expectWithWord[token]) !== 'undefined') {
					state = state.expectWithWord[token];
				} else state = null ;
			}
			
			if(state) {
				commander.trigger(state.state, word);
				word = '';
			}
			
		} else {
			word += p[i];
		}
		
	}
	
	if(state) commander.trigger(state.state, word);
}

var commander = new Commander();

function Commander() {
	
	var binding = {};
	
	this.trigger = function(state, word) {
			console.log(states[states.indexOf(state)], word);
	}
	
	this.bind = function(state, callback) {}
}
