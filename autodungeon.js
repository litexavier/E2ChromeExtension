$(function(){init();});
function init() {
	rsh = new ResizeEventHandler;
	$(window).resize(rsh, function(e){return e.data.onResize(e);});
	dungeontitle=$.trim($('.s-title').text());
	$('.map-node').click(areaDect);
}
function areaDect() {
	subtitle = $.trim($('.area .summary .title-holder .number').text());
	$('.bind-local-deck').remove();
	bt = $('.button-h');
	if(bt.length>0) {
		bt.after('<div class="button-h bind-local-deck"><div class="button-inner c2">卡组绑定</div></div>');
		$('.bind-local-deck').click(bindLocalDeck);
	}
}
function bindLocalDeck() {
	var p='bind-'+dungeontitle+' '+subtitle;
	if(p in localStorage) {
		s=new Dialog;
		var dlgtxt = "<div class=\"s-title c2\">绑定卡组</div>";
		dlgtxt = dlgtxt + '<div class="hr bg1"></div>';
		dlgtxt = dlgtxt + '<div class="label c2">你已经绑定了一个卡组，是否将第一个卡组槽替换为该卡组？"</div>';
		dlgtxt = dlgtxt + '<div class="s-buttonset bd2">';
		dlgtxt = dlgtxt + '<div class="button bd2 opacity modal-dialog-close"><div class="button-inner c3">否</div></div>';
		dlgtxt = dlgtxt + '<div class="button bd2 opacity modal-dialog-renew"><div class="button-inner c2">重新绑定</div></div>';
		dlgtxt = dlgtxt + '<div class="button bd1 opacity modal-dialog-ok"><div class="button-inner c2">是</div></div>';
		dlgtxt = dlgtxt + '</div>';
		dlgtxt = '<div class="wf-deck"><div class="c-overlay opacity">' + dlgtxt + '</div></div>';
		s.sayyes = function() {var deckno=localStorage['maindeckno'];var deckcode=localStorage[localStorage[p]]; asyncUpdateDeck(deckno, deckcode); this.close();};
		s.renewbind = function() {delete localStorage[p]; e.data.close();};
		s.setDlgText(dlgtxt);
		s.hookAction("click", "modal-dialog-renew", function(e){return e.data.renewbind(this);});
		s.hookAction("click", "modal-dialog-close", function(e){return e.data.close();});
		s.hookAction("click", "modal-dialog-ok", function(e){return e.data.sayyes();});
		s.show();
	};
	if(!(p in localStorage)) {
		s=new Dialog;
		var dlgtxt = "<div class=\"s-title c2\">绑定卡组</div>";
		dlgtxt = dlgtxt + '<div class="hr bg1"></div>';
		dlgtxt = dlgtxt + '<input type="hidden" id="name" value="">';
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
			var p='bind-'+dungeontitle+' '+subtitle;
			localStorage[p]='deck-' + this.dlgtext.find('#name').val(); 
			this.close();
		};
		s.deckbuttonpress=function(bt) {
			this.dlgtext.find('.dialog-deck-name-list').removeClass('set-hovered');
			$(bt).addClass('set-hovered');
			var p=$(bt).text();
			this.dlgtext.find('#name').val(p);
		};
		s.setDlgText(dlgtxt);
		s.hookAction("click", "dialog-deck-name-list", function(e){return e.data.deckbuttonpress(this);});
		s.hookAction("click", "modal-dialog-close", function(e){return e.data.close();});
		s.hookAction("click", "modal-dialog-ok", function(e){return e.data.done();});
		s.show();
	}
}
function asyncUpdateDeck(deckno, deckcode) {
	dc=$.evalJSON(deckcode);
	dc['mode'] = 'story';
	if(typeof(deckno) == 'string')
		dc['id'] = parseInt(deckno);
	else
		dc['id'] = deckno;
	for(var i=0;i<dc['scards'].length;i++) {
		if(typeof(dc['scards'][i]) == 'string') {
			dc['scards'][i] = parseInt(dc['scards'][i]);
		}
	}
	$.post("http://cn.estiah2.com/zh/json/character/deck/save", {'json': $.toJSON(dc)}, function (e) {}); 
}
