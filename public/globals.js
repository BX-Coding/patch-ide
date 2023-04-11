(function(){ //make __dirname, __filename work in the browser
    if(window && !window['__dirname']){
    
        var stackTrace = function () {
            var lines = (new Error()).stack.split("\n");
            // 0 = message, 1 = stackTrace
            lines.shift(); lines.shift();
            var result = lines.map(function(line){
                if(line.indexOf('(native)') != -1){
                    return {
                        file : '[browser core]',
                        directory : '-',
                        domain : line.replace(' at ', '').replace('(native)').trim()
                    }
                }
                var parts = (RegExp(' (?:at(?: .*?)? |\\\()(.*):([0-9]+):([0-9]+)', 'g').exec(line));
                //console.log(parts, line);
                var sep = parts[1].lastIndexOf('/');
                var directory = parts[1].substring(0, sep);
                var urlTest = (/([a-zA-Z]+:\/\/.*?)\/(.*)/g).exec(directory);
                var domain;
                //console.log('parts', parts)
                if(urlTest){
                    domain = urlTest[1];
                    directory = urlTest[2];
                }
                return {
                    file : parts[1].substring(sep+1),
                    directory : directory,
                    line : parts[1],
                    column : parts[2],
                    domain : domain
                }
            })
            return result;
        }
 
        Object.defineProperty(window, "__filename", {
            __proto__: null, // no inherited properties
            get : function(){
                var stack = stackTrace();
                stack.shift();
                return stack[0].file;
            }
        });
        
        Object.defineProperty(window, "__dirname", {
            __proto__: null, // no inherited properties
            get : function(){
                var stack = stackTrace();
                stack.shift();
                return stack[0].directory;
            }
        });
        
        Object.defineProperty(window, "__stacktrace", {
            __proto__: null, // no inherited properties
            get : function(){
                var stack = stackTrace();
                stack.shift();
                return stack;
            }
        });
    }
})();