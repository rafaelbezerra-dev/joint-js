/**
@author Rafael Nascimento Bezerra

*/
function DrawingEngine(parent) {

    this.config = {
        xmlns: "http://www.w3.org/2000/svg",
        width: 1000,
        height: 600,
    };

    this.__init__();

    if (parent) {
        this.setContainer(parent);
    }

}

DrawingEngine.prototype.__init__ = function () {
    this.__layers__ = {
        links: document.createElementNS(this.config.xmlns, 'g'),
        symbols: document.createElementNS(this.config.xmlns, 'g'),
    };
    
    this.__svg__ = document.createElementNS(this.config.xmlns, 'svg');
    this.__svg__.setAttributeNS(null, 'viewBox', '0 0 ' + this.config.width + ' ' + this.config.height);
    this.__svg__.setAttributeNS(null, 'width', this.config.width);
    this.__svg__.setAttributeNS(null, 'height', this.config.height);
    this.__svg__.style = {display: 'block' };

    this.__svg__.appendChild(this.__layers__.links);
    this.__svg__.appendChild(this.__layers__.symbols);

    // var __this__ = this;
    // this.__svg__.oncontextmenu = function(evt) {
    //     // __this__.erase(evt.symbol);
    //     // return false;
    // };
};

DrawingEngine.prototype.setContainer = function (element) {
    if (element instanceof HTMLElement) {
        this.__parent__ = element;
        this.__parent__.appendChild(this.__svg__);
        // console.log(this.__svg__.getBoundingClientRect());
    }
    else{
        throw new Error('Element provided for Port constructor is not an instance of thisElement');
    }
};

DrawingEngine.prototype.draw = function (element) {
    if (element instanceof BaseSymbol) {
        this.__layers__.symbols.appendChild(element.getElement());
    }
    else if (element instanceof Link) {
        this.__layers__.links.appendChild(element.getElement());
    }
    else if (element instanceof SVGElement){
        this.__svg__.appendChild(element);
    }
};

// this.draw = DrawingEngine.prototype.draw;

DrawingEngine.prototype.erase = function (element) {
    if (element instanceof BaseSymbol) {
        this.__layers__.symbols.removeChild(element.getElement());
    }
    else if (element instanceof Link) {
        this.__layers__.links.removeChild(element.getElement());
    }
    else if (element instanceof SVGElement){
        this.__svg__.removeChild(element);
    }
};

DrawingEngine.prototype.convertCoords = function (el,x,y) {

    var offset = this.__svg__.getBoundingClientRect();

    var matrix = el.getScreenCTM();

    return {
        x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
        y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top
    };

};

DrawingEngine.prototype.buildElement = function(name, attrs = undefined, styles = undefined) {
    var el = document.createElementNS(this.config.xmlns, name);
    
    for (var attr in attrs) {
        el.setAttribute(attr, attrs[attr]);
    }

    for (var style in styles) {
        el.style[style] = styles[style];
    }

    return el;
};

DrawingEngine.prototype.groupElements = function(children, attrs = undefined, styles = undefined) {
    var el = document.createElementNS(this.config.xmlns, 'g');

    for (var attr in attrs) {
        el.setAttribute(attr, attrs[attr]);
    }

    for (var style in styles) {
        el.style[style] = styles[style];
    }

    for (var child in children){
        el.appendChild(children[child]);
    }

    return el;  
};


SVG = new DrawingEngine();
