package com.enonic.xp.react4xp.ssr;

import jdk.nashorn.api.scripting.NashornScriptEngine;
import jdk.nashorn.api.scripting.ScriptObjectMirror;
import org.apache.commons.lang.StringEscapeUtils;

import javax.script.ScriptException;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;


public class ServerSideRenderer {
    public final static String SCRIPTS_HOME = "/react4xp";
    Set<String> componentScripts = new HashSet<>();

    // Examples:
    // component: name of a transpiled JSX component, i.e. path under /react4xp/, e.g: "site/parts/simple-reactive/simple-reactive"
    // props: valid stringified JSON on props object, e.g. '{"insertedMessage": "this is a prop!"}'
    public String renderToStaticMarkup(String component, String props) throws IOException, ScriptException {

        NashornScriptEngine engine = EngineFactory.getEngine();

        StringBuilder script = new StringBuilder();
        try {
            if (!componentScripts.contains(component)) {
                System.out.println("Initializing ServerSideRenderer component: " + component);
                String componentScript = ResourceHandler.readResource(SCRIPTS_HOME + "/" + component + ".js");
                componentScripts.add(component);
                script.append(componentScript);
            }
            script.append("var obj = { rendered: ReactDOMServer.renderToStaticMarkup(React4xp['" + component + "'].default(" + props + ")) };");
            script.append("obj;");

            ScriptObjectMirror obj = (ScriptObjectMirror)engine.eval(script.toString());

            return (String)obj.get("rendered");

        } catch (ScriptException e) {
            e.printStackTrace();
            System.err.println("ERROR: " + ServerSideRenderer.class.getName() + ".renderToStaticMarkup:\n" +
                    "Message: " + e.getMessage() + "\n" +
                    "Component: " + component + "\n" +
                    "Props: " + props + "\n" +
                    "Script:\n---------------------------------\n\n" + script.toString() + "\n\n---------------------------------------");

            componentScripts.remove(component);
            engine.eval("delete React4xp['" + component + "']");

            return "<div class=\"react4xp-error\" style=\"border: 1px solid red; padding: 15px;\">" +
                    "<h2>" + StringEscapeUtils.escapeHtml(e.getClass().getName()) + "</h2>" +
                    "<p class=\"react4xp-component-name\">" + component + "</p>" +
                    "<p class=\"react4xp-error-message\">" + StringEscapeUtils.escapeHtml(e.getMessage()) + "</p>" +
                    "</div>";
        }
    }
}
