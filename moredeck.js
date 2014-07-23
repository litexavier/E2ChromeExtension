$(function(){init();});
function init() {
	if (!('maindeckno' in localStorage)) {
		localStorage['maindeckno'] = $('.deck-option').attr('data-id');
	}
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
