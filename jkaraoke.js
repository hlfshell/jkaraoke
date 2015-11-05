"use strict"

function Karaoke(opts){
	this.target = opts.target;
	this.lyrics = opts.lyrics;
	this.unHighlightedColor = opts.unHighlightedColor;
	this.highlightedColor = opts.highlightedColor;

	this._startedAt = 0;
	this._lyricPointer = 0;
	this._highlightPointer = 0;
	this._highlightedWords = [];
	this._unHighlightedWords = []

	this._lyricTimeout = null;
	this._highlightTimeout = null;
};

Karaoke.prototype.start = function(){
	this._startedAt = (new Date()).getTime();
	this._showCurrentLyrics();
	this._stopFlag = false;
};

Karaoke.prototype.reset = function(){
	this._lyricPointer = 0;
	this._highlightPointer = 0;
	this._highlightedWords = [];
	this._unHighlightedWords = []

	this._lyricTimeout = null;
	this._highlightTimeout = null;
};

Karaoke.prototype._showNextLyric = function(){
	var self = this;

	if(self._stopFlag) return;

	if(++self._lyricPointer >= self.lyrics.length)
		return self.stop();

	//Reset pointers
	self._highlightPointer = 0;

	//Clear out arrs
	self._highlightedWords = [];
	self._unHighlightedWords = [];

	//Clear timeouts
	if(self._lyricTimeout) clearTimeout(self._lyricTimeout);
	if(self._highlightTimeout) clearTimeout(self._highlightTimeout);

	self._clearText();
	self._showCurrentLyrics();
};

Karaoke.prototype._showCurrentLyrics = function(){
	var self = this;

	if(self.lyrics[self._lyricPointer].type == "delay"){
		self._clearText();
	} else {
		self.lyrics[self._lyricPointer].lyrics.forEach(function(lyric){
			self._unHighlightedWords.push(lyric);
		});

		self._setNextHighlight(self);
	}

	self._lyricTimeout = setTimeout(
		function(){
			self._showNextLyric(self)
		},
		self.lyrics[self._lyricPointer].showFor
	);

	self._setText(self._generateHTML());
};

Karaoke.prototype._setNextHighlight = function(){
	var self = this;

	if(self._stopFlag) return;

	self._highlightTimeout = setTimeout(
		function(){
			//Highlight the word
			self._highlightedWords.push(self._unHighlightedWords.shift());
			self._highlightPointer++;
			self._setText(self._generateHTML(self));
			if(self._highlightPointer < self.lyrics[self._lyricPointer].lyrics.length){
				self._setNextHighlight(self);
			}
		},
		self.lyrics[self._lyricPointer]
				.lyrics[self._highlightPointer]
				.highlightAt
	);
};

Karaoke.prototype.stop = function(){
	this._stopFlag = true;

	//Clear timeouts
	if(self._lyricTimeout) clearTimeout(self._lyricTimeout);
	if(self._highlightTimeout) clearTimeout(self._highlightTimeout);
};

Karaoke.prototype._generateHTML = function(){
	//Highlighted first
	var highlightedSpan = "<span class='karaokeHightlighted'";
	if(this.highlightedColor) highlightedSpan += " style='color: " +
		this.highlightedColor + "' ";
	highlightedSpan += ">"

	this._highlightedWords.forEach(function(word){
		highlightedSpan += word.lyric + " ";
	});

	highlightedSpan += "</span>";

	//Unhighlighted next
	var unHighlightedSpan = "<span class='karaokeUnHightlighted'";
	if(this.unHighlightedColor) unHighlightedSpan += " style='color: " +
		this.unHighlightedColor + "' ";
	unHighlightedSpan += ">"

	this._unHighlightedWords.forEach(function(word){
		unHighlightedSpan += word.lyric + " ";
	});

	unHighlightedSpan += "</span>";

	return highlightedSpan + unHighlightedSpan;
};

Karaoke.prototype._clearText = function(){
	document.getElementById(this.target).innerHTML = "";
};

Karaoke.prototype._setText = function(text){
	document.getElementById(this.target).innerHTML = text;
};
