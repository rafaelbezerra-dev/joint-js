joint.shapes.circuits = {};

joint.shapes.circuits.Resistor = joint.dia.Element.extend({
    markup:[
        '<g class="rotatable">',
            '<g class="scalable">',
                '<path class="body" d="M10,15h15l2.5-5l5,10l5-10l5,10l5-10l5,10l2.5-5h15" />',
                '<rect class="body-bg"/>',
                '<circle class="left-port"  />',
                '<circle class="right-port" />',
            '</g>',
            '<text class="label"/>',
        '</g>',
    ].join(''),

    defaults: joint.util.deepSupplement({
        type: 'circuits.Resistor',
        size: { width: 74, height: 18.357 },
        attrs: {
            '.': { magnet: false },
            '.body': { fill: 'none', stroke: '#000000', 'stroke-width':2, 'stroke-linejoin':'bevel', 'follow-scale': true},
            '.body-bg': { x: 24, y: 6.938, opacity: .5, fill: '#888', width: 31.75, height: 16.125 },
            text: {
                'pointer-events': 'none'
            },
            '.label': { 'font-size': 14, 'ref-x': .5, 'ref-y': .5, ref: 'rect', 'y-alignment': 'middle', 'x-alignment': 'middle' },

            '.left-port, .right-port': {
                cy: 15,
                r: 2.5,
                fill: '#000',
                // opacity: 0,
                magnet: true,
            },
            '.left-port':{
                cx: 9.875,
                port: {
                    id: 'resistor-left-port',
                },
            },
            '.right-port':{
                cx: 69.875,
                port: {
                    id: 'resistor-right-port',
                },
            },


        }
    }, joint.shapes.basic.Generic.prototype.defaults),
});
