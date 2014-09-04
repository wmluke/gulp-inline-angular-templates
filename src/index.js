'use strict';
var gutil = require('gulp-util');
var cheerio = require('cheerio');
var path = require('path');
var _ = require('lodash');
var es = require('event-stream');
var fs = require('vinyl-fs');

module.exports = function (target, options) {
    if (!target) throw new PluginError('gulp-inline-angular-templates', 'Missing target option for gulp-inline-angular-templates');
    if (options && options.base) {
        options.base = path.join(process.cwd(), options.base)
    }
    var opts = _.extend({
        base: process.cwd(),
        prefix: '',
        selector: 'body',
        method: 'prepend',
        unescape: {}
    }, options || {});

    var buffer = [];
    var firstFile = null;

    var unescapeCharacters = function (rawHtml) {
        var matchKeys = Object.keys(opts.unescape);
        if (matchKeys.length === 0) {
            return rawHtml;
        }
        var pattern = new RegExp('(' + matchKeys.join('|') + ')', 'g');
        return rawHtml.replace(pattern, function (match) {
            return opts.unescape[match];
        });
    };

    function transform(file) {
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-inline-angular-templates', 'Streaming not supported'));
            return cb();
        }


        var name = path.relative(opts.base, file.path);
        var contents = file.contents.toString('utf8');

        var templateUrl = path.join(opts.prefix, name).replace(/\\/g, '/');
        if (!firstFile) firstFile = file;

        try {
            buffer.push(new Buffer('<script type="text/ng-template" id="' + templateUrl + '">\n' + contents + '\n</script>\n'));
        } catch (err) {
            this.emit('error', new gutil.PluginError('gulp-inline-angular-templates', err));
        }
    }

    function endStream() {
        if (buffer.length === 0) {
            return this.emit('end');
        }

        var self = this;
        var joinedContents = Buffer.concat(buffer).toString('utf8');
        fs.src(path.join(process.cwd(), target))
            .pipe(es.through(function (file) {
                var $ = cheerio.load(file.contents.toString('utf8'), {
                    ignoreWhitespace: false,
                    xmlMode: false,
                    lowerCaseTags: false
                });
                var $elem = $(opts.selector);
                var method = $elem[opts.method] || $elem.prepend;
                method.call($elem, '\n\n<!-- Begin Templates -->\n' + joinedContents + '\n<!-- End Templates -->\n\n');
                var html = unescapeCharacters($.html());

                file.contents = new Buffer(html);
                self.emit('data', file);
                self.emit('end');
            }));
    }

    return es.through(transform, endStream);
};
