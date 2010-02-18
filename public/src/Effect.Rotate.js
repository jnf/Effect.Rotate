/**
 * @author jnf (http://github.com/jnf)
 * @description Extends Scripty to include an element rotation effect. The implementation depends on browser detection
 * @dependency Prototype.js 1.6.1 (http://www.prototypejs.org)
 * @dependency Scriptaculous 1.8.3 (http://github.com/madrobby/scriptaculous)
 * @version 0.1
 *
 * @todo Fix IE rotation
 */
Effect.Rotate = function(element, delta, options) {
  var browser = $H(Prototype.Browser).find(function (f) { return true == f[1] })[0];
  var element = $(element);
  if ("IE" == browser) {
    //get the current rotation
    var transform = element.getStyle('filter');
    var degree = transform.match("M11='1.0'") ? 0 : 90;
    //return the proper tween effect
    return new Effect.Tween(element, degree, degree + delta, options,
      function(pos) {
        var radian = pos * (Math.PI * 2 / 360); //convert degree to radians
        var costheta = Math.cos(radian);
        var sintheta = Math.sin(radian);
        var style = "filter: progid:DXImageTransform.Microsoft.Matrix(SizingMethod='auto expand', "
          + "M11=" + costheta + ", M12=" + -sintheta + ", M21=" + sintheta + ", M22=" + costheta + ")";
        this.setStyle(style);
      }
    );
  } else {
    switch (browser) {
      case "Gecko":   var rule = "-moz-transform"; break;
      case "WebKit":  var rule = "-webkit-transform"; break;
      case "Opera":   var rule = "-o-transform"; break; //supported in opera 10.5+
      default:        var rule = false; break;
    }
    if (rule) {
      //get the current rotation
      var transform = element.getStyle(rule);
      var degree = transform ? transform.gsub(/[\(\)a-zA-Z:;\s]+/,'') * 1 : 0;
      //return the proper tween effect
      return new Effect.Tween(element, degree, degree + delta, options,
        function(pos) {
          this.setStyle(rule + ": rotate(" + pos + "deg);");
        }
      );
    } else {
      return false; //didn't match a browser
    }
  }
};