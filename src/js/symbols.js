/**
@author Rafael Nascimento Bezerra

*/

function Controls(posx, posy, onrotate = undefined) {
    var rotateBtn = Controls.createRotateButton();
    rotateBtn.onclick = onrotate;

    this.__svg__ = document.createElementNS(SVG.config.xmlns, 'g');
    this.__svg__.appendChild(rotateBtn);

    this.__svg__.setAttributeNS(null,
        'transform',
        'translate(' + posx + ', ' + posy + ')'
    );

}

Controls.prototype.getElement = function () {
    return this.__svg__;
};

Controls.createRotateButton = function(){
    var path = document.createElementNS(SVG.config.xmlns, 'path');
    path.setAttributeNS(null, 'fill', '#010101');
    path.setAttributeNS(null,
        'd',
        [
            'M2.5,11.875H0C0,16.355,3.645,20,8.125,20c4.48,0,8.125-3.645,',
            '8.125-8.125c0-4.48-3.645-8.125-8.125-8.125V0l-6.25,5l6.25,5V',
            '6.25c3.102,0,5.625,2.523,5.625,5.625S11.227,17.5,8.125,17.5S',
            '2.5,14.977,2.5,11.875z',
        ].join('')
    );
    path.style.cursor = 'pointer';
    return path;
};

function BaseSymbol() {
    this.constructor.id_count++;
    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.symbol = {
        width: 0,
        height: 0,
        markup:'',
    };
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
    if (v){
        // this.rotation = v*Math.PI/180;
        this.rotation = v;
    }
    return this;
};

BaseSymbol.prototype.getElement = function () {
    if (!this.__svg__) {
        this.__controls__ = new Controls(
            this.symbol.width + 5,
            0,
            this.onRotate.bind(this)
        );
        this.__svg__ = document.createElementNS(SVG.config.xmlns, 'g');

        this.symbol.element.style.cursor = 'move';
        this.__svg__.appendChild(this.symbol.element);
        this.__svg__.appendChild(this.__controls__.getElement());

        this.updateTransform();
        this.initEventHandlers();
    }

    return this.__svg__;
}

BaseSymbol.prototype.initEventHandlers = function () {
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
};

BaseSymbol.prototype.onRotate = function () {
    console.log(this);
    this.setRotation(this.rotation - 45)
        .updateTransform();
};



Rect.prototype = new BaseSymbol();
Rect.prototype.constructor = Rect;
Rect.__super__ = BaseSymbol.prototype;
function Rect(){
    this.symbol.width = 100;
    this.symbol.height = 50;

    this.symbol.element = document.createElementNS(SVG.config.xmlns, 'rect');
    this.symbol.element.setAttributeNS(null, 'width', this.symbol.width);
    this.symbol.element.setAttributeNS(null, 'height', this.symbol.height);
    this.symbol.element.style.fill = 'rgb(0,0,255)';
    this.symbol.element.style.strokeWidth = 3;
    this.symbol.element.style.stroke = 'rgb(0,0,0)';



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
