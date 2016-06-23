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
    this.__DOM__ = document.createElementNS(this.config.xmlns, 'svg');
    this.__DOM__.setAttributeNS(null, 'viewBox', '0 0 ' + this.config.width + ' ' + this.config.height);
    this.__DOM__.setAttributeNS(null, 'width', this.config.width);
    this.__DOM__.setAttributeNS(null, 'height', this.config.height);
    this.__DOM__.style = {display: 'block' };

    // var __this__ = this;
    // this.__DOM__.oncontextmenu = function(evt) {
    //     // __this__.erase(evt.symbol);
    //     // return false;
    // };
};

DrawingEngine.prototype.setContainer = function (element) {
    if (element instanceof HTMLElement) {
        this.__parent__ = element;
        this.__parent__.appendChild(this.__DOM__);
        // console.log(this.__DOM__.getBoundingClientRect());
    }
    else{
        throw new Error('Element provided for Port constructor is not an instance of thisElement');
    }
};

DrawingEngine.prototype.draw = function (element) {
    if (element instanceof BaseSymbol){
        this.__DOM__.appendChild(element.getElement());
    }
    else if (element instanceof SVGElement){
        this.__DOM__.appendChild(element);
    }
};

// this.draw = DrawingEngine.prototype.draw;

DrawingEngine.prototype.erase = function (element) {
    if (element instanceof BaseSymbol){
        this.__DOM__.removeChild(element.getElement());
    }
    else if (element instanceof SVGElement){
        this.__DOM__.removeChild(element);
    }
};

DrawingEngine.prototype.convertCoords = function (el,x,y) {

      var offset = this.__DOM__.getBoundingClientRect();

      var matrix = el.getScreenCTM();

      return {
        x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
        y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top
      };

};


SVG = new DrawingEngine();
