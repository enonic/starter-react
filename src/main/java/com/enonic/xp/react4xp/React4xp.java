package com.enonic.xp.react4xp;

import jdk.nashorn.api.scripting.NashornScriptEngine;

import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class React4xp {
    private static String NASHORN_POLYFILL = "" +
            "if (typeof exports === 'undefined') { var exports = {}; }\n" +
            "if (typeof global === 'undefined') { var global = this; }\n" +
            "if (typeof window === 'undefined') { var window = this; }\n" +
            "if (typeof process === 'undefined') { var process = {env:{}}; }\n" +
            "if (typeof console === 'undefined') { var console = {}; }\n" +
            "console.debug = print;\n" +
            "console.log = print;\n" +
            "console.warn = print;\n" +
            "console.error = print;";


    /** Read as string the content of a file (resource) inside the built JAR.
      * @param path is full "file" name, relative to JAR root. */
    private String readResource(String path) throws IOException {
        //System.out.println("Reading resource: " + path);

        InputStream in = getClass().getResourceAsStream(path);
        if (in == null) {
            throw new FileNotFoundException("Not found: " + path);
        }

        BufferedReader reader = new BufferedReader(new InputStreamReader(in));
        StringBuilder sb = new StringBuilder();
        String line;

        try {
            while ((line = reader.readLine()) != null) {
                sb.append(line + "\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
            throw e;

        } finally {
            try {
                reader.close();
                in.close();

            } catch (IOException e) {
                e.printStackTrace();
                throw e;
            }
        }

        //System.out.println("\tOK");
        return sb.toString();
    }


    public void test() throws IOException {
        System.out.println("Testing nashorn...");

        // Proof of concept:
        String backendReact = readResource("/lib/enonic/react4xp/backendReact.js");
        String backendReactDOMServer = readResource("/lib/enonic/react4xp/backendReactDOMServer.js");

        try {
            System.out.println("\n\n\n############################################# Running...\n\n\n:");

            NashornScriptEngine engine = (NashornScriptEngine)new ScriptEngineManager().getEngineByName("nashorn");

            engine.eval(NASHORN_POLYFILL);
            engine.eval("k = 42;");
            engine.eval(backendReact);
            engine.eval(backendReactDOMServer);

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
