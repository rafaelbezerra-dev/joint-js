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
        'translate(0' + posx + ', ' + posy + ')'
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





Link.EventNames = {
    LinkRelease: 'linkrelease',
};
function Link(ix, iy, fx = undefined, fy = undefined) {
    this.__svg__ = document.createElementNS(SVG.config.xmlns, 'line');
    this.__svg__.setAttribute('x1', ix);
    this.__svg__.setAttribute('y1', iy);

    this.__svg__.setAttribute('x2', fx || ix);
    this.__svg__.setAttribute('y2', fy || iy);

    this.__svg__.style.stroke = '#f00';
    this.__svg__.style.strokeWidth = 3;

    this.__listeners__ = {};
    this.__listeners__.contextmenu = this.onContextMenu.bind(this);
    this.__svg__.addEventListener('contextmenu', this.__listeners__.contextmenu);
    this.__origin__ = undefined;
    this.__dest__ = undefined;
}

Link.prototype.draw = function () {
    // console.log('link draw');
    this.__listeners__ = {
        mousemove: this.onMouseMove.bind(this),
        mouseup: this.onMouseUp.bind(this),
    };

    SVG.draw(this.__svg__);
    document.addEventListener('mousemove', this.__listeners__.mousemove);
    document.addEventListener('mouseup', this.__listeners__.mouseup);
};

Link.prototype.setOrigin = function (vetex) {
    // console.log(vetex);
    if (vetex instanceof Port){
        this.__origin__ = vetex;
        var el = this.__origin__.getElement();
        // console.log(el);
        this.__listeners__.originmove = this.onOriginChange.bind(this)
        el.addEventListener(Port.EventNames.Move, this.__listeners__.originmove);
    }
};

Link.prototype.setDest = function (vetex) {
    if (vetex instanceof Port){
        this.__dest__ = vetex;
        var el = this.__dest__.getElement();
        // console.log(el);
        this.__listeners__.destmove = this.onDestChange.bind(this)
        el.addEventListener(Port.EventNames.Move, this.__listeners__.destmove);
    }
};

Link.prototype.onMouseMove = function (evt) {
    this.updateDestCoordinates(evt.clientX, evt.clientY)
};

Link.prototype.updateDestCoordinates = function (x, y) {
    this.__svg__.setAttribute('x2', x);
    this.__svg__.setAttribute('y2', y);
};

Link.prototype.onMouseUp = function (evt) {
    // console.log('link mouse up');
    document.removeEventListener('mousemove', this.__listeners__.mousemove);
    document.removeEventListener('mouseup', this.__listeners__.mouseup);
    this.__listeners__ = {};
    // console.log('dispatching linkrelease event');

    var e = new Event(Link.EventNames.LinkRelease);
    e.link = this;
    document.dispatchEvent(e);
};

Link.prototype.onContextMenu = function (evt) {
    this.__svg__.removeEventListener('contextmenu', this.__listeners__.contextmenu);
    evt.stopPropagation();
    SVG.erase(this.__svg__);
    return false;
};

Link.prototype.onOriginChange = function (evt) {
    if (evt && evt.coord){
        this.__svg__.setAttribute('x1', evt.coord.x);
        this.__svg__.setAttribute('y1', evt.coord.y);
    }
};

Link.prototype.onDestChange = function (evt) {
    if (evt && evt.coord){
        this.__svg__.setAttribute('x2', evt.coord.x);
        this.__svg__.setAttribute('y2', evt.coord.y);
    }
};





Port.EventNames = {
    Move: 'portmove',
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

    this.__move_evt_dispacher__ = undefined;
    this.__listeners__ = {};
    this.links = [];
}

Port.prototype.getElement = function () {
    return this.__svg__;
};

Port.prototype.setMoveEventDispatcher = function (dispatcher) {
    this.__move_evt_dispacher__ = dispatcher;
    // this.__move_evt_dispacher__.addEventListener('move', function(){console.log('click')});
    this.__move_evt_dispacher__.addEventListener(BaseSymbol.EventNames.Move, this.onMove.bind(this));
};

Port.prototype.onMouseDown = function (evt) {
    // console.log('port mouse down');
    var coord = SVG.convertCoords(this.__svg__, this.x, this.y);

    var link = new Link(coord.x, coord.y);
    link.setOrigin(this);
    link.draw();
    this.links.push(link);
    evt.stopPropagation();
};

Port.prototype.onMouseUp = function (evt) {
    // console.log('port mouse up');
};

Port.prototype.onMouseEnter = function (evt) {
    // console.log('port mouse enter');
    this.__listeners__ = {
        mouseleave: this.onMouseLeave.bind(this),
        linkrelease: this.onLinkRelease.bind(this),
    };

    this.__svg__.addEventListener('mouseleave', this.__listeners__.mouseleave);
    document.addEventListener('linkrelease', this.__listeners__.linkrelease);
};

