package com.enonic.xp.react4xp;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.util.Arrays;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

public class ChunkDependencyParser {
    private final static String CHUNKFILE_MAINKEY = "chunks";
    private final static String CHUNKFILE_ENTRYKEY = "entry";
    private final static List<String> CHUNK_KEYS = Arrays.asList(
            "headBegin",
            "headEnd",
            "bodyBegin",
            "bodyEnd"
    );


    private void addCommonChunksEntries(JSONObject commonChunks, LinkedList<String> accumulator) {
        for (String chunkKey : CHUNK_KEYS) {
            if (commonChunks.has(chunkKey)) {
                Object chObjs = commonChunks.get(chunkKey);
                if (chObjs != null) {
                    JSONArray chunks = (JSONArray)chObjs;
                    Iterator<Object> chunksIter = chunks.iterator();
                    while (chunksIter.hasNext()) {
                        Object chObj = chunksIter.next();
                        if (chObj != null && chObj instanceof JSONObject) {
                            JSONObject chunk = (JSONObject)chObj;
                            if (chunk.has(CHUNKFILE_ENTRYKEY)) {
                                accumulator.add((String)chunk.get(CHUNKFILE_ENTRYKEY));
                            }
                        }
                    }
                }
            }
        }
    }


    private void addDependenciesFromFile(String chunkFile, LinkedList<String> accumulator) throws IOException {
        String json = ResourceHandler.readResource(chunkFile);
        JSONObject fileContentData = new JSONObject(json);

        Iterator<String> keys = fileContentData.keys();
        while(keys.hasNext()) {
            String key = keys.next();
            if (CHUNKFILE_MAINKEY.equals(key)) {
                Object obj = fileContentData.get(key);
                if (obj != null && obj instanceof JSONObject) {
                    addCommonChunksEntries((JSONObject)obj, accumulator);
                }
            }
        }
    }

    public LinkedList<String> getScriptDependencies(List<String> chunkFiles) throws IOException {

        LinkedList<String> dependencyScripts = new LinkedList<>();
        for (String chunkFile : chunkFiles) {
            addDependenciesFromFile(chunkFile, dependencyScripts);
        }

        //System.out.println("\tScripts:" + dependencyScripts);
        return dependencyScripts;
    }
}
