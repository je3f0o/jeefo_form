/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : model.js
* Created at  : 2019-12-29
* Updated at  : 2020-11-03
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const once     = {once: true};
const Readonly = require("@jeefo/utils/object/readonly");

class JeefoModel {
    constructor (element) {
        this.error        = null;
        this.element      = element;
        this.is_dirty     = false;
        this.is_pristine  = true;
        this.is_valid     = true;
        this.is_invalid   = false;
        this.is_touched   = false;
        this.is_untouched = true;
        this.is_pending   = false;

        //element.addEventListener("focus", () => this.set_touched(), once);
        switch (element.tagName) {
            case "SELECT":
                element.addEventListener("change", () => this.set_dirty(), once);
                break;
            default:
                if (element.required) {
                    const is_valid = value => {
                        if (value === '') {
                            this.set_error("required");
                        } else if (this.error === "required") {
                            this.set_error(null);
                        }
                    };
                    is_valid(element.value);
                    element.addEventListener("input", () => {
                        if (this.is_pristine) this.set_dirty();
                        if (this.is_untouched) this.set_touched();
                        is_valid(element.value);
                    });
                    element.addEventListener("blur", () => {
                        if (this.is_untouched) this.set_touched();
                        is_valid(element.value);
                    }, once);
                } else {
                    const fn = () => this.set_dirty();
                    element.addEventListener("input", fn, once);
                }
        }

        const readonly = new Readonly(this);
        readonly.getter("value"   , () => element.value);
        //readonly.getter("required", () => element.required);
    }

    set_touched () {
        this.is_touched   = true;
        this.is_untouched = false;
    }

    set_dirty () {
        this.is_dirty    = true;
        this.is_pristine = false;
    }

    set_error (error) {
        if (error) {
            this.error      = error;
            this.is_valid   = false;
            this.is_invalid = true;
        } else {
            this.error      = null;
            this.is_valid   = true;
            this.is_invalid = false;
        }
    }
}

module.exports = JeefoModel;
