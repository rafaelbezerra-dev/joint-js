/**
@author Rafael Nascimento Bezerra

*/
function SVG(parent) {
    this.__init__();
    this.__parent__ = parent;
    this.__parent__.appendChild(this.__DOM__);
}

SVG.config = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 800,
    height: 600,
};

SVG.prototype.__init__ = function () {
    this.__DOM__ = document.createElementNS(SVG.config.xmlns, 'svg');
    this.__DOM__.setAttributeNS(null, 'viewBox', '0 0 ' + SVG.config.width + ' ' + SVG.config.height);
    this.__DOM__.setAttributeNS(null, 'width', SVG.config.width);
    this.__DOM__.setAttributeNS(null, 'height', SVG.config.height);
    this.__DOM__.style = {display: 'block' };


    var __this__ = this;
    this.__DOM__.oncontextmenu = function(evt) {
        __this__.erase(evt.symbol);
        return false;
    };
};


SVG.prototype.draw = function (symbol) {
    if (symbol instanceof BaseSymbol){
        this.__DOM__.appendChild(symbol.getElement());
    }
};

SVG.prototype.erase = function (symbol) {
    if (symbol instanceof BaseSymbol){
        this.__DOM__.removeChild(symbol.getElement());
    }
};
