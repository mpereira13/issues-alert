async function processError(e, fn) {

    var t = e.stack.split('at');
    var file = t[1].split('/');
    function processFile(inputFile, line) {

        return new Promise(function (resolve, reject) {
            var fs = require('fs'),
                readline = require('readline'),
                instream = fs.createReadStream(inputFile),
                outstream = new (require('stream'))(),
                rl = readline.createInterface(instream, outstream),
                _line = 1,
                txtLine = '';

            rl.on('line', function (lines) {
                if (line === _line || _line < line && _line >= line - 5 || _line > line && _line <= line + 5) {
                    txtLine += lines + '<br/>';
                }
                _line++;
            });

            rl.on('close', function (line) {
                resolve(txtLine);
            });

            rl.on('error', function (err) {
                resolve();
            });
        });
    }

    var checkFile = '';
    for (var i = 1; i < file.length; i++) {
        checkFile += '/' + file[i]
    }

    var nr = checkFile.substring(checkFile.indexOf(':') + 1, checkFile.length);
    nr = nr.substring(0, nr.indexOf(':'));
    checkFile = checkFile.substring(0, checkFile.indexOf(':'));

    processFile(checkFile, parseInt(nr)).then(function (data) {
        (!data.length) ? data = `Can't open the file!` : '';
        fn(data, checkFile);
    });
}

module.exports = processError;