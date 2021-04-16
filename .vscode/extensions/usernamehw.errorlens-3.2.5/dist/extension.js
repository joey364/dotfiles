(()=>{var e={705:(e,o,t)=>{var n=t(639).Symbol;e.exports=n},239:(e,o,t)=>{var n=t(705),i=t(607),r=t(333),a=n?n.toStringTag:void 0;e.exports=function(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":a&&a in Object(e)?i(e):r(e)}},561:(e,o,t)=>{var n=t(990),i=/^\s+/;e.exports=function(e){return e?e.slice(0,n(e)+1).replace(i,""):e}},957:e=>{var o="object"==typeof global&&global&&global.Object===Object&&global;e.exports=o},607:(e,o,t)=>{var n=t(705),i=Object.prototype,r=i.hasOwnProperty,a=i.toString,s=n?n.toStringTag:void 0;e.exports=function(e){var o=r.call(e,s),t=e[s];try{e[s]=void 0;var n=!0}catch(e){}var i=a.call(e);return n&&(o?e[s]=t:delete e[s]),i}},333:e=>{var o=Object.prototype.toString;e.exports=function(e){return o.call(e)}},639:(e,o,t)=>{var n=t(957),i="object"==typeof self&&self&&self.Object===Object&&self,r=n||i||Function("return this")();e.exports=r},990:e=>{var o=/\s/;e.exports=function(e){for(var t=e.length;t--&&o.test(e.charAt(t)););return t}},279:(e,o,t)=>{var n=t(218),i=t(771),r=t(841),a=Math.max,s=Math.min;e.exports=function(e,o,t){var l,c,d,u,g,f,h=0,b=!1,p=!1,C=!0;if("function"!=typeof e)throw new TypeError("Expected a function");function x(o){var t=l,n=c;return l=c=void 0,h=o,u=e.apply(n,t)}function v(e){return h=e,g=setTimeout(G,o),b?x(e):u}function m(e){var t=e-f;return void 0===f||t>=o||t<0||p&&e-h>=d}function G(){var e=i();if(m(e))return w(e);g=setTimeout(G,function(e){var t=o-(e-f);return p?s(t,d-(e-h)):t}(e))}function w(e){return g=void 0,C&&l?x(e):(l=c=void 0,u)}function D(){var e=i(),t=m(e);if(l=arguments,c=this,f=e,t){if(void 0===g)return v(f);if(p)return clearTimeout(g),g=setTimeout(G,o),x(f)}return void 0===g&&(g=setTimeout(G,o)),u}return o=r(o)||0,n(t)&&(b=!!t.leading,d=(p="maxWait"in t)?a(r(t.maxWait)||0,o):d,C="trailing"in t?!!t.trailing:C),D.cancel=function(){void 0!==g&&clearTimeout(g),h=0,l=f=c=g=void 0},D.flush=function(){return void 0===g?u:w(i())},D}},218:e=>{e.exports=function(e){var o=typeof e;return null!=e&&("object"==o||"function"==o)}},5:e=>{e.exports=function(e){return null!=e&&"object"==typeof e}},448:(e,o,t)=>{var n=t(239),i=t(5);e.exports=function(e){return"symbol"==typeof e||i(e)&&"[object Symbol]"==n(e)}},771:(e,o,t)=>{var n=t(639);e.exports=function(){return n.Date.now()}},493:(e,o,t)=>{var n=t(279),i=t(218);e.exports=function(e,o,t){var r=!0,a=!0;if("function"!=typeof e)throw new TypeError("Expected a function");return i(t)&&(r="leading"in t?!!t.leading:r,a="trailing"in t?!!t.trailing:a),n(e,o,{leading:r,maxWait:o,trailing:a})}},841:(e,o,t)=>{var n=t(561),i=t(218),r=t(448),a=/^[-+]0x[0-9a-f]+$/i,s=/^0b[01]+$/i,l=/^0o[0-7]+$/i,c=parseInt;e.exports=function(e){if("number"==typeof e)return e;if(r(e))return NaN;if(i(e)){var o="function"==typeof e.valueOf?e.valueOf():e;e=i(o)?o+"":o}if("string"!=typeof e)return 0===e?e:+e;e=n(e);var t=s.test(e);return t||l.test(e)?c(e.slice(2),t?2:8):a.test(e)?NaN:+e}},140:function(e,o,t){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(o,"__esModule",{value:!0}),o.CustomDelay=void 0;const i=n(t(493)),r=t(613),a=t(112),s=n(t(549));class l{constructor(e){this.cachedDiagnostics={},this.updateCachedDiagnosticForUri=e=>{const o=e.toString(),t=s.default.languages.getDiagnostics(e),n=this.cachedDiagnostics[o],i={[o]:{}};for(const e of t)i[o][l.convertDiagnosticToId(e)]=e;if(n){const t=i[o],r=Object.keys(n),a=Object.keys(t);for(const e of r)a.includes(e)||this.removeItem(o,e);for(const n of a)r.includes(n)||this.addItem(e,o,n,t[n])}else this.cachedDiagnostics[o]=i[o],setTimeout((()=>{this.updateDecorationsThrottled(o)}),this.delay)},this.onDiagnosticChange=e=>{if(e.uris.length)for(const o of e.uris)this.updateCachedDiagnosticForUri(o);else for(const e in this.cachedDiagnostics)this.cachedDiagnostics[e]={}},this.removeItem=(e,o)=>{delete this.cachedDiagnostics[e][o],this.updateDecorationsThrottled(e)},this.addItem=(e,o,t,n)=>{setTimeout((()=>{const i=s.default.languages.getDiagnostics(e),r={[o]:{}};for(const e of i)r[o][l.convertDiagnosticToId(e)]=e;t in r[o]&&(this.cachedDiagnostics[o][t]=n,this.updateDecorationsThrottled(o))}),this.delay)},this.updateDecorations=e=>{for(const o of s.default.window.visibleTextEditors)if(o.document.uri.toString()===e){if(a.Global.excludePatterns)for(const e of a.Global.excludePatterns)if(0!==s.default.languages.match(e,o.document))return;r.actuallyUpdateDecorations(o,this.groupByLine(this.cachedDiagnostics[e]))}},this.delay=e,this.updateDecorationsThrottled=i.default(this.updateDecorations,200,{leading:!1,trailing:!0})}static convertDiagnosticToId(e){return`${e.range.start.line}${e.message}`}groupByLine(e){const o=Object.create(null);e:for(const t in e){const n=e[t];for(const e of a.Global.excludeRegexp)if(e.test(n.message))continue e;const i=n.range.start.line;o[i]?o[i].push(n):o[i]=[n]}return o}}o.CustomDelay=l},49:function(e,o,t){"use strict";var n=this&&this.__createBinding||(Object.create?function(e,o,t,n){void 0===n&&(n=t),Object.defineProperty(e,n,{enumerable:!0,get:function(){return o[t]}})}:function(e,o,t,n){void 0===n&&(n=t),e[n]=o[t]}),i=this&&this.__setModuleDefault||(Object.create?function(e,o){Object.defineProperty(e,"default",{enumerable:!0,value:o})}:function(e,o){e.default=o}),r=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var o={};if(null!=e)for(var t in e)"default"!==t&&Object.prototype.hasOwnProperty.call(e,t)&&n(o,e,t);return i(o,e),o};Object.defineProperty(o,"__esModule",{value:!0}),o.registerAllCommands=void 0;const a=t(613),s=t(112),l=r(t(549));o.registerAllCommands=function(e){const o=l.commands.registerCommand(`${s.EXTENSION_NAME}.toggle`,(()=>{s.Global.errorLensEnabled=!s.Global.errorLensEnabled,s.Global.errorLensEnabled?s.updateEverything():s.disposeEverything()})),t=l.commands.registerCommand(`${s.EXTENSION_NAME}.toggleError`,(()=>{s.Global.errorEnabled=!s.Global.errorEnabled,a.updateAllDecorations()})),n=l.commands.registerCommand(`${s.EXTENSION_NAME}.toggleWarning`,(()=>{s.Global.warningEabled=!s.Global.warningEabled,a.updateAllDecorations()})),i=l.commands.registerCommand(`${s.EXTENSION_NAME}.toggleInfo`,(()=>{s.Global.infoEnabled=!s.Global.infoEnabled,a.updateAllDecorations()})),r=l.commands.registerCommand(`${s.EXTENSION_NAME}.toggleHint`,(()=>{s.Global.hintEnabled=!s.Global.hintEnabled,a.updateAllDecorations()})),c=l.commands.registerTextEditorCommand(`${s.EXTENSION_NAME}.copyProblemMessage`,(e=>{const o={};for(const t of l.default.languages.getDiagnostics(e.document.uri)){const e=t.range.start.line;o[e]?o[e].push(t):o[e]=[t]}const t=o[e.selection.active.line];if(!t)return void l.window.showInformationMessage("There's no problem at the active line.");const n=t.sort(((e,o)=>e.severity-o.severity))[0],i=n.source?`[${n.source}] `:"";l.default.env.clipboard.writeText(i+n.message)}));e.subscriptions.push(o,t,n,i,r,c)}},613:function(e,o,t){"use strict";var n=this&&this.__createBinding||(Object.create?function(e,o,t,n){void 0===n&&(n=t),Object.defineProperty(e,n,{enumerable:!0,get:function(){return o[t]}})}:function(e,o,t,n){void 0===n&&(n=t),e[n]=o[t]}),i=this&&this.__setModuleDefault||(Object.create?function(e,o){Object.defineProperty(e,"default",{enumerable:!0,value:o})}:function(e,o){e.default=o}),r=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var o={};if(null!=e)for(var t in e)"default"!==t&&Object.prototype.hasOwnProperty.call(e,t)&&n(o,e,t);return i(o,e),o};Object.defineProperty(o,"__esModule",{value:!0}),o.getAnnotationPrefix=o.getDiagnosticAndGroupByLine=o.updateDecorationsForUri=o.updateAllDecorations=o.actuallyUpdateDecorations=o.setDecorationStyle=void 0;const a=t(112),s=t(394),l=t(158),c=t(593),d=r(t(549));function u(e,o,t){const n=[],i=[],r=[],d=[];let u;if("closestProblem"===a.extensionConfig.followCursor){void 0===t&&(t=e.selection);const n=t.start.line,i=Object.entries(o).sort(((e,o)=>Math.abs(n-Number(e[0]))-Math.abs(n-Number(o[0]))));i.length=a.extensionConfig.followCursorMore+1,u=i.map((e=>e[1][0].range.start.line))}for(const s in o){const l=o[s].sort(((e,o)=>e.severity-o.severity));let g=!1;const f=l[0],b=f.severity;switch(b){case 0:g=a.Global.configErrorEnabled&&a.Global.errorEnabled;break;case 1:g=a.Global.configWarningEnabled&&a.Global.warningEabled;break;case 2:g=a.Global.configInfoEnabled&&a.Global.infoEnabled;break;case 3:g=a.Global.configHintEnabled&&a.Global.hintEnabled}if(g){let o="";a.extensionConfig.addNumberOfDiagnostics&&l.length>1&&(o+=`[1/${l.length}] `),a.extensionConfig.addAnnotationTextPrefixes&&(o+=h(b));let s={};switch(b){case 0:s=a.Global.decorationRenderOptionsError;break;case 1:s=a.Global.decorationRenderOptionsWarning;break;case 2:s=a.Global.decorationRenderOptionsInfo;break;case 3:s=a.Global.decorationRenderOptionsHint}const g={...s,after:{...s.after||{},contentText:a.extensionConfig.messageEnabled?c.truncateString(o+f.message):""}};let p;if("allLines"===a.extensionConfig.followCursor)p=f.range;else{void 0===t&&(t=e.selection);const o=f.range;if("activeLine"===a.extensionConfig.followCursor){const e=t.start.line-a.extensionConfig.followCursorMore,n=t.end.line+a.extensionConfig.followCursorMore;(o.start.line>=e&&o.start.line<=n||o.end.line>=e&&o.end.line<=n)&&(p=o)}else"closestProblem"===a.extensionConfig.followCursor&&(u.includes(o.start.line)||u.includes(o.end.line))&&(p=o);if(!p)continue}const C={range:p,renderOptions:g};switch(b){case 0:n.push(C);break;case 1:i.push(C);break;case 2:r.push(C);break;case 3:d.push(C)}}}e.setDecorations(a.Global.decorationTypeError,n),e.setDecorations(a.Global.decorationTypeWarning,i),e.setDecorations(a.Global.decorationTypeInfo,r),e.setDecorations(a.Global.decorationTypeHint,d),a.Global.renderGutterIconsAsSeparateDecoration&&s.actuallyUpdateGutterDecorations(e,o),a.extensionConfig.statusBarMessageEnabled&&l.updateStatusBarMessage(e,o)}function g(e,o,t){if(void 0===o&&(o=d.window.activeTextEditor),o&&o.document.uri.fsPath){if(a.Global.excludePatterns)for(const e of a.Global.excludePatterns)if(0!==d.default.languages.match(e,o.document))return;u(o,f(e),t)}}function f(e){const o=Object.create(null),t=d.default.languages.getDiagnostics(e);e:for(const e of t){for(const o of a.Global.excludeRegexp)if(o.test(e.message))continue e;const t=e.range.start.line;o[t]?o[t].push(e):o[t]=[e]}return o}function h(e){var o;return null!==(o=a.extensionConfig.annotationPrefix[e])&&void 0!==o?o:""}o.setDecorationStyle=function(){let e;a.extensionConfig.gutterIconsEnabled&&(e=s.getGutterStyles(a.Global.extensionContext),a.Global.renderGutterIconsAsSeparateDecoration&&(a.Global.decorationTypeGutterError=d.window.createTextEditorDecorationType({gutterIconPath:e.errorIconPath,gutterIconSize:a.extensionConfig.gutterIconSize,light:{gutterIconPath:e.errorIconPathLight,gutterIconSize:a.extensionConfig.gutterIconSize}}),a.Global.decorationTypeGutterWarning=d.window.createTextEditorDecorationType({gutterIconPath:e.warningIconPath,gutterIconSize:a.extensionConfig.gutterIconSize,light:{gutterIconPath:e.warningIconPathLight,gutterIconSize:a.extensionConfig.gutterIconSize}}),a.Global.decorationTypeGutterInfo=d.window.createTextEditorDecorationType({gutterIconPath:e.infoIconPath,gutterIconSize:a.extensionConfig.gutterIconSize,light:{gutterIconPath:e.infoIconPathLight,gutterIconSize:a.extensionConfig.gutterIconSize}}),e=void 0));const o=new d.default.ThemeColor("errorLens.errorBackground"),t=new d.default.ThemeColor("errorLens.errorBackgroundLight"),n=new d.default.ThemeColor("errorLens.errorForeground"),i=new d.default.ThemeColor("errorLens.errorForegroundLight"),r=new d.default.ThemeColor("errorLens.errorMessageBackground"),l=new d.default.ThemeColor("errorLens.warningBackground"),c=new d.default.ThemeColor("errorLens.warningBackgroundLight"),u=new d.default.ThemeColor("errorLens.warningForeground"),g=new d.default.ThemeColor("errorLens.warningForegroundLight"),f=new d.default.ThemeColor("errorLens.warningMessageBackground"),h=new d.default.ThemeColor("errorLens.infoBackground"),b=new d.default.ThemeColor("errorLens.infoBackgroundLight"),p=new d.default.ThemeColor("errorLens.infoForeground"),C=new d.default.ThemeColor("errorLens.infoForegroundLight"),x=new d.default.ThemeColor("errorLens.infoMessageBackground"),v=new d.default.ThemeColor("errorLens.hintBackground"),m=new d.default.ThemeColor("errorLens.hintBackgroundLight"),G=new d.default.ThemeColor("errorLens.hintForeground"),w=new d.default.ThemeColor("errorLens.hintForegroundLight"),D=new d.default.ThemeColor("errorLens.hintMessageBackground"),I=new d.default.ThemeColor("errorLens.statusBarErrorForeground"),y=new d.default.ThemeColor("errorLens.statusBarWarningForeground"),E=new d.default.ThemeColor("errorLens.statusBarInfoForeground"),T=new d.default.ThemeColor("errorLens.statusBarHintForeground"),P=/^\d+$/,S=a.extensionConfig.fontFamily?`font-family:${a.extensionConfig.fontFamily}`:"",O=a.extensionConfig.fontSize?`font-size:${P.test(a.extensionConfig.fontSize)?`${a.extensionConfig.fontSize}px`:a.extensionConfig.fontSize}`:"",L=a.extensionConfig.padding?`padding:${P.test(a.extensionConfig.padding)?`${a.extensionConfig.padding}px`:a.extensionConfig.padding}`:"",A=`margin-left:${P.test(a.extensionConfig.margin)?`${a.extensionConfig.margin}px`:a.extensionConfig.margin}`,k=`border-radius: ${a.extensionConfig.borderRadius||"0"}`,_=a.extensionConfig.scrollbarHackEnabled?"position:absolute":"",M={fontStyle:a.extensionConfig.fontStyleItalic?"italic":"normal",fontWeight:a.extensionConfig.fontWeight,textDecoration:`none;${S};${O};${L};${A};${k};${_}`};a.Global.decorationRenderOptionsError={backgroundColor:o,gutterIconSize:a.extensionConfig.gutterIconSize,gutterIconPath:null==e?void 0:e.errorIconPath,after:{...M,color:n,backgroundColor:r},light:{backgroundColor:t,gutterIconSize:a.extensionConfig.gutterIconSize,gutterIconPath:null==e?void 0:e.errorIconPathLight,after:{color:i}},isWholeLine:!0},a.Global.decorationRenderOptionsWarning={backgroundColor:l,gutterIconSize:a.extensionConfig.gutterIconSize,gutterIconPath:null==e?void 0:e.warningIconPath,after:{...M,color:u,backgroundColor:f},light:{backgroundColor:c,gutterIconSize:a.extensionConfig.gutterIconSize,gutterIconPath:null==e?void 0:e.warningIconPathLight,after:{color:g}},isWholeLine:!0},a.Global.decorationRenderOptionsInfo={backgroundColor:h,gutterIconSize:a.extensionConfig.gutterIconSize,gutterIconPath:null==e?void 0:e.infoIconPath,after:{...M,color:p,backgroundColor:x},light:{backgroundColor:b,gutterIconSize:a.extensionConfig.gutterIconSize,gutterIconPath:null==e?void 0:e.infoIconPathLight,after:{color:C}},isWholeLine:!0},a.Global.decorationRenderOptionsHint={backgroundColor:v,after:{...M,color:G,backgroundColor:D},light:{backgroundColor:m,after:{color:w}},isWholeLine:!0},a.extensionConfig.messageEnabled||(a.Global.decorationRenderOptionsError.backgroundColor=void 0,a.Global.decorationRenderOptionsError.after=void 0,a.Global.decorationRenderOptionsError.light.backgroundColor=void 0,a.Global.decorationRenderOptionsError.light.after=void 0,a.Global.decorationRenderOptionsWarning.backgroundColor=void 0,a.Global.decorationRenderOptionsWarning.after=void 0,a.Global.decorationRenderOptionsWarning.light.backgroundColor=void 0,a.Global.decorationRenderOptionsWarning.light.after=void 0,a.Global.decorationRenderOptionsInfo.backgroundColor=void 0,a.Global.decorationRenderOptionsInfo.after=void 0,a.Global.decorationRenderOptionsInfo.light.backgroundColor=void 0,a.Global.decorationRenderOptionsInfo.light.after=void 0,a.Global.decorationRenderOptionsHint.backgroundColor=void 0,a.Global.decorationRenderOptionsHint.after=void 0,a.Global.decorationRenderOptionsHint.light.backgroundColor=void 0,a.Global.decorationRenderOptionsHint.light.after=void 0),a.Global.decorationTypeError=d.window.createTextEditorDecorationType(a.Global.decorationRenderOptionsError),a.Global.decorationTypeWarning=d.window.createTextEditorDecorationType(a.Global.decorationRenderOptionsWarning),a.Global.decorationTypeInfo=d.window.createTextEditorDecorationType(a.Global.decorationRenderOptionsInfo),a.Global.decorationTypeHint=d.window.createTextEditorDecorationType(a.Global.decorationRenderOptionsHint),a.extensionConfig.statusBarMessageEnabled&&(a.Global.statusBarColors=[I,y,E,T])},o.actuallyUpdateDecorations=u,o.updateAllDecorations=function(){for(const e of d.window.visibleTextEditors)g(e.document.uri,e)},o.updateDecorationsForUri=g,o.getDiagnosticAndGroupByLine=f,o.getAnnotationPrefix=h},977:function(e,o,t){"use strict";var n=this&&this.__createBinding||(Object.create?function(e,o,t,n){void 0===n&&(n=t),Object.defineProperty(e,n,{enumerable:!0,get:function(){return o[t]}})}:function(e,o,t,n){void 0===n&&(n=t),e[n]=o[t]}),i=this&&this.__setModuleDefault||(Object.create?function(e,o){Object.defineProperty(e,"default",{enumerable:!0,value:o})}:function(e,o){e.default=o}),r=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var o={};if(null!=e)for(var t in e)"default"!==t&&Object.prototype.hasOwnProperty.call(e,t)&&n(o,e,t);return i(o,e),o};Object.defineProperty(o,"__esModule",{value:!0}),o.updateOnSaveListener=o.updateCursorChangeListener=o.updateChangeDiagnosticListener=o.updateChangeVisibleTextEditorsListener=o.updateChangedActiveTextEditorListener=void 0;const a=t(140),s=t(613),l=t(112),c=r(t(549));o.updateChangedActiveTextEditorListener=function(){l.Global.onDidChangeActiveTextEditor&&l.Global.onDidChangeActiveTextEditor.dispose(),l.Global.onDidChangeActiveTextEditor=c.window.onDidChangeActiveTextEditor((e=>{l.extensionConfig.onSave&&(l.Global.lastSavedTimestamp=Date.now()),e&&s.updateDecorationsForUri(e.document.uri,e)}))},o.updateChangeVisibleTextEditorsListener=function(){l.Global.onDidChangeVisibleTextEditors&&l.Global.onDidChangeVisibleTextEditors.dispose(),l.Global.onDidChangeVisibleTextEditors=c.window.onDidChangeVisibleTextEditors(s.updateAllDecorations)},o.updateChangeDiagnosticListener=function(){function e(e){for(const o of e.uris)for(const e of c.window.visibleTextEditors)o.fsPath===e.document.uri.fsPath&&s.updateDecorationsForUri(o,e)}l.Global.onDidChangeDiagnosticsDisposable&&l.Global.onDidChangeDiagnosticsDisposable.dispose(),l.extensionConfig.onSave?l.Global.onDidChangeDiagnosticsDisposable=c.default.languages.onDidChangeDiagnostics((o=>{Date.now()-l.Global.lastSavedTimestamp<l.extensionConfig.onSaveTimeout&&e(o)})):"number"==typeof l.extensionConfig.delay&&l.extensionConfig.delay>0?(l.Global.customDelay=new a.CustomDelay(l.extensionConfig.delay),l.Global.onDidChangeDiagnosticsDisposable=c.default.languages.onDidChangeDiagnostics(l.Global.customDelay.onDiagnosticChange)):l.Global.onDidChangeDiagnosticsDisposable=c.default.languages.onDidChangeDiagnostics(e)},o.updateCursorChangeListener=function(){if(l.Global.onDidCursorChangeDisposable&&l.Global.onDidCursorChangeDisposable.dispose(),"activeLine"===l.extensionConfig.followCursor||"closestProblem"===l.extensionConfig.followCursor||l.extensionConfig.statusBarMessageEnabled){let e=999999;l.Global.onDidCursorChangeDisposable=c.window.onDidChangeTextEditorSelection((o=>{const t=o.selections[0];1===o.selections.length&&t.isEmpty&&e!==t.active.line&&(s.updateDecorationsForUri(o.textEditor.document.uri,o.textEditor,t),e=o.selections[0].active.line)}))}},o.updateOnSaveListener=function(){l.Global.onDidSaveTextDocumentDisposable&&l.Global.onDidSaveTextDocumentDisposable.dispose(),l.extensionConfig.onSave&&(l.Global.onDidSaveTextDocumentDisposable=c.workspace.onWillSaveTextDocument((e=>{e.reason===c.TextDocumentSaveReason.Manual&&(setTimeout((()=>{s.updateDecorationsForUri(e.document.uri)}),200),l.Global.lastSavedTimestamp=Date.now())})))}},112:(e,o,t)=>{"use strict";Object.defineProperty(o,"__esModule",{value:!0}),o.deactivate=o.disposeEverything=o.updateEverything=o.activate=o.Global=o.extensionConfig=o.EXTENSION_NAME=void 0;const n=t(49),i=t(613),r=t(977),a=t(158),s=t(549);o.EXTENSION_NAME="errorLens";class l{}function c(){!function(){l.excludeRegexp=[];for(const e of o.extensionConfig.exclude)"string"==typeof e&&l.excludeRegexp.push(new RegExp(e,"i"));Array.isArray(o.extensionConfig.excludePatterns)&&0!==o.extensionConfig.excludePatterns.length?l.excludePatterns=o.extensionConfig.excludePatterns.map((e=>({pattern:e}))):l.excludePatterns=void 0}(),l.renderGutterIconsAsSeparateDecoration=o.extensionConfig.gutterIconsEnabled&&o.extensionConfig.gutterIconsFollowCursorOverride&&"allLines"!==o.extensionConfig.followCursor,i.setDecorationStyle(),a.createStatusBarItem(),l.configErrorEnabled=o.extensionConfig.enabledDiagnosticLevels.includes("error"),l.configWarningEnabled=o.extensionConfig.enabledDiagnosticLevels.includes("warning"),l.configInfoEnabled=o.extensionConfig.enabledDiagnosticLevels.includes("info"),l.configHintEnabled=o.extensionConfig.enabledDiagnosticLevels.includes("hint"),i.updateAllDecorations(),r.updateChangeDiagnosticListener(),r.updateChangeVisibleTextEditorsListener(),r.updateOnSaveListener(),r.updateCursorChangeListener(),r.updateChangedActiveTextEditorListener()}function d(){l.decorationTypeError&&l.decorationTypeError.dispose(),l.decorationTypeWarning&&l.decorationTypeWarning.dispose(),l.decorationTypeInfo&&l.decorationTypeInfo.dispose(),l.decorationTypeHint&&l.decorationTypeHint.dispose(),l.decorationTypeGutterError&&l.decorationTypeGutterError.dispose(),l.decorationTypeGutterWarning&&l.decorationTypeGutterWarning.dispose(),l.decorationTypeGutterInfo&&l.decorationTypeGutterInfo.dispose(),l.onDidChangeVisibleTextEditors&&l.onDidChangeVisibleTextEditors.dispose(),l.onDidChangeDiagnosticsDisposable&&l.onDidChangeDiagnosticsDisposable.dispose(),l.onDidChangeActiveTextEditor&&l.onDidChangeActiveTextEditor.dispose(),l.onDidSaveTextDocumentDisposable&&l.onDidSaveTextDocumentDisposable.dispose(),l.onDidCursorChangeDisposable&&l.onDidCursorChangeDisposable.dispose(),l.statusBarItem&&l.statusBarItem.dispose()}o.Global=l,l.errorLensEnabled=!0,l.errorEnabled=!0,l.warningEabled=!0,l.infoEnabled=!0,l.hintEnabled=!0,l.configErrorEnabled=!0,l.configWarningEnabled=!0,l.configInfoEnabled=!0,l.configHintEnabled=!0,l.statusBarColors=[],l.excludeRegexp=[],l.excludePatterns=void 0,l.lastSavedTimestamp=Date.now()+2e3,o.activate=function(e){function t(){o.extensionConfig=s.workspace.getConfiguration(o.EXTENSION_NAME),d(),c()}l.extensionContext=e,t(),n.registerAllCommands(e),e.subscriptions.push(s.workspace.onDidChangeConfiguration((function(e){e.affectsConfiguration(o.EXTENSION_NAME)&&t()})))},o.updateEverything=c,o.disposeEverything=d,o.deactivate=function(){}},394:function(e,o,t){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(o,"__esModule",{value:!0}),o.actuallyUpdateGutterDecorations=o.getGutterStyles=void 0;const i=t(747),r=n(t(622)),a=t(112);o.getGutterStyles=function(e){const o=Object.create(null);if(o.iconSet=a.extensionConfig.gutterIconSet,"borderless"!==a.extensionConfig.gutterIconSet&&"default"!==a.extensionConfig.gutterIconSet&&"circle"!==a.extensionConfig.gutterIconSet&&"defaultOutline"!==a.extensionConfig.gutterIconSet&&(o.iconSet="default"),"circle"===o.iconSet&&function(e){i.promises.writeFile(e.asAbsolutePath("./img/circle/error-dark.svg"),`<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30"><circle cx="15" cy="15" r="9" fill="${a.extensionConfig.errorGutterIconColor}"/></svg>`),i.promises.writeFile(e.asAbsolutePath("./img/circle/error-light.svg"),`<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30"><circle cx="15" cy="15" r="9" fill="${a.extensionConfig.light.errorGutterIconColor||a.extensionConfig.errorGutterIconColor}"/></svg>`),i.promises.writeFile(e.asAbsolutePath("./img/circle/warning-dark.svg"),`<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30"><circle cx="15" cy="15" r="9" fill="${a.extensionConfig.warningGutterIconColor}"/></svg>`),i.promises.writeFile(e.asAbsolutePath("./img/circle/warning-light.svg"),`<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30"><circle cx="15" cy="15" r="9" fill="${a.extensionConfig.light.warningGutterIconColor||a.extensionConfig.warningGutterIconColor}"/></svg>`),i.promises.writeFile(e.asAbsolutePath("./img/circle/info-dark.svg"),`<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30"><circle cx="15" cy="15" r="9" fill="${a.extensionConfig.infoGutterIconColor}"/></svg>`),i.promises.writeFile(e.asAbsolutePath("./img/circle/info-light.svg"),`<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30"><circle cx="15" cy="15" r="9" fill="${a.extensionConfig.light.infoGutterIconColor||a.extensionConfig.infoGutterIconColor}"/></svg>`)}(e),a.extensionConfig.errorGutterIconPath){const e=r.default.basename(a.extensionConfig.errorGutterIconPath),t=r.default.join(a.Global.extensionContext.asAbsolutePath("./img"),e);i.promises.copyFile(a.extensionConfig.errorGutterIconPath,t),o.errorIconPath=t}else o.errorIconPath=e.asAbsolutePath(`./img/${o.iconSet}/error-dark.svg`);if(a.extensionConfig.light.errorGutterIconPath){const e=r.default.basename(a.extensionConfig.light.errorGutterIconPath),t=r.default.join(a.Global.extensionContext.asAbsolutePath("./img"),e);i.promises.copyFile(a.extensionConfig.light.errorGutterIconPath,t),o.errorIconPathLight=t}else o.errorIconPathLight=e.asAbsolutePath(`./img/${o.iconSet}/error-light.svg`);if(a.extensionConfig.warningGutterIconPath){const e=r.default.basename(a.extensionConfig.warningGutterIconPath),t=r.default.join(a.Global.extensionContext.asAbsolutePath("./img"),e);i.promises.copyFile(a.extensionConfig.warningGutterIconPath,t),o.warningIconPath=t}else o.warningIconPath=e.asAbsolutePath(`./img/${o.iconSet}/warning-dark.svg`);if(a.extensionConfig.light.warningGutterIconPath){const e=r.default.basename(a.extensionConfig.light.warningGutterIconPath),t=r.default.join(a.Global.extensionContext.asAbsolutePath("./img"),e);i.promises.copyFile(a.extensionConfig.light.warningGutterIconPath,t),o.warningIconPathLight=t}else o.warningIconPathLight=e.asAbsolutePath(`./img/${o.iconSet}/warning-light.svg`);if(a.extensionConfig.infoGutterIconPath){const e=r.default.basename(a.extensionConfig.infoGutterIconPath),t=r.default.join(a.Global.extensionContext.asAbsolutePath("./img"),e);i.promises.copyFile(a.extensionConfig.infoGutterIconPath,t),o.infoIconPath=t}else o.infoIconPath=e.asAbsolutePath(`./img/${o.iconSet}/info-dark.svg`);if(a.extensionConfig.light.infoGutterIconPath){const e=r.default.basename(a.extensionConfig.light.infoGutterIconPath),t=r.default.join(a.Global.extensionContext.asAbsolutePath("./img"),e);i.promises.copyFile(a.extensionConfig.light.infoGutterIconPath,t),o.infoIconPathLight=t}else o.infoIconPathLight=e.asAbsolutePath(`./img/${o.iconSet}/info-light.svg`);return o},o.actuallyUpdateGutterDecorations=function(e,o){const t=[],n=[],i=[];for(const e in o){let r=!1;const s=o[e].sort(((e,o)=>e.severity-o.severity))[0],l=s.severity;switch(l){case 0:r=a.Global.configErrorEnabled&&a.Global.errorEnabled;break;case 1:r=a.Global.configWarningEnabled&&a.Global.warningEabled;break;case 2:r=a.Global.configInfoEnabled&&a.Global.infoEnabled;break;case 3:r=a.Global.configHintEnabled&&a.Global.hintEnabled}if(r){const e={range:s.range};switch(l){case 0:t.push(e);break;case 1:n.push(e);break;case 2:i.push(e)}}}e.setDecorations(a.Global.decorationTypeGutterError,t),e.setDecorations(a.Global.decorationTypeGutterWarning,n),e.setDecorations(a.Global.decorationTypeGutterInfo,i)}},158:(e,o,t)=>{"use strict";Object.defineProperty(o,"__esModule",{value:!0}),o.updateStatusBarMessage=o.createStatusBarItem=void 0;const n=t(613),i=t(112),r=t(549);o.createStatusBarItem=function(){i.extensionConfig.statusBarMessageEnabled&&(i.Global.statusBarItem=r.window.createStatusBarItem(void 0,-9999),i.Global.statusBarItem.show())},o.updateStatusBarMessage=function(e,o){const t=Object.keys(o);if(0===t.length)return void(i.Global.statusBarItem.text="");const r=e.selection.active.line,a=o[t.map(Number).sort(((e,o)=>Math.abs(r-e)-Math.abs(r-o)))[0]][0];let s="";i.extensionConfig.addAnnotationTextPrefixes&&(s=n.getAnnotationPrefix(a.severity));const l=`${s}${a.message}`;i.extensionConfig.statusBarColorsEnabled&&(i.Global.statusBarItem.color=i.Global.statusBarColors[a.severity]),"closestProblem"===i.extensionConfig.statusBarMessageType?i.Global.statusBarItem.text=l:"activeLine"===i.extensionConfig.statusBarMessageType&&(a.range.start.line===r||a.range.end.line===r?i.Global.statusBarItem.text=l:i.Global.statusBarItem.text="")}},593:(e,o)=>{"use strict";Object.defineProperty(o,"__esModule",{value:!0}),o.truncateString=void 0,o.truncateString=function(e){return e.length>500?`${e.slice(0,500)}…`:e}},747:e=>{"use strict";e.exports=require("fs")},622:e=>{"use strict";e.exports=require("path")},549:e=>{"use strict";e.exports=require("vscode")}},o={},t=function t(n){var i=o[n];if(void 0!==i)return i.exports;var r=o[n]={exports:{}};return e[n].call(r.exports,r,r.exports,t),r.exports}(112);module.exports=t})();
//# sourceMappingURL=extension.js.map