Port.prototype.onMouseLeave = function (evt) {
    // console.log('port mouse leave');
    this.__svg__.removeEventListener('mouseleave', this.__listeners__.mouseleave);
    document.removeEventListener('linkrelease', this.__listeners__.linkrelease);

    this.__listeners__.mouseleave = undefined;
    this.__listeners__.linkrelease = undefined;
};

Port.prototype.onLinkRelease = function (evt) {
    // console.log('port link realease');
    var coord = SVG.convertCoords(this.__svg__, this.x, this.y);
    evt.link.updateDestCoordinates(coord.x, coord.y);
    evt.link.setDest(this);
    document.removeEventListener('linkrelease', this.__listeners__.linkrelease);
    this.__listeners__.linkrelease = undefined;
};

Port.prototype.onMove = function (evt) {
    // console.log('moving');
    const e = new Event(Port.EventNames.Move);
    e.port = this;
    e.coord = SVG.convertCoords(this.__svg__, this.x, this.y);
    this.__svg__.dispatchEvent(e);
    // console.log(this.__svg__);
};





BaseSymbol.id_count = 0;
BaseSymbol.EventNames = {
    Move: 'elementmove',
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
    this.ports = [];
    this.__parent__ = undefined;
    this.__svg__ = undefined;
    this.__dragable__ = undefined;
    this.__listeners__ = {};
}


BaseSymbol.prototype.updatePosition = function () {
    this.__svg__.setAttributeNS(null,
        'transform',
        'translate(' + this.x + ',' + this.y + ') rotate(' + this.rotation + ')'
    );

    const e = new Event(BaseSymbol.EventNames.Move);
    this.__dragable__.dispatchEvent(e);
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

BaseSymbol.prototype.constructElement = function (el, dragable) {
    this.__controls__ = new Controls(
        this.symbol.width + 10,
        0,
        this.onRotate.bind(this)
    );
    this.__dragable__ = dragable;
    this.__svg__ = document.createElementNS(SVG.config.xmlns, 'g');

    this.__svg__.appendChild(el);
    this.__svg__.appendChild(this.__controls__.getElement());

    this.updatePosition();

    this.__svg__.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    this.__svg__.addEventListener('mouseup', this.onMouseUp.bind(this), false);
};

BaseSymbol.prototype.getElement = function () {
    return this.__svg__;
}

BaseSymbol.prototype.onMouseDown = function (evt) {
    this.__listeners__ = {
        mousemove: this.onMouseMove.bind(this),
    };

    this.__mouse_drag__ = {
        x:  this.x,
        y:  this.y,
        mX: evt.clientX,
        mY: evt.clientY,
    };

    document.addEventListener('mousemove', this.__listeners__.mousemove, false);
};

BaseSymbol.prototype.onMouseUp = function (evt) {
    document.removeEventListener('mousemove', this.__listeners__.mousemove);
    this.__listeners__ = {};
};

BaseSymbol.prototype.onMouseMove = function (evt) {
    this.setX(this.__mouse_drag__.x + (evt.clientX - this.__mouse_drag__.mX))
        .setY(this.__mouse_drag__.y + (evt.clientY - this.__mouse_drag__.mY))
        .updatePosition();
};

BaseSymbol.prototype.onRotate = function (evt) {
    console.log(this);
    this.setRotation(this.rotation - 45)
        .updatePosition();
};



Rect.prototype = new BaseSymbol();
Rect.prototype.constructor = Rect;
Rect.__super__ = BaseSymbol.prototype;
function Rect(){
    this.symbol.width = 150;
    this.symbol.height = this.symbol.width/2;

    var rect = document.createElementNS(SVG.config.xmlns, 'rect');
    rect.setAttributeNS(null, 'width', this.symbol.width);
    rect.setAttributeNS(null, 'height', this.symbol.height);
    rect.style.fill = 'rgb(0,0,255)';
    rect.style.strokeWidth = 3;
    rect.style.stroke = 'rgb(0,0,0)';
    rect.style.cursor = 'move';

    // var port_left = new Port(0, this.symbol.height/2);
    // var port_right = new Port(this.symbol.width, this.symbol.height/2);
    this.ports = [
        new Port(0, this.symbol.height/2),                  //left port
        new Port(this.symbol.width, this.symbol.height/2),  //right port
    ];

    var dragble = rect;

    var symbol = document.createElementNS(SVG.config.xmlns, 'g');
    symbol.appendChild(rect);

    for (var p in this.ports) {
        symbol.appendChild(this.ports[p].getElement());
        this.ports[p].setMoveEventDispatcher(dragble);
    }

    this.constructElement(symbol, dragble);
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
