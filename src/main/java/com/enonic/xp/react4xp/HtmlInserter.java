package com.enonic.xp.react4xp;

import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.XMLOutputter;

import java.io.IOException;
import java.io.StringReader;


public class HtmlInserter {
    private static SAXBuilder saxBuilder = new SAXBuilder();
    private static XMLOutputter outputter = new XMLOutputter();
    static {
        // Make the output HTML-compliant:
        outputter.getFormat()
                .setOmitDeclaration(true)
                .setOmitEncoding(true)
                .setExpandEmptyElements(true);
    }

    public String insertAtEndOfRoot(String body, String insert) {
        //System.out.println("\n\nBODY:\n" + body);
        //System.out.println("INSERT:\n" + insert);
        try {
            Document bodyDoc = saxBuilder.build(new StringReader(body));
            //System.out.println("bodyDoc:\n" + bodyDoc.toString());
            Element bodyRoot = bodyDoc.getRootElement();
            //System.out.println("bodyRoot:\n" + bodyRoot.toString());

            Document insertDoc = saxBuilder.build(new StringReader(insert));
            //System.out.println("insertDoc:\n" + insertDoc.toString());
            Element insertRoot = insertDoc.getRootElement();
            //System.out.println("insertRoot:\n" + insertRoot.toString());

            insertRoot.detach();
            bodyRoot.addContent(insertRoot);
            //System.out.println("bodyRoot:\n" + bodyRoot);

            //System.out.println("Output:\n" + outputter.outputString(bodyDoc) + "\n\n");
            return outputter.outputString(bodyDoc);

        } catch (JDOMException | IOException e) {
            System.err.println("\n\nERROR: [ " + e + " ] ... while trying to insert HTML:\n\n" + insert + "\n\n...into body:\n\n" + body + "\n\n");
        }

        return null;
    }
}
