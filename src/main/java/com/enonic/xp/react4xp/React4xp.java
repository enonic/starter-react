package com.enonic.xp.react4xp;

import jdk.nashorn.api.scripting.NashornScriptEngine;
import jdk.nashorn.api.scripting.ScriptObjectMirror;

import javax.script.ScriptException;
import java.io.IOException;


public class React4xp {
    public final static String SCRIPTS_HOME = "/react4xp/";

    // Examples:
    // component: "site/parts/simple-reactive/simple-reactive"
    // props: "{\"insertedMessage\": \"fra den simple kontrolleren!\"}"
    public String renderToStaticMarkup(String component, String props) throws IOException {
        try {
            NashornScriptEngine engine = EngineFactory.getEngine();

            // TODO: Make function library where (props)=> component functions are stored in the engine, on first use
            
            engine.eval(ResourceHandler.readResource(SCRIPTS_HOME + component + ".js"));
            engine.eval(""
                // + "console.log(Object.keys(React4xp));"
                + "var props = " + props + ";"
                + "var Component = React4xp['" + component + "'].default;"
                // + "console.log('Component: ' + Component);"
                // + "console.log('ReactDOMServer: ' + JSON.stringify(Object.keys(ReactDOMServer), null, 2));"
                + "var obj = { rendered: ReactDOMServer.renderToStaticMarkup(Component(props)) };"
                // + "console.log(obj.rendered);"
            );

            ScriptObjectMirror obj = (ScriptObjectMirror)engine.eval("obj;");
            return (String)obj.get("rendered");

        } catch (ScriptException e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }
}
