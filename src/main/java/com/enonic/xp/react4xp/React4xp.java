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
            //CHUNKFILES_HOME + "chunks.core.json",
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

            /////////////////////////////////////////////////////////////

            String testComponent = ResourceHandler.readResource(SCRIPTS_HOME + "site/parts/simple-reactive/simple-reactive.js");
            engine.eval(testComponent);
            engine.eval("console.log(Object.keys(React4xp));");
            engine.eval("var props = {insertedMessage: \"fra den simple kontrolleren!\"};");

            engine.eval("var Component = React4xp['site/parts/simple-reactive/simple-reactive'].default;");
            engine.eval("console.log('Component: ' + Component);");

            engine.eval("console.log('ReactDOMServer: ' + JSON.stringify(Object.keys(ReactDOMServer), null, 2));");
            engine.eval("var rendered = ReactDOMServer.renderToString(Component(props));");
            engine.eval("console.log(rendered);");


        } catch (ScriptException e) {
            e.printStackTrace();
        }
    }
}
