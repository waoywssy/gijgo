/* global window alert jQuery gj */
/*
 * Gijgo JavaScript Library v1.0.0
 * http://gijgo.com/
 *
 * Copyright 2014, 2016 gijgo.com
 * Released under the MIT license
 */
/** */
if (typeof(gj) === 'undefined') {
    gj = {};
}
if (typeof(gj.tree) === 'undefined') {
    gj.tree = {
        plugins: {}
    };
}

gj.tree.config = {
    base: {

        /** When this setting is enabled the content of the tree will be loaded automatically after the creation of the tree. */
        autoLoad: true,

        /** When this setting is enabled the content of the tree will be loaded automatically after the creation of the tree. */
        selectionType: 'single',

        checkChildren: false,
        dataSource: undefined,
        primaryKey: undefined,
        textField: 'text',
        valueField: undefined,
        childrenField: 'children',

        /** The name of the UI library that is going to be in use. */
        uiLibrary: 'base',

        /* tmpl: undefined, */
        style: {
            active: 'gj-tree-base-active'
        }
    },

    bootstrap: {},

    jqueryui: {}
};
/** */
gj.tree.events = {
    /**
     * Event fires  */
    dataBinding: function ($tree) {
        $tree.trigger('dataBinding', []);
    },

    /**
     * Event fires  */
    dataBound: function ($tree) {
        $tree.trigger('dataBound', []);
    },

    /**
     * Event fires  */
    destroying: function ($tree) {
        $tree.trigger('destroying', []);
    },

    /**
     * Event fires  */
    initialized: function ($tree) {
        $tree.trigger('initialized', []);
    },

    /**
     * Event fires  */
    select: function ($tree) {
        $tree.trigger('select', []);
    },

    /**
     * Event fires  */
    unselect: function ($tree) {
        $tree.trigger('unselect', []);
    },

    /**
     * Event fires  */
    collapsing: function ($tree) {
        $tree.trigger('collapsing', []);
    },

    /**
     * Event fires  */
    collapsed: function ($tree) {
        $tree.trigger('collapsed', []);
    },

    /**
     * Event fires  */
    expanding: function ($tree) {
        $tree.trigger('expanding', []);
    },

    /**
     * Event fires  */
    expanded: function ($tree) {
        $tree.trigger('expanded', []);
    }
}
/*global gj $*/
gj.tree.methods = {

    init: function (jsConfig) {
        gj.widget.prototype.init.call(this, jsConfig, 'tree');

        gj.tree.methods.initialize.call(this);

        if (this.data('autoLoad')) {
            this.reload();
        }
        return this;
    },

    initialize: function ($element) {
        this.empty();
        this.append('<ul class="gj-tree-list gj-tree-unselectable"/>');
        gj.tree.events.initialized(this);
    },

    reload: function (params) {
        var data = this.data();
        if ($.isArray(data.dataSource)) {
            gj.tree.methods.loadData(this);
        } else {

        }
        return this;
    },

    loadData: function ($tree) {
        var i, node, config = $tree.data(),
            $root = $tree.children('ul');

        $root.off().empty();
        for (i = 0; i < config.dataSource.length; i++) {
            gj.tree.methods.appendNode($tree, $root, config.dataSource[i], config);
        }
    },

    appendNode: function ($tree, $parent, nodeData, config) {
        var i, $node, $newParent,
            $node = $('<li/>'),
            $expander = $('<span data-role="expander" data-mode="close">&nbsp;</span>'),
            $display = $('<span data-role="display">' + nodeData[config.textField] + '</span>');

        $expander.on('click', gj.tree.methods.expanderClickHandler($tree));
        $node.append($expander);

        $display.on('click', gj.tree.methods.displayClickHandler($tree));
        $node.append($display);

        if (nodeData[config.childrenField] && nodeData[config.childrenField].length) {
            $expander.text('+');
            $newParent = $('<ul class="gj-tree-list hidden"/>');
            $node.append($newParent);
            
            for (i = 0; i < nodeData[config.childrenField].length; i++) {
                gj.tree.methods.appendNode($tree, $newParent, nodeData[config.childrenField][i], config);
            }  
        }

        $parent.append($node);
    },

    expanderClickHandler: function ($tree) {
        return function (e) {
            var $expander = $(this),
                $children = $expander.siblings('ul'),
                events = gj.tree.events;
            if ($expander.attr('data-mode') === 'close') {
                events.expanding($tree);
                $children.show();
                $expander.attr('data-mode', 'open').text('-');
                events.expanded($tree);
            } else {
                events.collapsing($tree);
                $children.hide();
                $expander.attr('data-mode', 'close').text('+');
                events.collapsed($tree);
            }
        }
    },

    displayClickHandler: function ($tree) {
        return function (e) {
            var $display = $(this),
                $node = $display.parent('li');
            if ($display.attr('data-selected') === 'true') {
                gj.tree.methods.unselect($tree, $node);
            } else {
                if ($tree.data('selectionType') === 'single') {
                    gj.tree.methods.unselectAll($tree);
                }
                gj.tree.methods.select($tree, $node);
            }
        }
    },

    selectAll: function ($tree) {
        var i, $nodes = $tree.find('ul li');
        for (i = 0; i < $nodes.length; i++) {
            gj.tree.methods.select($tree, $($nodes[i]), true);
        }
        return $tree;
    },

    select: function ($tree, $node, cascade) {
        var $display = $node.children('span[data-role="display"]');
        $display.addClass($tree.data().style.active).attr('data-selected', 'true');
        if (cascade) {
            $children = $node.find('ul li');
            for (i = 0; i < $children.length; i++) {
                gj.tree.methods.select($tree, $($children[i]), cascade);
            }
        }
        gj.tree.events.select($tree, $node);
    },
    
    unselectAll: function ($tree) {
        var i, $nodes = $tree.find('ul li');
        for (i = 0; i < $nodes.length; i++) {
            gj.tree.methods.unselect($tree, $($nodes[i]), true);
        }
        return $tree;
    },

    unselect: function ($tree, $node, cascade) {
        var i, $children, $display = $node.children('span[data-role="display"]');
        $display.removeClass($tree.data().style.active).removeAttr('data-selected');
        if (cascade) {
            $children = $node.find('ul li');
            for (i = 0; i < $children.length; i++) {
                gj.tree.methods.unselect($tree, $($children[i]), cascade);
            }
        }
        gj.tree.events.unselect($tree, $node);
    }
}
/** */
gj.tree.widget = function ($element, arguments) {
    var self = this,
        methods = gj.tree.methods;

    self.xhr = null;

    self.reload = function (params) {
        return methods.reload.call(this, params);
    };

    self.appendNode = function (data, $node) { };

    self.prependNode = function (data, $node) { };

    self.expand = function ($node) { };

    self.collapse = function ($node) { };

    self.expandAll = function () { };

    self.collapseAll = function () { };

    self.getById = function (id) { };

    self.getByText = function (text) { };

    self.remove = function ($node) { };

    self.destroy = function () { };

    self.select = function (id) { };
    self.unselect = function (id) { };

    self.selectAll = function () {
        return methods.selectAll(this);
    };

    self.unselectAll = function () {
        return methods.unselectAll(this);
    };

    self.getSelection = function () { };

    $.extend($element, self);
    if ('true' !== $element.attr('data-tree')) {
        methods.init.apply($element, arguments);
    }

    return $element;
};

gj.tree.widget.prototype = new gj.widget();
gj.tree.widget.constructor = gj.tree.widget;

(function ($) {
    $.fn.tree = function (method) {
        var $widget;
        if (typeof method === 'object' || !method) {
            return new gj.tree.widget(this, arguments);
        } else {
            $widget = new gj.tree.widget(this, null);
            if ($widget[method]) {
                return $widget[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else {
                throw 'Method ' + method + ' does not exist.';
            }
        }
    };
})(jQuery);
