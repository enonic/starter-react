package com.enonic.xp.htmlinserter;

import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.XMLOutputter;

import java.io.IOException;
import java.io.StringReader;


public class HtmlInserter {
    private SAXBuilder saxBuilder = new SAXBuilder();

    public String insertAtEndOfRoot(String body, String insert) {
        System.out.println("BODY:\n" + body);
        try {
            Document bodyDoc = saxBuilder.build(new StringReader(body));
            System.out.println("bodyDoc:\n" + bodyDoc.toString());
            Element bodyRoot = bodyDoc.getRootElement();
            System.out.println("bodyRoot:\n" + bodyRoot.toString());

            Document insertDoc = saxBuilder.build(new StringReader(insert));
            System.out.println("insertDoc:\n" + insertDoc.toString());
            Element insertRoot = insertDoc.getRootElement();
            System.out.println("insertRoot:\n" + insertRoot.toString());

            insertRoot.detach();
            bodyRoot.addContent(insertRoot);
            System.out.println("rootText:\n" + bodyDoc);

            return new XMLOutputter().outputString(bodyDoc);

        } catch (JDOMException e) {
            // handle JDOMException
        } catch (IOException e) {
            // handle IOException
        }

        return null;
    }
}
