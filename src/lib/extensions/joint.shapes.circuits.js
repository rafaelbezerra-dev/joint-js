joint.shapes.circuits = {};

joint.shapes.circuits.Resistor = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {
    markup:[
        '<g class="rotatable">',
            '<g class="scalable">',
                '<path class="body" d="M10,15h15l2.5-5l5,10l5-10l5,10l5-10l5,10l2.5-5h15" />',
                '<rect class="body-bg"/>',
                '<circle class="left-port"  />',    // cx="9.875" cy="15" r="2.5"/>',
                '<circle class="right-port" />',    // cx="69.875" cy="15" r="2.5"/>',
            '</g>',
            '<text class="label"/>',
            // '<g class="inPorts left-port"/>',
            // '<g class="outPorts right-port"/>',
        '</g>',
    ].join(''),

    // portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
    portMarkup:[
        '<g class="port port<%= id %>">',
        '<circle class="port-body"/>',
        '<text class="port-label"/>',
        '</g>',
    ].join(''),

    defaults: joint.util.deepSupplement({
        type: 'circuits.Resistor',
        size: { width: 74, height: 18.357 },

        // inPorts: ['left-port', 'right-port'],
        // outPorts: ['out'],

        attrs: {
            '.': { magnet: false },
            '.body': { fill: 'none', stroke: '#000000', 'stroke-width':2, 'stroke-linejoin':'bevel', 'follow-scale': true},
            '.body-bg': { x: 24, y: 6.938, opacity: 100, fill: '#666666', width: 31.75, height: 16.125 },

            text: {
                'pointer-events': 'none'
            },
            '.label': { 'font-size': 14, 'ref-x': .5, 'ref-y': .5, ref: 'rect', 'y-alignment': 'middle', 'x-alignment': 'middle' },

            '.port-body': {
                r: 5,
                magnet: true,
                stroke: '#000000'
            },
            '.port circle': { fill: '#16A085' },
            '.left-port':{
                cx: 9.875,
                cy: 15,
                r: 2.5,
                fill: '#16A085',
            },
            '.right-port':{
                cx: 69.875,
                cy: 15,
                r: 2.5,
                fill: '#16A085',
            },


        }
    }, joint.shapes.basic.Generic.prototype.defaults),

    getPortAttrs: function(portName, index, total, selector, type) {

        console.log("portName = ", portName,
        ", index = ",index,
        ", total = ",total,
        ", selector = ",selector,
        ", type = ", type);

        var attrs = {};

        var portClass = 'port' + index;
        var portSelector = selector + '>.' + portClass;
        var portLabelSelector = portSelector + '>.port-label';
        var portBodySelector = portSelector + '>.port-body';

        attrs[portLabelSelector] = { text: portName };
        attrs[portBodySelector] = { port: { id: portName || _.uniqueId(type) , type: type } };
        // attrs[portSelector] = { ref: '.body', 'ref-y': (index + 0.5) * (1 / total) };

        if (portName == 'left-port'){
            attrs[portSelector] = {
                ref: '.body',
                'ref-x': 9.875,
                'ref-y': 15,
            };
        }
        else if (portName == 'right-port') {
            attrs[portSelector] = {
                ref: '.body',
                'ref-x': 69.875,
                'ref-y': 15,
            };
        }

        // if (selector === '.outPorts') { attrs[portSelector]['ref-dx'] = 0; }
        // console.log("RESISTOR attrs", attrs);
        return attrs;
    },
}));





joint.shapes.circuits.Link = joint.dia.Link.extend({

    defaults: {
        type: 'circuits.Link',
        attrs: { '.connection' : { 'stroke-width' :  2 }}
    }
});

joint.shapes.circuits.ResistorView = joint.dia.ElementView.extend(joint.shapes.basic.PortsViewInterface);
