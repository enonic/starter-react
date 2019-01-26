package com.enonic.xp.react4xp.ssr;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import jdk.nashorn.api.scripting.NashornScriptEngine;


import static com.enonic.xp.react4xp.ssr.ServerSideRenderer.SCRIPTS_HOME;

public class EngineFactory {
    private final static String POLYFILL_BASICS = "" +
            "if (typeof exports === 'undefined') { var exports = {}; }\n" +
            "if (typeof global === 'undefined') { var global = this; }\n" +
            "if (typeof window === 'undefined') { var window = this; }\n" +
            "if (typeof process === 'undefined') { var process = {env:{}}; }\n" +
            "if (typeof console === 'undefined') { var console = {}; }\n" +
            "console.debug = print;\n" +
            "console.log = print;\n" +
            "console.warn = print;\n" +
            "console.error = print;";

    private final static String CHUNKFILES_HOME = "/react4xp/";


    // Sequence matters! These engine initialization scripts are run in this order.
    // Scripts found in chunks.json depend on the previous and must be the last!
    // nashornPolyfills.js script is the basic dependency, and will be added at the very beginning outside of this list.
    private final static List<String> CHUNK_FILES = Arrays.asList(
            CHUNKFILES_HOME + "chunks.externals.json",
            CHUNKFILES_HOME + "chunks.json"
    );

    private static NashornScriptEngine engineInstance = null;

