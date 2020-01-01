/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-12-29
* Updated at  : 2019-12-29
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

const jqlite          = require("@jeefo/jqlite");
const JeefoInputModel = require("./model");

const prop_onsubmit = Symbol("onSubmit");

class JeefoFormData {
    constructor (form_element) {
        this.data       = {};
        this.models     = {};
        this.target     = form_element;
        this.is_dirty   = false;
        this.is_valid   = true;
        this.is_touched = false;

        this.sync();
    }

    sync () {
        const new_model_names     = [];
        const existed_model_names = Object.keys(this.models);

        for (const element of this.target.elements) {
            if (element.tagName === "BUTTON" || ! element.name) {
                continue;
            }

            new_model_names.push(element.name);

            if (! (this.models[element.name] instanceof JeefoInputModel)) {
                const $element = jqlite(element);
                this.models[element.name] = new JeefoInputModel($element, this);
            }
        }

        existed_model_names.forEach(model_name => {
            if (! new_model_names.includes(model_name)) {
                delete this.models[model_name];
            }
        });
    }

    serialize () {
        this.data = {};

        for (const element of this.target.elements) {
            if (element.tagName === "BUTTON" || ! element.name) {
                continue;
            }

            if (this.models[element.name]) {
                this.data[element.name] = element.value;
            }
        }
    }
}

exports.selector = "form";
exports.bindings = {
    [prop_onsubmit] : "!onSubmit"
};

exports.controller = class JeefoFrom {
    on_init ($element) {
        const form_name = $element.get_attr("name");
        const form_data = new JeefoFormData($element.DOM_element);
        const on_submit = this[prop_onsubmit];

        if (form_name) {
            this[form_name] = form_data;
        }
        this.__form_data = form_data;

        if (on_submit) {
            $element.on("submit", event => {
                event.preventDefault();
                // REMINDER: Do i really need to stop propagation???

                form_data.serialize();
                on_submit(form_data);
            });
        }
    }

    on_digest () {
        this.__form_data.sync();
    }
};
