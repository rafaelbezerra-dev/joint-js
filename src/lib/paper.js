/**
@author Rafael Nascimento Bezerra

*/
function Paper(element) {
    this._element_ = element;
    this._graph_ = new joint.dia.Graph();
    this._paper_ = new joint.dia.Paper({
        el : $(element),
        width : 800,
        height : 600,
        gridSize : 1,
        model : this._graph_,
        snapLinks: true,
        multiLinks: true,
        linkPinning: false,
        validateConnection: function (sourceView, sourceMagnet, targetView, targetMagnet) {
            return sourceMagnet != targetMagnet;
        },
        defaultLink: function(cellView, magnet) {
            var link = new joint.shapes.circuits.Link();
            // link.attr({
            //     '.connection': { stroke: 'blue' },
            //     '.marker-source': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' },
            //     '.marker-target': { fill: 'yellow', d: 'M 10 0 L 0 5 L 10 10 z' }
            // });
            return link;
        },
        // linkView: joint.dia.LinkView.extend({
        //   markup: '<path class="connection"/><path class="marker-target"/><g class="labels" />'
        // }),
        // embeddingMode: true,
        // validateEmbedding: function(childView, parentView) {
        //     return parentView.model instanceof joint.shapes.devs.Coupled;
        // },
    });
    this._paper_.on('cell:pointerclick', function(cellView, e, x, y) {
        if (cellView.model instanceof joint.dia.Link) {
            console.log('is a link');
        }

        if (cellView.model instanceof joint.shapes.circuits.Resistor) {
            console.log('is a resistor');
        }

        // console.log(cellView);
        // console.log({
        //     'cellView': cellView,
        //     'e': e,
        //     'x': x,
        //     'y': y,
        // });
    });

}

Paper.prototype.getGraph = function () {
    return this._graph_;
};
