"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    vscode.workspace.onDidChangeTextDocument((e) => __awaiter(this, void 0, void 0, function* () {
        const configuration = vscode.workspace.getConfiguration();
        const quoteType = configuration.get("template-string-converter.quoteType");
        const enabled = configuration.get("template-string-converter.enabled");
        const changes = e.contentChanges[0];
        const validLanguages = configuration.get("template-string-converter.validLanguages");
        const addBracketsToProps = configuration.get("template-string-converter.addBracketsToProps");
        const removeBackticks = configuration.get("template-string-converter.autoRemoveTemplateString");
        const autoClosingBrackets = configuration.get("editor.autoClosingBrackets");
        const convertOutermostQuotes = configuration.get("template-string-converter.convertOutermostQuotes");
        const convertWithinTemplateString = configuration.get("template-string-converter.convertWithinTemplateString");
        if (enabled &&
            quoteType &&
            changes && (validLanguages === null || validLanguages === void 0 ? void 0 : validLanguages.includes(e.document.languageId))) {
            try {
                let selections = [];
                for (const selection of vscode.window.activeTextEditor.selections) {
                    const lineNumber = selection.start.line;
                    const currentChar = changes.range.start.character;
                    const lineText = e.document.lineAt(lineNumber).text;
                    if (currentChar < 1) {
                        return;
                    }
                    const startPosition = new vscode.Position(lineNumber, currentChar - 1);
                    const endPosition = new vscode.Position(lineNumber, currentChar);
                    const startQuoteIndex = getStartQuote(lineText.substring(0, currentChar), getQuoteChar(quoteType), convertOutermostQuotes);
                    const endQuoteIndex = currentChar + 1 + getEndQuote(lineText.substring(currentChar + 1, lineText.length), getQuoteChar(quoteType), convertOutermostQuotes);
                    if (startQuoteIndex < 0 || endQuoteIndex < 0) {
                        return;
                    }
                    const openingQuotePosition = new vscode.Position(lineNumber, startQuoteIndex);
                    const endQuotePosition = new vscode.Position(lineNumber, endQuoteIndex);
                    const priorChar = e.document.getText(new vscode.Range(startPosition, endPosition));
                    const nextChar = e.document.getText(new vscode.Range(startPosition.translate(0, 2), endPosition.translate(0, 2)));
                    const nextTwoChars = e.document.getText(new vscode.Range(startPosition.translate(0, 2), endPosition.translate(0, 3)));
                    if (notAComment(lineText, currentChar, startQuoteIndex, endQuoteIndex) &&
                        lineText.charAt(startQuoteIndex) === lineText.charAt(endQuoteIndex)) {
                        const regex = new RegExp(/<[^<]+=[^<]*(("|')[^<]*(\${}|\${)[^<]*("|'))[^<]*>/gm);
                        // keep the search reasonable
                        const startLine = lineNumber > 20 ? lineNumber - 20 : 0;
                        const endLine = e.document.lineCount - lineNumber > 20 ? lineNumber + 20 : e.document.lineCount;
                        const multiLineText = e.document.getText(new vscode.Range(startLine, 0, endLine, 200));
                        const matches = multiLineText.match(regex);
                        if (withinBackticks(lineText, currentChar, lineNumber, e.document, convertWithinTemplateString !== null && convertWithinTemplateString !== void 0 ? convertWithinTemplateString : true) &&
                            !lineText.slice(startQuoteIndex + 1, endQuoteIndex).match(/\$\{/) &&
                            removeBackticks) {
                            const edit = new vscode.WorkspaceEdit();
                            edit.replace(e.document.uri, new vscode.Range(openingQuotePosition, openingQuotePosition.translate(undefined, 1)), quoteType === 'single' ? '\'' : '"');
                            edit.replace(e.document.uri, new vscode.Range(endQuotePosition, endQuotePosition.translate(undefined, 1)), quoteType === 'single' ? '\'' : '"');
                            yield vscode.workspace.applyEdit(edit);
                            return;
                        }
                        if (matches !== null && addBracketsToProps) {
                            if (changes.text === "{" && priorChar === "$") {
                                const edit = new vscode.WorkspaceEdit();
                                edit.replace(e.document.uri, new vscode.Range(openingQuotePosition, openingQuotePosition.translate(undefined, 1)), "{");
                                edit.replace(e.document.uri, new vscode.Range(endQuotePosition, endQuotePosition.translate(undefined, 1)), "}");
                                edit.insert(e.document.uri, new vscode.Position(lineNumber, currentChar + 1), '}');
                                edit.insert(e.document.uri, new vscode.Position(lineNumber, endQuoteIndex), "`");
                                edit.insert(e.document.uri, new vscode.Position(lineNumber, startQuoteIndex + 1), "`");
                                yield vscode.workspace.applyEdit(edit);
                                selections.push(new vscode.Selection(lineNumber, currentChar + 2, lineNumber, currentChar + 2));
                            }
                            else if (changes.text === "{}" && priorChar === "$") {
                                const edit = new vscode.WorkspaceEdit();
                                edit.replace(e.document.uri, new vscode.Range(openingQuotePosition, openingQuotePosition.translate(undefined, 1)), "{");
                                edit.replace(e.document.uri, new vscode.Range(endQuotePosition, endQuotePosition.translate(undefined, 1)), "}");
                                edit.insert(e.document.uri, new vscode.Position(lineNumber, endQuoteIndex), "`");
                                edit.insert(e.document.uri, new vscode.Position(lineNumber, startQuoteIndex + 1), "`");
                                yield vscode.workspace.applyEdit(edit);
                                selections.push(new vscode.Selection(lineNumber, currentChar + 2, lineNumber, currentChar + 2));
                            }
                        }
                        else if (!withinBackticks(lineText, currentChar, lineNumber, e.document, convertWithinTemplateString !== null && convertWithinTemplateString !== void 0 ? convertWithinTemplateString : true)) {
                            if (changes.text === "{}" && priorChar === "$" && (currentChar < 2 || (lineText.charAt(currentChar - 2) !== "\\"))) {
                                const edit = new vscode.WorkspaceEdit();
                                edit.replace(e.document.uri, new vscode.Range(openingQuotePosition, openingQuotePosition.translate(undefined, 1)), "`");
                                edit.replace(e.document.uri, new vscode.Range(endQuotePosition, endQuotePosition.translate(undefined, 1)), "`");
                                yield vscode.workspace.applyEdit(edit);
                                selections.push(new vscode.Selection(lineNumber, currentChar + 1, lineNumber, currentChar + 1));
                            }
                            else if (changes.text === "{" && priorChar === "$" && autoClosingBrackets !== 'never' && (currentChar < 2 || (lineText.charAt(currentChar - 2) !== "\\"))) {
                                const edit = new vscode.WorkspaceEdit();
                                edit.replace(e.document.uri, new vscode.Range(openingQuotePosition, openingQuotePosition.translate(undefined, 1)), "`");
                                edit.insert(e.document.uri, endPosition.translate(undefined, 1), "}");
                                edit.replace(e.document.uri, new vscode.Range(endQuotePosition, endQuotePosition.translate(undefined, 1)), "`");
                                yield vscode.workspace.applyEdit(edit);
                                selections.push(new vscode.Selection(lineNumber, currentChar + 1, lineNumber, currentChar + 1));
                            }
                            else if (autoClosingBrackets === 'never' && priorChar === '$' && changes.text === '{' && (currentChar < 2 || (lineText.charAt(currentChar - 2) !== "\\"))) {
                                const edit = new vscode.WorkspaceEdit();
                                edit.replace(e.document.uri, new vscode.Range(openingQuotePosition, openingQuotePosition.translate(undefined, 1)), "`");
                                edit.replace(e.document.uri, new vscode.Range(endQuotePosition, endQuotePosition.translate(undefined, 1)), "`");
                                yield vscode.workspace.applyEdit(edit);
                                selections.push(new vscode.Selection(lineNumber, currentChar + 1, lineNumber, currentChar + 1));
                            }
                            else if (changes.text === '$' && nextTwoChars === '{}' && (currentChar < 1 || (lineText.charAt(currentChar - 1) !== "\\"))) {
                                const edit = new vscode.WorkspaceEdit();
                                edit.replace(e.document.uri, new vscode.Range(openingQuotePosition, openingQuotePosition.translate(undefined, 1)), "`");
                                edit.replace(e.document.uri, new vscode.Range(endQuotePosition, endQuotePosition.translate(undefined, 1)), "`");
                                yield vscode.workspace.applyEdit(edit);
                                selections.push(new vscode.Selection(lineNumber, currentChar + 2, lineNumber, currentChar + 2));
                            }
                            else if (changes.text === '$' && nextChar === '{' && autoClosingBrackets !== 'never' && (currentChar < 1 || (lineText.charAt(currentChar - 1) !== "\\"))) {
                                const edit = new vscode.WorkspaceEdit();
                                edit.replace(e.document.uri, new vscode.Range(openingQuotePosition, openingQuotePosition.translate(undefined, 1)), "`");
                                edit.insert(e.document.uri, endPosition.translate(undefined, 2), "}");
                                edit.replace(e.document.uri, new vscode.Range(endQuotePosition, endQuotePosition.translate(undefined, 1)), "`");
                                yield vscode.workspace.applyEdit(edit);
                                selections.push(new vscode.Selection(lineNumber, currentChar + 2, lineNumber, currentChar + 2));
                            }
                        }
                    }
                }
                if (vscode.window.activeTextEditor && selections.length > 0) {
                    vscode.window.activeTextEditor.selections = selections;
                }
            }
            catch (_a) { }
        }
    }));
}
exports.activate = activate;
const notAComment = (line, charIndex, startQuoteIndex, endquoteIndex) => {
    if (line.substring(0, charIndex).includes("//")) {
        return (line.substring(0, charIndex).indexOf("//") > startQuoteIndex &&
            line.substring(0, charIndex).indexOf("//") < endquoteIndex);
    }
    else {
        return true;
    }
};
const withinBackticks = (line, currentCharIndex, cursorLine, document, convertWithinTemplateString) => {
    const withinLine = line.substring(0, currentCharIndex).includes("`") && line.substring(currentCharIndex, line.length).includes("`");
    if (withinLine) {
        const startIndex = line.substring(0, currentCharIndex).indexOf("`");
        const endIndex = currentCharIndex + line.substring(currentCharIndex, line.length).indexOf("`");
        const startBracketIndex = line.substring(0, currentCharIndex).indexOf('${');
        const endBracketIndex = currentCharIndex + line.substring(currentCharIndex, line.length).indexOf("}");
        if (convertWithinTemplateString && startBracketIndex >= 0 && endBracketIndex > 0) {
            return startIndex >= startBracketIndex && endIndex <= endBracketIndex;
        }
        return withinLine;
    }
    else {
        const lineIndex = cursorLine;
        const currentLine = document.lineAt(lineIndex).text;
        const startOfLine = currentLine.substring(0, currentCharIndex);
        const endOfLine = currentLine.substring(currentCharIndex, line.length);
        return hasStartBacktick(lineIndex, startOfLine, document) && hasEndBacktick(lineIndex, endOfLine, document);
    }
};
const hasStartBacktick = (lineIndex, currentLine, document) => {
    lineIndex -= 1;
    while (lineIndex >= 0) {
        const backTick = currentLine.indexOf("`");
        const semiColon = currentLine.indexOf(";");
        const comma = currentLine.indexOf(",");
        if (backTick >= 0 && semiColon >= 0 && semiColon < backTick) {
            return true;
        }
        else if (backTick >= 0 && semiColon >= 0 && semiColon > backTick) {
            return false;
        }
        else if (backTick >= 0 && comma >= 0 && comma < backTick) {
            return true;
        }
        else if (backTick >= 0 && comma >= 0 && comma > backTick) {
            return false;
        }
        else if (backTick >= 0) {
            return true;
        }
        else if (semiColon >= 0 || comma >= 0) {
            return false;
        }
        currentLine = document.lineAt(lineIndex).text;
        lineIndex -= 1;
    }
    return false;
};
const hasEndBacktick = (lineIndex, currentLine, document) => {
    while (lineIndex < document.lineCount) {
        const backTick = currentLine.indexOf("`");
        const semiColon = currentLine.indexOf(";");
        const comma = currentLine.indexOf(",");
        if (backTick >= 0 && semiColon >= 0 && semiColon > backTick) {
            return true;
        }
        else if (backTick >= 0 && semiColon >= 0 && semiColon < backTick) {
            return false;
        }
        else if (backTick >= 0 && comma >= 0 && comma > backTick) {
            return true;
        }
        else if (backTick >= 0 && comma >= 0 && comma < backTick) {
            return false;
        }
        else if (backTick >= 0) {
            return true;
        }
        else if (semiColon >= 0) {
            return false;
        }
        else if (comma >= 0) {
            return false;
        }
        lineIndex += 1;
        currentLine = document.lineAt(lineIndex).text;
    }
    return false;
};
const getQuoteChar = (type) => {
    if (!type || type === "both") {
        return "both";
    }
    else if (type === "single") {
        return "'";
    }
    else {
        return '"';
    }
};
const getStartQuote = (line, quoteChar, convertOutermostQuotes) => {
    if (quoteChar === "both") {
        const double = convertOutermostQuotes ? line.toString().indexOf('"') : line.toString().lastIndexOf('"');
        const single = convertOutermostQuotes ? line.toString().indexOf("'") : line.toString().lastIndexOf("'");
        const back = convertOutermostQuotes ? line.toString().indexOf('`') : line.toString().lastIndexOf("`");
        if (double >= 0 && single >= 0) {
            // nested quotes
            return !convertOutermostQuotes ? double : double < single ? double : single;
        }
        else if (double >= 0) {
            return double;
        }
        else if (single >= 0) {
            return single;
        }
        else {
            return back;
        }
    }
    else {
        if (convertOutermostQuotes) {
            return line.toString().indexOf('`') !== -1 ? line.toString().indexOf('`') : line.toString().indexOf(quoteChar);
        }
        else {
            return line.toString().lastIndexOf('`') !== -1 ? line.toString().lastIndexOf('`') : line.toString().lastIndexOf(quoteChar);
        }
    }
};
const getEndQuote = (line, quoteChar, convertOutermostQuotes) => {
    if (quoteChar === "both") {
        const double = convertOutermostQuotes ? line.toString().lastIndexOf('"') : line.toString().indexOf('"');
        const single = convertOutermostQuotes ? line.toString().lastIndexOf("'") : line.toString().indexOf("'");
        const back = convertOutermostQuotes ? line.toString().lastIndexOf('`') : line.toString().indexOf("`");
        if (double >= 0 && single >= 0) {
            // nested quotes
            return !convertOutermostQuotes ? double : double > single ? double : single;
        }
        else if (double >= 0) {
            return double;
        }
        else if (single >= 0) {
            return single;
        }
        else if (back >= 0) {
            return back;
        }
        else {
            return -1;
        }
    }
    else {
        if (convertOutermostQuotes) {
            return line.toString().lastIndexOf('`') !== -1 ? line.toString().lastIndexOf('`') : line.toString().lastIndexOf(quoteChar);
        }
        else {
            return line.toString().indexOf('`') !== -1 ? line.toString().indexOf('`') : line.toString().indexOf(quoteChar);
        }
    }
};
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map