import DCore from "./DCore";

import Date from '../helper/Date';



var _ = DCore._;
var $ = DCore.$;

function DateTextInput() {
    var res = _({
        class: 'absol-date-text-input',
        extendEvent: ['focus', 'blur', 'change'],
        child: [
            {
                tag: 'editabletext',
                class: 'day',
                props: {
                    text: 'dd'
                }
            },
            { text: '/' },
            {
                class: 'month',

                tag: 'editabletext',
                props: {
                    text: 'mm'
                }
            },
            { text: '/' },
            {
                tag: 'editabletext',
                class: 'year',
                props: {
                    text: 'yyyy'
                }
            }
        ]
    });
    return res;
}


DateTextInput.property = {};

DateTextInput.property.value = {
    set: function (value) {
        if (!value) {
            this.$dayIp.text = 'dd';
            this.$monthIp.text = 'mm';
            this.$yearIp.text = 'yyyy';
            this._value = null;
        }
        else {
            var d = value.getDate();
            var m = value.getMonth() + 1;
            var y = value.getFullYear();
            this.$dayIp.text = d < 10 ? '0' + d : '' + d;
            this.$monthIp.text = m < 10 ? '0' + m : '' + m;
            this.$yearIp.text = y + '';
            this._value = value;
        }
    },
    get: function () {
        return this._value;
    }
}




DateTextInput.prototype.preInit = function () {
    this.isFocus = false;
    this.$focusInp = null;
    this.$monthIp = $('editabletext.month', this)
        .on('click', this._ev_click_month.bind(this))
    this.$dayIp = $('editabletext.day', this)
        .on('click', this._ev_click_day.bind(this));
    this.$yearIp = $('editabletext.year', this)
        .on('click', this._ev_click_year.bind(this));
    this._handle_numberOnly(this.$dayIp);
    this._handle_numberOnly(this.$monthIp);
    this._handle_numberOnly(this.$yearIp);
    this._handle_textLength(this.$dayIp, 2);
    this._handle_textLength(this.$monthIp, 2);
    this._handle_textLength(this.$yearIp, 4);
    this._handle_TabNext(this.$dayIp);
    this._handle_TabNext(this.$monthIp);
    this._handle_TabNext(this.$yearIp);
    this._handle_NumberLimit(this.$dayIp, 1, 31, 2);
    this._handle_NumberLimit(this.$monthIp, 1, 12, 2);
    this._handle_NumberLimit(this.$yearIp, 1890, 2100);


    this._handle_Blur(this.$yearIp);
    this._handle_Blur(this.$monthIp);
    this._handle_Blur(this.$dayIp);

};

DateTextInput.prototype._handle_textLength = function (element, length) {
    var self = this;
    element.on('keydown', function (event) {
        var key = event.key;

        if (window.getSelection && !event.ctrlKey && !event.altKey && key.length == 1 && key.match(/[0-9]/)) {
            if (window.getSelection().toString().length == 0 && element.text.length + 1 > length)
                event.preventDefault();
        }
        else {
            setTimeout(function () {
                if (element.text.length > length) {
                    var newText = element.text;
                    newText = newText.substring(newText.length - 2);
                    element.text = newText;
                }
            }, 10)
        }
    }).on('keydown', function (event) {
        setTimeout(function () {
            if (self.$focusInp == element) {
                if (element.text.length >= length) {
                    var firstElt;
                    var found = false;
                    var next = $('editabletext', self, function (elt) {
                        if (!firstElt) firstElt = elt;
                        if (elt == element) {
                            found = true;
                        }
                        else if (found) {
                            return true;
                        }
                    });
                    if (next) {
                        self._edit(next);
                    }
                    else {
                        self._edit(firstElt);
                    }
                }
            }
        }, 100)
    });
};

DateTextInput.prototype._handle_numberOnly = function (element) {
    element.on('keydown', function (event) {
        var key = event.key;
        if (!event.ctrlKey && !event.altKey && key.length == 1 && !key.match(/[0-9]/)) {
            event.preventDefault();
        }
    });
    return element;
};

DateTextInput.prototype._handle_TabNext = function (element) {
    var self = this;
    element.on('keydown', function (event) {
        var key = event.key;
        if (key == 'Tab') {
            var firstElt;
            var found = false;
            var next = $('editabletext', self, function (elt) {
                if (!firstElt) firstElt = elt;
                if (elt == element) {
                    found = true;
                }
                else if (found) {
                    return true;
                }
            });
            if (next) {
                self._edit(next);
            }
            else {
                self._edit(firstElt);
            }
            event.preventDefault();
        }
    });
    return element;
};

DateTextInput.prototype._handle_NumberLimit = function (element, min, max, padding) {
    element.on('blur', function (event) {
        var value = parseInt(element.text);
        if (!(value >= min)) value = min;
        if (value > max) value = max;
        value = '' + value;
        while (value.length < padding) value = '0' + value;
        element.text = value;
    });
};

DateTextInput.prototype.focus = function () {
    if (!this.$focusInp) {
        this.isFocus = true;
        this._edit($('editabletext'), this);
    }
};

DateTextInput.prototype.blur = function () {
    if (this.$focusInp) {
        this.$focusInp.blur();
    }
};



DateTextInput.prototype._ev_click_year = function (event) {
    this._edit(this.$yearIp);
};

DateTextInput.prototype._ev_click_day = function (event) {
    this._edit(this.$dayIp);
};
DateTextInput.prototype._ev_click_month = function (event) {
    this._edit(this.$monthIp);
};

DateTextInput.prototype._edit = function (editableElt) {
    var lastFocus = this.isFocus;
    this.isFocus = true;
    this.$focusInp = editableElt;
    editableElt.edit(true, true);
    if (!lastFocus) {
        this.emit('focus', { target: this, editableElt: editableElt }, this);
    }
};

DateTextInput.prototype._normalize = function () {
    if (this.$dayIp.text == 'dd' || this.$monthIp.text == 'mm' || this.$yearIp.text == 'yyyy') return false;
    var d = parseInt(this.$dayIp.text);
    var m = parseInt(this.$monthIp.text) - 1;
    var y = parseInt(this.$yearIp.text);
    var newValue = new Date(y, m, d);
    this.value = newValue;
    return true;

};


DateTextInput.prototype._handle_Blur = function (element) {
    var self = this;
    element.on('blur', function (event) {
        if (self.$focusInp != null) {
            if (self.$focusInp == element) {
                self.$focusInp = null;
                $(document.body).once('mouseup', function () {
                    setTimeout(function () {
                        if (self.$focusInp == null) {
                            self.isFocus = false;
                            var lastValue = self.value;
                            self._normalize();
                            self.emit('blur', { target: self }, self);
                            if (lastValue == null) {
                                if (self.value) {
                                    self.emit('change', { target: this, value: self.value }, self);
                                }
                            }
                            else {
                                if (Date.compareDate(lastValue, self.value) != 0) {
                                    self.emit('change', { target: this, value: self.value }, self);
                                }
                            }
                        }
                    }, 3);
                })
            }
        }
    }).on('keydown', function (event) {
        if (event.key == 'Enter') {
            element.blur();
            self.isFocus = false;
            self._normalize();
            self.emit('blur', { target: self }, self);
        }
    });
};


DateTextInput.prototype.init = function (props) {
    this.preInit();
    this.super(props);
};

DCore.install('datetextinput', DateTextInput);

export default DateTextInput;