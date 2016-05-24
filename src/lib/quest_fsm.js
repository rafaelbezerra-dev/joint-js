var Questions = Questions || {};

Questions.FiniteStateMachine = function() {
  this._states_ = [];
  this._links_ = [];

  this._start_state_ = new joint.shapes.fsa.StartState({
    position : {
      x : 50,
      y : 50
    }
  });

};

Questions.FiniteStateMachine.prototype.draw = function (graph) {
    graph.addCell(this._start_state_);

    for (var i = 0; i < this._states_.length; i++) {
      graph.addCell(this._states_[i]);
    }

    for (var i = 0; i < this._links_.length; i++) {
      graph.addCell(this._links_[i]);
    }
};

Questions.FiniteStateMachine.prototype.getStart = function () {
  return this._start_state_;
};

Questions.FiniteStateMachine.prototype.buildState = function (x, y, label) {
    var cell = new joint.shapes.fsa.State({
      position : {
        x : x,
        y : y
      },
      size : {
        width : 60,
        height : 60
      },
      attrs : {
        text : {
          text : label,
          fill : '#000000',
          'font-weight' : 'normal'
        },
        'circle' : {
          fill : '#f6f6f6',
          stroke : '#000000',
          'stroke-width' : 2
        }
      }
    });
    // graph.addCell(cell);
    this._states_.push(cell);
    return cell;
};

Questions.FiniteStateMachine.prototype.linkStates = function (source, target, label, vertices) {
  var cell = new joint.shapes.fsa.Arrow({
      source : {
        id : source.id
      },
      target : {
        id : target.id
      },
      labels : [ {
        position : 0.5,
        attrs : {
          text : {
            text : label || '',
            'font-weight' : 'bold'
          }
        }
      } ],
      vertices : vertices || [],
      attrs: {
        '.connection': {
          'fill': 'none',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          // 'stroke': '#FF0000',
          // 'display': 'none',
        },
        // '.connection-wrap': {
        //   'display': 'none',
        // },
        '.link-tools .tool-remove': {
          'display': 'none',
        },
        '.marker-vertices .marker-vertex-group .marker-vertex-remove-area': {
          'display': 'none',
        },
        '.marker-vertices .marker-vertex-group .marker-vertex': {
          'r': '4',
          'fill': '#000000',
        },
        // '.marker-arrowhead': {
        //   'display': 'none',
        // },
      }
    });
    // graph.addCell(cell);
    this._links_.push(cell);
    return cell;
};


Questions.FiniteStateMachine.fromJson = function () {
  console.log('Questions.FiniteStateMachine.fromJson - Not yet implemented.');
}
