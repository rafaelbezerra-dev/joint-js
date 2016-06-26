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
    var line = {};
    line = {
        origin: {
            x: ix,
            y: iy,
        },
        dest: {
            x: fx || ix,
            y: fy || iy,
        },
        m: function(){
            var o = line.origin;
            var d = line.dest;
            return (d.y - o.y) / (d.x - o.x);
        },
        line_eq: function(m, p){
            var o = line.origin;
            if (p.x) {
                return m * (p.x - o.x) + o.y;
            }
            if (p.y) {
                return ((p.y - o.y) + (o.x * m))/m;
            }
            return undefined;
        },
    };
    this.__line__ = line;
    this.__origin__ = undefined;
    this.__dest__ = undefined;

    this.__listeners__ = {
        contextmenu: this.onContextMenu.bind(this),
        mouseenter: this.onMouseEnter.bind(this),
        mouseleave: this.onMouseLeave.bind(this),
    };


    var attrs = {
        'x1': this.__line__.origin.x,
        'y1': this.__line__.origin.y,
        'x2': this.__line__.dest.x,
        'y2': this.__line__.dest.y,
    };
    var style = {
        'stroke': '#f00',
        'stroke-width': 3,
    };

    this.svg = {
        __view__: SVG.buildElement('line', attrs,
            {
                'stroke': '#f00',
                'stroke-width': 3,          
            }),
        __bg__: SVG.buildElement('line', attrs,
            {
                'stroke': '#000',
                'stroke-width': 15,     
                'opacity': 0,     
            }),
    };

    this.__svg__ = SVG.groupElements([this.svg.__bg__, this.svg.__view__]);

    this.__svg__.addEventListener('contextmenu', this.__listeners__.contextmenu);
    this.__svg__.addEventListener('mouseenter', this.__listeners__.mouseenter);
    this.__svg__.addEventListener('mouseleave', this.__listeners__.mouseleave);

}

Link.prototype.getElement = function () {
    return this.__svg__;
};

Link.prototype.draw = function () {
    // console.log('link draw');
    this.__listeners__ = {
        mousemove: this.onMouseMove.bind(this),
        mouseup: this.onMouseUp.bind(this),
    };

    SVG.draw(this);
    document.addEventListener('mousemove', this.__listeners__.mousemove);
    document.addEventListener('mouseup', this.__listeners__.mouseup);
};

Link.prototype.setOrigin = function (vetex) {
    if (vetex instanceof Port){
        this.__origin__ = vetex;
        var el = this.__origin__.getElement();
        // console.log(el);
        this.__listeners__.originmove = this.onOriginChange.bind(this);
        el.addEventListener(Port.EventNames.Move, this.__listeners__.originmove);
    }
};

Link.prototype.setDest = function (vetex) {
    if (vetex instanceof Port){
        this.__dest__ = vetex;
        var el = this.__dest__.getElement();
        // console.log(el);
        this.__listeners__.destmove = this.onDestChange.bind(this);
        el.addEventListener(Port.EventNames.Move, this.__listeners__.destmove);
    }
};

Link.prototype.onMouseMove = function (evt) {
    this.updateDestCoordinates(evt.clientX, evt.clientY)
};

Link.prototype.updateDestCoordinates = function (x, y) {
    this.__line__.dest = {x:x, y:y};

    this.svg.__view__.setAttribute('x2', this.__line__.dest.x);
    this.svg.__view__.setAttribute('y2', this.__line__.dest.y);
    this.svg.__bg__.setAttribute('x2', this.__line__.dest.x);
    this.svg.__bg__.setAttribute('y2', this.__line__.dest.y);

    // this.__line__.m();
};

Link.prototype.onMouseUp = function (evt) {
    // console.log('link mouse up');
    document.removeEventListener('mousemove', this.__listeners__.mousemove);
    document.removeEventListener('mouseup', this.__listeners__.mouseup);

    this.__svg__.style.stroke = '#000';
    this.__listeners__ = {};
    // console.log('dispatching linkrelease event');

    if (!this.__dest__){
        var e = new Event(Link.EventNames.LinkRelease);
        e.link = this;
        e.clientX = evt.clientX;
        e.clientY = evt.clientY;
        document.dispatchEvent(e);
    }

};

Link.prototype.onContextMenu = function (evt) {
    this.__svg__.removeEventListener('contextmenu', this.__listeners__.contextmenu);
    evt.stopPropagation();
    SVG.erase(this);
    return false;
};

