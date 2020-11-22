/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
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

const {definitions_table} = require("@jeefo/component");

[
    { selector: "form"          , filename: "form"          } ,
    { selector: "form--renderer", filename: "form_renderer" }
].forEach(({selector, filename}) => {
    const filepath = `${__dirname}/components/${filename}`;
    definitions_table.register_component(selector, filepath);
});
