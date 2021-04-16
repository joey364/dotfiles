"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const template_1 = require("@babel/template");
exports.buildStateHook = template_1.default(`
const [STATE_PROP, STATE_SETTER] = useState(STATE_VALUE);
`);
exports.buildRefHook = template_1.default(`
const VAR_NAME = useRef(INITIAL_VALUE);
`);
exports.buildEffectHook = template_1.default(`
useEffect(() =>  { EFFECT });
`);
exports.buildUseCallbackHook = template_1.default(`
useCallback(CALLBACK);
`);
exports.buildUseMemo = template_1.default(`
const VAR = useMemo(() => EXPRESSION);
`);
//# sourceMappingURL=snippet-builder.js.map