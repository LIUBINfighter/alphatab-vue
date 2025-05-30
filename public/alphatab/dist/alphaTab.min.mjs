/*!
 * alphaTab v1.5.0 (, build 18)
 *
 * Copyright © 2025, Daniel Kuschny and Contributors, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Integrated Libraries:
 *
 * Library: TinySoundFont
 * License: MIT
 * Copyright: Copyright (C) 2017, 2018 Bernhard Schelling
 * URL: https://github.com/schellingb/TinySoundFont
 * Purpose: SoundFont loading and Audio Synthesis
 *
 * Library: SFZero
 * License: MIT
 * Copyright: Copyright (C) 2012 Steve Folta ()
 * URL: https://github.com/stevefolta/SFZero
 * Purpose: TinySoundFont is based on SFZEro
 *
 * Library: Haxe Standard Library
 * License: MIT
 * Copyright: Copyright (C)2005-2025 Haxe Foundation
 * URL: https://github.com/HaxeFoundation/haxe/tree/development/std
 * Purpose: XML Parser & Zip Inflate Algorithm
 *
 * Library: SharpZipLib
 * License: MIT
 * Copyright: Copyright © 2000-2018 SharpZipLib Contributors
 * URL: https://github.com/icsharpcode/SharpZipLib
 * Purpose: Zip Deflate Algorithm for writing compressed Zips
 *
 * Library: NVorbis
 * License: MIT
 * Copyright: Copyright (c) 2020 Andrew Ward
 * URL: https://github.com/NVorbis/NVorbis
 * Purpose: Vorbis Stream Decoding
 *
 * Library: libvorbis
 * License: BSD-3-Clause
 * Copyright: Copyright (c) 2002-2020 Xiph.org Foundation
 * URL: https://github.com/xiph/vorbis
 * Purpose: NVorbis adopted some code from libvorbis.
 *
 * @preserve
 * @license
 */
void 0===Symbol.dispose&&(Symbol.dispose=Symbol("Symbol.dispose"));import*as e from"./alphaTab.core.min.mjs";export*from"./alphaTab.core.min.mjs";e.Environment.isRunningInWorker?e.Environment.initializeWorker():e.Environment.isRunningInAudioWorklet?e.Environment.initializeAudioWorklet():e.Environment.initializeMain((r=>{if(e.Environment.webPlatform===e.WebPlatform.NodeJs)throw new e.AlphaTabError(e.AlphaTabErrorType.General,"Workers not yet supported in Node.js");if(e.Environment.webPlatform===e.WebPlatform.BrowserModule||e.Environment.isWebPackBundled||e.Environment.isViteBundled){e.Logger.debug("AlphaTab","Creating webworker");try{return new e.Environment.alphaTabWorker(new e.Environment.alphaTabUrl("./alphaTab.worker.min.mjs",import.meta.url),{type:"module"})}catch(r){e.Logger.debug("AlphaTab","ESM webworker construction with direct URL failed",r)}let o="";try{o=new e.Environment.alphaTabUrl("./alphaTab.worker.min.mjs",import.meta.url);const r=`import ${JSON.stringify(o)}`,t=new Blob([r],{type:"application/javascript"});return new Worker(URL.createObjectURL(t),{type:"module"})}catch(r){e.Logger.debug("AlphaTab","ESM webworker construction with blob import failed",o,r)}try{if(!r.core.scriptFile)throw new Error("Could not detect alphaTab script file");o=r.core.scriptFile;const e=`import ${JSON.stringify(r.core.scriptFile)}`,t=new Blob([e],{type:"application/javascript"});return new Worker(URL.createObjectURL(t),{type:"module"})}catch(o){e.Logger.debug("AlphaTab","ESM webworker construction with blob import failed",r.core.scriptFile,o)}}if(!r.core.scriptFile)throw new e.AlphaTabError(e.AlphaTabErrorType.General,"Could not detect alphaTab script file, cannot initialize renderer");try{e.Logger.debug("AlphaTab","Creating Blob worker");const o=`importScripts('${r.core.scriptFile}')`,t=new Blob([o],{type:"application/javascript"});return new Worker(URL.createObjectURL(t))}catch(o){return e.Logger.warning("Rendering","Could not create inline worker, fallback to normal worker"),new Worker(r.core.scriptFile)}}),((r,o)=>{if(e.Environment.webPlatform===e.WebPlatform.NodeJs)throw new e.AlphaTabError(e.AlphaTabErrorType.General,"Audio Worklets not yet supported in Node.js");if(e.Environment.webPlatform===e.WebPlatform.BrowserModule||e.Environment.isWebPackBundled||e.Environment.isViteBundled){e.Logger.debug("AlphaTab","Creating Module worklet");return r.audioWorklet.addModule(new e.Environment.alphaTabUrl("./alphaTab.worklet.min.mjs",import.meta.url))}return e.Logger.debug("AlphaTab","Creating Script worklet"),r.audioWorklet.addModule(o.core.scriptFile)}));
