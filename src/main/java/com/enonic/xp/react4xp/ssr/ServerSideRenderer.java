package com.enonic.xp.react4xp.ssr;

import jdk.nashorn.api.scripting.NashornScriptEngine;
import jdk.nashorn.api.scripting.ScriptObjectMirror;
import org.apache.commons.lang.StringEscapeUtils;

import javax.script.ScriptException;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;


public class ServerSideRenderer {

    // TODO: Expose from react4xp-buildconstants and fetch from ../../../../../../../react4xp_constants.json
    public static String SCRIPTS_HOME = null;
    public static String LIBRARY_NAME = null;
    public static String CHUNKFILES_HOME = null;

    Set<String> componentScripts = new HashSet<>();

    public void setConfig(String SCRIPTS_HOME, String LIBRARY_NAME, String CHUNKFILES_HOME) throws IOException, ScriptException {
        ServerSideRenderer.SCRIPTS_HOME = SCRIPTS_HOME;         // "/react4xp"
        ServerSideRenderer.LIBRARY_NAME = LIBRARY_NAME;         // "React4xp"
        ServerSideRenderer.CHUNKFILES_HOME = CHUNKFILES_HOME;   // "/react4xp/"

        // Init the engine too
        EngineFactory.getEngine(SCRIPTS_HOME, CHUNKFILES_HOME);
    }


    // Examples:
    // component: name of a transpiled JSX component, i.e. path under /react4xp/, e.g: "site/parts/simple-reactive/simple-reactive"
    // props: valid stringified JSON on props object, e.g. '{"insertedMessage": "this is a prop!"}'
    public String renderToString(String component, String props) throws IOException, ScriptException {

        NashornScriptEngine engine = EngineFactory.getEngine(SCRIPTS_HOME, CHUNKFILES_HOME);

        StringBuilder script = new StringBuilder();
        try {
            if (!componentScripts.contains(component)) {
                System.out.println("Initializing ServerSideRenderer component: " + component);
                String componentScript = ResourceHandler.readResource(SCRIPTS_HOME + "/" + component + ".js");
                componentScripts.add(component);
                script.append(componentScript);
            }
            script.append("var obj = { rendered: ReactDOMServer.renderToString(" + LIBRARY_NAME + "['" + component + "'].default(" + props + ")) };");
            script.append("obj;");

            ScriptObjectMirror obj = (ScriptObjectMirror)engine.eval(script.toString());

            return (String)obj.get("rendered");

        } catch (ScriptException e) {
            e.printStackTrace();
            System.err.println("ERROR: " + ServerSideRenderer.class.getName() + ".renderToString:\n" +
                    "Message: " + e.getMessage() + "\n" +
                    "Component: " + component + "\n" +
                    "Props: " + props + "\n" +
                    "Script:\n---------------------------------\n\n" + script.toString() + "\n\n---------------------------------------");

            componentScripts.remove(component);
            engine.eval("delete " + LIBRARY_NAME + "['" + component + "']");

            return "<div class=\"react4xp-error\" style=\"border: 1px solid red; padding: 15px;\">" +
                    "<h2>" + StringEscapeUtils.escapeHtml(e.getClass().getName()) + "</h2>" +
                    "<p class=\"react4xp-component-name\">" + component + "</p>" +
                    "<p class=\"react4xp-error-message\">" + StringEscapeUtils.escapeHtml(e.getMessage()) + "</p>" +
                    "</div>";
        }
    }
}
