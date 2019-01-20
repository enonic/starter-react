package com.enonic.xp.react4xp;

import jdk.nashorn.api.scripting.NashornScriptEngine;

import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

public class React4xp {
    private final static String NASHORN_POLYFILL = "" +
            "if (typeof exports === 'undefined') { var exports = {}; }\n" +
            "if (typeof global === 'undefined') { var global = this; }\n" +
            "if (typeof window === 'undefined') { var window = this; }\n" +
            "if (typeof process === 'undefined') { var process = {env:{}}; }\n" +
            "if (typeof console === 'undefined') { var console = {}; }\n" +
            "console.debug = print;\n" +
            "console.log = print;\n" +
            "console.warn = print;\n" +
            "console.error = print;\n" +

            // Polyfill Map:
            "var Map = Java.type('java.util.HashMap');\n"+

            // Polyfilling setTimeout() and friends:
            // https://gist.github.com/josmardias/20493bd205e24e31c0a406472330515a
            //
            // TODO: Are we gonna have a problem?
            // At least one timeout needs to be set, larger then your code bootstrap
            // or Nashorn will run forever
            // preferably, put a timeout 0 after your code bootstrap
            "(function(context) {\n" +
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
            "  context.setTimeout = function(fn, millis /* [, args...] */) {\n" +
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
            "  context.setInterval = function(fn, delay /* [, args...] */) {\n" +
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

    private final static String CHUNKFILES_HOME = "/react4xp/";
    private final static String SCRIPTS_HOME = "/react4xp/";

    private final static List<String> CHUNK_FILES = Arrays.asList(
            CHUNKFILES_HOME + "externalsChunks.json",
            CHUNKFILES_HOME + "coreChunks.json",
            CHUNKFILES_HOME + "commonChunks.json"
    );


    public void test() throws IOException {
        System.out.println("\n\n\n############################################# Running nashorn test...\n\n\n");

        try {

            NashornScriptEngine engine = (NashornScriptEngine)new ScriptEngineManager().getEngineByName("nashorn");
            engine.eval(NASHORN_POLYFILL);

            List<String> dependencyScripts = new ScriptDependencyParser().getScriptDependencies(CHUNK_FILES);
            for (String scriptFile : dependencyScripts) {
                System.out.println("\tReading and running script: " + SCRIPTS_HOME + scriptFile);
                String script = ResourceHandler.readResource(SCRIPTS_HOME + scriptFile);
                engine.eval(script);
            }

            engine.eval("k = 42;");
            //engine.eval(backendReact);
            //engine.eval(backendReactDOMServer);

            engine.eval("console.log('Howdy world!');");
            engine.eval("console.log(k);");

            engine.eval("console.log(Object.keys(exports));");

        } catch (ScriptException e) {
            e.printStackTrace();
        }
    }
}

/*
react4xp/vendors.0743d21ce.js
react4xp/common.70ca71244.js
components.a0a62a368.js
*/
