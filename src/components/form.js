/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : form.js
* Created at  : 2019-12-29
* Updated at  : 2020-11-12
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

const compile         = require("@jeefo/component/compiler");
const Readonly        = require("@jeefo/utils/object/readonly");
const JeefoDOMParser  = require("@jeefo/jqlite/dom_parser");
const JeefoInputModel = require("../model");

const object_keys = Object.keys;

const find_first = (models, prop) => {
    prop = `is_${prop}`;
    return name => {
        if (name) {
            const model = models[name];
            return model !== void 0 && model[prop];
        } else {
            for (const name of object_keys(models)) {
                if (models[name][prop]) return true;
            }
            return false;
        }
    };
};

const every = (models, prop) => {
    prop = `is_${prop}`;
    return name => {
        if (name) {
            const model = models[name];
            return model !== void 0 && model[prop];
        } else {
            for (const name of object_keys(models)) {
                if (! models[name][prop]) return false;
            }
            return true;
        }
    };
};

class JeefoForm {
    constructor () {
        this.data   = {};
        this.models = {};

        const readonly = new Readonly(this);
        readonly.prop("is_dirty"  , find_first(this.models, "dirty"));
        readonly.prop("is_invalid", find_first(this.models, "invalid"));
        readonly.prop("is_touched", find_first(this.models, "touched"));
        readonly.prop("is_pending", find_first(this.models, "pending"));

        readonly.prop("is_valid"    , every(this.models, "valid"));
        readonly.prop("is_pristine" , every(this.models, "pristine"));
        readonly.prop("is_untouched", every(this.models, "untouched"));
    }

    sync () {
        const current_model_names = [];
        const existed_model_names = Object.keys(this.models);

        for (const element of this.target.elements) {
            if (element.tagName === "BUTTON" || ! element.name) continue;

            current_model_names.push(element.name);

            if (! (this.models[element.name] instanceof JeefoInputModel)) {
                this.models[element.name] = new JeefoInputModel(element);
            }
        }

        let i = existed_model_names.length;
        while (i--) {
            const model_name = existed_model_names[i];
            if (! current_model_names.includes(model_name)) {
                delete this.models[model_name];
            }
        }
    }

    serialize () {
        const data = {};

        for (const element of this.target.elements) {
            if (! element.name) continue;

            switch (element.tagName) {
                case "BUTTON": break;
                case "TEXTAREA":
                    data[element.name] = element.value;
                    break;
                case "INPUT":
                    switch (element.type) {
                        case "checkbox":
                            data[element.name] = (
                                element.checked ? element.value : null
                            );
                            break;
                        default:
                            data[element.name] = element.value;
                    }
                    break;
                default:
                    console.warn(`Unimplemented element <${element.tagName}`);
            }
        }

        return data;
    }
}

exports.type = "structure";

exports.controller = class InvisibleJeefoFrom {
    async on_init ($element, component) {
        const form_name     = $element.get_attr("name");
        const jeefo_form    = new JeefoForm();
        const form_renderer = JeefoDOMParser.parse(`{jt}form--renderer`)[0];

        JeefoDOMParser.replace($element.DOM_element, form_renderer);
        if (form_name) this[form_name] = jeefo_form;
        this.on_digest = () => jeefo_form.sync();

        await compile.from_elements([form_renderer], component, false);
        const $form = component.children[0].$element;

        $form.on("render", () => jeefo_form.sync());
        $form.on("submit", event => {
            event.preventDefault();
            if (jeefo_form.is_invalid()) {
                return event.stopImmediatePropagation();
            }
            event.data = jeefo_form.serialize();
        });

        jeefo_form.target = $form.DOM_element;
        $element.after($form);
        $element.remove();

        await component.children[0].initialize();
    }
};
