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

function Link(ix, iy, fx = undefined, fy = undefined) {
    this.__svg__ = document.createElementNS(SVG.config.xmlns, 'line');
    this.__svg__.setAttribute('x1', ix);
    this.__svg__.setAttribute('y1', iy);

    this.__svg__.setAttribute('x2', fx || ix);
    this.__svg__.setAttribute('y2', fy || iy);

    this.__svg__.style.stroke = '#f00';
    this.__svg__.style.strokeWidth = 3;
}

Link.LinkReleaseEvent = 'linkrelease';

Link.prototype.draw = function () {
    // console.log('link draw');
    this.__mouse_drag__ = {
        mousemove: this.onMouseMove.bind(this),
        mouseup: this.onMouseUp.bind(this),
    };

    SVG.draw(this.__svg__);
    document.addEventListener('mousemove', this.__mouse_drag__.mousemove);
    document.addEventListener('mouseup', this.__mouse_drag__.mouseup);
};


Link.prototype.onMouseMove = function (evt) {
    this.updateCoordinates(evt.clientX, evt.clientY)
};

Link.prototype.updateCoordinates = function (x, y) {
    this.__svg__.setAttribute('x2', x);
    this.__svg__.setAttribute('y2', y);
};

Link.prototype.onMouseUp = function (evt) {
    // console.log('link mouse up');
    document.removeEventListener('mousemove', this.__mouse_drag__.mousemove);
    document.removeEventListener('mouseup', this.__mouse_drag__.mouseup);
    this.__mouse_drag__ = {};
    // console.log('dispatching linkrelease event');

    var e = new Event(Link.LinkReleaseEvent);
    e.link = this;
    document.dispatchEvent(e);
};




function Port(x, y){
    // if (!(element instanceof SVGElement)) {
    //     throw new Error('Element provided for Port constructor is not an instance of SVGElement');
    // }
    // this.__svg__ = element;
    this.x = x;
    this.y = y;
    var port_attrs = {
        radius: 6,
        fill: '#656565',
        strokeWidth: 2,
        stroke: '#000',
    };
    this.__svg__ = document.createElementNS(SVG.config.xmlns, 'circle');
    this.__svg__.setAttribute('cx', x);
    this.__svg__.setAttribute('cy', y);
    this.__svg__.setAttribute('r', port_attrs.radius);
    this.__svg__.style.fill = port_attrs.fill;
    this.__svg__.style.strokeWidth = port_attrs.strokeWidth;
    this.__svg__.style.stroke = port_attrs.stroke;


    this.__svg__.addEventListener('mousedown', this.onMouseDown.bind(this));
    // this.__svg__.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.__svg__.addEventListener('mouseenter', this.onMouseEnter.bind(this));

    this.__mouse_drag__ = {};
    this.links = [];
}

Port.prototype.getElement = function () {
    return this.__svg__;
};

Port.prototype.onMouseDown = function (evt) {
    // console.log('port mouse down');
    var coord = SVG.convertCoords(this.__svg__, this.x, this.y);

    var link = new Link(coord.x, coord.y);
    link.draw();
    this.links.push(link);
    evt.stopPropagation();
};

Port.prototype.onMouseUp = function (evt) {
    // console.log('port mouse up');
};

Port.prototype.onMouseEnter = function (evt) {
    // console.log('port mouse enter');
    this.__mouse_drag__ = {
        mouseleave: this.onMouseLeave.bind(this),
        linkrelease: this.onLinkRelease.bind(this),
    };

    this.__svg__.addEventListener('mouseleave', this.__mouse_drag__.mouseleave);
    document.addEventListener('linkrelease', this.__mouse_drag__.linkrelease);
};

Port.prototype.onMouseLeave = function (evt) {
    // console.log('port mouse leave');
    this.__svg__.removeEventListener('mouseleave', this.__mouse_drag__.mouseleave);
    document.removeEventListener('linkrelease', this.__mouse_drag__.linkrelease);

    this.__mouse_drag__.mouseleave = undefined;
    this.__mouse_drag__.linkrelease = undefined;
};

Port.prototype.onLinkRelease = function (evt) {
    // console.log('port link realease');
    var coord = SVG.convertCoords(this.__svg__, this.x, this.y);
    evt.link.updateCoordinates(coord.x, coord.y)
    document.removeEventListener('linkrelease', this.__mouse_drag__.linkrelease);
    this.__mouse_drag__.linkrelease = undefined;
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

        this.symbol.dragble_element.style.cursor = 'move';
        this.__svg__.appendChild(this.symbol.element);
        this.__svg__.appendChild(this.__controls__.getElement());

        this.updateTransform();
        this.attachEventListeners();
    }

    return this.__svg__;
}

BaseSymbol.prototype.attachEventListeners = function () {
    // var __this__ = this;

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

    // this.__svg__.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    // this.__svg__.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    this.symbol.element.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    this.symbol.element.addEventListener('mouseup', this.onMouseUp.bind(this), false);


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
    this.ports = [];
    this.symbol.width = 150;
    this.symbol.height = this.symbol.width/2;

    var rect = document.createElementNS(SVG.config.xmlns, 'rect');
    rect.setAttributeNS(null, 'width', this.symbol.width);
    rect.setAttributeNS(null, 'height', this.symbol.height);
    rect.style.fill = 'rgb(0,0,255)';
    rect.style.strokeWidth = 3;
    rect.style.stroke = 'rgb(0,0,0)';

    var port_left = new Port(0, this.symbol.height/2);
    var port_right = new Port(this.symbol.width, this.symbol.height/2);

    var element = document.createElementNS(SVG.config.xmlns, 'g');
    element.appendChild(rect);
    element.appendChild(port_left.getElement());
    element.appendChild(port_right.getElement());
    this.symbol.dragble_element = rect;
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
