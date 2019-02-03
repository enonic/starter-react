package com.enonic.xp.react4xp.ssr;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

/** Reads and parses file names from webpack-generated JSON files that list up contenthashed bundle chunk names. */
public class ChunkDependencyParser {
    private static LinkedList<String> entries = null;

    private void addDependenciesFromFile(String chunkFile, LinkedList<String> accumulator) throws IOException {
        String json = ResourceHandler.readResource(chunkFile);
        JSONObject fileContentData = new JSONObject(json);

        Iterator<String> keys = fileContentData.keys();
        while(keys.hasNext()) {
            String chunkName = keys.next();

            // We're only looking for dependencies here, not entry files (components and such).
            if (!entries.contains(chunkName)) {
                JSONObject chunk = (JSONObject)fileContentData.get(chunkName);
                String fileName = (String)chunk.get("js");
                accumulator.add(fileName);
            }
        }
    }

    private void setEntries(String entryFile) throws IOException {
        entries = new LinkedList<>();

        String json = ResourceHandler.readResource(entryFile);
        JSONArray fileContentData = new JSONArray(json);
        Iterator it = fileContentData.iterator();
        while (it.hasNext()) {
            entries.add((String)it.next());
        }
    }

    public LinkedList<String> getScriptDependencies(List<String> chunkFiles, String entryFile) throws IOException {
        if (entries == null) {
            setEntries(entryFile);
        }

        LinkedList<String> dependencyScripts = new LinkedList<>();
        for (String chunkFile : chunkFiles) {
            addDependenciesFromFile(chunkFile, dependencyScripts);
        }

        return dependencyScripts;
    }
}
