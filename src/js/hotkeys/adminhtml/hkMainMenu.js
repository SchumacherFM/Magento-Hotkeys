/*global window,$*/
/**
 * @category    SchumacherFM_Hotkeys
 * @package     JavaScript
 * @author      Cyrill at Schumacher dot fm / @SchumacherFM
 * @copyright   Copyright (c) Please read the EULA
 */
/*global $,window,$$,varienGlobalEvents,Ajax,Event,Element,jwerty,setLocation,Window*/
;
(function () {
    'use strict';


    function NavigationHotKeys() {
        var self = this;
        self._nav = {};
        self._config = {};
        self._isKeyPressedToActiveMenu = false;
        self._cursorUlCurrent = {}; // left right ul element
        self._cursorLastParent = {}; // up and down ul element
        self._cursorPosition = {};
        self._redirectInProgress = false;
        self._cursorLastPosition = {};
        self._cursorObjectLevelCache = {};
        return self;
    }

    NavigationHotKeys.prototype = {

        _resetMenu: function () {
            var self = this;
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
                listener = new window.keypress.Listener(document.body),
                key = self._config.keyMainMenu || 'meta m';
            listener.simple_combo(key, self._activateNav.bindAsEventListener(self));
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
                        'on_keydown': self._runKeyEvent,
                        'this': self
                    },
                    {
                        'keys': 'down',
                        'is_exclusive': is_exclusive,
                        'is_counting': is_counting,
                        'on_keydown': self._runKeyEvent,
                        'this': self
                    },
                    {
                        'keys': 'left',
                        'is_exclusive': is_exclusive,
                        'is_counting': is_counting,
                        'on_keydown': self._runKeyEvent,
                        'this': self
                    },
                    {
                        'keys': 'right',
                        'is_exclusive': is_exclusive,
                        'is_counting': is_counting,
                        'on_keydown': self._runKeyEvent,
                        'this': self
                    }
                ];
            navListener.register_many(combos);
        },

        _runKeyEvent: function (event) {
            var self = this,
                liElements = [],
                level = 0,
                level0GoofyMapper = {
                    'right': 'down',
                    'left': 'up',
                    'down': 'right',
                    'up': 'left'
                },
                direction = event.keyIdentifier.toLowerCase();

            if (false === self._isKeyPressedToActiveMenu) {
                return false;
            }

            liElements = self._cursorUlCurrent.childElements();
            level = self._getLevelFromClassName(liElements[0]);

            /**
             * why? because the CSS puts level0 in horizontal order and it's natural for humans to use
             * then the right/left key to navigate. under the hood the ul/li elements are made for up/down
             * for navigating between li's and left/right switching levels.
             */
            if (0 === level) {
                direction = level0GoofyMapper[direction];
            }

            //console.log('level', level, direction);

            if ('right' === direction || 'left' === direction) {
                return self._cursorLeftRight(direction);  // idea: if level0 switch to down
            }

            return self._cursorUpDown(('up' === direction) ? 'down' : 'up');  // goofy
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

            if (true === this._redirectInProgress) {
                return console.warn('Redirect is in progress. Please be patient!');
            }

            for (i = 1; i <= 3; i++) {
                loader.insert({'top': new Element('div', {'class': 'fbBar'})});
            }
            a.insert({'top': loader});
            setLocation(href);
            this._redirectInProgress = true;
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
                prev = startValue;

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

            if (true === isDescending && false === isInit) {
                self._cursorPosition[level][type]--;
            } else {
                if (false === isInit) {
                    self._cursorPosition[level][type]++;
                }
            }

            self._cursorPosition[level][type] = self._cursorPosition[level][type] < 0
                ? maxPosition
                : self._cursorPosition[level][type];
            self._cursorPosition[level][type] = self._cursorPosition[level][type] > maxPosition
                ? 0
                : self._cursorPosition[level][type];

            self._cursorLastPosition = {
                'level': level,
                'prev': prev,
                'cur': self._cursorPosition[level][type]
            };
            return self._cursorLastPosition;
        },

        /**
         *
         * @param event {*}
         * @private
         */
        _handleEnterEvent: function (event) {
            var self = this,
                liElements = self._cursorUlCurrent.childElements();
            self._redirectFromLi(liElements[self._cursorLastPosition.cur]);
            return true;
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
        /**
         *
         * @param cb {function}
         * @returns {Array}
         * @private
         */
        _iterateGlobalKeys: function (cb) {
            var self = this,
                hotKey = '',
                ret = [],
                i = 0;
            for (hotKey in self._config.globalKeys) {
                if (self._config.globalKeys.hasOwnProperty(hotKey)) {
                    ret.push(cb.call(self, hotKey, self._config.globalKeys[hotKey], i));
                    i++;
                }
            }
            return ret;
        },
        /**
         * Global GoTo Keys
         * @private
         */
        _mapGoToKeys: function () {
            var self = this,
                urlObject = {},
                hotKey = '',
                listener = new window.keypress.Listener(),
                my_combos = self._iterateGlobalKeys(function (hotKey, urlObject) {
                    return {
                        "keys": hotKey,
                        "is_exclusive": true,
                        'is_unordered': true,
                        "on_keydown": self._goTo.bindAsEventListener(self, hotKey, urlObject),
                        "this": self
                    };
                });
            listener.register_many(my_combos);
        },
        _goTo: function (event, hotkey, urlObject) {
            var self = this,
                $mask = $('loading-mask'),
                $loader = $mask.select('.loader')[0],
                innerContent = $loader.innerHTML.replace(/<br>.+/i, '');

            $loader.update(innerContent + '<br>' + hotkey + '<br>' + urlObject.l);
            $mask.show();
            setLocation(self._config.baseUrl + urlObject.r);
            return false;
        },
        _initShortCutKeyHelp: function () {
            var self = this,
                $navBar = $('page-help-link'),
                aElement = new Element('a', {'class': 'shortCutHelp', 'href': '#'});
            aElement.update('Shortcuts');
            aElement.observe('click', self._showShortCutKeyHelp.bindAsEventListener(self));
            $navBar.insert({'after': aElement});
        },
        /**
         *
         * @param event {object}
         * @private
         */
        _showShortCutKeyHelp: function (event) {
            event.preventDefault();
            var self = this,
                win = new Window({ // http://prototype-window.xilinus.com/documentation.html
                    className: "magento",
                    title: self.__("Available Shortcuts"),
                    width: 500,
                    height: 300,
                    draggable: false,
                    destroyOnClose: true,
                    recenterAuto: false
                }),
                $theWin = $(win.getId());
            // are you f*** kidding me!?
            $theWin.setStyle({'position': 'absolute'});
            $theWin.removeClassName('dialog').addClassName('magento');
            win.getContent().update(self._getShortCutHelpTable());
            win.setStatusBar('<a href="' + self._config.manageHotKeys + '">' + self.__('Manage short cuts') + '</a>');
            win.showCenter();
        },
        /**
         * generates the table where all shortcuts are listed
         * @returns {string}
         * @private
         */
        _getShortCutHelpTable: function () {
            var self = this, html = [], table = '', htmlC = 0;
            html = self._iterateGlobalKeys(function (hotKey, urlObject) {
                return '<td class="l"><a href="' +
                    self._config.baseUrl + urlObject.r
                    + '">' +
                    urlObject.l + '</a></td><td class="k">' + hotKey + '</td>';
            });

            if (1 === (html.length % 2)) {
                html.push('<td class="l"></td><td class="k"></td>');
            }
            htmlC = html.length - 1;
            html.forEach(function (td, i) {
                var mod = i % 2;
                if (0 === mod) {
                    table += '<tr>';
                }
                table += td;
                if (1 === mod || i === htmlC) {
                    table += '</tr>';
                }
            });
            return '<table class="sch-table">' + table + '</table>';
        },
        /**
         * translations method
         * @param str
         * @returns {*}
         * @private
         */
        __: function (str) {
            return this._config.__[str] || str;
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
            self._config = config;
            return this;
        },
        init: function () {
            var self = this;
            return function NHKinit() {
                self._initConfig();
                self._registerMenuShortCut();
                self._assignCursorNavigation();
                self._mapGoToKeys();
                self._initShortCutKeyHelp();
            };
        }
    };

    var nhk = new NavigationHotKeys();
    document.observe('dom:loaded', nhk.init());

}).
    call(function () {
        return this || (typeof window !== 'undefined' ? window : global);
    }());
