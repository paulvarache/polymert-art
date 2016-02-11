'use strict';

class EvalArt {
    constructor (ctx) {
        this.ctx = ctx;
        this.pos = {
            x: 250,
            y: 250
        };
        this.modules = {
            'general': {
                circle (r) {
                    this.ctx.beginPath();
                    this.ctx.arc(this.pos.x, this.pos.y, r, 0, 2 * Math.PI);
                    this.ctx.stroke();
                },
                moveTo (x, y) {
                    this.pos = {
                        x,
                        y
                    };
                }
            }
        };
    }
    evalInContext (code) {
        let m, c, value, mods = [], names = [];
        for (m in this.modules) {
            if (this.modules.hasOwnProperty(m)) {

                for (c in this.modules[m]) {
                    if (this.modules[m].hasOwnProperty(c)) {
                        // Declare property using eval
                        value = this.modules[m][c];

                        if (typeof value === 'function') {
                            value = value.bind(this);
                        }

                        names.push(c);
                        mods.push(value);
                    }
                }
            }
        }

        code = `window.userCode = function (${names.join(',')}){${code}}`;

        eval(code);
        window.userCode.apply({}, mods);
    }
}
