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


    function GoToHotKeys() {
        var self = this;
        self._nav = {};
        self._config = {};
        self._assignedKeys = {};
        self._previousActiveLiNode = null;
        self._activateMenu = 'meta m';
        return self;
    }

    GoToHotKeys.prototype = {

        _assignCursorNavigation: function (bindToDomElement, parentObject, shortcutPrefix) {
            shortcutPrefix = shortcutPrefix || '';
            bindToDomElement = bindToDomElement || document.body;
            parentObject = parentObject || this._nav;
            var self = this,
                children = parentObject.childElements(),
                kpComboArray = [];
            children.forEach(function (liNode, index) {
                var aNode = liNode.firstDescendant(),
                    spanNode = aNode.firstDescendant(),
                    aLabel = spanNode.textContent,
                    mappedKey = self._getAvailableKey(aLabel, shortcutPrefix);
                console.log(mappedKey);
                if (false !== mappedKey) {
                    spanNode.update(self._applyCharUnderline(aLabel, mappedKey.char, mappedKey.pos));
                    kpComboArray.push({
                        'keys': mappedKey.key,
                        'is_exclusive': true,
                        'is_sequence': true,
                        'on_keydown': self._bindNodeToKeyEvent(liNode, aNode, mappedKey),
                        'this': self
                    });
                }
            });
            var listener = new window.keypress.Listener(bindToDomElement);
            listener.register_many(kpComboArray);
        },

        _bindNodeToKeyEvent: function (liNode, aNode, key) {
            var self = this;
            return function (event) {
                if ('#' !== aNode.readAttribute('href')) {
                    aNode.addClassName('kpOrange');
                    return setLocation(aNode.readAttribute('href'));
                }
                var ulNode = liNode.down('ul');
                if (!ulNode) {
                    console.log('ulNode not defined!');
                    return true;
                }

                //self._handlePreviousActiveLiNode(key.key, liNode);
                liNode.addClassName('over');
                ulNode.focus(); // also important

                if (true === ulNode.hasAttribute('tabindex')) {
                    return true; // assignment has already been done
                }
                ulNode.writeAttribute('tabindex', 0); // without that attr the element is not capable of receiving keyboard events
                self._assignCursorNavigation(ulNode, ulNode, key.key + ' ');
                // var ulNodeListener = new window.keypress.Listener(ulNode);
//                ulNodeListener.simple_combo('up', function (event) {
//                    console.log('up', event);
//                });
//                ulNodeListener.simple_combo('down', function (event) {
//                    console.log('down', event);
//                });

                return false;
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
            return firstPart + '<i class="kpuline">' + char + '</i>' + lastPart;
        },
        _getAvailableKey: function (label, prefix) {
            prefix = prefix || '';
            var i = 0, len = 0, self = this, orgChar = '', aChar = '', newAssignment = false;
            for (i = 0, len = label.length; i < len; i++) {
                orgChar = aChar = label.charAt(i);
                aChar = aChar.toLowerCase();
                if (undefined === self._assignedKeys[prefix + aChar]) {
                    newAssignment = true;
                    self._assignedKeys[prefix + aChar] = label;
                    break;
                }
            }
            return true === newAssignment ? {
                'char': orgChar,
                'key': prefix + aChar,
                'pos': i
            } : false;
        },
        /**
         * loads on dom:ready
         *
         * @returns {GoToHotKeys}
         * @private
         */
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
                self._assignCursorNavigation();
            };
        }
    };

    var nhk = new GoToHotKeys();
    document.observe('dom:loaded', nhk.init());

}).
    call(function () {
        return this || (typeof window !== 'undefined' ? window : global);
    }());
