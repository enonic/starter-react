package com.enonic.xp.react4xp;

import jdk.nashorn.api.scripting.NashornScriptEngine;

import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import static com.enonic.xp.react4xp.Polyfills.POLYFILL_BASICS;


public class React4xp {
    private final static String CHUNKFILES_HOME = "/react4xp/";
    private final static String SCRIPTS_HOME = "/react4xp/";

    // Sequence matters! These scripts are run in this order,
    // scripts found in polyfill.json must come first, and components last!
    private final static List<String> CHUNK_FILES = Arrays.asList(
            CHUNKFILES_HOME + "chunks.nashornPolyfills.json",
            CHUNKFILES_HOME + "chunks.externals.json",
            CHUNKFILES_HOME + "chunks.core.json",
            CHUNKFILES_HOME + "chunks.components.json"
    );


    public void test() throws IOException {
        System.out.println("\n\n\n############################################# Running nashorn test...\n\n\n");

        try {

            NashornScriptEngine engine = (NashornScriptEngine)new ScriptEngineManager().getEngineByName("nashorn");
            engine.eval(POLYFILL_BASICS);
            //engine.eval(POLYFILL_TIMERS);

            List<String> dependencyScripts = new ChunkDependencyParser().getScriptDependencies(CHUNK_FILES);
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