    public static NashornScriptEngine getEngine() throws IOException, ScriptException {
        if (engineInstance == null) {

            // Sequence matters! Use ordered collection for iteration! Hashmaps are not ordered!
            LinkedList<String> scriptList = new LinkedList<>();
            HashMap<String, String> scripts = new HashMap<>();

            scripts.put("POLYFILL_BASICS", POLYFILL_BASICS);
            scriptList.add("POLYFILL_BASICS");

            LinkedList<String> transpiledDependencies = new ChunkDependencyParser().getScriptDependencies(CHUNK_FILES);
            transpiledDependencies.addFirst("nashornPolyfills.js");
            for (String scriptFile : transpiledDependencies) {
                String file = SCRIPTS_HOME + scriptFile;
                scripts.put(file, ResourceHandler.readResource(file));
                scriptList.add(file);
            }

            StringBuilder script = new StringBuilder();

            String chunkLabel = null;
            String chunkScript = null;

            try {
                engineInstance = (NashornScriptEngine)new ScriptEngineManager().getEngineByName("nashorn");

                for (String scriptFile : scriptList) {
                    chunkLabel = scriptFile;
                    chunkScript = scripts.get(chunkLabel);
                    System.out.println("Initializing ServerSideRenderer engine: " + chunkLabel);
                    script.append(chunkScript);
                }

                engineInstance.eval(script.toString());

            } catch (ScriptException bloatedError) {

                // Multiple scripts were chained together, then evaluated, then one failed.
                // Unravel which one failed in order to give a clear error message:
                try {
                    NashornScriptEngine tmpEngineInstance = (NashornScriptEngine)new ScriptEngineManager().getEngineByName("nashorn");
                    for (String scriptFile : scriptList) {
                        chunkLabel = scriptFile;
                        chunkScript = scripts.get(chunkLabel);
                        tmpEngineInstance.eval(chunkScript);
                    }

                } catch (ScriptException specificError) {
                    System.err.println(EngineFactory.class.getCanonicalName() + " INIT SCRIPT FAILED (" + chunkLabel + "):\n---------------------------------\n\n" + chunkScript + "\n\n---------------------------------------");
                    throw specificError;
                }

                // Fallback if unravelling failed
                System.err.println(EngineFactory.class.getCanonicalName() + " INIT SCRIPTS FAILED (script interaction?):\n---------------------------------\n\n" + script.toString() + "\n\n---------------------------------------");
                throw bloatedError;
            }
        }

        return engineInstance;
    }
}












    /* For reference: the following is now replaced by transpiled code, read from transpiled file: _nashornPolyfills_.js



    // Polyfilling setTimeout() and friends:
    // https://gist.github.com/josmardias/20493bd205e24e31c0a406472330515a
    //
    public final static String POLYFILL_TIMERS = "(function(context) {\n" +
                    "  'use strict';\n" +
                    "\n" +
                    "  var Timer = Java.type('java.util.Timer');\n" +
                    "  var Phaser = Java.type('java.util.concurrent.Phaser');\n" +
                    "\n" +
                    "  var timer = new Timer('jsEventLoop', false);\n" +
                    "  var phaser = new Phaser();\n" +
                    "\n" +
                    "  var timeoutStack = 0;\n" +
                    "  function pushTimeout() {\n" +
                    "    timeoutStack++;\n" +
                    "  }\n" +
                    "  function popTimeout() {\n" +
                    "    timeoutStack--;\n" +
                    "    if (timeoutStack > 0) {\n" +
                    "      return;\n" +
                    "    }\n" +
                    "    timer.cancel();\n" +
                    "    phaser.forceTermination();\n" +
                    "  }\n" +
                    "\n" +
                    "  var onTaskFinished = function() {\n" +
                    "    phaser.arriveAndDeregister();\n" +
                    "  };\n" +
                    "\n" +
                    "  context.setTimeout = function(fn, millis) {\n" +
        "    var args = [].slice.call(arguments, 2, arguments.length);\n" +
        "\n" +
        "    var phase = phaser.register();\n" +
        "    var canceled = false;\n" +
        "    timer.schedule(function() {\n" +
        "      if (canceled) {\n" +
        "        return;\n" +
        "      }\n" +
        "\n" +
        "      try {\n" +
        "        fn.apply(context, args);\n" +
        "      } catch (e) {\n" +
        "        print(e);\n" +
        "      } finally {\n" +
        "        onTaskFinished();\n" +
        "        popTimeout();\n" +
        "      }\n" +
        "    }, millis);\n" +
        "\n" +
        "    pushTimeout();\n" +
        "\n" +
        "    return function() {\n" +
        "      onTaskFinished();\n" +
        "      canceled = true;\n" +
        "      popTimeout();\n" +
        "    };\n" +
        "  };\n" +
        "\n" +
        "  context.clearTimeout = function(cancel) {\n" +
        "    cancel();\n" +
        "  };\n" +
        "\n" +
        "  context.setInterval = function(fn, delay) {\n" +
        "    var args = [].slice.call(arguments, 2, arguments.length);\n" +
        "\n" +
        "    var cancel = null;\n" +
        "\n" +
        "    var loop = function() {\n" +
        "      cancel = context.setTimeout(loop, delay);\n" +
        "      fn.apply(context, args);\n" +
        "    };\n" +
        "\n" +
        "    cancel = context.setTimeout(loop, delay);\n" +
        "    return function() {\n" +
        "      cancel();\n" +
        "    };\n" +
        "  };\n" +
        "\n" +
        "  context.clearInterval = function(cancel) {\n" +
        "    cancel();\n" +
        "  };\n" +
        "\n" +
        "})(this);";

//public static final String POLYFILL_SET_AND_MAP = "!function(t){var n={};function e(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,e),r.l=!0,r.exports}e.m=t,e.c=n,e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:i})},e.r=function(t){\"undefined\"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:\"Module\"}),Object.defineProperty(t,\"__esModule\",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&\"object\"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(e.r(i),Object.defineProperty(i,\"default\",{enumerable:!0,value:t}),2&n&&\"string\"!=typeof t)for(var r in t)e.d(i,r,function(n){return t[n]}.bind(null,r));return i},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,\"a\",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p=\"\",e(e.s=22)}({0:function(t,n){var e;e=function(){return this}();try{e=e||new Function(\"return this\")()}catch(t){\"object\"==typeof window&&(e=window)}t.exports=e},22:function(t,n,e){\"use strict\";(function(t){var n=e(6).map,i=e(6).set;!function(t){t.Map=n,t.Set=i}(\"undefined\"!=typeof window?window:t)}).call(this,e(0))},6:function(t,n,e){t.exports=function(){\"use strict\";var t,n={},e=\"undefined\"!=typeof Symbol,i=Array.prototype,r=(t={}.hasOwnProperty,function(n,e){return!!e&&t.call(n,e)}),u=Array.isArray;function s(t){return null!=t&&(\"function\"==typeof t||\"object\"==typeof t)}function o(t){return!isNaN(t)&&t+0===t}var l,c,a,h=(c=Function.prototype,function(t){return\"function\"==typeof t&&t!=c});function f(t){if(!s(t)||h(t)||null!=(n=t)&&n===n.window)return!1;var n,e=!!t&&\"length\"in t&&t.length;return u(t)||0===e||o(e)&&e>0&&e-1 in t}function p(t,n,e){var i,r,u=[],s=t.length;if(n=(n=n||0)>=0?n:Math.max(0,s+n),(e=isNaN(e)?s:Math.min(e,s))<0&&(e=s+e),(r=e-n)>0)for(u=new Array(r),i=0;i<r;i++)u[i]=t[n+i];return u}function y(t,n){var e=t.prototype=Object.create(n&&n.prototype||null);return e.constructor=t,e}function v(t){t=t||8;for(var n=\"\";(n+=Math.random().toString(16).slice(2)).length<t;);return n.slice(0,t)}function d(t,n){if(!s(t))return t+\"\";var e=t.objectUniqueID;return e||n||Object.defineProperty(t,\"objectUniqueID\",{value:e=v()}),e}function g(t,n){var e=t[n];return t.splice(n,1),e}function x(t,n,e){if(f(n)||(n=[n]),void 0===e)i.push.apply(t,n);else{var r=[e,0];i.push.apply(r,n),i.splice.apply(t,r)}return t}function k(){this.values=[],this.primitiveKeys=[],this.keyToValue={}}function b(){this.keys=[],this.IDToKey={},k.call(this)}function T(t){k.call(this),t&&(f(t)||(t=[t]),this.addMulti(t))}return function(){function t(t,n,e){for(var i,r=1;r<n.length;r++)for(var u=n[r],s=0;-1!=(s=t.indexOf(u,s));){if(g(t,s),e)return s;i||(i=[]),i.push(s)}return i}l=function(n){return t(n,arguments,!0)}}(),function(t,n){function e(t){return this.key=this.primitiveKeys[this.index]||null,this.value=this.key&&this.keyToValue[this.key],t?this.value:!!this.key}n.values=null,n.primitiveKeys=null,n.keyToValue=null,n.length=0,n.index=-1,n.key=null,n.value=null,n.start=function(){this.index=-1,e.call(this)},n.end=function(){this.index=this.length,e.call(this)},n.first=function(t){return this.index=0,e.call(this,t)},n.next=function(t){return this.index++,e.call(this,t)},n.prev=function(t){return this.index--,e.call(this,t)},n.last=function(t){return this.index=this.length-1,e.call(this,t)},n.getFirst=function(){return this.first(!0)},n.getNext=function(){return this.next(!0)},n.getPrev=function(){return this.prev(!0)},n.getLast=function(){return this.last(!0)},n.clear=function(){return this.values=[],this.primitiveKeys=[],this.keyToValue={},this.length=0,this.index=-1,this.key=null,this.value=null,this},t.set=function(t,n,e,i,u){return function(t,n,e,i){var u=r(this.keyToValue,t),s=!u||!e;return u||(x(this.values,n,i),x(this.primitiveKeys,t,i),this.length++),s&&(u&&(this.values[this.primitiveKeys.indexOf(t)]=n),this.keyToValue[t]=n),s}.call(t,n,e,i,u)},t.get=function(t,n){return function(t){return this.keyToValue[t]}.call(t,n)},t.has=function(t,n){return function(t){return r(this.keyToValue,t)}.call(t,n)},t.delete=function(t,n){return function(t){var n=-1;return r(this.keyToValue,t)&&(delete this.keyToValue[t],g(this.values,n=l(this.primitiveKeys,t)),this.length--),n}.call(t,n)}}(k,k.prototype),n.map=b,function(t,n){function u(t,n,e,i){var r=d(t),u=!!r&&k.set(this,r,n,e,i);return u&&(x(this.keys,t,i),this.IDToKey[r]=t),u}function l(t,n,e){var i,r;if(this.has(t)){if(!o(i=this.get(t)))return!1}else i=0;return r=i,u.call(this,t,i+=n)?e||(r=i):r=!1,r}function c(t,n,e,i){var r,s=this.has(t),o=!1;return(s?f(r=this.get(t)):e)&&(s||(r=[]),o=n.apply(r,e||[]),i&&(r=o),s&&!i||u.call(this,t,r)||(o=!1)),o}function a(t,n,e,i){var o,l;return!(this.has(t)?!s(o=this.get(t)):!u.call(this,t,o={}))&&((l=!r(o,n)||!i)&&(o[n]=e),l)}function h(t,e){var i=n[t].apply(this,e);return this.key=this.IDToKey[this.key],i}t.keys=null,t.IDToKey=null,t.set=function(t,n,e){return u.call(this,t,n,!1,e),this},t.add=function(t,n,e){return u.call(this,t,n,!0,e)},t[\"++\"]=function(t){return l.call(this,t,1,!0)},t[\"--\"]=function(t){return l.call(this,t,-1)},t.push=function(t){return c.call(this,t,i.push,p(arguments,1))},t.unshift=function(t){return c.call(this,t,i.unshift,p(arguments,1))},t.concat=function(t){return c.call(this,t,i.concat,p(arguments,1),!0)},t.splice=function(t){return c.call(this,t,i.splice,p(arguments,1),!0)},t.pop=function(t){return c.call(this,t,i.pop)},t.shift=function(t){return c.call(this,t,i.shift)},t.setProp=function(t,n,e){return a.call(this,t,n,e,!1)},t.addProp=function(t,n,e){return a.call(this,t,n,e,!0)},t.getProp=function(t,n){var e;return this.has(t)&&s(e=this.get(t))&&e[n]},t.hasProp=function(t,n){var e,i;return(function(t){return!s(t)}(i=n)||\"toString\"in i)&&this.has(t)&&s(e=this.get(t))&&r(e,n)},t.deleteProp=function(t,n){var e,i=this.has(t)&&s(e=this.get(t))&&r(e,n);return i&&delete e[n],i},t.get=function(t){var n=d(t,!0);return n&&k.get(this,n)||void 0},t.has=function(t){var n=d(t,!0);return!!n&&k.has(this,n)},t.delete=function(t){var n=d(t),e=!!n&&r(this.IDToKey,n);return e&&(delete this.IDToKey[n],g(this.keys,k.delete(this,n))),e},t.first=function(){return h.call(this,\"first\",arguments)},t.next=function(){return h.call(this,\"next\",arguments)},t.prev=function(){return h.call(this,\"prev\",arguments)},t.last=function(){return h.call(this,\"last\",arguments)},e&&(t[Symbol.iterator]=function(){var t=this;return this.start(),{next:function(){return{done:!t.next(),value:[t.key,t.value]}}}}),t.clear=function(){n.clear.call(this),this.IDToKey={}},t.clone=function(){var t=new b;for(this.start();this.next();)t.add(this.key,this.value);return t}}(y(b,k),k.prototype),n.set=T,(a=y(T,k)).add=function(t,n){var e=d(t);return!!e&&k.set(this,e,t,!0,n)},a.addMulti=function(t,n){for(var e=0,i=0;i<t.length;i++)this.add(t[i],n)&&e++;return e},a.has=function(t){var n=d(t,!0);return!!n&&k.has(this,n)},a.delete=function(t){var n=d(t,!0);return-1!=k.delete(this,n)},e&&(a[Symbol.iterator]=function(){var t=this;return this.start(),{next:function(){return{done:!t.next(),value:t.value}}}}),a.clone=function(){var t=new T;for(this.start();this.next();)t.add(this.value);return t},n}()}});";

*/
