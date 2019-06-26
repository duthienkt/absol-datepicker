import DCore from "./DCore";

function DText(data) {
    return DCore._('div');
};

DText.property = {
    text: {
        set: function (val) {
            this.clearChild();
            this._text = val;
            this.addChild(document.createTextNode(this.text));
        },
        get: function () {
            return this._text || '';
        }
    }
};


DCore.install('dtext', DText);