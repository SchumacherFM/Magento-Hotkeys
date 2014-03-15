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


    function InputKeyMapper() {
        this._alreadyMappedKeys = {};
        return this;
    }

    InputKeyMapper.prototype = {

        _init: function () {
            var self = this,
                $existingKeys = $('hkroutes_existing_keys');
            if (!$existingKeys) {
                return this;
            }
            self._alreadyMappedKeys = $existingKeys.getValue().evalJSON();
            return this;
        },

        _keyPressToInput: function (htmlId) {
            var
                $inputElement = $(htmlId),
                self = this,
                _keycode_dictionary = {
                    16: "shift",
                    17: "ctrl",
                    18: "alt",
                    32: "space",
                    48: "0",
                    49: "1",
                    50: "2",
                    51: "3",
                    52: "4",
                    53: "5",
                    54: "6",
                    55: "7",
                    56: "8",
                    57: "9",
                    65: "a",
                    66: "b",
                    67: "c",
                    68: "d",
                    69: "e",
                    70: "f",
                    71: "g",
                    72: "h",
                    73: "i",
                    74: "j",
                    75: "k",
                    76: "l",
                    77: "m",
                    78: "n",
                    79: "o",
                    80: "p",
                    81: "q",
                    82: "r",
                    83: "s",
                    84: "t",
                    85: "u",
                    86: "v",
                    87: "w",
                    88: "x",
                    89: "y",
                    90: "z",
                    91: "meta",
                    92: "meta",
                    93: "meta",
                    224: "meta",
                    225: "alt",
                    57392: "ctrl"
                },
                _deleteKeys = {
                    8: "backspace",
                    46: "delete"
                },
                _isFirst = true;
            if (!$inputElement) {
                return self;
            }

            $inputElement
                .observe('focus', function () {
                    _isFirst = true;
                })
                .observe('keydown', function (event) {
                    var key = event.which || event.keyCode,
                        target = event.target || event.srcElement,
                        value = target.value.replace(/^\s+|\s+$/g, '');

                    if (_deleteKeys[key]) { // do nothing when delete or backspace has been pressed
                        target.style.backgroundColor = 'white';
                        return null;
                    }
                    event.preventDefault();
                    if (_keycode_dictionary[key]) {
                        value = (true === _isFirst ? '' : value + ' ') + _keycode_dictionary[key];
                        _isFirst = false;
                    }

                    if (self._alreadyMappedKeys[value]) {
                        target.style.backgroundColor = 'lightcoral';
                    } else {
                        target.style.backgroundColor = 'lightgreen';
                    }
                    target.value = value;
                    return null;
                });
            return self;
        },
        init: function () {
            var self = this;
            return function InputKeyMapperInit() {
                self._init();
                self._keyPressToInput('system_hotkeys_key_main_menu'); // edit system config
                self._keyPressToInput('hkroutes_hotkey'); // edit routes
            };
        }
    };

    var nhk = new InputKeyMapper();
    document.observe('dom:loaded', nhk.init());

}).
    call(function () {
        return this || (typeof window !== 'undefined' ? window : global);
    }());
