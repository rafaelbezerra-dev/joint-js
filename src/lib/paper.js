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
    linkPinning: false,
    // embeddingMode: true,
    // validateEmbedding: function(childView, parentView) {
    //     return parentView.model instanceof joint.shapes.devs.Coupled;
    // },

    validateConnection: function (sourceView, sourceMagnet, targetView, targetMagnet) {
        return sourceMagnet != targetMagnet;        
    }

    // defaultLink: function(cellView, magnet) {
    //   var link = new joint.dia.Link();
    //   link.attr({
    //       '.connection': { stroke: 'blue' },
    //       '.marker-source': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' },
    //       '.marker-target': { fill: 'yellow', d: 'M 10 0 L 0 5 L 10 10 z' }
    //   });
    // }
    // linkView: joint.dia.LinkView.extend({
    //   markup: '<path class="connection"/><path class="marker-target"/><g class="labels" />'
    // })
  });
}

Paper.prototype.getGraph = function () {
  return this._graph_;
};
