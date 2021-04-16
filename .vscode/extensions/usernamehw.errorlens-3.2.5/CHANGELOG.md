## 3.2.5 `12 Mar 2021`

- 🐛 Fix custom gutter icons stopped working
- 🐛 Fix when delay is set `excludePatterns` is ignored

## 3.2.4 `13 Nov 2020`

- ✨ Use "ui" extension kind to support remote [PR [#63](https://github.com/usernamehw/vscode-error-lens/issues/63)](https://github.com/usernamehw/vscode-error-lens/pull/63) by [@Daniel15](https://github.com/Daniel15)

## 3.2.3 `03 Oct 2020`

- ✨ Add setting to hide inline message `errorLens.messageEnabled`

## 3.2.2 `28 Sep 2020`

- ✨ Add separate colors for status bar items

## 3.2.1 `23 Aug 2020`

- ✨ Add option to prevent horizontal scrollbar appearing for decorations with `errorLens.scrollbarHackEnabled`
- ✨ `onSave` should work with vscode autosave

## 3.2.0 `08 Aug 2020`

- ✨ Exclude files by glob with `excludePatterns` setting
- ✨ Use `onStartupFinished` activation event
- 🔨 Refactor

## 3.1.1 `20 Apr 2020`

- 🐛 Fix wrong type for a setting that generated warning [PR [#49](https://github.com/usernamehw/vscode-error-lens/issues/49)](https://github.com/usernamehw/vscode-error-lens/pull/49) by [@Luxcium](https://github.com/Luxcium)

## 3.1.0 `01 Apr 2020`

- ✨ Add an option to render gutter icons separately from main decoration [#45 Show only gutter icons unless cursor is on line with error](https://github.com/usernamehw/vscode-error-lens/issues/45)
- ✨ Change status bar item to show message for the active line
- ✨ Add an option to use decoration colors for status bar message (`statusBarColorsEnabled`)

## 3.0.0 `19 Feb 2020`

- 💥 Deprecate and delete `errorLens.useColorContributions`
- 💥 Deprecate and delete `errorLens.editorActiveTabDecorationEnabled` (Move to a separate extension)
- ✨ `delay` setting should only work for a new diagnostics (Fixed diagnostics decoration should be removed immediately) [#39](https://github.com/usernamehw/vscode-error-lens/issues/39)
- ✨ Show closest to cursor diagnostic in status bar `errorLens.statusBarMessageEnabled`
- ✨ Expose `addNumberOfDiagnostics` as a setting
- ✨ Expose `padding` as a setting
- ✨ Expose `borderRadius` as a setting
- ✨ Update `margin` setting to use `ch` units instead of `px`

## 2.9.0 `09 Jan 2020`

- 💥 Set `errorLens.useColorContributions` to **`true`**
- ✨ Create command to transfer colors from `Settings` to `Colors`: **Convert colors from Settings to Colors.**. Note: colors only for light themes are not supported yet.
- 💄 Remove number of diagnostics from annotation prefix.

## 2.8.1 `29 Nov 2019`

- 🐛 Fix missing message prefix when there are multiple diagnostics on the line [Issue [#33](https://github.com/usernamehw/vscode-error-lens/issues/33)](https://github.com/usernamehw/vscode-error-lens/issues/33)

## 2.8.0 `26 Nov 2019`

- 💥 Delete `clearDecorations` option
- ✨ Possible future breaking change: Using color contributions instead of settings values for colors. Now hidden behind a config `errorLens.useColorContributions`
- ✨ Specify custom message prefix
- 🐛 Fix broken `circle` gutter icon set
- 🔨 Update version to **1.40.0**

## 2.7.2 `12 Oct 2019`

- 🐛 Prevent `:after` decoration clashing with other extensions [PR [#28](https://github.com/usernamehw/vscode-error-lens/issues/28)](https://github.com/usernamehw/vscode-error-lens/pull/28) by [@bmalehorn](https://github.com/bmalehorn)

## 2.7.1 `14 Sep 2019`

- 💥 Deprecate `exclude` setting using **source** and **code** and leave only `exclude` using problem message.
- ✨ Set some padding, only when one of message colors is set (`errorLens.errorMessageBackground` / ...)
- 🔨 Allow omitting CSS units for `margin` & `fontSize` (`px` will be used)

## 2.7.0 `20 Aug 2019`

- 🐛 Fix not updated decorations while dragging tabs
- 🐛 Fix not working on remote
- ✨ New gutter icon set `defaultOutline`
- ✨ Ability to change message background on top of the entire line background: `errorLens.errorMessageBackground` / ...

## 2.6.0 `15 Aug 2019`

- ✨ Ability to show only closest to the cursor problems (`errorLens.followCursor`).
- ✨ Ability to change active editor tab title background when file has Errors/Warnings (`errorLens.editorActiveTabDecorationEnabled`)

## 2.5.0 `11 Jul 2019`

- 💥 Deprecate enum setting `errorLens.fontStyle` in favor of boolean `errorLens.fontStyleItalic`
- 💥 Change default settings `errorLens.addAnnotationTextPrefixes` and `errorLens.margin`
- 🐛 Error decoration must always trump Warning etc: `ERROR` => `WARNING` => `INFO` => `HINT`
- ✨ New command to copy problem at active line number `errorLens.copyProblemMessage`

## 2.4.1 `11 Jul 2019`

- 🐛 Decorations stopped working in `settings.json` in **1.37**

## 2.4.0 `06 Jul 2019`

- ✨ New gutter icon set **`circle`**
- 💥 Change default colors for `INFO` & `HINT` diagnostics
- ✨ Any unset `light` color/path should default to ordinary one.
- ✨ Add commands to temporarily disable one level of diagnostic [Fixes [#10](https://github.com/usernamehw/vscode-error-lens/issues/10)](https://github.com/usernamehw/vscode-error-lens/issues/10)
- 💥 Deprecate: `errorLens.errorGutterIconPathLight`, `errorLens.warningGutterIconPathLight` and `errorLens.infoGutterIconPathLight`. They were moved into `errorLens.light`.

## 2.3.4 `22 Jun 2019`

- ✨ Add an option to choose if the decorations should be cleared when you start typing (only when `delay` is set) – `errorLens.clearDecorations`.

## 2.3.3 `09 Jun 2019`

- 🔨 Update dependencies

## 2.3.2 `07 Jun 2019`

- ✨ Set custom gutter icons (Using absolute file path).

## 2.3.1 `02 Jun 2019`

- ✨ Configure gutter icon size with: `errorLens.gutterIconSize`
- ✨ Configure gutter icons to be borderless with `errorLens.gutterIconSet`: [PR [#6](https://github.com/usernamehw/vscode-error-lens/issues/6)](https://github.com/usernamehw/vscode-error-lens/pull/6) by [@karlsander](https://github.com/karlsander)

## 2.3.0 `01 Jun 2019`

- ✨ Add an option to render gutter icons `errorLens.gutterIconsEnabled`
- 🔨 Increase limit for long messages truncation from 300 to 500 symbols

## 2.2.3 `25 May 2019`

- ✨ Draw decorations in `Untitled` files
- 📚 Add an example of `exclude` setting to README
- 🔨 Move `exclude` RegExp creation out of the loop

## 2.2.2 `24 May 2019`

- 🐛 Different fix for decorations not rendered the first time with `errorLens.onSave`

## 2.2.1 `24 May 2019`

- 🐛 Fix failed to update decorations (on save) when language diagnostics haven't changed

## 2.2.0 `23 May 2019`

- ✨ Update decorations only on document save with `errorLens.onSave`

## 2.1.1 `22 May 2019`

- ✨ Change font family with `errorLens.fontFamily`

## 2.1.0 `21 May 2019`

- ✨ Customize delay before showing problems with `errorLens.delay`

## 2.0.4 `19 May 2019`

- ✨ Allow to set colors for light themes separately with the setting `errorLens.light`

## 2.0.3 `19 May 2019`

- 🐛 Fix disposing decorations when settings change from Settings GUI

## 2.0.2 `18 May 2019`

- ✨ Customize font size of messages with `errorLens.fontSize`
- 🐛 Toggle ErrorLens command should update decorations for all visible editors

## 2.0.1 `18 May 2019`

- ✨ Update decorations for all visible editors (split/grid)
- 🐛 Additionally dispose decorations when settings change

## 2.0.0 `18 May 2019`

- ✨ Support excluding some of the problems with the setting `errorLens.exclude`
- ✨ Hot reload of all Settings
- 💥 Toggle extension with one command `errorLens.toggle` instead of two
- 💥 Rename colors to have `background` & `foreground` suffix
- 💥 Remove statusbar entry completely
- 💥 Change default values (colors, fontStyle)
- 💥 Experimental: remove `onDidOpenTextDocument` event listener
- 🔨 Minor fixes like more specific types for Setting values
- 🔨 Use webpack

# Fork happened

