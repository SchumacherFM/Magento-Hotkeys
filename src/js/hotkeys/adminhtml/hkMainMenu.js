/*global window,$*/
/**
 * @category    SchumacherFM_Hotkeys
 * @package     JavaScript
 * @author      Cyrill at Schumacher dot fm / @SchumacherFM
 * @copyright   Copyright (c) Please read the EULA
 */
/*global $,window,$$,varienGlobalEvents,Ajax,Event,Element,jwerty,setLocation*/
;
(function () {
    'use strict';


    function NavigationHotKeys() {
        var self = this;
        self._nav = {};
        self._config = {};
        self._assignedKeys = {};
        self._previousActiveLiNode = null;
        return self;
    }

    NavigationHotKeys.prototype = {
        _assignKeyBoardShortCuts: function (parentObject) {
            var self = this,
                children = parentObject.childElements(),
                labels = [];
            children.forEach(function (liNode, index) {
                var aNode = liNode.firstDescendant(),
                    spanNode = aNode.firstDescendant(),
                    aLabel = spanNode.textContent,
                    key = self._getAvailableKey(aLabel);

                if (false !== key) {
                    spanNode.update(self._applyCharUnderline(aLabel, key.char, key.pos));
                    jwerty.key(key.key, self._bindNodeToKeyEvent(liNode, aNode, key));
                }
                //console.log(key)
            });
        },
        _bindNodeToKeyEvent: function (liNode, aNode, key) {
            var self = this;
            return function (event) {
                self._handlePreviousActiveLiNode(key.key, liNode);
                liNode.addClassName('over');

                if ('#' !== aNode.readAttribute('href')) {
                    setLocation(aNode.readAttribute('href'));
                }
//                console.log(event);
            };
        },
        _handlePreviousActiveLiNode: function (currentKey, liNode) {
            if (null !== this._previousActiveLiNode) {
                this._previousActiveLiNode.removeClassName('over');
            }
            this._previousActiveLiNode = liNode;
        },
        _applyCharUnderline: function (label, char, pos) {
            var firstPart = label.substr(0, pos),
                lastPart = label.substr(pos + 1, label.length);
            return firstPart + '<span class="uline">' + char + '</span>' + lastPart;
        },
        _getAvailableKey: function (label) {
            var i = 0, len = 0, self = this, orgChar = '', aChar = '', newAssignment = false;
            for (i = 0, len = label.length; i < len; i++) {
                orgChar = aChar = label.charAt(i);
                aChar = aChar.toLowerCase();
                if (undefined === self._assignedKeys[aChar]) {
                    newAssignment = true;
                    self._assignedKeys[aChar] = label;
                    break;
                }
            }
            return true === newAssignment ? {
                'char': orgChar,
                'key': aChar,
                'pos': i
            } : false;
        },
        _initConfig: function () {
            var
                self = this,
                config = JSON.parse($('hotkeysConfig').readAttribute('data-config') || '{}');

            self._nav = $('nav');
            self._config = {            };

            return this;
        },
        init: function () {
            var self = this;
            return function NHKinit() {
                self._initConfig();
                self._assignKeyBoardShortCuts(self._nav);
            };
        }
    };

    var nhk = new NavigationHotKeys();
    document.observe('dom:loaded', nhk.init());

}).
    call(function () {
        return this || (typeof window !== 'undefined' ? window : global);
    }());
