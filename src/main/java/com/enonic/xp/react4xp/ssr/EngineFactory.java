package com.enonic.xp.react4xp.ssr;

import jdk.nashorn.api.scripting.NashornScriptEngine;

import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

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

    private static List<String> CHUNK_FILES = null;
    private static String ENTRIES_FILE = null;

    private static NashornScriptEngine engineInstance = null;

    private static void setConfig(String CHUNKFILES_HOME) {
        EngineFactory.ENTRIES_FILE = CHUNKFILES_HOME + "entries.json";

        /** CHUNK_FILES is a list of files that describe bundle/chunk asset file names, used to generate
         * a full list of dependency files, since the file names are hashed by webpack.
         * Sequence matters! These engine initialization scripts are run in this order.
         * Scripts found in chunks.json depend on the previous and must be the last!
         * nashornPolyfills.js script is the basic dependency, and will be added at the very beginning
         * outside of this list. */
        EngineFactory.CHUNK_FILES = Arrays.asList(
                CHUNKFILES_HOME + "chunks.externals.json",
                CHUNKFILES_HOME + "chunks.json"
        );
    }


    public static NashornScriptEngine getEngine(String CHUNKFILES_HOME) throws IOException, ScriptException {
        if (engineInstance == null) {

            setConfig(CHUNKFILES_HOME);

            // Sequence matters! Use ordered collection for iteration! Hashmaps are not ordered!
            LinkedList<String> scriptList = new LinkedList<>();
            HashMap<String, String> scripts = new HashMap<>();

            scripts.put("POLYFILL_BASICS", EngineFactory.POLYFILL_BASICS);
            scriptList.add("POLYFILL_BASICS");

            LinkedList<String> transpiledDependencies = new ChunkDependencyParser().getScriptDependencies(EngineFactory.CHUNK_FILES, EngineFactory.ENTRIES_FILE);
            transpiledDependencies.addFirst("nashornPolyfills.js");
            for (String scriptFile : transpiledDependencies) {
                String file = CHUNKFILES_HOME + scriptFile;
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
