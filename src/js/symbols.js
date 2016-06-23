/**
@author Rafael Nascimento Bezerra

*/

function Controls(posx, posy, onrotate = undefined, ondelete = undefined) {
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
    this.__mouse_drag__ = {};

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
            this.symbol.width + 10,
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

    // EVENT LISTENERS
    // this.__svg__.onclick = function (evt) {
    //     console.log('click!!!');
    // };
    // this.__svg__.oncontextmenu = function (evt) {
    //     evt.symbol = __this__;
    // };
    // this.__svg__.onmouseenter = function (evt) {
    //     // mouseOver = true;
    // };
    // this.__svg__.onmouseleave = function (evt) {
    //     // mouseOver = false;
    // };

    this.__svg__.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    this.__svg__.addEventListener('mouseup', this.onMouseUp.bind(this), false);


};

BaseSymbol.prototype.onMouseDown = function (evt) {
    this.__mouse_drag__ = {
        fn: this.onMouseMove.bind(this),
        x:  this.x,
        y:  this.y,
        mX: evt.clientX,
        mY: evt.clientY,
    };
    document.addEventListener('mousemove', this.__mouse_drag__.fn, false);
};

BaseSymbol.prototype.onMouseUp = function (evt) {
    this.__mouse_drag__ = {};
    document.removeEventListener('mousemove', this.__mouse_drag__.fn);
};

BaseSymbol.prototype.onMouseMove = function (evt) {
    this.setX(this.__mouse_drag__.x + (evt.clientX - this.__mouse_drag__.mX))
        .setY(this.__mouse_drag__.y + (evt.clientY - this.__mouse_drag__.mY))
        .updateTransform();
};

BaseSymbol.prototype.onRotate = function (evt) {
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

    var rect = document.createElementNS(SVG.config.xmlns, 'rect');
    rect.setAttributeNS(null, 'width', this.symbol.width);
    rect.setAttributeNS(null, 'height', this.symbol.height);
    rect.style.fill = 'rgb(0,0,255)';
    rect.style.strokeWidth = 3;
    rect.style.stroke = 'rgb(0,0,0)';

    var port_attrs = {
        radius: 5,
        fill: '#656565',
        strokeWidth: 2,
        stroke: '#000',
    };
    var port_letf = document.createElementNS(SVG.config.xmlns, 'circle');
    port_letf.setAttribute('cx', 0);
    port_letf.setAttribute('cy', (this.symbol.height/2) - (port_attrs.radius/2));
    port_letf.setAttribute('r', port_attrs.radius);
    port_letf.style.fill = port_attrs.fill;
    port_letf.style.strokeWidth = port_attrs.strokeWidth;
    port_letf.style.stroke = port_attrs.stroke;

    var port_right = document.createElementNS(SVG.config.xmlns, 'circle');
    port_right.setAttribute('cx', this.symbol.width);
    port_right.setAttribute('cy', (this.symbol.height/2) - (port_attrs.radius/2));
    port_right.setAttribute('r', port_attrs.radius);
    port_right.style.fill = port_attrs.fill;
    port_right.style.strokeWidth = port_attrs.strokeWidth;
    port_right.style.stroke = port_attrs.stroke;

    // var port1 = document.createElementNS(SVG.config.xmlns, 'circle');

    var element = document.createElementNS(SVG.config.xmlns, 'g');
    element.appendChild(rect);
    element.appendChild(port_letf);
    element.appendChild(port_right);
    this.symbol.element = element;

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
