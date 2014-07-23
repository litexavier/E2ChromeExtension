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