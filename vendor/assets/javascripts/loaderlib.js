(function(window,funcName) {
  function LoaderLib(cb) {
    this._modules = [];

    this.vars = {};

    if (typeof cb === funcName) cb.call(this,this);
  }

  window.LoaderLib = LoaderLib;

  LoaderLib.prototype._register = function(module) {
    this._modules.push(module);
  }

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

  LoaderLib.prototype.ready = function(cb) {
    if (cb) {
      this._register({ready: cb}); return;
    }

    var module;
    for (var i = 0; i < this._modules.length; i++) {
      module = this._modules[i];
      if (typeof module.ready === funcName) {
        module.ready();
      }
    };
  };

  function initName(obj,name) {
    obj || (obj = {});
    if (typeof obj[name] === funcName) {
      obj[name]();
    } else if (obj[name] && typeof obj[name].init === funcName) {
      obj[name].init();
    }
  }

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

        if (moduleAction && typeof moduleAction.init === funcName) moduleAction.init();
        if (typeof module[actionName] === funcName) module[actionName]();
      }

      actionRoot = this[actionName];
      if (actionRoot) {
        if (typeof actionRoot.init === funcName) actionRoot.init();
        if (typeof actionRoot[moduleName] === funcName) actionRoot[moduleName]();
      }
    }
  };

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

  LoaderLib.prototype.setVars = function setVars(vars) {

  }
}).call(this, window,'function');