Link.prototype.onMouseEnter = function (evt) {
    // console.log('port mouse enter');
    this.__svg__.style.stroke = '#f00';
    if (this.__dest__) {
        this.__listeners__.linkrelease = this.onLinkRelease.bind(this);

        document.addEventListener('linkrelease', this.__listeners__.linkrelease);
    }
};

Link.prototype.onMouseLeave = function (evt) {
    this.__svg__.style.stroke = '#000';
};

Link.prototype.onOriginChange = function (evt) {
    if (evt && evt.coord){
        this.__line__.origin = {x:evt.coord.x, y:evt.coord.y};
        this.svg.__view__.setAttribute('x1', this.__line__.origin.x);
        this.svg.__view__.setAttribute('y1', this.__line__.origin.y);
        this.svg.__bg__.setAttribute('x1', this.__line__.origin.x);
        this.svg.__bg__.setAttribute('y1', this.__line__.origin.y);
        // this.__line__.m();
    }
};

Link.prototype.onDestChange = function (evt) {
    if (evt && evt.coord){
        this.__line__.dest = {x:evt.coord.x, y:evt.coord.y};
        this.svg.__view__.setAttribute('x2', this.__line__.dest.x);
        this.svg.__view__.setAttribute('y2', this.__line__.dest.y);
        this.svg.__bg__.setAttribute('x2', this.__line__.dest.x);
        this.svg.__bg__.setAttribute('y2', this.__line__.dest.y);
        // this.__line__.m();
    }
};

Link.prototype.onLinkRelease = function (evt) {
    document.removeEventListener('linkrelease', this.__listeners__.linkrelease);
    this.__listeners__.linkrelease = undefined;
    evt.stopPropagation();

    console.log('link link realease');

    var p = {
        x: evt.clientX,
        y: evt.clientY,
    };
    console.log(p);
    var o = this.__line__.origin;
    var m = this.__line__.m();
    var im = (-1)/m;
    var intersection = {
        x: (((m * o.x) - (im * p.x) + p.y - o.y) / (m - im) ),
    };
    intersection.y = im * (intersection.x - p.x) + p.y;

    // console.log(intersection);
    // if (!this.__line__.ind){
    //     this.__line__.ind = document.createElementNS(SVG.config.xmlns, 'circle');
    //     this.__line__.ind.setAttribute('r', 4);
    //     this.__line__.ind.style.fill = '#f00';
    // }
    // this.__line__.ind.setAttribute('cx', intersection.x);
    // this.__line__.ind.setAttribute('cy', intersection.y);
    // SVG.draw(this.__line__.ind);


    evt.link.updateDestCoordinates(intersection.x, intersection.y);
    evt.link.setDest(this);
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
        // fill: '#656565',
        fill: '#fff',
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

    this.__svg__.style.stroke = '#f00';

    this.__listeners__ = {
        mouseleave: this.onMouseLeave.bind(this),
        linkrelease: this.onLinkRelease.bind(this),
    };

    this.__svg__.addEventListener('mouseleave', this.__listeners__.mouseleave);
    document.addEventListener('linkrelease', this.__listeners__.linkrelease);
};

Port.prototype.onMouseLeave = function (evt) {

    this.__svg__.style.stroke = '#000';

    // console.log('port mouse leave');
    this.__svg__.removeEventListener('mouseleave', this.__listeners__.mouseleave);
    document.removeEventListener('linkrelease', this.__listeners__.linkrelease);

    this.__listeners__.mouseleave = undefined;
    this.__listeners__.linkrelease = undefined;
};

Port.prototype.onLinkRelease = function (evt) {

    this.__svg__.style.stroke = '#000';

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
    this.rotation = {
        angle: 0,
        anchorX: undefined,
        anchorY: undefined,
    };
    this.symbol = {
        width: 0,
        height: 0,
        markup:'',
    };
    this.ports = [];
    this.__parent__ = undefined;
    this.__svg__ = undefined;
    this.svg = {
        __symbol__: undefined,
        __dragable__: undefined,
    };
    this.__listeners__ = {};
}

