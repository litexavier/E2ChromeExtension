(function($){
    // the code of this function is from 
    // http://lucassmith.name/pub/typeof.html
    $.type = function(o){
        var _toS = Object.prototype.toString;
        var _types = {
            'undefined': 'undefined',
            'number': 'number',
            'boolean': 'boolean',
            'string': 'string',
            '[object Function]': 'function',
            '[object RegExp]': 'regexp',
            '[object Array]': 'array',
            '[object Date]': 'date',
            '[object Error]': 'error'
        };
        return _types[typeof o] || _types[_toS.call(o)] || (o ? 'object' : 'null');
    };
    // the code of these two functions is from mootools
    // http://mootools.net
    var $specialChars = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    };
    var $replaceChars = function(chr){
        return $specialChars[chr] || '\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16);
    };
    $.toJSON = function(o){
        var s = [];
        switch ($.type(o)) {
            case 'undefined':
                return 'undefined';
                break;
            case 'null':
                return 'null';
                break;
            case 'number':
            case 'boolean':
            case 'date':
            case 'function':
                return o.toString();
                break;
            case 'string':
                return '"' + o.replace(/[\x00-\x1f\\"]/g, $replaceChars) + '"';
                break;
            case 'array':
                for (var i = 0, l = o.length; i < l; i++) {
                    s.push($.toJSON(o[i]));
                }
                return '[' + s.join(',') + ']';
                break;
            case 'error':
            case 'object':
                for (var p in o) {
                    s.push('\"' + p + '\"' + ':' + $.toJSON(o[p]));
                }
                return '{' + s.join(',') + '}';
                break;
            default:
                return '';
                break;
        }
    };
    $.evalJSON = function(s){
        if ($.type(s) != 'string' || !s.length) 
            return null;
        return eval('(' + s + ')');
    };
})(jQuery);
$(function(){init();});
function init() {
	//addCardsByList([2469,1533,2468,1329],{"1415":4,"1419":4,"1526":4,"1532":2,"1587":2,"1590":4});
	extraButtonMod();
}
function extraButtonMod() {
	$(".s-cr2z2 .deck-buttonset").after("<div class=\"extradecks\"><div class=\"extradecksfields\"><textarea class=\"extradeckcode\"></textarea></div><div class=\"buttonset\"><div class=\"button bd1 extra-to-local-bt\"><div class=\"button-inner c2\">To Local</div></div><div class=\"button bd1 extra-from-local-bt\"><div class=\"button-inner c2\">From Local</div></div></div></div>");
	$(".extra-to-local-bt").bind("click",decksToLocal);
	$(".extra-from-local-bt").bind("click",decksFromLocal);
}
function decksToLocal() {
	e={};
	de=[]; $(".s-cr2z2 .deck-scards .scard").attr("data-id",function(i,e){de.push(e);});
	e["scards"]=de;
	de={};$(".s-cr2z2 .deck-cards .card").each(function(i){de[$(this).attr("data-id")]=$(this).find(".count").text()});
	e["cards"]=de;
	$(".extradeckcode").val($.toJSON(e));
}
function decksFromLocal() {
	s=$(".extradeckcode").val();
	e=$.evalJSON(s);
	addCardsByList(e);
}
function addCardsByList(e) {
	// to first page
	x=$(".dataview-page-prev"); prot=50; // protected for dead while
	while(x.hasClass("dataview-page-enabled") && prot>0){
		x.click(); prot--;
	}
	deckClear();
	x=$(".dataview-page-next"); prot=50; // protected for dead while
	b=$(".s-cr2z1 .cards");
	while(prot>0){
		addCardsByListInPage(b,e["scards"],e["cards"]);
		if(!x.hasClass("dataview-page-enabled")) break;
		x.click(); prot--;
	}
}
function addCardsByListInPage(b,s,e) {
	for(var c in e) {
		addCardInPage(b,c,e[c]);
	}
	for(var c in s) {
		addSCardInPage(b,s[c]);
	}
}
function addCardInPage(b,e,c) {
	for(i=0;i<c;i++) {
		l = b.find("div[data-id='"+e+"'] .button.add-card");
		if(l.size()>0) {
			t = l.get(0);
			t.click();
		}
	}
}
function addSCardInPage(b,e) {
	l = b.find("div[data-id='"+e+"'] .button.add-scard");
	if(l.size()>0) {
		t = l.get(0);
		t.click();
	}
}
function deckClear() {
	t = $(".button.deck-clear").get(0);
	t.click();
}
