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
//        self._assignedKeys = {};
//        self._previousActiveLiNode = null;
        self._activateMenuSC = 'meta m';
        self._isKeyPressedToActiveMenu = false;
        self._cursorUlCurrent = {}; // left right ul element
        self._cursorLastParent = {}; // up and down ul element
        self._cursorPosition = {};
        self._cursorLastPosition = {};
        self._cursorObjectLevelCache = {};
        return self;
    }

    NavigationHotKeys.prototype = {

        _resetMenu: function () {
            var self = this,
                classElem = [];

            if (true === self._isKeyPressedToActiveMenu) {
                self._isKeyPressedToActiveMenu = false;
                self._cursorPosition = {};
                self._cursorUlCurrent = {};
                self._cursorLastParent = {};
                self._startStopScrolling('start');
                self._removeClassName(self._nav);
            }
        },

        /**
         * register the key board event listeners and the body.onclick listeners to reset the menu
         * @private
         */
        _registerMenuShortCut: function () {
            var self = this,
                listener = new window.keypress.Listener(document.body);
            listener.simple_combo(this._activateMenuSC, self._activateNav.bindAsEventListener(self));
            document.observe('click', self._resetMenu.bindAsEventListener(self));
        },

        /**
         * activates the cursors and the ul root to receive key board events
         *
         * @param event {*}
         * @returns {boolean}
         * @private
         */
        _activateNav: function (event) {

            var self = this, firstLiNode = {};
            self._isKeyPressedToActiveMenu = true;
            self._cursorUlCurrent = self._nav;

            self._makeUlConceivableForKeyboard(self._cursorUlCurrent);

            firstLiNode = self._nav.firstDescendant();
            firstLiNode.addClassName('kpLiBgColor');
            self._startStopScrolling('stop');
            return true;
        },

        _makeUlConceivableForKeyboard: function (ulElement) {
            if (!ulElement.hasAttribute) {
                console.log('ulElement.hasAttribute isch false!');
                return this;
            }
            if (true === ulElement.hasAttribute('tabindex')) {
                ulElement.focus();
                return this; // assignment has already been done
            }

            ulElement.writeAttribute('tabindex', 0); // without that attr the element is not capable of receiving keyboard events
            ulElement.focus();
            return this;
        },

        /**
         * boot method to assign the cursors to the appropriate methods
         * inits key board event listeners to the root ul menu
         * @private
         */
        _assignCursorNavigation: function () {
            var self = this,
                navListener = new window.keypress.Listener(self._nav),
                is_exclusive = true,
                is_counting = false,
                combos = [
                    {
                        'keys': 'enter',
                        'is_exclusive': is_exclusive,
                        'is_counting': is_counting,
                        'on_keydown': function (event) {
                            if (false === self._isKeyPressedToActiveMenu) {
                                return false;
                            }
                            return self._handleEnterEvent(event);
                        },
                        'this': self
                    },
                    {
                        'keys': 'up',
                        'is_exclusive': is_exclusive,
                        'is_counting': is_counting,
                        'on_keydown': function () {
                            if (false === self._isKeyPressedToActiveMenu) {
                                return false;
                            }
                            return self._cursorUpDown('down');
                        },
                        'this': self
                    },
                    {
                        'keys': 'down',
                        'is_exclusive': is_exclusive,
                        'is_counting': is_counting,
                        'on_keydown': function () {
                            if (false === self._isKeyPressedToActiveMenu) {
                                return false;
                            }
                            return self._cursorUpDown('up');
                        },
                        'this': self
                    },
                    {
                        'keys': 'left',
                        'is_exclusive': is_exclusive,
                        'is_counting': is_counting,
                        'on_keydown': function () {
                            if (false === self._isKeyPressedToActiveMenu) {
                                return false;
                            }
                            return self._cursorLeftRight('left'); // idea: if level0 switch to up
                        },
                        'this': self
                    },
                    {
                        'keys': 'right',
                        'is_exclusive': is_exclusive,
                        'is_counting': is_counting,
                        'on_keydown': function () {
                            if (false === self._isKeyPressedToActiveMenu) {
                                return false;
                            }
                            return self._cursorLeftRight('right');  // idea: if level0 switch to down
                        },
                        'this': self
                    }
                ];
            navListener.register_many(combos);
        },

        /**
         * navigate on the same level
         *
         * @param direction
         * @returns {boolean}
         * @private
         */
        _cursorUpDown: function (direction) {
            this._makeUlConceivableForKeyboard(this._cursorUlCurrent);
            var self = this,
                liElements = self._cursorUlCurrent.childElements(),
                level = self._getLevelFromClassName(liElements[0]),
                position = self._getCursorPosition(level, direction, liElements.length - 1),
                isParent = false;


            isParent = self._childIsParent(liElements[position.cur]);

            //console.log('UpDown ', position);

            if (true === isParent) {
                liElements[position.cur].addClassName('over');
            }

            liElements[position.cur].addClassName('kpLiBgColor');
            if (position.cur !== position.prev) {
                liElements[position.prev].removeClassName('over');
                liElements[position.prev].removeClassName('kpLiBgColor');
            }

            return true;
        },

        /**
         * level up or down
         *
         * @param direction
         * @returns {boolean}
         * @private
         */
        _cursorLeftRight: function (direction) {
            var self = this,
                position = self._cursorLastPosition,
                firstLiElement = null,
                level = 0,
                liElements = self._cursorUlCurrent.childElements(),
                isParent = false;

            if (undefined === liElements[position.cur]) {
                //console.log('empty liElements', position, liElements);
                position.cur = 0;
            }

            isParent = self._childIsParent(liElements[position.cur]);

            //console.log('LeftRight ', position);

            if ('right' === direction && true === isParent) {
                self._cursorLastParent = {
                    'ul': (self._cursorUlCurrent),
                    'pos': self._cursorLastPosition
                };
                self._cursorUlCurrent = liElements[position.cur].down('ul');
                firstLiElement = self._cursorUlCurrent.firstDescendant();
                firstLiElement.addClassName('kpLiBgColor');
                level = self._getLevelFromClassName(firstLiElement);
                //console.log(level, self._cursorPosition[level]);
                if (self._cursorPosition[level]) {
                    self._cursorPosition[level].ud = 0;
                }
                return true;
            }
            if ('right' === direction && false === isParent) {
                self._redirectFromLi(liElements[position.cur]);
                return true;
            }

            if ('left' === direction && self._cursorLastParent.ul) { // one level up

                liElements[position.cur].removeClassName('kpLiBgColor');

                self._cursorUlCurrent = self._cursorLastParent.ul;
                self._cursorLastPosition = self._cursorLastParent.pos;
                liElements = self._cursorUlCurrent.childElements();
                liElements[self._cursorLastPosition.cur].addClassName('kpLiBgColor');
                return true;
            }
            return true;
        },

        /**
         *
         * @param liElement
         * @returns void
         * @private
         */
        _redirectFromLi: function (liElement) {
            var a = liElement.down('a'),
                href = a.readAttribute('href'),
                loader = new Element('div', {'class': 'fbLoader'}),
                i = 1;
            for (i = 1; i <= 3; i++) {
                loader.insert({'top': new Element('div', {'class': 'fbBar'})});
            }
            a.insert({'top': loader});
            setLocation(href);
        },

        /**
         *
         * @param liElement {*}
         * @returns boolean
         * @private
         */
        _childIsParent: function (liElement) {
            return liElement.hasClassName('parent');
        },

        /**
         *
         * @param level int
         * @param dir string
         * @param maxPosition int
         * @private
         */
        _getCursorPosition: function (level, dir, maxPosition) {
            var self = this,
                type = ('up' === dir || 'down' === dir) ? 'ud' : 'lr',
                isDescending = ('down' === dir || 'left' === dir),
                startValue = 0,
                isInit = false,
                prev = startValue,
                next = startValue;

            if (undefined === self._cursorPosition[level]) {
                self._cursorPosition[level] = {};
                self._cursorPosition[level][type] = startValue;
                isInit = true;
            }
            if (self._cursorPosition[level] && undefined === self._cursorPosition[level][type]) {
                self._cursorPosition[level][type] = startValue;
                isInit = true;
            }
            prev = self._cursorPosition[level][type];
            next = self._cursorPosition[level][type];

            if (true === isDescending) {
                if (false === isInit) {
                    self._cursorPosition[level][type]--;
                }
                next = self._cursorPosition[level][type] - 1;
            } else {
                if (false === isInit) {
                    self._cursorPosition[level][type]++;
                }
                next = self._cursorPosition[level][type] + 1;
            }

            self._cursorPosition[level][type] = self._cursorPosition[level][type] < 0
                ? 0
                : self._cursorPosition[level][type];
            self._cursorPosition[level][type] = self._cursorPosition[level][type] > maxPosition
                ? maxPosition
                : self._cursorPosition[level][type];

            next = next < 0
                ? 0
                : next;
            next = next > maxPosition
                ? maxPosition
                : next;

            self._cursorLastPosition = {
                'level': level,
                'prev': prev,
                'cur': self._cursorPosition[level][type],
                'next': next
            };
            return self._cursorLastPosition;
        },

        _resetCursorPosition: function (level) {
            var self = this;
            self._cursorPosition[level] = {};
            return self;
        },

        /**
         *
         * @param event {*}
         * @private
         */
        _handleEnterEvent: function (event) {
            var self = this;
            console.log(event, self._cursorLastPosition);

        },

        /**
         *
         * @param htmlElement {object}
         * @param className null|string css
         * @returns {NavigationHotKeys}
         * @private
         */
        _removeClassName: function (htmlElement, className) {
            className = className || 'kpLiBgColor';
            var classElem = htmlElement.select('.' + className);
            if (classElem.length > 0) {
                classElem.forEach(function (element) {
                    element.removeClassName(className);
                });
            }
            return this;
        },

        /**
         * expensive operation ... refactor to use substr and that stuff
         * @param liElement
         * @returns {Number}
         * @private
         */
        _getLevelFromClassName: function (liElement) {
            var classes = liElement.readAttribute('class'),
                matches = classes.match(/level([0-9]+)/);
            return parseInt(matches[1] || 0, 10);
        },

        /**
         *
         * @param type string
         * @returns {NavigationHotKeys}
         * @private
         */
        _startStopScrolling: function (type) {
            type = type || 'stop';

            var self = this,
                el = document.body,
                className = 'stop-scrolling';

            if ('stop' === type) {
                if (el.classList) {
                    el.classList.add(className);
                } else {
                    el.className += ' ' + className;
                }
            }
            if ('start' === type) {
                if (el.classList) {
                    el.classList.remove(className);
                } else {
                    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                }
            }
            return this;
        },

//        _handlePreviousActiveLiNode: function (currentKey, liNode) {
//            if (null !== this._previousActiveLiNode) {
//                this._previousActiveLiNode.removeClassName('over');
//            }
//            this._previousActiveLiNode = liNode;
//        },
//        _applyCharUnderline: function (label, char, pos) {
//            var firstPart = label.substr(0, pos),
//                lastPart = label.substr(pos + 1, label.length);
//            return firstPart + '<i class="kpuline">' + char + '</i>' + lastPart;
//        },
//        _getAvailableKey: function (label, prefix) {
//            prefix = prefix || '';
//            var i = 0, len = 0, self = this, orgChar = '', aChar = '', newAssignment = false;
//            for (i = 0, len = label.length; i < len; i++) {
//                orgChar = aChar = label.charAt(i);
//                aChar = aChar.toLowerCase();
//                if (undefined === self._assignedKeys[prefix + aChar]) {
//                    newAssignment = true;
//                    self._assignedKeys[prefix + aChar] = label;
//                    break;
//                }
//            }
//            return true === newAssignment ? {
//                'char': orgChar,
//                'key': prefix + aChar,
//                'pos': i
//            } : false;
//        },
        /**
         * loads on dom:ready
         *
         * @returns {NavigationHotKeys}
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
                self._registerMenuShortCut();
                self._assignCursorNavigation();
            };
        }
    };

    var nhk = new NavigationHotKeys();
    document.observe('dom:loaded', nhk.init());

}).
    call(function () {
        return this || (typeof window !== 'undefined' ? window : global);
    }());