BaseSymbol.prototype.updatePosition = function () {
    this.__svg__.setAttribute('transform',
        'translate(' + this.x + ',' + this.y + ')'
        );

    if (this.rotation.anchorX && this.rotation.anchorY){
        this.svg.__symbol__.setAttribute('transform',
            'rotate(' + this.rotation.angle + ', ' + this.rotation.anchorX + ', ' + this.rotation.anchorY + ')'
            );
    }

    const e = new Event(BaseSymbol.EventNames.Move);
    this.svg.__dragable__.dispatchEvent(e);
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
        // this.rotation.angle = v*Math.PI/180;
        this.rotation.angle = v % 360;
    }
    return this;
};

BaseSymbol.prototype.constructElement = function (el, dragable) {
    this.__controls__ = new Controls(
        this.symbol.width + 10,
        0,
        this.onRotate.bind(this)
        );
    this.svg = {
        __symbol__: el,
        __dragable__: dragable,
    };
    this.__svg__ = document.createElementNS(SVG.config.xmlns, 'g');

    this.__svg__.appendChild(el);
    this.__svg__.appendChild(this.__controls__.getElement());

    this.updatePosition();

    this.__svg__.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    this.__svg__.addEventListener('mouseup', this.onMouseUp.bind(this), false);

};
//
// BaseSymbol.prototype.testRot = function () {
//     // console.log(this);
//     var box = this.svg.__symbol__.getBoundingClientRect();
//     // var coord = SVG.convertCoords(this.__svg__, 0, 0);
//     // coord.x += (box.width/2);
//     // coord.y += (box.height/2);
//     //
//     // console.log(coord);
//     console.log(box);
//
//     var coord = SVG.convertCoords(this.svg.__symbol__, 0, 0);
//     coord.x = (box.width/2);
//     coord.y = (box.height/2);
//     console.log(coord);
//     console.log(SVG.convertCoords(this.__svg__, coord.x, coord.y));
//
//     {
//         var center_coord = SVG.convertCoords(this.svg.__symbol__, coord.x, coord.y);
//
//         // if (!this.svg.center){
//         //     SVG.erase(this.svg.center);
//         // }
//         this.svg.center = document.createElementNS(SVG.config.xmlns, 'circle');
//         this.svg.center.setAttribute('cx', center_coord.x);
//         this.svg.center.setAttribute('cy', center_coord.y);
//         this.svg.center.setAttribute('r', 4);
//         this.svg.center.style.fill = '#f00';
//         SVG.draw(this.svg.center);
//     }
//
//     setInterval((function(){
//         this.setRotation(this.rotation.angle+1);
//
//         this.svg.__symbol__.setAttributeNS(null,
//             'transform',
//             'rotate(' + (this.rotation.angle) + ', ' + coord.x + ', ' + coord.y + ')'
//             // 'rotate(' + (this.rotation.angle) + ', 0, 0)'
//
//         );
//     }).bind(this), 10);
// };

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
    if (!this.rotation.anchorX && !this.rotation.anchorX) {
        var box = this.svg.__symbol__.getBoundingClientRect();
        this.rotation.anchorX = box.width/2;
        this.rotation.anchorY = box.height/2;
    }

    this.setRotation(this.rotation.angle-90);
    this.updatePosition();
    // this.svg.__symbol__.setAttributeNS(null,
    //     'transform',
    //     'rotate(' + (this.rotation.angle) + ', ' + this.rotation.anchorX + ', ' + this.rotation.anchorY + ')'
    // );
};



Rect.prototype = new BaseSymbol();
Rect.prototype.constructor = Rect;
Rect.__super__ = BaseSymbol.prototype;
function Rect(){
    this.symbol.width = 150;
    this.symbol.height = this.symbol.width/2;

    var rect = SVG.buildElement(
        'rect',
        {
            'width': this.symbol.width,
            'height': this.symbol.height,
        },
        {
            'fill': 'rgb(0,0,255)',
            'stroke-width': 3,
            'stroke': 'rgb(0,0,0)',
            'cursor': 'move',
        }
    );

    // var port_left = new Port(0, this.symbol.height/2);
    // var port_right = new Port(this.symbol.width, this.symbol.height/2);
    this.ports = [
        new Port(0, this.symbol.height/2),                  //left port
        new Port(this.symbol.width, this.symbol.height/2),  //right port
    ];

    var symbol = SVG.groupElements([rect]);

    for (var p in this.ports) {
        symbol.appendChild(this.ports[p].getElement());
        this.ports[p].setMoveEventDispatcher(rect);
    }

    this.constructElement(symbol, rect);
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




// Points are represented as objects with x and y attributes.

function sqr(x) {
    return x * x
}

function dist2(v, w) {
    return sqr(v.x - w.x) + sqr(v.y - w.y)
}

function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);

  if (l2 == 0) return dist2(p, v);

  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;

  if (t < 0) return dist2(p, v);
  if (t > 1) return dist2(p, w);

  return dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) });
}

