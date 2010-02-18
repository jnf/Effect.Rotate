// Effect.Transitions.easing.js
//==============================================================================
// Robert Penner's easing functions v2.0 (http://www.robertpenner.com/easing)
// Ported to Scriptaculous 1.8 by Riccardo De Agostini (lozioric AT gmail.com)
//
// Original terms of use (http://www.robertpenner.com/easing_terms_of_use.html)
// also apply to this modification.
//==============================================================================
//
// Penner's functions take a minimum of four parameters named t, b, c and d,
// plus, in some cases, optional customization parameters (for details, see
// http://www.robertpenner.com/easing/penner_chapter7_tweening.pdf)
//
// Scriptaculous' transitions are a simplified case of Penner's functions,
// where b is always 0, c is always 1, and d is always 1. I've thus simplified
// the original ActionScript code.
// I've also added some transformation functions, which can take an easeIn, an
// easeOut or an easeIn / easeOut pair and turn them into a complete set of
// transition functions. This obviously introduces some overhead, but greatly
// simplifies the code.
//
// Simple usage example:
//
//    new Effect.Move(myElement, {
//        transition: Effect.Transitions.Cubic.easeInOut
//    });
//
// Customization parameters, where present, may be used as follows:
//
//    // No customization (use Penner's default value)
//    new Effect.Move(myElement, {
//        transition: Effect.Transitions.Back.easeIn
//    });
//
//    // Customized easing
//    new Effect.Move(myElement, {
//        transition: Effect.Transitions.Back.easeIn.custom(2.5)
//    });
//
//==============================================================================
// Changelog:
// 2009-04-24 Initial release
// 2009-04-27 Corrected Sine functions, thanks to advice from Henry on Google's
//             prototype-scriptaculous group
//            Added pre-computed HALF_PI and TWO_PI (also thanks to Henry)
//==============================================================================

