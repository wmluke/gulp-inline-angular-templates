# [gulp](http://gulpjs.com)-inline-angular-templates [![Build Status](https://travis-ci.org/wmluke/gulp-inline-angular-templates.svg?branch=master)](https://travis-ci.org/wmluke/gulp-inline-angular-templates)

> Inline angular templates into an HTML file

## Install

```bash
$ npm install --save-dev gulp-inline-angular-templates
```

## Usage

```js
var gulp = require('gulp');
var inlineAngularTemplates = require('gulp-inline-angular-templates');

gulp.task('default', function () {
    return gulp.src('dist/index.html')
        .pipe(inlineAngularTemplates({
             base: 'dist/templates', // (Optional) ID of the <script> tag will be relative to this folder. Default is project dir.
             prefix: '/',            // (Optional) Prefix path to the ID. Default is empty string.
             selector: 'body',       // (Optional) CSS selector of the element to use to insert the templates. Default is `body`.
             method: 'prepend'       // (Optional) DOM insert method. Default is `prepend`.
             unescape: {             // (Optional) List of escaped characters to unescape
                 '&lt;': '<',
                 '&gt;': '>',
                 '&apos;': '\'',
                 '&amp;': '&'
             }
         }))
        .pipe(gulp.dest('dist'));
});
```

This will prepend the template files into the body of `dist/index.html` something like...

```html
<html>
<body>
<!-- Begin Templates -->
<script type="text/ng-template" id="/views/template1.html">
<div>
    <h1>Template 1</h1>
</div>
</script>

<script type="text/ng-template" id="/views/template2.html">
<div>
    <h1>Template 2</h1>
</div>
</script>
<!-- End Templates -->

<div ng-view></div>
</body>
</html>
```

## API

### inlineAngularTemplates(options)

#### Options

##### options.base
Type: `String`
Default value: Grunt working folder

ID of the `<script>` tag will be relative to this folder

##### options.prefix
Type: `String`
Default value: Empty string

Append this prefix to the template ID.

##### options.selector
Type: `String`
Default value: 'body'

The CSS selector of the element to use to insert the templates.

##### options.method
Type: `String`
Values: append | prepend | replaceWith | after | before
Default value: 'prepend'

The DOM method used to insert the templates.

##### options.unescape
Type: `Object`
Default value: '{}'

List of escaped characters to unescape.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).



## License

MIT © [wmluke](https://github.com/wmluke)
