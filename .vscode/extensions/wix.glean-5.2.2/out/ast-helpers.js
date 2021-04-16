"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const t = require("@babel/types");
const traverse_1 = require("@babel/traverse");
function getReactImportReference(ast) {
    return ast.program.body.find(statement => {
        return (t.isImportDeclaration(statement) && statement.source.value === "react");
    });
}
exports.getReactImportReference = getReactImportReference;
function isExportedDeclaration(ast) {
    return t.isExportNamedDeclaration(ast) || t.isExportDefaultDeclaration(ast);
}
exports.isExportedDeclaration = isExportedDeclaration;
function findPathInContext(ast, identifierName) {
    let foundPath = null;
    const visitor = {
        Identifier(path) {
            if (!foundPath && path.node.name === identifierName) {
                foundPath = path;
            }
        }
    };
    traverse_1.default(ast, visitor);
    return foundPath;
}
exports.findPathInContext = findPathInContext;
function findFirstPathInRange(ast, start, end) {
    let foundPath = null;
    const visitor = {
        enter(path) {
            if (!foundPath && pathInRange(path, start, end)) {
                foundPath = path;
                path.stop();
            }
        }
    };
    traverse_1.default(ast, visitor);
    return foundPath;
}
exports.findFirstPathInRange = findFirstPathInRange;
function pathInRange(path, start, end) {
    if (!path.node)
        return false;
    const pathStart = path.node.loc.start;
    const pathEnd = path.node.loc.end;
    return (pathStart.line >= start.line && pathStart.column >= start.character);
}
exports.pathInRange = pathInRange;
function pathContains(path, start, end) {
    if (!path.node)
        return false;
    const pathStart = path.node.loc.start;
    const pathEnd = path.node.loc.end;
    return (((pathStart.line === start.line && pathStart.column >= start.character)) &&
        ((pathEnd.line >= end.line && pathEnd.column >= end.character)));
}
exports.pathContains = pathContains;
//# sourceMappingURL=ast-helpers.js.map