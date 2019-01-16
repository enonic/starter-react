package com.enonic.xp.react4xp;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

public class React4xp {
    public void test() {
        System.out.println("Testing nashorn...");

        ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");

        String nashornPolyfill = "" +
                "var global = this;\n" +
                "var window = this;\n" +
                "var process = {env:{}};\n" +
                "var console = {};\n" +
                "console.debug = print;\n" +
                "console.log = print;\n" +
                "console.warn = print;\n" +
                "console.error = print;";


        try {
            engine.eval(nashornPolyfill);
            engine.eval("k=14;");
            engine.eval("console.log('Howdy world!');");
            engine.eval("console.log(k);");

        } catch (ScriptException e) {
            e.printStackTrace();
        }
    }
}
