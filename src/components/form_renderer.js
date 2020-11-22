/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : form_renderer.js
* Created at  : 2020-10-31
* Updated at  : 2020-10-31
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

const JeefoDOMParser = require("@jeefo/jqlite/dom_parser");

exports.template = element => {
    const form = JeefoDOMParser.parse(`{jt}form`)[0];
    return JeefoDOMParser.replace(element, form);
};
