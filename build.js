/****************************************************************************
 * Copyright (C) from 2015 to Present EPAM Systems.
 *
 * This file is part of Indigo-Node binding.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ***************************************************************************/
const cp = require('child_process');
const path = require('path');
const fs = require('fs-extra');

const local = path.join.bind(path, __dirname);

const filterFunc = function(src) {
    if (src.includes('.lib')) {
        return false;
    }
    return true;
};

function buildLib() {
    return new Promise(function(resolve, reject) {
        cp.exec('python ' + local('indigo/build_scripts/indigo-release-libs.py'), function(err, stdout, stderr) {
            if (err) {
                console.error(stderr);
                reject(err, stderr);
            } else {
                resolve();
                console.info(stdout);
            }
        });
    }).then(function() {
        fs.ensureDir(local('/lib/'));
        fs.copy(local('/indigo/api/libs/shared/'), local('/lib/'), {
            filter: filterFunc,
        }, function(err) {
            if (err) return console.error(err);
            console.log('Indigo native libraries successfully built');
        });
    });
};

buildLib();
