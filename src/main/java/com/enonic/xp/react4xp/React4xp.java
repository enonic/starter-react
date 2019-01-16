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

        // https://www.npmjs.com/package/jvm-npm
        String require = "/**\n" +
                " *  Copyright 2014-2016 Red Hat, Inc.\n" +
                " *\n" +
                " *  Licensed under the Apache License, Version 2.0 (the \"License\")\n" +
                " *  you may not use this file except in compliance with the License.\n" +
                " *  You may obtain a copy of the License at\n" +
                " *\n" +
                " *  http://www.apache.org/licenses/LICENSE-2.0\n" +
                " *\n" +
                " *  Unless required by applicable law or agreed to in writing, software\n" +
                " *  distributed under the License is distributed on an \"AS IS\" BASIS,\n" +
                " *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n" +
                " *  See the License for the specific language governing permissions and\n" +
                " *  limitations under the License.\n" +
                " */\n" +
                "// Since we intend to use the Function constructor.\n" +
                "/* jshint evil: true */\n" +
                "\n" +
                "module = (typeof module === 'undefined') ? {} : module;\n" +
                "\n" +
                "(function () {\n" +
                "  var System = java.lang.System;\n" +
                "  var Scanner = java.util.Scanner;\n" +
                "  var File = java.io.File;\n" +
                "\n" +
                "  NativeRequire = (typeof NativeRequire === 'undefined') ? {} : NativeRequire;\n" +
                "  if (typeof require === 'function' && !NativeRequire.require) {\n" +
                "    NativeRequire.require = require;\n" +
                "  }\n" +
                "\n" +
                "  function Module (id, parent, core) {\n" +
                "    this.id = id;\n" +
                "    this.core = core;\n" +
                "    this.parent = parent;\n" +
                "    this.children = [];\n" +
                "    this.filename = id;\n" +
                "    this.loaded = false;\n" +
                "\n" +
                "    Object.defineProperty(this, 'exports', {\n" +
                "      get: function () {\n" +
                "        return this._exports;\n" +
                "      }.bind(this),\n" +
                "      set: function (val) {\n" +
                "        Require.cache[this.filename] = val;\n" +
                "        this._exports = val;\n" +
                "      }.bind(this)\n" +
                "    });\n" +
                "    this.exports = {};\n" +
                "\n" +
                "    if (parent && parent.children) parent.children.push(this);\n" +
                "\n" +
                "    this.require = function (id) {\n" +
                "      return Require(id, this);\n" +
                "    }.bind(this);\n" +
                "  }\n" +
                "\n" +
                "  Module._load = function _load (file, parent, core, main) {\n" +
                "    var module = new Module(file, parent, core);\n" +
                "    var body = readFile(module.filename, module.core);\n" +
                "    var dir = new File(module.filename).getParent();\n" +
                "    var args = ['exports', 'module', 'require', '__filename', '__dirname'];\n" +
                "    var func = new Function(args, body);\n" +
                "    func.apply(module,\n" +
                "      [module.exports, module, module.require, module.filename, dir]);\n" +
                "    module.loaded = true;\n" +
                "    module.main = main;\n" +
                "    return module.exports;\n" +
                "  };\n" +
                "\n" +
                "  Module.runMain = function runMain (main) {\n" +
                "    var file = Require.resolve(main);\n" +
                "    Module._load(file, undefined, false, true);\n" +
                "  };\n" +
                "\n" +
                "  function Require (id, parent) {\n" +
                "    var core;\n" +
                "    var native_;\n" +
                "    var file = Require.resolve(id, parent);\n" +
                "\n" +
                "    if (!file) {\n" +
                "      if (typeof NativeRequire.require === 'function') {\n" +
                "        if (Require.debug) {\n" +
                "          System.out.println(['Cannot resolve', id, 'defaulting to native'].join(' '));\n" +
                "        }\n" +
                "        native_ = NativeRequire.require(id);\n" +
                "        if (native_) return native_;\n" +
                "      }\n" +
                "      System.err.println('Cannot find module ' + id);\n" +
                "      throw new ModuleError('Cannot find module ' + id, 'MODULE_NOT_FOUND');\n" +
                "    }\n" +
                "\n" +
                "    if (file.core) {\n" +
                "      file = file.path;\n" +
                "      core = true;\n" +
                "    }\n" +
                "    try {\n" +
                "      if (Require.cache[file]) {\n" +
                "        return Require.cache[file];\n" +
                "      } else if (file.endsWith('.js')) {\n" +
                "        return Module._load(file, parent, core);\n" +
                "      } else if (file.endsWith('.json')) {\n" +
                "        return loadJSON(file);\n" +
                "      }\n" +
                "    } catch (ex) {\n" +
                "      if (ex instanceof java.lang.Exception) {\n" +
                "        throw new ModuleError('Cannot load module ' + id, 'LOAD_ERROR', ex);\n" +
                "      } else {\n" +
                "        System.out.println('Cannot load module ' + id + ' LOAD_ERROR');\n" +
                "        throw ex;\n" +
                "      }\n" +
                "    }\n" +
                "  }\n" +
                "\n" +
                "  Require.resolve = function (id, parent) {\n" +
                "    var roots = findRoots(parent);\n" +
                "    for (var i = 0; i < roots.length; ++i) {\n" +
                "      var root = roots[i];\n" +
                "      var result = resolveCoreModule(id, root) ||\n" +
                "      resolveAsFile(id, root, '.js') ||\n" +
                "      resolveAsFile(id, root, '.json') ||\n" +
                "      resolveAsDirectory(id, root) ||\n" +
                "      resolveAsNodeModule(id, root);\n" +
                "      if (result) {\n" +
                "        return result;\n" +
                "      }\n" +
                "    }\n" +
                "    return false;\n" +
                "  };\n" +
                "\n" +
                "  Require.root = System.getProperty('user.dir');\n" +
                "  Require.NODE_PATH = undefined;\n" +
                "\n" +
                "  function findRoots (parent) {\n" +
                "    var r = [];\n" +
                "    r.push(findRoot(parent));\n" +
                "    return r.concat(Require.paths());\n" +
                "  }\n" +
                "\n" +
                "  function parsePaths (paths) {\n" +
                "    if (!paths) {\n" +
                "      return [];\n" +
                "    }\n" +
                "    if (paths === '') {\n" +
                "      return [];\n" +
                "    }\n" +
                "    var osName = java.lang.System.getProperty('os.name').toLowerCase();\n" +
                "    var separator;\n" +
                "\n" +
                "    if (osName.indexOf('win') >= 0) {\n" +
                "      separator = ';';\n" +
                "    } else {\n" +
                "      separator = ':';\n" +
                "    }\n" +
                "\n" +
                "    return paths.split(separator);\n" +
                "  }\n" +
                "\n" +
                "  Require.paths = function () {\n" +
                "    var r = [];\n" +
                "    r.push(java.lang.System.getProperty('user.home') + '/.node_modules');\n" +
                "    r.push(java.lang.System.getProperty('user.home') + '/.node_libraries');\n" +
                "\n" +
                "    if (Require.NODE_PATH) {\n" +
                "      r = r.concat(parsePaths(Require.NODE_PATH));\n" +
                "    } else {\n" +
                "      var NODE_PATH = java.lang.System.getenv().NODE_PATH;\n" +
                "      if (NODE_PATH) {\n" +
                "        r = r.concat(parsePaths(NODE_PATH));\n" +
                "      }\n" +
                "    }\n" +
                "    // r.push( $PREFIX + \"/node/library\" )\n" +
                "    return r;\n" +
                "  };\n" +
                "\n" +
                "  function findRoot (parent) {\n" +
                "    if (!parent || !parent.id) { return Require.root; }\n" +
                "    var pathParts = parent.id.split(/[\\/|\\\\,]+/g);\n" +
                "    pathParts.pop();\n" +
                "    return pathParts.join('/');\n" +
                "  }\n" +
                "\n" +
                "  Require.debug = true;\n" +
                "  Require.cache = {};\n" +
                "  Require.extensions = {};\n" +
                "  require = Require;\n" +
                "\n" +
                "  module.exports = Module;\n" +
                "\n" +
                "  function loadJSON (file) {\n" +
                "    var json = JSON.parse(readFile(file));\n" +
                "    Require.cache[file] = json;\n" +
                "    return json;\n" +
                "  }\n" +
                "\n" +
                "  function resolveAsNodeModule (id, root) {\n" +
                "    var base = [root, 'node_modules'].join('/');\n" +
                "    return resolveAsFile(id, base) ||\n" +
                "      resolveAsDirectory(id, base) ||\n" +
                "      (root ? resolveAsNodeModule(id, new File(root).getParent()) : false);\n" +
                "  }\n" +
                "\n" +
                "  function resolveAsDirectory (id, root) {\n" +
                "    var base = [root, id].join('/');\n" +
                "    var file = new File([base, 'package.json'].join('/'));\n" +
                "    if (file.exists()) {\n" +
                "      try {\n" +
                "        var body = readFile(file.getCanonicalPath());\n" +
                "        var package_ = JSON.parse(body);\n" +
                "        if (package_.main) {\n" +
                "          return (resolveAsFile(package_.main, base) ||\n" +
                "            resolveAsDirectory(package_.main, base));\n" +
                "        }\n" +
                "        // if no package.main exists, look for index.js\n" +
                "        return resolveAsFile('index.js', base);\n" +
                "      } catch (ex) {\n" +
                "        throw new ModuleError('Cannot load JSON file', 'PARSE_ERROR', ex);\n" +
                "      }\n" +
                "    }\n" +
                "    return resolveAsFile('index.js', base);\n" +
                "  }\n" +
                "\n" +
                "  function resolveAsFile (id, root, ext) {\n" +
                "    var file;\n" +
                "    if (id.length > 0 && id[0] === '/') {\n" +
                "      file = new File(normalizeName(id, ext || '.js'));\n" +
                "      if (!file.exists()) {\n" +
                "        return resolveAsDirectory(id);\n" +
                "      }\n" +
                "    } else {\n" +
                "      file = new File([root, normalizeName(id, ext || '.js')].join('/'));\n" +
                "    }\n" +
                "    if (file.exists()) {\n" +
                "      return file.getCanonicalPath();\n" +
                "    }\n" +
                "  }\n" +
                "\n" +
                "  function resolveCoreModule (id, root) {\n" +
                "    var name = normalizeName(id);\n" +
                "    var classloader = java.lang.Thread.currentThread().getContextClassLoader();\n" +
                "    if (classloader.getResource(name)) {\n" +
                "      return { path: name, core: true };\n" +
                "    }\n" +
                "  }\n" +
                "\n" +
                "  function normalizeName (fileName, ext) {\n" +
                "    var extension = ext || '.js';\n" +
                "    if (fileName.endsWith(extension)) {\n" +
                "      return fileName;\n" +
                "    }\n" +
                "    return fileName + extension;\n" +
                "  }\n" +
                "\n" +
                "  function readFile (filename, core) {\n" +
                "    var input;\n" +
                "    try {\n" +
                "      if (core) {\n" +
                "        var classloader = java.lang.Thread.currentThread().getContextClassLoader();\n" +
                "        input = classloader.getResourceAsStream(filename);\n" +
                "      } else {\n" +
                "        input = new File(filename);\n" +
                "      }\n" +
                "      // TODO: I think this is not very efficient\n" +
                "      return new Scanner(input).useDelimiter('\\\\A').next();\n" +
                "    } catch (e) {\n" +
                "      throw new ModuleError('Cannot read file [' + input + ']: ', 'IO_ERROR', e);\n" +
                "    }\n" +
                "  }\n" +
                "\n" +
                "  function ModuleError (message, code, cause) {\n" +
                "    this.code = code || 'UNDEFINED';\n" +
                "    this.message = message || 'Error loading module';\n" +
                "    this.cause = cause;\n" +
                "  }\n" +
                "\n" +
                "  // Helper function until ECMAScript 6 is complete\n" +
                "  if (typeof String.prototype.endsWith !== 'function') {\n" +
                "    String.prototype.endsWith = function (suffix) {\n" +
                "      if (!suffix) return false;\n" +
                "      return this.indexOf(suffix, this.length - suffix.length) !== -1;\n" +
                "    };\n" +
                "  }\n" +
                "\n" +
                "  ModuleError.prototype = new Error();\n" +
                "  ModuleError.prototype.constructor = ModuleError;\n" +
                "}());\n";

        try {
            engine.eval(nashornPolyfill);
            engine.eval(require);

            engine.eval("k=14;");


            engine.eval("console.log('Howdy world!');");
            engine.eval("console.log(k);");
            engine.eval("console.log(typeof require);");

        } catch (ScriptException e) {
            e.printStackTrace();
        }
    }
}
