# Loaderlibjs::Rails

A javascript library for managing all your front end code modules and making sure
they run only when you want.

## Installation

Add this line to your application's Gemfile:

    gem 'loaderlibjs-rails'

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install loaderlibjs-rails

In your application.js include:

    //= require loaderlib

Or download the javascript directly: [loaderlib.js](https://raw.github.com/tal/loaderlibjs-rails/master/vendor/assets/javascripts/loaderlib.js)

```bash
wget https://raw.github.com/tal/loaderlibjs-rails/master/vendor/assets/javascripts/loaderlib.js
```

## Usage

Loaderlib creates your root namespace where all of your logic is held. At the begining of your app you instantiate a new loaderlib:

```javascript
window.NS = new Loaderlib();
```

After that you can start creating your modules.

Say in the file users/index.js

```javascript
NS.has('users.index', function(index) {
  index.init = function() {
    $('.users .user .view').click(function() {
      // Show modal;
    });
  };
});
```

The init function will only be called when the `NS.init` function is called with
arguments associated with this module.

As an example, this invocation of init:

```javascript
NS.init({
  module: 'foo',
  actions: ['bar','baz']
});
```

Will call the following functions:

* `NS.foo.bar()`
* `NS.foo.baz()`
* `NS.foo.bar.init()`
* `NS.foo.baz.init()`
* `NS.bar.init()`
* `NS.bar.foo()`
* `NS.baz.init()`
* `NS.baz.foo()`

You can enable logging to see what methods are being called by defining the log method.

```javascript
NS.log = function(str) {
  console.log("NSLog: "+str);
}
```

Ther's also a helper method for initializing the modules based on your html structure.

Assuming the following `<body>` tag:

```html
<body class="bar baz" id="foo">
```

The function `NS.initFromBody()` would generate the same init listed earlier.

A good practice is to define your id and classes based on your controller/action.

```html
<body class="<%= action_name %> <%= @body_classes.join(' ') %>" id="<%= controller_name %>">
```

By adding extra body classes you can trigger certain specific module actions as
well as styling your content with css tags.


## Example

setup.js - included in `<head>`

```javascript
//= require loaderlib

window.NS = new LoaderLib(function() {
  this.base = document.location.protocol+'//'+document.location.hostname;
  var csrf = $('meta[name="csrf-token"]').attr('content');
  this.csrf = csrf;
  $.ajaxSetup({
    beforeSend: function(xhr) {
      xhr.setRequestHeader('X-CSRF-Token', csrf);
    }
  });
});
```

application.js - included near bottom of `<body>`

```javascript
//= require_tree ./pages

NS.initFromBody();
```

Where the pages directory holds all of your app logic.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
