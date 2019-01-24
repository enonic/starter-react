package com.enonic.xp.react4xp;

import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.filter.Filters;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.XMLOutputter;
import org.jdom2.xpath.XPathExpression;
import org.jdom2.xpath.XPathFactory;

import javax.xml.xpath.XPathException;
import java.io.IOException;
import java.io.StringReader;
import java.util.List;


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

    public String insertAtEndOfRoot(String body, String payload) {
        //System.out.println("\n\nBODY:\n" + body);
        //System.out.println("PAYLOAD:\n" + payload);
        try {
            Document bodyDoc = saxBuilder.build(new StringReader(body));
            //System.out.println("bodyDoc:\n" + bodyDoc.toString());
            Element bodyRoot = bodyDoc.getRootElement();
            //System.out.println("bodyRoot:\n" + bodyRoot.toString());

            Document insertDoc = saxBuilder.build(new StringReader(payload));
            //System.out.println("insertDoc:\n" + insertDoc.toString());
            Element insertRoot = insertDoc.getRootElement();
            //System.out.println("insertRoot:\n" + insertRoot.toString());

            insertRoot.detach();
            bodyRoot.addContent(insertRoot);
            //System.out.println("bodyRoot:\n" + bodyRoot);

            //System.out.println("Output:\n" + outputter.outputString(bodyDoc) + "\n\n");
            return outputter.outputString(bodyDoc);

        } catch (JDOMException | IOException e) {
            e.printStackTrace();
            System.err.println("\n\n" +
                    "ERROR: [ " + e.getClass().getName() + " ] ...when trying to insert HTML" +
                    (payload.length() < 1000 ?
                            "...\n\n" + payload + "\n\n..." :
                            " ") +
                    "into end of body" +
                    (body.length() < 1000 ?
                            ":\n\n" + body + "\n\n" :
                            "") +
                    "\nReturning the submitted body unchanged.");
        }
        return body;
    }


    public String insertInsideContainer(String body, String payload, String id) {
        //System.out.println("\n\nBODY:\n" + body);
        //System.out.println("PAYLOAD:\n" + payload);
        //System.out.println("ID:\n" + id);
        try {
            Document bodyDoc = saxBuilder.build(new StringReader(body));
            //System.out.println("bodyDoc:\n" + bodyDoc.toString());

            XPathFactory xFactory = XPathFactory.instance();
            String expression = "//*[@id='" + id + "']";
            System.out.println("Expression: " + expression);
            XPathExpression<Element> expr = xFactory.compile(expression, Filters.element());

            List<Element> links = expr.evaluate(bodyDoc);
            if (links == null || links.size() < 1) {
                throw new XPathException("ID '" + id + "' not found.");
            }

            System.out.println("Hits: " + links.size());

            /*for (Element linkElement : links) {
                System.out.println(linkElement);
            }//*/
            //System.out.println("bodyRoot:\n" + bodyRoot.toString());

            Document payloadDoc = saxBuilder.build(new StringReader(payload));
            //System.out.println("insertDoc:\n" + insertDoc.toString());
            Element payloadRoot = payloadDoc.getRootElement();
            //System.out.println("insertRoot:\n" + insertRoot.toString());


            // Whether or not more than one element with that id was found, insert the first one.
            payloadRoot.detach();
            links.get(0).addContent(payloadRoot);

            //System.out.println("bodyRoot:\n" + bodyRoot);
            //System.out.println("Output:\n" + outputter.outputString(bodyDoc) + "\n\n");

            return outputter.outputString(bodyDoc);

        } catch (JDOMException | IOException | XPathException e) {
            e.printStackTrace();
            System.err.print("\n\n" +
                    "ERROR: [ " + e.getClass().getName() + " ] ...when trying to insert HTML" +
                    (payload.length() < 1000 ?
                            "...\n\n" + payload + "\n\n..." :
                            " ") +
                    "at element with ID '" + id + "' into body" +
                    (body.length() < 1000 ?
                            ":\n\n" + body + "\n\n" :
                            "") +
                    "\nReturning the submitted body unchanged.");
        }
        return body;
    }
}