Object.extend(Effect.Transitions, (function() {

    //----------------------------------------------------------------------
    // Function transformations
    //----------------------------------------------------------------------

    // easeIn to easeOut and vice versa
    function reverse(eq, t)
    {
        return 1 - eq(1 - t);
    }

    // easeIn to easeInOut
    function easeInToEaseInOut(easeIn, t)
    {
        t = 2 * t;
        return 0.5 * (t < 1 ? easeIn(t) : 2 - easeIn(2 - t));
    }

    // easeOut to easeInOut
    function easeOutToEaseInOut(easeOut, t)
    {
        t = 2 * t;
        return 0.5 * (t < 1 ? 1 - easeOut(1 - t) : 1 + easeOut(t - 1));
    }

    // easeIn / easeOut pair to easeInOut
    function easeInOutPairToEaseInOut(easeIn, easeOut, t)
    {
        t = 2 * t;
        return 0.5 * (t < 1 ? easeIn(t) : 1 + easeOut(t - 1));
    }

    //----------------------------------------------------------------------
    // Function set builders
    //----------------------------------------------------------------------

    // Build a function set from a complete set of easing functions
    function functionSet(easeIn, easeOut, easeInOut)
    {
        return {
            easeIn   : easeIn,
            easeOut  : easeOut,
            easeInOut: easeInOut
        };
    }

    // Build a complete function set from just an easeIn
    function functionSetFromEaseIn(easeIn)
    {
        return {
            easeIn   : easeIn,
            easeOut  : reverse.curry(easeIn),
            easeInOut: easeInToEaseInOut.curry(easeIn)
        };
    }

    // Build a complete function set from just an easeOut
    function functionSetFromEaseOut(easeOut)
    {
        return {
            easeIn   : reverse.curry(easeOut),
            easeOut  : easeOut,
            easeInOut: easeOutToEaseInOut.curry(easeOut)
        };
    }

    // Build a complete function set from an easeIn / easeOut pair
    function functionSetFromEaseInOutPair(easeIn, easeOut)
    {
        return {
            easeIn   : easeIn,
            easeOut  : easeOut,
            easeInOut: easeInOutPairToEaseInOut.curry(easeIn, easeOut)
        };
    }

    // Build a complete function set from just an easeIn,
    // where the given function has custom parameters
    function customizableFunctionSetFromEaseIn()
    {
        var args = $A(arguments);
        var easeIn = args.shift();

        function customEaseIn()
        {
            var args = [0].concat($A(arguments));

            return function(t)
            {
                args[0] = t;
                return easeIn.apply(this, args);
            };
        }

        function customEaseOut()
        {
            return reverse.curry(customEaseIn.apply(this, arguments));
        }

        function customEaseInOut()
        {
            return easeInToEaseInOut.curry(customEaseIn.apply(this, arguments));
        }

        var myEaseIn = customEaseIn.apply(this, args);
        myEaseIn.custom = customEaseIn;
        var myEaseOut = reverse.curry(myEaseIn);
        myEaseOut.custom = customEaseOut;
        var myEaseInOut = easeInToEaseInOut.curry(myEaseIn);
        myEaseInOut.custom = customEaseInOut;

        return {
            easeIn   : myEaseIn,
            easeOut  : myEaseOut,
            easeInOut: myEaseInOut
        };
    }

    //----------------------------------------------------------------------
    // Useful pre-computed values
    //----------------------------------------------------------------------

    var HALF_PI = Math.PI / 2;
    var TWO_PI  = 2 * Math.PI;

    //----------------------------------------------------------------------
    // Penner's tween equations, simplified for Scriptaculous
    //----------------------------------------------------------------------

    function Quad_easeIn(t)
    {
        return t * t;
    }

    function Cubic_easeIn(t)
    {
        return t * t * t;
    }

    function Quart_easeIn(t)
    {
        return t * t * t * t;
    }

    function Quint_easeIn(t)
    {
        return t * t * t * t * t;
    }

    // This one is not Penner's: it's just a generalized case, for use when
    // i.e. Quad is too "soft" for your tastes but Cubic is too "quick"
    // (in this specific case you could use Pow.custom(2.5) for example)
    function Pow_easeIn(t, p)
    {
        return Math.pow(t, p);
    }

    function Back_easeIn(t, s)
    {
        return t * t * ((s + 1) * t - s);
    }

    // TODO (maybe): customize (customizableize? :-) ) this one
    function Bounce_easeOut(t)
    {
        if (t < (1 / 2.75))
            return 7.5625 * t * t;
        if (t < (2 / 2.75))
            return 7.5625 * (t-= (1.5 / 2.75)) * t + 0.75;
        if (t < (2.5 / 2.75))
            return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375;
        return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375;
    }

    function Circ_easeIn(t)
    {
        return -1 * (Math.sqrt(1 - t * t) - 1);
    }

    function Circ_easeOut(t)
    {
        t -= 1;
        return Math.sqrt(1 - t * t);
    }

    function Elastic_easeIn(t, a, p)
    {
        if (t == 0) return 0;
        if (t == 1) return 1;
        if (a < 1)
        {
            a = 1;
            var s = p / 4;
        }
        else
        {
            var s = p / TWO_PI * Math.asin(1 / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * TWO_PI / p));
    }

    function Expo_easeIn(t)
    {
        return (t == 0) ? 0 : Math.pow(2, 10 * (t - 1));
    }

    function Expo_easeOut(t)
    {
        return (t == 1) ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function Sine_easeIn(t)
    {
        return Math.cos(t * HALF_PI) + 1;
    }

    function Sine_easeOut(t)
    {
        return Math.sin(t * HALF_PI);
    }

    function Sine_easeInOut(t)
    {
        return -0.5 * (Math.cos(Math.PI * t) - 1);
    }
    //--------------------------------------------------------------------------
    // Build and return the equation sets
    //--------------------------------------------------------------------------
    return {
        Quad   : functionSetFromEaseIn(Quad_easeIn),
        Cubic  : functionSetFromEaseIn(Cubic_easeIn),
        Quart  : functionSetFromEaseIn(Quart_easeIn),
        Quint  : functionSetFromEaseIn(Quint_easeIn),
        Pow    : customizableFunctionSetFromEaseIn(Pow_easeIn, 2), // Defaults to Quad
        Back   : customizableFunctionSetFromEaseIn(Back_easeIn, 1.70158),
        Bounce : functionSetFromEaseOut(Bounce_easeOut),
        Circ   : functionSetFromEaseInOutPair(Circ_easeIn, Circ_easeOut),
        Elastic: customizableFunctionSetFromEaseIn(Elastic_easeIn, 1, 0.3),
        Expo   : functionSetFromEaseInOutPair(Expo_easeIn, Expo_easeOut),
        Sine   : functionSet(Sine_easeIn, Sine_easeOut, Sine_easeInOut)
    };
})());