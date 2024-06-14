export function _GSPS2PDF(dataStruct, responseCallback, progressCallback, statusUpdateCallback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", dataStruct.psDataURL);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
        window.URL.revokeObjectURL(dataStruct.psDataURL);
        var Module = {
            preRun: [function () {
                const FS = window.FS;
                FS.writeFile('input.pdf', new Uint8Array(xhr.response));
            }],
            postRun: [function () {
                const FS = window.FS;
                var uarray = FS.readFile('output.pdf', { encoding: 'binary' });
                var blob = new Blob([uarray], { type: "application/octet-stream" });
                var pdfDataURL = window.URL.createObjectURL(blob);
                responseCallback({ pdfDataURL: pdfDataURL, url: dataStruct.url });
            }],
            arguments: ['-sDEVICE=pdfwrite', '-dCompatibilityLevel=1.4', '-dPDFSETTINGS=/ebook', '-dNOPAUSE', '-dQUIET', '-dBATCH', '-sOutputFile=output.pdf', 'input.pdf'],
            print: function (text) {
                statusUpdateCallback(text);
            },
            printErr: function (text) {
                statusUpdateCallback('Error: ' + text);
                console.error(text);
            },
            setStatus: function (text) {
                if (!Module.setStatus.last) Module.setStatus.last = { time: Date.now(), text: '' };
                if (text === Module.setStatus.last.text) return;
                var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
                var now = Date.now();
                if (m && now - Module.setStatus.last.time < 30) return;
                Module.setStatus.last.time = now;
                Module.setStatus.last.text = text;
                if (m) {
                    text = m[1];
                    progressCallback(false, parseInt(m[2]) * 100, parseInt(m[4]) * 100);
                } else {
                    progressCallback(true, 0, 0);
                }
                statusUpdateCallback(text);
            },
            totalDependencies: 0
        };
        Module.setStatus('Loading Ghostscript...');
        window.Module = Module;
        loadScript('../public/gs.js', null);
    };
    xhr.send();
}

function loadScript(url, onLoadCallback) {
    const script = document.createElement('script');
    script.src = url;
    script.onload = onLoadCallback;
    document.body.appendChild(script);
}
