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
        self._config = {};
        return self;
    }

    GoToHotKeys.prototype = {

        // mark ul entry by route
        _applyCharUnderline: function (label, char, pos) {
            var firstPart = label.substr(0, pos),
                lastPart = label.substr(pos + 1, label.length);
            return firstPart + '<i class="kpuline">' + char + '</i>' + lastPart;
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
