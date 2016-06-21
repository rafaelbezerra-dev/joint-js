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
            '.body-bg': { x: 24, y: 6.938, opacity: .5, fill: '#888', width: 31.75, height: 16.125, 'follow-scale': true},
            text: {
                'pointer-events': 'none'
            },
            '.label': { 'font-size': 14, 'ref-x': .5, 'ref-y': .5, ref: 'rect', 'y-alignment': 'middle', 'x-alignment': 'middle' },

            '.left-port, .right-port': {
                r: 2.5,
                'follow-scale': true,
                fill: '#000',
                // opacity: 0,
                magnet: true,
            },
            '.left-port':{
                cx: 9.875,
                cy: 15,
                port: {
                    id: 'resistor-left-port',
                },
            },
            '.right-port':{
                cx: 69.875,
                cy: 15,
                port: {
                    id: 'resistor-right-port',
                },
            },


        }
    }, joint.shapes.basic.Generic.prototype.defaults),
});


joint.shapes.circuits.ResistorView = joint.dia.ElementView.extend({

    template: [
        '<div class="html-element">',
        '<button class="delete">x</button>',
        // '<label></label>',
        // '<span></span>', '<br/>',
        // '<select><option>--</option><option>one</option><option>two</option></select>',
        // '<input type="text" value="I\'m HTML input" />',
        '</div>'
    ].join(''),

    initialize: function() {
        _.bindAll(this, 'updateBox');
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);
        this.$box = $(_.template(this.template)());
        console.log(this.$box);
        // // Prevent paper from handling pointerdown.
        // this.$box.find('input,select').on('mousedown click', function(evt) { evt.stopPropagation(); });
        // // This is an example of reacting on the input change and storing the input data in the cell model.
        // this.$box.find('input').on('change', _.bind(function(evt) {
        //     this.model.set('input', $(evt.target).val());
        // }, this));
        // this.$box.find('select').on('change', _.bind(function(evt) {
        //     this.model.set('select', $(evt.target).val());
        // }, this));
        // this.$box.find('select').val(this.model.get('select'));
        this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));
        // Update the box position whenever the underlying model changes.
        this.model.on('change', this.updateBox, this);
        // Remove the box when the model gets removed from the graph.
        this.model.on('remove', this.removeBox, this);

        this.updateBox();
    },
    render: function() {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
        this.paper.$el.prepend(this.$box);
        this.updateBox();
        return this;
    },
    updateBox: function() {
        // Set the position and dimension of the box so that it covers the JointJS element.
        var bbox = this.model.getBBox();
        // // Example of updating the HTML with a data stored in the cell model.
        // this.$box.find('label').text(this.model.get('label'));
        // this.$box.find('span').text(this.model.get('select'));
        this.$box.css({ width: bbox.width, height: bbox.height, left: bbox.x, top: bbox.y, transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)' });
        console.log({left: bbox.x, top: bbox.y});
    },
    removeBox: function(evt) {
        this.$box.remove();
    }
});


joint.shapes.circuits.DC = joint.dia.Element.extend({
    markup:[
        '<g class="rotatable">',
        '<g class="scalable"  xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd">',
        '<path d="M39.936,39.648H29.648"/>',
        '<path d="M34.795,44.822V34.474"/>',
        '<path d="M29.648,60.354h10.287"/>',

        '<path class="inner-circle" ',
        'd="M55.707,49.999C55.713,61.5,46.449,70.834,35.012,70.84c-11.',
        '438,0.004-20.71-9.309-20.719-20.814c0-0.01,0-0.018,0-0.026c-0',
        '.002-11.502,9.258-20.833,20.691-20.838c11.439-0.006,20.709,9.',
        '311,20.722,20.812C55.707,49.982,55.707,49.992,55.707,49.999z"/>',

        '<path d="M34.998,3.416v25.758" />',
        '<path d="M34.998,70.826v25.758"/>',

        '<circle class="body-bg" opacity="0.5"/>',

        '<circle class="left-port"  />',
        '<circle class="right-port" />',
        '</g>',
        '<text class="label"/>',
        '</g>',
    ].join(''),

    defaults: joint.util.deepSupplement({
        type: 'circuits.DC',
        size: { width: 44, height: 98.167 },
        attrs: {
            '.': { magnet: false },
            'path': { fill: 'none', 'stroke': '#000', 'stroke-linecap':'round', 'stroke-width':2, 'stroke-linejoin':'round', 'follow-scale': true},
            '.inner-circle': {'sodipodi:cx':251.48755, 'sodipodi:cy':76.863258, 'sodipodi:rx':10.88965, 'sodipodi:ry':10.953495, 'sodipodi:type':'arc' },
            '.body-bg': { opacity: .5, fill: '#888', cx:35, cy:49.999, r:22 },

            '.left-port, .right-port': {
                r: 2.5,
                fill: '#000',
                magnet: true,
            },
            '.left-port':{
                cx: 35,
                cy: 3.416,
                port: {
                    id: 'dc-left-port',
                },
            },
            '.right-port':{
                cx: 35,
                cy: 96.584,
                port: {
                    id: 'dc-right-port',
                },
            },


        }
    }, joint.shapes.basic.Generic.prototype.defaults),
});


joint.shapes.circuits.Link = joint.dia.Link.extend({
    defaults: {
        type: 'circuits.Link',
        attrs: { '.connection' : { 'stroke-width' :  2 }}
    }
});
