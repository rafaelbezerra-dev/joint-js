joint.shapes.circuits = {};

joint.shapes.circuits.Resistor = joint.dia.Element.extend({
    markup:[
        '<g class="rotatable">',
            '<g class="scalable">',
                '<path d="M10,15h15l2.5-5l5,10l5-10l5,10l5-10l5,10l2.5-5h15" />',
                '<rect/>',
            '</g>',
            '<text/>',
        '</g>',
    ].join(''),
    defaults: joint.util.deepSupplement({
        type: 'circuits.Resistor',
        size: { width: 100, height: 20 },
        attrs: {
            'path': { fill: 'none', stroke: '#000000', 'stroke-width':2, 'stroke-linejoin':'bevel', 'follow-scale': true},
            'rect': { x: 24, y: 6.938, opacity: 0, fill: '#FFFFFF', width: 31.75, height: 16.125 },
            'text': { 'font-size': 14, 'ref-x': .5, 'ref-y': .5, ref: 'rect', 'y-alignment': 'middle', 'x-alignment': 'middle' },
        }
    }, joint.shapes.basic.Generic.prototype.defaults)
});

joint.shapes.circuits.DC = joint.dia.Element.extend({
    markup:[
        '<g class="rotatable">',
            '<g class="scalable">',
                '<circle />',
                // '<g id="g5559">',
                	'<path d="M35.508,13.221v3.796"/>',
                	'<path d="M37.418,15.12h-3.819"/>',
                	'<path d="M43.148,17.018v-3.796"/>',
                    '<path d="M22.14,15.044h9.503"/>',
                    '<path d="M47.012,15.044h9.504"/>',

            		'<path ',
                            'sodipodi:type="arc" ',
                            'sodipodi:cx="251.48755" ',
                            'sodipodi:cy="76.863258" ',
                            'sodipodi:rx="10.88965" ',
                            'sodipodi:ry="10.953495" ',
                            // 'fill="none" ',
                            // 'stroke="#000000" ',
                            // 'stroke-linecap="round" ',
                            // 'stroke-linejoin="round" ',
                            'd="M39.328,7.404c4.245-0.003,7.688,3.415,7.69,7.634s-3.436,7.643-7.681,7.645c-0.002,0-0.006,0-0.009,0c-4.244,0.004-7.686-3.416-7.689-7.635c-0.002-4.22,3.436-7.643,7.68-7.645C39.322,7.404,39.325,7.404,39.328,7.404z"',
                    '/>',
                // '</g>',
            '</g>',
            '<text/>',
        '</g>',
    ].join(''),
    defaults: joint.util.deepSupplement({
        type: 'circuits.DC',
        size: { width: 80, height: 37 },
        attrs: {
            'path': {
                'fill': 'none',
                'stroke': '#000000',
                'stroke-width':2,
                'stroke-linecap': 'round',
                'stroke-linejoin':'round',
                'follow-scale': true,
            },
            'circle': {
            //     'transform': 'translate(10, 10)',
                'fill': '#FFFFFF',
                'stroke': '#000000',
                'stroke-width':2,
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
                'cx': 39.328,
                'cy': 15.044,
                'r': 7.8,
                'follow-scale': false,
            },
            // 'text': { 'font-size': 14, 'ref-x': .5, 'ref-y': .5, ref: 'rect', 'y-alignment': 'middle', 'x-alignment': 'middle' },

        }
    }, joint.shapes.basic.Generic.prototype.defaults)
});

//
// <g id="g5559">
// 	<path id="path13824" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M35.508,13.221v3.796"/>
// 	<path id="path13826" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M37.418,15.12h-3.819"/>
// 	<path id="path13828" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M43.148,17.018v-3.796"/>
//
// 		<path id="path5527" sodipodi:type="arc" sodipodi:cx="251.48755" sodipodi:cy="76.863258" sodipodi:rx="10.88965" sodipodi:ry="10.953495" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="
// 		M39.328,7.404c4.245-0.003,7.688,3.415,7.69,7.634s-3.436,7.643-7.681,7.645c-0.002,0-0.006,0-0.009,0
// 		c-4.244,0.004-7.686-3.416-7.689-7.635c-0.002-4.22,3.436-7.643,7.68-7.645C39.322,7.404,39.325,7.404,39.328,7.404z"/>
// 	<path id="path5529" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M22.14,15.044h9.503"/>
// 	<path id="path5531" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M47.012,15.044h9.504"/>
// </g>
// <circle fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" cx="39.328" cy="15.044" r="7.507"/>
