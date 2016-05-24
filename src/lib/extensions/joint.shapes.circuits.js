joint.shapes.circuits = {};

joint.shapes.circuits.Resistor = joint.dia.Element.extend({
  markup:[
      '<g class="rotatable">',
          '<g class="scalable">',
              '<path d="M10 15 l15 0 l2.5 -5 l5 10 l5 -10 l5 10 l5 -10 l5 10 l2.5 -5 l15 0" ',
                    // 'stroke="black" ',
                    // 'stroke-width="1" ',
                    // 'stroke-linejoin="bevel" ',
                    // 'fill="none"',
              '/>',
          '</g>',
          '<text/>',
      '</g>',
  ].join(''),
  defaults: joint.util.deepSupplement({
    type: 'basic.Rect',
    attrs: {
      'path': { fill: 'none', stroke: 'black', 'stroke-width':1, 'stroke-linejoin':'bevel', 'follow-scale': true, /*width: 80, height: 40*/ },
      'text': { 'font-size': 14, 'ref-x': .5, 'ref-y': .5, ref: 'rect', 'y-alignment': 'middle', 'x-alignment': 'middle' }
    }
  }, joint.dia.Element.prototype.defaults)
});
