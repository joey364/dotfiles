"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildFunctionalComponent(name, code, attributes) {
    const props = new Set([
        ...attributes.argumentProps,
        ...attributes.componentMembers,
        ...attributes.memberProps,
        ...attributes.state
    ]);
    return `
    function ${name}({${Array.from(props).join(", ")}}) {
      return (${code});
    }
  `;
}
function buildStatefulComponent(name, code, attributes) {
    return `class ${name} extends React.Component {
      render() {

        ${attributes.argumentProps && attributes.argumentProps.size
        ? `const {${Array.from(attributes.argumentProps).join(",")}} = this.props`
        : ""}

        return (${code})
      }
    }
    `;
}
function buildComponent(name, code, attributes) {
    return buildFunctionalComponent(name, code, attributes);
}
exports.buildComponent = buildComponent;
//# sourceMappingURL=component-builder.js.map