function distToSegment(p, v, w) {
    return Math.sqrt(distToSegmentSquared(p, v, w));
}

// var l = new Link(2, 7, -1, -5);
// console.log('origin', l.__line__.origin);
// console.log('dest', l.__line__.dest);
// var m = l.__line__.m();
// console.log('m', m);
// console.log('for x = -1, y ==', l.__line__.line_eq(l.__line__.m(), {x:-1}));
// console.log('for y = -5, x ==', l.__line__.line_eq(l.__line__.m(), {y:-5}));
// var c = 7 - (m * 2);
// console.log('c', c);

// console.log('x =', ((7) - c)/m);
// console.log('y =', m * 2 + c);

// console.log('x =', ((-5) - c)/m);
// console.log('y =', m * -1 + c);



function test() {
    // return;
    var p = {
        x: 300,
        y: 180,
    };
    var red_line = {
        x0: 200,
        y0: 42,
        x1: 400,
        y1: 200,
    };
    var blu_line = {
        x0: p.x,
        y0: p.y,
        x1: p.x,
        y1: p.y,
    };
    var circle_origin = document.createElementNS(SVG.config.xmlns, 'circle');
    circle_origin.setAttribute('r', 6);
    circle_origin.style.fill = '#000';    
    circle_origin.setAttribute('cx', p.x);
    circle_origin.setAttribute('cy', p.y);
    SVG.draw(circle_origin);

    {
        var l = new Link(red_line.x0, red_line.y0, red_line.x1, red_line.y1);
        l.draw();    
        document.removeEventListener('mousemove', l.__listeners__.mousemove);
        document.removeEventListener('mouseup', l.__listeners__.mouseup);
    }

    var red_m = (red_line.y1 - red_line.y0) / (red_line.x1 - red_line.x0);
    var red_k = red_line.y0 - (red_m * red_line.x0);

    var blu_m = (-1)/red_m;
    var blu_k = blu_line.y0 - (blu_m * blu_line.x0);

    {        
        var l = new Link(0, blu_k, p.x, p.y);
        l.draw();    
        document.removeEventListener('mousemove', l.__listeners__.mousemove);
        document.removeEventListener('mouseup', l.__listeners__.mouseup);
    }

    // var line_eq_y = function (x, x0, y0) { return m*(x−x0)+y0 };
    console.log(blu_m);
    console.log(blu_k);

    // x =  (y0 - m*x0)/m

    // (Am*x - Am*Ax0) + Ay0 = (Bm*x - Bm*Bx0) + By0
    // Am*x + Ay0 - Am*Ax0 = Bm*x + By0 - Bm*Bx0

    // Am*x - Bm*x = By0 - Bm*Bx0 - Ay0 + Am*Ax0
    // x * (Am - Bm) = By0 - Bm*Bx0 - Ay0 + Am*Ax0
    // x = (By0 - Bm*Bx0 - Ay0 + Am*Ax0) / (Am - Bm)
    // (blu_line.y0 - blu_m*blu_line.x0 - red_line.y0 + red_m*red_line.x0) / (red_m - blu_m)
    blu_line.x1 = (blu_line.y0 - blu_m*blu_line.x0 - red_line.y0 + red_m*red_line.x0) / (red_m - blu_m);
    blu_line.y1 = blu_m * (blu_line.x1 - blu_line.x0) + blu_line.y0;

    // y = Am*x + Ak
    // y = Bm*x + Bk
    // Am*x + Ak = Bm*x + Bk
    // Am*x - Bm*x = Bk - Ak
    // x * (Am - Bm) = (Bk - Ak)
    // console.log((blu_k - red_k)/(red_m - blu_m));
    // console.log(blu_m * ((blu_k - red_k)/(red_m - blu_m) - blu_line.x0) + blu_line.y0);


    // var a = function (l, p){
    //     return 
    // };



    
    var circle_dest = document.createElementNS(SVG.config.xmlns, 'circle');
    circle_dest.setAttribute('r', 4);
    circle_dest.style.fill = '#00f';
    circle_dest.setAttribute('cx', blu_line.x1);
    circle_dest.setAttribute('cy', blu_line.y1);
    SVG.draw(circle_dest);
}

// test();