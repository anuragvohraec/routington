
var flatten = require('flatten')

var Routington = require('./routington')

/*

  @route {string}

  returns []routington

*/
Routington.prototype.define = function (route) {
  if (typeof route !== 'string') throw new TypeError('Only strings can be defined.')

  try {
    return Define(route.split('/'), this, route)
  } catch (err) {
    err.route = route
    throw err
  }
}

function Define(frags, root, route) {
  this.route = route;
  var frag = frags[0]
  var info = Routington.parse(frag)
  var name = info.name

  var nodes = Object.keys(info.string).map(function (x) {
    return {
      name: name,
      string: x,
      route: route
    }
  })

  if (info.regex) {
    nodes.push({
      name: name,
      regex: info.regex,
      route: route
    })
  }

  if (!nodes.length) {
    nodes = [{
      name: name,
      route: route
    }]
  }

  nodes = nodes.map(root._add, root)

  return frags.length - 1
    ? flatten(nodes.map(function(g){
      let t = Define.bind(null, frags.slice(1), g, route)
      return t();
    }))
    : nodes
}
