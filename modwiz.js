// get the rhino script arguments
var __jsfiles = [].concat(arguments);

(function() {

/// ==================================================================
// need to fake the browser stuff here
window = this;
this.setTimeout = function() {};
this.addEventListener = function() {};
this._dummyElement = {
    getElementsByTagName: function() { return []; },
    getElementsById: function() { return []; },
    getElementById: function() { return null; },
    firstChild: null,
    style: {
        cssText: ''
    },
    src: '',
    sheet: {
        cssRules: [{style: {}}]
    },
    addEventListener: window.addEventListener,
    addClass: function() {},
    setAttribute: function() {},
    getAttribute: function() { return window._dummyElement; }
};
this.navigator = {
    userAgent: 'console',
    appVersion: '0',
    language: 'en',
    platform: 'mac',
    plugins: []
};
this.location = {
    href: 'http://localhost',
    search: ''
};
this.document = {
    firstChild: window._dummyElement,
    body: window._dummyElement,
    location: window.location,
    navigator: window.navigator,
    documentElement: window._dummyElement,
    createElement: function() { return window._dummyElement; },
    hasAttribute: function() {},
    getElementsByTagName: window._dummyElement.getElementsByTagName,
    getElementsById: window._dummyElement.getElementsById,
    getElementById: window._dummyElement.getElementById,

    addEventListener: window._dummyElement.addEventListener,
    removeEventListener: function() {}
};
document = this.document;

/// ==================================================================
var modules = {};
dojo = undefined;
YUI = {
    Env: { mods: {} },

    // a copy of the add() function from the yui3.0.0/build/yui/yui.js
    add: function(name, fn, version, details) {
        YUI.Env.mods[name] = {
            name: name, 
            fn: fn,
            version: version,
            details: details || {}
        };
        return this; // chain support
    }
};

// load JS files
for (var f=0, len=__jsfiles.length; f<len; f++) {
    var filename = __jsfiles[f];
    var filemodules = {};
    java.lang.System.err.println('// load: ' + filename);

    // YUI hack -> collecting the file modules separately
    YUI.Env.mods = filemodules;
    // dojo require hack -> no dynamic loading
    if (dojo) { dojo.require = function() {}; }

    load(filename);

    for (var name in filemodules) {
        if (!filemodules.hasOwnProperty(name)) continue; 

        var mod = filemodules[name];
        var m = {
            name: name,
            path: filename,
            version: mod.version,
            requires: mod.details.requires
        }
        modules[name] = m;
    }
}

// required-by dependencies
for (var name in modules) {
    if (!modules.hasOwnProperty(name)) continue;

    var m = modules[name];
    if (!m.requires) continue;

    for(var i=0, len=m.requires.length; i<len; i++) {
        var dependson = modules[m.requires[i]];
        if (!dependson) continue;

        dependson.requiredby = dependson.requiredby || [];
        dependson.requiredby.push(m.name);
    }
}


print('<?xml version="1.0"?>')
print('<TOUCHGRAPH_LB version="1.20">');
print('    <NODESET>');
var edges = '';
var x = 0, y = 0;
for (var name in modules) {
    if (!modules.hasOwnProperty(name)) continue;

    // if (name.substring(0,3) != 'GDC') continue;
    var m = modules[name];

    y += 30;
    m.requires = m.requires || [];
    m.requiredby = m.requiredby || [];

    print('<NODE nodeID="'+name+'"><NODE_LOCATION x="'+x+'" y="'+y+'" visible="true"/><NODE_LABEL label="'+name+'" shape="1" backColor="349D69" textColor="FFFFFF" fontSize="16"/><NODE_URL url="'+m.path+'" urlIsLocal="true" urlIsXML="false"/><NODE_HINT hint="module: '+name+'<br>Requires: '+m.requires+'<br>RequiredBy: '+m.requiredby+'<br>Path: '+m.path+'" width="600" height="400" isHTML="true"/></NODE>');

    if (!m.requires) continue;
    for(var i=0, len=m.requires.length; i<len; i++) {
        var dependson = m.requires[i];
        if (modules[dependson]) {
            edges += '<EDGE fromID="'+name+'" toID="'+dependson+'" type="1" length="100" visible="true" color="0000B0"/>';
        }
    }
}
print('    </NODESET>');
print('    <EDGESET>');
print(edges);
print('    </EDGESET>');
print('    <PARAMETERS>');
print('        <PARAM name="offsetX" value="'+(x-100)+'"/>');
print('        <PARAM name="offsetY" value="'+(y-100)+'"/>');
print('        <PARAM name="rotateSB" value="0"/>');
print('        <PARAM name="zoomSB" value="-7"/>');
print('    </PARAMETERS>');
print('</TOUCHGRAPH_LB>');

})();
