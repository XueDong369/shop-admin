/**
 * Created by Don on 2017/4/23.
 */

'use strict';

/**
 * Module dependencies.
 */

require('dotenv').load();

var _ = require('lodash'),
    defaultAssets = require('./config/assets/default'),
    testAssets = require('./config/assets/test'),
    testConfig = require('./config/env/test'),
    fs = require('fs'),
    path = require('path');