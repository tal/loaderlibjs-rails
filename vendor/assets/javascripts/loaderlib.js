(function(window,funcName) {
  /**
  * Creates a new loader library, returns itself.
  *
  *   window.NS = new LoaderLib();
  *
  * @class LoaderLib
  * @param {Function} a callback which recieves the new instance of the class
  * @constructor
  */
  function LoaderLib(cb) {
    this._modules = [];

    this.vars = {};

    if (typeof cb === funcName) cb.call(this,this);
  }

  window.LoaderLib = LoaderLib;

  LoaderLib.prototype._register = function(module) {
    this._modules.push(module);
  }

  /**
  * Way of defining the new module on the library
  *
  *   var module = NS.has('my.module');
  *   NS.my.module === module; // => true
  *
  * Or preferably
  *
  *   NS.has('my.module',function(module) {
  *     module.init = function() {};
  *   });
  *
  * @param {String} Namespace to define new module
  * @param {Function} closure for using the new module.
  * @returns {Object}
  * @method
  */
  LoaderLib.prototype.has = function(objname, cb) {
    var objs, target;
    objs = objname.split('.');

    target = this;

    for (var i = 0; i < objs.length; i+=1) {
      if (!target[objs[i]]) {
        target[objs[i]] = {};
        this._register(target[objs[i]]);
      }

      target = target[objs[i]];
    };

    if (typeof cb === funcName) cb.call(target,target,this);

    return target;
  };

  /**
  * Method for either registering a function to be fired when the
  * ready event is fired, or when no function is passed it will fire
  * the ready event.
  *
  * See readme for how the ready function can be used in conjunction
  * with modules defined in #has.
  *
  * @param {Function} add a function to be fired when the ready
  *         event is fired.
  * @method
  */
  LoaderLib.prototype.ready = function(cb) {
    if (cb) {
      this._register({ready: cb});
    } else {
      var module;
      for (var i = 0; i < this._modules.length; i++) {
        module = this._modules[i];
        if (typeof module.ready === funcName) {
          module.ready();
        }
      };
    }
  };

  function initName(obj,name) {
    obj || (obj = {});
    if (typeof obj[name] === funcName) {
      obj[name]();
    } else if (obj[name] && typeof obj[name].init === funcName) {
      obj[name].init();
    }
  }

  /**
  * Initializes modules given certain parameters.
  *
  * Given the options: opts = {module: 'foo', actions: ['bar','baz']}
  * The call NS.init(opts) will call the following functions:
  *
  * - NS.foo.bar()
  * - NS.foo.baz()
  * - NS.foo.bar.init()
  * - NS.foo.baz.init()
  * - NS.bar.init()
  * - NS.bar.foo()
  * - NS.baz.init()
  * - NS.baz.foo()
  *
  * @method
  */
  LoaderLib.prototype.init = function initLoader(opts) {
    var moduleName, module, actionName, action, actions, subActionName, i, j;

    moduleName = opts.module;
    actions = opts.actions;

    module = this[moduleName];

    if (module && typeof module.init === funcName) module.init();

    for (i = 0; i < actions.length; i++) {
      actionName = actions[i];

      if (module) {
        moduleAction = module[actionName];

        if (moduleAction && typeof moduleAction.init === funcName) {
          this.log("calling: NS."+moduleName+'.'+actionName+'.init()');
          moduleAction.init()
        }
        if (typeof module[actionName] === funcName) {
          this.log("calling: NS."+moduleName+'.'+actionName+'()');
          module[actionName]();
        }
      }

      actionRoot = this[actionName];
      if (actionRoot) {
        if (typeof actionRoot.init === funcName) {
          this.log("calling: NS."+actionName+'.init()');
          actionRoot.init();
        }
        if (typeof actionRoot[moduleName] === funcName) {
          this.log("calling: NS."+actionName+'.'+moduleName+'()');
          actionRoot[moduleName]();
        }
      }
    }
  };

  LoaderLib.prototype.log = function() {};

  /**
  * Calls init, but builds the options from the class and id tag on the body element.
  *
  * @method
  */
  LoaderLib.prototype.initFromBody = function initFromBody() {
    this.init({
      module: document.body.id || 'default',
      actions: document.body.className.trim().split(' ')
    });
  };

  LoaderLib.prototype.initFromObj = function initFromObj(obj) {
    var action;
    for (var name in obj) {
      action = this[name];

      if (action && typeof action.init === funcName) {
        action.init(obj[name]);
      }
    }
  };
}).call(this, window,'function');
