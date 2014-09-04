'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var path = require('path');
var fs = require('graceful-fs');
var inlineAngularTemplates = require('./../src/index.js');

function stripBlankLines(content) {
    return content.replace(/^\s+$/gm, '').replace(/\n\s+/gm, "\n");
}

function readFile(filePath) {
    return new gutil.File({
        base: path.dirname(filePath),
        path: filePath,
        contents: fs.readFileSync(filePath)
    });
}

function assertEqualContents(actual, expected) {
    var act = stripBlankLines(actual.contents.toString('utf8')).trim();
    var exp = stripBlankLines(expected.contents.toString('utf8')).trim();
    assert.equal(act, exp);
}


describe('gulp-inline-angular-templates', function () {

    it('should prepend the templates to the <body> of the target html file', function (done) {
        var stream = inlineAngularTemplates('test/fixtures/index.html');

        stream.on('data', function (file) {
            assert.equal(file.relative, 'index.html');
            assertEqualContents(file, readFile('test/expected/default'));
        });

        stream.on('end', done);

        stream.write(readFile('test/fixtures/templates/template1.html'));
        stream.write(readFile('test/fixtures/templates/template2.html'));

        stream.end();
    });

    it('should append the templates to the #templates element of the target html file', function (done) {
        var stream = inlineAngularTemplates('test/fixtures/index.html', {
            base: 'test/fixtures',
            prefix: '/',
            selector: '#templates',
            method: 'append'
        });

        stream.on('data', function (file) {
            assert.equal(file.relative, 'index.html');
            assertEqualContents(file, readFile('test/expected/custom-append'));
        });

        stream.on('end', done);

        stream.write(readFile('test/fixtures/templates/template1.html'));
        stream.write(readFile('test/fixtures/templates/template2.html'));

        stream.end();
    });

    it('should insert the templates before the #templates element of the target html file', function (done) {
        var stream = inlineAngularTemplates('test/fixtures/index.html', {
            base: 'test/fixtures',
            prefix: '/',
            selector: '#templates',
            method: 'before'
        });

        stream.on('data', function (file) {
            assert.equal(file.relative, 'index.html');
            assertEqualContents(file, readFile('test/expected/custom-before'));
        });

        stream.on('end', done);

        stream.write(readFile('test/fixtures/templates/template1.html'));
        stream.write(readFile('test/fixtures/templates/template2.html'));

        stream.end();
    });

    it('should insert the templates after the #templates element of the target html file', function (done) {
        var stream = inlineAngularTemplates('test/fixtures/index.html', {
            base: 'test/fixtures',
            prefix: '/',
            selector: '#templates',
            method: 'after'
        });

        stream.on('data', function (file) {
            assert.equal(file.relative, 'index.html');
            assertEqualContents(file, readFile('test/expected/custom-after'));
        });

        stream.on('end', done);

        stream.write(readFile('test/fixtures/templates/template1.html'));
        stream.write(readFile('test/fixtures/templates/template2.html'));

        stream.end();
    });

    it('should replace the #templates element with the templates within the target html file', function (done) {
        var stream = inlineAngularTemplates('test/fixtures/index.html', {
            base: 'test/fixtures',
            prefix: '/',
            selector: '#templates',
            method: 'replaceWith'
        });

        stream.on('data', function (file) {
            assert.equal(file.relative, 'index.html');
            assertEqualContents(file, readFile('test/expected/custom-replaceWith'));
        });

        stream.on('end', done);

        stream.write(readFile('test/fixtures/templates/template1.html'));
        stream.write(readFile('test/fixtures/templates/template2.html'));

        stream.end();
    });

    it('should unescape the specified HTML entities', function (done) {
        var stream = inlineAngularTemplates('test/fixtures/index_unescape.html', {
            base: 'test/fixtures',
            prefix: '/',
            selector: '#templates',
            method: 'append',
            unescape: {
                '&lt;': '<',
                '&gt;': '>',
                '&apos;': '\'',
                '&amp;': '&'
            }
        });

        stream.on('data', function (file) {
            assert.equal(file.relative, 'index_unescape.html');
            assertEqualContents(file, readFile('test/expected/custom-unescape'));
        });

        stream.on('end', done);

        stream.write(readFile('test/fixtures/templates/template2.html'));

        stream.end();
    });

    it('should not munge custom html attribute names', function (done) {
        var stream = inlineAngularTemplates('test/fixtures/no-munging-attribute-names.html', {
            base: 'text/fixtures',
            prefix: '/',
            selector: '#templates'
        });

        stream.on('data', function (file) {
            assert.equal(file.relative, 'no-munging-attribute-names.html');
            var actual = file.contents.toString('utf8');
            assert.ok(actual.indexOf('data-ng-app') >= 0, 'attribute names should not be munged');
        });

        stream.on('end', done);

        stream.write(readFile('test/fixtures/templates/template1.html'));
        stream.write(readFile('test/fixtures/templates/template2.html'));

        stream.end();
    });
});


