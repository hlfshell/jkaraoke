
function Karaoke(opts){
	this.target = opts.target;
	this.lyrics = opts.lyrics;
	this.unhighlightedText = opts.unhighlightedTexts; 
	this.highlightedText;
	
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
};

Karaoke.prototype._showNextLyric = function(){
	if(++this._lyricPointer >= this.lyrics.length)
		this.stop();
	
	//Increment and reset pointers
	this._lyricPointer++;
	this._highlightPointer = 0;
	
	//Clear timeouts
	if(this._lyricTimeout) clearTimeout(this._lyricTimeout);
	if(this._highlightTimeout) clearTimeout(this._highlightTimeout);
	
	this._clearText();
	this._showCurrentLyrics();
};

Karaoke.prototype._showCurrentLyrics = function(){
	if(this.lyrics[this._lyricPointer].type == "delay"){
		this._clearText();
	} else {
		this.lyrics[this._lyricPointer].lyrics.forEach(function(lyric){
			this._unhighlightedWords.push(lyric);
		});
		this._generateHTML();
	}
	
	this._lyricTimeout = setTimeout(
		this._showNextLyric,
		this.lyrics[this._lyricPointer].showFor
	);
	
	this._setText(this._setNextHighlight());
};

Karaoke.prototype._setNextHighlight = function(){
	this._highlightTimeout = setTimeout(
		function(){
			//Highlight the word
			this._highlightPointer++;		
		},
		this.lyrics[this._lyricPointer]
			.lyrics[this._highlightPointer]
			.highlightAt
	);
};

Karaoke.prototype.stop = function(){
	
};

Karaoke.prototype._generateHTML = function(){
	//Highlighted first
	var highlightedSpan = "<span class='karaokeHightlighted'";
	if(this.highlightedText) highlightedSpan += " color='color: " +
		this.highlightedText + "' ";
	highlightedSpan += ">"
	
	this._highlightedWords.forEach(function(word){
		highlightedSpan += word + " ";
	});
	
	highlightedSpan += "</span>";
	
	//Unhighlighted next
	var unHighlightedSpan = "<span class='karaokeHightlighted'";
	if(this.unHighlightedText) unHighlightedSpan += " color='color: " +
		this.unHighlightedText + "' ";
	unHighlightedSpan += ">"
	
	this._unHighlightedWords.forEach(function(word){
		unHighlightedSpan += word + " ";
	});
	
	unHighlightedSpan += "</span>";
};

Karaoke.prototype._clearText = function(){
	document.getElementById(this.target).innerHTML("");
};

Karaoke.prototype._setText = function(text){
	document.getElementById(this.target).innerHTML(text);
};