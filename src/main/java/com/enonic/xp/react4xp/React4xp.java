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
            "console.error = print;";

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
