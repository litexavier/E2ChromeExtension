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
	extraButtonMod();
	rsh = new ResizeEventHandler;
	$(window).resize(rsh, function(e){return e.data.onResize(e);});
	//parseAllCardsID();
}
function extraButtonMod() {
//$(".s-cr2z2 .deck-buttonset").after("<div class=\"extradecks\"><div class=\"extradecksfields\"><textarea class=\"extradeckcode\"></textarea></div><div class=\"buttonset\"><div class=\"button bd1 extra-to-local-bt\"><div class=\"button-inner c2\">To Local</div></div><div class=\"button bd1 extra-from-local-bt\"><div class=\"button-inner c2\">From Local</div></div></div></div>");
	$(".s-cr2z2 .deck-buttonset").append("<div class=\"button button-s save-deck-to-local\" title=\"保存牌组\"><div class=\"button-inner c3\"><span class=\"fonticon-l fonticon-download\"></span></div></div>");
	$(".s-cr2z2 .deck-buttonset").append("<div class=\"button button-s load-deck-from-local\" title=\"读取牌组\"><div class=\"button-inner c3\"><span class=\"fonticon-l fonticon-upload\"></span></div></div>");
	$(".save-deck-to-local").bind("click",saveDeckToLocal);
	$(".load-deck-from-local").bind("click",loadDeckFromLocal);
//	$(".extra-to-local-bt").bind("click",decksToLocal);
//	$(".extra-from-local-bt").bind("click",decksFromLocal);
}
function saveDeckToLocal() {
	s=new Dialog;
	var dlgtxt = "<div class=\"s-title c2\">保存到本地</div>";
	dlgtxt = dlgtxt + '<div class="hr bg1"></div>';
	dlgtxt = dlgtxt + '<div class="s-text">';
	dlgtxt = dlgtxt + '<div class="label">牌组名称</div>';
	dlgtxt = dlgtxt + '<input class="input bd1 c2" id="name" value="">';
	dlgtxt = dlgtxt + '</div>';
	dlgtxt = dlgtxt + '<div class="s-text"><div class="category c3">可选卡组</div><div class="deck-name-container">';
	for(i in localStorage){
		if(i.slice(0,4) == 'deck') {
			dlgtxt = dlgtxt + '<div class="c3 dialog-deck-name-list">' + i.slice(5) + '</div>'; 
		}
	}
	dlgtxt = dlgtxt + '</div></div>';
	dlgtxt = dlgtxt + '<div class="s-buttonset bd2">';
	dlgtxt = dlgtxt + '<div class="button bd2 opacity modal-dialog-close"><div class="button-inner c3">关闭</div></div>';
	dlgtxt = dlgtxt + '<div class="button bd1 opacity modal-dialog-ok"><div class="button-inner c2">确定</div></div>';
	dlgtxt = dlgtxt + '</div>';
	dlgtxt = '<div class="wf-deck"><div class="c-overlay opacity">' + dlgtxt + '</div></div>';
	s.done=function(){
		var p='deck-'+this.dlgtext.find('#name').val();
		localStorage[p] = $.toJSON(getDeckArr());
		this.close();
	};
	s.deckbuttonpress=function(bt) {
		var p=$(bt).text();
		this.dlgtext.find('#name').val(p);
		this.dlgtext.find('#name').text(p);
	};
	s.setDlgText(dlgtxt);
	s.hookAction("click", "dialog-deck-name-list", function(e){return e.data.deckbuttonpress(this);});
	s.hookAction("click", "modal-dialog-close", function(e){return e.data.close();});
	s.hookAction("click", "modal-dialog-ok", function(e){return e.data.done();});
	s.show();
}
function loadDeckFromLocal() {
	s=new Dialog;
	var dlgtxt = "<div class=\"s-title c2\">从本地读取</div>";
	dlgtxt = dlgtxt + '<div class="hr bg1"></div>';
	dlgtxt = dlgtxt + '<div class="s-text">';
	dlgtxt = dlgtxt + '<div class="label">牌组名称</div>';
	dlgtxt = dlgtxt + '<input class="input bd1 c3" id="name" value="">';
	dlgtxt = dlgtxt + '</div>';
	dlgtxt = dlgtxt + '<div class="s-text"><div class="category c3">可选卡组</div><div class="deck-name-container">';
	for(i in localStorage){
		if(i.slice(0,4) == 'deck') {
			dlgtxt = dlgtxt + '<div class="c3 dialog-deck-name-list">' + i.slice(5) + '</div>'; 
		}
	}
	dlgtxt = dlgtxt + '</div></div>';
	dlgtxt = dlgtxt + '<div class="s-buttonset bd2">';
	dlgtxt = dlgtxt + '<div class="button bd2 opacity modal-dialog-close"><div class="button-inner c3">关闭</div></div>';
	dlgtxt = dlgtxt + '<div class="button bd1 opacity modal-dialog-ok"><div class="button-inner c2">确定</div></div>';
	dlgtxt = dlgtxt + '</div>';
	dlgtxt = '<div class="wf-deck"><div class="c-overlay opacity">' + dlgtxt + '</div></div>';
	s.done=function(){
		var p='deck-'+this.dlgtext.find('#name').val();
		deckstr = localStorage[p];
		addCardsByList($.evalJSON(deckstr));
		this.close();
	};
	s.deckbuttonpress=function(bt) {
		var p=$(bt).text();
		this.dlgtext.find('#name').val(p);
		this.dlgtext.find('#name').text(p);
	};
	s.setDlgText(dlgtxt);
	s.hookAction("click", "dialog-deck-name-list", function(e){return e.data.deckbuttonpress(this);});
	s.hookAction("click", "modal-dialog-close", function(e){return e.data.close();});
	s.hookAction("click", "modal-dialog-ok", function(e){return e.data.done();});
	s.show()
}
function decksToLocal() {
	$(".extradeckcode").val($.toJSON(getDeckArr()));
}
function getDeckArr() {
	var e={};
	de=[]; $(".s-cr2z2 .deck-scards .scard").attr("data-id",function(i,e){de.push(e);});
	e["scards"]=de;
	de={};$(".s-cr2z2 .deck-cards .card").each(function(i){de[$(this).attr("data-id")]=$(this).find(".count").text()});
	e["cards"]=de;
	return e;
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
function parseAllCardsID(e) {
	x=$(".dataview-page-prev"); prot=50; // protected for dead while
	while(x.hasClass("dataview-page-enabled") && prot>0){
		x.click(); prot--;
	}
	x=$(".dataview-page-next"); prot=50; // protected for dead while
	b=$(".s-cr2z1 .cards");
	var l=[];
	while(prot>0){
		s=b.find(".card");
		for(var i=0;i<s.length;i++) {
			l.push(s[i].getAttribute("data-id"));
		}
		s=b.find(".scard");
		for(var i=0;i<s.length;i++) {
			l.push(s[i].getAttribute("data-id"));
		}
		if(!x.hasClass("dataview-page-enabled")) break;
		x.click(); prot--;
	}
	$(".extradeckcode").val($.toJSON(l));
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
function Dialog() {
	Dialog.prototype.resize=function() {
		x=document.body.scrollWidth;
		y=document.body.scrollHeight;
		this.data.css("width", x);
		this.data.css("height", y);
	}
	Dialog.prototype.setDlgText=function(d) {
		this.dlgtext=$("<div class=\"modal-dialog\" tabindex=\"0\" role=\"dialog\" aria-labelledby=\":0\">" + d + "</div>");
	}
	Dialog.prototype.show=function() {
		this.data=$("<div class=\"modal-dialog-bg\"></div>");
		this.dlgtext.css("left", document.body.scrollWidth/4);
		this.dlgtext.css("top", "160px");
		this.dlgtext.css("position", "absolute");
		this.data.css("opacity", "0.6");
		this.resize();
		$(document.body).append(this.data);
		$(document.body).append(this.dlgtext);
		rsh.addTrigger(this);
		this.data.click(this, function(e){e.data.close()});
	}
	Dialog.prototype.onResize=function(e) {
		this.resize();
	}
	Dialog.prototype.close=function() {
		this.data.remove();
		this.dlgtext.remove();
		rsh.delTrigger(this);
	}
	Dialog.prototype.hookAction=function(act, id, cb) {
		this.dlgtext.find('.' + id).bind(act,this,cb);
	}
	return this;
}
function ResizeEventHandler() {
	this.eventqueue=[];
	ResizeEventHandler.prototype.onResize=function(e) {
		for(var i=0;i<this.eventqueue.length;i++) {
			this.eventqueue[i].onResize(e);
		}
	}
	ResizeEventHandler.prototype.addTrigger=function(tr) {
		this.eventqueue.push(tr);
	}
	ResizeEventHandler.prototype.delTrigger=function(tr) {
		for(var i=0;i<this.eventqueue.length;i++)
			if(this.eventqueue[i] == tr) {
				this.eventqueue.splice(i,1);
				break;
			}
	}
}
