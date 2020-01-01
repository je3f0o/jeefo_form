/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : model.js
* Created at  : 2019-12-29
* Updated at  : 2020-01-02
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

class JeefoModel {
    constructor ($input_element, form) {
        this.$element   = $input_element;
        this.is_dirty   = false;
        this.is_valid   = true;
        this.is_touched = false;

        this.connect = $input_element => {
            $input_element.once("focus", () => {
                this.is_touched = true;
                if (form && ! form.is_touched) {
                    form.is_touched = true;
                }
            });

            $input_element.once("input", () => {
                this.is_dirty = true;
                if (form && ! form.is_dirty) {
                    form.is_dirty = true;
                }
            });
        };

        this.connect($input_element);
    }
}

module.exports = JeefoModel;
