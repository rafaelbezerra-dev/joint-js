/**
@author Rafael Nascimento Bezerra

*/
function BaseSymbol() {
    this.constructor.id_count++;
    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.innerSVG = '';
    this.__parent__ = undefined;
    this.__svg__ = undefined;
}

BaseSymbol.id_count = 0;

BaseSymbol.prototype.updateTransform = function () {
    this.__svg__.setAttributeNS(null,
        'transform',
        'translate(' + this.x + ',' + this.y + ') rotate(' + this.rotation + ')'
    );
};

BaseSymbol.prototype.setX = function (v) {
    this.x = v || this.x;
    return this;
};

BaseSymbol.prototype.setY = function (v) {
    this.y = v || this.y;
    return this;
};

BaseSymbol.prototype.setRotation = function (v) {
    this.rotation = v || this.rotation;
    return this;
};

BaseSymbol.prototype.getElement = function () {
    if (!this.__svg__) {
        this.__svg__ = document.createElementNS(SVG.config.xmlns, 'g');
        this.__svg__.innerHTML = this.innerSVG;
        this.__svg__.style = {
            cursor: 'move',
        };

        this.updateTransform();

        var __this__ = this;
        var x = y =  mX = mY = 0;


        // EVENT LISTENERS
        var onmousemove  = function(evt){
            __this__.setX(x + (evt.clientX - mX))
                .setY(y + (evt.clientY - mY))
                .updateTransform();
        };
        this.__svg__.onclick = function (evt) {
            console.log('click!!!');
        };
        this.__svg__.oncontextmenu = function (evt) {
            evt.symbol = __this__;
        };
        this.__svg__.onmousedown = function (evt) {
            x = __this__.x;
            y = __this__.y;
            mX = evt.clientX;
            mY = evt.clientY;
            document.addEventListener('mousemove', onmousemove, false);
        };
        this.__svg__.onmouseup = function (evt) {
            document.removeEventListener('mousemove', onmousemove);
        };
        this.__svg__.onmouseenter = function (evt) {
            // mouseOver = true;
        };
        this.__svg__.onmouseleave = function (evt) {
            // mouseOver = false;
        };


    }

    return this.__svg__;
}





Rect.prototype = new BaseSymbol();
Rect.prototype.constructor = Rect;
Rect.__super__ = BaseSymbol.prototype;
function Rect(){
    this.innerSVG = [
        '<rect width="100" ',
            'height="50" ',
            'style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />',
    ].join('');
}

Rect.prototype.getElement = function () {
    return Rect.__super__.getElement.call(this);
};


//
// Symbols.Shapes.Resistor = {
//     markup:[
//         '<g class="rotatable">',
//         '<g class="scalable">',
//         '<path class="body" d="M10,15h15l2.5-5l5,10l5-10l5,10l5-10l5,10l2.5-5h15" />',
//         '<rect class="body-bg"/>',
//         '<circle class="left-port"  />',
//         '<circle class="right-port" />',
//         '</g>',
//         '<text class="label"/>',
//         '</g>',
//     ].join(''),
// }
