// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name default.js
// @formatting pretty_print
// @warning_level QUIET
// @js_externs $.fn.xml2json
// @externs_url http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js
// ==/ClosureCompiler==

(function($) {
    $.fn.xml2json = function(options) {
        var settings = $.extend({
            root : 'root'
        }, options);
        
        function parseXML(node) {
            var obj = {};
            
            if (node.children().length)
            {
                var array = {};
                node.children().each(
                        function(i, child) {
                            if (!(child.nodeName in array))
                            {
                                array[child.nodeName] = node
                                        .children(child.nodeName).length;
                            }
                        });
                
                if (Object.size(array) > 1)
                {
                    for (key in array)
                    {
                        if (array[key] > 1)
                        {
                            obj[key] = [];
                            
                            node.children(key).each(function(i, child) {
                                obj[key].push(parseXML($(child)));
                            });
                        }
                        else if (array[key] == 1)
                        {
                            obj[key] = parseXML(node.find(key));
                        }
                    }
                }
                else if (Object.size(array) == 1)
                {
                    obj = [];
                    node.children().each(function(i, child) {
                        obj.push(parseXML($(child)));
                    });
                }
            }
            else
            {
                obj = node.text();
            }
            
            return obj;
        }
        ;
        
        var root = this.find(settings.root);
        var json = parseXML(root);
        
        return json;
    };
})(jQuery);

if (!Object.size)
{
    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj)
        {
            if (obj.hasOwnProperty(key))
                size++;
        }
        return size;
    };
}
