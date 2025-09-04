var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// .wrangler/tmp/bundle-e0KIFJ/checked-fetch.js
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
var urls;
var init_checked_fetch = __esm({
  ".wrangler/tmp/bundle-e0KIFJ/checked-fetch.js"() {
    "use strict";
    urls = /* @__PURE__ */ new Set();
    __name(checkURL, "checkURL");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        const [request, init] = argArray;
        checkURL(request, init);
        return Reflect.apply(target, thisArg, argArray);
      }
    });
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// ../../AppData/Roaming/nvm/v20.19.1/node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "../../AppData/Roaming/nvm/v20.19.1/node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// node_modules/abitype/dist/esm/version.js
var version;
var init_version = __esm({
  "node_modules/abitype/dist/esm/version.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    version = "1.0.8";
  }
});

// node_modules/abitype/dist/esm/errors.js
var BaseError;
var init_errors = __esm({
  "node_modules/abitype/dist/esm/errors.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_version();
    BaseError = class _BaseError extends Error {
      static {
        __name(this, "BaseError");
      }
      constructor(shortMessage, args = {}) {
        const details = args.cause instanceof _BaseError ? args.cause.details : args.cause?.message ? args.cause.message : args.details;
        const docsPath8 = args.cause instanceof _BaseError ? args.cause.docsPath || args.docsPath : args.docsPath;
        const message = [
          shortMessage || "An error occurred.",
          "",
          ...args.metaMessages ? [...args.metaMessages, ""] : [],
          ...docsPath8 ? [`Docs: https://abitype.dev${docsPath8}`] : [],
          ...details ? [`Details: ${details}`] : [],
          `Version: abitype@${version}`
        ].join("\n");
        super(message);
        Object.defineProperty(this, "details", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "docsPath", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "metaMessages", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiTypeError"
        });
        if (args.cause)
          this.cause = args.cause;
        this.details = details;
        this.docsPath = docsPath8;
        this.metaMessages = args.metaMessages;
        this.shortMessage = shortMessage;
      }
    };
  }
});

// node_modules/abitype/dist/esm/regex.js
function execTyped(regex, string) {
  const match = regex.exec(string);
  return match?.groups;
}
var bytesRegex, integerRegex, isTupleRegex;
var init_regex = __esm({
  "node_modules/abitype/dist/esm/regex.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    __name(execTyped, "execTyped");
    bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
    integerRegex = /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
    isTupleRegex = /^\(.+?\).*?$/;
  }
});

// node_modules/abitype/dist/esm/human-readable/formatAbiParameter.js
function formatAbiParameter(abiParameter) {
  let type = abiParameter.type;
  if (tupleRegex.test(abiParameter.type) && "components" in abiParameter) {
    type = "(";
    const length = abiParameter.components.length;
    for (let i = 0; i < length; i++) {
      const component = abiParameter.components[i];
      type += formatAbiParameter(component);
      if (i < length - 1)
        type += ", ";
    }
    const result = execTyped(tupleRegex, abiParameter.type);
    type += `)${result?.array ?? ""}`;
    return formatAbiParameter({
      ...abiParameter,
      type
    });
  }
  if ("indexed" in abiParameter && abiParameter.indexed)
    type = `${type} indexed`;
  if (abiParameter.name)
    return `${type} ${abiParameter.name}`;
  return type;
}
var tupleRegex;
var init_formatAbiParameter = __esm({
  "node_modules/abitype/dist/esm/human-readable/formatAbiParameter.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_regex();
    tupleRegex = /^tuple(?<array>(\[(\d*)\])*)$/;
    __name(formatAbiParameter, "formatAbiParameter");
  }
});

// node_modules/abitype/dist/esm/human-readable/formatAbiParameters.js
function formatAbiParameters(abiParameters) {
  let params = "";
  const length = abiParameters.length;
  for (let i = 0; i < length; i++) {
    const abiParameter = abiParameters[i];
    params += formatAbiParameter(abiParameter);
    if (i !== length - 1)
      params += ", ";
  }
  return params;
}
var init_formatAbiParameters = __esm({
  "node_modules/abitype/dist/esm/human-readable/formatAbiParameters.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_formatAbiParameter();
    __name(formatAbiParameters, "formatAbiParameters");
  }
});

// node_modules/abitype/dist/esm/human-readable/formatAbiItem.js
function formatAbiItem(abiItem) {
  if (abiItem.type === "function")
    return `function ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability && abiItem.stateMutability !== "nonpayable" ? ` ${abiItem.stateMutability}` : ""}${abiItem.outputs?.length ? ` returns (${formatAbiParameters(abiItem.outputs)})` : ""}`;
  if (abiItem.type === "event")
    return `event ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
  if (abiItem.type === "error")
    return `error ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
  if (abiItem.type === "constructor")
    return `constructor(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability === "payable" ? " payable" : ""}`;
  if (abiItem.type === "fallback")
    return `fallback() external${abiItem.stateMutability === "payable" ? " payable" : ""}`;
  return "receive() external payable";
}
var init_formatAbiItem = __esm({
  "node_modules/abitype/dist/esm/human-readable/formatAbiItem.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_formatAbiParameters();
    __name(formatAbiItem, "formatAbiItem");
  }
});

// node_modules/abitype/dist/esm/human-readable/runtime/signatures.js
function isErrorSignature(signature) {
  return errorSignatureRegex.test(signature);
}
function execErrorSignature(signature) {
  return execTyped(errorSignatureRegex, signature);
}
function isEventSignature(signature) {
  return eventSignatureRegex.test(signature);
}
function execEventSignature(signature) {
  return execTyped(eventSignatureRegex, signature);
}
function isFunctionSignature(signature) {
  return functionSignatureRegex.test(signature);
}
function execFunctionSignature(signature) {
  return execTyped(functionSignatureRegex, signature);
}
function isStructSignature(signature) {
  return structSignatureRegex.test(signature);
}
function execStructSignature(signature) {
  return execTyped(structSignatureRegex, signature);
}
function isConstructorSignature(signature) {
  return constructorSignatureRegex.test(signature);
}
function execConstructorSignature(signature) {
  return execTyped(constructorSignatureRegex, signature);
}
function isFallbackSignature(signature) {
  return fallbackSignatureRegex.test(signature);
}
function execFallbackSignature(signature) {
  return execTyped(fallbackSignatureRegex, signature);
}
function isReceiveSignature(signature) {
  return receiveSignatureRegex.test(signature);
}
var errorSignatureRegex, eventSignatureRegex, functionSignatureRegex, structSignatureRegex, constructorSignatureRegex, fallbackSignatureRegex, receiveSignatureRegex, eventModifiers, functionModifiers;
var init_signatures = __esm({
  "node_modules/abitype/dist/esm/human-readable/runtime/signatures.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_regex();
    errorSignatureRegex = /^error (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
    __name(isErrorSignature, "isErrorSignature");
    __name(execErrorSignature, "execErrorSignature");
    eventSignatureRegex = /^event (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
    __name(isEventSignature, "isEventSignature");
    __name(execEventSignature, "execEventSignature");
    functionSignatureRegex = /^function (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)(?: (?<scope>external|public{1}))?(?: (?<stateMutability>pure|view|nonpayable|payable{1}))?(?: returns\s?\((?<returns>.*?)\))?$/;
    __name(isFunctionSignature, "isFunctionSignature");
    __name(execFunctionSignature, "execFunctionSignature");
    structSignatureRegex = /^struct (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*) \{(?<properties>.*?)\}$/;
    __name(isStructSignature, "isStructSignature");
    __name(execStructSignature, "execStructSignature");
    constructorSignatureRegex = /^constructor\((?<parameters>.*?)\)(?:\s(?<stateMutability>payable{1}))?$/;
    __name(isConstructorSignature, "isConstructorSignature");
    __name(execConstructorSignature, "execConstructorSignature");
    fallbackSignatureRegex = /^fallback\(\) external(?:\s(?<stateMutability>payable{1}))?$/;
    __name(isFallbackSignature, "isFallbackSignature");
    __name(execFallbackSignature, "execFallbackSignature");
    receiveSignatureRegex = /^receive\(\) external payable$/;
    __name(isReceiveSignature, "isReceiveSignature");
    eventModifiers = /* @__PURE__ */ new Set(["indexed"]);
    functionModifiers = /* @__PURE__ */ new Set([
      "calldata",
      "memory",
      "storage"
    ]);
  }
});

// node_modules/abitype/dist/esm/human-readable/errors/abiItem.js
var InvalidAbiItemError, UnknownTypeError, UnknownSolidityTypeError;
var init_abiItem = __esm({
  "node_modules/abitype/dist/esm/human-readable/errors/abiItem.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_errors();
    InvalidAbiItemError = class extends BaseError {
      static {
        __name(this, "InvalidAbiItemError");
      }
      constructor({ signature }) {
        super("Failed to parse ABI item.", {
          details: `parseAbiItem(${JSON.stringify(signature, null, 2)})`,
          docsPath: "/api/human#parseabiitem-1"
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidAbiItemError"
        });
      }
    };
    UnknownTypeError = class extends BaseError {
      static {
        __name(this, "UnknownTypeError");
      }
      constructor({ type }) {
        super("Unknown type.", {
          metaMessages: [
            `Type "${type}" is not a valid ABI type. Perhaps you forgot to include a struct signature?`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "UnknownTypeError"
        });
      }
    };
    UnknownSolidityTypeError = class extends BaseError {
      static {
        __name(this, "UnknownSolidityTypeError");
      }
      constructor({ type }) {
        super("Unknown type.", {
          metaMessages: [`Type "${type}" is not a valid ABI type.`]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "UnknownSolidityTypeError"
        });
      }
    };
  }
});

// node_modules/abitype/dist/esm/human-readable/errors/abiParameter.js
var InvalidParameterError, SolidityProtectedKeywordError, InvalidModifierError, InvalidFunctionModifierError, InvalidAbiTypeParameterError;
var init_abiParameter = __esm({
  "node_modules/abitype/dist/esm/human-readable/errors/abiParameter.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_errors();
    InvalidParameterError = class extends BaseError {
      static {
        __name(this, "InvalidParameterError");
      }
      constructor({ param }) {
        super("Invalid ABI parameter.", {
          details: param
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidParameterError"
        });
      }
    };
    SolidityProtectedKeywordError = class extends BaseError {
      static {
        __name(this, "SolidityProtectedKeywordError");
      }
      constructor({ param, name }) {
        super("Invalid ABI parameter.", {
          details: param,
          metaMessages: [
            `"${name}" is a protected Solidity keyword. More info: https://docs.soliditylang.org/en/latest/cheatsheet.html`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "SolidityProtectedKeywordError"
        });
      }
    };
    InvalidModifierError = class extends BaseError {
      static {
        __name(this, "InvalidModifierError");
      }
      constructor({ param, type, modifier }) {
        super("Invalid ABI parameter.", {
          details: param,
          metaMessages: [
            `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidModifierError"
        });
      }
    };
    InvalidFunctionModifierError = class extends BaseError {
      static {
        __name(this, "InvalidFunctionModifierError");
      }
      constructor({ param, type, modifier }) {
        super("Invalid ABI parameter.", {
          details: param,
          metaMessages: [
            `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`,
            `Data location can only be specified for array, struct, or mapping types, but "${modifier}" was given.`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidFunctionModifierError"
        });
      }
    };
    InvalidAbiTypeParameterError = class extends BaseError {
      static {
        __name(this, "InvalidAbiTypeParameterError");
      }
      constructor({ abiParameter }) {
        super("Invalid ABI parameter.", {
          details: JSON.stringify(abiParameter, null, 2),
          metaMessages: ["ABI parameter type is invalid."]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidAbiTypeParameterError"
        });
      }
    };
  }
});

// node_modules/abitype/dist/esm/human-readable/errors/signature.js
var InvalidSignatureError, UnknownSignatureError, InvalidStructSignatureError;
var init_signature = __esm({
  "node_modules/abitype/dist/esm/human-readable/errors/signature.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_errors();
    InvalidSignatureError = class extends BaseError {
      static {
        __name(this, "InvalidSignatureError");
      }
      constructor({ signature, type }) {
        super(`Invalid ${type} signature.`, {
          details: signature
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidSignatureError"
        });
      }
    };
    UnknownSignatureError = class extends BaseError {
      static {
        __name(this, "UnknownSignatureError");
      }
      constructor({ signature }) {
        super("Unknown signature.", {
          details: signature
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "UnknownSignatureError"
        });
      }
    };
    InvalidStructSignatureError = class extends BaseError {
      static {
        __name(this, "InvalidStructSignatureError");
      }
      constructor({ signature }) {
        super("Invalid struct signature.", {
          details: signature,
          metaMessages: ["No properties exist."]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidStructSignatureError"
        });
      }
    };
  }
});

// node_modules/abitype/dist/esm/human-readable/errors/struct.js
var CircularReferenceError;
var init_struct = __esm({
  "node_modules/abitype/dist/esm/human-readable/errors/struct.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_errors();
    CircularReferenceError = class extends BaseError {
      static {
        __name(this, "CircularReferenceError");
      }
      constructor({ type }) {
        super("Circular reference detected.", {
          metaMessages: [`Struct "${type}" is a circular reference.`]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "CircularReferenceError"
        });
      }
    };
  }
});

// node_modules/abitype/dist/esm/human-readable/errors/splitParameters.js
var InvalidParenthesisError;
var init_splitParameters = __esm({
  "node_modules/abitype/dist/esm/human-readable/errors/splitParameters.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_errors();
    InvalidParenthesisError = class extends BaseError {
      static {
        __name(this, "InvalidParenthesisError");
      }
      constructor({ current, depth }) {
        super("Unbalanced parentheses.", {
          metaMessages: [
            `"${current.trim()}" has too many ${depth > 0 ? "opening" : "closing"} parentheses.`
          ],
          details: `Depth "${depth}"`
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidParenthesisError"
        });
      }
    };
  }
});

// node_modules/abitype/dist/esm/human-readable/runtime/cache.js
function getParameterCacheKey(param, type, structs) {
  let structKey = "";
  if (structs)
    for (const struct of Object.entries(structs)) {
      if (!struct)
        continue;
      let propertyKey = "";
      for (const property of struct[1]) {
        propertyKey += `[${property.type}${property.name ? `:${property.name}` : ""}]`;
      }
      structKey += `(${struct[0]}{${propertyKey}})`;
    }
  if (type)
    return `${type}:${param}${structKey}`;
  return param;
}
var parameterCache;
var init_cache = __esm({
  "node_modules/abitype/dist/esm/human-readable/runtime/cache.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    __name(getParameterCacheKey, "getParameterCacheKey");
    parameterCache = /* @__PURE__ */ new Map([
      // Unnamed
      ["address", { type: "address" }],
      ["bool", { type: "bool" }],
      ["bytes", { type: "bytes" }],
      ["bytes32", { type: "bytes32" }],
      ["int", { type: "int256" }],
      ["int256", { type: "int256" }],
      ["string", { type: "string" }],
      ["uint", { type: "uint256" }],
      ["uint8", { type: "uint8" }],
      ["uint16", { type: "uint16" }],
      ["uint24", { type: "uint24" }],
      ["uint32", { type: "uint32" }],
      ["uint64", { type: "uint64" }],
      ["uint96", { type: "uint96" }],
      ["uint112", { type: "uint112" }],
      ["uint160", { type: "uint160" }],
      ["uint192", { type: "uint192" }],
      ["uint256", { type: "uint256" }],
      // Named
      ["address owner", { type: "address", name: "owner" }],
      ["address to", { type: "address", name: "to" }],
      ["bool approved", { type: "bool", name: "approved" }],
      ["bytes _data", { type: "bytes", name: "_data" }],
      ["bytes data", { type: "bytes", name: "data" }],
      ["bytes signature", { type: "bytes", name: "signature" }],
      ["bytes32 hash", { type: "bytes32", name: "hash" }],
      ["bytes32 r", { type: "bytes32", name: "r" }],
      ["bytes32 root", { type: "bytes32", name: "root" }],
      ["bytes32 s", { type: "bytes32", name: "s" }],
      ["string name", { type: "string", name: "name" }],
      ["string symbol", { type: "string", name: "symbol" }],
      ["string tokenURI", { type: "string", name: "tokenURI" }],
      ["uint tokenId", { type: "uint256", name: "tokenId" }],
      ["uint8 v", { type: "uint8", name: "v" }],
      ["uint256 balance", { type: "uint256", name: "balance" }],
      ["uint256 tokenId", { type: "uint256", name: "tokenId" }],
      ["uint256 value", { type: "uint256", name: "value" }],
      // Indexed
      [
        "event:address indexed from",
        { type: "address", name: "from", indexed: true }
      ],
      ["event:address indexed to", { type: "address", name: "to", indexed: true }],
      [
        "event:uint indexed tokenId",
        { type: "uint256", name: "tokenId", indexed: true }
      ],
      [
        "event:uint256 indexed tokenId",
        { type: "uint256", name: "tokenId", indexed: true }
      ]
    ]);
  }
});

// node_modules/abitype/dist/esm/human-readable/runtime/utils.js
function parseSignature(signature, structs = {}) {
  if (isFunctionSignature(signature))
    return parseFunctionSignature(signature, structs);
  if (isEventSignature(signature))
    return parseEventSignature(signature, structs);
  if (isErrorSignature(signature))
    return parseErrorSignature(signature, structs);
  if (isConstructorSignature(signature))
    return parseConstructorSignature(signature, structs);
  if (isFallbackSignature(signature))
    return parseFallbackSignature(signature);
  if (isReceiveSignature(signature))
    return {
      type: "receive",
      stateMutability: "payable"
    };
  throw new UnknownSignatureError({ signature });
}
function parseFunctionSignature(signature, structs = {}) {
  const match = execFunctionSignature(signature);
  if (!match)
    throw new InvalidSignatureError({ signature, type: "function" });
  const inputParams = splitParameters(match.parameters);
  const inputs = [];
  const inputLength = inputParams.length;
  for (let i = 0; i < inputLength; i++) {
    inputs.push(parseAbiParameter(inputParams[i], {
      modifiers: functionModifiers,
      structs,
      type: "function"
    }));
  }
  const outputs = [];
  if (match.returns) {
    const outputParams = splitParameters(match.returns);
    const outputLength = outputParams.length;
    for (let i = 0; i < outputLength; i++) {
      outputs.push(parseAbiParameter(outputParams[i], {
        modifiers: functionModifiers,
        structs,
        type: "function"
      }));
    }
  }
  return {
    name: match.name,
    type: "function",
    stateMutability: match.stateMutability ?? "nonpayable",
    inputs,
    outputs
  };
}
function parseEventSignature(signature, structs = {}) {
  const match = execEventSignature(signature);
  if (!match)
    throw new InvalidSignatureError({ signature, type: "event" });
  const params = splitParameters(match.parameters);
  const abiParameters = [];
  const length = params.length;
  for (let i = 0; i < length; i++)
    abiParameters.push(parseAbiParameter(params[i], {
      modifiers: eventModifiers,
      structs,
      type: "event"
    }));
  return { name: match.name, type: "event", inputs: abiParameters };
}
function parseErrorSignature(signature, structs = {}) {
  const match = execErrorSignature(signature);
  if (!match)
    throw new InvalidSignatureError({ signature, type: "error" });
  const params = splitParameters(match.parameters);
  const abiParameters = [];
  const length = params.length;
  for (let i = 0; i < length; i++)
    abiParameters.push(parseAbiParameter(params[i], { structs, type: "error" }));
  return { name: match.name, type: "error", inputs: abiParameters };
}
function parseConstructorSignature(signature, structs = {}) {
  const match = execConstructorSignature(signature);
  if (!match)
    throw new InvalidSignatureError({ signature, type: "constructor" });
  const params = splitParameters(match.parameters);
  const abiParameters = [];
  const length = params.length;
  for (let i = 0; i < length; i++)
    abiParameters.push(parseAbiParameter(params[i], { structs, type: "constructor" }));
  return {
    type: "constructor",
    stateMutability: match.stateMutability ?? "nonpayable",
    inputs: abiParameters
  };
}
function parseFallbackSignature(signature) {
  const match = execFallbackSignature(signature);
  if (!match)
    throw new InvalidSignatureError({ signature, type: "fallback" });
  return {
    type: "fallback",
    stateMutability: match.stateMutability ?? "nonpayable"
  };
}
function parseAbiParameter(param, options) {
  const parameterCacheKey = getParameterCacheKey(param, options?.type, options?.structs);
  if (parameterCache.has(parameterCacheKey))
    return parameterCache.get(parameterCacheKey);
  const isTuple = isTupleRegex.test(param);
  const match = execTyped(isTuple ? abiParameterWithTupleRegex : abiParameterWithoutTupleRegex, param);
  if (!match)
    throw new InvalidParameterError({ param });
  if (match.name && isSolidityKeyword(match.name))
    throw new SolidityProtectedKeywordError({ param, name: match.name });
  const name = match.name ? { name: match.name } : {};
  const indexed = match.modifier === "indexed" ? { indexed: true } : {};
  const structs = options?.structs ?? {};
  let type;
  let components = {};
  if (isTuple) {
    type = "tuple";
    const params = splitParameters(match.type);
    const components_ = [];
    const length = params.length;
    for (let i = 0; i < length; i++) {
      components_.push(parseAbiParameter(params[i], { structs }));
    }
    components = { components: components_ };
  } else if (match.type in structs) {
    type = "tuple";
    components = { components: structs[match.type] };
  } else if (dynamicIntegerRegex.test(match.type)) {
    type = `${match.type}256`;
  } else {
    type = match.type;
    if (!(options?.type === "struct") && !isSolidityType(type))
      throw new UnknownSolidityTypeError({ type });
  }
  if (match.modifier) {
    if (!options?.modifiers?.has?.(match.modifier))
      throw new InvalidModifierError({
        param,
        type: options?.type,
        modifier: match.modifier
      });
    if (functionModifiers.has(match.modifier) && !isValidDataLocation(type, !!match.array))
      throw new InvalidFunctionModifierError({
        param,
        type: options?.type,
        modifier: match.modifier
      });
  }
  const abiParameter = {
    type: `${type}${match.array ?? ""}`,
    ...name,
    ...indexed,
    ...components
  };
  parameterCache.set(parameterCacheKey, abiParameter);
  return abiParameter;
}
function splitParameters(params, result = [], current = "", depth = 0) {
  const length = params.trim().length;
  for (let i = 0; i < length; i++) {
    const char = params[i];
    const tail = params.slice(i + 1);
    switch (char) {
      case ",":
        return depth === 0 ? splitParameters(tail, [...result, current.trim()]) : splitParameters(tail, result, `${current}${char}`, depth);
      case "(":
        return splitParameters(tail, result, `${current}${char}`, depth + 1);
      case ")":
        return splitParameters(tail, result, `${current}${char}`, depth - 1);
      default:
        return splitParameters(tail, result, `${current}${char}`, depth);
    }
  }
  if (current === "")
    return result;
  if (depth !== 0)
    throw new InvalidParenthesisError({ current, depth });
  result.push(current.trim());
  return result;
}
function isSolidityType(type) {
  return type === "address" || type === "bool" || type === "function" || type === "string" || bytesRegex.test(type) || integerRegex.test(type);
}
function isSolidityKeyword(name) {
  return name === "address" || name === "bool" || name === "function" || name === "string" || name === "tuple" || bytesRegex.test(name) || integerRegex.test(name) || protectedKeywordsRegex.test(name);
}
function isValidDataLocation(type, isArray) {
  return isArray || type === "bytes" || type === "string" || type === "tuple";
}
var abiParameterWithoutTupleRegex, abiParameterWithTupleRegex, dynamicIntegerRegex, protectedKeywordsRegex;
var init_utils = __esm({
  "node_modules/abitype/dist/esm/human-readable/runtime/utils.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_regex();
    init_abiItem();
    init_abiParameter();
    init_signature();
    init_splitParameters();
    init_cache();
    init_signatures();
    __name(parseSignature, "parseSignature");
    __name(parseFunctionSignature, "parseFunctionSignature");
    __name(parseEventSignature, "parseEventSignature");
    __name(parseErrorSignature, "parseErrorSignature");
    __name(parseConstructorSignature, "parseConstructorSignature");
    __name(parseFallbackSignature, "parseFallbackSignature");
    abiParameterWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
    abiParameterWithTupleRegex = /^\((?<type>.+?)\)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
    dynamicIntegerRegex = /^u?int$/;
    __name(parseAbiParameter, "parseAbiParameter");
    __name(splitParameters, "splitParameters");
    __name(isSolidityType, "isSolidityType");
    protectedKeywordsRegex = /^(?:after|alias|anonymous|apply|auto|byte|calldata|case|catch|constant|copyof|default|defined|error|event|external|false|final|function|immutable|implements|in|indexed|inline|internal|let|mapping|match|memory|mutable|null|of|override|partial|private|promise|public|pure|reference|relocatable|return|returns|sizeof|static|storage|struct|super|supports|switch|this|true|try|typedef|typeof|var|view|virtual)$/;
    __name(isSolidityKeyword, "isSolidityKeyword");
    __name(isValidDataLocation, "isValidDataLocation");
  }
});

// node_modules/abitype/dist/esm/human-readable/runtime/structs.js
function parseStructs(signatures) {
  const shallowStructs = {};
  const signaturesLength = signatures.length;
  for (let i = 0; i < signaturesLength; i++) {
    const signature = signatures[i];
    if (!isStructSignature(signature))
      continue;
    const match = execStructSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "struct" });
    const properties = match.properties.split(";");
    const components = [];
    const propertiesLength = properties.length;
    for (let k = 0; k < propertiesLength; k++) {
      const property = properties[k];
      const trimmed = property.trim();
      if (!trimmed)
        continue;
      const abiParameter = parseAbiParameter(trimmed, {
        type: "struct"
      });
      components.push(abiParameter);
    }
    if (!components.length)
      throw new InvalidStructSignatureError({ signature });
    shallowStructs[match.name] = components;
  }
  const resolvedStructs = {};
  const entries = Object.entries(shallowStructs);
  const entriesLength = entries.length;
  for (let i = 0; i < entriesLength; i++) {
    const [name, parameters] = entries[i];
    resolvedStructs[name] = resolveStructs(parameters, shallowStructs);
  }
  return resolvedStructs;
}
function resolveStructs(abiParameters, structs, ancestors = /* @__PURE__ */ new Set()) {
  const components = [];
  const length = abiParameters.length;
  for (let i = 0; i < length; i++) {
    const abiParameter = abiParameters[i];
    const isTuple = isTupleRegex.test(abiParameter.type);
    if (isTuple)
      components.push(abiParameter);
    else {
      const match = execTyped(typeWithoutTupleRegex, abiParameter.type);
      if (!match?.type)
        throw new InvalidAbiTypeParameterError({ abiParameter });
      const { array, type } = match;
      if (type in structs) {
        if (ancestors.has(type))
          throw new CircularReferenceError({ type });
        components.push({
          ...abiParameter,
          type: `tuple${array ?? ""}`,
          components: resolveStructs(structs[type] ?? [], structs, /* @__PURE__ */ new Set([...ancestors, type]))
        });
      } else {
        if (isSolidityType(type))
          components.push(abiParameter);
        else
          throw new UnknownTypeError({ type });
      }
    }
  }
  return components;
}
var typeWithoutTupleRegex;
var init_structs = __esm({
  "node_modules/abitype/dist/esm/human-readable/runtime/structs.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_regex();
    init_abiItem();
    init_abiParameter();
    init_signature();
    init_struct();
    init_signatures();
    init_utils();
    __name(parseStructs, "parseStructs");
    typeWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?$/;
    __name(resolveStructs, "resolveStructs");
  }
});

// node_modules/abitype/dist/esm/human-readable/parseAbi.js
function parseAbi(signatures) {
  const structs = parseStructs(signatures);
  const abi2 = [];
  const length = signatures.length;
  for (let i = 0; i < length; i++) {
    const signature = signatures[i];
    if (isStructSignature(signature))
      continue;
    abi2.push(parseSignature(signature, structs));
  }
  return abi2;
}
var init_parseAbi = __esm({
  "node_modules/abitype/dist/esm/human-readable/parseAbi.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_signatures();
    init_structs();
    init_utils();
    __name(parseAbi, "parseAbi");
  }
});

// node_modules/abitype/dist/esm/human-readable/parseAbiItem.js
function parseAbiItem(signature) {
  let abiItem;
  if (typeof signature === "string")
    abiItem = parseSignature(signature);
  else {
    const structs = parseStructs(signature);
    const length = signature.length;
    for (let i = 0; i < length; i++) {
      const signature_ = signature[i];
      if (isStructSignature(signature_))
        continue;
      abiItem = parseSignature(signature_, structs);
      break;
    }
  }
  if (!abiItem)
    throw new InvalidAbiItemError({ signature });
  return abiItem;
}
var init_parseAbiItem = __esm({
  "node_modules/abitype/dist/esm/human-readable/parseAbiItem.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_abiItem();
    init_signatures();
    init_structs();
    init_utils();
    __name(parseAbiItem, "parseAbiItem");
  }
});

// node_modules/abitype/dist/esm/exports/index.js
var init_exports = __esm({
  "node_modules/abitype/dist/esm/exports/index.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_formatAbiItem();
    init_parseAbi();
    init_parseAbiItem();
  }
});

// node_modules/viem/_esm/utils/abi/formatAbiItem.js
function formatAbiItem2(abiItem, { includeName = false } = {}) {
  if (abiItem.type !== "function" && abiItem.type !== "event" && abiItem.type !== "error")
    throw new InvalidDefinitionTypeError(abiItem.type);
  return `${abiItem.name}(${formatAbiParams(abiItem.inputs, { includeName })})`;
}
function formatAbiParams(params, { includeName = false } = {}) {
  if (!params)
    return "";
  return params.map((param) => formatAbiParam(param, { includeName })).join(includeName ? ", " : ",");
}
function formatAbiParam(param, { includeName }) {
  if (param.type.startsWith("tuple")) {
    return `(${formatAbiParams(param.components, { includeName })})${param.type.slice("tuple".length)}`;
  }
  return param.type + (includeName && param.name ? ` ${param.name}` : "");
}
var init_formatAbiItem2 = __esm({
  "node_modules/viem/_esm/utils/abi/formatAbiItem.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_abi();
    __name(formatAbiItem2, "formatAbiItem");
    __name(formatAbiParams, "formatAbiParams");
    __name(formatAbiParam, "formatAbiParam");
  }
});

// node_modules/viem/_esm/utils/data/isHex.js
function isHex(value, { strict = true } = {}) {
  if (!value)
    return false;
  if (typeof value !== "string")
    return false;
  return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
}
var init_isHex = __esm({
  "node_modules/viem/_esm/utils/data/isHex.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    __name(isHex, "isHex");
  }
});

// node_modules/viem/_esm/utils/data/size.js
function size(value) {
  if (isHex(value, { strict: false }))
    return Math.ceil((value.length - 2) / 2);
  return value.length;
}
var init_size = __esm({
  "node_modules/viem/_esm/utils/data/size.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_isHex();
    __name(size, "size");
  }
});

// node_modules/viem/_esm/errors/version.js
var version2;
var init_version2 = __esm({
  "node_modules/viem/_esm/errors/version.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    version2 = "2.33.1";
  }
});

// node_modules/viem/_esm/errors/base.js
function walk(err, fn) {
  if (fn?.(err))
    return err;
  if (err && typeof err === "object" && "cause" in err && err.cause !== void 0)
    return walk(err.cause, fn);
  return fn ? null : err;
}
var errorConfig, BaseError2;
var init_base = __esm({
  "node_modules/viem/_esm/errors/base.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_version2();
    errorConfig = {
      getDocsUrl: /* @__PURE__ */ __name(({ docsBaseUrl, docsPath: docsPath8 = "", docsSlug }) => docsPath8 ? `${docsBaseUrl ?? "https://viem.sh"}${docsPath8}${docsSlug ? `#${docsSlug}` : ""}` : void 0, "getDocsUrl"),
      version: `viem@${version2}`
    };
    BaseError2 = class _BaseError extends Error {
      static {
        __name(this, "BaseError");
      }
      constructor(shortMessage, args = {}) {
        const details = (() => {
          if (args.cause instanceof _BaseError)
            return args.cause.details;
          if (args.cause?.message)
            return args.cause.message;
          return args.details;
        })();
        const docsPath8 = (() => {
          if (args.cause instanceof _BaseError)
            return args.cause.docsPath || args.docsPath;
          return args.docsPath;
        })();
        const docsUrl = errorConfig.getDocsUrl?.({ ...args, docsPath: docsPath8 });
        const message = [
          shortMessage || "An error occurred.",
          "",
          ...args.metaMessages ? [...args.metaMessages, ""] : [],
          ...docsUrl ? [`Docs: ${docsUrl}`] : [],
          ...details ? [`Details: ${details}`] : [],
          ...errorConfig.version ? [`Version: ${errorConfig.version}`] : []
        ].join("\n");
        super(message, args.cause ? { cause: args.cause } : void 0);
        Object.defineProperty(this, "details", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "docsPath", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "metaMessages", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "version", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "BaseError"
        });
        this.details = details;
        this.docsPath = docsPath8;
        this.metaMessages = args.metaMessages;
        this.name = args.name ?? this.name;
        this.shortMessage = shortMessage;
        this.version = version2;
      }
      walk(fn) {
        return walk(this, fn);
      }
    };
    __name(walk, "walk");
  }
});

// node_modules/viem/_esm/errors/abi.js
var AbiConstructorNotFoundError, AbiConstructorParamsNotFoundError, AbiDecodingDataSizeTooSmallError, AbiDecodingZeroDataError, AbiEncodingArrayLengthMismatchError, AbiEncodingBytesSizeMismatchError, AbiEncodingLengthMismatchError, AbiErrorInputsNotFoundError, AbiErrorNotFoundError, AbiErrorSignatureNotFoundError, AbiEventSignatureEmptyTopicsError, AbiEventSignatureNotFoundError, AbiEventNotFoundError, AbiFunctionNotFoundError, AbiFunctionOutputsNotFoundError, AbiFunctionSignatureNotFoundError, AbiItemAmbiguityError, BytesSizeMismatchError, DecodeLogDataMismatch, DecodeLogTopicsMismatch, InvalidAbiEncodingTypeError, InvalidAbiDecodingTypeError, InvalidArrayError, InvalidDefinitionTypeError;
var init_abi = __esm({
  "node_modules/viem/_esm/errors/abi.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_formatAbiItem2();
    init_size();
    init_base();
    AbiConstructorNotFoundError = class extends BaseError2 {
      static {
        __name(this, "AbiConstructorNotFoundError");
      }
      constructor({ docsPath: docsPath8 }) {
        super([
          "A constructor was not found on the ABI.",
          "Make sure you are using the correct ABI and that the constructor exists on it."
        ].join("\n"), {
          docsPath: docsPath8,
          name: "AbiConstructorNotFoundError"
        });
      }
    };
    AbiConstructorParamsNotFoundError = class extends BaseError2 {
      static {
        __name(this, "AbiConstructorParamsNotFoundError");
      }
      constructor({ docsPath: docsPath8 }) {
        super([
          "Constructor arguments were provided (`args`), but a constructor parameters (`inputs`) were not found on the ABI.",
          "Make sure you are using the correct ABI, and that the `inputs` attribute on the constructor exists."
        ].join("\n"), {
          docsPath: docsPath8,
          name: "AbiConstructorParamsNotFoundError"
        });
      }
    };
    AbiDecodingDataSizeTooSmallError = class extends BaseError2 {
      static {
        __name(this, "AbiDecodingDataSizeTooSmallError");
      }
      constructor({ data, params, size: size5 }) {
        super([`Data size of ${size5} bytes is too small for given parameters.`].join("\n"), {
          metaMessages: [
            `Params: (${formatAbiParams(params, { includeName: true })})`,
            `Data:   ${data} (${size5} bytes)`
          ],
          name: "AbiDecodingDataSizeTooSmallError"
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "params", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "size", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.data = data;
        this.params = params;
        this.size = size5;
      }
    };
    AbiDecodingZeroDataError = class extends BaseError2 {
      static {
        __name(this, "AbiDecodingZeroDataError");
      }
      constructor() {
        super('Cannot decode zero data ("0x") with ABI parameters.', {
          name: "AbiDecodingZeroDataError"
        });
      }
    };
    AbiEncodingArrayLengthMismatchError = class extends BaseError2 {
      static {
        __name(this, "AbiEncodingArrayLengthMismatchError");
      }
      constructor({ expectedLength, givenLength, type }) {
        super([
          `ABI encoding array length mismatch for type ${type}.`,
          `Expected length: ${expectedLength}`,
          `Given length: ${givenLength}`
        ].join("\n"), { name: "AbiEncodingArrayLengthMismatchError" });
      }
    };
    AbiEncodingBytesSizeMismatchError = class extends BaseError2 {
      static {
        __name(this, "AbiEncodingBytesSizeMismatchError");
      }
      constructor({ expectedSize, value }) {
        super(`Size of bytes "${value}" (bytes${size(value)}) does not match expected size (bytes${expectedSize}).`, { name: "AbiEncodingBytesSizeMismatchError" });
      }
    };
    AbiEncodingLengthMismatchError = class extends BaseError2 {
      static {
        __name(this, "AbiEncodingLengthMismatchError");
      }
      constructor({ expectedLength, givenLength }) {
        super([
          "ABI encoding params/values length mismatch.",
          `Expected length (params): ${expectedLength}`,
          `Given length (values): ${givenLength}`
        ].join("\n"), { name: "AbiEncodingLengthMismatchError" });
      }
    };
    AbiErrorInputsNotFoundError = class extends BaseError2 {
      static {
        __name(this, "AbiErrorInputsNotFoundError");
      }
      constructor(errorName, { docsPath: docsPath8 }) {
        super([
          `Arguments (\`args\`) were provided to "${errorName}", but "${errorName}" on the ABI does not contain any parameters (\`inputs\`).`,
          "Cannot encode error result without knowing what the parameter types are.",
          "Make sure you are using the correct ABI and that the inputs exist on it."
        ].join("\n"), {
          docsPath: docsPath8,
          name: "AbiErrorInputsNotFoundError"
        });
      }
    };
    AbiErrorNotFoundError = class extends BaseError2 {
      static {
        __name(this, "AbiErrorNotFoundError");
      }
      constructor(errorName, { docsPath: docsPath8 } = {}) {
        super([
          `Error ${errorName ? `"${errorName}" ` : ""}not found on ABI.`,
          "Make sure you are using the correct ABI and that the error exists on it."
        ].join("\n"), {
          docsPath: docsPath8,
          name: "AbiErrorNotFoundError"
        });
      }
    };
    AbiErrorSignatureNotFoundError = class extends BaseError2 {
      static {
        __name(this, "AbiErrorSignatureNotFoundError");
      }
      constructor(signature, { docsPath: docsPath8 }) {
        super([
          `Encoded error signature "${signature}" not found on ABI.`,
          "Make sure you are using the correct ABI and that the error exists on it.",
          `You can look up the decoded signature here: https://openchain.xyz/signatures?query=${signature}.`
        ].join("\n"), {
          docsPath: docsPath8,
          name: "AbiErrorSignatureNotFoundError"
        });
        Object.defineProperty(this, "signature", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.signature = signature;
      }
    };
    AbiEventSignatureEmptyTopicsError = class extends BaseError2 {
      static {
        __name(this, "AbiEventSignatureEmptyTopicsError");
      }
      constructor({ docsPath: docsPath8 }) {
        super("Cannot extract event signature from empty topics.", {
          docsPath: docsPath8,
          name: "AbiEventSignatureEmptyTopicsError"
        });
      }
    };
    AbiEventSignatureNotFoundError = class extends BaseError2 {
      static {
        __name(this, "AbiEventSignatureNotFoundError");
      }
      constructor(signature, { docsPath: docsPath8 }) {
        super([
          `Encoded event signature "${signature}" not found on ABI.`,
          "Make sure you are using the correct ABI and that the event exists on it.",
          `You can look up the signature here: https://openchain.xyz/signatures?query=${signature}.`
        ].join("\n"), {
          docsPath: docsPath8,
          name: "AbiEventSignatureNotFoundError"
        });
      }
    };
    AbiEventNotFoundError = class extends BaseError2 {
      static {
        __name(this, "AbiEventNotFoundError");
      }
      constructor(eventName, { docsPath: docsPath8 } = {}) {
        super([
          `Event ${eventName ? `"${eventName}" ` : ""}not found on ABI.`,
          "Make sure you are using the correct ABI and that the event exists on it."
        ].join("\n"), {
          docsPath: docsPath8,
          name: "AbiEventNotFoundError"
        });
      }
    };
    AbiFunctionNotFoundError = class extends BaseError2 {
      static {
        __name(this, "AbiFunctionNotFoundError");
      }
      constructor(functionName, { docsPath: docsPath8 } = {}) {
        super([
          `Function ${functionName ? `"${functionName}" ` : ""}not found on ABI.`,
          "Make sure you are using the correct ABI and that the function exists on it."
        ].join("\n"), {
          docsPath: docsPath8,
          name: "AbiFunctionNotFoundError"
        });
      }
    };
    AbiFunctionOutputsNotFoundError = class extends BaseError2 {
      static {
        __name(this, "AbiFunctionOutputsNotFoundError");
      }
      constructor(functionName, { docsPath: docsPath8 }) {
        super([
          `Function "${functionName}" does not contain any \`outputs\` on ABI.`,
          "Cannot decode function result without knowing what the parameter types are.",
          "Make sure you are using the correct ABI and that the function exists on it."
        ].join("\n"), {
          docsPath: docsPath8,
          name: "AbiFunctionOutputsNotFoundError"
        });
      }
    };
    AbiFunctionSignatureNotFoundError = class extends BaseError2 {
      static {
        __name(this, "AbiFunctionSignatureNotFoundError");
      }
      constructor(signature, { docsPath: docsPath8 }) {
        super([
          `Encoded function signature "${signature}" not found on ABI.`,
          "Make sure you are using the correct ABI and that the function exists on it.",
          `You can look up the signature here: https://openchain.xyz/signatures?query=${signature}.`
        ].join("\n"), {
          docsPath: docsPath8,
          name: "AbiFunctionSignatureNotFoundError"
        });
      }
    };
    AbiItemAmbiguityError = class extends BaseError2 {
      static {
        __name(this, "AbiItemAmbiguityError");
      }
      constructor(x, y) {
        super("Found ambiguous types in overloaded ABI items.", {
          metaMessages: [
            `\`${x.type}\` in \`${formatAbiItem2(x.abiItem)}\`, and`,
            `\`${y.type}\` in \`${formatAbiItem2(y.abiItem)}\``,
            "",
            "These types encode differently and cannot be distinguished at runtime.",
            "Remove one of the ambiguous items in the ABI."
          ],
          name: "AbiItemAmbiguityError"
        });
      }
    };
    BytesSizeMismatchError = class extends BaseError2 {
      static {
        __name(this, "BytesSizeMismatchError");
      }
      constructor({ expectedSize, givenSize }) {
        super(`Expected bytes${expectedSize}, got bytes${givenSize}.`, {
          name: "BytesSizeMismatchError"
        });
      }
    };
    DecodeLogDataMismatch = class extends BaseError2 {
      static {
        __name(this, "DecodeLogDataMismatch");
      }
      constructor({ abiItem, data, params, size: size5 }) {
        super([
          `Data size of ${size5} bytes is too small for non-indexed event parameters.`
        ].join("\n"), {
          metaMessages: [
            `Params: (${formatAbiParams(params, { includeName: true })})`,
            `Data:   ${data} (${size5} bytes)`
          ],
          name: "DecodeLogDataMismatch"
        });
        Object.defineProperty(this, "abiItem", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "params", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "size", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.abiItem = abiItem;
        this.data = data;
        this.params = params;
        this.size = size5;
      }
    };
    DecodeLogTopicsMismatch = class extends BaseError2 {
      static {
        __name(this, "DecodeLogTopicsMismatch");
      }
      constructor({ abiItem, param }) {
        super([
          `Expected a topic for indexed event parameter${param.name ? ` "${param.name}"` : ""} on event "${formatAbiItem2(abiItem, { includeName: true })}".`
        ].join("\n"), { name: "DecodeLogTopicsMismatch" });
        Object.defineProperty(this, "abiItem", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.abiItem = abiItem;
      }
    };
    InvalidAbiEncodingTypeError = class extends BaseError2 {
      static {
        __name(this, "InvalidAbiEncodingTypeError");
      }
      constructor(type, { docsPath: docsPath8 }) {
        super([
          `Type "${type}" is not a valid encoding type.`,
          "Please provide a valid ABI type."
        ].join("\n"), { docsPath: docsPath8, name: "InvalidAbiEncodingType" });
      }
    };
    InvalidAbiDecodingTypeError = class extends BaseError2 {
      static {
        __name(this, "InvalidAbiDecodingTypeError");
      }
      constructor(type, { docsPath: docsPath8 }) {
        super([
          `Type "${type}" is not a valid decoding type.`,
          "Please provide a valid ABI type."
        ].join("\n"), { docsPath: docsPath8, name: "InvalidAbiDecodingType" });
      }
    };
    InvalidArrayError = class extends BaseError2 {
      static {
        __name(this, "InvalidArrayError");
      }
      constructor(value) {
        super([`Value "${value}" is not a valid array.`].join("\n"), {
          name: "InvalidArrayError"
        });
      }
    };
    InvalidDefinitionTypeError = class extends BaseError2 {
      static {
        __name(this, "InvalidDefinitionTypeError");
      }
      constructor(type) {
        super([
          `"${type}" is not a valid definition type.`,
          'Valid types: "function", "event", "error"'
        ].join("\n"), { name: "InvalidDefinitionTypeError" });
      }
    };
  }
});

// node_modules/viem/_esm/errors/data.js
var SliceOffsetOutOfBoundsError, SizeExceedsPaddingSizeError, InvalidBytesLengthError;
var init_data = __esm({
  "node_modules/viem/_esm/errors/data.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_base();
    SliceOffsetOutOfBoundsError = class extends BaseError2 {
      static {
        __name(this, "SliceOffsetOutOfBoundsError");
      }
      constructor({ offset, position, size: size5 }) {
        super(`Slice ${position === "start" ? "starting" : "ending"} at offset "${offset}" is out-of-bounds (size: ${size5}).`, { name: "SliceOffsetOutOfBoundsError" });
      }
    };
    SizeExceedsPaddingSizeError = class extends BaseError2 {
      static {
        __name(this, "SizeExceedsPaddingSizeError");
      }
      constructor({ size: size5, targetSize, type }) {
        super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (${size5}) exceeds padding size (${targetSize}).`, { name: "SizeExceedsPaddingSizeError" });
      }
    };
    InvalidBytesLengthError = class extends BaseError2 {
      static {
        __name(this, "InvalidBytesLengthError");
      }
      constructor({ size: size5, targetSize, type }) {
        super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} is expected to be ${targetSize} ${type} long, but is ${size5} ${type} long.`, { name: "InvalidBytesLengthError" });
      }
    };
  }
});

// node_modules/viem/_esm/utils/data/pad.js
function pad(hexOrBytes, { dir, size: size5 = 32 } = {}) {
  if (typeof hexOrBytes === "string")
    return padHex(hexOrBytes, { dir, size: size5 });
  return padBytes(hexOrBytes, { dir, size: size5 });
}
function padHex(hex_, { dir, size: size5 = 32 } = {}) {
  if (size5 === null)
    return hex_;
  const hex = hex_.replace("0x", "");
  if (hex.length > size5 * 2)
    throw new SizeExceedsPaddingSizeError({
      size: Math.ceil(hex.length / 2),
      targetSize: size5,
      type: "hex"
    });
  return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size5 * 2, "0")}`;
}
function padBytes(bytes, { dir, size: size5 = 32 } = {}) {
  if (size5 === null)
    return bytes;
  if (bytes.length > size5)
    throw new SizeExceedsPaddingSizeError({
      size: bytes.length,
      targetSize: size5,
      type: "bytes"
    });
  const paddedBytes = new Uint8Array(size5);
  for (let i = 0; i < size5; i++) {
    const padEnd = dir === "right";
    paddedBytes[padEnd ? i : size5 - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
  }
  return paddedBytes;
}
var init_pad = __esm({
  "node_modules/viem/_esm/utils/data/pad.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_data();
    __name(pad, "pad");
    __name(padHex, "padHex");
    __name(padBytes, "padBytes");
  }
});

// node_modules/viem/_esm/errors/encoding.js
var IntegerOutOfRangeError, InvalidBytesBooleanError, InvalidHexBooleanError, SizeOverflowError;
var init_encoding = __esm({
  "node_modules/viem/_esm/errors/encoding.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_base();
    IntegerOutOfRangeError = class extends BaseError2 {
      static {
        __name(this, "IntegerOutOfRangeError");
      }
      constructor({ max, min, signed, size: size5, value }) {
        super(`Number "${value}" is not in safe ${size5 ? `${size5 * 8}-bit ${signed ? "signed" : "unsigned"} ` : ""}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`, { name: "IntegerOutOfRangeError" });
      }
    };
    InvalidBytesBooleanError = class extends BaseError2 {
      static {
        __name(this, "InvalidBytesBooleanError");
      }
      constructor(bytes) {
        super(`Bytes value "${bytes}" is not a valid boolean. The bytes array must contain a single byte of either a 0 or 1 value.`, {
          name: "InvalidBytesBooleanError"
        });
      }
    };
    InvalidHexBooleanError = class extends BaseError2 {
      static {
        __name(this, "InvalidHexBooleanError");
      }
      constructor(hex) {
        super(`Hex value "${hex}" is not a valid boolean. The hex value must be "0x0" (false) or "0x1" (true).`, { name: "InvalidHexBooleanError" });
      }
    };
    SizeOverflowError = class extends BaseError2 {
      static {
        __name(this, "SizeOverflowError");
      }
      constructor({ givenSize, maxSize }) {
        super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, { name: "SizeOverflowError" });
      }
    };
  }
});

// node_modules/viem/_esm/utils/data/trim.js
function trim(hexOrBytes, { dir = "left" } = {}) {
  let data = typeof hexOrBytes === "string" ? hexOrBytes.replace("0x", "") : hexOrBytes;
  let sliceLength = 0;
  for (let i = 0; i < data.length - 1; i++) {
    if (data[dir === "left" ? i : data.length - i - 1].toString() === "0")
      sliceLength++;
    else
      break;
  }
  data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
  if (typeof hexOrBytes === "string") {
    if (data.length === 1 && dir === "right")
      data = `${data}0`;
    return `0x${data.length % 2 === 1 ? `0${data}` : data}`;
  }
  return data;
}
var init_trim = __esm({
  "node_modules/viem/_esm/utils/data/trim.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    __name(trim, "trim");
  }
});

// node_modules/viem/_esm/utils/encoding/fromHex.js
function assertSize(hexOrBytes, { size: size5 }) {
  if (size(hexOrBytes) > size5)
    throw new SizeOverflowError({
      givenSize: size(hexOrBytes),
      maxSize: size5
    });
}
function hexToBigInt(hex, opts = {}) {
  const { signed } = opts;
  if (opts.size)
    assertSize(hex, { size: opts.size });
  const value = BigInt(hex);
  if (!signed)
    return value;
  const size5 = (hex.length - 2) / 2;
  const max = (1n << BigInt(size5) * 8n - 1n) - 1n;
  if (value <= max)
    return value;
  return value - BigInt(`0x${"f".padStart(size5 * 2, "f")}`) - 1n;
}
function hexToBool(hex_, opts = {}) {
  let hex = hex_;
  if (opts.size) {
    assertSize(hex, { size: opts.size });
    hex = trim(hex);
  }
  if (trim(hex) === "0x00")
    return false;
  if (trim(hex) === "0x01")
    return true;
  throw new InvalidHexBooleanError(hex);
}
function hexToNumber(hex, opts = {}) {
  return Number(hexToBigInt(hex, opts));
}
var init_fromHex = __esm({
  "node_modules/viem/_esm/utils/encoding/fromHex.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_encoding();
    init_size();
    init_trim();
    __name(assertSize, "assertSize");
    __name(hexToBigInt, "hexToBigInt");
    __name(hexToBool, "hexToBool");
    __name(hexToNumber, "hexToNumber");
  }
});

// node_modules/viem/_esm/utils/encoding/toHex.js
function toHex(value, opts = {}) {
  if (typeof value === "number" || typeof value === "bigint")
    return numberToHex(value, opts);
  if (typeof value === "string") {
    return stringToHex(value, opts);
  }
  if (typeof value === "boolean")
    return boolToHex(value, opts);
  return bytesToHex(value, opts);
}
function boolToHex(value, opts = {}) {
  const hex = `0x${Number(value)}`;
  if (typeof opts.size === "number") {
    assertSize(hex, { size: opts.size });
    return pad(hex, { size: opts.size });
  }
  return hex;
}
function bytesToHex(value, opts = {}) {
  let string = "";
  for (let i = 0; i < value.length; i++) {
    string += hexes[value[i]];
  }
  const hex = `0x${string}`;
  if (typeof opts.size === "number") {
    assertSize(hex, { size: opts.size });
    return pad(hex, { dir: "right", size: opts.size });
  }
  return hex;
}
function numberToHex(value_, opts = {}) {
  const { signed, size: size5 } = opts;
  const value = BigInt(value_);
  let maxValue;
  if (size5) {
    if (signed)
      maxValue = (1n << BigInt(size5) * 8n - 1n) - 1n;
    else
      maxValue = 2n ** (BigInt(size5) * 8n) - 1n;
  } else if (typeof value_ === "number") {
    maxValue = BigInt(Number.MAX_SAFE_INTEGER);
  }
  const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
  if (maxValue && value > maxValue || value < minValue) {
    const suffix = typeof value_ === "bigint" ? "n" : "";
    throw new IntegerOutOfRangeError({
      max: maxValue ? `${maxValue}${suffix}` : void 0,
      min: `${minValue}${suffix}`,
      signed,
      size: size5,
      value: `${value_}${suffix}`
    });
  }
  const hex = `0x${(signed && value < 0 ? (1n << BigInt(size5 * 8)) + BigInt(value) : value).toString(16)}`;
  if (size5)
    return pad(hex, { size: size5 });
  return hex;
}
function stringToHex(value_, opts = {}) {
  const value = encoder.encode(value_);
  return bytesToHex(value, opts);
}
var hexes, encoder;
var init_toHex = __esm({
  "node_modules/viem/_esm/utils/encoding/toHex.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_encoding();
    init_pad();
    init_fromHex();
    hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
    __name(toHex, "toHex");
    __name(boolToHex, "boolToHex");
    __name(bytesToHex, "bytesToHex");
    __name(numberToHex, "numberToHex");
    encoder = /* @__PURE__ */ new TextEncoder();
    __name(stringToHex, "stringToHex");
  }
});

// node_modules/viem/_esm/utils/encoding/toBytes.js
function toBytes(value, opts = {}) {
  if (typeof value === "number" || typeof value === "bigint")
    return numberToBytes(value, opts);
  if (typeof value === "boolean")
    return boolToBytes(value, opts);
  if (isHex(value))
    return hexToBytes(value, opts);
  return stringToBytes(value, opts);
}
function boolToBytes(value, opts = {}) {
  const bytes = new Uint8Array(1);
  bytes[0] = Number(value);
  if (typeof opts.size === "number") {
    assertSize(bytes, { size: opts.size });
    return pad(bytes, { size: opts.size });
  }
  return bytes;
}
function charCodeToBase16(char) {
  if (char >= charCodeMap.zero && char <= charCodeMap.nine)
    return char - charCodeMap.zero;
  if (char >= charCodeMap.A && char <= charCodeMap.F)
    return char - (charCodeMap.A - 10);
  if (char >= charCodeMap.a && char <= charCodeMap.f)
    return char - (charCodeMap.a - 10);
  return void 0;
}
function hexToBytes(hex_, opts = {}) {
  let hex = hex_;
  if (opts.size) {
    assertSize(hex, { size: opts.size });
    hex = pad(hex, { dir: "right", size: opts.size });
  }
  let hexString = hex.slice(2);
  if (hexString.length % 2)
    hexString = `0${hexString}`;
  const length = hexString.length / 2;
  const bytes = new Uint8Array(length);
  for (let index2 = 0, j = 0; index2 < length; index2++) {
    const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
    const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
    if (nibbleLeft === void 0 || nibbleRight === void 0) {
      throw new BaseError2(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
    }
    bytes[index2] = nibbleLeft * 16 + nibbleRight;
  }
  return bytes;
}
function numberToBytes(value, opts) {
  const hex = numberToHex(value, opts);
  return hexToBytes(hex);
}
function stringToBytes(value, opts = {}) {
  const bytes = encoder2.encode(value);
  if (typeof opts.size === "number") {
    assertSize(bytes, { size: opts.size });
    return pad(bytes, { dir: "right", size: opts.size });
  }
  return bytes;
}
var encoder2, charCodeMap;
var init_toBytes = __esm({
  "node_modules/viem/_esm/utils/encoding/toBytes.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_base();
    init_isHex();
    init_pad();
    init_fromHex();
    init_toHex();
    encoder2 = /* @__PURE__ */ new TextEncoder();
    __name(toBytes, "toBytes");
    __name(boolToBytes, "boolToBytes");
    charCodeMap = {
      zero: 48,
      nine: 57,
      A: 65,
      F: 70,
      a: 97,
      f: 102
    };
    __name(charCodeToBase16, "charCodeToBase16");
    __name(hexToBytes, "hexToBytes");
    __name(numberToBytes, "numberToBytes");
    __name(stringToBytes, "stringToBytes");
  }
});

// node_modules/viem/node_modules/@noble/hashes/esm/_u64.js
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i = 0; i < len; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
var U32_MASK64, _32n, rotlSH, rotlSL, rotlBH, rotlBL;
var init_u64 = __esm({
  "node_modules/viem/node_modules/@noble/hashes/esm/_u64.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
    _32n = /* @__PURE__ */ BigInt(32);
    __name(fromBig, "fromBig");
    __name(split, "split");
    rotlSH = /* @__PURE__ */ __name((h, l, s) => h << s | l >>> 32 - s, "rotlSH");
    rotlSL = /* @__PURE__ */ __name((h, l, s) => l << s | h >>> 32 - s, "rotlSL");
    rotlBH = /* @__PURE__ */ __name((h, l, s) => l << s - 32 | h >>> 64 - s, "rotlBH");
    rotlBL = /* @__PURE__ */ __name((h, l, s) => h << s - 32 | l >>> 64 - s, "rotlBL");
  }
});

// node_modules/viem/node_modules/@noble/hashes/esm/crypto.js
var crypto2;
var init_crypto = __esm({
  "node_modules/viem/node_modules/@noble/hashes/esm/crypto.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    crypto2 = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
  }
});

// node_modules/viem/node_modules/@noble/hashes/esm/utils.js
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function anumber(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error("positive integer expected, got " + n);
}
function abytes(b, ...lengths) {
  if (!isBytes(b))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
function ahash(h) {
  if (typeof h !== "function" || typeof h.create !== "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  anumber(h.outputLen);
  anumber(h.blockLen);
}
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput(out, instance) {
  abytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error("digestInto() expects output buffer of length at least " + min);
  }
}
function u32(arr) {
  return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
function clean(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr(word, shift) {
  return word << 32 - shift | word >>> shift;
}
function byteSwap(word) {
  return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
}
function byteSwap32(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = byteSwap(arr[i]);
  }
  return arr;
}
function bytesToHex2(bytes) {
  abytes(bytes);
  if (hasHexBuiltin)
    return bytes.toHex();
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += hexes2[bytes[i]];
  }
  return hex;
}
function asciiToBase16(ch) {
  if (ch >= asciis._0 && ch <= asciis._9)
    return ch - asciis._0;
  if (ch >= asciis.A && ch <= asciis.F)
    return ch - (asciis.A - 10);
  if (ch >= asciis.a && ch <= asciis.f)
    return ch - (asciis.a - 10);
  return;
}
function hexToBytes2(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  if (hasHexBuiltin)
    return Uint8Array.fromHex(hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    throw new Error("hex string expected, got unpadded hex of length " + hl);
  const array = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi));
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array[ai] = n1 * 16 + n2;
  }
  return array;
}
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes2(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  abytes(data);
  return data;
}
function concatBytes(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    abytes(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad4 = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad4);
    pad4 += a.length;
  }
  return res;
}
function createHasher(hashCons) {
  const hashC = /* @__PURE__ */ __name((msg) => hashCons().update(toBytes2(msg)).digest(), "hashC");
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
function randomBytes(bytesLength = 32) {
  if (crypto2 && typeof crypto2.getRandomValues === "function") {
    return crypto2.getRandomValues(new Uint8Array(bytesLength));
  }
  if (crypto2 && typeof crypto2.randomBytes === "function") {
    return Uint8Array.from(crypto2.randomBytes(bytesLength));
  }
  throw new Error("crypto.getRandomValues must be defined");
}
var isLE, swap32IfBE, hasHexBuiltin, hexes2, asciis, Hash;
var init_utils2 = __esm({
  "node_modules/viem/node_modules/@noble/hashes/esm/utils.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_crypto();
    __name(isBytes, "isBytes");
    __name(anumber, "anumber");
    __name(abytes, "abytes");
    __name(ahash, "ahash");
    __name(aexists, "aexists");
    __name(aoutput, "aoutput");
    __name(u32, "u32");
    __name(clean, "clean");
    __name(createView, "createView");
    __name(rotr, "rotr");
    isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
    __name(byteSwap, "byteSwap");
    __name(byteSwap32, "byteSwap32");
    swap32IfBE = isLE ? (u) => u : byteSwap32;
    hasHexBuiltin = /* @__PURE__ */ (() => (
      // @ts-ignore
      typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
    ))();
    hexes2 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
    __name(bytesToHex2, "bytesToHex");
    asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
    __name(asciiToBase16, "asciiToBase16");
    __name(hexToBytes2, "hexToBytes");
    __name(utf8ToBytes, "utf8ToBytes");
    __name(toBytes2, "toBytes");
    __name(concatBytes, "concatBytes");
    Hash = class {
      static {
        __name(this, "Hash");
      }
    };
    __name(createHasher, "createHasher");
    __name(randomBytes, "randomBytes");
  }
});

// node_modules/viem/node_modules/@noble/hashes/esm/sha3.js
function keccakP(s, rounds = 24) {
  const B = new Uint32Array(5 * 2);
  for (let round = 24 - rounds; round < 24; round++) {
    for (let x = 0; x < 10; x++)
      B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
    for (let x = 0; x < 10; x += 2) {
      const idx1 = (x + 8) % 10;
      const idx0 = (x + 2) % 10;
      const B0 = B[idx0];
      const B1 = B[idx0 + 1];
      const Th = rotlH(B0, B1, 1) ^ B[idx1];
      const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
      for (let y = 0; y < 50; y += 10) {
        s[x + y] ^= Th;
        s[x + y + 1] ^= Tl;
      }
    }
    let curH = s[2];
    let curL = s[3];
    for (let t = 0; t < 24; t++) {
      const shift = SHA3_ROTL[t];
      const Th = rotlH(curH, curL, shift);
      const Tl = rotlL(curH, curL, shift);
      const PI = SHA3_PI[t];
      curH = s[PI];
      curL = s[PI + 1];
      s[PI] = Th;
      s[PI + 1] = Tl;
    }
    for (let y = 0; y < 50; y += 10) {
      for (let x = 0; x < 10; x++)
        B[x] = s[y + x];
      for (let x = 0; x < 10; x++)
        s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
    }
    s[0] ^= SHA3_IOTA_H[round];
    s[1] ^= SHA3_IOTA_L[round];
  }
  clean(B);
}
var _0n, _1n, _2n, _7n, _256n, _0x71n, SHA3_PI, SHA3_ROTL, _SHA3_IOTA, IOTAS, SHA3_IOTA_H, SHA3_IOTA_L, rotlH, rotlL, Keccak, gen, keccak_256;
var init_sha3 = __esm({
  "node_modules/viem/node_modules/@noble/hashes/esm/sha3.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_u64();
    init_utils2();
    _0n = BigInt(0);
    _1n = BigInt(1);
    _2n = BigInt(2);
    _7n = BigInt(7);
    _256n = BigInt(256);
    _0x71n = BigInt(113);
    SHA3_PI = [];
    SHA3_ROTL = [];
    _SHA3_IOTA = [];
    for (let round = 0, R = _1n, x = 1, y = 0; round < 24; round++) {
      [x, y] = [y, (2 * x + 3 * y) % 5];
      SHA3_PI.push(2 * (5 * y + x));
      SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
      let t = _0n;
      for (let j = 0; j < 7; j++) {
        R = (R << _1n ^ (R >> _7n) * _0x71n) % _256n;
        if (R & _2n)
          t ^= _1n << (_1n << /* @__PURE__ */ BigInt(j)) - _1n;
      }
      _SHA3_IOTA.push(t);
    }
    IOTAS = split(_SHA3_IOTA, true);
    SHA3_IOTA_H = IOTAS[0];
    SHA3_IOTA_L = IOTAS[1];
    rotlH = /* @__PURE__ */ __name((h, l, s) => s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s), "rotlH");
    rotlL = /* @__PURE__ */ __name((h, l, s) => s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s), "rotlL");
    __name(keccakP, "keccakP");
    Keccak = class _Keccak extends Hash {
      static {
        __name(this, "Keccak");
      }
      // NOTE: we accept arguments in bytes instead of bits here.
      constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
        super();
        this.pos = 0;
        this.posOut = 0;
        this.finished = false;
        this.destroyed = false;
        this.enableXOF = false;
        this.blockLen = blockLen;
        this.suffix = suffix;
        this.outputLen = outputLen;
        this.enableXOF = enableXOF;
        this.rounds = rounds;
        anumber(outputLen);
        if (!(0 < blockLen && blockLen < 200))
          throw new Error("only keccak-f1600 function is supported");
        this.state = new Uint8Array(200);
        this.state32 = u32(this.state);
      }
      clone() {
        return this._cloneInto();
      }
      keccak() {
        swap32IfBE(this.state32);
        keccakP(this.state32, this.rounds);
        swap32IfBE(this.state32);
        this.posOut = 0;
        this.pos = 0;
      }
      update(data) {
        aexists(this);
        data = toBytes2(data);
        abytes(data);
        const { blockLen, state } = this;
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          for (let i = 0; i < take; i++)
            state[this.pos++] ^= data[pos++];
          if (this.pos === blockLen)
            this.keccak();
        }
        return this;
      }
      finish() {
        if (this.finished)
          return;
        this.finished = true;
        const { state, suffix, pos, blockLen } = this;
        state[pos] ^= suffix;
        if ((suffix & 128) !== 0 && pos === blockLen - 1)
          this.keccak();
        state[blockLen - 1] ^= 128;
        this.keccak();
      }
      writeInto(out) {
        aexists(this, false);
        abytes(out);
        this.finish();
        const bufferOut = this.state;
        const { blockLen } = this;
        for (let pos = 0, len = out.length; pos < len; ) {
          if (this.posOut >= blockLen)
            this.keccak();
          const take = Math.min(blockLen - this.posOut, len - pos);
          out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
          this.posOut += take;
          pos += take;
        }
        return out;
      }
      xofInto(out) {
        if (!this.enableXOF)
          throw new Error("XOF is not possible for this instance");
        return this.writeInto(out);
      }
      xof(bytes) {
        anumber(bytes);
        return this.xofInto(new Uint8Array(bytes));
      }
      digestInto(out) {
        aoutput(out, this);
        if (this.finished)
          throw new Error("digest() was already called");
        this.writeInto(out);
        this.destroy();
        return out;
      }
      digest() {
        return this.digestInto(new Uint8Array(this.outputLen));
      }
      destroy() {
        this.destroyed = true;
        clean(this.state);
      }
      _cloneInto(to) {
        const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
        to || (to = new _Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
        to.state32.set(this.state32);
        to.pos = this.pos;
        to.posOut = this.posOut;
        to.finished = this.finished;
        to.rounds = rounds;
        to.suffix = suffix;
        to.outputLen = outputLen;
        to.enableXOF = enableXOF;
        to.destroyed = this.destroyed;
        return to;
      }
    };
    gen = /* @__PURE__ */ __name((suffix, blockLen, outputLen) => createHasher(() => new Keccak(blockLen, suffix, outputLen)), "gen");
    keccak_256 = /* @__PURE__ */ (() => gen(1, 136, 256 / 8))();
  }
});

// node_modules/viem/_esm/utils/hash/keccak256.js
function keccak256(value, to_) {
  const to = to_ || "hex";
  const bytes = keccak_256(isHex(value, { strict: false }) ? toBytes(value) : value);
  if (to === "bytes")
    return bytes;
  return toHex(bytes);
}
var init_keccak256 = __esm({
  "node_modules/viem/_esm/utils/hash/keccak256.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_sha3();
    init_isHex();
    init_toBytes();
    init_toHex();
    __name(keccak256, "keccak256");
  }
});

// node_modules/viem/_esm/utils/hash/hashSignature.js
function hashSignature(sig) {
  return hash(sig);
}
var hash;
var init_hashSignature = __esm({
  "node_modules/viem/_esm/utils/hash/hashSignature.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_toBytes();
    init_keccak256();
    hash = /* @__PURE__ */ __name((value) => keccak256(toBytes(value)), "hash");
    __name(hashSignature, "hashSignature");
  }
});

// node_modules/viem/_esm/utils/hash/normalizeSignature.js
function normalizeSignature(signature) {
  let active = true;
  let current = "";
  let level = 0;
  let result = "";
  let valid = false;
  for (let i = 0; i < signature.length; i++) {
    const char = signature[i];
    if (["(", ")", ","].includes(char))
      active = true;
    if (char === "(")
      level++;
    if (char === ")")
      level--;
    if (!active)
      continue;
    if (level === 0) {
      if (char === " " && ["event", "function", ""].includes(result))
        result = "";
      else {
        result += char;
        if (char === ")") {
          valid = true;
          break;
        }
      }
      continue;
    }
    if (char === " ") {
      if (signature[i - 1] !== "," && current !== "," && current !== ",(") {
        current = "";
        active = false;
      }
      continue;
    }
    result += char;
    current += char;
  }
  if (!valid)
    throw new BaseError2("Unable to normalize signature.");
  return result;
}
var init_normalizeSignature = __esm({
  "node_modules/viem/_esm/utils/hash/normalizeSignature.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_base();
    __name(normalizeSignature, "normalizeSignature");
  }
});

// node_modules/viem/_esm/utils/hash/toSignature.js
var toSignature;
var init_toSignature = __esm({
  "node_modules/viem/_esm/utils/hash/toSignature.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_exports();
    init_normalizeSignature();
    toSignature = /* @__PURE__ */ __name((def) => {
      const def_ = (() => {
        if (typeof def === "string")
          return def;
        return formatAbiItem(def);
      })();
      return normalizeSignature(def_);
    }, "toSignature");
  }
});

// node_modules/viem/_esm/utils/hash/toSignatureHash.js
function toSignatureHash(fn) {
  return hashSignature(toSignature(fn));
}
var init_toSignatureHash = __esm({
  "node_modules/viem/_esm/utils/hash/toSignatureHash.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_hashSignature();
    init_toSignature();
    __name(toSignatureHash, "toSignatureHash");
  }
});

// node_modules/viem/_esm/utils/hash/toEventSelector.js
var toEventSelector;
var init_toEventSelector = __esm({
  "node_modules/viem/_esm/utils/hash/toEventSelector.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_toSignatureHash();
    toEventSelector = toSignatureHash;
  }
});

// node_modules/viem/_esm/errors/address.js
var InvalidAddressError;
var init_address = __esm({
  "node_modules/viem/_esm/errors/address.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_base();
    InvalidAddressError = class extends BaseError2 {
      static {
        __name(this, "InvalidAddressError");
      }
      constructor({ address }) {
        super(`Address "${address}" is invalid.`, {
          metaMessages: [
            "- Address must be a hex value of 20 bytes (40 hex characters).",
            "- Address must match its checksum counterpart."
          ],
          name: "InvalidAddressError"
        });
      }
    };
  }
});

// node_modules/viem/_esm/utils/lru.js
var LruMap;
var init_lru = __esm({
  "node_modules/viem/_esm/utils/lru.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    LruMap = class extends Map {
      static {
        __name(this, "LruMap");
      }
      constructor(size5) {
        super();
        Object.defineProperty(this, "maxSize", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.maxSize = size5;
      }
      get(key) {
        const value = super.get(key);
        if (super.has(key) && value !== void 0) {
          this.delete(key);
          super.set(key, value);
        }
        return value;
      }
      set(key, value) {
        super.set(key, value);
        if (this.maxSize && this.size > this.maxSize) {
          const firstKey = this.keys().next().value;
          if (firstKey)
            this.delete(firstKey);
        }
        return this;
      }
    };
  }
});

// node_modules/viem/_esm/utils/address/getAddress.js
function checksumAddress(address_, chainId) {
  if (checksumAddressCache.has(`${address_}.${chainId}`))
    return checksumAddressCache.get(`${address_}.${chainId}`);
  const hexAddress = chainId ? `${chainId}${address_.toLowerCase()}` : address_.substring(2).toLowerCase();
  const hash2 = keccak256(stringToBytes(hexAddress), "bytes");
  const address = (chainId ? hexAddress.substring(`${chainId}0x`.length) : hexAddress).split("");
  for (let i = 0; i < 40; i += 2) {
    if (hash2[i >> 1] >> 4 >= 8 && address[i]) {
      address[i] = address[i].toUpperCase();
    }
    if ((hash2[i >> 1] & 15) >= 8 && address[i + 1]) {
      address[i + 1] = address[i + 1].toUpperCase();
    }
  }
  const result = `0x${address.join("")}`;
  checksumAddressCache.set(`${address_}.${chainId}`, result);
  return result;
}
function getAddress(address, chainId) {
  if (!isAddress(address, { strict: false }))
    throw new InvalidAddressError({ address });
  return checksumAddress(address, chainId);
}
var checksumAddressCache;
var init_getAddress = __esm({
  "node_modules/viem/_esm/utils/address/getAddress.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_address();
    init_toBytes();
    init_keccak256();
    init_lru();
    init_isAddress();
    checksumAddressCache = /* @__PURE__ */ new LruMap(8192);
    __name(checksumAddress, "checksumAddress");
    __name(getAddress, "getAddress");
  }
});

// node_modules/viem/_esm/utils/address/isAddress.js
function isAddress(address, options) {
  const { strict = true } = options ?? {};
  const cacheKey2 = `${address}.${strict}`;
  if (isAddressCache.has(cacheKey2))
    return isAddressCache.get(cacheKey2);
  const result = (() => {
    if (!addressRegex.test(address))
      return false;
    if (address.toLowerCase() === address)
      return true;
    if (strict)
      return checksumAddress(address) === address;
    return true;
  })();
  isAddressCache.set(cacheKey2, result);
  return result;
}
var addressRegex, isAddressCache;
var init_isAddress = __esm({
  "node_modules/viem/_esm/utils/address/isAddress.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_lru();
    init_getAddress();
    addressRegex = /^0x[a-fA-F0-9]{40}$/;
    isAddressCache = /* @__PURE__ */ new LruMap(8192);
    __name(isAddress, "isAddress");
  }
});

// node_modules/viem/_esm/utils/data/concat.js
function concat(values) {
  if (typeof values[0] === "string")
    return concatHex(values);
  return concatBytes2(values);
}
function concatBytes2(values) {
  let length = 0;
  for (const arr of values) {
    length += arr.length;
  }
  const result = new Uint8Array(length);
  let offset = 0;
  for (const arr of values) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}
function concatHex(values) {
  return `0x${values.reduce((acc, x) => acc + x.replace("0x", ""), "")}`;
}
var init_concat = __esm({
  "node_modules/viem/_esm/utils/data/concat.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    __name(concat, "concat");
    __name(concatBytes2, "concatBytes");
    __name(concatHex, "concatHex");
  }
});

// node_modules/viem/_esm/utils/data/slice.js
function slice(value, start, end, { strict } = {}) {
  if (isHex(value, { strict: false }))
    return sliceHex(value, start, end, {
      strict
    });
  return sliceBytes(value, start, end, {
    strict
  });
}
function assertStartOffset(value, start) {
  if (typeof start === "number" && start > 0 && start > size(value) - 1)
    throw new SliceOffsetOutOfBoundsError({
      offset: start,
      position: "start",
      size: size(value)
    });
}
function assertEndOffset(value, start, end) {
  if (typeof start === "number" && typeof end === "number" && size(value) !== end - start) {
    throw new SliceOffsetOutOfBoundsError({
      offset: end,
      position: "end",
      size: size(value)
    });
  }
}
function sliceBytes(value_, start, end, { strict } = {}) {
  assertStartOffset(value_, start);
  const value = value_.slice(start, end);
  if (strict)
    assertEndOffset(value, start, end);
  return value;
}
function sliceHex(value_, start, end, { strict } = {}) {
  assertStartOffset(value_, start);
  const value = `0x${value_.replace("0x", "").slice((start ?? 0) * 2, (end ?? value_.length) * 2)}`;
  if (strict)
    assertEndOffset(value, start, end);
  return value;
}
var init_slice = __esm({
  "node_modules/viem/_esm/utils/data/slice.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_data();
    init_isHex();
    init_size();
    __name(slice, "slice");
    __name(assertStartOffset, "assertStartOffset");
    __name(assertEndOffset, "assertEndOffset");
    __name(sliceBytes, "sliceBytes");
    __name(sliceHex, "sliceHex");
  }
});

// node_modules/viem/_esm/utils/regex.js
var bytesRegex2, integerRegex2;
var init_regex2 = __esm({
  "node_modules/viem/_esm/utils/regex.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    bytesRegex2 = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
    integerRegex2 = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
  }
});

// node_modules/viem/_esm/utils/abi/encodeAbiParameters.js
function encodeAbiParameters(params, values) {
  if (params.length !== values.length)
    throw new AbiEncodingLengthMismatchError({
      expectedLength: params.length,
      givenLength: values.length
    });
  const preparedParams = prepareParams({
    params,
    values
  });
  const data = encodeParams(preparedParams);
  if (data.length === 0)
    return "0x";
  return data;
}
function prepareParams({ params, values }) {
  const preparedParams = [];
  for (let i = 0; i < params.length; i++) {
    preparedParams.push(prepareParam({ param: params[i], value: values[i] }));
  }
  return preparedParams;
}
function prepareParam({ param, value }) {
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents) {
    const [length, type] = arrayComponents;
    return encodeArray(value, { length, param: { ...param, type } });
  }
  if (param.type === "tuple") {
    return encodeTuple(value, {
      param
    });
  }
  if (param.type === "address") {
    return encodeAddress(value);
  }
  if (param.type === "bool") {
    return encodeBool(value);
  }
  if (param.type.startsWith("uint") || param.type.startsWith("int")) {
    const signed = param.type.startsWith("int");
    const [, , size5 = "256"] = integerRegex2.exec(param.type) ?? [];
    return encodeNumber(value, {
      signed,
      size: Number(size5)
    });
  }
  if (param.type.startsWith("bytes")) {
    return encodeBytes(value, { param });
  }
  if (param.type === "string") {
    return encodeString(value);
  }
  throw new InvalidAbiEncodingTypeError(param.type, {
    docsPath: "/docs/contract/encodeAbiParameters"
  });
}
function encodeParams(preparedParams) {
  let staticSize = 0;
  for (let i = 0; i < preparedParams.length; i++) {
    const { dynamic, encoded } = preparedParams[i];
    if (dynamic)
      staticSize += 32;
    else
      staticSize += size(encoded);
  }
  const staticParams = [];
  const dynamicParams = [];
  let dynamicSize = 0;
  for (let i = 0; i < preparedParams.length; i++) {
    const { dynamic, encoded } = preparedParams[i];
    if (dynamic) {
      staticParams.push(numberToHex(staticSize + dynamicSize, { size: 32 }));
      dynamicParams.push(encoded);
      dynamicSize += size(encoded);
    } else {
      staticParams.push(encoded);
    }
  }
  return concat([...staticParams, ...dynamicParams]);
}
function encodeAddress(value) {
  if (!isAddress(value))
    throw new InvalidAddressError({ address: value });
  return { dynamic: false, encoded: padHex(value.toLowerCase()) };
}
function encodeArray(value, { length, param }) {
  const dynamic = length === null;
  if (!Array.isArray(value))
    throw new InvalidArrayError(value);
  if (!dynamic && value.length !== length)
    throw new AbiEncodingArrayLengthMismatchError({
      expectedLength: length,
      givenLength: value.length,
      type: `${param.type}[${length}]`
    });
  let dynamicChild = false;
  const preparedParams = [];
  for (let i = 0; i < value.length; i++) {
    const preparedParam = prepareParam({ param, value: value[i] });
    if (preparedParam.dynamic)
      dynamicChild = true;
    preparedParams.push(preparedParam);
  }
  if (dynamic || dynamicChild) {
    const data = encodeParams(preparedParams);
    if (dynamic) {
      const length2 = numberToHex(preparedParams.length, { size: 32 });
      return {
        dynamic: true,
        encoded: preparedParams.length > 0 ? concat([length2, data]) : length2
      };
    }
    if (dynamicChild)
      return { dynamic: true, encoded: data };
  }
  return {
    dynamic: false,
    encoded: concat(preparedParams.map(({ encoded }) => encoded))
  };
}
function encodeBytes(value, { param }) {
  const [, paramSize] = param.type.split("bytes");
  const bytesSize = size(value);
  if (!paramSize) {
    let value_ = value;
    if (bytesSize % 32 !== 0)
      value_ = padHex(value_, {
        dir: "right",
        size: Math.ceil((value.length - 2) / 2 / 32) * 32
      });
    return {
      dynamic: true,
      encoded: concat([padHex(numberToHex(bytesSize, { size: 32 })), value_])
    };
  }
  if (bytesSize !== Number.parseInt(paramSize))
    throw new AbiEncodingBytesSizeMismatchError({
      expectedSize: Number.parseInt(paramSize),
      value
    });
  return { dynamic: false, encoded: padHex(value, { dir: "right" }) };
}
function encodeBool(value) {
  if (typeof value !== "boolean")
    throw new BaseError2(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
  return { dynamic: false, encoded: padHex(boolToHex(value)) };
}
function encodeNumber(value, { signed, size: size5 = 256 }) {
  if (typeof size5 === "number") {
    const max = 2n ** (BigInt(size5) - (signed ? 1n : 0n)) - 1n;
    const min = signed ? -max - 1n : 0n;
    if (value > max || value < min)
      throw new IntegerOutOfRangeError({
        max: max.toString(),
        min: min.toString(),
        signed,
        size: size5 / 8,
        value: value.toString()
      });
  }
  return {
    dynamic: false,
    encoded: numberToHex(value, {
      size: 32,
      signed
    })
  };
}
function encodeString(value) {
  const hexValue = stringToHex(value);
  const partsLength = Math.ceil(size(hexValue) / 32);
  const parts = [];
  for (let i = 0; i < partsLength; i++) {
    parts.push(padHex(slice(hexValue, i * 32, (i + 1) * 32), {
      dir: "right"
    }));
  }
  return {
    dynamic: true,
    encoded: concat([
      padHex(numberToHex(size(hexValue), { size: 32 })),
      ...parts
    ])
  };
}
function encodeTuple(value, { param }) {
  let dynamic = false;
  const preparedParams = [];
  for (let i = 0; i < param.components.length; i++) {
    const param_ = param.components[i];
    const index2 = Array.isArray(value) ? i : param_.name;
    const preparedParam = prepareParam({
      param: param_,
      value: value[index2]
    });
    preparedParams.push(preparedParam);
    if (preparedParam.dynamic)
      dynamic = true;
  }
  return {
    dynamic,
    encoded: dynamic ? encodeParams(preparedParams) : concat(preparedParams.map(({ encoded }) => encoded))
  };
}
function getArrayComponents(type) {
  const matches = type.match(/^(.*)\[(\d+)?\]$/);
  return matches ? (
    // Return `null` if the array is dynamic.
    [matches[2] ? Number(matches[2]) : null, matches[1]]
  ) : void 0;
}
var init_encodeAbiParameters = __esm({
  "node_modules/viem/_esm/utils/abi/encodeAbiParameters.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_abi();
    init_address();
    init_base();
    init_encoding();
    init_isAddress();
    init_concat();
    init_pad();
    init_size();
    init_slice();
    init_toHex();
    init_regex2();
    __name(encodeAbiParameters, "encodeAbiParameters");
    __name(prepareParams, "prepareParams");
    __name(prepareParam, "prepareParam");
    __name(encodeParams, "encodeParams");
    __name(encodeAddress, "encodeAddress");
    __name(encodeArray, "encodeArray");
    __name(encodeBytes, "encodeBytes");
    __name(encodeBool, "encodeBool");
    __name(encodeNumber, "encodeNumber");
    __name(encodeString, "encodeString");
    __name(encodeTuple, "encodeTuple");
    __name(getArrayComponents, "getArrayComponents");
  }
});

// node_modules/viem/_esm/utils/hash/toFunctionSelector.js
var toFunctionSelector;
var init_toFunctionSelector = __esm({
  "node_modules/viem/_esm/utils/hash/toFunctionSelector.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_slice();
    init_toSignatureHash();
    toFunctionSelector = /* @__PURE__ */ __name((fn) => slice(toSignatureHash(fn), 0, 4), "toFunctionSelector");
  }
});

// node_modules/viem/_esm/utils/abi/getAbiItem.js
function getAbiItem(parameters) {
  const { abi: abi2, args = [], name } = parameters;
  const isSelector = isHex(name, { strict: false });
  const abiItems = abi2.filter((abiItem) => {
    if (isSelector) {
      if (abiItem.type === "function")
        return toFunctionSelector(abiItem) === name;
      if (abiItem.type === "event")
        return toEventSelector(abiItem) === name;
      return false;
    }
    return "name" in abiItem && abiItem.name === name;
  });
  if (abiItems.length === 0)
    return void 0;
  if (abiItems.length === 1)
    return abiItems[0];
  let matchedAbiItem = void 0;
  for (const abiItem of abiItems) {
    if (!("inputs" in abiItem))
      continue;
    if (!args || args.length === 0) {
      if (!abiItem.inputs || abiItem.inputs.length === 0)
        return abiItem;
      continue;
    }
    if (!abiItem.inputs)
      continue;
    if (abiItem.inputs.length === 0)
      continue;
    if (abiItem.inputs.length !== args.length)
      continue;
    const matched = args.every((arg, index2) => {
      const abiParameter = "inputs" in abiItem && abiItem.inputs[index2];
      if (!abiParameter)
        return false;
      return isArgOfType(arg, abiParameter);
    });
    if (matched) {
      if (matchedAbiItem && "inputs" in matchedAbiItem && matchedAbiItem.inputs) {
        const ambiguousTypes = getAmbiguousTypes(abiItem.inputs, matchedAbiItem.inputs, args);
        if (ambiguousTypes)
          throw new AbiItemAmbiguityError({
            abiItem,
            type: ambiguousTypes[0]
          }, {
            abiItem: matchedAbiItem,
            type: ambiguousTypes[1]
          });
      }
      matchedAbiItem = abiItem;
    }
  }
  if (matchedAbiItem)
    return matchedAbiItem;
  return abiItems[0];
}
function isArgOfType(arg, abiParameter) {
  const argType = typeof arg;
  const abiParameterType = abiParameter.type;
  switch (abiParameterType) {
    case "address":
      return isAddress(arg, { strict: false });
    case "bool":
      return argType === "boolean";
    case "function":
      return argType === "string";
    case "string":
      return argType === "string";
    default: {
      if (abiParameterType === "tuple" && "components" in abiParameter)
        return Object.values(abiParameter.components).every((component, index2) => {
          return isArgOfType(Object.values(arg)[index2], component);
        });
      if (/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(abiParameterType))
        return argType === "number" || argType === "bigint";
      if (/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(abiParameterType))
        return argType === "string" || arg instanceof Uint8Array;
      if (/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(abiParameterType)) {
        return Array.isArray(arg) && arg.every((x) => isArgOfType(x, {
          ...abiParameter,
          // Pop off `[]` or `[M]` from end of type
          type: abiParameterType.replace(/(\[[0-9]{0,}\])$/, "")
        }));
      }
      return false;
    }
  }
}
function getAmbiguousTypes(sourceParameters, targetParameters, args) {
  for (const parameterIndex in sourceParameters) {
    const sourceParameter = sourceParameters[parameterIndex];
    const targetParameter = targetParameters[parameterIndex];
    if (sourceParameter.type === "tuple" && targetParameter.type === "tuple" && "components" in sourceParameter && "components" in targetParameter)
      return getAmbiguousTypes(sourceParameter.components, targetParameter.components, args[parameterIndex]);
    const types = [sourceParameter.type, targetParameter.type];
    const ambiguous = (() => {
      if (types.includes("address") && types.includes("bytes20"))
        return true;
      if (types.includes("address") && types.includes("string"))
        return isAddress(args[parameterIndex], { strict: false });
      if (types.includes("address") && types.includes("bytes"))
        return isAddress(args[parameterIndex], { strict: false });
      return false;
    })();
    if (ambiguous)
      return types;
  }
  return;
}
var init_getAbiItem = __esm({
  "node_modules/viem/_esm/utils/abi/getAbiItem.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_abi();
    init_isHex();
    init_isAddress();
    init_toEventSelector();
    init_toFunctionSelector();
    __name(getAbiItem, "getAbiItem");
    __name(isArgOfType, "isArgOfType");
    __name(getAmbiguousTypes, "getAmbiguousTypes");
  }
});

// node_modules/viem/_esm/accounts/utils/parseAccount.js
function parseAccount(account) {
  if (typeof account === "string")
    return { address: account, type: "json-rpc" };
  return account;
}
var init_parseAccount = __esm({
  "node_modules/viem/_esm/accounts/utils/parseAccount.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    __name(parseAccount, "parseAccount");
  }
});

// node_modules/viem/_esm/utils/abi/prepareEncodeFunctionData.js
function prepareEncodeFunctionData(parameters) {
  const { abi: abi2, args, functionName } = parameters;
  let abiItem = abi2[0];
  if (functionName) {
    const item = getAbiItem({
      abi: abi2,
      args,
      name: functionName
    });
    if (!item)
      throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath2 });
    abiItem = item;
  }
  if (abiItem.type !== "function")
    throw new AbiFunctionNotFoundError(void 0, { docsPath: docsPath2 });
  return {
    abi: [abiItem],
    functionName: toFunctionSelector(formatAbiItem2(abiItem))
  };
}
var docsPath2;
var init_prepareEncodeFunctionData = __esm({
  "node_modules/viem/_esm/utils/abi/prepareEncodeFunctionData.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_abi();
    init_toFunctionSelector();
    init_formatAbiItem2();
    init_getAbiItem();
    docsPath2 = "/docs/contract/encodeFunctionData";
    __name(prepareEncodeFunctionData, "prepareEncodeFunctionData");
  }
});

// node_modules/viem/_esm/utils/abi/encodeFunctionData.js
function encodeFunctionData(parameters) {
  const { args } = parameters;
  const { abi: abi2, functionName } = (() => {
    if (parameters.abi.length === 1 && parameters.functionName?.startsWith("0x"))
      return parameters;
    return prepareEncodeFunctionData(parameters);
  })();
  const abiItem = abi2[0];
  const signature = functionName;
  const data = "inputs" in abiItem && abiItem.inputs ? encodeAbiParameters(abiItem.inputs, args ?? []) : void 0;
  return concatHex([signature, data ?? "0x"]);
}
var init_encodeFunctionData = __esm({
  "node_modules/viem/_esm/utils/abi/encodeFunctionData.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_concat();
    init_encodeAbiParameters();
    init_prepareEncodeFunctionData();
    __name(encodeFunctionData, "encodeFunctionData");
  }
});

// node_modules/viem/_esm/constants/solidity.js
var panicReasons, solidityError, solidityPanic;
var init_solidity = __esm({
  "node_modules/viem/_esm/constants/solidity.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    panicReasons = {
      1: "An `assert` condition failed.",
      17: "Arithmetic operation resulted in underflow or overflow.",
      18: "Division or modulo by zero (e.g. `5 / 0` or `23 % 0`).",
      33: "Attempted to convert to an invalid type.",
      34: "Attempted to access a storage byte array that is incorrectly encoded.",
      49: "Performed `.pop()` on an empty array",
      50: "Array index is out of bounds.",
      65: "Allocated too much memory or created an array which is too large.",
      81: "Attempted to call a zero-initialized variable of internal function type."
    };
    solidityError = {
      inputs: [
        {
          name: "message",
          type: "string"
        }
      ],
      name: "Error",
      type: "error"
    };
    solidityPanic = {
      inputs: [
        {
          name: "reason",
          type: "uint256"
        }
      ],
      name: "Panic",
      type: "error"
    };
  }
});

// node_modules/viem/_esm/errors/cursor.js
var NegativeOffsetError, PositionOutOfBoundsError, RecursiveReadLimitExceededError;
var init_cursor = __esm({
  "node_modules/viem/_esm/errors/cursor.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_base();
    NegativeOffsetError = class extends BaseError2 {
      static {
        __name(this, "NegativeOffsetError");
      }
      constructor({ offset }) {
        super(`Offset \`${offset}\` cannot be negative.`, {
          name: "NegativeOffsetError"
        });
      }
    };
    PositionOutOfBoundsError = class extends BaseError2 {
      static {
        __name(this, "PositionOutOfBoundsError");
      }
      constructor({ length, position }) {
        super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`, { name: "PositionOutOfBoundsError" });
      }
    };
    RecursiveReadLimitExceededError = class extends BaseError2 {
      static {
        __name(this, "RecursiveReadLimitExceededError");
      }
      constructor({ count, limit }) {
        super(`Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`, { name: "RecursiveReadLimitExceededError" });
      }
    };
  }
});

// node_modules/viem/_esm/utils/cursor.js
function createCursor(bytes, { recursiveReadLimit = 8192 } = {}) {
  const cursor = Object.create(staticCursor);
  cursor.bytes = bytes;
  cursor.dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  cursor.positionReadCount = /* @__PURE__ */ new Map();
  cursor.recursiveReadLimit = recursiveReadLimit;
  return cursor;
}
var staticCursor;
var init_cursor2 = __esm({
  "node_modules/viem/_esm/utils/cursor.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_cursor();
    staticCursor = {
      bytes: new Uint8Array(),
      dataView: new DataView(new ArrayBuffer(0)),
      position: 0,
      positionReadCount: /* @__PURE__ */ new Map(),
      recursiveReadCount: 0,
      recursiveReadLimit: Number.POSITIVE_INFINITY,
      assertReadLimit() {
        if (this.recursiveReadCount >= this.recursiveReadLimit)
          throw new RecursiveReadLimitExceededError({
            count: this.recursiveReadCount + 1,
            limit: this.recursiveReadLimit
          });
      },
      assertPosition(position) {
        if (position < 0 || position > this.bytes.length - 1)
          throw new PositionOutOfBoundsError({
            length: this.bytes.length,
            position
          });
      },
      decrementPosition(offset) {
        if (offset < 0)
          throw new NegativeOffsetError({ offset });
        const position = this.position - offset;
        this.assertPosition(position);
        this.position = position;
      },
      getReadCount(position) {
        return this.positionReadCount.get(position || this.position) || 0;
      },
      incrementPosition(offset) {
        if (offset < 0)
          throw new NegativeOffsetError({ offset });
        const position = this.position + offset;
        this.assertPosition(position);
        this.position = position;
      },
      inspectByte(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position);
        return this.bytes[position];
      },
      inspectBytes(length, position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + length - 1);
        return this.bytes.subarray(position, position + length);
      },
      inspectUint8(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position);
        return this.bytes[position];
      },
      inspectUint16(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 1);
        return this.dataView.getUint16(position);
      },
      inspectUint24(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 2);
        return (this.dataView.getUint16(position) << 8) + this.dataView.getUint8(position + 2);
      },
      inspectUint32(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 3);
        return this.dataView.getUint32(position);
      },
      pushByte(byte) {
        this.assertPosition(this.position);
        this.bytes[this.position] = byte;
        this.position++;
      },
      pushBytes(bytes) {
        this.assertPosition(this.position + bytes.length - 1);
        this.bytes.set(bytes, this.position);
        this.position += bytes.length;
      },
      pushUint8(value) {
        this.assertPosition(this.position);
        this.bytes[this.position] = value;
        this.position++;
      },
      pushUint16(value) {
        this.assertPosition(this.position + 1);
        this.dataView.setUint16(this.position, value);
        this.position += 2;
      },
      pushUint24(value) {
        this.assertPosition(this.position + 2);
        this.dataView.setUint16(this.position, value >> 8);
        this.dataView.setUint8(this.position + 2, value & ~4294967040);
        this.position += 3;
      },
      pushUint32(value) {
        this.assertPosition(this.position + 3);
        this.dataView.setUint32(this.position, value);
        this.position += 4;
      },
      readByte() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectByte();
        this.position++;
        return value;
      },
      readBytes(length, size5) {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectBytes(length);
        this.position += size5 ?? length;
        return value;
      },
      readUint8() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint8();
        this.position += 1;
        return value;
      },
      readUint16() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint16();
        this.position += 2;
        return value;
      },
      readUint24() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint24();
        this.position += 3;
        return value;
      },
      readUint32() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint32();
        this.position += 4;
        return value;
      },
      get remaining() {
        return this.bytes.length - this.position;
      },
      setPosition(position) {
        const oldPosition = this.position;
        this.assertPosition(position);
        this.position = position;
        return () => this.position = oldPosition;
      },
      _touch() {
        if (this.recursiveReadLimit === Number.POSITIVE_INFINITY)
          return;
        const count = this.getReadCount();
        this.positionReadCount.set(this.position, count + 1);
        if (count > 0)
          this.recursiveReadCount++;
      }
    };
    __name(createCursor, "createCursor");
  }
});

// node_modules/viem/_esm/utils/encoding/fromBytes.js
function bytesToBigInt(bytes, opts = {}) {
  if (typeof opts.size !== "undefined")
    assertSize(bytes, { size: opts.size });
  const hex = bytesToHex(bytes, opts);
  return hexToBigInt(hex, opts);
}
function bytesToBool(bytes_, opts = {}) {
  let bytes = bytes_;
  if (typeof opts.size !== "undefined") {
    assertSize(bytes, { size: opts.size });
    bytes = trim(bytes);
  }
  if (bytes.length > 1 || bytes[0] > 1)
    throw new InvalidBytesBooleanError(bytes);
  return Boolean(bytes[0]);
}
function bytesToNumber(bytes, opts = {}) {
  if (typeof opts.size !== "undefined")
    assertSize(bytes, { size: opts.size });
  const hex = bytesToHex(bytes, opts);
  return hexToNumber(hex, opts);
}
function bytesToString(bytes_, opts = {}) {
  let bytes = bytes_;
  if (typeof opts.size !== "undefined") {
    assertSize(bytes, { size: opts.size });
    bytes = trim(bytes, { dir: "right" });
  }
  return new TextDecoder().decode(bytes);
}
var init_fromBytes = __esm({
  "node_modules/viem/_esm/utils/encoding/fromBytes.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_encoding();
    init_trim();
    init_fromHex();
    init_toHex();
    __name(bytesToBigInt, "bytesToBigInt");
    __name(bytesToBool, "bytesToBool");
    __name(bytesToNumber, "bytesToNumber");
    __name(bytesToString, "bytesToString");
  }
});

// node_modules/viem/_esm/utils/abi/decodeAbiParameters.js
function decodeAbiParameters(params, data) {
  const bytes = typeof data === "string" ? hexToBytes(data) : data;
  const cursor = createCursor(bytes);
  if (size(bytes) === 0 && params.length > 0)
    throw new AbiDecodingZeroDataError();
  if (size(data) && size(data) < 32)
    throw new AbiDecodingDataSizeTooSmallError({
      data: typeof data === "string" ? data : bytesToHex(data),
      params,
      size: size(data)
    });
  let consumed = 0;
  const values = [];
  for (let i = 0; i < params.length; ++i) {
    const param = params[i];
    cursor.setPosition(consumed);
    const [data2, consumed_] = decodeParameter(cursor, param, {
      staticPosition: 0
    });
    consumed += consumed_;
    values.push(data2);
  }
  return values;
}
function decodeParameter(cursor, param, { staticPosition }) {
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents) {
    const [length, type] = arrayComponents;
    return decodeArray(cursor, { ...param, type }, { length, staticPosition });
  }
  if (param.type === "tuple")
    return decodeTuple(cursor, param, { staticPosition });
  if (param.type === "address")
    return decodeAddress(cursor);
  if (param.type === "bool")
    return decodeBool(cursor);
  if (param.type.startsWith("bytes"))
    return decodeBytes(cursor, param, { staticPosition });
  if (param.type.startsWith("uint") || param.type.startsWith("int"))
    return decodeNumber(cursor, param);
  if (param.type === "string")
    return decodeString(cursor, { staticPosition });
  throw new InvalidAbiDecodingTypeError(param.type, {
    docsPath: "/docs/contract/decodeAbiParameters"
  });
}
function decodeAddress(cursor) {
  const value = cursor.readBytes(32);
  return [checksumAddress(bytesToHex(sliceBytes(value, -20))), 32];
}
function decodeArray(cursor, param, { length, staticPosition }) {
  if (!length) {
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    const startOfData = start + sizeOfLength;
    cursor.setPosition(start);
    const length2 = bytesToNumber(cursor.readBytes(sizeOfLength));
    const dynamicChild = hasDynamicChild(param);
    let consumed2 = 0;
    const value2 = [];
    for (let i = 0; i < length2; ++i) {
      cursor.setPosition(startOfData + (dynamicChild ? i * 32 : consumed2));
      const [data, consumed_] = decodeParameter(cursor, param, {
        staticPosition: startOfData
      });
      consumed2 += consumed_;
      value2.push(data);
    }
    cursor.setPosition(staticPosition + 32);
    return [value2, 32];
  }
  if (hasDynamicChild(param)) {
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    const value2 = [];
    for (let i = 0; i < length; ++i) {
      cursor.setPosition(start + i * 32);
      const [data] = decodeParameter(cursor, param, {
        staticPosition: start
      });
      value2.push(data);
    }
    cursor.setPosition(staticPosition + 32);
    return [value2, 32];
  }
  let consumed = 0;
  const value = [];
  for (let i = 0; i < length; ++i) {
    const [data, consumed_] = decodeParameter(cursor, param, {
      staticPosition: staticPosition + consumed
    });
    consumed += consumed_;
    value.push(data);
  }
  return [value, consumed];
}
function decodeBool(cursor) {
  return [bytesToBool(cursor.readBytes(32), { size: 32 }), 32];
}
function decodeBytes(cursor, param, { staticPosition }) {
  const [_, size5] = param.type.split("bytes");
  if (!size5) {
    const offset = bytesToNumber(cursor.readBytes(32));
    cursor.setPosition(staticPosition + offset);
    const length = bytesToNumber(cursor.readBytes(32));
    if (length === 0) {
      cursor.setPosition(staticPosition + 32);
      return ["0x", 32];
    }
    const data = cursor.readBytes(length);
    cursor.setPosition(staticPosition + 32);
    return [bytesToHex(data), 32];
  }
  const value = bytesToHex(cursor.readBytes(Number.parseInt(size5), 32));
  return [value, 32];
}
function decodeNumber(cursor, param) {
  const signed = param.type.startsWith("int");
  const size5 = Number.parseInt(param.type.split("int")[1] || "256");
  const value = cursor.readBytes(32);
  return [
    size5 > 48 ? bytesToBigInt(value, { signed }) : bytesToNumber(value, { signed }),
    32
  ];
}
function decodeTuple(cursor, param, { staticPosition }) {
  const hasUnnamedChild = param.components.length === 0 || param.components.some(({ name }) => !name);
  const value = hasUnnamedChild ? [] : {};
  let consumed = 0;
  if (hasDynamicChild(param)) {
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    for (let i = 0; i < param.components.length; ++i) {
      const component = param.components[i];
      cursor.setPosition(start + consumed);
      const [data, consumed_] = decodeParameter(cursor, component, {
        staticPosition: start
      });
      consumed += consumed_;
      value[hasUnnamedChild ? i : component?.name] = data;
    }
    cursor.setPosition(staticPosition + 32);
    return [value, 32];
  }
  for (let i = 0; i < param.components.length; ++i) {
    const component = param.components[i];
    const [data, consumed_] = decodeParameter(cursor, component, {
      staticPosition
    });
    value[hasUnnamedChild ? i : component?.name] = data;
    consumed += consumed_;
  }
  return [value, consumed];
}
function decodeString(cursor, { staticPosition }) {
  const offset = bytesToNumber(cursor.readBytes(32));
  const start = staticPosition + offset;
  cursor.setPosition(start);
  const length = bytesToNumber(cursor.readBytes(32));
  if (length === 0) {
    cursor.setPosition(staticPosition + 32);
    return ["", 32];
  }
  const data = cursor.readBytes(length, 32);
  const value = bytesToString(trim(data));
  cursor.setPosition(staticPosition + 32);
  return [value, 32];
}
function hasDynamicChild(param) {
  const { type } = param;
  if (type === "string")
    return true;
  if (type === "bytes")
    return true;
  if (type.endsWith("[]"))
    return true;
  if (type === "tuple")
    return param.components?.some(hasDynamicChild);
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents && hasDynamicChild({ ...param, type: arrayComponents[1] }))
    return true;
  return false;
}
var sizeOfLength, sizeOfOffset;
var init_decodeAbiParameters = __esm({
  "node_modules/viem/_esm/utils/abi/decodeAbiParameters.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_abi();
    init_getAddress();
    init_cursor2();
    init_size();
    init_slice();
    init_trim();
    init_fromBytes();
    init_toBytes();
    init_toHex();
    init_encodeAbiParameters();
    __name(decodeAbiParameters, "decodeAbiParameters");
    __name(decodeParameter, "decodeParameter");
    sizeOfLength = 32;
    sizeOfOffset = 32;
    __name(decodeAddress, "decodeAddress");
    __name(decodeArray, "decodeArray");
    __name(decodeBool, "decodeBool");
    __name(decodeBytes, "decodeBytes");
    __name(decodeNumber, "decodeNumber");
    __name(decodeTuple, "decodeTuple");
    __name(decodeString, "decodeString");
    __name(hasDynamicChild, "hasDynamicChild");
  }
});

// node_modules/viem/_esm/utils/abi/decodeErrorResult.js
function decodeErrorResult(parameters) {
  const { abi: abi2, data } = parameters;
  const signature = slice(data, 0, 4);
  if (signature === "0x")
    throw new AbiDecodingZeroDataError();
  const abi_ = [...abi2 || [], solidityError, solidityPanic];
  const abiItem = abi_.find((x) => x.type === "error" && signature === toFunctionSelector(formatAbiItem2(x)));
  if (!abiItem)
    throw new AbiErrorSignatureNotFoundError(signature, {
      docsPath: "/docs/contract/decodeErrorResult"
    });
  return {
    abiItem,
    args: "inputs" in abiItem && abiItem.inputs && abiItem.inputs.length > 0 ? decodeAbiParameters(abiItem.inputs, slice(data, 4)) : void 0,
    errorName: abiItem.name
  };
}
var init_decodeErrorResult = __esm({
  "node_modules/viem/_esm/utils/abi/decodeErrorResult.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_solidity();
    init_abi();
    init_slice();
    init_toFunctionSelector();
    init_decodeAbiParameters();
    init_formatAbiItem2();
    __name(decodeErrorResult, "decodeErrorResult");
  }
});

// node_modules/viem/_esm/utils/stringify.js
var stringify;
var init_stringify = __esm({
  "node_modules/viem/_esm/utils/stringify.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    stringify = /* @__PURE__ */ __name((value, replacer, space) => JSON.stringify(value, (key, value_) => {
      const value2 = typeof value_ === "bigint" ? value_.toString() : value_;
      return typeof replacer === "function" ? replacer(key, value2) : value2;
    }, space), "stringify");
  }
});

// node_modules/viem/_esm/utils/abi/formatAbiItemWithArgs.js
function formatAbiItemWithArgs({ abiItem, args, includeFunctionName = true, includeName = false }) {
  if (!("name" in abiItem))
    return;
  if (!("inputs" in abiItem))
    return;
  if (!abiItem.inputs)
    return;
  return `${includeFunctionName ? abiItem.name : ""}(${abiItem.inputs.map((input, i) => `${includeName && input.name ? `${input.name}: ` : ""}${typeof args[i] === "object" ? stringify(args[i]) : args[i]}`).join(", ")})`;
}
var init_formatAbiItemWithArgs = __esm({
  "node_modules/viem/_esm/utils/abi/formatAbiItemWithArgs.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_stringify();
    __name(formatAbiItemWithArgs, "formatAbiItemWithArgs");
  }
});

// node_modules/viem/_esm/constants/unit.js
var etherUnits, gweiUnits;
var init_unit = __esm({
  "node_modules/viem/_esm/constants/unit.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    etherUnits = {
      gwei: 9,
      wei: 18
    };
    gweiUnits = {
      ether: -9,
      wei: 9
    };
  }
});

// node_modules/viem/_esm/utils/unit/formatUnits.js
function formatUnits(value, decimals) {
  let display = value.toString();
  const negative = display.startsWith("-");
  if (negative)
    display = display.slice(1);
  display = display.padStart(decimals, "0");
  let [integer, fraction] = [
    display.slice(0, display.length - decimals),
    display.slice(display.length - decimals)
  ];
  fraction = fraction.replace(/(0+)$/, "");
  return `${negative ? "-" : ""}${integer || "0"}${fraction ? `.${fraction}` : ""}`;
}
var init_formatUnits = __esm({
  "node_modules/viem/_esm/utils/unit/formatUnits.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    __name(formatUnits, "formatUnits");
  }
});

// node_modules/viem/_esm/utils/unit/formatEther.js
function formatEther(wei, unit = "wei") {
  return formatUnits(wei, etherUnits[unit]);
}
var init_formatEther = __esm({
  "node_modules/viem/_esm/utils/unit/formatEther.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_unit();
    init_formatUnits();
    __name(formatEther, "formatEther");
  }
});

// node_modules/viem/_esm/utils/unit/formatGwei.js
function formatGwei(wei, unit = "wei") {
  return formatUnits(wei, gweiUnits[unit]);
}
var init_formatGwei = __esm({
  "node_modules/viem/_esm/utils/unit/formatGwei.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_unit();
    init_formatUnits();
    __name(formatGwei, "formatGwei");
  }
});

// node_modules/viem/_esm/errors/stateOverride.js
function prettyStateMapping(stateMapping) {
  return stateMapping.reduce((pretty, { slot, value }) => {
    return `${pretty}        ${slot}: ${value}
`;
  }, "");
}
function prettyStateOverride(stateOverride) {
  return stateOverride.reduce((pretty, { address, ...state }) => {
    let val = `${pretty}    ${address}:
`;
    if (state.nonce)
      val += `      nonce: ${state.nonce}
`;
    if (state.balance)
      val += `      balance: ${state.balance}
`;
    if (state.code)
      val += `      code: ${state.code}
`;
    if (state.state) {
      val += "      state:\n";
      val += prettyStateMapping(state.state);
    }
    if (state.stateDiff) {
      val += "      stateDiff:\n";
      val += prettyStateMapping(state.stateDiff);
    }
    return val;
  }, "  State Override:\n").slice(0, -1);
}
var AccountStateConflictError, StateAssignmentConflictError;
var init_stateOverride = __esm({
  "node_modules/viem/_esm/errors/stateOverride.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_base();
    AccountStateConflictError = class extends BaseError2 {
      static {
        __name(this, "AccountStateConflictError");
      }
      constructor({ address }) {
        super(`State for account "${address}" is set multiple times.`, {
          name: "AccountStateConflictError"
        });
      }
    };
    StateAssignmentConflictError = class extends BaseError2 {
      static {
        __name(this, "StateAssignmentConflictError");
      }
      constructor() {
        super("state and stateDiff are set on the same account.", {
          name: "StateAssignmentConflictError"
        });
      }
    };
    __name(prettyStateMapping, "prettyStateMapping");
    __name(prettyStateOverride, "prettyStateOverride");
  }
});

// node_modules/viem/_esm/errors/transaction.js
function prettyPrint(args) {
  const entries = Object.entries(args).map(([key, value]) => {
    if (value === void 0 || value === false)
      return null;
    return [key, value];
  }).filter(Boolean);
  const maxLength = entries.reduce((acc, [key]) => Math.max(acc, key.length), 0);
  return entries.map(([key, value]) => `  ${`${key}:`.padEnd(maxLength + 1)}  ${value}`).join("\n");
}
var FeeConflictError, InvalidLegacyVError, InvalidSerializableTransactionError, InvalidStorageKeySizeError, TransactionExecutionError, TransactionNotFoundError, TransactionReceiptNotFoundError, WaitForTransactionReceiptTimeoutError;
var init_transaction = __esm({
  "node_modules/viem/_esm/errors/transaction.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_formatEther();
    init_formatGwei();
    init_base();
    __name(prettyPrint, "prettyPrint");
    FeeConflictError = class extends BaseError2 {
      static {
        __name(this, "FeeConflictError");
      }
      constructor() {
        super([
          "Cannot specify both a `gasPrice` and a `maxFeePerGas`/`maxPriorityFeePerGas`.",
          "Use `maxFeePerGas`/`maxPriorityFeePerGas` for EIP-1559 compatible networks, and `gasPrice` for others."
        ].join("\n"), { name: "FeeConflictError" });
      }
    };
    InvalidLegacyVError = class extends BaseError2 {
      static {
        __name(this, "InvalidLegacyVError");
      }
      constructor({ v }) {
        super(`Invalid \`v\` value "${v}". Expected 27 or 28.`, {
          name: "InvalidLegacyVError"
        });
      }
    };
    InvalidSerializableTransactionError = class extends BaseError2 {
      static {
        __name(this, "InvalidSerializableTransactionError");
      }
      constructor({ transaction }) {
        super("Cannot infer a transaction type from provided transaction.", {
          metaMessages: [
            "Provided Transaction:",
            "{",
            prettyPrint(transaction),
            "}",
            "",
            "To infer the type, either provide:",
            "- a `type` to the Transaction, or",
            "- an EIP-1559 Transaction with `maxFeePerGas`, or",
            "- an EIP-2930 Transaction with `gasPrice` & `accessList`, or",
            "- an EIP-4844 Transaction with `blobs`, `blobVersionedHashes`, `sidecars`, or",
            "- an EIP-7702 Transaction with `authorizationList`, or",
            "- a Legacy Transaction with `gasPrice`"
          ],
          name: "InvalidSerializableTransactionError"
        });
      }
    };
    InvalidStorageKeySizeError = class extends BaseError2 {
      static {
        __name(this, "InvalidStorageKeySizeError");
      }
      constructor({ storageKey }) {
        super(`Size for storage key "${storageKey}" is invalid. Expected 32 bytes. Got ${Math.floor((storageKey.length - 2) / 2)} bytes.`, { name: "InvalidStorageKeySizeError" });
      }
    };
    TransactionExecutionError = class extends BaseError2 {
      static {
        __name(this, "TransactionExecutionError");
      }
      constructor(cause, { account, docsPath: docsPath8, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value }) {
        const prettyArgs = prettyPrint({
          chain: chain && `${chain?.name} (id: ${chain?.id})`,
          from: account?.address,
          to,
          value: typeof value !== "undefined" && `${formatEther(value)} ${chain?.nativeCurrency?.symbol || "ETH"}`,
          data,
          gas,
          gasPrice: typeof gasPrice !== "undefined" && `${formatGwei(gasPrice)} gwei`,
          maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei(maxFeePerGas)} gwei`,
          maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei(maxPriorityFeePerGas)} gwei`,
          nonce
        });
        super(cause.shortMessage, {
          cause,
          docsPath: docsPath8,
          metaMessages: [
            ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
            "Request Arguments:",
            prettyArgs
          ].filter(Boolean),
          name: "TransactionExecutionError"
        });
        Object.defineProperty(this, "cause", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.cause = cause;
      }
    };
    TransactionNotFoundError = class extends BaseError2 {
      static {
        __name(this, "TransactionNotFoundError");
      }
      constructor({ blockHash, blockNumber, blockTag, hash: hash2, index: index2 }) {
        let identifier = "Transaction";
        if (blockTag && index2 !== void 0)
          identifier = `Transaction at block time "${blockTag}" at index "${index2}"`;
        if (blockHash && index2 !== void 0)
          identifier = `Transaction at block hash "${blockHash}" at index "${index2}"`;
        if (blockNumber && index2 !== void 0)
          identifier = `Transaction at block number "${blockNumber}" at index "${index2}"`;
        if (hash2)
          identifier = `Transaction with hash "${hash2}"`;
        super(`${identifier} could not be found.`, {
          name: "TransactionNotFoundError"
        });
      }
    };
    TransactionReceiptNotFoundError = class extends BaseError2 {
      static {
        __name(this, "TransactionReceiptNotFoundError");
      }
      constructor({ hash: hash2 }) {
        super(`Transaction receipt with hash "${hash2}" could not be found. The Transaction may not be processed on a block yet.`, {
          name: "TransactionReceiptNotFoundError"
        });
      }
    };
    WaitForTransactionReceiptTimeoutError = class extends BaseError2 {
      static {
        __name(this, "WaitForTransactionReceiptTimeoutError");
      }
      constructor({ hash: hash2 }) {
        super(`Timed out while waiting for transaction with hash "${hash2}" to be confirmed.`, { name: "WaitForTransactionReceiptTimeoutError" });
      }
    };
  }
});

// node_modules/viem/_esm/errors/utils.js
var getContractAddress, getUrl;
var init_utils3 = __esm({
  "node_modules/viem/_esm/errors/utils.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    getContractAddress = /* @__PURE__ */ __name((address) => address, "getContractAddress");
    getUrl = /* @__PURE__ */ __name((url) => url, "getUrl");
  }
});

// node_modules/viem/_esm/errors/contract.js
var CallExecutionError, ContractFunctionExecutionError, ContractFunctionRevertedError, ContractFunctionZeroDataError, CounterfactualDeploymentFailedError, RawContractError;
var init_contract = __esm({
  "node_modules/viem/_esm/errors/contract.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_parseAccount();
    init_solidity();
    init_decodeErrorResult();
    init_formatAbiItem2();
    init_formatAbiItemWithArgs();
    init_getAbiItem();
    init_formatEther();
    init_formatGwei();
    init_abi();
    init_base();
    init_stateOverride();
    init_transaction();
    init_utils3();
    CallExecutionError = class extends BaseError2 {
      static {
        __name(this, "CallExecutionError");
      }
      constructor(cause, { account: account_, docsPath: docsPath8, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, stateOverride }) {
        const account = account_ ? parseAccount(account_) : void 0;
        let prettyArgs = prettyPrint({
          from: account?.address,
          to,
          value: typeof value !== "undefined" && `${formatEther(value)} ${chain?.nativeCurrency?.symbol || "ETH"}`,
          data,
          gas,
          gasPrice: typeof gasPrice !== "undefined" && `${formatGwei(gasPrice)} gwei`,
          maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei(maxFeePerGas)} gwei`,
          maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei(maxPriorityFeePerGas)} gwei`,
          nonce
        });
        if (stateOverride) {
          prettyArgs += `
${prettyStateOverride(stateOverride)}`;
        }
        super(cause.shortMessage, {
          cause,
          docsPath: docsPath8,
          metaMessages: [
            ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
            "Raw Call Arguments:",
            prettyArgs
          ].filter(Boolean),
          name: "CallExecutionError"
        });
        Object.defineProperty(this, "cause", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.cause = cause;
      }
    };
    ContractFunctionExecutionError = class extends BaseError2 {
      static {
        __name(this, "ContractFunctionExecutionError");
      }
      constructor(cause, { abi: abi2, args, contractAddress, docsPath: docsPath8, functionName, sender }) {
        const abiItem = getAbiItem({ abi: abi2, args, name: functionName });
        const formattedArgs = abiItem ? formatAbiItemWithArgs({
          abiItem,
          args,
          includeFunctionName: false,
          includeName: false
        }) : void 0;
        const functionWithParams = abiItem ? formatAbiItem2(abiItem, { includeName: true }) : void 0;
        const prettyArgs = prettyPrint({
          address: contractAddress && getContractAddress(contractAddress),
          function: functionWithParams,
          args: formattedArgs && formattedArgs !== "()" && `${[...Array(functionName?.length ?? 0).keys()].map(() => " ").join("")}${formattedArgs}`,
          sender
        });
        super(cause.shortMessage || `An unknown error occurred while executing the contract function "${functionName}".`, {
          cause,
          docsPath: docsPath8,
          metaMessages: [
            ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
            prettyArgs && "Contract Call:",
            prettyArgs
          ].filter(Boolean),
          name: "ContractFunctionExecutionError"
        });
        Object.defineProperty(this, "abi", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "args", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "cause", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "contractAddress", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "formattedArgs", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "functionName", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "sender", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.abi = abi2;
        this.args = args;
        this.cause = cause;
        this.contractAddress = contractAddress;
        this.functionName = functionName;
        this.sender = sender;
      }
    };
    ContractFunctionRevertedError = class extends BaseError2 {
      static {
        __name(this, "ContractFunctionRevertedError");
      }
      constructor({ abi: abi2, data, functionName, message }) {
        let cause;
        let decodedData = void 0;
        let metaMessages;
        let reason;
        if (data && data !== "0x") {
          try {
            decodedData = decodeErrorResult({ abi: abi2, data });
            const { abiItem, errorName, args: errorArgs } = decodedData;
            if (errorName === "Error") {
              reason = errorArgs[0];
            } else if (errorName === "Panic") {
              const [firstArg] = errorArgs;
              reason = panicReasons[firstArg];
            } else {
              const errorWithParams = abiItem ? formatAbiItem2(abiItem, { includeName: true }) : void 0;
              const formattedArgs = abiItem && errorArgs ? formatAbiItemWithArgs({
                abiItem,
                args: errorArgs,
                includeFunctionName: false,
                includeName: false
              }) : void 0;
              metaMessages = [
                errorWithParams ? `Error: ${errorWithParams}` : "",
                formattedArgs && formattedArgs !== "()" ? `       ${[...Array(errorName?.length ?? 0).keys()].map(() => " ").join("")}${formattedArgs}` : ""
              ];
            }
          } catch (err) {
            cause = err;
          }
        } else if (message)
          reason = message;
        let signature;
        if (cause instanceof AbiErrorSignatureNotFoundError) {
          signature = cause.signature;
          metaMessages = [
            `Unable to decode signature "${signature}" as it was not found on the provided ABI.`,
            "Make sure you are using the correct ABI and that the error exists on it.",
            `You can look up the decoded signature here: https://openchain.xyz/signatures?query=${signature}.`
          ];
        }
        super(reason && reason !== "execution reverted" || signature ? [
          `The contract function "${functionName}" reverted with the following ${signature ? "signature" : "reason"}:`,
          reason || signature
        ].join("\n") : `The contract function "${functionName}" reverted.`, {
          cause,
          metaMessages,
          name: "ContractFunctionRevertedError"
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "raw", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "reason", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "signature", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.data = decodedData;
        this.raw = data;
        this.reason = reason;
        this.signature = signature;
      }
    };
    ContractFunctionZeroDataError = class extends BaseError2 {
      static {
        __name(this, "ContractFunctionZeroDataError");
      }
      constructor({ functionName }) {
        super(`The contract function "${functionName}" returned no data ("0x").`, {
          metaMessages: [
            "This could be due to any of the following:",
            `  - The contract does not have the function "${functionName}",`,
            "  - The parameters passed to the contract function may be invalid, or",
            "  - The address is not a contract."
          ],
          name: "ContractFunctionZeroDataError"
        });
      }
    };
    CounterfactualDeploymentFailedError = class extends BaseError2 {
      static {
        __name(this, "CounterfactualDeploymentFailedError");
      }
      constructor({ factory }) {
        super(`Deployment for counterfactual contract call failed${factory ? ` for factory "${factory}".` : ""}`, {
          metaMessages: [
            "Please ensure:",
            "- The `factory` is a valid contract deployment factory (ie. Create2 Factory, ERC-4337 Factory, etc).",
            "- The `factoryData` is a valid encoded function call for contract deployment function on the factory."
          ],
          name: "CounterfactualDeploymentFailedError"
        });
      }
    };
    RawContractError = class extends BaseError2 {
      static {
        __name(this, "RawContractError");
      }
      constructor({ data, message }) {
        super(message || "", { name: "RawContractError" });
        Object.defineProperty(this, "code", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 3
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.data = data;
      }
    };
  }
});

// node_modules/viem/_esm/errors/request.js
var HttpRequestError, RpcRequestError, TimeoutError;
var init_request = __esm({
  "node_modules/viem/_esm/errors/request.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_stringify();
    init_base();
    init_utils3();
    HttpRequestError = class extends BaseError2 {
      static {
        __name(this, "HttpRequestError");
      }
      constructor({ body, cause, details, headers, status, url }) {
        super("HTTP request failed.", {
          cause,
          details,
          metaMessages: [
            status && `Status: ${status}`,
            `URL: ${getUrl(url)}`,
            body && `Request body: ${stringify(body)}`
          ].filter(Boolean),
          name: "HttpRequestError"
        });
        Object.defineProperty(this, "body", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "headers", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "status", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "url", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.body = body;
        this.headers = headers;
        this.status = status;
        this.url = url;
      }
    };
    RpcRequestError = class extends BaseError2 {
      static {
        __name(this, "RpcRequestError");
      }
      constructor({ body, error, url }) {
        super("RPC Request failed.", {
          cause: error,
          details: error.message,
          metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
          name: "RpcRequestError"
        });
        Object.defineProperty(this, "code", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.code = error.code;
        this.data = error.data;
      }
    };
    TimeoutError = class extends BaseError2 {
      static {
        __name(this, "TimeoutError");
      }
      constructor({ body, url }) {
        super("The request took too long to respond.", {
          details: "The request timed out.",
          metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
          name: "TimeoutError"
        });
      }
    };
  }
});

// node_modules/viem/_esm/errors/rpc.js
var unknownErrorCode, RpcError, ProviderRpcError, ParseRpcError, InvalidRequestRpcError, MethodNotFoundRpcError, InvalidParamsRpcError, InternalRpcError, InvalidInputRpcError, ResourceNotFoundRpcError, ResourceUnavailableRpcError, TransactionRejectedRpcError, MethodNotSupportedRpcError, LimitExceededRpcError, JsonRpcVersionUnsupportedError, UserRejectedRequestError, UnauthorizedProviderError, UnsupportedProviderMethodError, ProviderDisconnectedError, ChainDisconnectedError, SwitchChainError, UnsupportedNonOptionalCapabilityError, UnsupportedChainIdError, DuplicateIdError, UnknownBundleIdError, BundleTooLargeError, AtomicReadyWalletRejectedUpgradeError, AtomicityNotSupportedError, UnknownRpcError;
var init_rpc = __esm({
  "node_modules/viem/_esm/errors/rpc.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_base();
    init_request();
    unknownErrorCode = -1;
    RpcError = class extends BaseError2 {
      static {
        __name(this, "RpcError");
      }
      constructor(cause, { code, docsPath: docsPath8, metaMessages, name, shortMessage }) {
        super(shortMessage, {
          cause,
          docsPath: docsPath8,
          metaMessages: metaMessages || cause?.metaMessages,
          name: name || "RpcError"
        });
        Object.defineProperty(this, "code", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.name = name || cause.name;
        this.code = cause instanceof RpcRequestError ? cause.code : code ?? unknownErrorCode;
      }
    };
    ProviderRpcError = class extends RpcError {
      static {
        __name(this, "ProviderRpcError");
      }
      constructor(cause, options) {
        super(cause, options);
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.data = options.data;
      }
    };
    ParseRpcError = class _ParseRpcError extends RpcError {
      static {
        __name(this, "ParseRpcError");
      }
      constructor(cause) {
        super(cause, {
          code: _ParseRpcError.code,
          name: "ParseRpcError",
          shortMessage: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
        });
      }
    };
    Object.defineProperty(ParseRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32700
    });
    InvalidRequestRpcError = class _InvalidRequestRpcError extends RpcError {
      static {
        __name(this, "InvalidRequestRpcError");
      }
      constructor(cause) {
        super(cause, {
          code: _InvalidRequestRpcError.code,
          name: "InvalidRequestRpcError",
          shortMessage: "JSON is not a valid request object."
        });
      }
    };
    Object.defineProperty(InvalidRequestRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32600
    });
    MethodNotFoundRpcError = class _MethodNotFoundRpcError extends RpcError {
      static {
        __name(this, "MethodNotFoundRpcError");
      }
      constructor(cause, { method } = {}) {
        super(cause, {
          code: _MethodNotFoundRpcError.code,
          name: "MethodNotFoundRpcError",
          shortMessage: `The method${method ? ` "${method}"` : ""} does not exist / is not available.`
        });
      }
    };
    Object.defineProperty(MethodNotFoundRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32601
    });
    InvalidParamsRpcError = class _InvalidParamsRpcError extends RpcError {
      static {
        __name(this, "InvalidParamsRpcError");
      }
      constructor(cause) {
        super(cause, {
          code: _InvalidParamsRpcError.code,
          name: "InvalidParamsRpcError",
          shortMessage: [
            "Invalid parameters were provided to the RPC method.",
            "Double check you have provided the correct parameters."
          ].join("\n")
        });
      }
    };
    Object.defineProperty(InvalidParamsRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32602
    });
    InternalRpcError = class _InternalRpcError extends RpcError {
      static {
        __name(this, "InternalRpcError");
      }
      constructor(cause) {
        super(cause, {
          code: _InternalRpcError.code,
          name: "InternalRpcError",
          shortMessage: "An internal error was received."
        });
      }
    };
    Object.defineProperty(InternalRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32603
    });
    InvalidInputRpcError = class _InvalidInputRpcError extends RpcError {
      static {
        __name(this, "InvalidInputRpcError");
      }
      constructor(cause) {
        super(cause, {
          code: _InvalidInputRpcError.code,
          name: "InvalidInputRpcError",
          shortMessage: [
            "Missing or invalid parameters.",
            "Double check you have provided the correct parameters."
          ].join("\n")
        });
      }
    };
    Object.defineProperty(InvalidInputRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32e3
    });
    ResourceNotFoundRpcError = class _ResourceNotFoundRpcError extends RpcError {
      static {
        __name(this, "ResourceNotFoundRpcError");
      }
      constructor(cause) {
        super(cause, {
          code: _ResourceNotFoundRpcError.code,
          name: "ResourceNotFoundRpcError",
          shortMessage: "Requested resource not found."
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "ResourceNotFoundRpcError"
        });
      }
    };
    Object.defineProperty(ResourceNotFoundRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32001
    });
    ResourceUnavailableRpcError = class _ResourceUnavailableRpcError extends RpcError {
      static {
        __name(this, "ResourceUnavailableRpcError");
      }
      constructor(cause) {
        super(cause, {
          code: _ResourceUnavailableRpcError.code,
          name: "ResourceUnavailableRpcError",
          shortMessage: "Requested resource not available."
        });
      }
    };
    Object.defineProperty(ResourceUnavailableRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32002
    });
    TransactionRejectedRpcError = class _TransactionRejectedRpcError extends RpcError {
      static {
        __name(this, "TransactionRejectedRpcError");
      }
      constructor(cause) {
        super(cause, {
          code: _TransactionRejectedRpcError.code,
          name: "TransactionRejectedRpcError",
          shortMessage: "Transaction creation failed."
        });
      }
    };
    Object.defineProperty(TransactionRejectedRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32003
    });
    MethodNotSupportedRpcError = class _MethodNotSupportedRpcError extends RpcError {
      static {
        __name(this, "MethodNotSupportedRpcError");
      }
      constructor(cause, { method } = {}) {
        super(cause, {
          code: _MethodNotSupportedRpcError.code,
          name: "MethodNotSupportedRpcError",
          shortMessage: `Method${method ? ` "${method}"` : ""} is not supported.`
        });
      }
    };
    Object.defineProperty(MethodNotSupportedRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32004
    });
    LimitExceededRpcError = class _LimitExceededRpcError extends RpcError {
      static {
        __name(this, "LimitExceededRpcError");
      }
      constructor(cause) {
        super(cause, {
          code: _LimitExceededRpcError.code,
          name: "LimitExceededRpcError",
          shortMessage: "Request exceeds defined limit."
        });
      }
    };
    Object.defineProperty(LimitExceededRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32005
    });
    JsonRpcVersionUnsupportedError = class _JsonRpcVersionUnsupportedError extends RpcError {
      static {
        __name(this, "JsonRpcVersionUnsupportedError");
      }
      constructor(cause) {
        super(cause, {
          code: _JsonRpcVersionUnsupportedError.code,
          name: "JsonRpcVersionUnsupportedError",
          shortMessage: "Version of JSON-RPC protocol is not supported."
        });
      }
    };
    Object.defineProperty(JsonRpcVersionUnsupportedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32006
    });
    UserRejectedRequestError = class _UserRejectedRequestError extends ProviderRpcError {
      static {
        __name(this, "UserRejectedRequestError");
      }
      constructor(cause) {
        super(cause, {
          code: _UserRejectedRequestError.code,
          name: "UserRejectedRequestError",
          shortMessage: "User rejected the request."
        });
      }
    };
    Object.defineProperty(UserRejectedRequestError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4001
    });
    UnauthorizedProviderError = class _UnauthorizedProviderError extends ProviderRpcError {
      static {
        __name(this, "UnauthorizedProviderError");
      }
      constructor(cause) {
        super(cause, {
          code: _UnauthorizedProviderError.code,
          name: "UnauthorizedProviderError",
          shortMessage: "The requested method and/or account has not been authorized by the user."
        });
      }
    };
    Object.defineProperty(UnauthorizedProviderError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4100
    });
    UnsupportedProviderMethodError = class _UnsupportedProviderMethodError extends ProviderRpcError {
      static {
        __name(this, "UnsupportedProviderMethodError");
      }
      constructor(cause, { method } = {}) {
        super(cause, {
          code: _UnsupportedProviderMethodError.code,
          name: "UnsupportedProviderMethodError",
          shortMessage: `The Provider does not support the requested method${method ? ` " ${method}"` : ""}.`
        });
      }
    };
    Object.defineProperty(UnsupportedProviderMethodError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4200
    });
    ProviderDisconnectedError = class _ProviderDisconnectedError extends ProviderRpcError {
      static {
        __name(this, "ProviderDisconnectedError");
      }
      constructor(cause) {
        super(cause, {
          code: _ProviderDisconnectedError.code,
          name: "ProviderDisconnectedError",
          shortMessage: "The Provider is disconnected from all chains."
        });
      }
    };
    Object.defineProperty(ProviderDisconnectedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4900
    });
    ChainDisconnectedError = class _ChainDisconnectedError extends ProviderRpcError {
      static {
        __name(this, "ChainDisconnectedError");
      }
      constructor(cause) {
        super(cause, {
          code: _ChainDisconnectedError.code,
          name: "ChainDisconnectedError",
          shortMessage: "The Provider is not connected to the requested chain."
        });
      }
    };
    Object.defineProperty(ChainDisconnectedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4901
    });
    SwitchChainError = class _SwitchChainError extends ProviderRpcError {
      static {
        __name(this, "SwitchChainError");
      }
      constructor(cause) {
        super(cause, {
          code: _SwitchChainError.code,
          name: "SwitchChainError",
          shortMessage: "An error occurred when attempting to switch chain."
        });
      }
    };
    Object.defineProperty(SwitchChainError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4902
    });
    UnsupportedNonOptionalCapabilityError = class _UnsupportedNonOptionalCapabilityError extends ProviderRpcError {
      static {
        __name(this, "UnsupportedNonOptionalCapabilityError");
      }
      constructor(cause) {
        super(cause, {
          code: _UnsupportedNonOptionalCapabilityError.code,
          name: "UnsupportedNonOptionalCapabilityError",
          shortMessage: "This Wallet does not support a capability that was not marked as optional."
        });
      }
    };
    Object.defineProperty(UnsupportedNonOptionalCapabilityError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5700
    });
    UnsupportedChainIdError = class _UnsupportedChainIdError extends ProviderRpcError {
      static {
        __name(this, "UnsupportedChainIdError");
      }
      constructor(cause) {
        super(cause, {
          code: _UnsupportedChainIdError.code,
          name: "UnsupportedChainIdError",
          shortMessage: "This Wallet does not support the requested chain ID."
        });
      }
    };
    Object.defineProperty(UnsupportedChainIdError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5710
    });
    DuplicateIdError = class _DuplicateIdError extends ProviderRpcError {
      static {
        __name(this, "DuplicateIdError");
      }
      constructor(cause) {
        super(cause, {
          code: _DuplicateIdError.code,
          name: "DuplicateIdError",
          shortMessage: "There is already a bundle submitted with this ID."
        });
      }
    };
    Object.defineProperty(DuplicateIdError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5720
    });
    UnknownBundleIdError = class _UnknownBundleIdError extends ProviderRpcError {
      static {
        __name(this, "UnknownBundleIdError");
      }
      constructor(cause) {
        super(cause, {
          code: _UnknownBundleIdError.code,
          name: "UnknownBundleIdError",
          shortMessage: "This bundle id is unknown / has not been submitted"
        });
      }
    };
    Object.defineProperty(UnknownBundleIdError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5730
    });
    BundleTooLargeError = class _BundleTooLargeError extends ProviderRpcError {
      static {
        __name(this, "BundleTooLargeError");
      }
      constructor(cause) {
        super(cause, {
          code: _BundleTooLargeError.code,
          name: "BundleTooLargeError",
          shortMessage: "The call bundle is too large for the Wallet to process."
        });
      }
    };
    Object.defineProperty(BundleTooLargeError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5740
    });
    AtomicReadyWalletRejectedUpgradeError = class _AtomicReadyWalletRejectedUpgradeError extends ProviderRpcError {
      static {
        __name(this, "AtomicReadyWalletRejectedUpgradeError");
      }
      constructor(cause) {
        super(cause, {
          code: _AtomicReadyWalletRejectedUpgradeError.code,
          name: "AtomicReadyWalletRejectedUpgradeError",
          shortMessage: "The Wallet can support atomicity after an upgrade, but the user rejected the upgrade."
        });
      }
    };
    Object.defineProperty(AtomicReadyWalletRejectedUpgradeError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5750
    });
    AtomicityNotSupportedError = class _AtomicityNotSupportedError extends ProviderRpcError {
      static {
        __name(this, "AtomicityNotSupportedError");
      }
      constructor(cause) {
        super(cause, {
          code: _AtomicityNotSupportedError.code,
          name: "AtomicityNotSupportedError",
          shortMessage: "The wallet does not support atomic execution but the request requires it."
        });
      }
    };
    Object.defineProperty(AtomicityNotSupportedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5760
    });
    UnknownRpcError = class extends RpcError {
      static {
        __name(this, "UnknownRpcError");
      }
      constructor(cause) {
        super(cause, {
          name: "UnknownRpcError",
          shortMessage: "An unknown RPC error occurred."
        });
      }
    };
  }
});

// node_modules/viem/node_modules/@noble/hashes/esm/_md.js
function setBigUint64(view, byteOffset, value, isLE2) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE2);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE2 ? 4 : 0;
  const l = isLE2 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE2);
  view.setUint32(byteOffset + l, wl, isLE2);
}
function Chi(a, b, c) {
  return a & b ^ ~a & c;
}
function Maj(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
var HashMD, SHA256_IV;
var init_md = __esm({
  "node_modules/viem/node_modules/@noble/hashes/esm/_md.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_utils2();
    __name(setBigUint64, "setBigUint64");
    __name(Chi, "Chi");
    __name(Maj, "Maj");
    HashMD = class extends Hash {
      static {
        __name(this, "HashMD");
      }
      constructor(blockLen, outputLen, padOffset, isLE2) {
        super();
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE2;
        this.buffer = new Uint8Array(blockLen);
        this.view = createView(this.buffer);
      }
      update(data) {
        aexists(this);
        data = toBytes2(data);
        abytes(data);
        const { view, buffer: buffer2, blockLen } = this;
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          if (take === blockLen) {
            const dataView = createView(data);
            for (; blockLen <= len - pos; pos += blockLen)
              this.process(dataView, pos);
            continue;
          }
          buffer2.set(data.subarray(pos, pos + take), this.pos);
          this.pos += take;
          pos += take;
          if (this.pos === blockLen) {
            this.process(view, 0);
            this.pos = 0;
          }
        }
        this.length += data.length;
        this.roundClean();
        return this;
      }
      digestInto(out) {
        aexists(this);
        aoutput(out, this);
        this.finished = true;
        const { buffer: buffer2, view, blockLen, isLE: isLE2 } = this;
        let { pos } = this;
        buffer2[pos++] = 128;
        clean(this.buffer.subarray(pos));
        if (this.padOffset > blockLen - pos) {
          this.process(view, 0);
          pos = 0;
        }
        for (let i = pos; i < blockLen; i++)
          buffer2[i] = 0;
        setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
        this.process(view, 0);
        const oview = createView(out);
        const len = this.outputLen;
        if (len % 4)
          throw new Error("_sha2: outputLen should be aligned to 32bit");
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length)
          throw new Error("_sha2: outputLen bigger than state");
        for (let i = 0; i < outLen; i++)
          oview.setUint32(4 * i, state[i], isLE2);
      }
      digest() {
        const { buffer: buffer2, outputLen } = this;
        this.digestInto(buffer2);
        const res = buffer2.slice(0, outputLen);
        this.destroy();
        return res;
      }
      _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer: buffer2, length, finished, destroyed, pos } = this;
        to.destroyed = destroyed;
        to.finished = finished;
        to.length = length;
        to.pos = pos;
        if (length % blockLen)
          to.buffer.set(buffer2);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
    };
    SHA256_IV = /* @__PURE__ */ Uint32Array.from([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]);
  }
});

// node_modules/viem/node_modules/@noble/hashes/esm/sha2.js
var SHA256_K, SHA256_W, SHA256, sha256;
var init_sha2 = __esm({
  "node_modules/viem/node_modules/@noble/hashes/esm/sha2.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_md();
    init_utils2();
    SHA256_K = /* @__PURE__ */ Uint32Array.from([
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ]);
    SHA256_W = /* @__PURE__ */ new Uint32Array(64);
    SHA256 = class extends HashMD {
      static {
        __name(this, "SHA256");
      }
      constructor(outputLen = 32) {
        super(64, outputLen, 8, false);
        this.A = SHA256_IV[0] | 0;
        this.B = SHA256_IV[1] | 0;
        this.C = SHA256_IV[2] | 0;
        this.D = SHA256_IV[3] | 0;
        this.E = SHA256_IV[4] | 0;
        this.F = SHA256_IV[5] | 0;
        this.G = SHA256_IV[6] | 0;
        this.H = SHA256_IV[7] | 0;
      }
      get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
      }
      // prettier-ignore
      set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          SHA256_W[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
          const W15 = SHA256_W[i - 15];
          const W2 = SHA256_W[i - 2];
          const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
          const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
          SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
        }
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
          const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
          const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
          const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
          const T2 = sigma0 + Maj(A, B, C) | 0;
          H = G;
          G = F;
          F = E;
          E = D + T1 | 0;
          D = C;
          C = B;
          B = A;
          A = T1 + T2 | 0;
        }
        A = A + this.A | 0;
        B = B + this.B | 0;
        C = C + this.C | 0;
        D = D + this.D | 0;
        E = E + this.E | 0;
        F = F + this.F | 0;
        G = G + this.G | 0;
        H = H + this.H | 0;
        this.set(A, B, C, D, E, F, G, H);
      }
      roundClean() {
        clean(SHA256_W);
      }
      destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        clean(this.buffer);
      }
    };
    sha256 = /* @__PURE__ */ createHasher(() => new SHA256());
  }
});

// node_modules/viem/node_modules/@noble/hashes/esm/hmac.js
var HMAC, hmac;
var init_hmac = __esm({
  "node_modules/viem/node_modules/@noble/hashes/esm/hmac.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_utils2();
    HMAC = class extends Hash {
      static {
        __name(this, "HMAC");
      }
      constructor(hash2, _key) {
        super();
        this.finished = false;
        this.destroyed = false;
        ahash(hash2);
        const key = toBytes2(_key);
        this.iHash = hash2.create();
        if (typeof this.iHash.update !== "function")
          throw new Error("Expected instance of class which extends utils.Hash");
        this.blockLen = this.iHash.blockLen;
        this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen;
        const pad4 = new Uint8Array(blockLen);
        pad4.set(key.length > blockLen ? hash2.create().update(key).digest() : key);
        for (let i = 0; i < pad4.length; i++)
          pad4[i] ^= 54;
        this.iHash.update(pad4);
        this.oHash = hash2.create();
        for (let i = 0; i < pad4.length; i++)
          pad4[i] ^= 54 ^ 92;
        this.oHash.update(pad4);
        clean(pad4);
      }
      update(buf) {
        aexists(this);
        this.iHash.update(buf);
        return this;
      }
      digestInto(out) {
        aexists(this);
        abytes(out, this.outputLen);
        this.finished = true;
        this.iHash.digestInto(out);
        this.oHash.update(out);
        this.oHash.digestInto(out);
        this.destroy();
      }
      digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out);
        return out;
      }
      _cloneInto(to) {
        to || (to = Object.create(Object.getPrototypeOf(this), {}));
        const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
        to = to;
        to.finished = finished;
        to.destroyed = destroyed;
        to.blockLen = blockLen;
        to.outputLen = outputLen;
        to.oHash = oHash._cloneInto(to.oHash);
        to.iHash = iHash._cloneInto(to.iHash);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
      destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
      }
    };
    hmac = /* @__PURE__ */ __name((hash2, key, message) => new HMAC(hash2, key).update(message).digest(), "hmac");
    hmac.create = (hash2, key) => new HMAC(hash2, key);
  }
});

// node_modules/viem/node_modules/@noble/curves/esm/utils.js
function abool(title, value) {
  if (typeof value !== "boolean")
    throw new Error(title + " boolean expected, got " + value);
}
function numberToHexUnpadded(num2) {
  const hex = num2.toString(16);
  return hex.length & 1 ? "0" + hex : hex;
}
function hexToNumber2(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  return hex === "" ? _0n2 : BigInt("0x" + hex);
}
function bytesToNumberBE(bytes) {
  return hexToNumber2(bytesToHex2(bytes));
}
function bytesToNumberLE(bytes) {
  abytes(bytes);
  return hexToNumber2(bytesToHex2(Uint8Array.from(bytes).reverse()));
}
function numberToBytesBE(n, len) {
  return hexToBytes2(n.toString(16).padStart(len * 2, "0"));
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
function ensureBytes(title, hex, expectedLength) {
  let res;
  if (typeof hex === "string") {
    try {
      res = hexToBytes2(hex);
    } catch (e) {
      throw new Error(title + " must be hex string or Uint8Array, cause: " + e);
    }
  } else if (isBytes(hex)) {
    res = Uint8Array.from(hex);
  } else {
    throw new Error(title + " must be hex string or Uint8Array");
  }
  const len = res.length;
  if (typeof expectedLength === "number" && len !== expectedLength)
    throw new Error(title + " of length " + expectedLength + " expected, got " + len);
  return res;
}
function inRange(n, min, max) {
  return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
function aInRange(title, n, min, max) {
  if (!inRange(n, min, max))
    throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
function bitLen(n) {
  let len;
  for (len = 0; n > _0n2; n >>= _1n2, len += 1)
    ;
  return len;
}
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
  if (typeof hashLen !== "number" || hashLen < 2)
    throw new Error("hashLen must be a number");
  if (typeof qByteLen !== "number" || qByteLen < 2)
    throw new Error("qByteLen must be a number");
  if (typeof hmacFn !== "function")
    throw new Error("hmacFn must be a function");
  const u8n = /* @__PURE__ */ __name((len) => new Uint8Array(len), "u8n");
  const u8of = /* @__PURE__ */ __name((byte) => Uint8Array.of(byte), "u8of");
  let v = u8n(hashLen);
  let k = u8n(hashLen);
  let i = 0;
  const reset = /* @__PURE__ */ __name(() => {
    v.fill(1);
    k.fill(0);
    i = 0;
  }, "reset");
  const h = /* @__PURE__ */ __name((...b) => hmacFn(k, v, ...b), "h");
  const reseed = /* @__PURE__ */ __name((seed = u8n(0)) => {
    k = h(u8of(0), seed);
    v = h();
    if (seed.length === 0)
      return;
    k = h(u8of(1), seed);
    v = h();
  }, "reseed");
  const gen2 = /* @__PURE__ */ __name(() => {
    if (i++ >= 1e3)
      throw new Error("drbg: tried 1000 values");
    let len = 0;
    const out = [];
    while (len < qByteLen) {
      v = h();
      const sl = v.slice();
      out.push(sl);
      len += v.length;
    }
    return concatBytes(...out);
  }, "gen");
  const genUntil = /* @__PURE__ */ __name((seed, pred) => {
    reset();
    reseed(seed);
    let res = void 0;
    while (!(res = pred(gen2())))
      reseed();
    reset();
    return res;
  }, "genUntil");
  return genUntil;
}
function isHash(val) {
  return typeof val === "function" && Number.isSafeInteger(val.outputLen);
}
function _validateObject(object, fields, optFields = {}) {
  if (!object || typeof object !== "object")
    throw new Error("expected valid options object");
  function checkField(fieldName, expectedType, isOpt) {
    const val = object[fieldName];
    if (isOpt && val === void 0)
      return;
    const current = typeof val;
    if (current !== expectedType || val === null)
      throw new Error(`param "${fieldName}" is invalid: expected ${expectedType}, got ${current}`);
  }
  __name(checkField, "checkField");
  Object.entries(fields).forEach(([k, v]) => checkField(k, v, false));
  Object.entries(optFields).forEach(([k, v]) => checkField(k, v, true));
}
function memoized(fn) {
  const map = /* @__PURE__ */ new WeakMap();
  return (arg, ...args) => {
    const val = map.get(arg);
    if (val !== void 0)
      return val;
    const computed = fn(arg, ...args);
    map.set(arg, computed);
    return computed;
  };
}
var _0n2, _1n2, isPosBig, bitMask;
var init_utils4 = __esm({
  "node_modules/viem/node_modules/@noble/curves/esm/utils.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_utils2();
    init_utils2();
    _0n2 = /* @__PURE__ */ BigInt(0);
    _1n2 = /* @__PURE__ */ BigInt(1);
    __name(abool, "abool");
    __name(numberToHexUnpadded, "numberToHexUnpadded");
    __name(hexToNumber2, "hexToNumber");
    __name(bytesToNumberBE, "bytesToNumberBE");
    __name(bytesToNumberLE, "bytesToNumberLE");
    __name(numberToBytesBE, "numberToBytesBE");
    __name(numberToBytesLE, "numberToBytesLE");
    __name(ensureBytes, "ensureBytes");
    isPosBig = /* @__PURE__ */ __name((n) => typeof n === "bigint" && _0n2 <= n, "isPosBig");
    __name(inRange, "inRange");
    __name(aInRange, "aInRange");
    __name(bitLen, "bitLen");
    bitMask = /* @__PURE__ */ __name((n) => (_1n2 << BigInt(n)) - _1n2, "bitMask");
    __name(createHmacDrbg, "createHmacDrbg");
    __name(isHash, "isHash");
    __name(_validateObject, "_validateObject");
    __name(memoized, "memoized");
  }
});

// node_modules/viem/node_modules/@noble/curves/esm/abstract/modular.js
function mod(a, b) {
  const result = a % b;
  return result >= _0n3 ? result : b + result;
}
function pow2(x, power, modulo) {
  let res = x;
  while (power-- > _0n3) {
    res *= res;
    res %= modulo;
  }
  return res;
}
function invert(number, modulo) {
  if (number === _0n3)
    throw new Error("invert: expected non-zero number");
  if (modulo <= _0n3)
    throw new Error("invert: expected positive modulus, got " + modulo);
  let a = mod(number, modulo);
  let b = modulo;
  let x = _0n3, y = _1n3, u = _1n3, v = _0n3;
  while (a !== _0n3) {
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    const n = y - v * q;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  const gcd = b;
  if (gcd !== _1n3)
    throw new Error("invert: does not exist");
  return mod(x, modulo);
}
function sqrt3mod4(Fp, n) {
  const p1div4 = (Fp.ORDER + _1n3) / _4n;
  const root = Fp.pow(n, p1div4);
  if (!Fp.eql(Fp.sqr(root), n))
    throw new Error("Cannot find square root");
  return root;
}
function sqrt5mod8(Fp, n) {
  const p5div8 = (Fp.ORDER - _5n) / _8n;
  const n2 = Fp.mul(n, _2n2);
  const v = Fp.pow(n2, p5div8);
  const nv = Fp.mul(n, v);
  const i = Fp.mul(Fp.mul(nv, _2n2), v);
  const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
  if (!Fp.eql(Fp.sqr(root), n))
    throw new Error("Cannot find square root");
  return root;
}
function tonelliShanks(P) {
  if (P < BigInt(3))
    throw new Error("sqrt is not defined for small field");
  let Q = P - _1n3;
  let S = 0;
  while (Q % _2n2 === _0n3) {
    Q /= _2n2;
    S++;
  }
  let Z = _2n2;
  const _Fp = Field(P);
  while (FpLegendre(_Fp, Z) === 1) {
    if (Z++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  }
  if (S === 1)
    return sqrt3mod4;
  let cc = _Fp.pow(Z, Q);
  const Q1div2 = (Q + _1n3) / _2n2;
  return /* @__PURE__ */ __name(function tonelliSlow(Fp, n) {
    if (Fp.is0(n))
      return n;
    if (FpLegendre(Fp, n) !== 1)
      throw new Error("Cannot find square root");
    let M = S;
    let c = Fp.mul(Fp.ONE, cc);
    let t = Fp.pow(n, Q);
    let R = Fp.pow(n, Q1div2);
    while (!Fp.eql(t, Fp.ONE)) {
      if (Fp.is0(t))
        return Fp.ZERO;
      let i = 1;
      let t_tmp = Fp.sqr(t);
      while (!Fp.eql(t_tmp, Fp.ONE)) {
        i++;
        t_tmp = Fp.sqr(t_tmp);
        if (i === M)
          throw new Error("Cannot find square root");
      }
      const exponent = _1n3 << BigInt(M - i - 1);
      const b = Fp.pow(c, exponent);
      M = i;
      c = Fp.sqr(b);
      t = Fp.mul(t, c);
      R = Fp.mul(R, b);
    }
    return R;
  }, "tonelliSlow");
}
function FpSqrt(P) {
  if (P % _4n === _3n)
    return sqrt3mod4;
  if (P % _8n === _5n)
    return sqrt5mod8;
  return tonelliShanks(P);
}
function validateField(field) {
  const initial = {
    ORDER: "bigint",
    MASK: "bigint",
    BYTES: "number",
    BITS: "number"
  };
  const opts = FIELD_FIELDS.reduce((map, val) => {
    map[val] = "function";
    return map;
  }, initial);
  _validateObject(field, opts);
  return field;
}
function FpPow(Fp, num2, power) {
  if (power < _0n3)
    throw new Error("invalid exponent, negatives unsupported");
  if (power === _0n3)
    return Fp.ONE;
  if (power === _1n3)
    return num2;
  let p = Fp.ONE;
  let d = num2;
  while (power > _0n3) {
    if (power & _1n3)
      p = Fp.mul(p, d);
    d = Fp.sqr(d);
    power >>= _1n3;
  }
  return p;
}
function FpInvertBatch(Fp, nums, passZero = false) {
  const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : void 0);
  const multipliedAcc = nums.reduce((acc, num2, i) => {
    if (Fp.is0(num2))
      return acc;
    inverted[i] = acc;
    return Fp.mul(acc, num2);
  }, Fp.ONE);
  const invertedAcc = Fp.inv(multipliedAcc);
  nums.reduceRight((acc, num2, i) => {
    if (Fp.is0(num2))
      return acc;
    inverted[i] = Fp.mul(acc, inverted[i]);
    return Fp.mul(acc, num2);
  }, invertedAcc);
  return inverted;
}
function FpLegendre(Fp, n) {
  const p1mod2 = (Fp.ORDER - _1n3) / _2n2;
  const powered = Fp.pow(n, p1mod2);
  const yes = Fp.eql(powered, Fp.ONE);
  const zero = Fp.eql(powered, Fp.ZERO);
  const no = Fp.eql(powered, Fp.neg(Fp.ONE));
  if (!yes && !zero && !no)
    throw new Error("invalid Legendre symbol result");
  return yes ? 1 : zero ? 0 : -1;
}
function nLength(n, nBitLength) {
  if (nBitLength !== void 0)
    anumber(nBitLength);
  const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
function Field(ORDER, bitLenOrOpts, isLE2 = false, opts = {}) {
  if (ORDER <= _0n3)
    throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
  let _nbitLength = void 0;
  let _sqrt = void 0;
  if (typeof bitLenOrOpts === "object" && bitLenOrOpts != null) {
    if (opts.sqrt || isLE2)
      throw new Error("cannot specify opts in two arguments");
    const _opts = bitLenOrOpts;
    if (_opts.BITS)
      _nbitLength = _opts.BITS;
    if (_opts.sqrt)
      _sqrt = _opts.sqrt;
    if (typeof _opts.isLE === "boolean")
      isLE2 = _opts.isLE;
  } else {
    if (typeof bitLenOrOpts === "number")
      _nbitLength = bitLenOrOpts;
    if (opts.sqrt)
      _sqrt = opts.sqrt;
  }
  const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, _nbitLength);
  if (BYTES > 2048)
    throw new Error("invalid field: expected ORDER of <= 2048 bytes");
  let sqrtP;
  const f = Object.freeze({
    ORDER,
    isLE: isLE2,
    BITS,
    BYTES,
    MASK: bitMask(BITS),
    ZERO: _0n3,
    ONE: _1n3,
    create: /* @__PURE__ */ __name((num2) => mod(num2, ORDER), "create"),
    isValid: /* @__PURE__ */ __name((num2) => {
      if (typeof num2 !== "bigint")
        throw new Error("invalid field element: expected bigint, got " + typeof num2);
      return _0n3 <= num2 && num2 < ORDER;
    }, "isValid"),
    is0: /* @__PURE__ */ __name((num2) => num2 === _0n3, "is0"),
    // is valid and invertible
    isValidNot0: /* @__PURE__ */ __name((num2) => !f.is0(num2) && f.isValid(num2), "isValidNot0"),
    isOdd: /* @__PURE__ */ __name((num2) => (num2 & _1n3) === _1n3, "isOdd"),
    neg: /* @__PURE__ */ __name((num2) => mod(-num2, ORDER), "neg"),
    eql: /* @__PURE__ */ __name((lhs, rhs) => lhs === rhs, "eql"),
    sqr: /* @__PURE__ */ __name((num2) => mod(num2 * num2, ORDER), "sqr"),
    add: /* @__PURE__ */ __name((lhs, rhs) => mod(lhs + rhs, ORDER), "add"),
    sub: /* @__PURE__ */ __name((lhs, rhs) => mod(lhs - rhs, ORDER), "sub"),
    mul: /* @__PURE__ */ __name((lhs, rhs) => mod(lhs * rhs, ORDER), "mul"),
    pow: /* @__PURE__ */ __name((num2, power) => FpPow(f, num2, power), "pow"),
    div: /* @__PURE__ */ __name((lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER), "div"),
    // Same as above, but doesn't normalize
    sqrN: /* @__PURE__ */ __name((num2) => num2 * num2, "sqrN"),
    addN: /* @__PURE__ */ __name((lhs, rhs) => lhs + rhs, "addN"),
    subN: /* @__PURE__ */ __name((lhs, rhs) => lhs - rhs, "subN"),
    mulN: /* @__PURE__ */ __name((lhs, rhs) => lhs * rhs, "mulN"),
    inv: /* @__PURE__ */ __name((num2) => invert(num2, ORDER), "inv"),
    sqrt: _sqrt || ((n) => {
      if (!sqrtP)
        sqrtP = FpSqrt(ORDER);
      return sqrtP(f, n);
    }),
    toBytes: /* @__PURE__ */ __name((num2) => isLE2 ? numberToBytesLE(num2, BYTES) : numberToBytesBE(num2, BYTES), "toBytes"),
    fromBytes: /* @__PURE__ */ __name((bytes) => {
      if (bytes.length !== BYTES)
        throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
      return isLE2 ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
    }, "fromBytes"),
    // TODO: we don't need it here, move out to separate fn
    invertBatch: /* @__PURE__ */ __name((lst) => FpInvertBatch(f, lst), "invertBatch"),
    // We can't move this out because Fp6, Fp12 implement it
    // and it's unclear what to return in there.
    cmov: /* @__PURE__ */ __name((a, b, c) => c ? b : a, "cmov")
  });
  return Object.freeze(f);
}
function getFieldBytesLength(fieldOrder) {
  if (typeof fieldOrder !== "bigint")
    throw new Error("field order must be bigint");
  const bitLength = fieldOrder.toString(2).length;
  return Math.ceil(bitLength / 8);
}
function getMinHashLength(fieldOrder) {
  const length = getFieldBytesLength(fieldOrder);
  return length + Math.ceil(length / 2);
}
function mapHashToField(key, fieldOrder, isLE2 = false) {
  const len = key.length;
  const fieldLen = getFieldBytesLength(fieldOrder);
  const minLen = getMinHashLength(fieldOrder);
  if (len < 16 || len < minLen || len > 1024)
    throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
  const num2 = isLE2 ? bytesToNumberLE(key) : bytesToNumberBE(key);
  const reduced = mod(num2, fieldOrder - _1n3) + _1n3;
  return isLE2 ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}
var _0n3, _1n3, _2n2, _3n, _4n, _5n, _8n, FIELD_FIELDS;
var init_modular = __esm({
  "node_modules/viem/node_modules/@noble/curves/esm/abstract/modular.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_utils4();
    _0n3 = BigInt(0);
    _1n3 = BigInt(1);
    _2n2 = /* @__PURE__ */ BigInt(2);
    _3n = /* @__PURE__ */ BigInt(3);
    _4n = /* @__PURE__ */ BigInt(4);
    _5n = /* @__PURE__ */ BigInt(5);
    _8n = /* @__PURE__ */ BigInt(8);
    __name(mod, "mod");
    __name(pow2, "pow2");
    __name(invert, "invert");
    __name(sqrt3mod4, "sqrt3mod4");
    __name(sqrt5mod8, "sqrt5mod8");
    __name(tonelliShanks, "tonelliShanks");
    __name(FpSqrt, "FpSqrt");
    FIELD_FIELDS = [
      "create",
      "isValid",
      "is0",
      "neg",
      "inv",
      "sqrt",
      "sqr",
      "eql",
      "add",
      "sub",
      "mul",
      "pow",
      "div",
      "addN",
      "subN",
      "mulN",
      "sqrN"
    ];
    __name(validateField, "validateField");
    __name(FpPow, "FpPow");
    __name(FpInvertBatch, "FpInvertBatch");
    __name(FpLegendre, "FpLegendre");
    __name(nLength, "nLength");
    __name(Field, "Field");
    __name(getFieldBytesLength, "getFieldBytesLength");
    __name(getMinHashLength, "getMinHashLength");
    __name(mapHashToField, "mapHashToField");
  }
});

// node_modules/viem/node_modules/@noble/curves/esm/abstract/curve.js
function negateCt(condition, item) {
  const neg = item.negate();
  return condition ? neg : item;
}
function normalizeZ(c, property, points) {
  const getz = property === "pz" ? (p) => p.pz : (p) => p.ez;
  const toInv = FpInvertBatch(c.Fp, points.map(getz));
  const affined = points.map((p, i) => p.toAffine(toInv[i]));
  return affined.map(c.fromAffine);
}
function validateW(W, bits) {
  if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
    throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
}
function calcWOpts(W, scalarBits) {
  validateW(W, scalarBits);
  const windows = Math.ceil(scalarBits / W) + 1;
  const windowSize = 2 ** (W - 1);
  const maxNumber = 2 ** W;
  const mask = bitMask(W);
  const shiftBy = BigInt(W);
  return { windows, windowSize, mask, maxNumber, shiftBy };
}
function calcOffsets(n, window, wOpts) {
  const { windowSize, mask, maxNumber, shiftBy } = wOpts;
  let wbits = Number(n & mask);
  let nextN = n >> shiftBy;
  if (wbits > windowSize) {
    wbits -= maxNumber;
    nextN += _1n4;
  }
  const offsetStart = window * windowSize;
  const offset = offsetStart + Math.abs(wbits) - 1;
  const isZero = wbits === 0;
  const isNeg = wbits < 0;
  const isNegF = window % 2 !== 0;
  const offsetF = offsetStart;
  return { nextN, offset, isZero, isNeg, isNegF, offsetF };
}
function validateMSMPoints(points, c) {
  if (!Array.isArray(points))
    throw new Error("array expected");
  points.forEach((p, i) => {
    if (!(p instanceof c))
      throw new Error("invalid point at index " + i);
  });
}
function validateMSMScalars(scalars, field) {
  if (!Array.isArray(scalars))
    throw new Error("array of scalars expected");
  scalars.forEach((s, i) => {
    if (!field.isValid(s))
      throw new Error("invalid scalar at index " + i);
  });
}
function getW(P) {
  return pointWindowSizes.get(P) || 1;
}
function assert0(n) {
  if (n !== _0n4)
    throw new Error("invalid wNAF");
}
function wNAF(c, bits) {
  return {
    constTimeNegate: negateCt,
    hasPrecomputes(elm) {
      return getW(elm) !== 1;
    },
    // non-const time multiplication ladder
    unsafeLadder(elm, n, p = c.ZERO) {
      let d = elm;
      while (n > _0n4) {
        if (n & _1n4)
          p = p.add(d);
        d = d.double();
        n >>= _1n4;
      }
      return p;
    },
    /**
     * Creates a wNAF precomputation window. Used for caching.
     * Default window size is set by `utils.precompute()` and is equal to 8.
     * Number of precomputed points depends on the curve size:
     * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
     * - 𝑊 is the window size
     * - 𝑛 is the bitlength of the curve order.
     * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
     * @param elm Point instance
     * @param W window size
     * @returns precomputed point tables flattened to a single array
     */
    precomputeWindow(elm, W) {
      const { windows, windowSize } = calcWOpts(W, bits);
      const points = [];
      let p = elm;
      let base = p;
      for (let window = 0; window < windows; window++) {
        base = p;
        points.push(base);
        for (let i = 1; i < windowSize; i++) {
          base = base.add(p);
          points.push(base);
        }
        p = base.double();
      }
      return points;
    },
    /**
     * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @returns real and fake (for const-time) points
     */
    wNAF(W, precomputes, n) {
      let p = c.ZERO;
      let f = c.BASE;
      const wo = calcWOpts(W, bits);
      for (let window = 0; window < wo.windows; window++) {
        const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window, wo);
        n = nextN;
        if (isZero) {
          f = f.add(negateCt(isNegF, precomputes[offsetF]));
        } else {
          p = p.add(negateCt(isNeg, precomputes[offset]));
        }
      }
      assert0(n);
      return { p, f };
    },
    /**
     * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @param acc accumulator point to add result of multiplication
     * @returns point
     */
    wNAFUnsafe(W, precomputes, n, acc = c.ZERO) {
      const wo = calcWOpts(W, bits);
      for (let window = 0; window < wo.windows; window++) {
        if (n === _0n4)
          break;
        const { nextN, offset, isZero, isNeg } = calcOffsets(n, window, wo);
        n = nextN;
        if (isZero) {
          continue;
        } else {
          const item = precomputes[offset];
          acc = acc.add(isNeg ? item.negate() : item);
        }
      }
      assert0(n);
      return acc;
    },
    getPrecomputes(W, P, transform) {
      let comp = pointPrecomputes.get(P);
      if (!comp) {
        comp = this.precomputeWindow(P, W);
        if (W !== 1) {
          if (typeof transform === "function")
            comp = transform(comp);
          pointPrecomputes.set(P, comp);
        }
      }
      return comp;
    },
    wNAFCached(P, n, transform) {
      const W = getW(P);
      return this.wNAF(W, this.getPrecomputes(W, P, transform), n);
    },
    wNAFCachedUnsafe(P, n, transform, prev) {
      const W = getW(P);
      if (W === 1)
        return this.unsafeLadder(P, n, prev);
      return this.wNAFUnsafe(W, this.getPrecomputes(W, P, transform), n, prev);
    },
    // We calculate precomputes for elliptic curve point multiplication
    // using windowed method. This specifies window size and
    // stores precomputed values. Usually only base point would be precomputed.
    setWindowSize(P, W) {
      validateW(W, bits);
      pointWindowSizes.set(P, W);
      pointPrecomputes.delete(P);
    }
  };
}
function mulEndoUnsafe(c, point, k1, k2) {
  let acc = point;
  let p1 = c.ZERO;
  let p2 = c.ZERO;
  while (k1 > _0n4 || k2 > _0n4) {
    if (k1 & _1n4)
      p1 = p1.add(acc);
    if (k2 & _1n4)
      p2 = p2.add(acc);
    acc = acc.double();
    k1 >>= _1n4;
    k2 >>= _1n4;
  }
  return { p1, p2 };
}
function pippenger(c, fieldN, points, scalars) {
  validateMSMPoints(points, c);
  validateMSMScalars(scalars, fieldN);
  const plength = points.length;
  const slength = scalars.length;
  if (plength !== slength)
    throw new Error("arrays of points and scalars must have equal length");
  const zero = c.ZERO;
  const wbits = bitLen(BigInt(plength));
  let windowSize = 1;
  if (wbits > 12)
    windowSize = wbits - 3;
  else if (wbits > 4)
    windowSize = wbits - 2;
  else if (wbits > 0)
    windowSize = 2;
  const MASK = bitMask(windowSize);
  const buckets = new Array(Number(MASK) + 1).fill(zero);
  const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
  let sum = zero;
  for (let i = lastBits; i >= 0; i -= windowSize) {
    buckets.fill(zero);
    for (let j = 0; j < slength; j++) {
      const scalar = scalars[j];
      const wbits2 = Number(scalar >> BigInt(i) & MASK);
      buckets[wbits2] = buckets[wbits2].add(points[j]);
    }
    let resI = zero;
    for (let j = buckets.length - 1, sumI = zero; j > 0; j--) {
      sumI = sumI.add(buckets[j]);
      resI = resI.add(sumI);
    }
    sum = sum.add(resI);
    if (i !== 0)
      for (let j = 0; j < windowSize; j++)
        sum = sum.double();
  }
  return sum;
}
function createField(order, field) {
  if (field) {
    if (field.ORDER !== order)
      throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    validateField(field);
    return field;
  } else {
    return Field(order);
  }
}
function _createCurveFields(type, CURVE, curveOpts = {}) {
  if (!CURVE || typeof CURVE !== "object")
    throw new Error(`expected valid ${type} CURVE object`);
  for (const p of ["p", "n", "h"]) {
    const val = CURVE[p];
    if (!(typeof val === "bigint" && val > _0n4))
      throw new Error(`CURVE.${p} must be positive bigint`);
  }
  const Fp = createField(CURVE.p, curveOpts.Fp);
  const Fn = createField(CURVE.n, curveOpts.Fn);
  const _b = type === "weierstrass" ? "b" : "d";
  const params = ["Gx", "Gy", "a", _b];
  for (const p of params) {
    if (!Fp.isValid(CURVE[p]))
      throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
  }
  return { Fp, Fn };
}
var _0n4, _1n4, pointPrecomputes, pointWindowSizes;
var init_curve = __esm({
  "node_modules/viem/node_modules/@noble/curves/esm/abstract/curve.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_utils4();
    init_modular();
    _0n4 = BigInt(0);
    _1n4 = BigInt(1);
    __name(negateCt, "negateCt");
    __name(normalizeZ, "normalizeZ");
    __name(validateW, "validateW");
    __name(calcWOpts, "calcWOpts");
    __name(calcOffsets, "calcOffsets");
    __name(validateMSMPoints, "validateMSMPoints");
    __name(validateMSMScalars, "validateMSMScalars");
    pointPrecomputes = /* @__PURE__ */ new WeakMap();
    pointWindowSizes = /* @__PURE__ */ new WeakMap();
    __name(getW, "getW");
    __name(assert0, "assert0");
    __name(wNAF, "wNAF");
    __name(mulEndoUnsafe, "mulEndoUnsafe");
    __name(pippenger, "pippenger");
    __name(createField, "createField");
    __name(_createCurveFields, "_createCurveFields");
  }
});

// node_modules/viem/node_modules/@noble/curves/esm/abstract/weierstrass.js
function validateSigVerOpts(opts) {
  if (opts.lowS !== void 0)
    abool("lowS", opts.lowS);
  if (opts.prehash !== void 0)
    abool("prehash", opts.prehash);
}
function _legacyHelperEquat(Fp, a, b) {
  function weierstrassEquation(x) {
    const x2 = Fp.sqr(x);
    const x3 = Fp.mul(x2, x);
    return Fp.add(Fp.add(x3, Fp.mul(x, a)), b);
  }
  __name(weierstrassEquation, "weierstrassEquation");
  return weierstrassEquation;
}
function _legacyHelperNormPriv(Fn, allowedPrivateKeyLengths, wrapPrivateKey) {
  const { BYTES: expected } = Fn;
  function normPrivateKeyToScalar(key) {
    let num2;
    if (typeof key === "bigint") {
      num2 = key;
    } else {
      let bytes = ensureBytes("private key", key);
      if (allowedPrivateKeyLengths) {
        if (!allowedPrivateKeyLengths.includes(bytes.length * 2))
          throw new Error("invalid private key");
        const padded = new Uint8Array(expected);
        padded.set(bytes, padded.length - bytes.length);
        bytes = padded;
      }
      try {
        num2 = Fn.fromBytes(bytes);
      } catch (error) {
        throw new Error(`invalid private key: expected ui8a of size ${expected}, got ${typeof key}`);
      }
    }
    if (wrapPrivateKey)
      num2 = Fn.create(num2);
    if (!Fn.isValidNot0(num2))
      throw new Error("invalid private key: out of range [1..N-1]");
    return num2;
  }
  __name(normPrivateKeyToScalar, "normPrivateKeyToScalar");
  return normPrivateKeyToScalar;
}
function weierstrassN(CURVE, curveOpts = {}) {
  const { Fp, Fn } = _createCurveFields("weierstrass", CURVE, curveOpts);
  const { h: cofactor, n: CURVE_ORDER } = CURVE;
  _validateObject(curveOpts, {}, {
    allowInfinityPoint: "boolean",
    clearCofactor: "function",
    isTorsionFree: "function",
    fromBytes: "function",
    toBytes: "function",
    endo: "object",
    wrapPrivateKey: "boolean"
  });
  const { endo } = curveOpts;
  if (endo) {
    if (!Fp.is0(CURVE.a) || typeof endo.beta !== "bigint" || typeof endo.splitScalar !== "function") {
      throw new Error('invalid endo: expected "beta": bigint and "splitScalar": function');
    }
  }
  function assertCompressionIsSupported() {
    if (!Fp.isOdd)
      throw new Error("compression is not supported: Field does not have .isOdd()");
  }
  __name(assertCompressionIsSupported, "assertCompressionIsSupported");
  function pointToBytes2(_c, point, isCompressed) {
    const { x, y } = point.toAffine();
    const bx = Fp.toBytes(x);
    abool("isCompressed", isCompressed);
    if (isCompressed) {
      assertCompressionIsSupported();
      const hasEvenY = !Fp.isOdd(y);
      return concatBytes(pprefix(hasEvenY), bx);
    } else {
      return concatBytes(Uint8Array.of(4), bx, Fp.toBytes(y));
    }
  }
  __name(pointToBytes2, "pointToBytes");
  function pointFromBytes(bytes) {
    abytes(bytes);
    const L = Fp.BYTES;
    const LC = L + 1;
    const LU = 2 * L + 1;
    const length = bytes.length;
    const head = bytes[0];
    const tail = bytes.subarray(1);
    if (length === LC && (head === 2 || head === 3)) {
      const x = Fp.fromBytes(tail);
      if (!Fp.isValid(x))
        throw new Error("bad point: is not on curve, wrong x");
      const y2 = weierstrassEquation(x);
      let y;
      try {
        y = Fp.sqrt(y2);
      } catch (sqrtError) {
        const err = sqrtError instanceof Error ? ": " + sqrtError.message : "";
        throw new Error("bad point: is not on curve, sqrt error" + err);
      }
      assertCompressionIsSupported();
      const isYOdd = Fp.isOdd(y);
      const isHeadOdd = (head & 1) === 1;
      if (isHeadOdd !== isYOdd)
        y = Fp.neg(y);
      return { x, y };
    } else if (length === LU && head === 4) {
      const x = Fp.fromBytes(tail.subarray(L * 0, L * 1));
      const y = Fp.fromBytes(tail.subarray(L * 1, L * 2));
      if (!isValidXY(x, y))
        throw new Error("bad point: is not on curve");
      return { x, y };
    } else {
      throw new Error(`bad point: got length ${length}, expected compressed=${LC} or uncompressed=${LU}`);
    }
  }
  __name(pointFromBytes, "pointFromBytes");
  const toBytes3 = curveOpts.toBytes || pointToBytes2;
  const fromBytes2 = curveOpts.fromBytes || pointFromBytes;
  const weierstrassEquation = _legacyHelperEquat(Fp, CURVE.a, CURVE.b);
  function isValidXY(x, y) {
    const left = Fp.sqr(y);
    const right = weierstrassEquation(x);
    return Fp.eql(left, right);
  }
  __name(isValidXY, "isValidXY");
  if (!isValidXY(CURVE.Gx, CURVE.Gy))
    throw new Error("bad curve params: generator point");
  const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n2), _4n2);
  const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
  if (Fp.is0(Fp.add(_4a3, _27b2)))
    throw new Error("bad curve params: a or b");
  function acoord(title, n, banZero = false) {
    if (!Fp.isValid(n) || banZero && Fp.is0(n))
      throw new Error(`bad point coordinate ${title}`);
    return n;
  }
  __name(acoord, "acoord");
  function aprjpoint(other) {
    if (!(other instanceof Point2))
      throw new Error("ProjectivePoint expected");
  }
  __name(aprjpoint, "aprjpoint");
  const toAffineMemo = memoized((p, iz) => {
    const { px: x, py: y, pz: z } = p;
    if (Fp.eql(z, Fp.ONE))
      return { x, y };
    const is0 = p.is0();
    if (iz == null)
      iz = is0 ? Fp.ONE : Fp.inv(z);
    const ax = Fp.mul(x, iz);
    const ay = Fp.mul(y, iz);
    const zz = Fp.mul(z, iz);
    if (is0)
      return { x: Fp.ZERO, y: Fp.ZERO };
    if (!Fp.eql(zz, Fp.ONE))
      throw new Error("invZ was invalid");
    return { x: ax, y: ay };
  });
  const assertValidMemo = memoized((p) => {
    if (p.is0()) {
      if (curveOpts.allowInfinityPoint && !Fp.is0(p.py))
        return;
      throw new Error("bad point: ZERO");
    }
    const { x, y } = p.toAffine();
    if (!Fp.isValid(x) || !Fp.isValid(y))
      throw new Error("bad point: x or y not field elements");
    if (!isValidXY(x, y))
      throw new Error("bad point: equation left != right");
    if (!p.isTorsionFree())
      throw new Error("bad point: not in prime-order subgroup");
    return true;
  });
  function finishEndo(endoBeta, k1p, k2p, k1neg, k2neg) {
    k2p = new Point2(Fp.mul(k2p.px, endoBeta), k2p.py, k2p.pz);
    k1p = negateCt(k1neg, k1p);
    k2p = negateCt(k2neg, k2p);
    return k1p.add(k2p);
  }
  __name(finishEndo, "finishEndo");
  class Point2 {
    static {
      __name(this, "Point");
    }
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    constructor(px, py, pz) {
      this.px = acoord("x", px);
      this.py = acoord("y", py, true);
      this.pz = acoord("z", pz);
      Object.freeze(this);
    }
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    static fromAffine(p) {
      const { x, y } = p || {};
      if (!p || !Fp.isValid(x) || !Fp.isValid(y))
        throw new Error("invalid affine point");
      if (p instanceof Point2)
        throw new Error("projective point not allowed");
      if (Fp.is0(x) && Fp.is0(y))
        return Point2.ZERO;
      return new Point2(x, y, Fp.ONE);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    static normalizeZ(points) {
      return normalizeZ(Point2, "pz", points);
    }
    static fromBytes(bytes) {
      abytes(bytes);
      return Point2.fromHex(bytes);
    }
    /** Converts hash string or Uint8Array to Point. */
    static fromHex(hex) {
      const P = Point2.fromAffine(fromBytes2(ensureBytes("pointHex", hex)));
      P.assertValidity();
      return P;
    }
    /** Multiplies generator point by privateKey. */
    static fromPrivateKey(privateKey) {
      const normPrivateKeyToScalar = _legacyHelperNormPriv(Fn, curveOpts.allowedPrivateKeyLengths, curveOpts.wrapPrivateKey);
      return Point2.BASE.multiply(normPrivateKeyToScalar(privateKey));
    }
    /** Multiscalar Multiplication */
    static msm(points, scalars) {
      return pippenger(Point2, Fn, points, scalars);
    }
    /**
     *
     * @param windowSize
     * @param isLazy true will defer table computation until the first multiplication
     * @returns
     */
    precompute(windowSize = 8, isLazy = true) {
      wnaf.setWindowSize(this, windowSize);
      if (!isLazy)
        this.multiply(_3n2);
      return this;
    }
    /** "Private method", don't use it directly */
    _setWindowSize(windowSize) {
      this.precompute(windowSize);
    }
    // TODO: return `this`
    /** A point on curve is valid if it conforms to equation. */
    assertValidity() {
      assertValidMemo(this);
    }
    hasEvenY() {
      const { y } = this.toAffine();
      if (!Fp.isOdd)
        throw new Error("Field doesn't support isOdd");
      return !Fp.isOdd(y);
    }
    /** Compare one point to another. */
    equals(other) {
      aprjpoint(other);
      const { px: X1, py: Y1, pz: Z1 } = this;
      const { px: X2, py: Y2, pz: Z2 } = other;
      const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
      const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
      return U1 && U2;
    }
    /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
    negate() {
      return new Point2(this.px, Fp.neg(this.py), this.pz);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { a, b } = CURVE;
      const b3 = Fp.mul(b, _3n2);
      const { px: X1, py: Y1, pz: Z1 } = this;
      let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      let t0 = Fp.mul(X1, X1);
      let t1 = Fp.mul(Y1, Y1);
      let t2 = Fp.mul(Z1, Z1);
      let t3 = Fp.mul(X1, Y1);
      t3 = Fp.add(t3, t3);
      Z3 = Fp.mul(X1, Z1);
      Z3 = Fp.add(Z3, Z3);
      X3 = Fp.mul(a, Z3);
      Y3 = Fp.mul(b3, t2);
      Y3 = Fp.add(X3, Y3);
      X3 = Fp.sub(t1, Y3);
      Y3 = Fp.add(t1, Y3);
      Y3 = Fp.mul(X3, Y3);
      X3 = Fp.mul(t3, X3);
      Z3 = Fp.mul(b3, Z3);
      t2 = Fp.mul(a, t2);
      t3 = Fp.sub(t0, t2);
      t3 = Fp.mul(a, t3);
      t3 = Fp.add(t3, Z3);
      Z3 = Fp.add(t0, t0);
      t0 = Fp.add(Z3, t0);
      t0 = Fp.add(t0, t2);
      t0 = Fp.mul(t0, t3);
      Y3 = Fp.add(Y3, t0);
      t2 = Fp.mul(Y1, Z1);
      t2 = Fp.add(t2, t2);
      t0 = Fp.mul(t2, t3);
      X3 = Fp.sub(X3, t0);
      Z3 = Fp.mul(t2, t1);
      Z3 = Fp.add(Z3, Z3);
      Z3 = Fp.add(Z3, Z3);
      return new Point2(X3, Y3, Z3);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(other) {
      aprjpoint(other);
      const { px: X1, py: Y1, pz: Z1 } = this;
      const { px: X2, py: Y2, pz: Z2 } = other;
      let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      const a = CURVE.a;
      const b3 = Fp.mul(CURVE.b, _3n2);
      let t0 = Fp.mul(X1, X2);
      let t1 = Fp.mul(Y1, Y2);
      let t2 = Fp.mul(Z1, Z2);
      let t3 = Fp.add(X1, Y1);
      let t4 = Fp.add(X2, Y2);
      t3 = Fp.mul(t3, t4);
      t4 = Fp.add(t0, t1);
      t3 = Fp.sub(t3, t4);
      t4 = Fp.add(X1, Z1);
      let t5 = Fp.add(X2, Z2);
      t4 = Fp.mul(t4, t5);
      t5 = Fp.add(t0, t2);
      t4 = Fp.sub(t4, t5);
      t5 = Fp.add(Y1, Z1);
      X3 = Fp.add(Y2, Z2);
      t5 = Fp.mul(t5, X3);
      X3 = Fp.add(t1, t2);
      t5 = Fp.sub(t5, X3);
      Z3 = Fp.mul(a, t4);
      X3 = Fp.mul(b3, t2);
      Z3 = Fp.add(X3, Z3);
      X3 = Fp.sub(t1, Z3);
      Z3 = Fp.add(t1, Z3);
      Y3 = Fp.mul(X3, Z3);
      t1 = Fp.add(t0, t0);
      t1 = Fp.add(t1, t0);
      t2 = Fp.mul(a, t2);
      t4 = Fp.mul(b3, t4);
      t1 = Fp.add(t1, t2);
      t2 = Fp.sub(t0, t2);
      t2 = Fp.mul(a, t2);
      t4 = Fp.add(t4, t2);
      t0 = Fp.mul(t1, t4);
      Y3 = Fp.add(Y3, t0);
      t0 = Fp.mul(t5, t4);
      X3 = Fp.mul(t3, X3);
      X3 = Fp.sub(X3, t0);
      t0 = Fp.mul(t3, t1);
      Z3 = Fp.mul(t5, Z3);
      Z3 = Fp.add(Z3, t0);
      return new Point2(X3, Y3, Z3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point2.ZERO);
    }
    /**
     * Constant time multiplication.
     * Uses wNAF method. Windowed method may be 10% faster,
     * but takes 2x longer to generate and consumes 2x memory.
     * Uses precomputes when available.
     * Uses endomorphism for Koblitz curves.
     * @param scalar by which the point would be multiplied
     * @returns New point
     */
    multiply(scalar) {
      const { endo: endo2 } = curveOpts;
      if (!Fn.isValidNot0(scalar))
        throw new Error("invalid scalar: out of range");
      let point, fake;
      const mul = /* @__PURE__ */ __name((n) => wnaf.wNAFCached(this, n, Point2.normalizeZ), "mul");
      if (endo2) {
        const { k1neg, k1, k2neg, k2 } = endo2.splitScalar(scalar);
        const { p: k1p, f: k1f } = mul(k1);
        const { p: k2p, f: k2f } = mul(k2);
        fake = k1f.add(k2f);
        point = finishEndo(endo2.beta, k1p, k2p, k1neg, k2neg);
      } else {
        const { p, f } = mul(scalar);
        point = p;
        fake = f;
      }
      return Point2.normalizeZ([point, fake])[0];
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed private key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(sc) {
      const { endo: endo2 } = curveOpts;
      const p = this;
      if (!Fn.isValid(sc))
        throw new Error("invalid scalar: out of range");
      if (sc === _0n5 || p.is0())
        return Point2.ZERO;
      if (sc === _1n5)
        return p;
      if (wnaf.hasPrecomputes(this))
        return this.multiply(sc);
      if (endo2) {
        const { k1neg, k1, k2neg, k2 } = endo2.splitScalar(sc);
        const { p1, p2 } = mulEndoUnsafe(Point2, p, k1, k2);
        return finishEndo(endo2.beta, p1, p2, k1neg, k2neg);
      } else {
        return wnaf.wNAFCachedUnsafe(p, sc);
      }
    }
    multiplyAndAddUnsafe(Q, a, b) {
      const sum = this.multiplyUnsafe(a).add(Q.multiplyUnsafe(b));
      return sum.is0() ? void 0 : sum;
    }
    /**
     * Converts Projective point to affine (x, y) coordinates.
     * @param invertedZ Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
     */
    toAffine(invertedZ) {
      return toAffineMemo(this, invertedZ);
    }
    /**
     * Checks whether Point is free of torsion elements (is in prime subgroup).
     * Always torsion-free for cofactor=1 curves.
     */
    isTorsionFree() {
      const { isTorsionFree } = curveOpts;
      if (cofactor === _1n5)
        return true;
      if (isTorsionFree)
        return isTorsionFree(Point2, this);
      return wnaf.wNAFCachedUnsafe(this, CURVE_ORDER).is0();
    }
    clearCofactor() {
      const { clearCofactor } = curveOpts;
      if (cofactor === _1n5)
        return this;
      if (clearCofactor)
        return clearCofactor(Point2, this);
      return this.multiplyUnsafe(cofactor);
    }
    toBytes(isCompressed = true) {
      abool("isCompressed", isCompressed);
      this.assertValidity();
      return toBytes3(Point2, this, isCompressed);
    }
    /** @deprecated use `toBytes` */
    toRawBytes(isCompressed = true) {
      return this.toBytes(isCompressed);
    }
    toHex(isCompressed = true) {
      return bytesToHex2(this.toBytes(isCompressed));
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
  }
  Point2.BASE = new Point2(CURVE.Gx, CURVE.Gy, Fp.ONE);
  Point2.ZERO = new Point2(Fp.ZERO, Fp.ONE, Fp.ZERO);
  Point2.Fp = Fp;
  Point2.Fn = Fn;
  const bits = Fn.BITS;
  const wnaf = wNAF(Point2, curveOpts.endo ? Math.ceil(bits / 2) : bits);
  return Point2;
}
function pprefix(hasEvenY) {
  return Uint8Array.of(hasEvenY ? 2 : 3);
}
function ecdsa(Point2, ecdsaOpts, curveOpts = {}) {
  _validateObject(ecdsaOpts, { hash: "function" }, {
    hmac: "function",
    lowS: "boolean",
    randomBytes: "function",
    bits2int: "function",
    bits2int_modN: "function"
  });
  const randomBytes_ = ecdsaOpts.randomBytes || randomBytes;
  const hmac_ = ecdsaOpts.hmac || ((key, ...msgs) => hmac(ecdsaOpts.hash, key, concatBytes(...msgs)));
  const { Fp, Fn } = Point2;
  const { ORDER: CURVE_ORDER, BITS: fnBits } = Fn;
  function isBiggerThanHalfOrder(number) {
    const HALF = CURVE_ORDER >> _1n5;
    return number > HALF;
  }
  __name(isBiggerThanHalfOrder, "isBiggerThanHalfOrder");
  function normalizeS(s) {
    return isBiggerThanHalfOrder(s) ? Fn.neg(s) : s;
  }
  __name(normalizeS, "normalizeS");
  function aValidRS(title, num2) {
    if (!Fn.isValidNot0(num2))
      throw new Error(`invalid signature ${title}: out of range 1..CURVE.n`);
  }
  __name(aValidRS, "aValidRS");
  class Signature {
    static {
      __name(this, "Signature");
    }
    constructor(r, s, recovery) {
      aValidRS("r", r);
      aValidRS("s", s);
      this.r = r;
      this.s = s;
      if (recovery != null)
        this.recovery = recovery;
      Object.freeze(this);
    }
    // pair (bytes of r, bytes of s)
    static fromCompact(hex) {
      const L = Fn.BYTES;
      const b = ensureBytes("compactSignature", hex, L * 2);
      return new Signature(Fn.fromBytes(b.subarray(0, L)), Fn.fromBytes(b.subarray(L, L * 2)));
    }
    // DER encoded ECDSA signature
    // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
    static fromDER(hex) {
      const { r, s } = DER.toSig(ensureBytes("DER", hex));
      return new Signature(r, s);
    }
    /**
     * @todo remove
     * @deprecated
     */
    assertValidity() {
    }
    addRecoveryBit(recovery) {
      return new Signature(this.r, this.s, recovery);
    }
    // ProjPointType<bigint>
    recoverPublicKey(msgHash) {
      const FIELD_ORDER = Fp.ORDER;
      const { r, s, recovery: rec } = this;
      if (rec == null || ![0, 1, 2, 3].includes(rec))
        throw new Error("recovery id invalid");
      const hasCofactor = CURVE_ORDER * _2n3 < FIELD_ORDER;
      if (hasCofactor && rec > 1)
        throw new Error("recovery id is ambiguous for h>1 curve");
      const radj = rec === 2 || rec === 3 ? r + CURVE_ORDER : r;
      if (!Fp.isValid(radj))
        throw new Error("recovery id 2 or 3 invalid");
      const x = Fp.toBytes(radj);
      const R = Point2.fromHex(concatBytes(pprefix((rec & 1) === 0), x));
      const ir = Fn.inv(radj);
      const h = bits2int_modN(ensureBytes("msgHash", msgHash));
      const u1 = Fn.create(-h * ir);
      const u2 = Fn.create(s * ir);
      const Q = Point2.BASE.multiplyUnsafe(u1).add(R.multiplyUnsafe(u2));
      if (Q.is0())
        throw new Error("point at infinify");
      Q.assertValidity();
      return Q;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return isBiggerThanHalfOrder(this.s);
    }
    normalizeS() {
      return this.hasHighS() ? new Signature(this.r, Fn.neg(this.s), this.recovery) : this;
    }
    toBytes(format) {
      if (format === "compact")
        return concatBytes(Fn.toBytes(this.r), Fn.toBytes(this.s));
      if (format === "der")
        return hexToBytes2(DER.hexFromSig(this));
      throw new Error("invalid format");
    }
    // DER-encoded
    toDERRawBytes() {
      return this.toBytes("der");
    }
    toDERHex() {
      return bytesToHex2(this.toBytes("der"));
    }
    // padded bytes of r, then padded bytes of s
    toCompactRawBytes() {
      return this.toBytes("compact");
    }
    toCompactHex() {
      return bytesToHex2(this.toBytes("compact"));
    }
  }
  const normPrivateKeyToScalar = _legacyHelperNormPriv(Fn, curveOpts.allowedPrivateKeyLengths, curveOpts.wrapPrivateKey);
  const utils = {
    isValidPrivateKey(privateKey) {
      try {
        normPrivateKeyToScalar(privateKey);
        return true;
      } catch (error) {
        return false;
      }
    },
    normPrivateKeyToScalar,
    /**
     * Produces cryptographically secure private key from random of size
     * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
     */
    randomPrivateKey: /* @__PURE__ */ __name(() => {
      const n = CURVE_ORDER;
      return mapHashToField(randomBytes_(getMinHashLength(n)), n);
    }, "randomPrivateKey"),
    precompute(windowSize = 8, point = Point2.BASE) {
      return point.precompute(windowSize, false);
    }
  };
  function getPublicKey(privateKey, isCompressed = true) {
    return Point2.fromPrivateKey(privateKey).toBytes(isCompressed);
  }
  __name(getPublicKey, "getPublicKey");
  function isProbPub(item) {
    if (typeof item === "bigint")
      return false;
    if (item instanceof Point2)
      return true;
    const arr = ensureBytes("key", item);
    const length = arr.length;
    const L = Fp.BYTES;
    const LC = L + 1;
    const LU = 2 * L + 1;
    if (curveOpts.allowedPrivateKeyLengths || Fn.BYTES === LC) {
      return void 0;
    } else {
      return length === LC || length === LU;
    }
  }
  __name(isProbPub, "isProbPub");
  function getSharedSecret(privateA, publicB, isCompressed = true) {
    if (isProbPub(privateA) === true)
      throw new Error("first arg must be private key");
    if (isProbPub(publicB) === false)
      throw new Error("second arg must be public key");
    const b = Point2.fromHex(publicB);
    return b.multiply(normPrivateKeyToScalar(privateA)).toBytes(isCompressed);
  }
  __name(getSharedSecret, "getSharedSecret");
  const bits2int = ecdsaOpts.bits2int || function(bytes) {
    if (bytes.length > 8192)
      throw new Error("input is too large");
    const num2 = bytesToNumberBE(bytes);
    const delta = bytes.length * 8 - fnBits;
    return delta > 0 ? num2 >> BigInt(delta) : num2;
  };
  const bits2int_modN = ecdsaOpts.bits2int_modN || function(bytes) {
    return Fn.create(bits2int(bytes));
  };
  const ORDER_MASK = bitMask(fnBits);
  function int2octets(num2) {
    aInRange("num < 2^" + fnBits, num2, _0n5, ORDER_MASK);
    return Fn.toBytes(num2);
  }
  __name(int2octets, "int2octets");
  function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
    if (["recovered", "canonical"].some((k) => k in opts))
      throw new Error("sign() legacy options not supported");
    const { hash: hash2 } = ecdsaOpts;
    let { lowS, prehash, extraEntropy: ent } = opts;
    if (lowS == null)
      lowS = true;
    msgHash = ensureBytes("msgHash", msgHash);
    validateSigVerOpts(opts);
    if (prehash)
      msgHash = ensureBytes("prehashed msgHash", hash2(msgHash));
    const h1int = bits2int_modN(msgHash);
    const d = normPrivateKeyToScalar(privateKey);
    const seedArgs = [int2octets(d), int2octets(h1int)];
    if (ent != null && ent !== false) {
      const e = ent === true ? randomBytes_(Fp.BYTES) : ent;
      seedArgs.push(ensureBytes("extraEntropy", e));
    }
    const seed = concatBytes(...seedArgs);
    const m = h1int;
    function k2sig(kBytes) {
      const k = bits2int(kBytes);
      if (!Fn.isValidNot0(k))
        return;
      const ik = Fn.inv(k);
      const q = Point2.BASE.multiply(k).toAffine();
      const r = Fn.create(q.x);
      if (r === _0n5)
        return;
      const s = Fn.create(ik * Fn.create(m + r * d));
      if (s === _0n5)
        return;
      let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n5);
      let normS = s;
      if (lowS && isBiggerThanHalfOrder(s)) {
        normS = normalizeS(s);
        recovery ^= 1;
      }
      return new Signature(r, normS, recovery);
    }
    __name(k2sig, "k2sig");
    return { seed, k2sig };
  }
  __name(prepSig, "prepSig");
  const defaultSigOpts = { lowS: ecdsaOpts.lowS, prehash: false };
  const defaultVerOpts = { lowS: ecdsaOpts.lowS, prehash: false };
  function sign2(msgHash, privKey, opts = defaultSigOpts) {
    const { seed, k2sig } = prepSig(msgHash, privKey, opts);
    const drbg = createHmacDrbg(ecdsaOpts.hash.outputLen, Fn.BYTES, hmac_);
    return drbg(seed, k2sig);
  }
  __name(sign2, "sign");
  Point2.BASE.precompute(8);
  function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
    const sg = signature;
    msgHash = ensureBytes("msgHash", msgHash);
    publicKey = ensureBytes("publicKey", publicKey);
    validateSigVerOpts(opts);
    const { lowS, prehash, format } = opts;
    if ("strict" in opts)
      throw new Error("options.strict was renamed to lowS");
    if (format !== void 0 && !["compact", "der", "js"].includes(format))
      throw new Error('format must be "compact", "der" or "js"');
    const isHex2 = typeof sg === "string" || isBytes(sg);
    const isObj = !isHex2 && !format && typeof sg === "object" && sg !== null && typeof sg.r === "bigint" && typeof sg.s === "bigint";
    if (!isHex2 && !isObj)
      throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
    let _sig = void 0;
    let P;
    try {
      if (isObj) {
        if (format === void 0 || format === "js") {
          _sig = new Signature(sg.r, sg.s);
        } else {
          throw new Error("invalid format");
        }
      }
      if (isHex2) {
        try {
          if (format !== "compact")
            _sig = Signature.fromDER(sg);
        } catch (derError) {
          if (!(derError instanceof DER.Err))
            throw derError;
        }
        if (!_sig && format !== "der")
          _sig = Signature.fromCompact(sg);
      }
      P = Point2.fromHex(publicKey);
    } catch (error) {
      return false;
    }
    if (!_sig)
      return false;
    if (lowS && _sig.hasHighS())
      return false;
    if (prehash)
      msgHash = ecdsaOpts.hash(msgHash);
    const { r, s } = _sig;
    const h = bits2int_modN(msgHash);
    const is = Fn.inv(s);
    const u1 = Fn.create(h * is);
    const u2 = Fn.create(r * is);
    const R = Point2.BASE.multiplyUnsafe(u1).add(P.multiplyUnsafe(u2));
    if (R.is0())
      return false;
    const v = Fn.create(R.x);
    return v === r;
  }
  __name(verify, "verify");
  return Object.freeze({
    getPublicKey,
    getSharedSecret,
    sign: sign2,
    verify,
    utils,
    Point: Point2,
    Signature
  });
}
function _weierstrass_legacy_opts_to_new(c) {
  const CURVE = {
    a: c.a,
    b: c.b,
    p: c.Fp.ORDER,
    n: c.n,
    h: c.h,
    Gx: c.Gx,
    Gy: c.Gy
  };
  const Fp = c.Fp;
  const Fn = Field(CURVE.n, c.nBitLength);
  const curveOpts = {
    Fp,
    Fn,
    allowedPrivateKeyLengths: c.allowedPrivateKeyLengths,
    allowInfinityPoint: c.allowInfinityPoint,
    endo: c.endo,
    wrapPrivateKey: c.wrapPrivateKey,
    isTorsionFree: c.isTorsionFree,
    clearCofactor: c.clearCofactor,
    fromBytes: c.fromBytes,
    toBytes: c.toBytes
  };
  return { CURVE, curveOpts };
}
function _ecdsa_legacy_opts_to_new(c) {
  const { CURVE, curveOpts } = _weierstrass_legacy_opts_to_new(c);
  const ecdsaOpts = {
    hash: c.hash,
    hmac: c.hmac,
    randomBytes: c.randomBytes,
    lowS: c.lowS,
    bits2int: c.bits2int,
    bits2int_modN: c.bits2int_modN
  };
  return { CURVE, curveOpts, ecdsaOpts };
}
function _ecdsa_new_output_to_legacy(c, ecdsa2) {
  return Object.assign({}, ecdsa2, {
    ProjectivePoint: ecdsa2.Point,
    CURVE: c
  });
}
function weierstrass(c) {
  const { CURVE, curveOpts, ecdsaOpts } = _ecdsa_legacy_opts_to_new(c);
  const Point2 = weierstrassN(CURVE, curveOpts);
  const signs = ecdsa(Point2, ecdsaOpts, curveOpts);
  return _ecdsa_new_output_to_legacy(c, signs);
}
function SWUFpSqrtRatio(Fp, Z) {
  const q = Fp.ORDER;
  let l = _0n5;
  for (let o = q - _1n5; o % _2n3 === _0n5; o /= _2n3)
    l += _1n5;
  const c1 = l;
  const _2n_pow_c1_1 = _2n3 << c1 - _1n5 - _1n5;
  const _2n_pow_c1 = _2n_pow_c1_1 * _2n3;
  const c2 = (q - _1n5) / _2n_pow_c1;
  const c3 = (c2 - _1n5) / _2n3;
  const c4 = _2n_pow_c1 - _1n5;
  const c5 = _2n_pow_c1_1;
  const c6 = Fp.pow(Z, c2);
  const c7 = Fp.pow(Z, (c2 + _1n5) / _2n3);
  let sqrtRatio = /* @__PURE__ */ __name((u, v) => {
    let tv1 = c6;
    let tv2 = Fp.pow(v, c4);
    let tv3 = Fp.sqr(tv2);
    tv3 = Fp.mul(tv3, v);
    let tv5 = Fp.mul(u, tv3);
    tv5 = Fp.pow(tv5, c3);
    tv5 = Fp.mul(tv5, tv2);
    tv2 = Fp.mul(tv5, v);
    tv3 = Fp.mul(tv5, u);
    let tv4 = Fp.mul(tv3, tv2);
    tv5 = Fp.pow(tv4, c5);
    let isQR = Fp.eql(tv5, Fp.ONE);
    tv2 = Fp.mul(tv3, c7);
    tv5 = Fp.mul(tv4, tv1);
    tv3 = Fp.cmov(tv2, tv3, isQR);
    tv4 = Fp.cmov(tv5, tv4, isQR);
    for (let i = c1; i > _1n5; i--) {
      let tv52 = i - _2n3;
      tv52 = _2n3 << tv52 - _1n5;
      let tvv5 = Fp.pow(tv4, tv52);
      const e1 = Fp.eql(tvv5, Fp.ONE);
      tv2 = Fp.mul(tv3, tv1);
      tv1 = Fp.mul(tv1, tv1);
      tvv5 = Fp.mul(tv4, tv1);
      tv3 = Fp.cmov(tv2, tv3, e1);
      tv4 = Fp.cmov(tvv5, tv4, e1);
    }
    return { isValid: isQR, value: tv3 };
  }, "sqrtRatio");
  if (Fp.ORDER % _4n2 === _3n2) {
    const c12 = (Fp.ORDER - _3n2) / _4n2;
    const c22 = Fp.sqrt(Fp.neg(Z));
    sqrtRatio = /* @__PURE__ */ __name((u, v) => {
      let tv1 = Fp.sqr(v);
      const tv2 = Fp.mul(u, v);
      tv1 = Fp.mul(tv1, tv2);
      let y1 = Fp.pow(tv1, c12);
      y1 = Fp.mul(y1, tv2);
      const y2 = Fp.mul(y1, c22);
      const tv3 = Fp.mul(Fp.sqr(y1), v);
      const isQR = Fp.eql(tv3, u);
      let y = Fp.cmov(y2, y1, isQR);
      return { isValid: isQR, value: y };
    }, "sqrtRatio");
  }
  return sqrtRatio;
}
function mapToCurveSimpleSWU(Fp, opts) {
  validateField(Fp);
  const { A, B, Z } = opts;
  if (!Fp.isValid(A) || !Fp.isValid(B) || !Fp.isValid(Z))
    throw new Error("mapToCurveSimpleSWU: invalid opts");
  const sqrtRatio = SWUFpSqrtRatio(Fp, Z);
  if (!Fp.isOdd)
    throw new Error("Field does not have .isOdd()");
  return (u) => {
    let tv1, tv2, tv3, tv4, tv5, tv6, x, y;
    tv1 = Fp.sqr(u);
    tv1 = Fp.mul(tv1, Z);
    tv2 = Fp.sqr(tv1);
    tv2 = Fp.add(tv2, tv1);
    tv3 = Fp.add(tv2, Fp.ONE);
    tv3 = Fp.mul(tv3, B);
    tv4 = Fp.cmov(Z, Fp.neg(tv2), !Fp.eql(tv2, Fp.ZERO));
    tv4 = Fp.mul(tv4, A);
    tv2 = Fp.sqr(tv3);
    tv6 = Fp.sqr(tv4);
    tv5 = Fp.mul(tv6, A);
    tv2 = Fp.add(tv2, tv5);
    tv2 = Fp.mul(tv2, tv3);
    tv6 = Fp.mul(tv6, tv4);
    tv5 = Fp.mul(tv6, B);
    tv2 = Fp.add(tv2, tv5);
    x = Fp.mul(tv1, tv3);
    const { isValid, value } = sqrtRatio(tv2, tv6);
    y = Fp.mul(tv1, u);
    y = Fp.mul(y, value);
    x = Fp.cmov(x, tv3, isValid);
    y = Fp.cmov(y, value, isValid);
    const e1 = Fp.isOdd(u) === Fp.isOdd(y);
    y = Fp.cmov(Fp.neg(y), y, e1);
    const tv4_inv = FpInvertBatch(Fp, [tv4], true)[0];
    x = Fp.mul(x, tv4_inv);
    return { x, y };
  };
}
var DERErr, DER, _0n5, _1n5, _2n3, _3n2, _4n2;
var init_weierstrass = __esm({
  "node_modules/viem/node_modules/@noble/curves/esm/abstract/weierstrass.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_hmac();
    init_utils4();
    init_curve();
    init_modular();
    __name(validateSigVerOpts, "validateSigVerOpts");
    DERErr = class extends Error {
      static {
        __name(this, "DERErr");
      }
      constructor(m = "") {
        super(m);
      }
    };
    DER = {
      // asn.1 DER encoding utils
      Err: DERErr,
      // Basic building block is TLV (Tag-Length-Value)
      _tlv: {
        encode: /* @__PURE__ */ __name((tag, data) => {
          const { Err: E } = DER;
          if (tag < 0 || tag > 256)
            throw new E("tlv.encode: wrong tag");
          if (data.length & 1)
            throw new E("tlv.encode: unpadded data");
          const dataLen = data.length / 2;
          const len = numberToHexUnpadded(dataLen);
          if (len.length / 2 & 128)
            throw new E("tlv.encode: long form length too big");
          const lenLen = dataLen > 127 ? numberToHexUnpadded(len.length / 2 | 128) : "";
          const t = numberToHexUnpadded(tag);
          return t + lenLen + len + data;
        }, "encode"),
        // v - value, l - left bytes (unparsed)
        decode(tag, data) {
          const { Err: E } = DER;
          let pos = 0;
          if (tag < 0 || tag > 256)
            throw new E("tlv.encode: wrong tag");
          if (data.length < 2 || data[pos++] !== tag)
            throw new E("tlv.decode: wrong tlv");
          const first = data[pos++];
          const isLong = !!(first & 128);
          let length = 0;
          if (!isLong)
            length = first;
          else {
            const lenLen = first & 127;
            if (!lenLen)
              throw new E("tlv.decode(long): indefinite length not supported");
            if (lenLen > 4)
              throw new E("tlv.decode(long): byte length is too big");
            const lengthBytes = data.subarray(pos, pos + lenLen);
            if (lengthBytes.length !== lenLen)
              throw new E("tlv.decode: length bytes not complete");
            if (lengthBytes[0] === 0)
              throw new E("tlv.decode(long): zero leftmost byte");
            for (const b of lengthBytes)
              length = length << 8 | b;
            pos += lenLen;
            if (length < 128)
              throw new E("tlv.decode(long): not minimal encoding");
          }
          const v = data.subarray(pos, pos + length);
          if (v.length !== length)
            throw new E("tlv.decode: wrong value length");
          return { v, l: data.subarray(pos + length) };
        }
      },
      // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
      // since we always use positive integers here. It must always be empty:
      // - add zero byte if exists
      // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
      _int: {
        encode(num2) {
          const { Err: E } = DER;
          if (num2 < _0n5)
            throw new E("integer: negative integers are not allowed");
          let hex = numberToHexUnpadded(num2);
          if (Number.parseInt(hex[0], 16) & 8)
            hex = "00" + hex;
          if (hex.length & 1)
            throw new E("unexpected DER parsing assertion: unpadded hex");
          return hex;
        },
        decode(data) {
          const { Err: E } = DER;
          if (data[0] & 128)
            throw new E("invalid signature integer: negative");
          if (data[0] === 0 && !(data[1] & 128))
            throw new E("invalid signature integer: unnecessary leading zero");
          return bytesToNumberBE(data);
        }
      },
      toSig(hex) {
        const { Err: E, _int: int, _tlv: tlv } = DER;
        const data = ensureBytes("signature", hex);
        const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
        if (seqLeftBytes.length)
          throw new E("invalid signature: left bytes after parsing");
        const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
        const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
        if (sLeftBytes.length)
          throw new E("invalid signature: left bytes after parsing");
        return { r: int.decode(rBytes), s: int.decode(sBytes) };
      },
      hexFromSig(sig) {
        const { _tlv: tlv, _int: int } = DER;
        const rs = tlv.encode(2, int.encode(sig.r));
        const ss = tlv.encode(2, int.encode(sig.s));
        const seq = rs + ss;
        return tlv.encode(48, seq);
      }
    };
    _0n5 = BigInt(0);
    _1n5 = BigInt(1);
    _2n3 = BigInt(2);
    _3n2 = BigInt(3);
    _4n2 = BigInt(4);
    __name(_legacyHelperEquat, "_legacyHelperEquat");
    __name(_legacyHelperNormPriv, "_legacyHelperNormPriv");
    __name(weierstrassN, "weierstrassN");
    __name(pprefix, "pprefix");
    __name(ecdsa, "ecdsa");
    __name(_weierstrass_legacy_opts_to_new, "_weierstrass_legacy_opts_to_new");
    __name(_ecdsa_legacy_opts_to_new, "_ecdsa_legacy_opts_to_new");
    __name(_ecdsa_new_output_to_legacy, "_ecdsa_new_output_to_legacy");
    __name(weierstrass, "weierstrass");
    __name(SWUFpSqrtRatio, "SWUFpSqrtRatio");
    __name(mapToCurveSimpleSWU, "mapToCurveSimpleSWU");
  }
});

// node_modules/viem/node_modules/@noble/curves/esm/_shortw_utils.js
function createCurve(curveDef, defHash) {
  const create = /* @__PURE__ */ __name((hash2) => weierstrass({ ...curveDef, hash: hash2 }), "create");
  return { ...create(defHash), create };
}
var init_shortw_utils = __esm({
  "node_modules/viem/node_modules/@noble/curves/esm/_shortw_utils.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_weierstrass();
    __name(createCurve, "createCurve");
  }
});

// node_modules/viem/node_modules/@noble/curves/esm/abstract/hash-to-curve.js
function i2osp(value, length) {
  anum(value);
  anum(length);
  if (value < 0 || value >= 1 << 8 * length)
    throw new Error("invalid I2OSP input: " + value);
  const res = Array.from({ length }).fill(0);
  for (let i = length - 1; i >= 0; i--) {
    res[i] = value & 255;
    value >>>= 8;
  }
  return new Uint8Array(res);
}
function strxor(a, b) {
  const arr = new Uint8Array(a.length);
  for (let i = 0; i < a.length; i++) {
    arr[i] = a[i] ^ b[i];
  }
  return arr;
}
function anum(item) {
  if (!Number.isSafeInteger(item))
    throw new Error("number expected");
}
function expand_message_xmd(msg, DST, lenInBytes, H) {
  abytes(msg);
  abytes(DST);
  anum(lenInBytes);
  if (DST.length > 255)
    DST = H(concatBytes(utf8ToBytes("H2C-OVERSIZE-DST-"), DST));
  const { outputLen: b_in_bytes, blockLen: r_in_bytes } = H;
  const ell = Math.ceil(lenInBytes / b_in_bytes);
  if (lenInBytes > 65535 || ell > 255)
    throw new Error("expand_message_xmd: invalid lenInBytes");
  const DST_prime = concatBytes(DST, i2osp(DST.length, 1));
  const Z_pad = i2osp(0, r_in_bytes);
  const l_i_b_str = i2osp(lenInBytes, 2);
  const b = new Array(ell);
  const b_0 = H(concatBytes(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
  b[0] = H(concatBytes(b_0, i2osp(1, 1), DST_prime));
  for (let i = 1; i <= ell; i++) {
    const args = [strxor(b_0, b[i - 1]), i2osp(i + 1, 1), DST_prime];
    b[i] = H(concatBytes(...args));
  }
  const pseudo_random_bytes = concatBytes(...b);
  return pseudo_random_bytes.slice(0, lenInBytes);
}
function expand_message_xof(msg, DST, lenInBytes, k, H) {
  abytes(msg);
  abytes(DST);
  anum(lenInBytes);
  if (DST.length > 255) {
    const dkLen = Math.ceil(2 * k / 8);
    DST = H.create({ dkLen }).update(utf8ToBytes("H2C-OVERSIZE-DST-")).update(DST).digest();
  }
  if (lenInBytes > 65535 || DST.length > 255)
    throw new Error("expand_message_xof: invalid lenInBytes");
  return H.create({ dkLen: lenInBytes }).update(msg).update(i2osp(lenInBytes, 2)).update(DST).update(i2osp(DST.length, 1)).digest();
}
function hash_to_field(msg, count, options) {
  _validateObject(options, {
    p: "bigint",
    m: "number",
    k: "number",
    hash: "function"
  });
  const { p, k, m, hash: hash2, expand, DST: _DST } = options;
  if (!isBytes(_DST) && typeof _DST !== "string")
    throw new Error("DST must be string or uint8array");
  if (!isHash(options.hash))
    throw new Error("expected valid hash");
  abytes(msg);
  anum(count);
  const DST = typeof _DST === "string" ? utf8ToBytes(_DST) : _DST;
  const log2p = p.toString(2).length;
  const L = Math.ceil((log2p + k) / 8);
  const len_in_bytes = count * m * L;
  let prb;
  if (expand === "xmd") {
    prb = expand_message_xmd(msg, DST, len_in_bytes, hash2);
  } else if (expand === "xof") {
    prb = expand_message_xof(msg, DST, len_in_bytes, k, hash2);
  } else if (expand === "_internal_pass") {
    prb = msg;
  } else {
    throw new Error('expand must be "xmd" or "xof"');
  }
  const u = new Array(count);
  for (let i = 0; i < count; i++) {
    const e = new Array(m);
    for (let j = 0; j < m; j++) {
      const elm_offset = L * (j + i * m);
      const tv = prb.subarray(elm_offset, elm_offset + L);
      e[j] = mod(os2ip(tv), p);
    }
    u[i] = e;
  }
  return u;
}
function isogenyMap(field, map) {
  const coeff = map.map((i) => Array.from(i).reverse());
  return (x, y) => {
    const [xn, xd, yn, yd] = coeff.map((val) => val.reduce((acc, i) => field.add(field.mul(acc, x), i)));
    const [xd_inv, yd_inv] = FpInvertBatch(field, [xd, yd], true);
    x = field.mul(xn, xd_inv);
    y = field.mul(y, field.mul(yn, yd_inv));
    return { x, y };
  };
}
function createHasher2(Point2, mapToCurve, defaults) {
  if (typeof mapToCurve !== "function")
    throw new Error("mapToCurve() must be defined");
  function map(num2) {
    return Point2.fromAffine(mapToCurve(num2));
  }
  __name(map, "map");
  function clear(initial) {
    const P = initial.clearCofactor();
    if (P.equals(Point2.ZERO))
      return Point2.ZERO;
    P.assertValidity();
    return P;
  }
  __name(clear, "clear");
  return {
    defaults,
    hashToCurve(msg, options) {
      const dst = defaults.DST ? defaults.DST : {};
      const opts = Object.assign({}, defaults, dst, options);
      const u = hash_to_field(msg, 2, opts);
      const u0 = map(u[0]);
      const u1 = map(u[1]);
      return clear(u0.add(u1));
    },
    encodeToCurve(msg, options) {
      const dst = defaults.encodeDST ? defaults.encodeDST : {};
      const opts = Object.assign({}, defaults, dst, options);
      const u = hash_to_field(msg, 1, opts);
      return clear(map(u[0]));
    },
    /** See {@link H2CHasher} */
    mapToCurve(scalars) {
      if (!Array.isArray(scalars))
        throw new Error("expected array of bigints");
      for (const i of scalars)
        if (typeof i !== "bigint")
          throw new Error("expected array of bigints");
      return clear(map(scalars));
    }
  };
}
var os2ip;
var init_hash_to_curve = __esm({
  "node_modules/viem/node_modules/@noble/curves/esm/abstract/hash-to-curve.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_utils4();
    init_modular();
    os2ip = bytesToNumberBE;
    __name(i2osp, "i2osp");
    __name(strxor, "strxor");
    __name(anum, "anum");
    __name(expand_message_xmd, "expand_message_xmd");
    __name(expand_message_xof, "expand_message_xof");
    __name(hash_to_field, "hash_to_field");
    __name(isogenyMap, "isogenyMap");
    __name(createHasher2, "createHasher");
  }
});

// node_modules/viem/node_modules/@noble/curves/esm/secp256k1.js
var secp256k1_exports = {};
__export(secp256k1_exports, {
  encodeToCurve: () => encodeToCurve,
  hashToCurve: () => hashToCurve,
  schnorr: () => schnorr,
  secp256k1: () => secp256k1,
  secp256k1_hasher: () => secp256k1_hasher
});
function sqrtMod(y) {
  const P = secp256k1_CURVE.p;
  const _3n3 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
  const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
  const b2 = y * y * y % P;
  const b3 = b2 * b2 * y % P;
  const b6 = pow2(b3, _3n3, P) * b3 % P;
  const b9 = pow2(b6, _3n3, P) * b3 % P;
  const b11 = pow2(b9, _2n4, P) * b2 % P;
  const b22 = pow2(b11, _11n, P) * b11 % P;
  const b44 = pow2(b22, _22n, P) * b22 % P;
  const b88 = pow2(b44, _44n, P) * b44 % P;
  const b176 = pow2(b88, _88n, P) * b88 % P;
  const b220 = pow2(b176, _44n, P) * b44 % P;
  const b223 = pow2(b220, _3n3, P) * b3 % P;
  const t1 = pow2(b223, _23n, P) * b22 % P;
  const t2 = pow2(t1, _6n, P) * b2 % P;
  const root = pow2(t2, _2n4, P);
  if (!Fpk1.eql(Fpk1.sqr(root), y))
    throw new Error("Cannot find square root");
  return root;
}
function taggedHash(tag, ...messages) {
  let tagP = TAGGED_HASH_PREFIXES[tag];
  if (tagP === void 0) {
    const tagH = sha256(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
    tagP = concatBytes(tagH, tagH);
    TAGGED_HASH_PREFIXES[tag] = tagP;
  }
  return sha256(concatBytes(tagP, ...messages));
}
function schnorrGetExtPubKey(priv) {
  let d_ = secp256k1.utils.normPrivateKeyToScalar(priv);
  let p = Point.fromPrivateKey(d_);
  const scalar = hasEven(p.y) ? d_ : modN(-d_);
  return { scalar, bytes: pointToBytes(p) };
}
function lift_x(x) {
  aInRange("x", x, _1n6, secp256k1_CURVE.p);
  const xx = modP(x * x);
  const c = modP(xx * x + BigInt(7));
  let y = sqrtMod(c);
  if (!hasEven(y))
    y = modP(-y);
  const p = Point.fromAffine({ x, y });
  p.assertValidity();
  return p;
}
function challenge(...args) {
  return modN(num(taggedHash("BIP0340/challenge", ...args)));
}
function schnorrGetPublicKey(privateKey) {
  return schnorrGetExtPubKey(privateKey).bytes;
}
function schnorrSign(message, privateKey, auxRand = randomBytes(32)) {
  const m = ensureBytes("message", message);
  const { bytes: px, scalar: d } = schnorrGetExtPubKey(privateKey);
  const a = ensureBytes("auxRand", auxRand, 32);
  const t = numTo32b(d ^ num(taggedHash("BIP0340/aux", a)));
  const rand = taggedHash("BIP0340/nonce", t, px, m);
  const k_ = modN(num(rand));
  if (k_ === _0n6)
    throw new Error("sign failed: k is zero");
  const { bytes: rx, scalar: k } = schnorrGetExtPubKey(k_);
  const e = challenge(rx, px, m);
  const sig = new Uint8Array(64);
  sig.set(rx, 0);
  sig.set(numTo32b(modN(k + e * d)), 32);
  if (!schnorrVerify(sig, m, px))
    throw new Error("sign: Invalid signature produced");
  return sig;
}
function schnorrVerify(signature, message, publicKey) {
  const sig = ensureBytes("signature", signature, 64);
  const m = ensureBytes("message", message);
  const pub = ensureBytes("publicKey", publicKey, 32);
  try {
    const P = lift_x(num(pub));
    const r = num(sig.subarray(0, 32));
    if (!inRange(r, _1n6, secp256k1_CURVE.p))
      return false;
    const s = num(sig.subarray(32, 64));
    if (!inRange(s, _1n6, secp256k1_CURVE.n))
      return false;
    const e = challenge(numTo32b(r), pointToBytes(P), m);
    const R = Point.BASE.multiplyUnsafe(s).add(P.multiplyUnsafe(modN(-e)));
    const { x, y } = R.toAffine();
    if (R.is0() || !hasEven(y) || x !== r)
      return false;
    return true;
  } catch (error) {
    return false;
  }
}
var secp256k1_CURVE, _0n6, _1n6, _2n4, divNearest, Fpk1, secp256k1, TAGGED_HASH_PREFIXES, pointToBytes, numTo32b, modP, modN, Point, hasEven, num, schnorr, isoMap, mapSWU, secp256k1_hasher, hashToCurve, encodeToCurve;
var init_secp256k1 = __esm({
  "node_modules/viem/node_modules/@noble/curves/esm/secp256k1.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_sha2();
    init_utils2();
    init_shortw_utils();
    init_hash_to_curve();
    init_modular();
    init_weierstrass();
    init_utils4();
    secp256k1_CURVE = {
      p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
      n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
      h: BigInt(1),
      a: BigInt(0),
      b: BigInt(7),
      Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
      Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
    };
    _0n6 = BigInt(0);
    _1n6 = BigInt(1);
    _2n4 = BigInt(2);
    divNearest = /* @__PURE__ */ __name((a, b) => (a + b / _2n4) / b, "divNearest");
    __name(sqrtMod, "sqrtMod");
    Fpk1 = Field(secp256k1_CURVE.p, void 0, void 0, { sqrt: sqrtMod });
    secp256k1 = createCurve({
      ...secp256k1_CURVE,
      Fp: Fpk1,
      lowS: true,
      // Allow only low-S signatures by default in sign() and verify()
      endo: {
        // Endomorphism, see above
        beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
        splitScalar: /* @__PURE__ */ __name((k) => {
          const n = secp256k1_CURVE.n;
          const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
          const b1 = -_1n6 * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
          const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
          const b2 = a1;
          const POW_2_128 = BigInt("0x100000000000000000000000000000000");
          const c1 = divNearest(b2 * k, n);
          const c2 = divNearest(-b1 * k, n);
          let k1 = mod(k - c1 * a1 - c2 * a2, n);
          let k2 = mod(-c1 * b1 - c2 * b2, n);
          const k1neg = k1 > POW_2_128;
          const k2neg = k2 > POW_2_128;
          if (k1neg)
            k1 = n - k1;
          if (k2neg)
            k2 = n - k2;
          if (k1 > POW_2_128 || k2 > POW_2_128) {
            throw new Error("splitScalar: Endomorphism failed, k=" + k);
          }
          return { k1neg, k1, k2neg, k2 };
        }, "splitScalar")
      }
    }, sha256);
    TAGGED_HASH_PREFIXES = {};
    __name(taggedHash, "taggedHash");
    pointToBytes = /* @__PURE__ */ __name((point) => point.toBytes(true).slice(1), "pointToBytes");
    numTo32b = /* @__PURE__ */ __name((n) => numberToBytesBE(n, 32), "numTo32b");
    modP = /* @__PURE__ */ __name((x) => mod(x, secp256k1_CURVE.p), "modP");
    modN = /* @__PURE__ */ __name((x) => mod(x, secp256k1_CURVE.n), "modN");
    Point = /* @__PURE__ */ (() => secp256k1.Point)();
    hasEven = /* @__PURE__ */ __name((y) => y % _2n4 === _0n6, "hasEven");
    __name(schnorrGetExtPubKey, "schnorrGetExtPubKey");
    __name(lift_x, "lift_x");
    num = bytesToNumberBE;
    __name(challenge, "challenge");
    __name(schnorrGetPublicKey, "schnorrGetPublicKey");
    __name(schnorrSign, "schnorrSign");
    __name(schnorrVerify, "schnorrVerify");
    schnorr = /* @__PURE__ */ (() => ({
      getPublicKey: schnorrGetPublicKey,
      sign: schnorrSign,
      verify: schnorrVerify,
      utils: {
        randomPrivateKey: secp256k1.utils.randomPrivateKey,
        lift_x,
        pointToBytes,
        numberToBytesBE,
        bytesToNumberBE,
        taggedHash,
        mod
      }
    }))();
    isoMap = /* @__PURE__ */ (() => isogenyMap(Fpk1, [
      // xNum
      [
        "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa8c7",
        "0x7d3d4c80bc321d5b9f315cea7fd44c5d595d2fc0bf63b92dfff1044f17c6581",
        "0x534c328d23f234e6e2a413deca25caece4506144037c40314ecbd0b53d9dd262",
        "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa88c"
      ],
      // xDen
      [
        "0xd35771193d94918a9ca34ccbb7b640dd86cd409542f8487d9fe6b745781eb49b",
        "0xedadc6f64383dc1df7c4b2d51b54225406d36b641f5e41bbc52a56612a8c6d14",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
        // LAST 1
      ],
      // yNum
      [
        "0x4bda12f684bda12f684bda12f684bda12f684bda12f684bda12f684b8e38e23c",
        "0xc75e0c32d5cb7c0fa9d0a54b12a0a6d5647ab046d686da6fdffc90fc201d71a3",
        "0x29a6194691f91a73715209ef6512e576722830a201be2018a765e85a9ecee931",
        "0x2f684bda12f684bda12f684bda12f684bda12f684bda12f684bda12f38e38d84"
      ],
      // yDen
      [
        "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffff93b",
        "0x7a06534bb8bdb49fd5e9e6632722c2989467c1bfc8e8d978dfb425d2685c2573",
        "0x6484aa716545ca2cf3a70c3fa8fe337e0a3d21162f0d6299a7bf8192bfd2a76f",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
        // LAST 1
      ]
    ].map((i) => i.map((j) => BigInt(j)))))();
    mapSWU = /* @__PURE__ */ (() => mapToCurveSimpleSWU(Fpk1, {
      A: BigInt("0x3f8731abdd661adca08a5558f0f5d272e953d363cb6f0e5d405447c01a444533"),
      B: BigInt("1771"),
      Z: Fpk1.create(BigInt("-11"))
    }))();
    secp256k1_hasher = /* @__PURE__ */ (() => createHasher2(secp256k1.Point, (scalars) => {
      const { x, y } = mapSWU(Fpk1.create(scalars[0]));
      return isoMap(x, y);
    }, {
      DST: "secp256k1_XMD:SHA-256_SSWU_RO_",
      encodeDST: "secp256k1_XMD:SHA-256_SSWU_NU_",
      p: Fpk1.ORDER,
      m: 1,
      k: 128,
      expand: "xmd",
      hash: sha256
    }))();
    hashToCurve = /* @__PURE__ */ (() => secp256k1_hasher.hashToCurve)();
    encodeToCurve = /* @__PURE__ */ (() => secp256k1_hasher.encodeToCurve)();
  }
});

// node_modules/viem/_esm/errors/node.js
var ExecutionRevertedError, FeeCapTooHighError, FeeCapTooLowError, NonceTooHighError, NonceTooLowError, NonceMaxValueError, InsufficientFundsError, IntrinsicGasTooHighError, IntrinsicGasTooLowError, TransactionTypeNotSupportedError, TipAboveFeeCapError, UnknownNodeError;
var init_node = __esm({
  "node_modules/viem/_esm/errors/node.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_formatGwei();
    init_base();
    ExecutionRevertedError = class extends BaseError2 {
      static {
        __name(this, "ExecutionRevertedError");
      }
      constructor({ cause, message } = {}) {
        const reason = message?.replace("execution reverted: ", "")?.replace("execution reverted", "");
        super(`Execution reverted ${reason ? `with reason: ${reason}` : "for an unknown reason"}.`, {
          cause,
          name: "ExecutionRevertedError"
        });
      }
    };
    Object.defineProperty(ExecutionRevertedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 3
    });
    Object.defineProperty(ExecutionRevertedError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /execution reverted/
    });
    FeeCapTooHighError = class extends BaseError2 {
      static {
        __name(this, "FeeCapTooHighError");
      }
      constructor({ cause, maxFeePerGas } = {}) {
        super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ""}) cannot be higher than the maximum allowed value (2^256-1).`, {
          cause,
          name: "FeeCapTooHighError"
        });
      }
    };
    Object.defineProperty(FeeCapTooHighError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/
    });
    FeeCapTooLowError = class extends BaseError2 {
      static {
        __name(this, "FeeCapTooLowError");
      }
      constructor({ cause, maxFeePerGas } = {}) {
        super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)}` : ""} gwei) cannot be lower than the block base fee.`, {
          cause,
          name: "FeeCapTooLowError"
        });
      }
    };
    Object.defineProperty(FeeCapTooLowError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /max fee per gas less than block base fee|fee cap less than block base fee|transaction is outdated/
    });
    NonceTooHighError = class extends BaseError2 {
      static {
        __name(this, "NonceTooHighError");
      }
      constructor({ cause, nonce } = {}) {
        super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is higher than the next one expected.`, { cause, name: "NonceTooHighError" });
      }
    };
    Object.defineProperty(NonceTooHighError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /nonce too high/
    });
    NonceTooLowError = class extends BaseError2 {
      static {
        __name(this, "NonceTooLowError");
      }
      constructor({ cause, nonce } = {}) {
        super([
          `Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is lower than the current nonce of the account.`,
          "Try increasing the nonce or find the latest nonce with `getTransactionCount`."
        ].join("\n"), { cause, name: "NonceTooLowError" });
      }
    };
    Object.defineProperty(NonceTooLowError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /nonce too low|transaction already imported|already known/
    });
    NonceMaxValueError = class extends BaseError2 {
      static {
        __name(this, "NonceMaxValueError");
      }
      constructor({ cause, nonce } = {}) {
        super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}exceeds the maximum allowed nonce.`, { cause, name: "NonceMaxValueError" });
      }
    };
    Object.defineProperty(NonceMaxValueError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /nonce has max value/
    });
    InsufficientFundsError = class extends BaseError2 {
      static {
        __name(this, "InsufficientFundsError");
      }
      constructor({ cause } = {}) {
        super([
          "The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."
        ].join("\n"), {
          cause,
          metaMessages: [
            "This error could arise when the account does not have enough funds to:",
            " - pay for the total gas fee,",
            " - pay for the value to send.",
            " ",
            "The cost of the transaction is calculated as `gas * gas fee + value`, where:",
            " - `gas` is the amount of gas needed for transaction to execute,",
            " - `gas fee` is the gas fee,",
            " - `value` is the amount of ether to send to the recipient."
          ],
          name: "InsufficientFundsError"
        });
      }
    };
    Object.defineProperty(InsufficientFundsError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /insufficient funds|exceeds transaction sender account balance/
    });
    IntrinsicGasTooHighError = class extends BaseError2 {
      static {
        __name(this, "IntrinsicGasTooHighError");
      }
      constructor({ cause, gas } = {}) {
        super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction exceeds the limit allowed for the block.`, {
          cause,
          name: "IntrinsicGasTooHighError"
        });
      }
    };
    Object.defineProperty(IntrinsicGasTooHighError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /intrinsic gas too high|gas limit reached/
    });
    IntrinsicGasTooLowError = class extends BaseError2 {
      static {
        __name(this, "IntrinsicGasTooLowError");
      }
      constructor({ cause, gas } = {}) {
        super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction is too low.`, {
          cause,
          name: "IntrinsicGasTooLowError"
        });
      }
    };
    Object.defineProperty(IntrinsicGasTooLowError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /intrinsic gas too low/
    });
    TransactionTypeNotSupportedError = class extends BaseError2 {
      static {
        __name(this, "TransactionTypeNotSupportedError");
      }
      constructor({ cause }) {
        super("The transaction type is not supported for this chain.", {
          cause,
          name: "TransactionTypeNotSupportedError"
        });
      }
    };
    Object.defineProperty(TransactionTypeNotSupportedError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /transaction type not valid/
    });
    TipAboveFeeCapError = class extends BaseError2 {
      static {
        __name(this, "TipAboveFeeCapError");
      }
      constructor({ cause, maxPriorityFeePerGas, maxFeePerGas } = {}) {
        super([
          `The provided tip (\`maxPriorityFeePerGas\`${maxPriorityFeePerGas ? ` = ${formatGwei(maxPriorityFeePerGas)} gwei` : ""}) cannot be higher than the fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ""}).`
        ].join("\n"), {
          cause,
          name: "TipAboveFeeCapError"
        });
      }
    };
    Object.defineProperty(TipAboveFeeCapError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /max priority fee per gas higher than max fee per gas|tip higher than fee cap/
    });
    UnknownNodeError = class extends BaseError2 {
      static {
        __name(this, "UnknownNodeError");
      }
      constructor({ cause }) {
        super(`An error occurred while executing: ${cause?.shortMessage}`, {
          cause,
          name: "UnknownNodeError"
        });
      }
    };
  }
});

// node_modules/viem/_esm/utils/errors/getNodeError.js
function getNodeError(err, args) {
  const message = (err.details || "").toLowerCase();
  const executionRevertedError = err instanceof BaseError2 ? err.walk((e) => e?.code === ExecutionRevertedError.code) : err;
  if (executionRevertedError instanceof BaseError2)
    return new ExecutionRevertedError({
      cause: err,
      message: executionRevertedError.details
    });
  if (ExecutionRevertedError.nodeMessage.test(message))
    return new ExecutionRevertedError({
      cause: err,
      message: err.details
    });
  if (FeeCapTooHighError.nodeMessage.test(message))
    return new FeeCapTooHighError({
      cause: err,
      maxFeePerGas: args?.maxFeePerGas
    });
  if (FeeCapTooLowError.nodeMessage.test(message))
    return new FeeCapTooLowError({
      cause: err,
      maxFeePerGas: args?.maxFeePerGas
    });
  if (NonceTooHighError.nodeMessage.test(message))
    return new NonceTooHighError({ cause: err, nonce: args?.nonce });
  if (NonceTooLowError.nodeMessage.test(message))
    return new NonceTooLowError({ cause: err, nonce: args?.nonce });
  if (NonceMaxValueError.nodeMessage.test(message))
    return new NonceMaxValueError({ cause: err, nonce: args?.nonce });
  if (InsufficientFundsError.nodeMessage.test(message))
    return new InsufficientFundsError({ cause: err });
  if (IntrinsicGasTooHighError.nodeMessage.test(message))
    return new IntrinsicGasTooHighError({ cause: err, gas: args?.gas });
  if (IntrinsicGasTooLowError.nodeMessage.test(message))
    return new IntrinsicGasTooLowError({ cause: err, gas: args?.gas });
  if (TransactionTypeNotSupportedError.nodeMessage.test(message))
    return new TransactionTypeNotSupportedError({ cause: err });
  if (TipAboveFeeCapError.nodeMessage.test(message))
    return new TipAboveFeeCapError({
      cause: err,
      maxFeePerGas: args?.maxFeePerGas,
      maxPriorityFeePerGas: args?.maxPriorityFeePerGas
    });
  return new UnknownNodeError({
    cause: err
  });
}
var init_getNodeError = __esm({
  "node_modules/viem/_esm/utils/errors/getNodeError.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_base();
    init_node();
    __name(getNodeError, "getNodeError");
  }
});

// node_modules/viem/_esm/utils/formatters/extract.js
function extract(value_, { format }) {
  if (!format)
    return {};
  const value = {};
  function extract_(formatted2) {
    const keys = Object.keys(formatted2);
    for (const key of keys) {
      if (key in value_)
        value[key] = value_[key];
      if (formatted2[key] && typeof formatted2[key] === "object" && !Array.isArray(formatted2[key]))
        extract_(formatted2[key]);
    }
  }
  __name(extract_, "extract_");
  const formatted = format(value_ || {});
  extract_(formatted);
  return value;
}
var init_extract = __esm({
  "node_modules/viem/_esm/utils/formatters/extract.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    __name(extract, "extract");
  }
});

// node_modules/viem/_esm/utils/formatters/transactionRequest.js
function formatTransactionRequest(request) {
  const rpcRequest = {};
  if (typeof request.authorizationList !== "undefined")
    rpcRequest.authorizationList = formatAuthorizationList(request.authorizationList);
  if (typeof request.accessList !== "undefined")
    rpcRequest.accessList = request.accessList;
  if (typeof request.blobVersionedHashes !== "undefined")
    rpcRequest.blobVersionedHashes = request.blobVersionedHashes;
  if (typeof request.blobs !== "undefined") {
    if (typeof request.blobs[0] !== "string")
      rpcRequest.blobs = request.blobs.map((x) => bytesToHex(x));
    else
      rpcRequest.blobs = request.blobs;
  }
  if (typeof request.data !== "undefined")
    rpcRequest.data = request.data;
  if (typeof request.from !== "undefined")
    rpcRequest.from = request.from;
  if (typeof request.gas !== "undefined")
    rpcRequest.gas = numberToHex(request.gas);
  if (typeof request.gasPrice !== "undefined")
    rpcRequest.gasPrice = numberToHex(request.gasPrice);
  if (typeof request.maxFeePerBlobGas !== "undefined")
    rpcRequest.maxFeePerBlobGas = numberToHex(request.maxFeePerBlobGas);
  if (typeof request.maxFeePerGas !== "undefined")
    rpcRequest.maxFeePerGas = numberToHex(request.maxFeePerGas);
  if (typeof request.maxPriorityFeePerGas !== "undefined")
    rpcRequest.maxPriorityFeePerGas = numberToHex(request.maxPriorityFeePerGas);
  if (typeof request.nonce !== "undefined")
    rpcRequest.nonce = numberToHex(request.nonce);
  if (typeof request.to !== "undefined")
    rpcRequest.to = request.to;
  if (typeof request.type !== "undefined")
    rpcRequest.type = rpcTransactionType[request.type];
  if (typeof request.value !== "undefined")
    rpcRequest.value = numberToHex(request.value);
  return rpcRequest;
}
function formatAuthorizationList(authorizationList) {
  return authorizationList.map((authorization) => ({
    address: authorization.address,
    r: authorization.r ? numberToHex(BigInt(authorization.r)) : authorization.r,
    s: authorization.s ? numberToHex(BigInt(authorization.s)) : authorization.s,
    chainId: numberToHex(authorization.chainId),
    nonce: numberToHex(authorization.nonce),
    ...typeof authorization.yParity !== "undefined" ? { yParity: numberToHex(authorization.yParity) } : {},
    ...typeof authorization.v !== "undefined" && typeof authorization.yParity === "undefined" ? { v: numberToHex(authorization.v) } : {}
  }));
}
var rpcTransactionType;
var init_transactionRequest = __esm({
  "node_modules/viem/_esm/utils/formatters/transactionRequest.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_toHex();
    rpcTransactionType = {
      legacy: "0x0",
      eip2930: "0x1",
      eip1559: "0x2",
      eip4844: "0x3",
      eip7702: "0x4"
    };
    __name(formatTransactionRequest, "formatTransactionRequest");
    __name(formatAuthorizationList, "formatAuthorizationList");
  }
});

// node_modules/viem/_esm/utils/stateOverride.js
function serializeStateMapping(stateMapping) {
  if (!stateMapping || stateMapping.length === 0)
    return void 0;
  return stateMapping.reduce((acc, { slot, value }) => {
    if (slot.length !== 66)
      throw new InvalidBytesLengthError({
        size: slot.length,
        targetSize: 66,
        type: "hex"
      });
    if (value.length !== 66)
      throw new InvalidBytesLengthError({
        size: value.length,
        targetSize: 66,
        type: "hex"
      });
    acc[slot] = value;
    return acc;
  }, {});
}
function serializeAccountStateOverride(parameters) {
  const { balance, nonce, state, stateDiff, code } = parameters;
  const rpcAccountStateOverride = {};
  if (code !== void 0)
    rpcAccountStateOverride.code = code;
  if (balance !== void 0)
    rpcAccountStateOverride.balance = numberToHex(balance);
  if (nonce !== void 0)
    rpcAccountStateOverride.nonce = numberToHex(nonce);
  if (state !== void 0)
    rpcAccountStateOverride.state = serializeStateMapping(state);
  if (stateDiff !== void 0) {
    if (rpcAccountStateOverride.state)
      throw new StateAssignmentConflictError();
    rpcAccountStateOverride.stateDiff = serializeStateMapping(stateDiff);
  }
  return rpcAccountStateOverride;
}
function serializeStateOverride(parameters) {
  if (!parameters)
    return void 0;
  const rpcStateOverride = {};
  for (const { address, ...accountState } of parameters) {
    if (!isAddress(address, { strict: false }))
      throw new InvalidAddressError({ address });
    if (rpcStateOverride[address])
      throw new AccountStateConflictError({ address });
    rpcStateOverride[address] = serializeAccountStateOverride(accountState);
  }
  return rpcStateOverride;
}
var init_stateOverride2 = __esm({
  "node_modules/viem/_esm/utils/stateOverride.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_address();
    init_data();
    init_stateOverride();
    init_isAddress();
    init_toHex();
    __name(serializeStateMapping, "serializeStateMapping");
    __name(serializeAccountStateOverride, "serializeAccountStateOverride");
    __name(serializeStateOverride, "serializeStateOverride");
  }
});

// node_modules/viem/_esm/constants/number.js
var maxInt8, maxInt16, maxInt24, maxInt32, maxInt40, maxInt48, maxInt56, maxInt64, maxInt72, maxInt80, maxInt88, maxInt96, maxInt104, maxInt112, maxInt120, maxInt128, maxInt136, maxInt144, maxInt152, maxInt160, maxInt168, maxInt176, maxInt184, maxInt192, maxInt200, maxInt208, maxInt216, maxInt224, maxInt232, maxInt240, maxInt248, maxInt256, minInt8, minInt16, minInt24, minInt32, minInt40, minInt48, minInt56, minInt64, minInt72, minInt80, minInt88, minInt96, minInt104, minInt112, minInt120, minInt128, minInt136, minInt144, minInt152, minInt160, minInt168, minInt176, minInt184, minInt192, minInt200, minInt208, minInt216, minInt224, minInt232, minInt240, minInt248, minInt256, maxUint8, maxUint16, maxUint24, maxUint32, maxUint40, maxUint48, maxUint56, maxUint64, maxUint72, maxUint80, maxUint88, maxUint96, maxUint104, maxUint112, maxUint120, maxUint128, maxUint136, maxUint144, maxUint152, maxUint160, maxUint168, maxUint176, maxUint184, maxUint192, maxUint200, maxUint208, maxUint216, maxUint224, maxUint232, maxUint240, maxUint248, maxUint256;
var init_number = __esm({
  "node_modules/viem/_esm/constants/number.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    maxInt8 = 2n ** (8n - 1n) - 1n;
    maxInt16 = 2n ** (16n - 1n) - 1n;
    maxInt24 = 2n ** (24n - 1n) - 1n;
    maxInt32 = 2n ** (32n - 1n) - 1n;
    maxInt40 = 2n ** (40n - 1n) - 1n;
    maxInt48 = 2n ** (48n - 1n) - 1n;
    maxInt56 = 2n ** (56n - 1n) - 1n;
    maxInt64 = 2n ** (64n - 1n) - 1n;
    maxInt72 = 2n ** (72n - 1n) - 1n;
    maxInt80 = 2n ** (80n - 1n) - 1n;
    maxInt88 = 2n ** (88n - 1n) - 1n;
    maxInt96 = 2n ** (96n - 1n) - 1n;
    maxInt104 = 2n ** (104n - 1n) - 1n;
    maxInt112 = 2n ** (112n - 1n) - 1n;
    maxInt120 = 2n ** (120n - 1n) - 1n;
    maxInt128 = 2n ** (128n - 1n) - 1n;
    maxInt136 = 2n ** (136n - 1n) - 1n;
    maxInt144 = 2n ** (144n - 1n) - 1n;
    maxInt152 = 2n ** (152n - 1n) - 1n;
    maxInt160 = 2n ** (160n - 1n) - 1n;
    maxInt168 = 2n ** (168n - 1n) - 1n;
    maxInt176 = 2n ** (176n - 1n) - 1n;
    maxInt184 = 2n ** (184n - 1n) - 1n;
    maxInt192 = 2n ** (192n - 1n) - 1n;
    maxInt200 = 2n ** (200n - 1n) - 1n;
    maxInt208 = 2n ** (208n - 1n) - 1n;
    maxInt216 = 2n ** (216n - 1n) - 1n;
    maxInt224 = 2n ** (224n - 1n) - 1n;
    maxInt232 = 2n ** (232n - 1n) - 1n;
    maxInt240 = 2n ** (240n - 1n) - 1n;
    maxInt248 = 2n ** (248n - 1n) - 1n;
    maxInt256 = 2n ** (256n - 1n) - 1n;
    minInt8 = -(2n ** (8n - 1n));
    minInt16 = -(2n ** (16n - 1n));
    minInt24 = -(2n ** (24n - 1n));
    minInt32 = -(2n ** (32n - 1n));
    minInt40 = -(2n ** (40n - 1n));
    minInt48 = -(2n ** (48n - 1n));
    minInt56 = -(2n ** (56n - 1n));
    minInt64 = -(2n ** (64n - 1n));
    minInt72 = -(2n ** (72n - 1n));
    minInt80 = -(2n ** (80n - 1n));
    minInt88 = -(2n ** (88n - 1n));
    minInt96 = -(2n ** (96n - 1n));
    minInt104 = -(2n ** (104n - 1n));
    minInt112 = -(2n ** (112n - 1n));
    minInt120 = -(2n ** (120n - 1n));
    minInt128 = -(2n ** (128n - 1n));
    minInt136 = -(2n ** (136n - 1n));
    minInt144 = -(2n ** (144n - 1n));
    minInt152 = -(2n ** (152n - 1n));
    minInt160 = -(2n ** (160n - 1n));
    minInt168 = -(2n ** (168n - 1n));
    minInt176 = -(2n ** (176n - 1n));
    minInt184 = -(2n ** (184n - 1n));
    minInt192 = -(2n ** (192n - 1n));
    minInt200 = -(2n ** (200n - 1n));
    minInt208 = -(2n ** (208n - 1n));
    minInt216 = -(2n ** (216n - 1n));
    minInt224 = -(2n ** (224n - 1n));
    minInt232 = -(2n ** (232n - 1n));
    minInt240 = -(2n ** (240n - 1n));
    minInt248 = -(2n ** (248n - 1n));
    minInt256 = -(2n ** (256n - 1n));
    maxUint8 = 2n ** 8n - 1n;
    maxUint16 = 2n ** 16n - 1n;
    maxUint24 = 2n ** 24n - 1n;
    maxUint32 = 2n ** 32n - 1n;
    maxUint40 = 2n ** 40n - 1n;
    maxUint48 = 2n ** 48n - 1n;
    maxUint56 = 2n ** 56n - 1n;
    maxUint64 = 2n ** 64n - 1n;
    maxUint72 = 2n ** 72n - 1n;
    maxUint80 = 2n ** 80n - 1n;
    maxUint88 = 2n ** 88n - 1n;
    maxUint96 = 2n ** 96n - 1n;
    maxUint104 = 2n ** 104n - 1n;
    maxUint112 = 2n ** 112n - 1n;
    maxUint120 = 2n ** 120n - 1n;
    maxUint128 = 2n ** 128n - 1n;
    maxUint136 = 2n ** 136n - 1n;
    maxUint144 = 2n ** 144n - 1n;
    maxUint152 = 2n ** 152n - 1n;
    maxUint160 = 2n ** 160n - 1n;
    maxUint168 = 2n ** 168n - 1n;
    maxUint176 = 2n ** 176n - 1n;
    maxUint184 = 2n ** 184n - 1n;
    maxUint192 = 2n ** 192n - 1n;
    maxUint200 = 2n ** 200n - 1n;
    maxUint208 = 2n ** 208n - 1n;
    maxUint216 = 2n ** 216n - 1n;
    maxUint224 = 2n ** 224n - 1n;
    maxUint232 = 2n ** 232n - 1n;
    maxUint240 = 2n ** 240n - 1n;
    maxUint248 = 2n ** 248n - 1n;
    maxUint256 = 2n ** 256n - 1n;
  }
});

// node_modules/viem/_esm/utils/transaction/assertRequest.js
function assertRequest(args) {
  const { account: account_, gasPrice, maxFeePerGas, maxPriorityFeePerGas, to } = args;
  const account = account_ ? parseAccount(account_) : void 0;
  if (account && !isAddress(account.address))
    throw new InvalidAddressError({ address: account.address });
  if (to && !isAddress(to))
    throw new InvalidAddressError({ address: to });
  if (typeof gasPrice !== "undefined" && (typeof maxFeePerGas !== "undefined" || typeof maxPriorityFeePerGas !== "undefined"))
    throw new FeeConflictError();
  if (maxFeePerGas && maxFeePerGas > maxUint256)
    throw new FeeCapTooHighError({ maxFeePerGas });
  if (maxPriorityFeePerGas && maxFeePerGas && maxPriorityFeePerGas > maxFeePerGas)
    throw new TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas });
}
var init_assertRequest = __esm({
  "node_modules/viem/_esm/utils/transaction/assertRequest.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_parseAccount();
    init_number();
    init_address();
    init_node();
    init_transaction();
    init_isAddress();
    __name(assertRequest, "assertRequest");
  }
});

// node_modules/viem/_esm/utils/address/isAddressEqual.js
function isAddressEqual(a, b) {
  if (!isAddress(a, { strict: false }))
    throw new InvalidAddressError({ address: a });
  if (!isAddress(b, { strict: false }))
    throw new InvalidAddressError({ address: b });
  return a.toLowerCase() === b.toLowerCase();
}
var init_isAddressEqual = __esm({
  "node_modules/viem/_esm/utils/address/isAddressEqual.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_address();
    init_isAddress();
    __name(isAddressEqual, "isAddressEqual");
  }
});

// node_modules/viem/_esm/utils/abi/decodeFunctionResult.js
function decodeFunctionResult(parameters) {
  const { abi: abi2, args, functionName, data } = parameters;
  let abiItem = abi2[0];
  if (functionName) {
    const item = getAbiItem({ abi: abi2, args, name: functionName });
    if (!item)
      throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath4 });
    abiItem = item;
  }
  if (abiItem.type !== "function")
    throw new AbiFunctionNotFoundError(void 0, { docsPath: docsPath4 });
  if (!abiItem.outputs)
    throw new AbiFunctionOutputsNotFoundError(abiItem.name, { docsPath: docsPath4 });
  const values = decodeAbiParameters(abiItem.outputs, data);
  if (values && values.length > 1)
    return values;
  if (values && values.length === 1)
    return values[0];
  return void 0;
}
var docsPath4;
var init_decodeFunctionResult = __esm({
  "node_modules/viem/_esm/utils/abi/decodeFunctionResult.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_abi();
    init_decodeAbiParameters();
    init_getAbiItem();
    docsPath4 = "/docs/contract/decodeFunctionResult";
    __name(decodeFunctionResult, "decodeFunctionResult");
  }
});

// node_modules/viem/node_modules/ox/_esm/core/version.js
var version3;
var init_version3 = __esm({
  "node_modules/viem/node_modules/ox/_esm/core/version.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    version3 = "0.1.1";
  }
});

// node_modules/viem/node_modules/ox/_esm/core/internal/errors.js
function getVersion() {
  return version3;
}
var init_errors2 = __esm({
  "node_modules/viem/node_modules/ox/_esm/core/internal/errors.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_version3();
    __name(getVersion, "getVersion");
  }
});

// node_modules/viem/node_modules/ox/_esm/core/Errors.js
function walk2(err, fn) {
  if (fn?.(err))
    return err;
  if (err && typeof err === "object" && "cause" in err && err.cause)
    return walk2(err.cause, fn);
  return fn ? null : err;
}
var BaseError3;
var init_Errors = __esm({
  "node_modules/viem/node_modules/ox/_esm/core/Errors.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_errors2();
    BaseError3 = class _BaseError extends Error {
      static {
        __name(this, "BaseError");
      }
      constructor(shortMessage, options = {}) {
        const details = (() => {
          if (options.cause instanceof _BaseError) {
            if (options.cause.details)
              return options.cause.details;
            if (options.cause.shortMessage)
              return options.cause.shortMessage;
          }
          if (options.cause && "details" in options.cause && typeof options.cause.details === "string")
            return options.cause.details;
          if (options.cause?.message)
            return options.cause.message;
          return options.details;
        })();
        const docsPath8 = (() => {
          if (options.cause instanceof _BaseError)
            return options.cause.docsPath || options.docsPath;
          return options.docsPath;
        })();
        const docsBaseUrl = "https://oxlib.sh";
        const docs = `${docsBaseUrl}${docsPath8 ?? ""}`;
        const message = [
          shortMessage || "An error occurred.",
          ...options.metaMessages ? ["", ...options.metaMessages] : [],
          ...details || docsPath8 ? [
            "",
            details ? `Details: ${details}` : void 0,
            docsPath8 ? `See: ${docs}` : void 0
          ] : []
        ].filter((x) => typeof x === "string").join("\n");
        super(message, options.cause ? { cause: options.cause } : void 0);
        Object.defineProperty(this, "details", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "docs", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "docsPath", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "cause", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "BaseError"
        });
        Object.defineProperty(this, "version", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: `ox@${getVersion()}`
        });
        this.cause = options.cause;
        this.details = details;
        this.docs = docs;
        this.docsPath = docsPath8;
        this.shortMessage = shortMessage;
      }
      walk(fn) {
        return walk2(this, fn);
      }
    };
    __name(walk2, "walk");
  }
});

// node_modules/viem/node_modules/ox/_esm/core/Json.js
function stringify2(value, replacer, space) {
  return JSON.stringify(value, (key, value2) => {
    if (typeof replacer === "function")
      return replacer(key, value2);
    if (typeof value2 === "bigint")
      return value2.toString() + bigIntSuffix;
    return value2;
  }, space);
}
var bigIntSuffix;
var init_Json = __esm({
  "node_modules/viem/node_modules/ox/_esm/core/Json.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    bigIntSuffix = "#__bigint";
    __name(stringify2, "stringify");
  }
});

// node_modules/viem/node_modules/ox/_esm/core/internal/bytes.js
function assertSize2(bytes, size_) {
  if (size2(bytes) > size_)
    throw new SizeOverflowError2({
      givenSize: size2(bytes),
      maxSize: size_
    });
}
function charCodeToBase162(char) {
  if (char >= charCodeMap2.zero && char <= charCodeMap2.nine)
    return char - charCodeMap2.zero;
  if (char >= charCodeMap2.A && char <= charCodeMap2.F)
    return char - (charCodeMap2.A - 10);
  if (char >= charCodeMap2.a && char <= charCodeMap2.f)
    return char - (charCodeMap2.a - 10);
  return void 0;
}
function pad2(bytes, options = {}) {
  const { dir, size: size5 = 32 } = options;
  if (size5 === 0)
    return bytes;
  if (bytes.length > size5)
    throw new SizeExceedsPaddingSizeError2({
      size: bytes.length,
      targetSize: size5,
      type: "Bytes"
    });
  const paddedBytes = new Uint8Array(size5);
  for (let i = 0; i < size5; i++) {
    const padEnd = dir === "right";
    paddedBytes[padEnd ? i : size5 - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
  }
  return paddedBytes;
}
var charCodeMap2;
var init_bytes = __esm({
  "node_modules/viem/node_modules/ox/_esm/core/internal/bytes.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_Bytes();
    __name(assertSize2, "assertSize");
    charCodeMap2 = {
      zero: 48,
      nine: 57,
      A: 65,
      F: 70,
      a: 97,
      f: 102
    };
    __name(charCodeToBase162, "charCodeToBase16");
    __name(pad2, "pad");
  }
});

// node_modules/viem/node_modules/ox/_esm/core/internal/hex.js
function assertSize3(hex, size_) {
  if (size3(hex) > size_)
    throw new SizeOverflowError3({
      givenSize: size3(hex),
      maxSize: size_
    });
}
function assertStartOffset2(value, start) {
  if (typeof start === "number" && start > 0 && start > size3(value) - 1)
    throw new SliceOffsetOutOfBoundsError3({
      offset: start,
      position: "start",
      size: size3(value)
    });
}
function assertEndOffset2(value, start, end) {
  if (typeof start === "number" && typeof end === "number" && size3(value) !== end - start) {
    throw new SliceOffsetOutOfBoundsError3({
      offset: end,
      position: "end",
      size: size3(value)
    });
  }
}
function pad3(hex_, options = {}) {
  const { dir, size: size5 = 32 } = options;
  if (size5 === 0)
    return hex_;
  const hex = hex_.replace("0x", "");
  if (hex.length > size5 * 2)
    throw new SizeExceedsPaddingSizeError3({
      size: Math.ceil(hex.length / 2),
      targetSize: size5,
      type: "Hex"
    });
  return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size5 * 2, "0")}`;
}
var init_hex = __esm({
  "node_modules/viem/node_modules/ox/_esm/core/internal/hex.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_Hex();
    __name(assertSize3, "assertSize");
    __name(assertStartOffset2, "assertStartOffset");
    __name(assertEndOffset2, "assertEndOffset");
    __name(pad3, "pad");
  }
});

// node_modules/viem/node_modules/ox/_esm/core/Bytes.js
function from(value) {
  if (value instanceof Uint8Array)
    return value;
  if (typeof value === "string")
    return fromHex(value);
  return fromArray(value);
}
function fromArray(value) {
  return value instanceof Uint8Array ? value : new Uint8Array(value);
}
function fromHex(value, options = {}) {
  const { size: size5 } = options;
  let hex = value;
  if (size5) {
    assertSize3(value, size5);
    hex = padRight(value, size5);
  }
  let hexString = hex.slice(2);
  if (hexString.length % 2)
    hexString = `0${hexString}`;
  const length = hexString.length / 2;
  const bytes = new Uint8Array(length);
  for (let index2 = 0, j = 0; index2 < length; index2++) {
    const nibbleLeft = charCodeToBase162(hexString.charCodeAt(j++));
    const nibbleRight = charCodeToBase162(hexString.charCodeAt(j++));
    if (nibbleLeft === void 0 || nibbleRight === void 0) {
      throw new BaseError3(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
    }
    bytes[index2] = nibbleLeft * 16 + nibbleRight;
  }
  return bytes;
}
function fromString(value, options = {}) {
  const { size: size5 } = options;
  const bytes = encoder3.encode(value);
  if (typeof size5 === "number") {
    assertSize2(bytes, size5);
    return padRight2(bytes, size5);
  }
  return bytes;
}
function padRight2(value, size5) {
  return pad2(value, { dir: "right", size: size5 });
}
function size2(value) {
  return value.length;
}
var encoder3, SizeOverflowError2, SizeExceedsPaddingSizeError2;
var init_Bytes = __esm({
  "node_modules/viem/node_modules/ox/_esm/core/Bytes.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_Errors();
    init_Hex();
    init_bytes();
    init_hex();
    encoder3 = /* @__PURE__ */ new TextEncoder();
    __name(from, "from");
    __name(fromArray, "fromArray");
    __name(fromHex, "fromHex");
    __name(fromString, "fromString");
    __name(padRight2, "padRight");
    __name(size2, "size");
    SizeOverflowError2 = class extends BaseError3 {
      static {
        __name(this, "SizeOverflowError");
      }
      constructor({ givenSize, maxSize }) {
        super(`Size cannot exceed \`${maxSize}\` bytes. Given size: \`${givenSize}\` bytes.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Bytes.SizeOverflowError"
        });
      }
    };
    SizeExceedsPaddingSizeError2 = class extends BaseError3 {
      static {
        __name(this, "SizeExceedsPaddingSizeError");
      }
      constructor({ size: size5, targetSize, type }) {
        super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (\`${size5}\`) exceeds padding size (\`${targetSize}\`).`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Bytes.SizeExceedsPaddingSizeError"
        });
      }
    };
  }
});

// node_modules/viem/node_modules/ox/_esm/core/Hex.js
function assert(value, options = {}) {
  const { strict = false } = options;
  if (!value)
    throw new InvalidHexTypeError(value);
  if (typeof value !== "string")
    throw new InvalidHexTypeError(value);
  if (strict) {
    if (!/^0x[0-9a-fA-F]*$/.test(value))
      throw new InvalidHexValueError(value);
  }
  if (!value.startsWith("0x"))
    throw new InvalidHexValueError(value);
}
function concat2(...values) {
  return `0x${values.reduce((acc, x) => acc + x.replace("0x", ""), "")}`;
}
function fromBoolean(value, options = {}) {
  const hex = `0x${Number(value)}`;
  if (typeof options.size === "number") {
    assertSize3(hex, options.size);
    return padLeft(hex, options.size);
  }
  return hex;
}
function fromBytes(value, options = {}) {
  let string = "";
  for (let i = 0; i < value.length; i++)
    string += hexes3[value[i]];
  const hex = `0x${string}`;
  if (typeof options.size === "number") {
    assertSize3(hex, options.size);
    return padRight(hex, options.size);
  }
  return hex;
}
function fromNumber(value, options = {}) {
  const { signed, size: size5 } = options;
  const value_ = BigInt(value);
  let maxValue;
  if (size5) {
    if (signed)
      maxValue = (1n << BigInt(size5) * 8n - 1n) - 1n;
    else
      maxValue = 2n ** (BigInt(size5) * 8n) - 1n;
  } else if (typeof value === "number") {
    maxValue = BigInt(Number.MAX_SAFE_INTEGER);
  }
  const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
  if (maxValue && value_ > maxValue || value_ < minValue) {
    const suffix = typeof value === "bigint" ? "n" : "";
    throw new IntegerOutOfRangeError2({
      max: maxValue ? `${maxValue}${suffix}` : void 0,
      min: `${minValue}${suffix}`,
      signed,
      size: size5,
      value: `${value}${suffix}`
    });
  }
  const stringValue = (signed && value_ < 0 ? (1n << BigInt(size5 * 8)) + BigInt(value_) : value_).toString(16);
  const hex = `0x${stringValue}`;
  if (size5)
    return padLeft(hex, size5);
  return hex;
}
function fromString2(value, options = {}) {
  return fromBytes(encoder4.encode(value), options);
}
function padLeft(value, size5) {
  return pad3(value, { dir: "left", size: size5 });
}
function padRight(value, size5) {
  return pad3(value, { dir: "right", size: size5 });
}
function slice2(value, start, end, options = {}) {
  const { strict } = options;
  assertStartOffset2(value, start);
  const value_ = `0x${value.replace("0x", "").slice((start ?? 0) * 2, (end ?? value.length) * 2)}`;
  if (strict)
    assertEndOffset2(value_, start, end);
  return value_;
}
function size3(value) {
  return Math.ceil((value.length - 2) / 2);
}
function validate(value, options = {}) {
  const { strict = false } = options;
  try {
    assert(value, { strict });
    return true;
  } catch {
    return false;
  }
}
var encoder4, hexes3, IntegerOutOfRangeError2, InvalidHexTypeError, InvalidHexValueError, SizeOverflowError3, SliceOffsetOutOfBoundsError3, SizeExceedsPaddingSizeError3;
var init_Hex = __esm({
  "node_modules/viem/node_modules/ox/_esm/core/Hex.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_Errors();
    init_Json();
    init_hex();
    encoder4 = /* @__PURE__ */ new TextEncoder();
    hexes3 = /* @__PURE__ */ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
    __name(assert, "assert");
    __name(concat2, "concat");
    __name(fromBoolean, "fromBoolean");
    __name(fromBytes, "fromBytes");
    __name(fromNumber, "fromNumber");
    __name(fromString2, "fromString");
    __name(padLeft, "padLeft");
    __name(padRight, "padRight");
    __name(slice2, "slice");
    __name(size3, "size");
    __name(validate, "validate");
    IntegerOutOfRangeError2 = class extends BaseError3 {
      static {
        __name(this, "IntegerOutOfRangeError");
      }
      constructor({ max, min, signed, size: size5, value }) {
        super(`Number \`${value}\` is not in safe${size5 ? ` ${size5 * 8}-bit` : ""}${signed ? " signed" : " unsigned"} integer range ${max ? `(\`${min}\` to \`${max}\`)` : `(above \`${min}\`)`}`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Hex.IntegerOutOfRangeError"
        });
      }
    };
    InvalidHexTypeError = class extends BaseError3 {
      static {
        __name(this, "InvalidHexTypeError");
      }
      constructor(value) {
        super(`Value \`${typeof value === "object" ? stringify2(value) : value}\` of type \`${typeof value}\` is an invalid hex type.`, {
          metaMessages: ['Hex types must be represented as `"0x${string}"`.']
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Hex.InvalidHexTypeError"
        });
      }
    };
    InvalidHexValueError = class extends BaseError3 {
      static {
        __name(this, "InvalidHexValueError");
      }
      constructor(value) {
        super(`Value \`${value}\` is an invalid hex value.`, {
          metaMessages: [
            'Hex values must start with `"0x"` and contain only hexadecimal characters (0-9, a-f, A-F).'
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Hex.InvalidHexValueError"
        });
      }
    };
    SizeOverflowError3 = class extends BaseError3 {
      static {
        __name(this, "SizeOverflowError");
      }
      constructor({ givenSize, maxSize }) {
        super(`Size cannot exceed \`${maxSize}\` bytes. Given size: \`${givenSize}\` bytes.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Hex.SizeOverflowError"
        });
      }
    };
    SliceOffsetOutOfBoundsError3 = class extends BaseError3 {
      static {
        __name(this, "SliceOffsetOutOfBoundsError");
      }
      constructor({ offset, position, size: size5 }) {
        super(`Slice ${position === "start" ? "starting" : "ending"} at offset \`${offset}\` is out-of-bounds (size: \`${size5}\`).`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Hex.SliceOffsetOutOfBoundsError"
        });
      }
    };
    SizeExceedsPaddingSizeError3 = class extends BaseError3 {
      static {
        __name(this, "SizeExceedsPaddingSizeError");
      }
      constructor({ size: size5, targetSize, type }) {
        super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (\`${size5}\`) exceeds padding size (\`${targetSize}\`).`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Hex.SizeExceedsPaddingSizeError"
        });
      }
    };
  }
});

// node_modules/viem/node_modules/ox/_esm/core/Withdrawal.js
function toRpc(withdrawal) {
  return {
    address: withdrawal.address,
    amount: fromNumber(withdrawal.amount),
    index: fromNumber(withdrawal.index),
    validatorIndex: fromNumber(withdrawal.validatorIndex)
  };
}
var init_Withdrawal = __esm({
  "node_modules/viem/node_modules/ox/_esm/core/Withdrawal.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_Hex();
    __name(toRpc, "toRpc");
  }
});

// node_modules/viem/node_modules/ox/_esm/core/BlockOverrides.js
function toRpc2(blockOverrides) {
  return {
    ...typeof blockOverrides.baseFeePerGas === "bigint" && {
      baseFeePerGas: fromNumber(blockOverrides.baseFeePerGas)
    },
    ...typeof blockOverrides.blobBaseFee === "bigint" && {
      blobBaseFee: fromNumber(blockOverrides.blobBaseFee)
    },
    ...typeof blockOverrides.feeRecipient === "string" && {
      feeRecipient: blockOverrides.feeRecipient
    },
    ...typeof blockOverrides.gasLimit === "bigint" && {
      gasLimit: fromNumber(blockOverrides.gasLimit)
    },
    ...typeof blockOverrides.number === "bigint" && {
      number: fromNumber(blockOverrides.number)
    },
    ...typeof blockOverrides.prevRandao === "bigint" && {
      prevRandao: fromNumber(blockOverrides.prevRandao)
    },
    ...typeof blockOverrides.time === "bigint" && {
      time: fromNumber(blockOverrides.time)
    },
    ...blockOverrides.withdrawals && {
      withdrawals: blockOverrides.withdrawals.map(toRpc)
    }
  };
}
var init_BlockOverrides = __esm({
  "node_modules/viem/node_modules/ox/_esm/core/BlockOverrides.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_Hex();
    init_Withdrawal();
    __name(toRpc2, "toRpc");
  }
});

// node_modules/viem/_esm/constants/abis.js
var multicall3Abi, batchGatewayAbi, universalResolverErrors, universalResolverResolveAbi, universalResolverReverseAbi, textResolverAbi, addressResolverAbi, universalSignatureValidatorAbi, erc20Abi, erc1155Abi, erc721Abi;
var init_abis = __esm({
  "node_modules/viem/_esm/constants/abis.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    multicall3Abi = [
      {
        inputs: [
          {
            components: [
              {
                name: "target",
                type: "address"
              },
              {
                name: "allowFailure",
                type: "bool"
              },
              {
                name: "callData",
                type: "bytes"
              }
            ],
            name: "calls",
            type: "tuple[]"
          }
        ],
        name: "aggregate3",
        outputs: [
          {
            components: [
              {
                name: "success",
                type: "bool"
              },
              {
                name: "returnData",
                type: "bytes"
              }
            ],
            name: "returnData",
            type: "tuple[]"
          }
        ],
        stateMutability: "view",
        type: "function"
      }
    ];
    batchGatewayAbi = [
      {
        name: "query",
        type: "function",
        stateMutability: "view",
        inputs: [
          {
            type: "tuple[]",
            name: "queries",
            components: [
              {
                type: "address",
                name: "sender"
              },
              {
                type: "string[]",
                name: "urls"
              },
              {
                type: "bytes",
                name: "data"
              }
            ]
          }
        ],
        outputs: [
          {
            type: "bool[]",
            name: "failures"
          },
          {
            type: "bytes[]",
            name: "responses"
          }
        ]
      },
      {
        name: "HttpError",
        type: "error",
        inputs: [
          {
            type: "uint16",
            name: "status"
          },
          {
            type: "string",
            name: "message"
          }
        ]
      }
    ];
    universalResolverErrors = [
      {
        inputs: [],
        name: "ResolverNotFound",
        type: "error"
      },
      {
        inputs: [],
        name: "ResolverWildcardNotSupported",
        type: "error"
      },
      {
        inputs: [],
        name: "ResolverNotContract",
        type: "error"
      },
      {
        inputs: [
          {
            name: "returnData",
            type: "bytes"
          }
        ],
        name: "ResolverError",
        type: "error"
      },
      {
        inputs: [
          {
            components: [
              {
                name: "status",
                type: "uint16"
              },
              {
                name: "message",
                type: "string"
              }
            ],
            name: "errors",
            type: "tuple[]"
          }
        ],
        name: "HttpError",
        type: "error"
      }
    ];
    universalResolverResolveAbi = [
      ...universalResolverErrors,
      {
        name: "resolve",
        type: "function",
        stateMutability: "view",
        inputs: [
          { name: "name", type: "bytes" },
          { name: "data", type: "bytes" }
        ],
        outputs: [
          { name: "", type: "bytes" },
          { name: "address", type: "address" }
        ]
      },
      {
        name: "resolve",
        type: "function",
        stateMutability: "view",
        inputs: [
          { name: "name", type: "bytes" },
          { name: "data", type: "bytes" },
          { name: "gateways", type: "string[]" }
        ],
        outputs: [
          { name: "", type: "bytes" },
          { name: "address", type: "address" }
        ]
      }
    ];
    universalResolverReverseAbi = [
      ...universalResolverErrors,
      {
        name: "reverse",
        type: "function",
        stateMutability: "view",
        inputs: [{ type: "bytes", name: "reverseName" }],
        outputs: [
          { type: "string", name: "resolvedName" },
          { type: "address", name: "resolvedAddress" },
          { type: "address", name: "reverseResolver" },
          { type: "address", name: "resolver" }
        ]
      },
      {
        name: "reverse",
        type: "function",
        stateMutability: "view",
        inputs: [
          { type: "bytes", name: "reverseName" },
          { type: "string[]", name: "gateways" }
        ],
        outputs: [
          { type: "string", name: "resolvedName" },
          { type: "address", name: "resolvedAddress" },
          { type: "address", name: "reverseResolver" },
          { type: "address", name: "resolver" }
        ]
      }
    ];
    textResolverAbi = [
      {
        name: "text",
        type: "function",
        stateMutability: "view",
        inputs: [
          { name: "name", type: "bytes32" },
          { name: "key", type: "string" }
        ],
        outputs: [{ name: "", type: "string" }]
      }
    ];
    addressResolverAbi = [
      {
        name: "addr",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "name", type: "bytes32" }],
        outputs: [{ name: "", type: "address" }]
      },
      {
        name: "addr",
        type: "function",
        stateMutability: "view",
        inputs: [
          { name: "name", type: "bytes32" },
          { name: "coinType", type: "uint256" }
        ],
        outputs: [{ name: "", type: "bytes" }]
      }
    ];
    universalSignatureValidatorAbi = [
      {
        inputs: [
          {
            name: "_signer",
            type: "address"
          },
          {
            name: "_hash",
            type: "bytes32"
          },
          {
            name: "_signature",
            type: "bytes"
          }
        ],
        stateMutability: "nonpayable",
        type: "constructor"
      },
      {
        inputs: [
          {
            name: "_signer",
            type: "address"
          },
          {
            name: "_hash",
            type: "bytes32"
          },
          {
            name: "_signature",
            type: "bytes"
          }
        ],
        outputs: [
          {
            type: "bool"
          }
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "isValidSig"
      }
    ];
    erc20Abi = [
      {
        type: "event",
        name: "Approval",
        inputs: [
          {
            indexed: true,
            name: "owner",
            type: "address"
          },
          {
            indexed: true,
            name: "spender",
            type: "address"
          },
          {
            indexed: false,
            name: "value",
            type: "uint256"
          }
        ]
      },
      {
        type: "event",
        name: "Transfer",
        inputs: [
          {
            indexed: true,
            name: "from",
            type: "address"
          },
          {
            indexed: true,
            name: "to",
            type: "address"
          },
          {
            indexed: false,
            name: "value",
            type: "uint256"
          }
        ]
      },
      {
        type: "function",
        name: "allowance",
        stateMutability: "view",
        inputs: [
          {
            name: "owner",
            type: "address"
          },
          {
            name: "spender",
            type: "address"
          }
        ],
        outputs: [
          {
            type: "uint256"
          }
        ]
      },
      {
        type: "function",
        name: "approve",
        stateMutability: "nonpayable",
        inputs: [
          {
            name: "spender",
            type: "address"
          },
          {
            name: "amount",
            type: "uint256"
          }
        ],
        outputs: [
          {
            type: "bool"
          }
        ]
      },
      {
        type: "function",
        name: "balanceOf",
        stateMutability: "view",
        inputs: [
          {
            name: "account",
            type: "address"
          }
        ],
        outputs: [
          {
            type: "uint256"
          }
        ]
      },
      {
        type: "function",
        name: "decimals",
        stateMutability: "view",
        inputs: [],
        outputs: [
          {
            type: "uint8"
          }
        ]
      },
      {
        type: "function",
        name: "name",
        stateMutability: "view",
        inputs: [],
        outputs: [
          {
            type: "string"
          }
        ]
      },
      {
        type: "function",
        name: "symbol",
        stateMutability: "view",
        inputs: [],
        outputs: [
          {
            type: "string"
          }
        ]
      },
      {
        type: "function",
        name: "totalSupply",
        stateMutability: "view",
        inputs: [],
        outputs: [
          {
            type: "uint256"
          }
        ]
      },
      {
        type: "function",
        name: "transfer",
        stateMutability: "nonpayable",
        inputs: [
          {
            name: "recipient",
            type: "address"
          },
          {
            name: "amount",
            type: "uint256"
          }
        ],
        outputs: [
          {
            type: "bool"
          }
        ]
      },
      {
        type: "function",
        name: "transferFrom",
        stateMutability: "nonpayable",
        inputs: [
          {
            name: "sender",
            type: "address"
          },
          {
            name: "recipient",
            type: "address"
          },
          {
            name: "amount",
            type: "uint256"
          }
        ],
        outputs: [
          {
            type: "bool"
          }
        ]
      }
    ];
    erc1155Abi = [
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "balance",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "needed",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "ERC1155InsufficientBalance",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "approver",
            type: "address"
          }
        ],
        name: "ERC1155InvalidApprover",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "idsLength",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "valuesLength",
            type: "uint256"
          }
        ],
        name: "ERC1155InvalidArrayLength",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address"
          }
        ],
        name: "ERC1155InvalidOperator",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "receiver",
            type: "address"
          }
        ],
        name: "ERC1155InvalidReceiver",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address"
          }
        ],
        name: "ERC1155InvalidSender",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address"
          },
          {
            internalType: "address",
            name: "owner",
            type: "address"
          }
        ],
        name: "ERC1155MissingApprovalForAll",
        type: "error"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "account",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address"
          },
          {
            indexed: false,
            internalType: "bool",
            name: "approved",
            type: "bool"
          }
        ],
        name: "ApprovalForAll",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            indexed: false,
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]"
          },
          {
            indexed: false,
            internalType: "uint256[]",
            name: "values",
            type: "uint256[]"
          }
        ],
        name: "TransferBatch",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "id",
            type: "uint256"
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "TransferSingle",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "string",
            name: "value",
            type: "string"
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "id",
            type: "uint256"
          }
        ],
        name: "URI",
        type: "event"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256"
          }
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address[]",
            name: "accounts",
            type: "address[]"
          },
          {
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]"
          }
        ],
        name: "balanceOfBatch",
        outputs: [
          {
            internalType: "uint256[]",
            name: "",
            type: "uint256[]"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          },
          {
            internalType: "address",
            name: "operator",
            type: "address"
          }
        ],
        name: "isApprovedForAll",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]"
          },
          {
            internalType: "uint256[]",
            name: "values",
            type: "uint256[]"
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes"
          }
        ],
        name: "safeBatchTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes"
          }
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address"
          },
          {
            internalType: "bool",
            name: "approved",
            type: "bool"
          }
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "bytes4",
            name: "interfaceId",
            type: "bytes4"
          }
        ],
        name: "supportsInterface",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        name: "uri",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string"
          }
        ],
        stateMutability: "view",
        type: "function"
      }
    ];
    erc721Abi = [
      {
        type: "event",
        name: "Approval",
        inputs: [
          {
            indexed: true,
            name: "owner",
            type: "address"
          },
          {
            indexed: true,
            name: "spender",
            type: "address"
          },
          {
            indexed: true,
            name: "tokenId",
            type: "uint256"
          }
        ]
      },
      {
        type: "event",
        name: "ApprovalForAll",
        inputs: [
          {
            indexed: true,
            name: "owner",
            type: "address"
          },
          {
            indexed: true,
            name: "operator",
            type: "address"
          },
          {
            indexed: false,
            name: "approved",
            type: "bool"
          }
        ]
      },
      {
        type: "event",
        name: "Transfer",
        inputs: [
          {
            indexed: true,
            name: "from",
            type: "address"
          },
          {
            indexed: true,
            name: "to",
            type: "address"
          },
          {
            indexed: true,
            name: "tokenId",
            type: "uint256"
          }
        ]
      },
      {
        type: "function",
        name: "approve",
        stateMutability: "payable",
        inputs: [
          {
            name: "spender",
            type: "address"
          },
          {
            name: "tokenId",
            type: "uint256"
          }
        ],
        outputs: []
      },
      {
        type: "function",
        name: "balanceOf",
        stateMutability: "view",
        inputs: [
          {
            name: "account",
            type: "address"
          }
        ],
        outputs: [
          {
            type: "uint256"
          }
        ]
      },
      {
        type: "function",
        name: "getApproved",
        stateMutability: "view",
        inputs: [
          {
            name: "tokenId",
            type: "uint256"
          }
        ],
        outputs: [
          {
            type: "address"
          }
        ]
      },
      {
        type: "function",
        name: "isApprovedForAll",
        stateMutability: "view",
        inputs: [
          {
            name: "owner",
            type: "address"
          },
          {
            name: "operator",
            type: "address"
          }
        ],
        outputs: [
          {
            type: "bool"
          }
        ]
      },
      {
        type: "function",
        name: "name",
        stateMutability: "view",
        inputs: [],
        outputs: [
          {
            type: "string"
          }
        ]
      },
      {
        type: "function",
        name: "ownerOf",
        stateMutability: "view",
        inputs: [
          {
            name: "tokenId",
            type: "uint256"
          }
        ],
        outputs: [
          {
            name: "owner",
            type: "address"
          }
        ]
      },
      {
        type: "function",
        name: "safeTransferFrom",
        stateMutability: "payable",
        inputs: [
          {
            name: "from",
            type: "address"
          },
          {
            name: "to",
            type: "address"
          },
          {
            name: "tokenId",
            type: "uint256"
          }
        ],
        outputs: []
      },
      {
        type: "function",
        name: "safeTransferFrom",
        stateMutability: "nonpayable",
        inputs: [
          {
            name: "from",
            type: "address"
          },
          {
            name: "to",
            type: "address"
          },
          {
            name: "id",
            type: "uint256"
          },
          {
            name: "data",
            type: "bytes"
          }
        ],
        outputs: []
      },
      {
        type: "function",
        name: "setApprovalForAll",
        stateMutability: "nonpayable",
        inputs: [
          {
            name: "operator",
            type: "address"
          },
          {
            name: "approved",
            type: "bool"
          }
        ],
        outputs: []
      },
      {
        type: "function",
        name: "symbol",
        stateMutability: "view",
        inputs: [],
        outputs: [
          {
            type: "string"
          }
        ]
      },
      {
        type: "function",
        name: "tokenByIndex",
        stateMutability: "view",
        inputs: [
          {
            name: "index",
            type: "uint256"
          }
        ],
        outputs: [
          {
            type: "uint256"
          }
        ]
      },
      {
        type: "function",
        name: "tokenByIndex",
        stateMutability: "view",
        inputs: [
          {
            name: "owner",
            type: "address"
          },
          {
            name: "index",
            type: "uint256"
          }
        ],
        outputs: [
          {
            name: "tokenId",
            type: "uint256"
          }
        ]
      },
      {
        type: "function",
        name: "tokenURI",
        stateMutability: "view",
        inputs: [
          {
            name: "tokenId",
            type: "uint256"
          }
        ],
        outputs: [
          {
            type: "string"
          }
        ]
      },
      {
        type: "function",
        name: "totalSupply",
        stateMutability: "view",
        inputs: [],
        outputs: [
          {
            type: "uint256"
          }
        ]
      },
      {
        type: "function",
        name: "transferFrom",
        stateMutability: "payable",
        inputs: [
          {
            name: "sender",
            type: "address"
          },
          {
            name: "recipient",
            type: "address"
          },
          {
            name: "tokenId",
            type: "uint256"
          }
        ],
        outputs: []
      }
    ];
  }
});

// node_modules/viem/_esm/constants/contract.js
var aggregate3Signature;
var init_contract2 = __esm({
  "node_modules/viem/_esm/constants/contract.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    aggregate3Signature = "0x82ad56cb";
  }
});

// node_modules/viem/_esm/constants/contracts.js
var deploylessCallViaBytecodeBytecode, deploylessCallViaFactoryBytecode, universalSignatureValidatorByteCode;
var init_contracts = __esm({
  "node_modules/viem/_esm/constants/contracts.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    deploylessCallViaBytecodeBytecode = "0x608060405234801561001057600080fd5b5060405161018e38038061018e83398101604081905261002f91610124565b6000808351602085016000f59050803b61004857600080fd5b6000808351602085016000855af16040513d6000823e81610067573d81fd5b3d81f35b634e487b7160e01b600052604160045260246000fd5b600082601f83011261009257600080fd5b81516001600160401b038111156100ab576100ab61006b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156100d9576100d961006b565b6040528181528382016020018510156100f157600080fd5b60005b82811015610110576020818601810151838301820152016100f4565b506000918101602001919091529392505050565b6000806040838503121561013757600080fd5b82516001600160401b0381111561014d57600080fd5b61015985828601610081565b602085015190935090506001600160401b0381111561017757600080fd5b61018385828601610081565b915050925092905056fe";
    deploylessCallViaFactoryBytecode = "0x608060405234801561001057600080fd5b506040516102c03803806102c083398101604081905261002f916101e6565b836001600160a01b03163b6000036100e457600080836001600160a01b03168360405161005c9190610270565b6000604051808303816000865af19150503d8060008114610099576040519150601f19603f3d011682016040523d82523d6000602084013e61009e565b606091505b50915091508115806100b857506001600160a01b0386163b155b156100e1578060405163101bb98d60e01b81526004016100d8919061028c565b60405180910390fd5b50505b6000808451602086016000885af16040513d6000823e81610103573d81fd5b3d81f35b80516001600160a01b038116811461011e57600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561015457818101518382015260200161013c565b50506000910152565b600082601f83011261016e57600080fd5b81516001600160401b0381111561018757610187610123565b604051601f8201601f19908116603f011681016001600160401b03811182821017156101b5576101b5610123565b6040528181528382016020018510156101cd57600080fd5b6101de826020830160208701610139565b949350505050565b600080600080608085870312156101fc57600080fd5b61020585610107565b60208601519094506001600160401b0381111561022157600080fd5b61022d8782880161015d565b93505061023c60408601610107565b60608601519092506001600160401b0381111561025857600080fd5b6102648782880161015d565b91505092959194509250565b60008251610282818460208701610139565b9190910192915050565b60208152600082518060208401526102ab816040850160208701610139565b601f01601f1916919091016040019291505056fe";
    universalSignatureValidatorByteCode = "0x608060405234801561001057600080fd5b5060405161069438038061069483398101604081905261002f9161051e565b600061003c848484610048565b9050806000526001601ff35b60007f64926492649264926492649264926492649264926492649264926492649264926100748361040c565b036101e7576000606080848060200190518101906100929190610577565b60405192955090935091506000906001600160a01b038516906100b69085906105dd565b6000604051808303816000865af19150503d80600081146100f3576040519150601f19603f3d011682016040523d82523d6000602084013e6100f8565b606091505b50509050876001600160a01b03163b60000361016057806101605760405162461bcd60e51b815260206004820152601e60248201527f5369676e617475726556616c696461746f723a206465706c6f796d656e74000060448201526064015b60405180910390fd5b604051630b135d3f60e11b808252906001600160a01b038a1690631626ba7e90610190908b9087906004016105f9565b602060405180830381865afa1580156101ad573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101d19190610633565b6001600160e01b03191614945050505050610405565b6001600160a01b0384163b1561027a57604051630b135d3f60e11b808252906001600160a01b03861690631626ba7e9061022790879087906004016105f9565b602060405180830381865afa158015610244573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102689190610633565b6001600160e01b031916149050610405565b81516041146102df5760405162461bcd60e51b815260206004820152603a602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e6174757265206c656e6774680000000000006064820152608401610157565b6102e7610425565b5060208201516040808401518451859392600091859190811061030c5761030c61065d565b016020015160f81c9050601b811480159061032b57508060ff16601c14155b1561038c5760405162461bcd60e51b815260206004820152603b602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e617475726520762076616c756500000000006064820152608401610157565b60408051600081526020810180835289905260ff83169181019190915260608101849052608081018390526001600160a01b0389169060019060a0016020604051602081039080840390855afa1580156103ea573d6000803e3d6000fd5b505050602060405103516001600160a01b0316149450505050505b9392505050565b600060208251101561041d57600080fd5b508051015190565b60405180606001604052806003906020820280368337509192915050565b6001600160a01b038116811461045857600080fd5b50565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561048c578181015183820152602001610474565b50506000910152565b600082601f8301126104a657600080fd5b81516001600160401b038111156104bf576104bf61045b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156104ed576104ed61045b565b60405281815283820160200185101561050557600080fd5b610516826020830160208701610471565b949350505050565b60008060006060848603121561053357600080fd5b835161053e81610443565b6020850151604086015191945092506001600160401b0381111561056157600080fd5b61056d86828701610495565b9150509250925092565b60008060006060848603121561058c57600080fd5b835161059781610443565b60208501519093506001600160401b038111156105b357600080fd5b6105bf86828701610495565b604086015190935090506001600160401b0381111561056157600080fd5b600082516105ef818460208701610471565b9190910192915050565b828152604060208201526000825180604084015261061e816060850160208701610471565b601f01601f1916919091016060019392505050565b60006020828403121561064557600080fd5b81516001600160e01b03198116811461040557600080fd5b634e487b7160e01b600052603260045260246000fdfe5369676e617475726556616c696461746f72237265636f7665725369676e6572";
  }
});

// node_modules/viem/_esm/errors/chain.js
var ChainDoesNotSupportContract, ChainMismatchError, ChainNotFoundError, ClientChainNotConfiguredError, InvalidChainIdError;
var init_chain = __esm({
  "node_modules/viem/_esm/errors/chain.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_base();
    ChainDoesNotSupportContract = class extends BaseError2 {
      static {
        __name(this, "ChainDoesNotSupportContract");
      }
      constructor({ blockNumber, chain, contract }) {
        super(`Chain "${chain.name}" does not support contract "${contract.name}".`, {
          metaMessages: [
            "This could be due to any of the following:",
            ...blockNumber && contract.blockCreated && contract.blockCreated > blockNumber ? [
              `- The contract "${contract.name}" was not deployed until block ${contract.blockCreated} (current block ${blockNumber}).`
            ] : [
              `- The chain does not have the contract "${contract.name}" configured.`
            ]
          ],
          name: "ChainDoesNotSupportContract"
        });
      }
    };
    ChainMismatchError = class extends BaseError2 {
      static {
        __name(this, "ChainMismatchError");
      }
      constructor({ chain, currentChainId }) {
        super(`The current chain of the wallet (id: ${currentChainId}) does not match the target chain for the transaction (id: ${chain.id} \u2013 ${chain.name}).`, {
          metaMessages: [
            `Current Chain ID:  ${currentChainId}`,
            `Expected Chain ID: ${chain.id} \u2013 ${chain.name}`
          ],
          name: "ChainMismatchError"
        });
      }
    };
    ChainNotFoundError = class extends BaseError2 {
      static {
        __name(this, "ChainNotFoundError");
      }
      constructor() {
        super([
          "No chain was provided to the request.",
          "Please provide a chain with the `chain` argument on the Action, or by supplying a `chain` to WalletClient."
        ].join("\n"), {
          name: "ChainNotFoundError"
        });
      }
    };
    ClientChainNotConfiguredError = class extends BaseError2 {
      static {
        __name(this, "ClientChainNotConfiguredError");
      }
      constructor() {
        super("No chain was provided to the Client.", {
          name: "ClientChainNotConfiguredError"
        });
      }
    };
    InvalidChainIdError = class extends BaseError2 {
      static {
        __name(this, "InvalidChainIdError");
      }
      constructor({ chainId }) {
        super(typeof chainId === "number" ? `Chain ID "${chainId}" is invalid.` : "Chain ID is invalid.", { name: "InvalidChainIdError" });
      }
    };
  }
});

// node_modules/viem/_esm/utils/abi/encodeDeployData.js
function encodeDeployData(parameters) {
  const { abi: abi2, args, bytecode } = parameters;
  if (!args || args.length === 0)
    return bytecode;
  const description = abi2.find((x) => "type" in x && x.type === "constructor");
  if (!description)
    throw new AbiConstructorNotFoundError({ docsPath: docsPath5 });
  if (!("inputs" in description))
    throw new AbiConstructorParamsNotFoundError({ docsPath: docsPath5 });
  if (!description.inputs || description.inputs.length === 0)
    throw new AbiConstructorParamsNotFoundError({ docsPath: docsPath5 });
  const data = encodeAbiParameters(description.inputs, args);
  return concatHex([bytecode, data]);
}
var docsPath5;
var init_encodeDeployData = __esm({
  "node_modules/viem/_esm/utils/abi/encodeDeployData.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_abi();
    init_concat();
    init_encodeAbiParameters();
    docsPath5 = "/docs/contract/encodeDeployData";
    __name(encodeDeployData, "encodeDeployData");
  }
});

// node_modules/viem/_esm/utils/chain/getChainContractAddress.js
function getChainContractAddress({ blockNumber, chain, contract: name }) {
  const contract = chain?.contracts?.[name];
  if (!contract)
    throw new ChainDoesNotSupportContract({
      chain,
      contract: { name }
    });
  if (blockNumber && contract.blockCreated && contract.blockCreated > blockNumber)
    throw new ChainDoesNotSupportContract({
      blockNumber,
      chain,
      contract: {
        name,
        blockCreated: contract.blockCreated
      }
    });
  return contract.address;
}
var init_getChainContractAddress = __esm({
  "node_modules/viem/_esm/utils/chain/getChainContractAddress.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_chain();
    __name(getChainContractAddress, "getChainContractAddress");
  }
});

// node_modules/viem/_esm/utils/errors/getCallError.js
function getCallError(err, { docsPath: docsPath8, ...args }) {
  const cause = (() => {
    const cause2 = getNodeError(err, args);
    if (cause2 instanceof UnknownNodeError)
      return err;
    return cause2;
  })();
  return new CallExecutionError(cause, {
    docsPath: docsPath8,
    ...args
  });
}
var init_getCallError = __esm({
  "node_modules/viem/_esm/utils/errors/getCallError.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_contract();
    init_node();
    init_getNodeError();
    __name(getCallError, "getCallError");
  }
});

// node_modules/viem/_esm/utils/promise/withResolvers.js
function withResolvers() {
  let resolve = /* @__PURE__ */ __name(() => void 0, "resolve");
  let reject = /* @__PURE__ */ __name(() => void 0, "reject");
  const promise = new Promise((resolve_, reject_) => {
    resolve = resolve_;
    reject = reject_;
  });
  return { promise, resolve, reject };
}
var init_withResolvers = __esm({
  "node_modules/viem/_esm/utils/promise/withResolvers.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    __name(withResolvers, "withResolvers");
  }
});

// node_modules/viem/_esm/utils/promise/createBatchScheduler.js
function createBatchScheduler({ fn, id, shouldSplitBatch, wait: wait2 = 0, sort }) {
  const exec = /* @__PURE__ */ __name(async () => {
    const scheduler = getScheduler();
    flush();
    const args = scheduler.map(({ args: args2 }) => args2);
    if (args.length === 0)
      return;
    fn(args).then((data) => {
      if (sort && Array.isArray(data))
        data.sort(sort);
      for (let i = 0; i < scheduler.length; i++) {
        const { resolve } = scheduler[i];
        resolve?.([data[i], data]);
      }
    }).catch((err) => {
      for (let i = 0; i < scheduler.length; i++) {
        const { reject } = scheduler[i];
        reject?.(err);
      }
    });
  }, "exec");
  const flush = /* @__PURE__ */ __name(() => schedulerCache.delete(id), "flush");
  const getBatchedArgs = /* @__PURE__ */ __name(() => getScheduler().map(({ args }) => args), "getBatchedArgs");
  const getScheduler = /* @__PURE__ */ __name(() => schedulerCache.get(id) || [], "getScheduler");
  const setScheduler = /* @__PURE__ */ __name((item) => schedulerCache.set(id, [...getScheduler(), item]), "setScheduler");
  return {
    flush,
    async schedule(args) {
      const { promise, resolve, reject } = withResolvers();
      const split2 = shouldSplitBatch?.([...getBatchedArgs(), args]);
      if (split2)
        exec();
      const hasActiveScheduler = getScheduler().length > 0;
      if (hasActiveScheduler) {
        setScheduler({ args, resolve, reject });
        return promise;
      }
      setScheduler({ args, resolve, reject });
      setTimeout(exec, wait2);
      return promise;
    }
  };
}
var schedulerCache;
var init_createBatchScheduler = __esm({
  "node_modules/viem/_esm/utils/promise/createBatchScheduler.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_withResolvers();
    schedulerCache = /* @__PURE__ */ new Map();
    __name(createBatchScheduler, "createBatchScheduler");
  }
});

// node_modules/viem/_esm/errors/ccip.js
var OffchainLookupError, OffchainLookupResponseMalformedError, OffchainLookupSenderMismatchError;
var init_ccip = __esm({
  "node_modules/viem/_esm/errors/ccip.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_stringify();
    init_base();
    init_utils3();
    OffchainLookupError = class extends BaseError2 {
      static {
        __name(this, "OffchainLookupError");
      }
      constructor({ callbackSelector, cause, data, extraData, sender, urls: urls2 }) {
        super(cause.shortMessage || "An error occurred while fetching for an offchain result.", {
          cause,
          metaMessages: [
            ...cause.metaMessages || [],
            cause.metaMessages?.length ? "" : [],
            "Offchain Gateway Call:",
            urls2 && [
              "  Gateway URL(s):",
              ...urls2.map((url) => `    ${getUrl(url)}`)
            ],
            `  Sender: ${sender}`,
            `  Data: ${data}`,
            `  Callback selector: ${callbackSelector}`,
            `  Extra data: ${extraData}`
          ].flat(),
          name: "OffchainLookupError"
        });
      }
    };
    OffchainLookupResponseMalformedError = class extends BaseError2 {
      static {
        __name(this, "OffchainLookupResponseMalformedError");
      }
      constructor({ result, url }) {
        super("Offchain gateway response is malformed. Response data must be a hex value.", {
          metaMessages: [
            `Gateway URL: ${getUrl(url)}`,
            `Response: ${stringify(result)}`
          ],
          name: "OffchainLookupResponseMalformedError"
        });
      }
    };
    OffchainLookupSenderMismatchError = class extends BaseError2 {
      static {
        __name(this, "OffchainLookupSenderMismatchError");
      }
      constructor({ sender, to }) {
        super("Reverted sender address does not match target contract address (`to`).", {
          metaMessages: [
            `Contract address: ${to}`,
            `OffchainLookup sender address: ${sender}`
          ],
          name: "OffchainLookupSenderMismatchError"
        });
      }
    };
  }
});

// node_modules/viem/_esm/utils/abi/decodeFunctionData.js
function decodeFunctionData(parameters) {
  const { abi: abi2, data } = parameters;
  const signature = slice(data, 0, 4);
  const description = abi2.find((x) => x.type === "function" && signature === toFunctionSelector(formatAbiItem2(x)));
  if (!description)
    throw new AbiFunctionSignatureNotFoundError(signature, {
      docsPath: "/docs/contract/decodeFunctionData"
    });
  return {
    functionName: description.name,
    args: "inputs" in description && description.inputs && description.inputs.length > 0 ? decodeAbiParameters(description.inputs, slice(data, 4)) : void 0
  };
}
var init_decodeFunctionData = __esm({
  "node_modules/viem/_esm/utils/abi/decodeFunctionData.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_abi();
    init_slice();
    init_toFunctionSelector();
    init_decodeAbiParameters();
    init_formatAbiItem2();
    __name(decodeFunctionData, "decodeFunctionData");
  }
});

// node_modules/viem/_esm/utils/abi/encodeErrorResult.js
function encodeErrorResult(parameters) {
  const { abi: abi2, errorName, args } = parameters;
  let abiItem = abi2[0];
  if (errorName) {
    const item = getAbiItem({ abi: abi2, args, name: errorName });
    if (!item)
      throw new AbiErrorNotFoundError(errorName, { docsPath: docsPath6 });
    abiItem = item;
  }
  if (abiItem.type !== "error")
    throw new AbiErrorNotFoundError(void 0, { docsPath: docsPath6 });
  const definition = formatAbiItem2(abiItem);
  const signature = toFunctionSelector(definition);
  let data = "0x";
  if (args && args.length > 0) {
    if (!abiItem.inputs)
      throw new AbiErrorInputsNotFoundError(abiItem.name, { docsPath: docsPath6 });
    data = encodeAbiParameters(abiItem.inputs, args);
  }
  return concatHex([signature, data]);
}
var docsPath6;
var init_encodeErrorResult = __esm({
  "node_modules/viem/_esm/utils/abi/encodeErrorResult.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_abi();
    init_concat();
    init_toFunctionSelector();
    init_encodeAbiParameters();
    init_formatAbiItem2();
    init_getAbiItem();
    docsPath6 = "/docs/contract/encodeErrorResult";
    __name(encodeErrorResult, "encodeErrorResult");
  }
});

// node_modules/viem/_esm/utils/abi/encodeFunctionResult.js
function encodeFunctionResult(parameters) {
  const { abi: abi2, functionName, result } = parameters;
  let abiItem = abi2[0];
  if (functionName) {
    const item = getAbiItem({ abi: abi2, name: functionName });
    if (!item)
      throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath7 });
    abiItem = item;
  }
  if (abiItem.type !== "function")
    throw new AbiFunctionNotFoundError(void 0, { docsPath: docsPath7 });
  if (!abiItem.outputs)
    throw new AbiFunctionOutputsNotFoundError(abiItem.name, { docsPath: docsPath7 });
  const values = (() => {
    if (abiItem.outputs.length === 0)
      return [];
    if (abiItem.outputs.length === 1)
      return [result];
    if (Array.isArray(result))
      return result;
    throw new InvalidArrayError(result);
  })();
  return encodeAbiParameters(abiItem.outputs, values);
}
var docsPath7;
var init_encodeFunctionResult = __esm({
  "node_modules/viem/_esm/utils/abi/encodeFunctionResult.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_abi();
    init_encodeAbiParameters();
    init_getAbiItem();
    docsPath7 = "/docs/contract/encodeFunctionResult";
    __name(encodeFunctionResult, "encodeFunctionResult");
  }
});

// node_modules/viem/_esm/utils/ens/localBatchGatewayRequest.js
async function localBatchGatewayRequest(parameters) {
  const { data, ccipRequest: ccipRequest2 } = parameters;
  const { args: [queries] } = decodeFunctionData({ abi: batchGatewayAbi, data });
  const failures = [];
  const responses = [];
  await Promise.all(queries.map(async (query, i) => {
    try {
      responses[i] = query.urls.includes(localBatchGatewayUrl) ? await localBatchGatewayRequest({ data: query.data, ccipRequest: ccipRequest2 }) : await ccipRequest2(query);
      failures[i] = false;
    } catch (err) {
      failures[i] = true;
      responses[i] = encodeError(err);
    }
  }));
  return encodeFunctionResult({
    abi: batchGatewayAbi,
    functionName: "query",
    result: [failures, responses]
  });
}
function encodeError(error) {
  if (error.name === "HttpRequestError" && error.status)
    return encodeErrorResult({
      abi: batchGatewayAbi,
      errorName: "HttpError",
      args: [error.status, error.shortMessage]
    });
  return encodeErrorResult({
    abi: [solidityError],
    errorName: "Error",
    args: ["shortMessage" in error ? error.shortMessage : error.message]
  });
}
var localBatchGatewayUrl;
var init_localBatchGatewayRequest = __esm({
  "node_modules/viem/_esm/utils/ens/localBatchGatewayRequest.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_abis();
    init_solidity();
    init_decodeFunctionData();
    init_encodeErrorResult();
    init_encodeFunctionResult();
    localBatchGatewayUrl = "x-batch-gateway:true";
    __name(localBatchGatewayRequest, "localBatchGatewayRequest");
    __name(encodeError, "encodeError");
  }
});

// node_modules/viem/_esm/utils/ccip.js
var ccip_exports = {};
__export(ccip_exports, {
  ccipRequest: () => ccipRequest,
  offchainLookup: () => offchainLookup,
  offchainLookupAbiItem: () => offchainLookupAbiItem,
  offchainLookupSignature: () => offchainLookupSignature
});
async function offchainLookup(client, { blockNumber, blockTag, data, to }) {
  const { args } = decodeErrorResult({
    data,
    abi: [offchainLookupAbiItem]
  });
  const [sender, urls2, callData, callbackSelector, extraData] = args;
  const { ccipRead } = client;
  const ccipRequest_ = ccipRead && typeof ccipRead?.request === "function" ? ccipRead.request : ccipRequest;
  try {
    if (!isAddressEqual(to, sender))
      throw new OffchainLookupSenderMismatchError({ sender, to });
    const result = urls2.includes(localBatchGatewayUrl) ? await localBatchGatewayRequest({
      data: callData,
      ccipRequest: ccipRequest_
    }) : await ccipRequest_({ data: callData, sender, urls: urls2 });
    const { data: data_ } = await call(client, {
      blockNumber,
      blockTag,
      data: concat([
        callbackSelector,
        encodeAbiParameters([{ type: "bytes" }, { type: "bytes" }], [result, extraData])
      ]),
      to
    });
    return data_;
  } catch (err) {
    throw new OffchainLookupError({
      callbackSelector,
      cause: err,
      data,
      extraData,
      sender,
      urls: urls2
    });
  }
}
async function ccipRequest({ data, sender, urls: urls2 }) {
  let error = new Error("An unknown error occurred.");
  for (let i = 0; i < urls2.length; i++) {
    const url = urls2[i];
    const method = url.includes("{data}") ? "GET" : "POST";
    const body = method === "POST" ? { data, sender } : void 0;
    const headers = method === "POST" ? { "Content-Type": "application/json" } : {};
    try {
      const response = await fetch(url.replace("{sender}", sender.toLowerCase()).replace("{data}", data), {
        body: JSON.stringify(body),
        headers,
        method
      });
      let result;
      if (response.headers.get("Content-Type")?.startsWith("application/json")) {
        result = (await response.json()).data;
      } else {
        result = await response.text();
      }
      if (!response.ok) {
        error = new HttpRequestError({
          body,
          details: result?.error ? stringify(result.error) : response.statusText,
          headers: response.headers,
          status: response.status,
          url
        });
        continue;
      }
      if (!isHex(result)) {
        error = new OffchainLookupResponseMalformedError({
          result,
          url
        });
        continue;
      }
      return result;
    } catch (err) {
      error = new HttpRequestError({
        body,
        details: err.message,
        url
      });
    }
  }
  throw error;
}
var offchainLookupSignature, offchainLookupAbiItem;
var init_ccip2 = __esm({
  "node_modules/viem/_esm/utils/ccip.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_call();
    init_ccip();
    init_request();
    init_decodeErrorResult();
    init_encodeAbiParameters();
    init_isAddressEqual();
    init_concat();
    init_isHex();
    init_localBatchGatewayRequest();
    init_stringify();
    offchainLookupSignature = "0x556f1830";
    offchainLookupAbiItem = {
      name: "OffchainLookup",
      type: "error",
      inputs: [
        {
          name: "sender",
          type: "address"
        },
        {
          name: "urls",
          type: "string[]"
        },
        {
          name: "callData",
          type: "bytes"
        },
        {
          name: "callbackFunction",
          type: "bytes4"
        },
        {
          name: "extraData",
          type: "bytes"
        }
      ]
    };
    __name(offchainLookup, "offchainLookup");
    __name(ccipRequest, "ccipRequest");
  }
});

// node_modules/viem/_esm/actions/public/call.js
async function call(client, args) {
  const { account: account_ = client.account, authorizationList, batch = Boolean(client.batch?.multicall), blockNumber, blockTag = client.experimental_blockTag ?? "latest", accessList, blobs, blockOverrides, code, data: data_, factory, factoryData, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, stateOverride, ...rest } = args;
  const account = account_ ? parseAccount(account_) : void 0;
  if (code && (factory || factoryData))
    throw new BaseError2("Cannot provide both `code` & `factory`/`factoryData` as parameters.");
  if (code && to)
    throw new BaseError2("Cannot provide both `code` & `to` as parameters.");
  const deploylessCallViaBytecode = code && data_;
  const deploylessCallViaFactory = factory && factoryData && to && data_;
  const deploylessCall = deploylessCallViaBytecode || deploylessCallViaFactory;
  const data = (() => {
    if (deploylessCallViaBytecode)
      return toDeploylessCallViaBytecodeData({
        code,
        data: data_
      });
    if (deploylessCallViaFactory)
      return toDeploylessCallViaFactoryData({
        data: data_,
        factory,
        factoryData,
        to
      });
    return data_;
  })();
  try {
    assertRequest(args);
    const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
    const block = blockNumberHex || blockTag;
    const rpcBlockOverrides = blockOverrides ? toRpc2(blockOverrides) : void 0;
    const rpcStateOverride = serializeStateOverride(stateOverride);
    const chainFormat = client.chain?.formatters?.transactionRequest?.format;
    const format = chainFormat || formatTransactionRequest;
    const request = format({
      // Pick out extra data that might exist on the chain's transaction request type.
      ...extract(rest, { format: chainFormat }),
      from: account?.address,
      accessList,
      authorizationList,
      blobs,
      data,
      gas,
      gasPrice,
      maxFeePerBlobGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      to: deploylessCall ? void 0 : to,
      value
    });
    if (batch && shouldPerformMulticall({ request }) && !rpcStateOverride && !rpcBlockOverrides) {
      try {
        return await scheduleMulticall(client, {
          ...request,
          blockNumber,
          blockTag
        });
      } catch (err) {
        if (!(err instanceof ClientChainNotConfiguredError) && !(err instanceof ChainDoesNotSupportContract))
          throw err;
      }
    }
    const params = (() => {
      const base = [
        request,
        block
      ];
      if (rpcStateOverride && rpcBlockOverrides)
        return [...base, rpcStateOverride, rpcBlockOverrides];
      if (rpcStateOverride)
        return [...base, rpcStateOverride];
      if (rpcBlockOverrides)
        return [...base, {}, rpcBlockOverrides];
      return base;
    })();
    const response = await client.request({
      method: "eth_call",
      params
    });
    if (response === "0x")
      return { data: void 0 };
    return { data: response };
  } catch (err) {
    const data2 = getRevertErrorData(err);
    const { offchainLookup: offchainLookup2, offchainLookupSignature: offchainLookupSignature2 } = await Promise.resolve().then(() => (init_ccip2(), ccip_exports));
    if (client.ccipRead !== false && data2?.slice(0, 10) === offchainLookupSignature2 && to)
      return { data: await offchainLookup2(client, { data: data2, to }) };
    if (deploylessCall && data2?.slice(0, 10) === "0x101bb98d")
      throw new CounterfactualDeploymentFailedError({ factory });
    throw getCallError(err, {
      ...args,
      account,
      chain: client.chain
    });
  }
}
function shouldPerformMulticall({ request }) {
  const { data, to, ...request_ } = request;
  if (!data)
    return false;
  if (data.startsWith(aggregate3Signature))
    return false;
  if (!to)
    return false;
  if (Object.values(request_).filter((x) => typeof x !== "undefined").length > 0)
    return false;
  return true;
}
async function scheduleMulticall(client, args) {
  const { batchSize = 1024, wait: wait2 = 0 } = typeof client.batch?.multicall === "object" ? client.batch.multicall : {};
  const { blockNumber, blockTag = client.experimental_blockTag ?? "latest", data, multicallAddress: multicallAddress_, to } = args;
  let multicallAddress = multicallAddress_;
  if (!multicallAddress) {
    if (!client.chain)
      throw new ClientChainNotConfiguredError();
    multicallAddress = getChainContractAddress({
      blockNumber,
      chain: client.chain,
      contract: "multicall3"
    });
  }
  const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
  const block = blockNumberHex || blockTag;
  const { schedule } = createBatchScheduler({
    id: `${client.uid}.${block}`,
    wait: wait2,
    shouldSplitBatch(args2) {
      const size5 = args2.reduce((size6, { data: data2 }) => size6 + (data2.length - 2), 0);
      return size5 > batchSize * 2;
    },
    fn: /* @__PURE__ */ __name(async (requests) => {
      const calls = requests.map((request) => ({
        allowFailure: true,
        callData: request.data,
        target: request.to
      }));
      const calldata = encodeFunctionData({
        abi: multicall3Abi,
        args: [calls],
        functionName: "aggregate3"
      });
      const data2 = await client.request({
        method: "eth_call",
        params: [
          {
            data: calldata,
            to: multicallAddress
          },
          block
        ]
      });
      return decodeFunctionResult({
        abi: multicall3Abi,
        args: [calls],
        functionName: "aggregate3",
        data: data2 || "0x"
      });
    }, "fn")
  });
  const [{ returnData, success }] = await schedule({ data, to });
  if (!success)
    throw new RawContractError({ data: returnData });
  if (returnData === "0x")
    return { data: void 0 };
  return { data: returnData };
}
function toDeploylessCallViaBytecodeData(parameters) {
  const { code, data } = parameters;
  return encodeDeployData({
    abi: parseAbi(["constructor(bytes, bytes)"]),
    bytecode: deploylessCallViaBytecodeBytecode,
    args: [code, data]
  });
}
function toDeploylessCallViaFactoryData(parameters) {
  const { data, factory, factoryData, to } = parameters;
  return encodeDeployData({
    abi: parseAbi(["constructor(address, bytes, address, bytes)"]),
    bytecode: deploylessCallViaFactoryBytecode,
    args: [to, data, factory, factoryData]
  });
}
function getRevertErrorData(err) {
  if (!(err instanceof BaseError2))
    return void 0;
  const error = err.walk();
  return typeof error?.data === "object" ? error.data?.data : error.data;
}
var init_call = __esm({
  "node_modules/viem/_esm/actions/public/call.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_exports();
    init_BlockOverrides();
    init_parseAccount();
    init_abis();
    init_contract2();
    init_contracts();
    init_base();
    init_chain();
    init_contract();
    init_decodeFunctionResult();
    init_encodeDeployData();
    init_encodeFunctionData();
    init_getChainContractAddress();
    init_toHex();
    init_getCallError();
    init_extract();
    init_transactionRequest();
    init_createBatchScheduler();
    init_stateOverride2();
    init_assertRequest();
    __name(call, "call");
    __name(shouldPerformMulticall, "shouldPerformMulticall");
    __name(scheduleMulticall, "scheduleMulticall");
    __name(toDeploylessCallViaBytecodeData, "toDeploylessCallViaBytecodeData");
    __name(toDeploylessCallViaFactoryData, "toDeploylessCallViaFactoryData");
    __name(getRevertErrorData, "getRevertErrorData");
  }
});

// .wrangler/tmp/bundle-e0KIFJ/middleware-loader.entry.ts
init_checked_fetch();
init_modules_watch_stub();

// .wrangler/tmp/bundle-e0KIFJ/middleware-insertion-facade.js
init_checked_fetch();
init_modules_watch_stub();

// workers/src/index.ts
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/utils/getAction.js
init_checked_fetch();
init_modules_watch_stub();
function getAction(client, actionFn, name) {
  const action_implicit = client[actionFn.name];
  if (typeof action_implicit === "function")
    return action_implicit;
  const action_explicit = client[name];
  if (typeof action_explicit === "function")
    return action_explicit;
  return (params) => actionFn(client, params);
}
__name(getAction, "getAction");

// node_modules/viem/_esm/actions/public/createContractEventFilter.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/utils/abi/encodeEventTopics.js
init_checked_fetch();
init_modules_watch_stub();
init_abi();

// node_modules/viem/_esm/errors/log.js
init_checked_fetch();
init_modules_watch_stub();
init_base();
var FilterTypeNotSupportedError = class extends BaseError2 {
  static {
    __name(this, "FilterTypeNotSupportedError");
  }
  constructor(type) {
    super(`Filter type "${type}" is not supported.`, {
      name: "FilterTypeNotSupportedError"
    });
  }
};

// node_modules/viem/_esm/utils/abi/encodeEventTopics.js
init_toBytes();
init_keccak256();
init_toEventSelector();
init_encodeAbiParameters();
init_formatAbiItem2();
init_getAbiItem();
var docsPath = "/docs/contract/encodeEventTopics";
function encodeEventTopics(parameters) {
  const { abi: abi2, eventName, args } = parameters;
  let abiItem = abi2[0];
  if (eventName) {
    const item = getAbiItem({ abi: abi2, name: eventName });
    if (!item)
      throw new AbiEventNotFoundError(eventName, { docsPath });
    abiItem = item;
  }
  if (abiItem.type !== "event")
    throw new AbiEventNotFoundError(void 0, { docsPath });
  const definition = formatAbiItem2(abiItem);
  const signature = toEventSelector(definition);
  let topics = [];
  if (args && "inputs" in abiItem) {
    const indexedInputs = abiItem.inputs?.filter((param) => "indexed" in param && param.indexed);
    const args_ = Array.isArray(args) ? args : Object.values(args).length > 0 ? indexedInputs?.map((x) => args[x.name]) ?? [] : [];
    if (args_.length > 0) {
      topics = indexedInputs?.map((param, i) => {
        if (Array.isArray(args_[i]))
          return args_[i].map((_, j) => encodeArg({ param, value: args_[i][j] }));
        return typeof args_[i] !== "undefined" && args_[i] !== null ? encodeArg({ param, value: args_[i] }) : null;
      }) ?? [];
    }
  }
  return [signature, ...topics];
}
__name(encodeEventTopics, "encodeEventTopics");
function encodeArg({ param, value }) {
  if (param.type === "string" || param.type === "bytes")
    return keccak256(toBytes(value));
  if (param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/))
    throw new FilterTypeNotSupportedError(param.type);
  return encodeAbiParameters([param], [value]);
}
__name(encodeArg, "encodeArg");

// node_modules/viem/_esm/actions/public/createContractEventFilter.js
init_toHex();

// node_modules/viem/_esm/utils/filters/createFilterRequestScope.js
init_checked_fetch();
init_modules_watch_stub();
function createFilterRequestScope(client, { method }) {
  const requestMap = {};
  if (client.transport.type === "fallback")
    client.transport.onResponse?.(({ method: method_, response: id, status, transport }) => {
      if (status === "success" && method === method_)
        requestMap[id] = transport.request;
    });
  return (id) => requestMap[id] || client.request;
}
__name(createFilterRequestScope, "createFilterRequestScope");

// node_modules/viem/_esm/actions/public/createContractEventFilter.js
async function createContractEventFilter(client, parameters) {
  const { address, abi: abi2, args, eventName, fromBlock, strict, toBlock } = parameters;
  const getRequest = createFilterRequestScope(client, {
    method: "eth_newFilter"
  });
  const topics = eventName ? encodeEventTopics({
    abi: abi2,
    args,
    eventName
  }) : void 0;
  const id = await client.request({
    method: "eth_newFilter",
    params: [
      {
        address,
        fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
        toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock,
        topics
      }
    ]
  });
  return {
    abi: abi2,
    args,
    eventName,
    id,
    request: getRequest(id),
    strict: Boolean(strict),
    type: "event"
  };
}
__name(createContractEventFilter, "createContractEventFilter");

// node_modules/viem/_esm/actions/public/estimateContractGas.js
init_checked_fetch();
init_modules_watch_stub();
init_parseAccount();
init_encodeFunctionData();

// node_modules/viem/_esm/utils/errors/getContractError.js
init_checked_fetch();
init_modules_watch_stub();
init_abi();
init_base();
init_contract();
init_request();
init_rpc();
var EXECUTION_REVERTED_ERROR_CODE = 3;
function getContractError(err, { abi: abi2, address, args, docsPath: docsPath8, functionName, sender }) {
  const error = err instanceof RawContractError ? err : err instanceof BaseError2 ? err.walk((err2) => "data" in err2) || err.walk() : {};
  const { code, data, details, message, shortMessage } = error;
  const cause = (() => {
    if (err instanceof AbiDecodingZeroDataError)
      return new ContractFunctionZeroDataError({ functionName });
    if ([EXECUTION_REVERTED_ERROR_CODE, InternalRpcError.code].includes(code) && (data || details || message || shortMessage)) {
      return new ContractFunctionRevertedError({
        abi: abi2,
        data: typeof data === "object" ? data.data : data,
        functionName,
        message: error instanceof RpcRequestError ? details : shortMessage ?? message
      });
    }
    return err;
  })();
  return new ContractFunctionExecutionError(cause, {
    abi: abi2,
    args,
    contractAddress: address,
    docsPath: docsPath8,
    functionName,
    sender
  });
}
__name(getContractError, "getContractError");

// node_modules/viem/_esm/actions/public/estimateGas.js
init_checked_fetch();
init_modules_watch_stub();
init_parseAccount();
init_base();

// node_modules/viem/_esm/utils/authorization/recoverAuthorizationAddress.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/utils/signature/recoverAddress.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/accounts/utils/publicKeyToAddress.js
init_checked_fetch();
init_modules_watch_stub();
init_getAddress();
init_keccak256();
function publicKeyToAddress(publicKey) {
  const address = keccak256(`0x${publicKey.substring(4)}`).substring(26);
  return checksumAddress(`0x${address}`);
}
__name(publicKeyToAddress, "publicKeyToAddress");

// node_modules/viem/_esm/utils/signature/recoverPublicKey.js
init_checked_fetch();
init_modules_watch_stub();
init_isHex();
init_size();
init_fromHex();
init_toHex();
async function recoverPublicKey({ hash: hash2, signature }) {
  const hashHex = isHex(hash2) ? hash2 : toHex(hash2);
  const { secp256k1: secp256k12 } = await Promise.resolve().then(() => (init_secp256k1(), secp256k1_exports));
  const signature_ = (() => {
    if (typeof signature === "object" && "r" in signature && "s" in signature) {
      const { r, s, v, yParity } = signature;
      const yParityOrV2 = Number(yParity ?? v);
      const recoveryBit2 = toRecoveryBit(yParityOrV2);
      return new secp256k12.Signature(hexToBigInt(r), hexToBigInt(s)).addRecoveryBit(recoveryBit2);
    }
    const signatureHex = isHex(signature) ? signature : toHex(signature);
    if (size(signatureHex) !== 65)
      throw new Error("invalid signature length");
    const yParityOrV = hexToNumber(`0x${signatureHex.slice(130)}`);
    const recoveryBit = toRecoveryBit(yParityOrV);
    return secp256k12.Signature.fromCompact(signatureHex.substring(2, 130)).addRecoveryBit(recoveryBit);
  })();
  const publicKey = signature_.recoverPublicKey(hashHex.substring(2)).toHex(false);
  return `0x${publicKey}`;
}
__name(recoverPublicKey, "recoverPublicKey");
function toRecoveryBit(yParityOrV) {
  if (yParityOrV === 0 || yParityOrV === 1)
    return yParityOrV;
  if (yParityOrV === 27)
    return 0;
  if (yParityOrV === 28)
    return 1;
  throw new Error("Invalid yParityOrV value");
}
__name(toRecoveryBit, "toRecoveryBit");

// node_modules/viem/_esm/utils/signature/recoverAddress.js
async function recoverAddress({ hash: hash2, signature }) {
  return publicKeyToAddress(await recoverPublicKey({ hash: hash2, signature }));
}
__name(recoverAddress, "recoverAddress");

// node_modules/viem/_esm/utils/authorization/hashAuthorization.js
init_checked_fetch();
init_modules_watch_stub();
init_concat();
init_toBytes();
init_toHex();

// node_modules/viem/_esm/utils/encoding/toRlp.js
init_checked_fetch();
init_modules_watch_stub();
init_base();
init_cursor2();
init_toBytes();
init_toHex();
function toRlp(bytes, to = "hex") {
  const encodable = getEncodable(bytes);
  const cursor = createCursor(new Uint8Array(encodable.length));
  encodable.encode(cursor);
  if (to === "hex")
    return bytesToHex(cursor.bytes);
  return cursor.bytes;
}
__name(toRlp, "toRlp");
function getEncodable(bytes) {
  if (Array.isArray(bytes))
    return getEncodableList(bytes.map((x) => getEncodable(x)));
  return getEncodableBytes(bytes);
}
__name(getEncodable, "getEncodable");
function getEncodableList(list) {
  const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
  const sizeOfBodyLength = getSizeOfLength(bodyLength);
  const length = (() => {
    if (bodyLength <= 55)
      return 1 + bodyLength;
    return 1 + sizeOfBodyLength + bodyLength;
  })();
  return {
    length,
    encode(cursor) {
      if (bodyLength <= 55) {
        cursor.pushByte(192 + bodyLength);
      } else {
        cursor.pushByte(192 + 55 + sizeOfBodyLength);
        if (sizeOfBodyLength === 1)
          cursor.pushUint8(bodyLength);
        else if (sizeOfBodyLength === 2)
          cursor.pushUint16(bodyLength);
        else if (sizeOfBodyLength === 3)
          cursor.pushUint24(bodyLength);
        else
          cursor.pushUint32(bodyLength);
      }
      for (const { encode: encode4 } of list) {
        encode4(cursor);
      }
    }
  };
}
__name(getEncodableList, "getEncodableList");
function getEncodableBytes(bytesOrHex) {
  const bytes = typeof bytesOrHex === "string" ? hexToBytes(bytesOrHex) : bytesOrHex;
  const sizeOfBytesLength = getSizeOfLength(bytes.length);
  const length = (() => {
    if (bytes.length === 1 && bytes[0] < 128)
      return 1;
    if (bytes.length <= 55)
      return 1 + bytes.length;
    return 1 + sizeOfBytesLength + bytes.length;
  })();
  return {
    length,
    encode(cursor) {
      if (bytes.length === 1 && bytes[0] < 128) {
        cursor.pushBytes(bytes);
      } else if (bytes.length <= 55) {
        cursor.pushByte(128 + bytes.length);
        cursor.pushBytes(bytes);
      } else {
        cursor.pushByte(128 + 55 + sizeOfBytesLength);
        if (sizeOfBytesLength === 1)
          cursor.pushUint8(bytes.length);
        else if (sizeOfBytesLength === 2)
          cursor.pushUint16(bytes.length);
        else if (sizeOfBytesLength === 3)
          cursor.pushUint24(bytes.length);
        else
          cursor.pushUint32(bytes.length);
        cursor.pushBytes(bytes);
      }
    }
  };
}
__name(getEncodableBytes, "getEncodableBytes");
function getSizeOfLength(length) {
  if (length < 2 ** 8)
    return 1;
  if (length < 2 ** 16)
    return 2;
  if (length < 2 ** 24)
    return 3;
  if (length < 2 ** 32)
    return 4;
  throw new BaseError2("Length is too large.");
}
__name(getSizeOfLength, "getSizeOfLength");

// node_modules/viem/_esm/utils/authorization/hashAuthorization.js
init_keccak256();
function hashAuthorization(parameters) {
  const { chainId, nonce, to } = parameters;
  const address = parameters.contractAddress ?? parameters.address;
  const hash2 = keccak256(concatHex([
    "0x05",
    toRlp([
      chainId ? numberToHex(chainId) : "0x",
      address,
      nonce ? numberToHex(nonce) : "0x"
    ])
  ]));
  if (to === "bytes")
    return hexToBytes(hash2);
  return hash2;
}
__name(hashAuthorization, "hashAuthorization");

// node_modules/viem/_esm/utils/authorization/recoverAuthorizationAddress.js
async function recoverAuthorizationAddress(parameters) {
  const { authorization, signature } = parameters;
  return recoverAddress({
    hash: hashAuthorization(authorization),
    signature: signature ?? authorization
  });
}
__name(recoverAuthorizationAddress, "recoverAuthorizationAddress");

// node_modules/viem/_esm/actions/public/estimateGas.js
init_toHex();

// node_modules/viem/_esm/utils/errors/getEstimateGasError.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/errors/estimateGas.js
init_checked_fetch();
init_modules_watch_stub();
init_formatEther();
init_formatGwei();
init_base();
init_transaction();
var EstimateGasExecutionError = class extends BaseError2 {
  static {
    __name(this, "EstimateGasExecutionError");
  }
  constructor(cause, { account, docsPath: docsPath8, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value }) {
    const prettyArgs = prettyPrint({
      from: account?.address,
      to,
      value: typeof value !== "undefined" && `${formatEther(value)} ${chain?.nativeCurrency?.symbol || "ETH"}`,
      data,
      gas,
      gasPrice: typeof gasPrice !== "undefined" && `${formatGwei(gasPrice)} gwei`,
      maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei(maxFeePerGas)} gwei`,
      maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei(maxPriorityFeePerGas)} gwei`,
      nonce
    });
    super(cause.shortMessage, {
      cause,
      docsPath: docsPath8,
      metaMessages: [
        ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
        "Estimate Gas Arguments:",
        prettyArgs
      ].filter(Boolean),
      name: "EstimateGasExecutionError"
    });
    Object.defineProperty(this, "cause", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.cause = cause;
  }
};

// node_modules/viem/_esm/utils/errors/getEstimateGasError.js
init_node();
init_getNodeError();
function getEstimateGasError(err, { docsPath: docsPath8, ...args }) {
  const cause = (() => {
    const cause2 = getNodeError(err, args);
    if (cause2 instanceof UnknownNodeError)
      return err;
    return cause2;
  })();
  return new EstimateGasExecutionError(cause, {
    docsPath: docsPath8,
    ...args
  });
}
__name(getEstimateGasError, "getEstimateGasError");

// node_modules/viem/_esm/actions/public/estimateGas.js
init_extract();
init_transactionRequest();
init_stateOverride2();
init_assertRequest();

// node_modules/viem/_esm/actions/wallet/prepareTransactionRequest.js
init_checked_fetch();
init_modules_watch_stub();
init_parseAccount();

// node_modules/viem/_esm/actions/public/estimateFeesPerGas.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/errors/fee.js
init_checked_fetch();
init_modules_watch_stub();
init_formatGwei();
init_base();
var BaseFeeScalarError = class extends BaseError2 {
  static {
    __name(this, "BaseFeeScalarError");
  }
  constructor() {
    super("`baseFeeMultiplier` must be greater than 1.", {
      name: "BaseFeeScalarError"
    });
  }
};
var Eip1559FeesNotSupportedError = class extends BaseError2 {
  static {
    __name(this, "Eip1559FeesNotSupportedError");
  }
  constructor() {
    super("Chain does not support EIP-1559 fees.", {
      name: "Eip1559FeesNotSupportedError"
    });
  }
};
var MaxFeePerGasTooLowError = class extends BaseError2 {
  static {
    __name(this, "MaxFeePerGasTooLowError");
  }
  constructor({ maxPriorityFeePerGas }) {
    super(`\`maxFeePerGas\` cannot be less than the \`maxPriorityFeePerGas\` (${formatGwei(maxPriorityFeePerGas)} gwei).`, { name: "MaxFeePerGasTooLowError" });
  }
};

// node_modules/viem/_esm/actions/public/estimateMaxPriorityFeePerGas.js
init_checked_fetch();
init_modules_watch_stub();
init_fromHex();

// node_modules/viem/_esm/actions/public/getBlock.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/errors/block.js
init_checked_fetch();
init_modules_watch_stub();
init_base();
var BlockNotFoundError = class extends BaseError2 {
  static {
    __name(this, "BlockNotFoundError");
  }
  constructor({ blockHash, blockNumber }) {
    let identifier = "Block";
    if (blockHash)
      identifier = `Block at hash "${blockHash}"`;
    if (blockNumber)
      identifier = `Block at number "${blockNumber}"`;
    super(`${identifier} could not be found.`, { name: "BlockNotFoundError" });
  }
};

// node_modules/viem/_esm/actions/public/getBlock.js
init_toHex();

// node_modules/viem/_esm/utils/formatters/block.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/utils/formatters/transaction.js
init_checked_fetch();
init_modules_watch_stub();
init_fromHex();
var transactionType = {
  "0x0": "legacy",
  "0x1": "eip2930",
  "0x2": "eip1559",
  "0x3": "eip4844",
  "0x4": "eip7702"
};
function formatTransaction(transaction) {
  const transaction_ = {
    ...transaction,
    blockHash: transaction.blockHash ? transaction.blockHash : null,
    blockNumber: transaction.blockNumber ? BigInt(transaction.blockNumber) : null,
    chainId: transaction.chainId ? hexToNumber(transaction.chainId) : void 0,
    gas: transaction.gas ? BigInt(transaction.gas) : void 0,
    gasPrice: transaction.gasPrice ? BigInt(transaction.gasPrice) : void 0,
    maxFeePerBlobGas: transaction.maxFeePerBlobGas ? BigInt(transaction.maxFeePerBlobGas) : void 0,
    maxFeePerGas: transaction.maxFeePerGas ? BigInt(transaction.maxFeePerGas) : void 0,
    maxPriorityFeePerGas: transaction.maxPriorityFeePerGas ? BigInt(transaction.maxPriorityFeePerGas) : void 0,
    nonce: transaction.nonce ? hexToNumber(transaction.nonce) : void 0,
    to: transaction.to ? transaction.to : null,
    transactionIndex: transaction.transactionIndex ? Number(transaction.transactionIndex) : null,
    type: transaction.type ? transactionType[transaction.type] : void 0,
    typeHex: transaction.type ? transaction.type : void 0,
    value: transaction.value ? BigInt(transaction.value) : void 0,
    v: transaction.v ? BigInt(transaction.v) : void 0
  };
  if (transaction.authorizationList)
    transaction_.authorizationList = formatAuthorizationList2(transaction.authorizationList);
  transaction_.yParity = (() => {
    if (transaction.yParity)
      return Number(transaction.yParity);
    if (typeof transaction_.v === "bigint") {
      if (transaction_.v === 0n || transaction_.v === 27n)
        return 0;
      if (transaction_.v === 1n || transaction_.v === 28n)
        return 1;
      if (transaction_.v >= 35n)
        return transaction_.v % 2n === 0n ? 1 : 0;
    }
    return void 0;
  })();
  if (transaction_.type === "legacy") {
    delete transaction_.accessList;
    delete transaction_.maxFeePerBlobGas;
    delete transaction_.maxFeePerGas;
    delete transaction_.maxPriorityFeePerGas;
    delete transaction_.yParity;
  }
  if (transaction_.type === "eip2930") {
    delete transaction_.maxFeePerBlobGas;
    delete transaction_.maxFeePerGas;
    delete transaction_.maxPriorityFeePerGas;
  }
  if (transaction_.type === "eip1559") {
    delete transaction_.maxFeePerBlobGas;
  }
  return transaction_;
}
__name(formatTransaction, "formatTransaction");
function formatAuthorizationList2(authorizationList) {
  return authorizationList.map((authorization) => ({
    address: authorization.address,
    chainId: Number(authorization.chainId),
    nonce: Number(authorization.nonce),
    r: authorization.r,
    s: authorization.s,
    yParity: Number(authorization.yParity)
  }));
}
__name(formatAuthorizationList2, "formatAuthorizationList");

// node_modules/viem/_esm/utils/formatters/block.js
function formatBlock(block) {
  const transactions = (block.transactions ?? []).map((transaction) => {
    if (typeof transaction === "string")
      return transaction;
    return formatTransaction(transaction);
  });
  return {
    ...block,
    baseFeePerGas: block.baseFeePerGas ? BigInt(block.baseFeePerGas) : null,
    blobGasUsed: block.blobGasUsed ? BigInt(block.blobGasUsed) : void 0,
    difficulty: block.difficulty ? BigInt(block.difficulty) : void 0,
    excessBlobGas: block.excessBlobGas ? BigInt(block.excessBlobGas) : void 0,
    gasLimit: block.gasLimit ? BigInt(block.gasLimit) : void 0,
    gasUsed: block.gasUsed ? BigInt(block.gasUsed) : void 0,
    hash: block.hash ? block.hash : null,
    logsBloom: block.logsBloom ? block.logsBloom : null,
    nonce: block.nonce ? block.nonce : null,
    number: block.number ? BigInt(block.number) : null,
    size: block.size ? BigInt(block.size) : void 0,
    timestamp: block.timestamp ? BigInt(block.timestamp) : void 0,
    transactions,
    totalDifficulty: block.totalDifficulty ? BigInt(block.totalDifficulty) : null
  };
}
__name(formatBlock, "formatBlock");

// node_modules/viem/_esm/actions/public/getBlock.js
async function getBlock(client, { blockHash, blockNumber, blockTag = client.experimental_blockTag ?? "latest", includeTransactions: includeTransactions_ } = {}) {
  const includeTransactions = includeTransactions_ ?? false;
  const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
  let block = null;
  if (blockHash) {
    block = await client.request({
      method: "eth_getBlockByHash",
      params: [blockHash, includeTransactions]
    }, { dedupe: true });
  } else {
    block = await client.request({
      method: "eth_getBlockByNumber",
      params: [blockNumberHex || blockTag, includeTransactions]
    }, { dedupe: Boolean(blockNumberHex) });
  }
  if (!block)
    throw new BlockNotFoundError({ blockHash, blockNumber });
  const format = client.chain?.formatters?.block?.format || formatBlock;
  return format(block);
}
__name(getBlock, "getBlock");

// node_modules/viem/_esm/actions/public/getGasPrice.js
init_checked_fetch();
init_modules_watch_stub();
async function getGasPrice(client) {
  const gasPrice = await client.request({
    method: "eth_gasPrice"
  });
  return BigInt(gasPrice);
}
__name(getGasPrice, "getGasPrice");

// node_modules/viem/_esm/actions/public/estimateMaxPriorityFeePerGas.js
async function estimateMaxPriorityFeePerGas(client, args) {
  return internal_estimateMaxPriorityFeePerGas(client, args);
}
__name(estimateMaxPriorityFeePerGas, "estimateMaxPriorityFeePerGas");
async function internal_estimateMaxPriorityFeePerGas(client, args) {
  const { block: block_, chain = client.chain, request } = args || {};
  try {
    const maxPriorityFeePerGas = chain?.fees?.maxPriorityFeePerGas ?? chain?.fees?.defaultPriorityFee;
    if (typeof maxPriorityFeePerGas === "function") {
      const block = block_ || await getAction(client, getBlock, "getBlock")({});
      const maxPriorityFeePerGas_ = await maxPriorityFeePerGas({
        block,
        client,
        request
      });
      if (maxPriorityFeePerGas_ === null)
        throw new Error();
      return maxPriorityFeePerGas_;
    }
    if (typeof maxPriorityFeePerGas !== "undefined")
      return maxPriorityFeePerGas;
    const maxPriorityFeePerGasHex = await client.request({
      method: "eth_maxPriorityFeePerGas"
    });
    return hexToBigInt(maxPriorityFeePerGasHex);
  } catch {
    const [block, gasPrice] = await Promise.all([
      block_ ? Promise.resolve(block_) : getAction(client, getBlock, "getBlock")({}),
      getAction(client, getGasPrice, "getGasPrice")({})
    ]);
    if (typeof block.baseFeePerGas !== "bigint")
      throw new Eip1559FeesNotSupportedError();
    const maxPriorityFeePerGas = gasPrice - block.baseFeePerGas;
    if (maxPriorityFeePerGas < 0n)
      return 0n;
    return maxPriorityFeePerGas;
  }
}
__name(internal_estimateMaxPriorityFeePerGas, "internal_estimateMaxPriorityFeePerGas");

// node_modules/viem/_esm/actions/public/estimateFeesPerGas.js
async function estimateFeesPerGas(client, args) {
  return internal_estimateFeesPerGas(client, args);
}
__name(estimateFeesPerGas, "estimateFeesPerGas");
async function internal_estimateFeesPerGas(client, args) {
  const { block: block_, chain = client.chain, request, type = "eip1559" } = args || {};
  const baseFeeMultiplier = await (async () => {
    if (typeof chain?.fees?.baseFeeMultiplier === "function")
      return chain.fees.baseFeeMultiplier({
        block: block_,
        client,
        request
      });
    return chain?.fees?.baseFeeMultiplier ?? 1.2;
  })();
  if (baseFeeMultiplier < 1)
    throw new BaseFeeScalarError();
  const decimals = baseFeeMultiplier.toString().split(".")[1]?.length ?? 0;
  const denominator = 10 ** decimals;
  const multiply = /* @__PURE__ */ __name((base) => base * BigInt(Math.ceil(baseFeeMultiplier * denominator)) / BigInt(denominator), "multiply");
  const block = block_ ? block_ : await getAction(client, getBlock, "getBlock")({});
  if (typeof chain?.fees?.estimateFeesPerGas === "function") {
    const fees = await chain.fees.estimateFeesPerGas({
      block: block_,
      client,
      multiply,
      request,
      type
    });
    if (fees !== null)
      return fees;
  }
  if (type === "eip1559") {
    if (typeof block.baseFeePerGas !== "bigint")
      throw new Eip1559FeesNotSupportedError();
    const maxPriorityFeePerGas = typeof request?.maxPriorityFeePerGas === "bigint" ? request.maxPriorityFeePerGas : await internal_estimateMaxPriorityFeePerGas(client, {
      block,
      chain,
      request
    });
    const baseFeePerGas = multiply(block.baseFeePerGas);
    const maxFeePerGas = request?.maxFeePerGas ?? baseFeePerGas + maxPriorityFeePerGas;
    return {
      maxFeePerGas,
      maxPriorityFeePerGas
    };
  }
  const gasPrice = request?.gasPrice ?? multiply(await getAction(client, getGasPrice, "getGasPrice")({}));
  return {
    gasPrice
  };
}
__name(internal_estimateFeesPerGas, "internal_estimateFeesPerGas");

// node_modules/viem/_esm/actions/public/getTransactionCount.js
init_checked_fetch();
init_modules_watch_stub();
init_fromHex();
init_toHex();
async function getTransactionCount(client, { address, blockTag = "latest", blockNumber }) {
  const count = await client.request({
    method: "eth_getTransactionCount",
    params: [
      address,
      typeof blockNumber === "bigint" ? numberToHex(blockNumber) : blockTag
    ]
  }, {
    dedupe: Boolean(blockNumber)
  });
  return hexToNumber(count);
}
__name(getTransactionCount, "getTransactionCount");

// node_modules/viem/_esm/utils/blob/blobsToCommitments.js
init_checked_fetch();
init_modules_watch_stub();
init_toBytes();
init_toHex();
function blobsToCommitments(parameters) {
  const { kzg } = parameters;
  const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
  const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes(x)) : parameters.blobs;
  const commitments = [];
  for (const blob of blobs)
    commitments.push(Uint8Array.from(kzg.blobToKzgCommitment(blob)));
  return to === "bytes" ? commitments : commitments.map((x) => bytesToHex(x));
}
__name(blobsToCommitments, "blobsToCommitments");

// node_modules/viem/_esm/utils/blob/blobsToProofs.js
init_checked_fetch();
init_modules_watch_stub();
init_toBytes();
init_toHex();
function blobsToProofs(parameters) {
  const { kzg } = parameters;
  const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
  const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes(x)) : parameters.blobs;
  const commitments = typeof parameters.commitments[0] === "string" ? parameters.commitments.map((x) => hexToBytes(x)) : parameters.commitments;
  const proofs = [];
  for (let i = 0; i < blobs.length; i++) {
    const blob = blobs[i];
    const commitment = commitments[i];
    proofs.push(Uint8Array.from(kzg.computeBlobKzgProof(blob, commitment)));
  }
  return to === "bytes" ? proofs : proofs.map((x) => bytesToHex(x));
}
__name(blobsToProofs, "blobsToProofs");

// node_modules/viem/_esm/utils/blob/commitmentsToVersionedHashes.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/utils/blob/commitmentToVersionedHash.js
init_checked_fetch();
init_modules_watch_stub();
init_toHex();

// node_modules/viem/_esm/utils/hash/sha256.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/node_modules/@noble/hashes/esm/sha256.js
init_checked_fetch();
init_modules_watch_stub();
init_sha2();
var sha2562 = sha256;

// node_modules/viem/_esm/utils/hash/sha256.js
init_isHex();
init_toBytes();
init_toHex();
function sha2563(value, to_) {
  const to = to_ || "hex";
  const bytes = sha2562(isHex(value, { strict: false }) ? toBytes(value) : value);
  if (to === "bytes")
    return bytes;
  return toHex(bytes);
}
__name(sha2563, "sha256");

// node_modules/viem/_esm/utils/blob/commitmentToVersionedHash.js
function commitmentToVersionedHash(parameters) {
  const { commitment, version: version4 = 1 } = parameters;
  const to = parameters.to ?? (typeof commitment === "string" ? "hex" : "bytes");
  const versionedHash = sha2563(commitment, "bytes");
  versionedHash.set([version4], 0);
  return to === "bytes" ? versionedHash : bytesToHex(versionedHash);
}
__name(commitmentToVersionedHash, "commitmentToVersionedHash");

// node_modules/viem/_esm/utils/blob/commitmentsToVersionedHashes.js
function commitmentsToVersionedHashes(parameters) {
  const { commitments, version: version4 } = parameters;
  const to = parameters.to ?? (typeof commitments[0] === "string" ? "hex" : "bytes");
  const hashes = [];
  for (const commitment of commitments) {
    hashes.push(commitmentToVersionedHash({
      commitment,
      to,
      version: version4
    }));
  }
  return hashes;
}
__name(commitmentsToVersionedHashes, "commitmentsToVersionedHashes");

// node_modules/viem/_esm/utils/blob/toBlobSidecars.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/utils/blob/toBlobs.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/constants/blob.js
init_checked_fetch();
init_modules_watch_stub();
var blobsPerTransaction = 6;
var bytesPerFieldElement = 32;
var fieldElementsPerBlob = 4096;
var bytesPerBlob = bytesPerFieldElement * fieldElementsPerBlob;
var maxBytesPerTransaction = bytesPerBlob * blobsPerTransaction - // terminator byte (0x80).
1 - // zero byte (0x00) appended to each field element.
1 * fieldElementsPerBlob * blobsPerTransaction;

// node_modules/viem/_esm/errors/blob.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/constants/kzg.js
init_checked_fetch();
init_modules_watch_stub();
var versionedHashVersionKzg = 1;

// node_modules/viem/_esm/errors/blob.js
init_base();
var BlobSizeTooLargeError = class extends BaseError2 {
  static {
    __name(this, "BlobSizeTooLargeError");
  }
  constructor({ maxSize, size: size5 }) {
    super("Blob size is too large.", {
      metaMessages: [`Max: ${maxSize} bytes`, `Given: ${size5} bytes`],
      name: "BlobSizeTooLargeError"
    });
  }
};
var EmptyBlobError = class extends BaseError2 {
  static {
    __name(this, "EmptyBlobError");
  }
  constructor() {
    super("Blob data must not be empty.", { name: "EmptyBlobError" });
  }
};
var InvalidVersionedHashSizeError = class extends BaseError2 {
  static {
    __name(this, "InvalidVersionedHashSizeError");
  }
  constructor({ hash: hash2, size: size5 }) {
    super(`Versioned hash "${hash2}" size is invalid.`, {
      metaMessages: ["Expected: 32", `Received: ${size5}`],
      name: "InvalidVersionedHashSizeError"
    });
  }
};
var InvalidVersionedHashVersionError = class extends BaseError2 {
  static {
    __name(this, "InvalidVersionedHashVersionError");
  }
  constructor({ hash: hash2, version: version4 }) {
    super(`Versioned hash "${hash2}" version is invalid.`, {
      metaMessages: [
        `Expected: ${versionedHashVersionKzg}`,
        `Received: ${version4}`
      ],
      name: "InvalidVersionedHashVersionError"
    });
  }
};

// node_modules/viem/_esm/utils/blob/toBlobs.js
init_cursor2();
init_size();
init_toBytes();
init_toHex();
function toBlobs(parameters) {
  const to = parameters.to ?? (typeof parameters.data === "string" ? "hex" : "bytes");
  const data = typeof parameters.data === "string" ? hexToBytes(parameters.data) : parameters.data;
  const size_ = size(data);
  if (!size_)
    throw new EmptyBlobError();
  if (size_ > maxBytesPerTransaction)
    throw new BlobSizeTooLargeError({
      maxSize: maxBytesPerTransaction,
      size: size_
    });
  const blobs = [];
  let active = true;
  let position = 0;
  while (active) {
    const blob = createCursor(new Uint8Array(bytesPerBlob));
    let size5 = 0;
    while (size5 < fieldElementsPerBlob) {
      const bytes = data.slice(position, position + (bytesPerFieldElement - 1));
      blob.pushByte(0);
      blob.pushBytes(bytes);
      if (bytes.length < 31) {
        blob.pushByte(128);
        active = false;
        break;
      }
      size5++;
      position += 31;
    }
    blobs.push(blob);
  }
  return to === "bytes" ? blobs.map((x) => x.bytes) : blobs.map((x) => bytesToHex(x.bytes));
}
__name(toBlobs, "toBlobs");

// node_modules/viem/_esm/utils/blob/toBlobSidecars.js
function toBlobSidecars(parameters) {
  const { data, kzg, to } = parameters;
  const blobs = parameters.blobs ?? toBlobs({ data, to });
  const commitments = parameters.commitments ?? blobsToCommitments({ blobs, kzg, to });
  const proofs = parameters.proofs ?? blobsToProofs({ blobs, commitments, kzg, to });
  const sidecars = [];
  for (let i = 0; i < blobs.length; i++)
    sidecars.push({
      blob: blobs[i],
      commitment: commitments[i],
      proof: proofs[i]
    });
  return sidecars;
}
__name(toBlobSidecars, "toBlobSidecars");

// node_modules/viem/_esm/actions/wallet/prepareTransactionRequest.js
init_assertRequest();

// node_modules/viem/_esm/utils/transaction/getTransactionType.js
init_checked_fetch();
init_modules_watch_stub();
init_transaction();
function getTransactionType(transaction) {
  if (transaction.type)
    return transaction.type;
  if (typeof transaction.authorizationList !== "undefined")
    return "eip7702";
  if (typeof transaction.blobs !== "undefined" || typeof transaction.blobVersionedHashes !== "undefined" || typeof transaction.maxFeePerBlobGas !== "undefined" || typeof transaction.sidecars !== "undefined")
    return "eip4844";
  if (typeof transaction.maxFeePerGas !== "undefined" || typeof transaction.maxPriorityFeePerGas !== "undefined") {
    return "eip1559";
  }
  if (typeof transaction.gasPrice !== "undefined") {
    if (typeof transaction.accessList !== "undefined")
      return "eip2930";
    return "legacy";
  }
  throw new InvalidSerializableTransactionError({ transaction });
}
__name(getTransactionType, "getTransactionType");

// node_modules/viem/_esm/actions/public/getChainId.js
init_checked_fetch();
init_modules_watch_stub();
init_fromHex();
async function getChainId(client) {
  const chainIdHex = await client.request({
    method: "eth_chainId"
  }, { dedupe: true });
  return hexToNumber(chainIdHex);
}
__name(getChainId, "getChainId");

// node_modules/viem/_esm/actions/wallet/prepareTransactionRequest.js
var defaultParameters = [
  "blobVersionedHashes",
  "chainId",
  "fees",
  "gas",
  "nonce",
  "type"
];
var eip1559NetworkCache = /* @__PURE__ */ new Map();
async function prepareTransactionRequest(client, args) {
  const { account: account_ = client.account, blobs, chain, gas, kzg, nonce, nonceManager, parameters = defaultParameters, type } = args;
  const account = account_ ? parseAccount(account_) : account_;
  const request = { ...args, ...account ? { from: account?.address } : {} };
  let block;
  async function getBlock2() {
    if (block)
      return block;
    block = await getAction(client, getBlock, "getBlock")({ blockTag: "latest" });
    return block;
  }
  __name(getBlock2, "getBlock");
  let chainId;
  async function getChainId3() {
    if (chainId)
      return chainId;
    if (chain)
      return chain.id;
    if (typeof args.chainId !== "undefined")
      return args.chainId;
    const chainId_ = await getAction(client, getChainId, "getChainId")({});
    chainId = chainId_;
    return chainId;
  }
  __name(getChainId3, "getChainId");
  if (parameters.includes("nonce") && typeof nonce === "undefined" && account) {
    if (nonceManager) {
      const chainId2 = await getChainId3();
      request.nonce = await nonceManager.consume({
        address: account.address,
        chainId: chainId2,
        client
      });
    } else {
      request.nonce = await getAction(client, getTransactionCount, "getTransactionCount")({
        address: account.address,
        blockTag: "pending"
      });
    }
  }
  if ((parameters.includes("blobVersionedHashes") || parameters.includes("sidecars")) && blobs && kzg) {
    const commitments = blobsToCommitments({ blobs, kzg });
    if (parameters.includes("blobVersionedHashes")) {
      const versionedHashes = commitmentsToVersionedHashes({
        commitments,
        to: "hex"
      });
      request.blobVersionedHashes = versionedHashes;
    }
    if (parameters.includes("sidecars")) {
      const proofs = blobsToProofs({ blobs, commitments, kzg });
      const sidecars = toBlobSidecars({
        blobs,
        commitments,
        proofs,
        to: "hex"
      });
      request.sidecars = sidecars;
    }
  }
  if (parameters.includes("chainId"))
    request.chainId = await getChainId3();
  if ((parameters.includes("fees") || parameters.includes("type")) && typeof type === "undefined") {
    try {
      request.type = getTransactionType(request);
    } catch {
      let isEip1559Network = eip1559NetworkCache.get(client.uid);
      if (typeof isEip1559Network === "undefined") {
        const block2 = await getBlock2();
        isEip1559Network = typeof block2?.baseFeePerGas === "bigint";
        eip1559NetworkCache.set(client.uid, isEip1559Network);
      }
      request.type = isEip1559Network ? "eip1559" : "legacy";
    }
  }
  if (parameters.includes("fees")) {
    if (request.type !== "legacy" && request.type !== "eip2930") {
      if (typeof request.maxFeePerGas === "undefined" || typeof request.maxPriorityFeePerGas === "undefined") {
        const block2 = await getBlock2();
        const { maxFeePerGas, maxPriorityFeePerGas } = await internal_estimateFeesPerGas(client, {
          block: block2,
          chain,
          request
        });
        if (typeof args.maxPriorityFeePerGas === "undefined" && args.maxFeePerGas && args.maxFeePerGas < maxPriorityFeePerGas)
          throw new MaxFeePerGasTooLowError({
            maxPriorityFeePerGas
          });
        request.maxPriorityFeePerGas = maxPriorityFeePerGas;
        request.maxFeePerGas = maxFeePerGas;
      }
    } else {
      if (typeof args.maxFeePerGas !== "undefined" || typeof args.maxPriorityFeePerGas !== "undefined")
        throw new Eip1559FeesNotSupportedError();
      if (typeof args.gasPrice === "undefined") {
        const block2 = await getBlock2();
        const { gasPrice: gasPrice_ } = await internal_estimateFeesPerGas(client, {
          block: block2,
          chain,
          request,
          type: "legacy"
        });
        request.gasPrice = gasPrice_;
      }
    }
  }
  if (parameters.includes("gas") && typeof gas === "undefined")
    request.gas = await getAction(client, estimateGas, "estimateGas")({
      ...request,
      account: account ? { address: account.address, type: "json-rpc" } : account
    });
  assertRequest(request);
  delete request.parameters;
  return request;
}
__name(prepareTransactionRequest, "prepareTransactionRequest");

// node_modules/viem/_esm/actions/public/getBalance.js
init_checked_fetch();
init_modules_watch_stub();
init_toHex();
async function getBalance(client, { address, blockNumber, blockTag = client.experimental_blockTag ?? "latest" }) {
  const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
  const balance = await client.request({
    method: "eth_getBalance",
    params: [address, blockNumberHex || blockTag]
  });
  return BigInt(balance);
}
__name(getBalance, "getBalance");

// node_modules/viem/_esm/actions/public/estimateGas.js
async function estimateGas(client, args) {
  const { account: account_ = client.account } = args;
  const account = account_ ? parseAccount(account_) : void 0;
  try {
    let estimateGas_rpc = function(parameters) {
      const { block: block2, request: request2, rpcStateOverride: rpcStateOverride2 } = parameters;
      return client.request({
        method: "eth_estimateGas",
        params: rpcStateOverride2 ? [
          request2,
          block2 ?? client.experimental_blockTag ?? "latest",
          rpcStateOverride2
        ] : block2 ? [request2, block2] : [request2]
      });
    };
    __name(estimateGas_rpc, "estimateGas_rpc");
    const { accessList, authorizationList, blobs, blobVersionedHashes, blockNumber, blockTag, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, value, stateOverride, ...rest } = await prepareTransactionRequest(client, {
      ...args,
      parameters: (
        // Some RPC Providers do not compute versioned hashes from blobs. We will need
        // to compute them.
        account?.type === "local" ? void 0 : ["blobVersionedHashes"]
      )
    });
    const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
    const block = blockNumberHex || blockTag;
    const rpcStateOverride = serializeStateOverride(stateOverride);
    const to = await (async () => {
      if (rest.to)
        return rest.to;
      if (authorizationList && authorizationList.length > 0)
        return await recoverAuthorizationAddress({
          authorization: authorizationList[0]
        }).catch(() => {
          throw new BaseError2("`to` is required. Could not infer from `authorizationList`");
        });
      return void 0;
    })();
    assertRequest(args);
    const chainFormat = client.chain?.formatters?.transactionRequest?.format;
    const format = chainFormat || formatTransactionRequest;
    const request = format({
      // Pick out extra data that might exist on the chain's transaction request type.
      ...extract(rest, { format: chainFormat }),
      from: account?.address,
      accessList,
      authorizationList,
      blobs,
      blobVersionedHashes,
      data,
      gas,
      gasPrice,
      maxFeePerBlobGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      to,
      value
    });
    let estimate = BigInt(await estimateGas_rpc({ block, request, rpcStateOverride }));
    if (authorizationList) {
      const value2 = await getBalance(client, { address: request.from });
      const estimates = await Promise.all(authorizationList.map(async (authorization) => {
        const { address } = authorization;
        const estimate2 = await estimateGas_rpc({
          block,
          request: {
            authorizationList: void 0,
            data,
            from: account?.address,
            to: address,
            value: numberToHex(value2)
          },
          rpcStateOverride
        }).catch(() => 100000n);
        return 2n * BigInt(estimate2);
      }));
      estimate += estimates.reduce((acc, curr) => acc + curr, 0n);
    }
    return estimate;
  } catch (err) {
    throw getEstimateGasError(err, {
      ...args,
      account,
      chain: client.chain
    });
  }
}
__name(estimateGas, "estimateGas");

// node_modules/viem/_esm/actions/public/estimateContractGas.js
async function estimateContractGas(client, parameters) {
  const { abi: abi2, address, args, functionName, dataSuffix, ...request } = parameters;
  const data = encodeFunctionData({
    abi: abi2,
    args,
    functionName
  });
  try {
    const gas = await getAction(client, estimateGas, "estimateGas")({
      data: `${data}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
      to: address,
      ...request
    });
    return gas;
  } catch (error) {
    const account = request.account ? parseAccount(request.account) : void 0;
    throw getContractError(error, {
      abi: abi2,
      address,
      args,
      docsPath: "/docs/contract/estimateContractGas",
      functionName,
      sender: account?.address
    });
  }
}
__name(estimateContractGas, "estimateContractGas");

// node_modules/viem/_esm/actions/public/getContractEvents.js
init_checked_fetch();
init_modules_watch_stub();
init_getAbiItem();

// node_modules/viem/_esm/actions/public/getLogs.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/utils/abi/parseEventLogs.js
init_checked_fetch();
init_modules_watch_stub();
init_abi();
init_isAddressEqual();
init_toBytes();
init_keccak256();
init_toEventSelector();

// node_modules/viem/_esm/utils/abi/decodeEventLog.js
init_checked_fetch();
init_modules_watch_stub();
init_abi();
init_size();
init_toEventSelector();
init_cursor();
init_decodeAbiParameters();
init_formatAbiItem2();
var docsPath3 = "/docs/contract/decodeEventLog";
function decodeEventLog(parameters) {
  const { abi: abi2, data, strict: strict_, topics } = parameters;
  const strict = strict_ ?? true;
  const [signature, ...argTopics] = topics;
  if (!signature)
    throw new AbiEventSignatureEmptyTopicsError({ docsPath: docsPath3 });
  const abiItem = abi2.find((x) => x.type === "event" && signature === toEventSelector(formatAbiItem2(x)));
  if (!(abiItem && "name" in abiItem) || abiItem.type !== "event")
    throw new AbiEventSignatureNotFoundError(signature, { docsPath: docsPath3 });
  const { name, inputs } = abiItem;
  const isUnnamed = inputs?.some((x) => !("name" in x && x.name));
  const args = isUnnamed ? [] : {};
  const indexedInputs = inputs.map((x, i) => [x, i]).filter(([x]) => "indexed" in x && x.indexed);
  for (let i = 0; i < indexedInputs.length; i++) {
    const [param, argIndex] = indexedInputs[i];
    const topic = argTopics[i];
    if (!topic)
      throw new DecodeLogTopicsMismatch({
        abiItem,
        param
      });
    args[isUnnamed ? argIndex : param.name || argIndex] = decodeTopic({
      param,
      value: topic
    });
  }
  const nonIndexedInputs = inputs.filter((x) => !("indexed" in x && x.indexed));
  if (nonIndexedInputs.length > 0) {
    if (data && data !== "0x") {
      try {
        const decodedData = decodeAbiParameters(nonIndexedInputs, data);
        if (decodedData) {
          if (isUnnamed)
            for (let i = 0; i < inputs.length; i++)
              args[i] = args[i] ?? decodedData.shift();
          else
            for (let i = 0; i < nonIndexedInputs.length; i++)
              args[nonIndexedInputs[i].name] = decodedData[i];
        }
      } catch (err) {
        if (strict) {
          if (err instanceof AbiDecodingDataSizeTooSmallError || err instanceof PositionOutOfBoundsError)
            throw new DecodeLogDataMismatch({
              abiItem,
              data,
              params: nonIndexedInputs,
              size: size(data)
            });
          throw err;
        }
      }
    } else if (strict) {
      throw new DecodeLogDataMismatch({
        abiItem,
        data: "0x",
        params: nonIndexedInputs,
        size: 0
      });
    }
  }
  return {
    eventName: name,
    args: Object.values(args).length > 0 ? args : void 0
  };
}
__name(decodeEventLog, "decodeEventLog");
function decodeTopic({ param, value }) {
  if (param.type === "string" || param.type === "bytes" || param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/))
    return value;
  const decodedArg = decodeAbiParameters([param], value) || [];
  return decodedArg[0];
}
__name(decodeTopic, "decodeTopic");

// node_modules/viem/_esm/utils/abi/parseEventLogs.js
function parseEventLogs(parameters) {
  const { abi: abi2, args, logs, strict = true } = parameters;
  const eventName = (() => {
    if (!parameters.eventName)
      return void 0;
    if (Array.isArray(parameters.eventName))
      return parameters.eventName;
    return [parameters.eventName];
  })();
  return logs.map((log) => {
    try {
      const abiItem = abi2.find((abiItem2) => abiItem2.type === "event" && log.topics[0] === toEventSelector(abiItem2));
      if (!abiItem)
        return null;
      const event = decodeEventLog({
        ...log,
        abi: [abiItem],
        strict
      });
      if (eventName && !eventName.includes(event.eventName))
        return null;
      if (!includesArgs({
        args: event.args,
        inputs: abiItem.inputs,
        matchArgs: args
      }))
        return null;
      return { ...event, ...log };
    } catch (err) {
      let eventName2;
      let isUnnamed;
      if (err instanceof AbiEventSignatureNotFoundError)
        return null;
      if (err instanceof DecodeLogDataMismatch || err instanceof DecodeLogTopicsMismatch) {
        if (strict)
          return null;
        eventName2 = err.abiItem.name;
        isUnnamed = err.abiItem.inputs?.some((x) => !("name" in x && x.name));
      }
      return { ...log, args: isUnnamed ? [] : {}, eventName: eventName2 };
    }
  }).filter(Boolean);
}
__name(parseEventLogs, "parseEventLogs");
function includesArgs(parameters) {
  const { args, inputs, matchArgs } = parameters;
  if (!matchArgs)
    return true;
  if (!args)
    return false;
  function isEqual(input, value, arg) {
    try {
      if (input.type === "address")
        return isAddressEqual(value, arg);
      if (input.type === "string" || input.type === "bytes")
        return keccak256(toBytes(value)) === arg;
      return value === arg;
    } catch {
      return false;
    }
  }
  __name(isEqual, "isEqual");
  if (Array.isArray(args) && Array.isArray(matchArgs)) {
    return matchArgs.every((value, index2) => {
      if (value === null || value === void 0)
        return true;
      const input = inputs[index2];
      if (!input)
        return false;
      const value_ = Array.isArray(value) ? value : [value];
      return value_.some((value2) => isEqual(input, value2, args[index2]));
    });
  }
  if (typeof args === "object" && !Array.isArray(args) && typeof matchArgs === "object" && !Array.isArray(matchArgs))
    return Object.entries(matchArgs).every(([key, value]) => {
      if (value === null || value === void 0)
        return true;
      const input = inputs.find((input2) => input2.name === key);
      if (!input)
        return false;
      const value_ = Array.isArray(value) ? value : [value];
      return value_.some((value2) => isEqual(input, value2, args[key]));
    });
  return false;
}
__name(includesArgs, "includesArgs");

// node_modules/viem/_esm/actions/public/getLogs.js
init_toHex();

// node_modules/viem/_esm/utils/formatters/log.js
init_checked_fetch();
init_modules_watch_stub();
function formatLog(log, { args, eventName } = {}) {
  return {
    ...log,
    blockHash: log.blockHash ? log.blockHash : null,
    blockNumber: log.blockNumber ? BigInt(log.blockNumber) : null,
    logIndex: log.logIndex ? Number(log.logIndex) : null,
    transactionHash: log.transactionHash ? log.transactionHash : null,
    transactionIndex: log.transactionIndex ? Number(log.transactionIndex) : null,
    ...eventName ? { args, eventName } : {}
  };
}
__name(formatLog, "formatLog");

// node_modules/viem/_esm/actions/public/getLogs.js
async function getLogs(client, { address, blockHash, fromBlock, toBlock, event, events: events_, args, strict: strict_ } = {}) {
  const strict = strict_ ?? false;
  const events = events_ ?? (event ? [event] : void 0);
  let topics = [];
  if (events) {
    const encoded = events.flatMap((event2) => encodeEventTopics({
      abi: [event2],
      eventName: event2.name,
      args: events_ ? void 0 : args
    }));
    topics = [encoded];
    if (event)
      topics = topics[0];
  }
  let logs;
  if (blockHash) {
    logs = await client.request({
      method: "eth_getLogs",
      params: [{ address, topics, blockHash }]
    });
  } else {
    logs = await client.request({
      method: "eth_getLogs",
      params: [
        {
          address,
          topics,
          fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
          toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock
        }
      ]
    });
  }
  const formattedLogs = logs.map((log) => formatLog(log));
  if (!events)
    return formattedLogs;
  return parseEventLogs({
    abi: events,
    args,
    logs: formattedLogs,
    strict
  });
}
__name(getLogs, "getLogs");

// node_modules/viem/_esm/actions/public/getContractEvents.js
async function getContractEvents(client, parameters) {
  const { abi: abi2, address, args, blockHash, eventName, fromBlock, toBlock, strict } = parameters;
  const event = eventName ? getAbiItem({ abi: abi2, name: eventName }) : void 0;
  const events = !event ? abi2.filter((x) => x.type === "event") : void 0;
  return getAction(client, getLogs, "getLogs")({
    address,
    args,
    blockHash,
    event,
    events,
    fromBlock,
    toBlock,
    strict
  });
}
__name(getContractEvents, "getContractEvents");

// node_modules/viem/_esm/actions/public/readContract.js
init_checked_fetch();
init_modules_watch_stub();
init_decodeFunctionResult();
init_encodeFunctionData();
init_call();
async function readContract(client, parameters) {
  const { abi: abi2, address, args, functionName, ...rest } = parameters;
  const calldata = encodeFunctionData({
    abi: abi2,
    args,
    functionName
  });
  try {
    const { data } = await getAction(client, call, "call")({
      ...rest,
      data: calldata,
      to: address
    });
    return decodeFunctionResult({
      abi: abi2,
      args,
      functionName,
      data: data || "0x"
    });
  } catch (error) {
    throw getContractError(error, {
      abi: abi2,
      address,
      args,
      docsPath: "/docs/contract/readContract",
      functionName
    });
  }
}
__name(readContract, "readContract");

// node_modules/viem/_esm/actions/public/simulateContract.js
init_checked_fetch();
init_modules_watch_stub();
init_parseAccount();
init_decodeFunctionResult();
init_encodeFunctionData();
init_call();
async function simulateContract(client, parameters) {
  const { abi: abi2, address, args, dataSuffix, functionName, ...callRequest } = parameters;
  const account = callRequest.account ? parseAccount(callRequest.account) : client.account;
  const calldata = encodeFunctionData({ abi: abi2, args, functionName });
  try {
    const { data } = await getAction(client, call, "call")({
      batch: false,
      data: `${calldata}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
      to: address,
      ...callRequest,
      account
    });
    const result = decodeFunctionResult({
      abi: abi2,
      args,
      functionName,
      data: data || "0x"
    });
    const minimizedAbi = abi2.filter((abiItem) => "name" in abiItem && abiItem.name === parameters.functionName);
    return {
      result,
      request: {
        abi: minimizedAbi,
        address,
        args,
        dataSuffix,
        functionName,
        ...callRequest,
        account
      }
    };
  } catch (error) {
    throw getContractError(error, {
      abi: abi2,
      address,
      args,
      docsPath: "/docs/contract/simulateContract",
      functionName,
      sender: account?.address
    });
  }
}
__name(simulateContract, "simulateContract");

// node_modules/viem/_esm/actions/public/watchContractEvent.js
init_checked_fetch();
init_modules_watch_stub();
init_abi();
init_rpc();

// node_modules/viem/_esm/utils/observe.js
init_checked_fetch();
init_modules_watch_stub();
var listenersCache = /* @__PURE__ */ new Map();
var cleanupCache = /* @__PURE__ */ new Map();
var callbackCount = 0;
function observe(observerId, callbacks, fn) {
  const callbackId = ++callbackCount;
  const getListeners = /* @__PURE__ */ __name(() => listenersCache.get(observerId) || [], "getListeners");
  const unsubscribe = /* @__PURE__ */ __name(() => {
    const listeners2 = getListeners();
    listenersCache.set(observerId, listeners2.filter((cb) => cb.id !== callbackId));
  }, "unsubscribe");
  const unwatch = /* @__PURE__ */ __name(() => {
    const listeners2 = getListeners();
    if (!listeners2.some((cb) => cb.id === callbackId))
      return;
    const cleanup2 = cleanupCache.get(observerId);
    if (listeners2.length === 1 && cleanup2) {
      const p = cleanup2();
      if (p instanceof Promise)
        p.catch(() => {
        });
    }
    unsubscribe();
  }, "unwatch");
  const listeners = getListeners();
  listenersCache.set(observerId, [
    ...listeners,
    { id: callbackId, fns: callbacks }
  ]);
  if (listeners && listeners.length > 0)
    return unwatch;
  const emit = {};
  for (const key in callbacks) {
    emit[key] = (...args) => {
      const listeners2 = getListeners();
      if (listeners2.length === 0)
        return;
      for (const listener of listeners2)
        listener.fns[key]?.(...args);
    };
  }
  const cleanup = fn(emit);
  if (typeof cleanup === "function")
    cleanupCache.set(observerId, cleanup);
  return unwatch;
}
__name(observe, "observe");

// node_modules/viem/_esm/utils/poll.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/utils/wait.js
init_checked_fetch();
init_modules_watch_stub();
async function wait(time) {
  return new Promise((res) => setTimeout(res, time));
}
__name(wait, "wait");

// node_modules/viem/_esm/utils/poll.js
function poll(fn, { emitOnBegin, initialWaitTime, interval }) {
  let active = true;
  const unwatch = /* @__PURE__ */ __name(() => active = false, "unwatch");
  const watch = /* @__PURE__ */ __name(async () => {
    let data = void 0;
    if (emitOnBegin)
      data = await fn({ unpoll: unwatch });
    const initialWait = await initialWaitTime?.(data) ?? interval;
    await wait(initialWait);
    const poll2 = /* @__PURE__ */ __name(async () => {
      if (!active)
        return;
      await fn({ unpoll: unwatch });
      await wait(interval);
      poll2();
    }, "poll");
    poll2();
  }, "watch");
  watch();
  return unwatch;
}
__name(poll, "poll");

// node_modules/viem/_esm/actions/public/watchContractEvent.js
init_stringify();

// node_modules/viem/_esm/actions/public/getBlockNumber.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/utils/promise/withCache.js
init_checked_fetch();
init_modules_watch_stub();
var promiseCache = /* @__PURE__ */ new Map();
var responseCache = /* @__PURE__ */ new Map();
function getCache(cacheKey2) {
  const buildCache = /* @__PURE__ */ __name((cacheKey3, cache) => ({
    clear: /* @__PURE__ */ __name(() => cache.delete(cacheKey3), "clear"),
    get: /* @__PURE__ */ __name(() => cache.get(cacheKey3), "get"),
    set: /* @__PURE__ */ __name((data) => cache.set(cacheKey3, data), "set")
  }), "buildCache");
  const promise = buildCache(cacheKey2, promiseCache);
  const response = buildCache(cacheKey2, responseCache);
  return {
    clear: /* @__PURE__ */ __name(() => {
      promise.clear();
      response.clear();
    }, "clear"),
    promise,
    response
  };
}
__name(getCache, "getCache");
async function withCache(fn, { cacheKey: cacheKey2, cacheTime = Number.POSITIVE_INFINITY }) {
  const cache = getCache(cacheKey2);
  const response = cache.response.get();
  if (response && cacheTime > 0) {
    const age = (/* @__PURE__ */ new Date()).getTime() - response.created.getTime();
    if (age < cacheTime)
      return response.data;
  }
  let promise = cache.promise.get();
  if (!promise) {
    promise = fn();
    cache.promise.set(promise);
  }
  try {
    const data = await promise;
    cache.response.set({ created: /* @__PURE__ */ new Date(), data });
    return data;
  } finally {
    cache.promise.clear();
  }
}
__name(withCache, "withCache");

// node_modules/viem/_esm/actions/public/getBlockNumber.js
var cacheKey = /* @__PURE__ */ __name((id) => `blockNumber.${id}`, "cacheKey");
async function getBlockNumber(client, { cacheTime = client.cacheTime } = {}) {
  const blockNumberHex = await withCache(() => client.request({
    method: "eth_blockNumber"
  }), { cacheKey: cacheKey(client.uid), cacheTime });
  return BigInt(blockNumberHex);
}
__name(getBlockNumber, "getBlockNumber");

// node_modules/viem/_esm/actions/public/getFilterChanges.js
init_checked_fetch();
init_modules_watch_stub();
async function getFilterChanges(_client, { filter }) {
  const strict = "strict" in filter && filter.strict;
  const logs = await filter.request({
    method: "eth_getFilterChanges",
    params: [filter.id]
  });
  if (typeof logs[0] === "string")
    return logs;
  const formattedLogs = logs.map((log) => formatLog(log));
  if (!("abi" in filter) || !filter.abi)
    return formattedLogs;
  return parseEventLogs({
    abi: filter.abi,
    logs: formattedLogs,
    strict
  });
}
__name(getFilterChanges, "getFilterChanges");

// node_modules/viem/_esm/actions/public/uninstallFilter.js
init_checked_fetch();
init_modules_watch_stub();
async function uninstallFilter(_client, { filter }) {
  return filter.request({
    method: "eth_uninstallFilter",
    params: [filter.id]
  });
}
__name(uninstallFilter, "uninstallFilter");

// node_modules/viem/_esm/actions/public/watchContractEvent.js
function watchContractEvent(client, parameters) {
  const { abi: abi2, address, args, batch = true, eventName, fromBlock, onError, onLogs, poll: poll_, pollingInterval = client.pollingInterval, strict: strict_ } = parameters;
  const enablePolling = (() => {
    if (typeof poll_ !== "undefined")
      return poll_;
    if (typeof fromBlock === "bigint")
      return true;
    if (client.transport.type === "webSocket" || client.transport.type === "ipc")
      return false;
    if (client.transport.type === "fallback" && (client.transport.transports[0].config.type === "webSocket" || client.transport.transports[0].config.type === "ipc"))
      return false;
    return true;
  })();
  const pollContractEvent = /* @__PURE__ */ __name(() => {
    const strict = strict_ ?? false;
    const observerId = stringify([
      "watchContractEvent",
      address,
      args,
      batch,
      client.uid,
      eventName,
      pollingInterval,
      strict,
      fromBlock
    ]);
    return observe(observerId, { onLogs, onError }, (emit) => {
      let previousBlockNumber;
      if (fromBlock !== void 0)
        previousBlockNumber = fromBlock - 1n;
      let filter;
      let initialized = false;
      const unwatch = poll(async () => {
        if (!initialized) {
          try {
            filter = await getAction(client, createContractEventFilter, "createContractEventFilter")({
              abi: abi2,
              address,
              args,
              eventName,
              strict,
              fromBlock
            });
          } catch {
          }
          initialized = true;
          return;
        }
        try {
          let logs;
          if (filter) {
            logs = await getAction(client, getFilterChanges, "getFilterChanges")({ filter });
          } else {
            const blockNumber = await getAction(client, getBlockNumber, "getBlockNumber")({});
            if (previousBlockNumber && previousBlockNumber < blockNumber) {
              logs = await getAction(client, getContractEvents, "getContractEvents")({
                abi: abi2,
                address,
                args,
                eventName,
                fromBlock: previousBlockNumber + 1n,
                toBlock: blockNumber,
                strict
              });
            } else {
              logs = [];
            }
            previousBlockNumber = blockNumber;
          }
          if (logs.length === 0)
            return;
          if (batch)
            emit.onLogs(logs);
          else
            for (const log of logs)
              emit.onLogs([log]);
        } catch (err) {
          if (filter && err instanceof InvalidInputRpcError)
            initialized = false;
          emit.onError?.(err);
        }
      }, {
        emitOnBegin: true,
        interval: pollingInterval
      });
      return async () => {
        if (filter)
          await getAction(client, uninstallFilter, "uninstallFilter")({ filter });
        unwatch();
      };
    });
  }, "pollContractEvent");
  const subscribeContractEvent = /* @__PURE__ */ __name(() => {
    const strict = strict_ ?? false;
    const observerId = stringify([
      "watchContractEvent",
      address,
      args,
      batch,
      client.uid,
      eventName,
      pollingInterval,
      strict
    ]);
    let active = true;
    let unsubscribe = /* @__PURE__ */ __name(() => active = false, "unsubscribe");
    return observe(observerId, { onLogs, onError }, (emit) => {
      ;
      (async () => {
        try {
          const transport = (() => {
            if (client.transport.type === "fallback") {
              const transport2 = client.transport.transports.find((transport3) => transport3.config.type === "webSocket" || transport3.config.type === "ipc");
              if (!transport2)
                return client.transport;
              return transport2.value;
            }
            return client.transport;
          })();
          const topics = eventName ? encodeEventTopics({
            abi: abi2,
            eventName,
            args
          }) : [];
          const { unsubscribe: unsubscribe_ } = await transport.subscribe({
            params: ["logs", { address, topics }],
            onData(data) {
              if (!active)
                return;
              const log = data.result;
              try {
                const { eventName: eventName2, args: args2 } = decodeEventLog({
                  abi: abi2,
                  data: log.data,
                  topics: log.topics,
                  strict: strict_
                });
                const formatted = formatLog(log, {
                  args: args2,
                  eventName: eventName2
                });
                emit.onLogs([formatted]);
              } catch (err) {
                let eventName2;
                let isUnnamed;
                if (err instanceof DecodeLogDataMismatch || err instanceof DecodeLogTopicsMismatch) {
                  if (strict_)
                    return;
                  eventName2 = err.abiItem.name;
                  isUnnamed = err.abiItem.inputs?.some((x) => !("name" in x && x.name));
                }
                const formatted = formatLog(log, {
                  args: isUnnamed ? [] : {},
                  eventName: eventName2
                });
                emit.onLogs([formatted]);
              }
            },
            onError(error) {
              emit.onError?.(error);
            }
          });
          unsubscribe = unsubscribe_;
          if (!active)
            unsubscribe();
        } catch (err) {
          onError?.(err);
        }
      })();
      return () => unsubscribe();
    });
  }, "subscribeContractEvent");
  return enablePolling ? pollContractEvent() : subscribeContractEvent();
}
__name(watchContractEvent, "watchContractEvent");

// node_modules/viem/_esm/actions/wallet/writeContract.js
init_checked_fetch();
init_modules_watch_stub();
init_parseAccount();

// node_modules/viem/_esm/errors/account.js
init_checked_fetch();
init_modules_watch_stub();
init_base();
var AccountNotFoundError = class extends BaseError2 {
  static {
    __name(this, "AccountNotFoundError");
  }
  constructor({ docsPath: docsPath8 } = {}) {
    super([
      "Could not find an Account to execute with this Action.",
      "Please provide an Account with the `account` argument on the Action, or by supplying an `account` to the Client."
    ].join("\n"), {
      docsPath: docsPath8,
      docsSlug: "account",
      name: "AccountNotFoundError"
    });
  }
};
var AccountTypeNotSupportedError = class extends BaseError2 {
  static {
    __name(this, "AccountTypeNotSupportedError");
  }
  constructor({ docsPath: docsPath8, metaMessages, type }) {
    super(`Account type "${type}" is not supported.`, {
      docsPath: docsPath8,
      metaMessages,
      name: "AccountTypeNotSupportedError"
    });
  }
};

// node_modules/viem/_esm/actions/wallet/writeContract.js
init_encodeFunctionData();

// node_modules/viem/_esm/actions/wallet/sendTransaction.js
init_checked_fetch();
init_modules_watch_stub();
init_parseAccount();
init_base();

// node_modules/viem/_esm/utils/chain/assertCurrentChain.js
init_checked_fetch();
init_modules_watch_stub();
init_chain();
function assertCurrentChain({ chain, currentChainId }) {
  if (!chain)
    throw new ChainNotFoundError();
  if (currentChainId !== chain.id)
    throw new ChainMismatchError({ chain, currentChainId });
}
__name(assertCurrentChain, "assertCurrentChain");

// node_modules/viem/_esm/utils/errors/getTransactionError.js
init_checked_fetch();
init_modules_watch_stub();
init_node();
init_transaction();
init_getNodeError();
function getTransactionError(err, { docsPath: docsPath8, ...args }) {
  const cause = (() => {
    const cause2 = getNodeError(err, args);
    if (cause2 instanceof UnknownNodeError)
      return err;
    return cause2;
  })();
  return new TransactionExecutionError(cause, {
    docsPath: docsPath8,
    ...args
  });
}
__name(getTransactionError, "getTransactionError");

// node_modules/viem/_esm/actions/wallet/sendTransaction.js
init_extract();
init_transactionRequest();
init_lru();
init_assertRequest();

// node_modules/viem/_esm/actions/wallet/sendRawTransaction.js
init_checked_fetch();
init_modules_watch_stub();
async function sendRawTransaction(client, { serializedTransaction }) {
  return client.request({
    method: "eth_sendRawTransaction",
    params: [serializedTransaction]
  }, { retryCount: 0 });
}
__name(sendRawTransaction, "sendRawTransaction");

// node_modules/viem/_esm/actions/wallet/sendTransaction.js
var supportsWalletNamespace = new LruMap(128);
async function sendTransaction(client, parameters) {
  const { account: account_ = client.account, chain = client.chain, accessList, authorizationList, blobs, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, type, value, ...rest } = parameters;
  if (typeof account_ === "undefined")
    throw new AccountNotFoundError({
      docsPath: "/docs/actions/wallet/sendTransaction"
    });
  const account = account_ ? parseAccount(account_) : null;
  try {
    assertRequest(parameters);
    const to = await (async () => {
      if (parameters.to)
        return parameters.to;
      if (parameters.to === null)
        return void 0;
      if (authorizationList && authorizationList.length > 0)
        return await recoverAuthorizationAddress({
          authorization: authorizationList[0]
        }).catch(() => {
          throw new BaseError2("`to` is required. Could not infer from `authorizationList`.");
        });
      return void 0;
    })();
    if (account?.type === "json-rpc" || account === null) {
      let chainId;
      if (chain !== null) {
        chainId = await getAction(client, getChainId, "getChainId")({});
        assertCurrentChain({
          currentChainId: chainId,
          chain
        });
      }
      const chainFormat = client.chain?.formatters?.transactionRequest?.format;
      const format = chainFormat || formatTransactionRequest;
      const request = format({
        // Pick out extra data that might exist on the chain's transaction request type.
        ...extract(rest, { format: chainFormat }),
        accessList,
        authorizationList,
        blobs,
        chainId,
        data,
        from: account?.address,
        gas,
        gasPrice,
        maxFeePerBlobGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        to,
        type,
        value
      });
      const isWalletNamespaceSupported = supportsWalletNamespace.get(client.uid);
      const method = isWalletNamespaceSupported ? "wallet_sendTransaction" : "eth_sendTransaction";
      try {
        return await client.request({
          method,
          params: [request]
        }, { retryCount: 0 });
      } catch (e) {
        if (isWalletNamespaceSupported === false)
          throw e;
        const error = e;
        if (error.name === "InvalidInputRpcError" || error.name === "InvalidParamsRpcError" || error.name === "MethodNotFoundRpcError" || error.name === "MethodNotSupportedRpcError") {
          return await client.request({
            method: "wallet_sendTransaction",
            params: [request]
          }, { retryCount: 0 }).then((hash2) => {
            supportsWalletNamespace.set(client.uid, true);
            return hash2;
          }).catch((e2) => {
            const walletNamespaceError = e2;
            if (walletNamespaceError.name === "MethodNotFoundRpcError" || walletNamespaceError.name === "MethodNotSupportedRpcError") {
              supportsWalletNamespace.set(client.uid, false);
              throw error;
            }
            throw walletNamespaceError;
          });
        }
        throw error;
      }
    }
    if (account?.type === "local") {
      const request = await getAction(client, prepareTransactionRequest, "prepareTransactionRequest")({
        account,
        accessList,
        authorizationList,
        blobs,
        chain,
        data,
        gas,
        gasPrice,
        maxFeePerBlobGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        nonceManager: account.nonceManager,
        parameters: [...defaultParameters, "sidecars"],
        type,
        value,
        ...rest,
        to
      });
      const serializer = chain?.serializers?.transaction;
      const serializedTransaction = await account.signTransaction(request, {
        serializer
      });
      return await getAction(client, sendRawTransaction, "sendRawTransaction")({
        serializedTransaction
      });
    }
    if (account?.type === "smart")
      throw new AccountTypeNotSupportedError({
        metaMessages: [
          "Consider using the `sendUserOperation` Action instead."
        ],
        docsPath: "/docs/actions/bundler/sendUserOperation",
        type: "smart"
      });
    throw new AccountTypeNotSupportedError({
      docsPath: "/docs/actions/wallet/sendTransaction",
      type: account?.type
    });
  } catch (err) {
    if (err instanceof AccountTypeNotSupportedError)
      throw err;
    throw getTransactionError(err, {
      ...parameters,
      account,
      chain: parameters.chain || void 0
    });
  }
}
__name(sendTransaction, "sendTransaction");

// node_modules/viem/_esm/actions/wallet/writeContract.js
async function writeContract(client, parameters) {
  const { abi: abi2, account: account_ = client.account, address, args, dataSuffix, functionName, ...request } = parameters;
  if (typeof account_ === "undefined")
    throw new AccountNotFoundError({
      docsPath: "/docs/contract/writeContract"
    });
  const account = account_ ? parseAccount(account_) : null;
  const data = encodeFunctionData({
    abi: abi2,
    args,
    functionName
  });
  try {
    return await getAction(client, sendTransaction, "sendTransaction")({
      data: `${data}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
      to: address,
      account,
      ...request
    });
  } catch (error) {
    throw getContractError(error, {
      abi: abi2,
      address,
      args,
      docsPath: "/docs/contract/writeContract",
      functionName,
      sender: account?.address
    });
  }
}
__name(writeContract, "writeContract");

// node_modules/viem/_esm/actions/wallet/waitForCallsStatus.js
init_checked_fetch();
init_modules_watch_stub();
init_base();
init_withResolvers();
init_stringify();

// node_modules/viem/_esm/actions/wallet/getCallsStatus.js
init_checked_fetch();
init_modules_watch_stub();
init_slice();
init_trim();
init_fromHex();

// node_modules/viem/_esm/utils/formatters/transactionReceipt.js
init_checked_fetch();
init_modules_watch_stub();
init_fromHex();
var receiptStatuses = {
  "0x0": "reverted",
  "0x1": "success"
};
function formatTransactionReceipt(transactionReceipt) {
  const receipt = {
    ...transactionReceipt,
    blockNumber: transactionReceipt.blockNumber ? BigInt(transactionReceipt.blockNumber) : null,
    contractAddress: transactionReceipt.contractAddress ? transactionReceipt.contractAddress : null,
    cumulativeGasUsed: transactionReceipt.cumulativeGasUsed ? BigInt(transactionReceipt.cumulativeGasUsed) : null,
    effectiveGasPrice: transactionReceipt.effectiveGasPrice ? BigInt(transactionReceipt.effectiveGasPrice) : null,
    gasUsed: transactionReceipt.gasUsed ? BigInt(transactionReceipt.gasUsed) : null,
    logs: transactionReceipt.logs ? transactionReceipt.logs.map((log) => formatLog(log)) : null,
    to: transactionReceipt.to ? transactionReceipt.to : null,
    transactionIndex: transactionReceipt.transactionIndex ? hexToNumber(transactionReceipt.transactionIndex) : null,
    status: transactionReceipt.status ? receiptStatuses[transactionReceipt.status] : null,
    type: transactionReceipt.type ? transactionType[transactionReceipt.type] || transactionReceipt.type : null
  };
  if (transactionReceipt.blobGasPrice)
    receipt.blobGasPrice = BigInt(transactionReceipt.blobGasPrice);
  if (transactionReceipt.blobGasUsed)
    receipt.blobGasUsed = BigInt(transactionReceipt.blobGasUsed);
  return receipt;
}
__name(formatTransactionReceipt, "formatTransactionReceipt");

// node_modules/viem/_esm/actions/wallet/sendCalls.js
init_checked_fetch();
init_modules_watch_stub();
init_parseAccount();
init_base();
init_rpc();
init_encodeFunctionData();
init_concat();
init_fromHex();
init_toHex();
var fallbackMagicIdentifier = "0x5792579257925792579257925792579257925792579257925792579257925792";
var fallbackTransactionErrorMagicIdentifier = numberToHex(0, {
  size: 32
});
async function sendCalls(client, parameters) {
  const { account: account_ = client.account, capabilities, chain = client.chain, experimental_fallback, experimental_fallbackDelay = 32, forceAtomic = false, id, version: version4 = "2.0.0" } = parameters;
  const account = account_ ? parseAccount(account_) : null;
  const calls = parameters.calls.map((call_) => {
    const call2 = call_;
    const data = call2.abi ? encodeFunctionData({
      abi: call2.abi,
      functionName: call2.functionName,
      args: call2.args
    }) : call2.data;
    return {
      data: call2.dataSuffix && data ? concat([data, call2.dataSuffix]) : data,
      to: call2.to,
      value: call2.value ? numberToHex(call2.value) : void 0
    };
  });
  try {
    const response = await client.request({
      method: "wallet_sendCalls",
      params: [
        {
          atomicRequired: forceAtomic,
          calls,
          capabilities,
          chainId: numberToHex(chain.id),
          from: account?.address,
          id,
          version: version4
        }
      ]
    }, { retryCount: 0 });
    if (typeof response === "string")
      return { id: response };
    return response;
  } catch (err) {
    const error = err;
    if (experimental_fallback && (error.name === "MethodNotFoundRpcError" || error.name === "MethodNotSupportedRpcError" || error.name === "UnknownRpcError" || error.details.toLowerCase().includes("does not exist / is not available") || error.details.toLowerCase().includes("missing or invalid. request()") || error.details.toLowerCase().includes("did not match any variant of untagged enum") || error.details.toLowerCase().includes("account upgraded to unsupported contract") || error.details.toLowerCase().includes("eip-7702 not supported") || error.details.toLowerCase().includes("unsupported wc_ method"))) {
      if (capabilities) {
        const hasNonOptionalCapability = Object.values(capabilities).some((capability) => !capability.optional);
        if (hasNonOptionalCapability) {
          const message = "non-optional `capabilities` are not supported on fallback to `eth_sendTransaction`.";
          throw new UnsupportedNonOptionalCapabilityError(new BaseError2(message, {
            details: message
          }));
        }
      }
      if (forceAtomic && calls.length > 1) {
        const message = "`forceAtomic` is not supported on fallback to `eth_sendTransaction`.";
        throw new AtomicityNotSupportedError(new BaseError2(message, {
          details: message
        }));
      }
      const promises = [];
      for (const call2 of calls) {
        const promise = sendTransaction(client, {
          account,
          chain,
          data: call2.data,
          to: call2.to,
          value: call2.value ? hexToBigInt(call2.value) : void 0
        });
        promises.push(promise);
        if (experimental_fallbackDelay > 0)
          await new Promise((resolve) => setTimeout(resolve, experimental_fallbackDelay));
      }
      const results = await Promise.allSettled(promises);
      if (results.every((r) => r.status === "rejected"))
        throw results[0].reason;
      const hashes = results.map((result) => {
        if (result.status === "fulfilled")
          return result.value;
        return fallbackTransactionErrorMagicIdentifier;
      });
      return {
        id: concat([
          ...hashes,
          numberToHex(chain.id, { size: 32 }),
          fallbackMagicIdentifier
        ])
      };
    }
    throw getTransactionError(err, {
      ...parameters,
      account,
      chain: parameters.chain
    });
  }
}
__name(sendCalls, "sendCalls");

// node_modules/viem/_esm/actions/wallet/getCallsStatus.js
async function getCallsStatus(client, parameters) {
  async function getStatus(id) {
    const isTransactions = id.endsWith(fallbackMagicIdentifier.slice(2));
    if (isTransactions) {
      const chainId2 = trim(sliceHex(id, -64, -32));
      const hashes = sliceHex(id, 0, -64).slice(2).match(/.{1,64}/g);
      const receipts2 = await Promise.all(hashes.map((hash2) => fallbackTransactionErrorMagicIdentifier.slice(2) !== hash2 ? client.request({
        method: "eth_getTransactionReceipt",
        params: [`0x${hash2}`]
      }, { dedupe: true }) : void 0));
      const status2 = (() => {
        if (receipts2.some((r) => r === null))
          return 100;
        if (receipts2.every((r) => r?.status === "0x1"))
          return 200;
        if (receipts2.every((r) => r?.status === "0x0"))
          return 500;
        return 600;
      })();
      return {
        atomic: false,
        chainId: hexToNumber(chainId2),
        receipts: receipts2.filter(Boolean),
        status: status2,
        version: "2.0.0"
      };
    }
    return client.request({
      method: "wallet_getCallsStatus",
      params: [id]
    });
  }
  __name(getStatus, "getStatus");
  const { atomic = false, chainId, receipts, version: version4 = "2.0.0", ...response } = await getStatus(parameters.id);
  const [status, statusCode] = (() => {
    const statusCode2 = response.status;
    if (statusCode2 >= 100 && statusCode2 < 200)
      return ["pending", statusCode2];
    if (statusCode2 >= 200 && statusCode2 < 300)
      return ["success", statusCode2];
    if (statusCode2 >= 300 && statusCode2 < 700)
      return ["failure", statusCode2];
    if (statusCode2 === "CONFIRMED")
      return ["success", 200];
    if (statusCode2 === "PENDING")
      return ["pending", 100];
    return [void 0, statusCode2];
  })();
  return {
    ...response,
    atomic,
    // @ts-expect-error: for backwards compatibility
    chainId: chainId ? hexToNumber(chainId) : void 0,
    receipts: receipts?.map((receipt) => ({
      ...receipt,
      blockNumber: hexToBigInt(receipt.blockNumber),
      gasUsed: hexToBigInt(receipt.gasUsed),
      status: receiptStatuses[receipt.status]
    })) ?? [],
    statusCode,
    status,
    version: version4
  };
}
__name(getCallsStatus, "getCallsStatus");

// node_modules/viem/_esm/actions/wallet/waitForCallsStatus.js
async function waitForCallsStatus(client, parameters) {
  const { id, pollingInterval = client.pollingInterval, status = /* @__PURE__ */ __name(({ statusCode }) => statusCode >= 200, "status"), timeout = 6e4 } = parameters;
  const observerId = stringify(["waitForCallsStatus", client.uid, id]);
  const { promise, resolve, reject } = withResolvers();
  let timer = void 0;
  const unobserve = observe(observerId, { resolve, reject }, (emit) => {
    const unpoll = poll(async () => {
      const done = /* @__PURE__ */ __name((fn) => {
        clearTimeout(timer);
        unpoll();
        fn();
        unobserve();
      }, "done");
      try {
        const result = await getCallsStatus(client, { id });
        if (!status(result))
          return;
        done(() => emit.resolve(result));
      } catch (error) {
        done(() => emit.reject(error));
      }
    }, {
      interval: pollingInterval,
      emitOnBegin: true
    });
    return unpoll;
  });
  timer = timeout ? setTimeout(() => {
    unobserve();
    clearTimeout(timer);
    reject(new WaitForCallsStatusTimeoutError({ id }));
  }, timeout) : void 0;
  return await promise;
}
__name(waitForCallsStatus, "waitForCallsStatus");
var WaitForCallsStatusTimeoutError = class extends BaseError2 {
  static {
    __name(this, "WaitForCallsStatusTimeoutError");
  }
  constructor({ id }) {
    super(`Timed out while waiting for call bundle with id "${id}" to be confirmed.`, { name: "WaitForCallsStatusTimeoutError" });
  }
};

// node_modules/viem/_esm/clients/createClient.js
init_checked_fetch();
init_modules_watch_stub();
init_parseAccount();

// node_modules/viem/_esm/utils/uid.js
init_checked_fetch();
init_modules_watch_stub();
var size4 = 256;
var index = size4;
var buffer;
function uid(length = 11) {
  if (!buffer || index + length > size4 * 2) {
    buffer = "";
    index = 0;
    for (let i = 0; i < size4; i++) {
      buffer += (256 + Math.random() * 256 | 0).toString(16).substring(1);
    }
  }
  return buffer.substring(index, index++ + length);
}
__name(uid, "uid");

// node_modules/viem/_esm/clients/createClient.js
function createClient(parameters) {
  const { batch, chain, ccipRead, key = "base", name = "Base Client", type = "base" } = parameters;
  const experimental_blockTag = parameters.experimental_blockTag ?? (typeof chain?.experimental_preconfirmationTime === "number" ? "pending" : void 0);
  const blockTime = chain?.blockTime ?? 12e3;
  const defaultPollingInterval = Math.min(Math.max(Math.floor(blockTime / 2), 500), 4e3);
  const pollingInterval = parameters.pollingInterval ?? defaultPollingInterval;
  const cacheTime = parameters.cacheTime ?? pollingInterval;
  const account = parameters.account ? parseAccount(parameters.account) : void 0;
  const { config, request, value } = parameters.transport({
    chain,
    pollingInterval
  });
  const transport = { ...config, ...value };
  const client = {
    account,
    batch,
    cacheTime,
    ccipRead,
    chain,
    key,
    name,
    pollingInterval,
    request,
    transport,
    type,
    uid: uid(),
    ...experimental_blockTag ? { experimental_blockTag } : {}
  };
  function extend(base) {
    return (extendFn) => {
      const extended = extendFn(base);
      for (const key2 in client)
        delete extended[key2];
      const combined = { ...base, ...extended };
      return Object.assign(combined, { extend: extend(combined) });
    };
  }
  __name(extend, "extend");
  return Object.assign(client, { extend: extend(client) });
}
__name(createClient, "createClient");

// node_modules/viem/_esm/clients/transports/createTransport.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/utils/buildRequest.js
init_checked_fetch();
init_modules_watch_stub();
init_base();
init_request();
init_rpc();
init_toHex();

// node_modules/viem/_esm/utils/promise/withDedupe.js
init_checked_fetch();
init_modules_watch_stub();
init_lru();
var promiseCache2 = /* @__PURE__ */ new LruMap(8192);
function withDedupe(fn, { enabled = true, id }) {
  if (!enabled || !id)
    return fn();
  if (promiseCache2.get(id))
    return promiseCache2.get(id);
  const promise = fn().finally(() => promiseCache2.delete(id));
  promiseCache2.set(id, promise);
  return promise;
}
__name(withDedupe, "withDedupe");

// node_modules/viem/_esm/utils/promise/withRetry.js
init_checked_fetch();
init_modules_watch_stub();
function withRetry(fn, { delay: delay_ = 100, retryCount = 2, shouldRetry: shouldRetry2 = /* @__PURE__ */ __name(() => true, "shouldRetry") } = {}) {
  return new Promise((resolve, reject) => {
    const attemptRetry = /* @__PURE__ */ __name(async ({ count = 0 } = {}) => {
      const retry = /* @__PURE__ */ __name(async ({ error }) => {
        const delay = typeof delay_ === "function" ? delay_({ count, error }) : delay_;
        if (delay)
          await wait(delay);
        attemptRetry({ count: count + 1 });
      }, "retry");
      try {
        const data = await fn();
        resolve(data);
      } catch (err) {
        if (count < retryCount && await shouldRetry2({ count, error: err }))
          return retry({ error: err });
        reject(err);
      }
    }, "attemptRetry");
    attemptRetry();
  });
}
__name(withRetry, "withRetry");

// node_modules/viem/_esm/utils/buildRequest.js
init_stringify();
function buildRequest(request, options = {}) {
  return async (args, overrideOptions = {}) => {
    const { dedupe = false, methods, retryDelay = 150, retryCount = 3, uid: uid2 } = {
      ...options,
      ...overrideOptions
    };
    const { method } = args;
    if (methods?.exclude?.includes(method))
      throw new MethodNotSupportedRpcError(new Error("method not supported"), {
        method
      });
    if (methods?.include && !methods.include.includes(method))
      throw new MethodNotSupportedRpcError(new Error("method not supported"), {
        method
      });
    const requestId = dedupe ? stringToHex(`${uid2}.${stringify(args)}`) : void 0;
    return withDedupe(() => withRetry(async () => {
      try {
        return await request(args);
      } catch (err_) {
        const err = err_;
        switch (err.code) {
          // -32700
          case ParseRpcError.code:
            throw new ParseRpcError(err);
          // -32600
          case InvalidRequestRpcError.code:
            throw new InvalidRequestRpcError(err);
          // -32601
          case MethodNotFoundRpcError.code:
            throw new MethodNotFoundRpcError(err, { method: args.method });
          // -32602
          case InvalidParamsRpcError.code:
            throw new InvalidParamsRpcError(err);
          // -32603
          case InternalRpcError.code:
            throw new InternalRpcError(err);
          // -32000
          case InvalidInputRpcError.code:
            throw new InvalidInputRpcError(err);
          // -32001
          case ResourceNotFoundRpcError.code:
            throw new ResourceNotFoundRpcError(err);
          // -32002
          case ResourceUnavailableRpcError.code:
            throw new ResourceUnavailableRpcError(err);
          // -32003
          case TransactionRejectedRpcError.code:
            throw new TransactionRejectedRpcError(err);
          // -32004
          case MethodNotSupportedRpcError.code:
            throw new MethodNotSupportedRpcError(err, {
              method: args.method
            });
          // -32005
          case LimitExceededRpcError.code:
            throw new LimitExceededRpcError(err);
          // -32006
          case JsonRpcVersionUnsupportedError.code:
            throw new JsonRpcVersionUnsupportedError(err);
          // 4001
          case UserRejectedRequestError.code:
            throw new UserRejectedRequestError(err);
          // 4100
          case UnauthorizedProviderError.code:
            throw new UnauthorizedProviderError(err);
          // 4200
          case UnsupportedProviderMethodError.code:
            throw new UnsupportedProviderMethodError(err);
          // 4900
          case ProviderDisconnectedError.code:
            throw new ProviderDisconnectedError(err);
          // 4901
          case ChainDisconnectedError.code:
            throw new ChainDisconnectedError(err);
          // 4902
          case SwitchChainError.code:
            throw new SwitchChainError(err);
          // 5700
          case UnsupportedNonOptionalCapabilityError.code:
            throw new UnsupportedNonOptionalCapabilityError(err);
          // 5710
          case UnsupportedChainIdError.code:
            throw new UnsupportedChainIdError(err);
          // 5720
          case DuplicateIdError.code:
            throw new DuplicateIdError(err);
          // 5730
          case UnknownBundleIdError.code:
            throw new UnknownBundleIdError(err);
          // 5740
          case BundleTooLargeError.code:
            throw new BundleTooLargeError(err);
          // 5750
          case AtomicReadyWalletRejectedUpgradeError.code:
            throw new AtomicReadyWalletRejectedUpgradeError(err);
          // 5760
          case AtomicityNotSupportedError.code:
            throw new AtomicityNotSupportedError(err);
          // CAIP-25: User Rejected Error
          // https://docs.walletconnect.com/2.0/specs/clients/sign/error-codes#rejected-caip-25
          case 5e3:
            throw new UserRejectedRequestError(err);
          default:
            if (err_ instanceof BaseError2)
              throw err_;
            throw new UnknownRpcError(err);
        }
      }
    }, {
      delay: /* @__PURE__ */ __name(({ count, error }) => {
        if (error && error instanceof HttpRequestError) {
          const retryAfter = error?.headers?.get("Retry-After");
          if (retryAfter?.match(/\d/))
            return Number.parseInt(retryAfter) * 1e3;
        }
        return ~~(1 << count) * retryDelay;
      }, "delay"),
      retryCount,
      shouldRetry: /* @__PURE__ */ __name(({ error }) => shouldRetry(error), "shouldRetry")
    }), { enabled: dedupe, id: requestId });
  };
}
__name(buildRequest, "buildRequest");
function shouldRetry(error) {
  if ("code" in error && typeof error.code === "number") {
    if (error.code === -1)
      return true;
    if (error.code === LimitExceededRpcError.code)
      return true;
    if (error.code === InternalRpcError.code)
      return true;
    return false;
  }
  if (error instanceof HttpRequestError && error.status) {
    if (error.status === 403)
      return true;
    if (error.status === 408)
      return true;
    if (error.status === 413)
      return true;
    if (error.status === 429)
      return true;
    if (error.status === 500)
      return true;
    if (error.status === 502)
      return true;
    if (error.status === 503)
      return true;
    if (error.status === 504)
      return true;
    return false;
  }
  return true;
}
__name(shouldRetry, "shouldRetry");

// node_modules/viem/_esm/clients/transports/createTransport.js
function createTransport({ key, methods, name, request, retryCount = 3, retryDelay = 150, timeout, type }, value) {
  const uid2 = uid();
  return {
    config: {
      key,
      methods,
      name,
      request,
      retryCount,
      retryDelay,
      timeout,
      type
    },
    request: buildRequest(request, { methods, retryCount, retryDelay, uid: uid2 }),
    value
  };
}
__name(createTransport, "createTransport");

// node_modules/viem/_esm/clients/transports/http.js
init_checked_fetch();
init_modules_watch_stub();
init_request();

// node_modules/viem/_esm/errors/transport.js
init_checked_fetch();
init_modules_watch_stub();
init_base();
var UrlRequiredError = class extends BaseError2 {
  static {
    __name(this, "UrlRequiredError");
  }
  constructor() {
    super("No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.", {
      docsPath: "/docs/clients/intro",
      name: "UrlRequiredError"
    });
  }
};

// node_modules/viem/_esm/clients/transports/http.js
init_createBatchScheduler();

// node_modules/viem/_esm/utils/rpc/http.js
init_checked_fetch();
init_modules_watch_stub();
init_request();

// node_modules/viem/_esm/utils/promise/withTimeout.js
init_checked_fetch();
init_modules_watch_stub();
function withTimeout(fn, { errorInstance = new Error("timed out"), timeout, signal }) {
  return new Promise((resolve, reject) => {
    ;
    (async () => {
      let timeoutId;
      try {
        const controller = new AbortController();
        if (timeout > 0) {
          timeoutId = setTimeout(() => {
            if (signal) {
              controller.abort();
            } else {
              reject(errorInstance);
            }
          }, timeout);
        }
        resolve(await fn({ signal: controller?.signal || null }));
      } catch (err) {
        if (err?.name === "AbortError")
          reject(errorInstance);
        reject(err);
      } finally {
        clearTimeout(timeoutId);
      }
    })();
  });
}
__name(withTimeout, "withTimeout");

// node_modules/viem/_esm/utils/rpc/http.js
init_stringify();

// node_modules/viem/_esm/utils/rpc/id.js
init_checked_fetch();
init_modules_watch_stub();
function createIdStore() {
  return {
    current: 0,
    take() {
      return this.current++;
    },
    reset() {
      this.current = 0;
    }
  };
}
__name(createIdStore, "createIdStore");
var idCache = /* @__PURE__ */ createIdStore();

// node_modules/viem/_esm/utils/rpc/http.js
function getHttpRpcClient(url, options = {}) {
  return {
    async request(params) {
      const { body, onRequest = options.onRequest, onResponse = options.onResponse, timeout = options.timeout ?? 1e4 } = params;
      const fetchOptions = {
        ...options.fetchOptions ?? {},
        ...params.fetchOptions ?? {}
      };
      const { headers, method, signal: signal_ } = fetchOptions;
      try {
        const response = await withTimeout(async ({ signal }) => {
          const init = {
            ...fetchOptions,
            body: Array.isArray(body) ? stringify(body.map((body2) => ({
              jsonrpc: "2.0",
              id: body2.id ?? idCache.take(),
              ...body2
            }))) : stringify({
              jsonrpc: "2.0",
              id: body.id ?? idCache.take(),
              ...body
            }),
            headers: {
              "Content-Type": "application/json",
              ...headers
            },
            method: method || "POST",
            signal: signal_ || (timeout > 0 ? signal : null)
          };
          const request = new Request(url, init);
          const args = await onRequest?.(request, init) ?? { ...init, url };
          const response2 = await fetch(args.url ?? url, args);
          return response2;
        }, {
          errorInstance: new TimeoutError({ body, url }),
          timeout,
          signal: true
        });
        if (onResponse)
          await onResponse(response);
        let data;
        if (response.headers.get("Content-Type")?.startsWith("application/json"))
          data = await response.json();
        else {
          data = await response.text();
          try {
            data = JSON.parse(data || "{}");
          } catch (err) {
            if (response.ok)
              throw err;
            data = { error: data };
          }
        }
        if (!response.ok) {
          throw new HttpRequestError({
            body,
            details: stringify(data.error) || response.statusText,
            headers: response.headers,
            status: response.status,
            url
          });
        }
        return data;
      } catch (err) {
        if (err instanceof HttpRequestError)
          throw err;
        if (err instanceof TimeoutError)
          throw err;
        throw new HttpRequestError({
          body,
          cause: err,
          url
        });
      }
    }
  };
}
__name(getHttpRpcClient, "getHttpRpcClient");

// node_modules/viem/_esm/clients/transports/http.js
function http(url, config = {}) {
  const { batch, fetchOptions, key = "http", methods, name = "HTTP JSON-RPC", onFetchRequest, onFetchResponse, retryDelay, raw } = config;
  return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
    const { batchSize = 1e3, wait: wait2 = 0 } = typeof batch === "object" ? batch : {};
    const retryCount = config.retryCount ?? retryCount_;
    const timeout = timeout_ ?? config.timeout ?? 1e4;
    const url_ = url || chain?.rpcUrls.default.http[0];
    if (!url_)
      throw new UrlRequiredError();
    const rpcClient = getHttpRpcClient(url_, {
      fetchOptions,
      onRequest: onFetchRequest,
      onResponse: onFetchResponse,
      timeout
    });
    return createTransport({
      key,
      methods,
      name,
      async request({ method, params }) {
        const body = { method, params };
        const { schedule } = createBatchScheduler({
          id: url_,
          wait: wait2,
          shouldSplitBatch(requests) {
            return requests.length > batchSize;
          },
          fn: /* @__PURE__ */ __name((body2) => rpcClient.request({
            body: body2
          }), "fn"),
          sort: /* @__PURE__ */ __name((a, b) => a.id - b.id, "sort")
        });
        const fn = /* @__PURE__ */ __name(async (body2) => batch ? schedule(body2) : [
          await rpcClient.request({
            body: body2
          })
        ], "fn");
        const [{ error, result }] = await fn(body);
        if (raw)
          return { error, result };
        if (error)
          throw new RpcRequestError({
            body,
            error,
            url: url_
          });
        return result;
      },
      retryCount,
      retryDelay,
      timeout,
      type: "http"
    }, {
      fetchOptions,
      url: url_
    });
  };
}
__name(http, "http");

// node_modules/viem/_esm/clients/createPublicClient.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/clients/decorators/public.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/actions/ens/getEnsAddress.js
init_checked_fetch();
init_modules_watch_stub();
init_abis();
init_decodeFunctionResult();
init_encodeFunctionData();
init_getChainContractAddress();
init_trim();
init_toHex();

// node_modules/viem/_esm/utils/ens/errors.js
init_checked_fetch();
init_modules_watch_stub();
init_solidity();
init_base();
init_contract();
function isNullUniversalResolverError(err, callType) {
  if (!(err instanceof BaseError2))
    return false;
  const cause = err.walk((e) => e instanceof ContractFunctionRevertedError);
  if (!(cause instanceof ContractFunctionRevertedError))
    return false;
  if (cause.data?.errorName === "ResolverNotFound")
    return true;
  if (cause.data?.errorName === "ResolverWildcardNotSupported")
    return true;
  if (cause.data?.errorName === "ResolverNotContract")
    return true;
  if (cause.data?.errorName === "ResolverError")
    return true;
  if (cause.data?.errorName === "HttpError")
    return true;
  if (cause.reason?.includes("Wildcard on non-extended resolvers is not supported"))
    return true;
  if (callType === "reverse" && cause.reason === panicReasons[50])
    return true;
  return false;
}
__name(isNullUniversalResolverError, "isNullUniversalResolverError");

// node_modules/viem/_esm/actions/ens/getEnsAddress.js
init_localBatchGatewayRequest();

// node_modules/viem/_esm/utils/ens/namehash.js
init_checked_fetch();
init_modules_watch_stub();
init_concat();
init_toBytes();
init_toHex();
init_keccak256();

// node_modules/viem/_esm/utils/ens/encodedLabelToLabelhash.js
init_checked_fetch();
init_modules_watch_stub();
init_isHex();
function encodedLabelToLabelhash(label) {
  if (label.length !== 66)
    return null;
  if (label.indexOf("[") !== 0)
    return null;
  if (label.indexOf("]") !== 65)
    return null;
  const hash2 = `0x${label.slice(1, 65)}`;
  if (!isHex(hash2))
    return null;
  return hash2;
}
__name(encodedLabelToLabelhash, "encodedLabelToLabelhash");

// node_modules/viem/_esm/utils/ens/namehash.js
function namehash(name) {
  let result = new Uint8Array(32).fill(0);
  if (!name)
    return bytesToHex(result);
  const labels = name.split(".");
  for (let i = labels.length - 1; i >= 0; i -= 1) {
    const hashFromEncodedLabel = encodedLabelToLabelhash(labels[i]);
    const hashed = hashFromEncodedLabel ? toBytes(hashFromEncodedLabel) : keccak256(stringToBytes(labels[i]), "bytes");
    result = keccak256(concat([result, hashed]), "bytes");
  }
  return bytesToHex(result);
}
__name(namehash, "namehash");

// node_modules/viem/_esm/utils/ens/packetToBytes.js
init_checked_fetch();
init_modules_watch_stub();
init_toBytes();

// node_modules/viem/_esm/utils/ens/encodeLabelhash.js
init_checked_fetch();
init_modules_watch_stub();
function encodeLabelhash(hash2) {
  return `[${hash2.slice(2)}]`;
}
__name(encodeLabelhash, "encodeLabelhash");

// node_modules/viem/_esm/utils/ens/labelhash.js
init_checked_fetch();
init_modules_watch_stub();
init_toBytes();
init_toHex();
init_keccak256();
function labelhash(label) {
  const result = new Uint8Array(32).fill(0);
  if (!label)
    return bytesToHex(result);
  return encodedLabelToLabelhash(label) || keccak256(stringToBytes(label));
}
__name(labelhash, "labelhash");

// node_modules/viem/_esm/utils/ens/packetToBytes.js
function packetToBytes(packet) {
  const value = packet.replace(/^\.|\.$/gm, "");
  if (value.length === 0)
    return new Uint8Array(1);
  const bytes = new Uint8Array(stringToBytes(value).byteLength + 2);
  let offset = 0;
  const list = value.split(".");
  for (let i = 0; i < list.length; i++) {
    let encoded = stringToBytes(list[i]);
    if (encoded.byteLength > 255)
      encoded = stringToBytes(encodeLabelhash(labelhash(list[i])));
    bytes[offset] = encoded.length;
    bytes.set(encoded, offset + 1);
    offset += encoded.length + 1;
  }
  if (bytes.byteLength !== offset + 1)
    return bytes.slice(0, offset + 1);
  return bytes;
}
__name(packetToBytes, "packetToBytes");

// node_modules/viem/_esm/actions/ens/getEnsAddress.js
async function getEnsAddress(client, parameters) {
  const { blockNumber, blockTag, coinType, name, gatewayUrls, strict } = parameters;
  const { chain } = client;
  const universalResolverAddress = (() => {
    if (parameters.universalResolverAddress)
      return parameters.universalResolverAddress;
    if (!chain)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    return getChainContractAddress({
      blockNumber,
      chain,
      contract: "ensUniversalResolver"
    });
  })();
  const tlds = chain?.ensTlds;
  if (tlds && !tlds.some((tld) => name.endsWith(tld)))
    return null;
  try {
    const functionData = encodeFunctionData({
      abi: addressResolverAbi,
      functionName: "addr",
      ...coinType != null ? { args: [namehash(name), BigInt(coinType)] } : { args: [namehash(name)] }
    });
    const readContractParameters = {
      address: universalResolverAddress,
      abi: universalResolverResolveAbi,
      functionName: "resolve",
      args: [
        toHex(packetToBytes(name)),
        functionData,
        gatewayUrls ?? [localBatchGatewayUrl]
      ],
      blockNumber,
      blockTag
    };
    const readContractAction = getAction(client, readContract, "readContract");
    const res = await readContractAction(readContractParameters);
    if (res[0] === "0x")
      return null;
    const address = decodeFunctionResult({
      abi: addressResolverAbi,
      args: coinType != null ? [namehash(name), BigInt(coinType)] : void 0,
      functionName: "addr",
      data: res[0]
    });
    if (address === "0x")
      return null;
    if (trim(address) === "0x00")
      return null;
    return address;
  } catch (err) {
    if (strict)
      throw err;
    if (isNullUniversalResolverError(err, "resolve"))
      return null;
    throw err;
  }
}
__name(getEnsAddress, "getEnsAddress");

// node_modules/viem/_esm/actions/ens/getEnsAvatar.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/utils/ens/avatar/parseAvatarRecord.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/utils/ens/avatar/utils.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/errors/ens.js
init_checked_fetch();
init_modules_watch_stub();
init_base();
var EnsAvatarInvalidMetadataError = class extends BaseError2 {
  static {
    __name(this, "EnsAvatarInvalidMetadataError");
  }
  constructor({ data }) {
    super("Unable to extract image from metadata. The metadata may be malformed or invalid.", {
      metaMessages: [
        "- Metadata must be a JSON object with at least an `image`, `image_url` or `image_data` property.",
        "",
        `Provided data: ${JSON.stringify(data)}`
      ],
      name: "EnsAvatarInvalidMetadataError"
    });
  }
};
var EnsAvatarInvalidNftUriError = class extends BaseError2 {
  static {
    __name(this, "EnsAvatarInvalidNftUriError");
  }
  constructor({ reason }) {
    super(`ENS NFT avatar URI is invalid. ${reason}`, {
      name: "EnsAvatarInvalidNftUriError"
    });
  }
};
var EnsAvatarUriResolutionError = class extends BaseError2 {
  static {
    __name(this, "EnsAvatarUriResolutionError");
  }
  constructor({ uri }) {
    super(`Unable to resolve ENS avatar URI "${uri}". The URI may be malformed, invalid, or does not respond with a valid image.`, { name: "EnsAvatarUriResolutionError" });
  }
};
var EnsAvatarUnsupportedNamespaceError = class extends BaseError2 {
  static {
    __name(this, "EnsAvatarUnsupportedNamespaceError");
  }
  constructor({ namespace }) {
    super(`ENS NFT avatar namespace "${namespace}" is not supported. Must be "erc721" or "erc1155".`, { name: "EnsAvatarUnsupportedNamespaceError" });
  }
};

// node_modules/viem/_esm/utils/ens/avatar/utils.js
var networkRegex = /(?<protocol>https?:\/\/[^\/]*|ipfs:\/|ipns:\/|ar:\/)?(?<root>\/)?(?<subpath>ipfs\/|ipns\/)?(?<target>[\w\-.]+)(?<subtarget>\/.*)?/;
var ipfsHashRegex = /^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})(\/(?<target>[\w\-.]+))?(?<subtarget>\/.*)?$/;
var base64Regex = /^data:([a-zA-Z\-/+]*);base64,([^"].*)/;
var dataURIRegex = /^data:([a-zA-Z\-/+]*)?(;[a-zA-Z0-9].*?)?(,)/;
async function isImageUri(uri) {
  try {
    const res = await fetch(uri, { method: "HEAD" });
    if (res.status === 200) {
      const contentType = res.headers.get("content-type");
      return contentType?.startsWith("image/");
    }
    return false;
  } catch (error) {
    if (typeof error === "object" && typeof error.response !== "undefined") {
      return false;
    }
    if (!globalThis.hasOwnProperty("Image"))
      return false;
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(true);
      };
      img.onerror = () => {
        resolve(false);
      };
      img.src = uri;
    });
  }
}
__name(isImageUri, "isImageUri");
function getGateway(custom, defaultGateway) {
  if (!custom)
    return defaultGateway;
  if (custom.endsWith("/"))
    return custom.slice(0, -1);
  return custom;
}
__name(getGateway, "getGateway");
function resolveAvatarUri({ uri, gatewayUrls }) {
  const isEncoded = base64Regex.test(uri);
  if (isEncoded)
    return { uri, isOnChain: true, isEncoded };
  const ipfsGateway = getGateway(gatewayUrls?.ipfs, "https://ipfs.io");
  const arweaveGateway = getGateway(gatewayUrls?.arweave, "https://arweave.net");
  const networkRegexMatch = uri.match(networkRegex);
  const { protocol, subpath, target, subtarget = "" } = networkRegexMatch?.groups || {};
  const isIPNS = protocol === "ipns:/" || subpath === "ipns/";
  const isIPFS = protocol === "ipfs:/" || subpath === "ipfs/" || ipfsHashRegex.test(uri);
  if (uri.startsWith("http") && !isIPNS && !isIPFS) {
    let replacedUri = uri;
    if (gatewayUrls?.arweave)
      replacedUri = uri.replace(/https:\/\/arweave.net/g, gatewayUrls?.arweave);
    return { uri: replacedUri, isOnChain: false, isEncoded: false };
  }
  if ((isIPNS || isIPFS) && target) {
    return {
      uri: `${ipfsGateway}/${isIPNS ? "ipns" : "ipfs"}/${target}${subtarget}`,
      isOnChain: false,
      isEncoded: false
    };
  }
  if (protocol === "ar:/" && target) {
    return {
      uri: `${arweaveGateway}/${target}${subtarget || ""}`,
      isOnChain: false,
      isEncoded: false
    };
  }
  let parsedUri = uri.replace(dataURIRegex, "");
  if (parsedUri.startsWith("<svg")) {
    parsedUri = `data:image/svg+xml;base64,${btoa(parsedUri)}`;
  }
  if (parsedUri.startsWith("data:") || parsedUri.startsWith("{")) {
    return {
      uri: parsedUri,
      isOnChain: true,
      isEncoded: false
    };
  }
  throw new EnsAvatarUriResolutionError({ uri });
}
__name(resolveAvatarUri, "resolveAvatarUri");
function getJsonImage(data) {
  if (typeof data !== "object" || !("image" in data) && !("image_url" in data) && !("image_data" in data)) {
    throw new EnsAvatarInvalidMetadataError({ data });
  }
  return data.image || data.image_url || data.image_data;
}
__name(getJsonImage, "getJsonImage");
async function getMetadataAvatarUri({ gatewayUrls, uri }) {
  try {
    const res = await fetch(uri).then((res2) => res2.json());
    const image = await parseAvatarUri({
      gatewayUrls,
      uri: getJsonImage(res)
    });
    return image;
  } catch {
    throw new EnsAvatarUriResolutionError({ uri });
  }
}
__name(getMetadataAvatarUri, "getMetadataAvatarUri");
async function parseAvatarUri({ gatewayUrls, uri }) {
  const { uri: resolvedURI, isOnChain } = resolveAvatarUri({ uri, gatewayUrls });
  if (isOnChain)
    return resolvedURI;
  const isImage = await isImageUri(resolvedURI);
  if (isImage)
    return resolvedURI;
  throw new EnsAvatarUriResolutionError({ uri });
}
__name(parseAvatarUri, "parseAvatarUri");
function parseNftUri(uri_) {
  let uri = uri_;
  if (uri.startsWith("did:nft:")) {
    uri = uri.replace("did:nft:", "").replace(/_/g, "/");
  }
  const [reference, asset_namespace, tokenID] = uri.split("/");
  const [eip_namespace, chainID] = reference.split(":");
  const [erc_namespace, contractAddress] = asset_namespace.split(":");
  if (!eip_namespace || eip_namespace.toLowerCase() !== "eip155")
    throw new EnsAvatarInvalidNftUriError({ reason: "Only EIP-155 supported" });
  if (!chainID)
    throw new EnsAvatarInvalidNftUriError({ reason: "Chain ID not found" });
  if (!contractAddress)
    throw new EnsAvatarInvalidNftUriError({
      reason: "Contract address not found"
    });
  if (!tokenID)
    throw new EnsAvatarInvalidNftUriError({ reason: "Token ID not found" });
  if (!erc_namespace)
    throw new EnsAvatarInvalidNftUriError({ reason: "ERC namespace not found" });
  return {
    chainID: Number.parseInt(chainID),
    namespace: erc_namespace.toLowerCase(),
    contractAddress,
    tokenID
  };
}
__name(parseNftUri, "parseNftUri");
async function getNftTokenUri(client, { nft }) {
  if (nft.namespace === "erc721") {
    return readContract(client, {
      address: nft.contractAddress,
      abi: [
        {
          name: "tokenURI",
          type: "function",
          stateMutability: "view",
          inputs: [{ name: "tokenId", type: "uint256" }],
          outputs: [{ name: "", type: "string" }]
        }
      ],
      functionName: "tokenURI",
      args: [BigInt(nft.tokenID)]
    });
  }
  if (nft.namespace === "erc1155") {
    return readContract(client, {
      address: nft.contractAddress,
      abi: [
        {
          name: "uri",
          type: "function",
          stateMutability: "view",
          inputs: [{ name: "_id", type: "uint256" }],
          outputs: [{ name: "", type: "string" }]
        }
      ],
      functionName: "uri",
      args: [BigInt(nft.tokenID)]
    });
  }
  throw new EnsAvatarUnsupportedNamespaceError({ namespace: nft.namespace });
}
__name(getNftTokenUri, "getNftTokenUri");

// node_modules/viem/_esm/utils/ens/avatar/parseAvatarRecord.js
async function parseAvatarRecord(client, { gatewayUrls, record }) {
  if (/eip155:/i.test(record))
    return parseNftAvatarUri(client, { gatewayUrls, record });
  return parseAvatarUri({ uri: record, gatewayUrls });
}
__name(parseAvatarRecord, "parseAvatarRecord");
async function parseNftAvatarUri(client, { gatewayUrls, record }) {
  const nft = parseNftUri(record);
  const nftUri = await getNftTokenUri(client, { nft });
  const { uri: resolvedNftUri, isOnChain, isEncoded } = resolveAvatarUri({ uri: nftUri, gatewayUrls });
  if (isOnChain && (resolvedNftUri.includes("data:application/json;base64,") || resolvedNftUri.startsWith("{"))) {
    const encodedJson = isEncoded ? (
      // if it is encoded, decode it
      atob(resolvedNftUri.replace("data:application/json;base64,", ""))
    ) : (
      // if it isn't encoded assume it is a JSON string, but it could be anything (it will error if it is)
      resolvedNftUri
    );
    const decoded = JSON.parse(encodedJson);
    return parseAvatarUri({ uri: getJsonImage(decoded), gatewayUrls });
  }
  let uriTokenId = nft.tokenID;
  if (nft.namespace === "erc1155")
    uriTokenId = uriTokenId.replace("0x", "").padStart(64, "0");
  return getMetadataAvatarUri({
    gatewayUrls,
    uri: resolvedNftUri.replace(/(?:0x)?{id}/, uriTokenId)
  });
}
__name(parseNftAvatarUri, "parseNftAvatarUri");

// node_modules/viem/_esm/actions/ens/getEnsText.js
init_checked_fetch();
init_modules_watch_stub();
init_abis();
init_decodeFunctionResult();
init_encodeFunctionData();
init_getChainContractAddress();
init_toHex();
init_localBatchGatewayRequest();
async function getEnsText(client, parameters) {
  const { blockNumber, blockTag, key, name, gatewayUrls, strict } = parameters;
  const { chain } = client;
  const universalResolverAddress = (() => {
    if (parameters.universalResolverAddress)
      return parameters.universalResolverAddress;
    if (!chain)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    return getChainContractAddress({
      blockNumber,
      chain,
      contract: "ensUniversalResolver"
    });
  })();
  const tlds = chain?.ensTlds;
  if (tlds && !tlds.some((tld) => name.endsWith(tld)))
    return null;
  try {
    const readContractParameters = {
      address: universalResolverAddress,
      abi: universalResolverResolveAbi,
      functionName: "resolve",
      args: [
        toHex(packetToBytes(name)),
        encodeFunctionData({
          abi: textResolverAbi,
          functionName: "text",
          args: [namehash(name), key]
        }),
        gatewayUrls ?? [localBatchGatewayUrl]
      ],
      blockNumber,
      blockTag
    };
    const readContractAction = getAction(client, readContract, "readContract");
    const res = await readContractAction(readContractParameters);
    if (res[0] === "0x")
      return null;
    const record = decodeFunctionResult({
      abi: textResolverAbi,
      functionName: "text",
      data: res[0]
    });
    return record === "" ? null : record;
  } catch (err) {
    if (strict)
      throw err;
    if (isNullUniversalResolverError(err, "resolve"))
      return null;
    throw err;
  }
}
__name(getEnsText, "getEnsText");

// node_modules/viem/_esm/actions/ens/getEnsAvatar.js
async function getEnsAvatar(client, { blockNumber, blockTag, assetGatewayUrls, name, gatewayUrls, strict, universalResolverAddress }) {
  const record = await getAction(client, getEnsText, "getEnsText")({
    blockNumber,
    blockTag,
    key: "avatar",
    name,
    universalResolverAddress,
    gatewayUrls,
    strict
  });
  if (!record)
    return null;
  try {
    return await parseAvatarRecord(client, {
      record,
      gatewayUrls: assetGatewayUrls
    });
  } catch {
    return null;
  }
}
__name(getEnsAvatar, "getEnsAvatar");

// node_modules/viem/_esm/actions/ens/getEnsName.js
init_checked_fetch();
init_modules_watch_stub();
init_abis();
init_getChainContractAddress();
init_toHex();
async function getEnsName(client, { address, blockNumber, blockTag, gatewayUrls, strict, universalResolverAddress: universalResolverAddress_ }) {
  let universalResolverAddress = universalResolverAddress_;
  if (!universalResolverAddress) {
    if (!client.chain)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    universalResolverAddress = getChainContractAddress({
      blockNumber,
      chain: client.chain,
      contract: "ensUniversalResolver"
    });
  }
  const reverseNode = `${address.toLowerCase().substring(2)}.addr.reverse`;
  try {
    const readContractParameters = {
      address: universalResolverAddress,
      abi: universalResolverReverseAbi,
      functionName: "reverse",
      args: [toHex(packetToBytes(reverseNode))],
      blockNumber,
      blockTag
    };
    const readContractAction = getAction(client, readContract, "readContract");
    const [name, resolvedAddress] = gatewayUrls ? await readContractAction({
      ...readContractParameters,
      args: [...readContractParameters.args, gatewayUrls]
    }) : await readContractAction(readContractParameters);
    if (address.toLowerCase() !== resolvedAddress.toLowerCase())
      return null;
    return name;
  } catch (err) {
    if (strict)
      throw err;
    if (isNullUniversalResolverError(err, "reverse"))
      return null;
    throw err;
  }
}
__name(getEnsName, "getEnsName");

// node_modules/viem/_esm/actions/ens/getEnsResolver.js
init_checked_fetch();
init_modules_watch_stub();
init_getChainContractAddress();
init_toHex();
async function getEnsResolver(client, parameters) {
  const { blockNumber, blockTag, name } = parameters;
  const { chain } = client;
  const universalResolverAddress = (() => {
    if (parameters.universalResolverAddress)
      return parameters.universalResolverAddress;
    if (!chain)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    return getChainContractAddress({
      blockNumber,
      chain,
      contract: "ensUniversalResolver"
    });
  })();
  const tlds = chain?.ensTlds;
  if (tlds && !tlds.some((tld) => name.endsWith(tld)))
    throw new Error(`${name} is not a valid ENS TLD (${tlds?.join(", ")}) for chain "${chain.name}" (id: ${chain.id}).`);
  const [resolverAddress] = await getAction(client, readContract, "readContract")({
    address: universalResolverAddress,
    abi: [
      {
        inputs: [{ type: "bytes" }],
        name: "findResolver",
        outputs: [{ type: "address" }, { type: "bytes32" }],
        stateMutability: "view",
        type: "function"
      }
    ],
    functionName: "findResolver",
    args: [toHex(packetToBytes(name))],
    blockNumber,
    blockTag
  });
  return resolverAddress;
}
__name(getEnsResolver, "getEnsResolver");

// node_modules/viem/_esm/clients/decorators/public.js
init_call();

// node_modules/viem/_esm/actions/public/createAccessList.js
init_checked_fetch();
init_modules_watch_stub();
init_parseAccount();
init_toHex();
init_getCallError();
init_extract();
init_transactionRequest();
init_assertRequest();
async function createAccessList(client, args) {
  const { account: account_ = client.account, blockNumber, blockTag = "latest", blobs, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, to, value, ...rest } = args;
  const account = account_ ? parseAccount(account_) : void 0;
  try {
    assertRequest(args);
    const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
    const block = blockNumberHex || blockTag;
    const chainFormat = client.chain?.formatters?.transactionRequest?.format;
    const format = chainFormat || formatTransactionRequest;
    const request = format({
      // Pick out extra data that might exist on the chain's transaction request type.
      ...extract(rest, { format: chainFormat }),
      from: account?.address,
      blobs,
      data,
      gas,
      gasPrice,
      maxFeePerBlobGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      to,
      value
    });
    const response = await client.request({
      method: "eth_createAccessList",
      params: [request, block]
    });
    return {
      accessList: response.accessList,
      gasUsed: BigInt(response.gasUsed)
    };
  } catch (err) {
    throw getCallError(err, {
      ...args,
      account,
      chain: client.chain
    });
  }
}
__name(createAccessList, "createAccessList");

// node_modules/viem/_esm/actions/public/createBlockFilter.js
init_checked_fetch();
init_modules_watch_stub();
async function createBlockFilter(client) {
  const getRequest = createFilterRequestScope(client, {
    method: "eth_newBlockFilter"
  });
  const id = await client.request({
    method: "eth_newBlockFilter"
  });
  return { id, request: getRequest(id), type: "block" };
}
__name(createBlockFilter, "createBlockFilter");

// node_modules/viem/_esm/actions/public/createEventFilter.js
init_checked_fetch();
init_modules_watch_stub();
init_toHex();
async function createEventFilter(client, { address, args, event, events: events_, fromBlock, strict, toBlock } = {}) {
  const events = events_ ?? (event ? [event] : void 0);
  const getRequest = createFilterRequestScope(client, {
    method: "eth_newFilter"
  });
  let topics = [];
  if (events) {
    const encoded = events.flatMap((event2) => encodeEventTopics({
      abi: [event2],
      eventName: event2.name,
      args
    }));
    topics = [encoded];
    if (event)
      topics = topics[0];
  }
  const id = await client.request({
    method: "eth_newFilter",
    params: [
      {
        address,
        fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
        toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock,
        ...topics.length ? { topics } : {}
      }
    ]
  });
  return {
    abi: events,
    args,
    eventName: event ? event.name : void 0,
    fromBlock,
    id,
    request: getRequest(id),
    strict: Boolean(strict),
    toBlock,
    type: "event"
  };
}
__name(createEventFilter, "createEventFilter");

// node_modules/viem/_esm/actions/public/createPendingTransactionFilter.js
init_checked_fetch();
init_modules_watch_stub();
async function createPendingTransactionFilter(client) {
  const getRequest = createFilterRequestScope(client, {
    method: "eth_newPendingTransactionFilter"
  });
  const id = await client.request({
    method: "eth_newPendingTransactionFilter"
  });
  return { id, request: getRequest(id), type: "transaction" };
}
__name(createPendingTransactionFilter, "createPendingTransactionFilter");

// node_modules/viem/_esm/actions/public/getBlobBaseFee.js
init_checked_fetch();
init_modules_watch_stub();
async function getBlobBaseFee(client) {
  const baseFee = await client.request({
    method: "eth_blobBaseFee"
  });
  return BigInt(baseFee);
}
__name(getBlobBaseFee, "getBlobBaseFee");

// node_modules/viem/_esm/actions/public/getBlockTransactionCount.js
init_checked_fetch();
init_modules_watch_stub();
init_fromHex();
init_toHex();
async function getBlockTransactionCount(client, { blockHash, blockNumber, blockTag = "latest" } = {}) {
  const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
  let count;
  if (blockHash) {
    count = await client.request({
      method: "eth_getBlockTransactionCountByHash",
      params: [blockHash]
    }, { dedupe: true });
  } else {
    count = await client.request({
      method: "eth_getBlockTransactionCountByNumber",
      params: [blockNumberHex || blockTag]
    }, { dedupe: Boolean(blockNumberHex) });
  }
  return hexToNumber(count);
}
__name(getBlockTransactionCount, "getBlockTransactionCount");

// node_modules/viem/_esm/actions/public/getCode.js
init_checked_fetch();
init_modules_watch_stub();
init_toHex();
async function getCode(client, { address, blockNumber, blockTag = "latest" }) {
  const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
  const hex = await client.request({
    method: "eth_getCode",
    params: [address, blockNumberHex || blockTag]
  }, { dedupe: Boolean(blockNumberHex) });
  if (hex === "0x")
    return void 0;
  return hex;
}
__name(getCode, "getCode");

// node_modules/viem/_esm/actions/public/getEip712Domain.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/errors/eip712.js
init_checked_fetch();
init_modules_watch_stub();
init_base();
var Eip712DomainNotFoundError = class extends BaseError2 {
  static {
    __name(this, "Eip712DomainNotFoundError");
  }
  constructor({ address }) {
    super(`No EIP-712 domain found on contract "${address}".`, {
      metaMessages: [
        "Ensure that:",
        `- The contract is deployed at the address "${address}".`,
        "- `eip712Domain()` function exists on the contract.",
        "- `eip712Domain()` function matches signature to ERC-5267 specification."
      ],
      name: "Eip712DomainNotFoundError"
    });
  }
};

// node_modules/viem/_esm/actions/public/getEip712Domain.js
async function getEip712Domain(client, parameters) {
  const { address, factory, factoryData } = parameters;
  try {
    const [fields, name, version4, chainId, verifyingContract, salt, extensions] = await getAction(client, readContract, "readContract")({
      abi,
      address,
      functionName: "eip712Domain",
      factory,
      factoryData
    });
    return {
      domain: {
        name,
        version: version4,
        chainId: Number(chainId),
        verifyingContract,
        salt
      },
      extensions,
      fields
    };
  } catch (e) {
    const error = e;
    if (error.name === "ContractFunctionExecutionError" && error.cause.name === "ContractFunctionZeroDataError") {
      throw new Eip712DomainNotFoundError({ address });
    }
    throw error;
  }
}
__name(getEip712Domain, "getEip712Domain");
var abi = [
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      { name: "fields", type: "bytes1" },
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
      { name: "salt", type: "bytes32" },
      { name: "extensions", type: "uint256[]" }
    ],
    stateMutability: "view",
    type: "function"
  }
];

// node_modules/viem/_esm/actions/public/getFeeHistory.js
init_checked_fetch();
init_modules_watch_stub();
init_toHex();

// node_modules/viem/_esm/utils/formatters/feeHistory.js
init_checked_fetch();
init_modules_watch_stub();
function formatFeeHistory(feeHistory) {
  return {
    baseFeePerGas: feeHistory.baseFeePerGas.map((value) => BigInt(value)),
    gasUsedRatio: feeHistory.gasUsedRatio,
    oldestBlock: BigInt(feeHistory.oldestBlock),
    reward: feeHistory.reward?.map((reward) => reward.map((value) => BigInt(value)))
  };
}
__name(formatFeeHistory, "formatFeeHistory");

// node_modules/viem/_esm/actions/public/getFeeHistory.js
async function getFeeHistory(client, { blockCount, blockNumber, blockTag = "latest", rewardPercentiles }) {
  const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
  const feeHistory = await client.request({
    method: "eth_feeHistory",
    params: [
      numberToHex(blockCount),
      blockNumberHex || blockTag,
      rewardPercentiles
    ]
  }, { dedupe: Boolean(blockNumberHex) });
  return formatFeeHistory(feeHistory);
}
__name(getFeeHistory, "getFeeHistory");

// node_modules/viem/_esm/actions/public/getFilterLogs.js
init_checked_fetch();
init_modules_watch_stub();
async function getFilterLogs(_client, { filter }) {
  const strict = filter.strict ?? false;
  const logs = await filter.request({
    method: "eth_getFilterLogs",
    params: [filter.id]
  });
  const formattedLogs = logs.map((log) => formatLog(log));
  if (!filter.abi)
    return formattedLogs;
  return parseEventLogs({
    abi: filter.abi,
    logs: formattedLogs,
    strict
  });
}
__name(getFilterLogs, "getFilterLogs");

// node_modules/viem/_esm/actions/public/getProof.js
init_checked_fetch();
init_modules_watch_stub();
init_toHex();

// node_modules/viem/_esm/utils/formatters/proof.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/utils/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/utils/typedData.js
init_checked_fetch();
init_modules_watch_stub();
init_abi();
init_address();

// node_modules/viem/_esm/errors/typedData.js
init_checked_fetch();
init_modules_watch_stub();
init_stringify();
init_base();
var InvalidDomainError = class extends BaseError2 {
  static {
    __name(this, "InvalidDomainError");
  }
  constructor({ domain }) {
    super(`Invalid domain "${stringify(domain)}".`, {
      metaMessages: ["Must be a valid EIP-712 domain."]
    });
  }
};
var InvalidPrimaryTypeError = class extends BaseError2 {
  static {
    __name(this, "InvalidPrimaryTypeError");
  }
  constructor({ primaryType, types }) {
    super(`Invalid primary type \`${primaryType}\` must be one of \`${JSON.stringify(Object.keys(types))}\`.`, {
      docsPath: "/api/glossary/Errors#typeddatainvalidprimarytypeerror",
      metaMessages: ["Check that the primary type is a key in `types`."]
    });
  }
};
var InvalidStructTypeError = class extends BaseError2 {
  static {
    __name(this, "InvalidStructTypeError");
  }
  constructor({ type }) {
    super(`Struct type "${type}" is invalid.`, {
      metaMessages: ["Struct type must not be a Solidity type."],
      name: "InvalidStructTypeError"
    });
  }
};

// node_modules/viem/_esm/utils/typedData.js
init_isAddress();
init_size();
init_toHex();
init_regex2();

// node_modules/viem/_esm/utils/signature/hashTypedData.js
init_checked_fetch();
init_modules_watch_stub();
init_encodeAbiParameters();
init_concat();
init_toHex();
init_keccak256();
function hashTypedData(parameters) {
  const { domain = {}, message, primaryType } = parameters;
  const types = {
    EIP712Domain: getTypesForEIP712Domain({ domain }),
    ...parameters.types
  };
  validateTypedData({
    domain,
    message,
    primaryType,
    types
  });
  const parts = ["0x1901"];
  if (domain)
    parts.push(hashDomain({
      domain,
      types
    }));
  if (primaryType !== "EIP712Domain")
    parts.push(hashStruct({
      data: message,
      primaryType,
      types
    }));
  return keccak256(concat(parts));
}
__name(hashTypedData, "hashTypedData");
function hashDomain({ domain, types }) {
  return hashStruct({
    data: domain,
    primaryType: "EIP712Domain",
    types
  });
}
__name(hashDomain, "hashDomain");
function hashStruct({ data, primaryType, types }) {
  const encoded = encodeData({
    data,
    primaryType,
    types
  });
  return keccak256(encoded);
}
__name(hashStruct, "hashStruct");
function encodeData({ data, primaryType, types }) {
  const encodedTypes = [{ type: "bytes32" }];
  const encodedValues = [hashType({ primaryType, types })];
  for (const field of types[primaryType]) {
    const [type, value] = encodeField({
      types,
      name: field.name,
      type: field.type,
      value: data[field.name]
    });
    encodedTypes.push(type);
    encodedValues.push(value);
  }
  return encodeAbiParameters(encodedTypes, encodedValues);
}
__name(encodeData, "encodeData");
function hashType({ primaryType, types }) {
  const encodedHashType = toHex(encodeType({ primaryType, types }));
  return keccak256(encodedHashType);
}
__name(hashType, "hashType");
function encodeType({ primaryType, types }) {
  let result = "";
  const unsortedDeps = findTypeDependencies({ primaryType, types });
  unsortedDeps.delete(primaryType);
  const deps = [primaryType, ...Array.from(unsortedDeps).sort()];
  for (const type of deps) {
    result += `${type}(${types[type].map(({ name, type: t }) => `${t} ${name}`).join(",")})`;
  }
  return result;
}
__name(encodeType, "encodeType");
function findTypeDependencies({ primaryType: primaryType_, types }, results = /* @__PURE__ */ new Set()) {
  const match = primaryType_.match(/^\w*/u);
  const primaryType = match?.[0];
  if (results.has(primaryType) || types[primaryType] === void 0) {
    return results;
  }
  results.add(primaryType);
  for (const field of types[primaryType]) {
    findTypeDependencies({ primaryType: field.type, types }, results);
  }
  return results;
}
__name(findTypeDependencies, "findTypeDependencies");
function encodeField({ types, name, type, value }) {
  if (types[type] !== void 0) {
    return [
      { type: "bytes32" },
      keccak256(encodeData({ data: value, primaryType: type, types }))
    ];
  }
  if (type === "bytes") {
    const prepend = value.length % 2 ? "0" : "";
    value = `0x${prepend + value.slice(2)}`;
    return [{ type: "bytes32" }, keccak256(value)];
  }
  if (type === "string")
    return [{ type: "bytes32" }, keccak256(toHex(value))];
  if (type.lastIndexOf("]") === type.length - 1) {
    const parsedType = type.slice(0, type.lastIndexOf("["));
    const typeValuePairs = value.map((item) => encodeField({
      name,
      type: parsedType,
      types,
      value: item
    }));
    return [
      { type: "bytes32" },
      keccak256(encodeAbiParameters(typeValuePairs.map(([t]) => t), typeValuePairs.map(([, v]) => v)))
    ];
  }
  return [{ type }, value];
}
__name(encodeField, "encodeField");

// node_modules/viem/_esm/utils/typedData.js
init_stringify();
function serializeTypedData(parameters) {
  const { domain: domain_, message: message_, primaryType, types } = parameters;
  const normalizeData = /* @__PURE__ */ __name((struct, data_) => {
    const data = { ...data_ };
    for (const param of struct) {
      const { name, type } = param;
      if (type === "address")
        data[name] = data[name].toLowerCase();
    }
    return data;
  }, "normalizeData");
  const domain = (() => {
    if (!types.EIP712Domain)
      return {};
    if (!domain_)
      return {};
    return normalizeData(types.EIP712Domain, domain_);
  })();
  const message = (() => {
    if (primaryType === "EIP712Domain")
      return void 0;
    return normalizeData(types[primaryType], message_);
  })();
  return stringify({ domain, message, primaryType, types });
}
__name(serializeTypedData, "serializeTypedData");
function validateTypedData(parameters) {
  const { domain, message, primaryType, types } = parameters;
  const validateData = /* @__PURE__ */ __name((struct, data) => {
    for (const param of struct) {
      const { name, type } = param;
      const value = data[name];
      const integerMatch = type.match(integerRegex2);
      if (integerMatch && (typeof value === "number" || typeof value === "bigint")) {
        const [_type, base, size_] = integerMatch;
        numberToHex(value, {
          signed: base === "int",
          size: Number.parseInt(size_) / 8
        });
      }
      if (type === "address" && typeof value === "string" && !isAddress(value))
        throw new InvalidAddressError({ address: value });
      const bytesMatch = type.match(bytesRegex2);
      if (bytesMatch) {
        const [_type, size_] = bytesMatch;
        if (size_ && size(value) !== Number.parseInt(size_))
          throw new BytesSizeMismatchError({
            expectedSize: Number.parseInt(size_),
            givenSize: size(value)
          });
      }
      const struct2 = types[type];
      if (struct2) {
        validateReference(type);
        validateData(struct2, value);
      }
    }
  }, "validateData");
  if (types.EIP712Domain && domain) {
    if (typeof domain !== "object")
      throw new InvalidDomainError({ domain });
    validateData(types.EIP712Domain, domain);
  }
  if (primaryType !== "EIP712Domain") {
    if (types[primaryType])
      validateData(types[primaryType], message);
    else
      throw new InvalidPrimaryTypeError({ primaryType, types });
  }
}
__name(validateTypedData, "validateTypedData");
function getTypesForEIP712Domain({ domain }) {
  return [
    typeof domain?.name === "string" && { name: "name", type: "string" },
    domain?.version && { name: "version", type: "string" },
    (typeof domain?.chainId === "number" || typeof domain?.chainId === "bigint") && {
      name: "chainId",
      type: "uint256"
    },
    domain?.verifyingContract && {
      name: "verifyingContract",
      type: "address"
    },
    domain?.salt && { name: "salt", type: "bytes32" }
  ].filter(Boolean);
}
__name(getTypesForEIP712Domain, "getTypesForEIP712Domain");
function validateReference(type) {
  if (type === "address" || type === "bool" || type === "string" || type.startsWith("bytes") || type.startsWith("uint") || type.startsWith("int"))
    throw new InvalidStructTypeError({ type });
}
__name(validateReference, "validateReference");

// node_modules/viem/_esm/utils/index.js
init_encodeFunctionData();

// node_modules/viem/_esm/utils/authorization/serializeAuthorizationList.js
init_checked_fetch();
init_modules_watch_stub();
init_toHex();

// node_modules/viem/_esm/utils/transaction/serializeTransaction.js
init_checked_fetch();
init_modules_watch_stub();
init_transaction();
init_concat();
init_trim();
init_toHex();

// node_modules/viem/_esm/utils/transaction/assertTransaction.js
init_checked_fetch();
init_modules_watch_stub();
init_number();
init_address();
init_base();
init_chain();
init_node();
init_isAddress();
init_size();
init_slice();
init_fromHex();
function assertTransactionEIP7702(transaction) {
  const { authorizationList } = transaction;
  if (authorizationList) {
    for (const authorization of authorizationList) {
      const { chainId } = authorization;
      const address = authorization.address;
      if (!isAddress(address))
        throw new InvalidAddressError({ address });
      if (chainId < 0)
        throw new InvalidChainIdError({ chainId });
    }
  }
  assertTransactionEIP1559(transaction);
}
__name(assertTransactionEIP7702, "assertTransactionEIP7702");
function assertTransactionEIP4844(transaction) {
  const { blobVersionedHashes } = transaction;
  if (blobVersionedHashes) {
    if (blobVersionedHashes.length === 0)
      throw new EmptyBlobError();
    for (const hash2 of blobVersionedHashes) {
      const size_ = size(hash2);
      const version4 = hexToNumber(slice(hash2, 0, 1));
      if (size_ !== 32)
        throw new InvalidVersionedHashSizeError({ hash: hash2, size: size_ });
      if (version4 !== versionedHashVersionKzg)
        throw new InvalidVersionedHashVersionError({
          hash: hash2,
          version: version4
        });
    }
  }
  assertTransactionEIP1559(transaction);
}
__name(assertTransactionEIP4844, "assertTransactionEIP4844");
function assertTransactionEIP1559(transaction) {
  const { chainId, maxPriorityFeePerGas, maxFeePerGas, to } = transaction;
  if (chainId <= 0)
    throw new InvalidChainIdError({ chainId });
  if (to && !isAddress(to))
    throw new InvalidAddressError({ address: to });
  if (maxFeePerGas && maxFeePerGas > maxUint256)
    throw new FeeCapTooHighError({ maxFeePerGas });
  if (maxPriorityFeePerGas && maxFeePerGas && maxPriorityFeePerGas > maxFeePerGas)
    throw new TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas });
}
__name(assertTransactionEIP1559, "assertTransactionEIP1559");
function assertTransactionEIP2930(transaction) {
  const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to } = transaction;
  if (chainId <= 0)
    throw new InvalidChainIdError({ chainId });
  if (to && !isAddress(to))
    throw new InvalidAddressError({ address: to });
  if (maxPriorityFeePerGas || maxFeePerGas)
    throw new BaseError2("`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid EIP-2930 Transaction attribute.");
  if (gasPrice && gasPrice > maxUint256)
    throw new FeeCapTooHighError({ maxFeePerGas: gasPrice });
}
__name(assertTransactionEIP2930, "assertTransactionEIP2930");
function assertTransactionLegacy(transaction) {
  const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to } = transaction;
  if (to && !isAddress(to))
    throw new InvalidAddressError({ address: to });
  if (typeof chainId !== "undefined" && chainId <= 0)
    throw new InvalidChainIdError({ chainId });
  if (maxPriorityFeePerGas || maxFeePerGas)
    throw new BaseError2("`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid Legacy Transaction attribute.");
  if (gasPrice && gasPrice > maxUint256)
    throw new FeeCapTooHighError({ maxFeePerGas: gasPrice });
}
__name(assertTransactionLegacy, "assertTransactionLegacy");

// node_modules/viem/_esm/utils/transaction/serializeAccessList.js
init_checked_fetch();
init_modules_watch_stub();
init_address();
init_transaction();
init_isAddress();
function serializeAccessList(accessList) {
  if (!accessList || accessList.length === 0)
    return [];
  const serializedAccessList = [];
  for (let i = 0; i < accessList.length; i++) {
    const { address, storageKeys } = accessList[i];
    for (let j = 0; j < storageKeys.length; j++) {
      if (storageKeys[j].length - 2 !== 64) {
        throw new InvalidStorageKeySizeError({ storageKey: storageKeys[j] });
      }
    }
    if (!isAddress(address, { strict: false })) {
      throw new InvalidAddressError({ address });
    }
    serializedAccessList.push([address, storageKeys]);
  }
  return serializedAccessList;
}
__name(serializeAccessList, "serializeAccessList");

// node_modules/viem/_esm/utils/transaction/serializeTransaction.js
function serializeTransaction(transaction, signature) {
  const type = getTransactionType(transaction);
  if (type === "eip1559")
    return serializeTransactionEIP1559(transaction, signature);
  if (type === "eip2930")
    return serializeTransactionEIP2930(transaction, signature);
  if (type === "eip4844")
    return serializeTransactionEIP4844(transaction, signature);
  if (type === "eip7702")
    return serializeTransactionEIP7702(transaction, signature);
  return serializeTransactionLegacy(transaction, signature);
}
__name(serializeTransaction, "serializeTransaction");
function serializeTransactionEIP7702(transaction, signature) {
  const { authorizationList, chainId, gas, nonce, to, value, maxFeePerGas, maxPriorityFeePerGas, accessList, data } = transaction;
  assertTransactionEIP7702(transaction);
  const serializedAccessList = serializeAccessList(accessList);
  const serializedAuthorizationList = serializeAuthorizationList(authorizationList);
  return concatHex([
    "0x04",
    toRlp([
      numberToHex(chainId),
      nonce ? numberToHex(nonce) : "0x",
      maxPriorityFeePerGas ? numberToHex(maxPriorityFeePerGas) : "0x",
      maxFeePerGas ? numberToHex(maxFeePerGas) : "0x",
      gas ? numberToHex(gas) : "0x",
      to ?? "0x",
      value ? numberToHex(value) : "0x",
      data ?? "0x",
      serializedAccessList,
      serializedAuthorizationList,
      ...toYParitySignatureArray(transaction, signature)
    ])
  ]);
}
__name(serializeTransactionEIP7702, "serializeTransactionEIP7702");
function serializeTransactionEIP4844(transaction, signature) {
  const { chainId, gas, nonce, to, value, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, accessList, data } = transaction;
  assertTransactionEIP4844(transaction);
  let blobVersionedHashes = transaction.blobVersionedHashes;
  let sidecars = transaction.sidecars;
  if (transaction.blobs && (typeof blobVersionedHashes === "undefined" || typeof sidecars === "undefined")) {
    const blobs2 = typeof transaction.blobs[0] === "string" ? transaction.blobs : transaction.blobs.map((x) => bytesToHex(x));
    const kzg = transaction.kzg;
    const commitments2 = blobsToCommitments({
      blobs: blobs2,
      kzg
    });
    if (typeof blobVersionedHashes === "undefined")
      blobVersionedHashes = commitmentsToVersionedHashes({
        commitments: commitments2
      });
    if (typeof sidecars === "undefined") {
      const proofs2 = blobsToProofs({ blobs: blobs2, commitments: commitments2, kzg });
      sidecars = toBlobSidecars({ blobs: blobs2, commitments: commitments2, proofs: proofs2 });
    }
  }
  const serializedAccessList = serializeAccessList(accessList);
  const serializedTransaction = [
    numberToHex(chainId),
    nonce ? numberToHex(nonce) : "0x",
    maxPriorityFeePerGas ? numberToHex(maxPriorityFeePerGas) : "0x",
    maxFeePerGas ? numberToHex(maxFeePerGas) : "0x",
    gas ? numberToHex(gas) : "0x",
    to ?? "0x",
    value ? numberToHex(value) : "0x",
    data ?? "0x",
    serializedAccessList,
    maxFeePerBlobGas ? numberToHex(maxFeePerBlobGas) : "0x",
    blobVersionedHashes ?? [],
    ...toYParitySignatureArray(transaction, signature)
  ];
  const blobs = [];
  const commitments = [];
  const proofs = [];
  if (sidecars)
    for (let i = 0; i < sidecars.length; i++) {
      const { blob, commitment, proof } = sidecars[i];
      blobs.push(blob);
      commitments.push(commitment);
      proofs.push(proof);
    }
  return concatHex([
    "0x03",
    sidecars ? (
      // If sidecars are enabled, envelope turns into a "wrapper":
      toRlp([serializedTransaction, blobs, commitments, proofs])
    ) : (
      // If sidecars are disabled, standard envelope is used:
      toRlp(serializedTransaction)
    )
  ]);
}
__name(serializeTransactionEIP4844, "serializeTransactionEIP4844");
function serializeTransactionEIP1559(transaction, signature) {
  const { chainId, gas, nonce, to, value, maxFeePerGas, maxPriorityFeePerGas, accessList, data } = transaction;
  assertTransactionEIP1559(transaction);
  const serializedAccessList = serializeAccessList(accessList);
  const serializedTransaction = [
    numberToHex(chainId),
    nonce ? numberToHex(nonce) : "0x",
    maxPriorityFeePerGas ? numberToHex(maxPriorityFeePerGas) : "0x",
    maxFeePerGas ? numberToHex(maxFeePerGas) : "0x",
    gas ? numberToHex(gas) : "0x",
    to ?? "0x",
    value ? numberToHex(value) : "0x",
    data ?? "0x",
    serializedAccessList,
    ...toYParitySignatureArray(transaction, signature)
  ];
  return concatHex([
    "0x02",
    toRlp(serializedTransaction)
  ]);
}
__name(serializeTransactionEIP1559, "serializeTransactionEIP1559");
function serializeTransactionEIP2930(transaction, signature) {
  const { chainId, gas, data, nonce, to, value, accessList, gasPrice } = transaction;
  assertTransactionEIP2930(transaction);
  const serializedAccessList = serializeAccessList(accessList);
  const serializedTransaction = [
    numberToHex(chainId),
    nonce ? numberToHex(nonce) : "0x",
    gasPrice ? numberToHex(gasPrice) : "0x",
    gas ? numberToHex(gas) : "0x",
    to ?? "0x",
    value ? numberToHex(value) : "0x",
    data ?? "0x",
    serializedAccessList,
    ...toYParitySignatureArray(transaction, signature)
  ];
  return concatHex([
    "0x01",
    toRlp(serializedTransaction)
  ]);
}
__name(serializeTransactionEIP2930, "serializeTransactionEIP2930");
function serializeTransactionLegacy(transaction, signature) {
  const { chainId = 0, gas, data, nonce, to, value, gasPrice } = transaction;
  assertTransactionLegacy(transaction);
  let serializedTransaction = [
    nonce ? numberToHex(nonce) : "0x",
    gasPrice ? numberToHex(gasPrice) : "0x",
    gas ? numberToHex(gas) : "0x",
    to ?? "0x",
    value ? numberToHex(value) : "0x",
    data ?? "0x"
  ];
  if (signature) {
    const v = (() => {
      if (signature.v >= 35n) {
        const inferredChainId = (signature.v - 35n) / 2n;
        if (inferredChainId > 0)
          return signature.v;
        return 27n + (signature.v === 35n ? 0n : 1n);
      }
      if (chainId > 0)
        return BigInt(chainId * 2) + BigInt(35n + signature.v - 27n);
      const v2 = 27n + (signature.v === 27n ? 0n : 1n);
      if (signature.v !== v2)
        throw new InvalidLegacyVError({ v: signature.v });
      return v2;
    })();
    const r = trim(signature.r);
    const s = trim(signature.s);
    serializedTransaction = [
      ...serializedTransaction,
      numberToHex(v),
      r === "0x00" ? "0x" : r,
      s === "0x00" ? "0x" : s
    ];
  } else if (chainId > 0) {
    serializedTransaction = [
      ...serializedTransaction,
      numberToHex(chainId),
      "0x",
      "0x"
    ];
  }
  return toRlp(serializedTransaction);
}
__name(serializeTransactionLegacy, "serializeTransactionLegacy");
function toYParitySignatureArray(transaction, signature_) {
  const signature = signature_ ?? transaction;
  const { v, yParity } = signature;
  if (typeof signature.r === "undefined")
    return [];
  if (typeof signature.s === "undefined")
    return [];
  if (typeof v === "undefined" && typeof yParity === "undefined")
    return [];
  const r = trim(signature.r);
  const s = trim(signature.s);
  const yParity_ = (() => {
    if (typeof yParity === "number")
      return yParity ? numberToHex(1) : "0x";
    if (v === 0n)
      return "0x";
    if (v === 1n)
      return numberToHex(1);
    return v === 27n ? "0x" : numberToHex(1);
  })();
  return [yParity_, r === "0x00" ? "0x" : r, s === "0x00" ? "0x" : s];
}
__name(toYParitySignatureArray, "toYParitySignatureArray");

// node_modules/viem/_esm/utils/authorization/serializeAuthorizationList.js
function serializeAuthorizationList(authorizationList) {
  if (!authorizationList || authorizationList.length === 0)
    return [];
  const serializedAuthorizationList = [];
  for (const authorization of authorizationList) {
    const { chainId, nonce, ...signature } = authorization;
    const contractAddress = authorization.address;
    serializedAuthorizationList.push([
      chainId ? toHex(chainId) : "0x",
      contractAddress,
      nonce ? toHex(nonce) : "0x",
      ...toYParitySignatureArray({}, signature)
    ]);
  }
  return serializedAuthorizationList;
}
__name(serializeAuthorizationList, "serializeAuthorizationList");

// node_modules/viem/_esm/utils/index.js
init_fromHex();

// node_modules/viem/_esm/utils/signature/hashMessage.js
init_checked_fetch();
init_modules_watch_stub();
init_keccak256();

// node_modules/viem/_esm/utils/signature/toPrefixedMessage.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/constants/strings.js
init_checked_fetch();
init_modules_watch_stub();
var presignMessagePrefix = "Ethereum Signed Message:\n";

// node_modules/viem/_esm/utils/signature/toPrefixedMessage.js
init_concat();
init_size();
init_toHex();
function toPrefixedMessage(message_) {
  const message = (() => {
    if (typeof message_ === "string")
      return stringToHex(message_);
    if (typeof message_.raw === "string")
      return message_.raw;
    return bytesToHex(message_.raw);
  })();
  const prefix = stringToHex(`${presignMessagePrefix}${size(message)}`);
  return concat([prefix, message]);
}
__name(toPrefixedMessage, "toPrefixedMessage");

// node_modules/viem/_esm/utils/signature/hashMessage.js
function hashMessage(message, to_) {
  return keccak256(toPrefixedMessage(message), to_);
}
__name(hashMessage, "hashMessage");

// node_modules/viem/_esm/utils/signature/isErc6492Signature.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/constants/bytes.js
init_checked_fetch();
init_modules_watch_stub();
var erc6492MagicBytes = "0x6492649264926492649264926492649264926492649264926492649264926492";

// node_modules/viem/_esm/utils/signature/isErc6492Signature.js
init_slice();
function isErc6492Signature(signature) {
  return sliceHex(signature, -32) === erc6492MagicBytes;
}
__name(isErc6492Signature, "isErc6492Signature");

// node_modules/viem/_esm/utils/signature/serializeErc6492Signature.js
init_checked_fetch();
init_modules_watch_stub();
init_encodeAbiParameters();
init_concat();
init_toBytes();
function serializeErc6492Signature(parameters) {
  const { address, data, signature, to = "hex" } = parameters;
  const signature_ = concatHex([
    encodeAbiParameters([{ type: "address" }, { type: "bytes" }, { type: "bytes" }], [address, data, signature]),
    erc6492MagicBytes
  ]);
  if (to === "hex")
    return signature_;
  return hexToBytes(signature_);
}
__name(serializeErc6492Signature, "serializeErc6492Signature");

// node_modules/viem/_esm/utils/formatters/proof.js
function formatStorageProof(storageProof) {
  return storageProof.map((proof) => ({
    ...proof,
    value: BigInt(proof.value)
  }));
}
__name(formatStorageProof, "formatStorageProof");
function formatProof(proof) {
  return {
    ...proof,
    balance: proof.balance ? BigInt(proof.balance) : void 0,
    nonce: proof.nonce ? hexToNumber(proof.nonce) : void 0,
    storageProof: proof.storageProof ? formatStorageProof(proof.storageProof) : void 0
  };
}
__name(formatProof, "formatProof");

// node_modules/viem/_esm/actions/public/getProof.js
async function getProof(client, { address, blockNumber, blockTag: blockTag_, storageKeys }) {
  const blockTag = blockTag_ ?? "latest";
  const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
  const proof = await client.request({
    method: "eth_getProof",
    params: [address, storageKeys, blockNumberHex || blockTag]
  });
  return formatProof(proof);
}
__name(getProof, "getProof");

// node_modules/viem/_esm/actions/public/getStorageAt.js
init_checked_fetch();
init_modules_watch_stub();
init_toHex();
async function getStorageAt(client, { address, blockNumber, blockTag = "latest", slot }) {
  const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
  const data = await client.request({
    method: "eth_getStorageAt",
    params: [address, slot, blockNumberHex || blockTag]
  });
  return data;
}
__name(getStorageAt, "getStorageAt");

// node_modules/viem/_esm/actions/public/getTransaction.js
init_checked_fetch();
init_modules_watch_stub();
init_transaction();
init_toHex();
async function getTransaction(client, { blockHash, blockNumber, blockTag: blockTag_, hash: hash2, index: index2 }) {
  const blockTag = blockTag_ || "latest";
  const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
  let transaction = null;
  if (hash2) {
    transaction = await client.request({
      method: "eth_getTransactionByHash",
      params: [hash2]
    }, { dedupe: true });
  } else if (blockHash) {
    transaction = await client.request({
      method: "eth_getTransactionByBlockHashAndIndex",
      params: [blockHash, numberToHex(index2)]
    }, { dedupe: true });
  } else if (blockNumberHex || blockTag) {
    transaction = await client.request({
      method: "eth_getTransactionByBlockNumberAndIndex",
      params: [blockNumberHex || blockTag, numberToHex(index2)]
    }, { dedupe: Boolean(blockNumberHex) });
  }
  if (!transaction)
    throw new TransactionNotFoundError({
      blockHash,
      blockNumber,
      blockTag,
      hash: hash2,
      index: index2
    });
  const format = client.chain?.formatters?.transaction?.format || formatTransaction;
  return format(transaction);
}
__name(getTransaction, "getTransaction");

// node_modules/viem/_esm/actions/public/getTransactionConfirmations.js
init_checked_fetch();
init_modules_watch_stub();
async function getTransactionConfirmations(client, { hash: hash2, transactionReceipt }) {
  const [blockNumber, transaction] = await Promise.all([
    getAction(client, getBlockNumber, "getBlockNumber")({}),
    hash2 ? getAction(client, getTransaction, "getTransaction")({ hash: hash2 }) : void 0
  ]);
  const transactionBlockNumber = transactionReceipt?.blockNumber || transaction?.blockNumber;
  if (!transactionBlockNumber)
    return 0n;
  return blockNumber - transactionBlockNumber + 1n;
}
__name(getTransactionConfirmations, "getTransactionConfirmations");

// node_modules/viem/_esm/actions/public/getTransactionReceipt.js
init_checked_fetch();
init_modules_watch_stub();
init_transaction();
async function getTransactionReceipt(client, { hash: hash2 }) {
  const receipt = await client.request({
    method: "eth_getTransactionReceipt",
    params: [hash2]
  }, { dedupe: true });
  if (!receipt)
    throw new TransactionReceiptNotFoundError({ hash: hash2 });
  const format = client.chain?.formatters?.transactionReceipt?.format || formatTransactionReceipt;
  return format(receipt);
}
__name(getTransactionReceipt, "getTransactionReceipt");

// node_modules/viem/_esm/actions/public/multicall.js
init_checked_fetch();
init_modules_watch_stub();
init_abis();
init_abi();
init_base();
init_contract();
init_decodeFunctionResult();
init_encodeFunctionData();
init_getChainContractAddress();
async function multicall(client, parameters) {
  const { account, allowFailure = true, batchSize: batchSize_, blockNumber, blockTag, multicallAddress: multicallAddress_, stateOverride } = parameters;
  const contracts = parameters.contracts;
  const batchSize = batchSize_ ?? (typeof client.batch?.multicall === "object" && client.batch.multicall.batchSize || 1024);
  let multicallAddress = multicallAddress_;
  if (!multicallAddress) {
    if (!client.chain)
      throw new Error("client chain not configured. multicallAddress is required.");
    multicallAddress = getChainContractAddress({
      blockNumber,
      chain: client.chain,
      contract: "multicall3"
    });
  }
  const chunkedCalls = [[]];
  let currentChunk = 0;
  let currentChunkSize = 0;
  for (let i = 0; i < contracts.length; i++) {
    const { abi: abi2, address, args, functionName } = contracts[i];
    try {
      const callData = encodeFunctionData({ abi: abi2, args, functionName });
      currentChunkSize += (callData.length - 2) / 2;
      if (
        // Check if batching is enabled.
        batchSize > 0 && // Check if the current size of the batch exceeds the size limit.
        currentChunkSize > batchSize && // Check if the current chunk is not already empty.
        chunkedCalls[currentChunk].length > 0
      ) {
        currentChunk++;
        currentChunkSize = (callData.length - 2) / 2;
        chunkedCalls[currentChunk] = [];
      }
      chunkedCalls[currentChunk] = [
        ...chunkedCalls[currentChunk],
        {
          allowFailure: true,
          callData,
          target: address
        }
      ];
    } catch (err) {
      const error = getContractError(err, {
        abi: abi2,
        address,
        args,
        docsPath: "/docs/contract/multicall",
        functionName,
        sender: account
      });
      if (!allowFailure)
        throw error;
      chunkedCalls[currentChunk] = [
        ...chunkedCalls[currentChunk],
        {
          allowFailure: true,
          callData: "0x",
          target: address
        }
      ];
    }
  }
  const aggregate3Results = await Promise.allSettled(chunkedCalls.map((calls) => getAction(client, readContract, "readContract")({
    abi: multicall3Abi,
    account,
    address: multicallAddress,
    args: [calls],
    blockNumber,
    blockTag,
    functionName: "aggregate3",
    stateOverride
  })));
  const results = [];
  for (let i = 0; i < aggregate3Results.length; i++) {
    const result = aggregate3Results[i];
    if (result.status === "rejected") {
      if (!allowFailure)
        throw result.reason;
      for (let j = 0; j < chunkedCalls[i].length; j++) {
        results.push({
          status: "failure",
          error: result.reason,
          result: void 0
        });
      }
      continue;
    }
    const aggregate3Result = result.value;
    for (let j = 0; j < aggregate3Result.length; j++) {
      const { returnData, success } = aggregate3Result[j];
      const { callData } = chunkedCalls[i][j];
      const { abi: abi2, address, functionName, args } = contracts[results.length];
      try {
        if (callData === "0x")
          throw new AbiDecodingZeroDataError();
        if (!success)
          throw new RawContractError({ data: returnData });
        const result2 = decodeFunctionResult({
          abi: abi2,
          args,
          data: returnData,
          functionName
        });
        results.push(allowFailure ? { result: result2, status: "success" } : result2);
      } catch (err) {
        const error = getContractError(err, {
          abi: abi2,
          address,
          args,
          docsPath: "/docs/contract/multicall",
          functionName
        });
        if (!allowFailure)
          throw error;
        results.push({ error, result: void 0, status: "failure" });
      }
    }
  }
  if (results.length !== contracts.length)
    throw new BaseError2("multicall results mismatch");
  return results;
}
__name(multicall, "multicall");

// node_modules/viem/_esm/actions/public/simulateBlocks.js
init_checked_fetch();
init_modules_watch_stub();
init_BlockOverrides();
init_parseAccount();
init_abi();
init_contract();
init_node();
init_decodeFunctionResult();
init_encodeFunctionData();
init_concat();
init_toHex();
init_getNodeError();
init_transactionRequest();
init_stateOverride2();
init_assertRequest();
async function simulateBlocks(client, parameters) {
  const { blockNumber, blockTag = client.experimental_blockTag ?? "latest", blocks, returnFullTransactions, traceTransfers, validation } = parameters;
  try {
    const blockStateCalls = [];
    for (const block2 of blocks) {
      const blockOverrides = block2.blockOverrides ? toRpc2(block2.blockOverrides) : void 0;
      const calls = block2.calls.map((call_) => {
        const call2 = call_;
        const account = call2.account ? parseAccount(call2.account) : void 0;
        const data = call2.abi ? encodeFunctionData(call2) : call2.data;
        const request = {
          ...call2,
          data: call2.dataSuffix ? concat([data || "0x", call2.dataSuffix]) : data,
          from: call2.from ?? account?.address
        };
        assertRequest(request);
        return formatTransactionRequest(request);
      });
      const stateOverrides = block2.stateOverrides ? serializeStateOverride(block2.stateOverrides) : void 0;
      blockStateCalls.push({
        blockOverrides,
        calls,
        stateOverrides
      });
    }
    const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
    const block = blockNumberHex || blockTag;
    const result = await client.request({
      method: "eth_simulateV1",
      params: [
        { blockStateCalls, returnFullTransactions, traceTransfers, validation },
        block
      ]
    });
    return result.map((block2, i) => ({
      ...formatBlock(block2),
      calls: block2.calls.map((call2, j) => {
        const { abi: abi2, args, functionName, to } = blocks[i].calls[j];
        const data = call2.error?.data ?? call2.returnData;
        const gasUsed = BigInt(call2.gasUsed);
        const logs = call2.logs?.map((log) => formatLog(log));
        const status = call2.status === "0x1" ? "success" : "failure";
        const result2 = abi2 && status === "success" && data !== "0x" ? decodeFunctionResult({
          abi: abi2,
          data,
          functionName
        }) : null;
        const error = (() => {
          if (status === "success")
            return void 0;
          let error2 = void 0;
          if (call2.error?.data === "0x")
            error2 = new AbiDecodingZeroDataError();
          else if (call2.error)
            error2 = new RawContractError(call2.error);
          if (!error2)
            return void 0;
          return getContractError(error2, {
            abi: abi2 ?? [],
            address: to ?? "0x",
            args,
            functionName: functionName ?? "<unknown>"
          });
        })();
        return {
          data,
          gasUsed,
          logs,
          status,
          ...status === "success" ? {
            result: result2
          } : {
            error
          }
        };
      })
    }));
  } catch (e) {
    const cause = e;
    const error = getNodeError(cause, {});
    if (error instanceof UnknownNodeError)
      throw cause;
    throw error;
  }
}
__name(simulateBlocks, "simulateBlocks");

// node_modules/viem/_esm/actions/public/simulateCalls.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/node_modules/ox/_esm/core/AbiConstructor.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/node_modules/ox/_esm/core/AbiItem.js
init_checked_fetch();
init_modules_watch_stub();
init_exports();
init_Errors();

// node_modules/viem/node_modules/ox/_esm/core/Hash.js
init_checked_fetch();
init_modules_watch_stub();
init_sha3();
init_Bytes();
init_Hex();
function keccak2562(value, options = {}) {
  const { as = typeof value === "string" ? "Hex" : "Bytes" } = options;
  const bytes = keccak_256(from(value));
  if (as === "Bytes")
    return bytes;
  return fromBytes(bytes);
}
__name(keccak2562, "keccak256");

// node_modules/viem/node_modules/ox/_esm/core/AbiItem.js
init_Hex();

// node_modules/viem/node_modules/ox/_esm/core/internal/abiItem.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/node_modules/ox/_esm/core/Address.js
init_checked_fetch();
init_modules_watch_stub();
init_Bytes();

// node_modules/viem/node_modules/ox/_esm/core/Caches.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/node_modules/ox/_esm/core/internal/lru.js
init_checked_fetch();
init_modules_watch_stub();
var LruMap2 = class extends Map {
  static {
    __name(this, "LruMap");
  }
  constructor(size5) {
    super();
    Object.defineProperty(this, "maxSize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.maxSize = size5;
  }
  get(key) {
    const value = super.get(key);
    if (super.has(key) && value !== void 0) {
      this.delete(key);
      super.set(key, value);
    }
    return value;
  }
  set(key, value) {
    super.set(key, value);
    if (this.maxSize && this.size > this.maxSize) {
      const firstKey = this.keys().next().value;
      if (firstKey)
        this.delete(firstKey);
    }
    return this;
  }
};

// node_modules/viem/node_modules/ox/_esm/core/Caches.js
var caches = {
  checksum: /* @__PURE__ */ new LruMap2(8192)
};
var checksum = caches.checksum;

// node_modules/viem/node_modules/ox/_esm/core/Address.js
init_Errors();
var addressRegex2 = /^0x[a-fA-F0-9]{40}$/;
function assert2(value, options = {}) {
  const { strict = true } = options;
  if (!addressRegex2.test(value))
    throw new InvalidAddressError2({
      address: value,
      cause: new InvalidInputError()
    });
  if (strict) {
    if (value.toLowerCase() === value)
      return;
    if (checksum2(value) !== value)
      throw new InvalidAddressError2({
        address: value,
        cause: new InvalidChecksumError()
      });
  }
}
__name(assert2, "assert");
function checksum2(address) {
  if (checksum.has(address))
    return checksum.get(address);
  assert2(address, { strict: false });
  const hexAddress = address.substring(2).toLowerCase();
  const hash2 = keccak2562(fromString(hexAddress), { as: "Bytes" });
  const characters = hexAddress.split("");
  for (let i = 0; i < 40; i += 2) {
    if (hash2[i >> 1] >> 4 >= 8 && characters[i]) {
      characters[i] = characters[i].toUpperCase();
    }
    if ((hash2[i >> 1] & 15) >= 8 && characters[i + 1]) {
      characters[i + 1] = characters[i + 1].toUpperCase();
    }
  }
  const result = `0x${characters.join("")}`;
  checksum.set(address, result);
  return result;
}
__name(checksum2, "checksum");
function validate2(address, options = {}) {
  const { strict = true } = options ?? {};
  try {
    assert2(address, { strict });
    return true;
  } catch {
    return false;
  }
}
__name(validate2, "validate");
var InvalidAddressError2 = class extends BaseError3 {
  static {
    __name(this, "InvalidAddressError");
  }
  constructor({ address, cause }) {
    super(`Address "${address}" is invalid.`, {
      cause
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Address.InvalidAddressError"
    });
  }
};
var InvalidInputError = class extends BaseError3 {
  static {
    __name(this, "InvalidInputError");
  }
  constructor() {
    super("Address is not a 20 byte (40 hexadecimal character) value.");
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Address.InvalidInputError"
    });
  }
};
var InvalidChecksumError = class extends BaseError3 {
  static {
    __name(this, "InvalidChecksumError");
  }
  constructor() {
    super("Address does not match its checksum counterpart.");
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Address.InvalidChecksumError"
    });
  }
};

// node_modules/viem/node_modules/ox/_esm/core/internal/abiItem.js
init_Errors();
function normalizeSignature2(signature) {
  let active = true;
  let current = "";
  let level = 0;
  let result = "";
  let valid = false;
  for (let i = 0; i < signature.length; i++) {
    const char = signature[i];
    if (["(", ")", ","].includes(char))
      active = true;
    if (char === "(")
      level++;
    if (char === ")")
      level--;
    if (!active)
      continue;
    if (level === 0) {
      if (char === " " && ["event", "function", "error", ""].includes(result))
        result = "";
      else {
        result += char;
        if (char === ")") {
          valid = true;
          break;
        }
      }
      continue;
    }
    if (char === " ") {
      if (signature[i - 1] !== "," && current !== "," && current !== ",(") {
        current = "";
        active = false;
      }
      continue;
    }
    result += char;
    current += char;
  }
  if (!valid)
    throw new BaseError3("Unable to normalize signature.");
  return result;
}
__name(normalizeSignature2, "normalizeSignature");
function isArgOfType2(arg, abiParameter) {
  const argType = typeof arg;
  const abiParameterType = abiParameter.type;
  switch (abiParameterType) {
    case "address":
      return validate2(arg, { strict: false });
    case "bool":
      return argType === "boolean";
    case "function":
      return argType === "string";
    case "string":
      return argType === "string";
    default: {
      if (abiParameterType === "tuple" && "components" in abiParameter)
        return Object.values(abiParameter.components).every((component, index2) => {
          return isArgOfType2(Object.values(arg)[index2], component);
        });
      if (/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(abiParameterType))
        return argType === "number" || argType === "bigint";
      if (/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(abiParameterType))
        return argType === "string" || arg instanceof Uint8Array;
      if (/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(abiParameterType)) {
        return Array.isArray(arg) && arg.every((x) => isArgOfType2(x, {
          ...abiParameter,
          // Pop off `[]` or `[M]` from end of type
          type: abiParameterType.replace(/(\[[0-9]{0,}\])$/, "")
        }));
      }
      return false;
    }
  }
}
__name(isArgOfType2, "isArgOfType");
function getAmbiguousTypes2(sourceParameters, targetParameters, args) {
  for (const parameterIndex in sourceParameters) {
    const sourceParameter = sourceParameters[parameterIndex];
    const targetParameter = targetParameters[parameterIndex];
    if (sourceParameter.type === "tuple" && targetParameter.type === "tuple" && "components" in sourceParameter && "components" in targetParameter)
      return getAmbiguousTypes2(sourceParameter.components, targetParameter.components, args[parameterIndex]);
    const types = [sourceParameter.type, targetParameter.type];
    const ambiguous = (() => {
      if (types.includes("address") && types.includes("bytes20"))
        return true;
      if (types.includes("address") && types.includes("string"))
        return validate2(args[parameterIndex], {
          strict: false
        });
      if (types.includes("address") && types.includes("bytes"))
        return validate2(args[parameterIndex], {
          strict: false
        });
      return false;
    })();
    if (ambiguous)
      return types;
  }
  return;
}
__name(getAmbiguousTypes2, "getAmbiguousTypes");

// node_modules/viem/node_modules/ox/_esm/core/AbiItem.js
function from2(abiItem, options = {}) {
  const { prepare = true } = options;
  const item = (() => {
    if (Array.isArray(abiItem))
      return parseAbiItem(abiItem);
    if (typeof abiItem === "string")
      return parseAbiItem(abiItem);
    return abiItem;
  })();
  return {
    ...item,
    ...prepare ? { hash: getSignatureHash(item) } : {}
  };
}
__name(from2, "from");
function fromAbi(abi2, name, options) {
  const { args = [], prepare = true } = options ?? {};
  const isSelector = validate(name, { strict: false });
  const abiItems = abi2.filter((abiItem2) => {
    if (isSelector) {
      if (abiItem2.type === "function" || abiItem2.type === "error")
        return getSelector(abiItem2) === slice2(name, 0, 4);
      if (abiItem2.type === "event")
        return getSignatureHash(abiItem2) === name;
      return false;
    }
    return "name" in abiItem2 && abiItem2.name === name;
  });
  if (abiItems.length === 0)
    throw new NotFoundError({ name });
  if (abiItems.length === 1)
    return {
      ...abiItems[0],
      ...prepare ? { hash: getSignatureHash(abiItems[0]) } : {}
    };
  let matchedAbiItem = void 0;
  for (const abiItem2 of abiItems) {
    if (!("inputs" in abiItem2))
      continue;
    if (!args || args.length === 0) {
      if (!abiItem2.inputs || abiItem2.inputs.length === 0)
        return {
          ...abiItem2,
          ...prepare ? { hash: getSignatureHash(abiItem2) } : {}
        };
      continue;
    }
    if (!abiItem2.inputs)
      continue;
    if (abiItem2.inputs.length === 0)
      continue;
    if (abiItem2.inputs.length !== args.length)
      continue;
    const matched = args.every((arg, index2) => {
      const abiParameter = "inputs" in abiItem2 && abiItem2.inputs[index2];
      if (!abiParameter)
        return false;
      return isArgOfType2(arg, abiParameter);
    });
    if (matched) {
      if (matchedAbiItem && "inputs" in matchedAbiItem && matchedAbiItem.inputs) {
        const ambiguousTypes = getAmbiguousTypes2(abiItem2.inputs, matchedAbiItem.inputs, args);
        if (ambiguousTypes)
          throw new AmbiguityError({
            abiItem: abiItem2,
            type: ambiguousTypes[0]
          }, {
            abiItem: matchedAbiItem,
            type: ambiguousTypes[1]
          });
      }
      matchedAbiItem = abiItem2;
    }
  }
  const abiItem = (() => {
    if (matchedAbiItem)
      return matchedAbiItem;
    const [abiItem2, ...overloads] = abiItems;
    return { ...abiItem2, overloads };
  })();
  if (!abiItem)
    throw new NotFoundError({ name });
  return {
    ...abiItem,
    ...prepare ? { hash: getSignatureHash(abiItem) } : {}
  };
}
__name(fromAbi, "fromAbi");
function getSelector(abiItem) {
  return slice2(getSignatureHash(abiItem), 0, 4);
}
__name(getSelector, "getSelector");
function getSignature(abiItem) {
  const signature = (() => {
    if (typeof abiItem === "string")
      return abiItem;
    return formatAbiItem(abiItem);
  })();
  return normalizeSignature2(signature);
}
__name(getSignature, "getSignature");
function getSignatureHash(abiItem) {
  if (typeof abiItem !== "string" && "hash" in abiItem && abiItem.hash)
    return abiItem.hash;
  return keccak2562(fromString2(getSignature(abiItem)));
}
__name(getSignatureHash, "getSignatureHash");
var AmbiguityError = class extends BaseError3 {
  static {
    __name(this, "AmbiguityError");
  }
  constructor(x, y) {
    super("Found ambiguous types in overloaded ABI Items.", {
      metaMessages: [
        // TODO: abitype to add support for signature-formatted ABI items.
        `\`${x.type}\` in \`${normalizeSignature2(formatAbiItem(x.abiItem))}\`, and`,
        `\`${y.type}\` in \`${normalizeSignature2(formatAbiItem(y.abiItem))}\``,
        "",
        "These types encode differently and cannot be distinguished at runtime.",
        "Remove one of the ambiguous items in the ABI."
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiItem.AmbiguityError"
    });
  }
};
var NotFoundError = class extends BaseError3 {
  static {
    __name(this, "NotFoundError");
  }
  constructor({ name, data, type = "item" }) {
    const selector = (() => {
      if (name)
        return ` with name "${name}"`;
      if (data)
        return ` with data "${data}"`;
      return "";
    })();
    super(`ABI ${type}${selector} not found.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiItem.NotFoundError"
    });
  }
};

// node_modules/viem/node_modules/ox/_esm/core/AbiParameters.js
init_checked_fetch();
init_modules_watch_stub();
init_Errors();
init_Hex();

// node_modules/viem/node_modules/ox/_esm/core/Solidity.js
init_checked_fetch();
init_modules_watch_stub();
var arrayRegex = /^(.*)\[([0-9]*)\]$/;
var bytesRegex3 = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
var integerRegex3 = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
var maxInt82 = 2n ** (8n - 1n) - 1n;
var maxInt162 = 2n ** (16n - 1n) - 1n;
var maxInt242 = 2n ** (24n - 1n) - 1n;
var maxInt322 = 2n ** (32n - 1n) - 1n;
var maxInt402 = 2n ** (40n - 1n) - 1n;
var maxInt482 = 2n ** (48n - 1n) - 1n;
var maxInt562 = 2n ** (56n - 1n) - 1n;
var maxInt642 = 2n ** (64n - 1n) - 1n;
var maxInt722 = 2n ** (72n - 1n) - 1n;
var maxInt802 = 2n ** (80n - 1n) - 1n;
var maxInt882 = 2n ** (88n - 1n) - 1n;
var maxInt962 = 2n ** (96n - 1n) - 1n;
var maxInt1042 = 2n ** (104n - 1n) - 1n;
var maxInt1122 = 2n ** (112n - 1n) - 1n;
var maxInt1202 = 2n ** (120n - 1n) - 1n;
var maxInt1282 = 2n ** (128n - 1n) - 1n;
var maxInt1362 = 2n ** (136n - 1n) - 1n;
var maxInt1442 = 2n ** (144n - 1n) - 1n;
var maxInt1522 = 2n ** (152n - 1n) - 1n;
var maxInt1602 = 2n ** (160n - 1n) - 1n;
var maxInt1682 = 2n ** (168n - 1n) - 1n;
var maxInt1762 = 2n ** (176n - 1n) - 1n;
var maxInt1842 = 2n ** (184n - 1n) - 1n;
var maxInt1922 = 2n ** (192n - 1n) - 1n;
var maxInt2002 = 2n ** (200n - 1n) - 1n;
var maxInt2082 = 2n ** (208n - 1n) - 1n;
var maxInt2162 = 2n ** (216n - 1n) - 1n;
var maxInt2242 = 2n ** (224n - 1n) - 1n;
var maxInt2322 = 2n ** (232n - 1n) - 1n;
var maxInt2402 = 2n ** (240n - 1n) - 1n;
var maxInt2482 = 2n ** (248n - 1n) - 1n;
var maxInt2562 = 2n ** (256n - 1n) - 1n;
var minInt82 = -(2n ** (8n - 1n));
var minInt162 = -(2n ** (16n - 1n));
var minInt242 = -(2n ** (24n - 1n));
var minInt322 = -(2n ** (32n - 1n));
var minInt402 = -(2n ** (40n - 1n));
var minInt482 = -(2n ** (48n - 1n));
var minInt562 = -(2n ** (56n - 1n));
var minInt642 = -(2n ** (64n - 1n));
var minInt722 = -(2n ** (72n - 1n));
var minInt802 = -(2n ** (80n - 1n));
var minInt882 = -(2n ** (88n - 1n));
var minInt962 = -(2n ** (96n - 1n));
var minInt1042 = -(2n ** (104n - 1n));
var minInt1122 = -(2n ** (112n - 1n));
var minInt1202 = -(2n ** (120n - 1n));
var minInt1282 = -(2n ** (128n - 1n));
var minInt1362 = -(2n ** (136n - 1n));
var minInt1442 = -(2n ** (144n - 1n));
var minInt1522 = -(2n ** (152n - 1n));
var minInt1602 = -(2n ** (160n - 1n));
var minInt1682 = -(2n ** (168n - 1n));
var minInt1762 = -(2n ** (176n - 1n));
var minInt1842 = -(2n ** (184n - 1n));
var minInt1922 = -(2n ** (192n - 1n));
var minInt2002 = -(2n ** (200n - 1n));
var minInt2082 = -(2n ** (208n - 1n));
var minInt2162 = -(2n ** (216n - 1n));
var minInt2242 = -(2n ** (224n - 1n));
var minInt2322 = -(2n ** (232n - 1n));
var minInt2402 = -(2n ** (240n - 1n));
var minInt2482 = -(2n ** (248n - 1n));
var minInt2562 = -(2n ** (256n - 1n));
var maxUint82 = 2n ** 8n - 1n;
var maxUint162 = 2n ** 16n - 1n;
var maxUint242 = 2n ** 24n - 1n;
var maxUint322 = 2n ** 32n - 1n;
var maxUint402 = 2n ** 40n - 1n;
var maxUint482 = 2n ** 48n - 1n;
var maxUint562 = 2n ** 56n - 1n;
var maxUint642 = 2n ** 64n - 1n;
var maxUint722 = 2n ** 72n - 1n;
var maxUint802 = 2n ** 80n - 1n;
var maxUint882 = 2n ** 88n - 1n;
var maxUint962 = 2n ** 96n - 1n;
var maxUint1042 = 2n ** 104n - 1n;
var maxUint1122 = 2n ** 112n - 1n;
var maxUint1202 = 2n ** 120n - 1n;
var maxUint1282 = 2n ** 128n - 1n;
var maxUint1362 = 2n ** 136n - 1n;
var maxUint1442 = 2n ** 144n - 1n;
var maxUint1522 = 2n ** 152n - 1n;
var maxUint1602 = 2n ** 160n - 1n;
var maxUint1682 = 2n ** 168n - 1n;
var maxUint1762 = 2n ** 176n - 1n;
var maxUint1842 = 2n ** 184n - 1n;
var maxUint1922 = 2n ** 192n - 1n;
var maxUint2002 = 2n ** 200n - 1n;
var maxUint2082 = 2n ** 208n - 1n;
var maxUint2162 = 2n ** 216n - 1n;
var maxUint2242 = 2n ** 224n - 1n;
var maxUint2322 = 2n ** 232n - 1n;
var maxUint2402 = 2n ** 240n - 1n;
var maxUint2482 = 2n ** 248n - 1n;
var maxUint2562 = 2n ** 256n - 1n;

// node_modules/viem/node_modules/ox/_esm/core/internal/abiParameters.js
init_checked_fetch();
init_modules_watch_stub();
init_Errors();
init_Hex();
function prepareParameters({ checksumAddress: checksumAddress2, parameters, values }) {
  const preparedParameters = [];
  for (let i = 0; i < parameters.length; i++) {
    preparedParameters.push(prepareParameter({
      checksumAddress: checksumAddress2,
      parameter: parameters[i],
      value: values[i]
    }));
  }
  return preparedParameters;
}
__name(prepareParameters, "prepareParameters");
function prepareParameter({ checksumAddress: checksumAddress2 = false, parameter: parameter_, value }) {
  const parameter = parameter_;
  const arrayComponents = getArrayComponents2(parameter.type);
  if (arrayComponents) {
    const [length, type] = arrayComponents;
    return encodeArray2(value, {
      checksumAddress: checksumAddress2,
      length,
      parameter: {
        ...parameter,
        type
      }
    });
  }
  if (parameter.type === "tuple") {
    return encodeTuple2(value, {
      checksumAddress: checksumAddress2,
      parameter
    });
  }
  if (parameter.type === "address") {
    return encodeAddress2(value, {
      checksum: checksumAddress2
    });
  }
  if (parameter.type === "bool") {
    return encodeBoolean(value);
  }
  if (parameter.type.startsWith("uint") || parameter.type.startsWith("int")) {
    const signed = parameter.type.startsWith("int");
    const [, , size5 = "256"] = integerRegex3.exec(parameter.type) ?? [];
    return encodeNumber2(value, {
      signed,
      size: Number(size5)
    });
  }
  if (parameter.type.startsWith("bytes")) {
    return encodeBytes2(value, { type: parameter.type });
  }
  if (parameter.type === "string") {
    return encodeString2(value);
  }
  throw new InvalidTypeError(parameter.type);
}
__name(prepareParameter, "prepareParameter");
function encode(preparedParameters) {
  let staticSize = 0;
  for (let i = 0; i < preparedParameters.length; i++) {
    const { dynamic, encoded } = preparedParameters[i];
    if (dynamic)
      staticSize += 32;
    else
      staticSize += size3(encoded);
  }
  const staticParameters = [];
  const dynamicParameters = [];
  let dynamicSize = 0;
  for (let i = 0; i < preparedParameters.length; i++) {
    const { dynamic, encoded } = preparedParameters[i];
    if (dynamic) {
      staticParameters.push(fromNumber(staticSize + dynamicSize, { size: 32 }));
      dynamicParameters.push(encoded);
      dynamicSize += size3(encoded);
    } else {
      staticParameters.push(encoded);
    }
  }
  return concat2(...staticParameters, ...dynamicParameters);
}
__name(encode, "encode");
function encodeAddress2(value, options) {
  const { checksum: checksum3 = false } = options;
  assert2(value, { strict: checksum3 });
  return {
    dynamic: false,
    encoded: padLeft(value.toLowerCase())
  };
}
__name(encodeAddress2, "encodeAddress");
function encodeArray2(value, options) {
  const { checksumAddress: checksumAddress2, length, parameter } = options;
  const dynamic = length === null;
  if (!Array.isArray(value))
    throw new InvalidArrayError2(value);
  if (!dynamic && value.length !== length)
    throw new ArrayLengthMismatchError({
      expectedLength: length,
      givenLength: value.length,
      type: `${parameter.type}[${length}]`
    });
  let dynamicChild = false;
  const preparedParameters = [];
  for (let i = 0; i < value.length; i++) {
    const preparedParam = prepareParameter({
      checksumAddress: checksumAddress2,
      parameter,
      value: value[i]
    });
    if (preparedParam.dynamic)
      dynamicChild = true;
    preparedParameters.push(preparedParam);
  }
  if (dynamic || dynamicChild) {
    const data = encode(preparedParameters);
    if (dynamic) {
      const length2 = fromNumber(preparedParameters.length, { size: 32 });
      return {
        dynamic: true,
        encoded: preparedParameters.length > 0 ? concat2(length2, data) : length2
      };
    }
    if (dynamicChild)
      return { dynamic: true, encoded: data };
  }
  return {
    dynamic: false,
    encoded: concat2(...preparedParameters.map(({ encoded }) => encoded))
  };
}
__name(encodeArray2, "encodeArray");
function encodeBytes2(value, { type }) {
  const [, parametersize] = type.split("bytes");
  const bytesSize = size3(value);
  if (!parametersize) {
    let value_ = value;
    if (bytesSize % 32 !== 0)
      value_ = padRight(value_, Math.ceil((value.length - 2) / 2 / 32) * 32);
    return {
      dynamic: true,
      encoded: concat2(padLeft(fromNumber(bytesSize, { size: 32 })), value_)
    };
  }
  if (bytesSize !== Number.parseInt(parametersize))
    throw new BytesSizeMismatchError2({
      expectedSize: Number.parseInt(parametersize),
      value
    });
  return { dynamic: false, encoded: padRight(value) };
}
__name(encodeBytes2, "encodeBytes");
function encodeBoolean(value) {
  if (typeof value !== "boolean")
    throw new BaseError3(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
  return { dynamic: false, encoded: padLeft(fromBoolean(value)) };
}
__name(encodeBoolean, "encodeBoolean");
function encodeNumber2(value, { signed, size: size5 }) {
  if (typeof size5 === "number") {
    const max = 2n ** (BigInt(size5) - (signed ? 1n : 0n)) - 1n;
    const min = signed ? -max - 1n : 0n;
    if (value > max || value < min)
      throw new IntegerOutOfRangeError2({
        max: max.toString(),
        min: min.toString(),
        signed,
        size: size5 / 8,
        value: value.toString()
      });
  }
  return {
    dynamic: false,
    encoded: fromNumber(value, {
      size: 32,
      signed
    })
  };
}
__name(encodeNumber2, "encodeNumber");
function encodeString2(value) {
  const hexValue = fromString2(value);
  const partsLength = Math.ceil(size3(hexValue) / 32);
  const parts = [];
  for (let i = 0; i < partsLength; i++) {
    parts.push(padRight(slice2(hexValue, i * 32, (i + 1) * 32)));
  }
  return {
    dynamic: true,
    encoded: concat2(padRight(fromNumber(size3(hexValue), { size: 32 })), ...parts)
  };
}
__name(encodeString2, "encodeString");
function encodeTuple2(value, options) {
  const { checksumAddress: checksumAddress2, parameter } = options;
  let dynamic = false;
  const preparedParameters = [];
  for (let i = 0; i < parameter.components.length; i++) {
    const param_ = parameter.components[i];
    const index2 = Array.isArray(value) ? i : param_.name;
    const preparedParam = prepareParameter({
      checksumAddress: checksumAddress2,
      parameter: param_,
      value: value[index2]
    });
    preparedParameters.push(preparedParam);
    if (preparedParam.dynamic)
      dynamic = true;
  }
  return {
    dynamic,
    encoded: dynamic ? encode(preparedParameters) : concat2(...preparedParameters.map(({ encoded }) => encoded))
  };
}
__name(encodeTuple2, "encodeTuple");
function getArrayComponents2(type) {
  const matches = type.match(/^(.*)\[(\d+)?\]$/);
  return matches ? (
    // Return `null` if the array is dynamic.
    [matches[2] ? Number(matches[2]) : null, matches[1]]
  ) : void 0;
}
__name(getArrayComponents2, "getArrayComponents");

// node_modules/viem/node_modules/ox/_esm/core/AbiParameters.js
function encode2(parameters, values, options) {
  const { checksumAddress: checksumAddress2 = false } = options ?? {};
  if (parameters.length !== values.length)
    throw new LengthMismatchError({
      expectedLength: parameters.length,
      givenLength: values.length
    });
  const preparedParameters = prepareParameters({
    checksumAddress: checksumAddress2,
    parameters,
    values
  });
  const data = encode(preparedParameters);
  if (data.length === 0)
    return "0x";
  return data;
}
__name(encode2, "encode");
function encodePacked(types, values) {
  if (types.length !== values.length)
    throw new LengthMismatchError({
      expectedLength: types.length,
      givenLength: values.length
    });
  const data = [];
  for (let i = 0; i < types.length; i++) {
    const type = types[i];
    const value = values[i];
    data.push(encodePacked.encode(type, value));
  }
  return concat2(...data);
}
__name(encodePacked, "encodePacked");
(function(encodePacked2) {
  function encode4(type, value, isArray = false) {
    if (type === "address") {
      const address = value;
      assert2(address);
      return padLeft(address.toLowerCase(), isArray ? 32 : 0);
    }
    if (type === "string")
      return fromString2(value);
    if (type === "bytes")
      return value;
    if (type === "bool")
      return padLeft(fromBoolean(value), isArray ? 32 : 1);
    const intMatch = type.match(integerRegex3);
    if (intMatch) {
      const [_type, baseType, bits = "256"] = intMatch;
      const size5 = Number.parseInt(bits) / 8;
      return fromNumber(value, {
        size: isArray ? 32 : size5,
        signed: baseType === "int"
      });
    }
    const bytesMatch = type.match(bytesRegex3);
    if (bytesMatch) {
      const [_type, size5] = bytesMatch;
      if (Number.parseInt(size5) !== (value.length - 2) / 2)
        throw new BytesSizeMismatchError2({
          expectedSize: Number.parseInt(size5),
          value
        });
      return padRight(value, isArray ? 32 : 0);
    }
    const arrayMatch = type.match(arrayRegex);
    if (arrayMatch && Array.isArray(value)) {
      const [_type, childType] = arrayMatch;
      const data = [];
      for (let i = 0; i < value.length; i++) {
        data.push(encode4(childType, value[i], true));
      }
      if (data.length === 0)
        return "0x";
      return concat2(...data);
    }
    throw new InvalidTypeError(type);
  }
  __name(encode4, "encode");
  encodePacked2.encode = encode4;
})(encodePacked || (encodePacked = {}));
var ArrayLengthMismatchError = class extends BaseError3 {
  static {
    __name(this, "ArrayLengthMismatchError");
  }
  constructor({ expectedLength, givenLength, type }) {
    super(`Array length mismatch for type \`${type}\`. Expected: \`${expectedLength}\`. Given: \`${givenLength}\`.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiParameters.ArrayLengthMismatchError"
    });
  }
};
var BytesSizeMismatchError2 = class extends BaseError3 {
  static {
    __name(this, "BytesSizeMismatchError");
  }
  constructor({ expectedSize, value }) {
    super(`Size of bytes "${value}" (bytes${size3(value)}) does not match expected size (bytes${expectedSize}).`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiParameters.BytesSizeMismatchError"
    });
  }
};
var LengthMismatchError = class extends BaseError3 {
  static {
    __name(this, "LengthMismatchError");
  }
  constructor({ expectedLength, givenLength }) {
    super([
      "ABI encoding parameters/values length mismatch.",
      `Expected length (parameters): ${expectedLength}`,
      `Given length (values): ${givenLength}`
    ].join("\n"));
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiParameters.LengthMismatchError"
    });
  }
};
var InvalidArrayError2 = class extends BaseError3 {
  static {
    __name(this, "InvalidArrayError");
  }
  constructor(value) {
    super(`Value \`${value}\` is not a valid array.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiParameters.InvalidArrayError"
    });
  }
};
var InvalidTypeError = class extends BaseError3 {
  static {
    __name(this, "InvalidTypeError");
  }
  constructor(type) {
    super(`Type \`${type}\` is not a valid ABI Type.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiParameters.InvalidTypeError"
    });
  }
};

// node_modules/viem/node_modules/ox/_esm/core/AbiConstructor.js
init_Hex();
function encode3(abiConstructor, options) {
  const { bytecode, args } = options;
  return concat2(bytecode, abiConstructor.inputs?.length && args?.length ? encode2(abiConstructor.inputs, args) : "0x");
}
__name(encode3, "encode");
function from3(abiConstructor) {
  return from2(abiConstructor);
}
__name(from3, "from");

// node_modules/viem/node_modules/ox/_esm/core/AbiFunction.js
init_checked_fetch();
init_modules_watch_stub();
init_Hex();
function encodeData2(abiFunction, ...args) {
  const { overloads } = abiFunction;
  const item = overloads ? fromAbi2([abiFunction, ...overloads], abiFunction.name, {
    args: args[0]
  }) : abiFunction;
  const selector = getSelector2(item);
  const data = args.length > 0 ? encode2(item.inputs, args[0]) : void 0;
  return data ? concat2(selector, data) : selector;
}
__name(encodeData2, "encodeData");
function from4(abiFunction, options = {}) {
  return from2(abiFunction, options);
}
__name(from4, "from");
function fromAbi2(abi2, name, options) {
  const item = fromAbi(abi2, name, options);
  if (item.type !== "function")
    throw new NotFoundError({ name, type: "function" });
  return item;
}
__name(fromAbi2, "fromAbi");
function getSelector2(abiItem) {
  return getSelector(abiItem);
}
__name(getSelector2, "getSelector");

// node_modules/viem/_esm/actions/public/simulateCalls.js
init_parseAccount();

// node_modules/viem/_esm/constants/address.js
init_checked_fetch();
init_modules_watch_stub();
var ethAddress = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
var zeroAddress = "0x0000000000000000000000000000000000000000";

// node_modules/viem/_esm/actions/public/simulateCalls.js
init_contracts();
init_base();
init_encodeFunctionData();
var getBalanceCode = "0x6080604052348015600e575f80fd5b5061016d8061001c5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063f8b2cb4f1461002d575b5f80fd5b610047600480360381019061004291906100db565b61005d565b604051610054919061011e565b60405180910390f35b5f8173ffffffffffffffffffffffffffffffffffffffff16319050919050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6100aa82610081565b9050919050565b6100ba816100a0565b81146100c4575f80fd5b50565b5f813590506100d5816100b1565b92915050565b5f602082840312156100f0576100ef61007d565b5b5f6100fd848285016100c7565b91505092915050565b5f819050919050565b61011881610106565b82525050565b5f6020820190506101315f83018461010f565b9291505056fea26469706673582212203b9fe929fe995c7cf9887f0bdba8a36dd78e8b73f149b17d2d9ad7cd09d2dc6264736f6c634300081a0033";
async function simulateCalls(client, parameters) {
  const { blockNumber, blockTag, calls, stateOverrides, traceAssetChanges, traceTransfers, validation } = parameters;
  const account = parameters.account ? parseAccount(parameters.account) : void 0;
  if (traceAssetChanges && !account)
    throw new BaseError2("`account` is required when `traceAssetChanges` is true");
  const getBalanceData = account ? encode3(from3("constructor(bytes, bytes)"), {
    bytecode: deploylessCallViaBytecodeBytecode,
    args: [
      getBalanceCode,
      encodeData2(from4("function getBalance(address)"), [account.address])
    ]
  }) : void 0;
  const assetAddresses = traceAssetChanges ? await Promise.all(parameters.calls.map(async (call2) => {
    if (!call2.data && !call2.abi)
      return;
    const { accessList } = await createAccessList(client, {
      account: account.address,
      ...call2,
      data: call2.abi ? encodeFunctionData(call2) : call2.data
    });
    return accessList.map(({ address, storageKeys }) => storageKeys.length > 0 ? address : null);
  })).then((x) => x.flat().filter(Boolean)) : [];
  const blocks = await simulateBlocks(client, {
    blockNumber,
    blockTag,
    blocks: [
      ...traceAssetChanges ? [
        // ETH pre balances
        {
          calls: [{ data: getBalanceData }],
          stateOverrides
        },
        // Asset pre balances
        {
          calls: assetAddresses.map((address, i) => ({
            abi: [
              from4("function balanceOf(address) returns (uint256)")
            ],
            functionName: "balanceOf",
            args: [account.address],
            to: address,
            from: zeroAddress,
            nonce: i
          })),
          stateOverrides: [
            {
              address: zeroAddress,
              nonce: 0
            }
          ]
        }
      ] : [],
      {
        calls: [...calls, {}].map((call2) => ({
          ...call2,
          from: account?.address
        })),
        stateOverrides
      },
      ...traceAssetChanges ? [
        // ETH post balances
        {
          calls: [{ data: getBalanceData }]
        },
        // Asset post balances
        {
          calls: assetAddresses.map((address, i) => ({
            abi: [
              from4("function balanceOf(address) returns (uint256)")
            ],
            functionName: "balanceOf",
            args: [account.address],
            to: address,
            from: zeroAddress,
            nonce: i
          })),
          stateOverrides: [
            {
              address: zeroAddress,
              nonce: 0
            }
          ]
        },
        // Decimals
        {
          calls: assetAddresses.map((address, i) => ({
            to: address,
            abi: [
              from4("function decimals() returns (uint256)")
            ],
            functionName: "decimals",
            from: zeroAddress,
            nonce: i
          })),
          stateOverrides: [
            {
              address: zeroAddress,
              nonce: 0
            }
          ]
        },
        // Token URI
        {
          calls: assetAddresses.map((address, i) => ({
            to: address,
            abi: [
              from4("function tokenURI(uint256) returns (string)")
            ],
            functionName: "tokenURI",
            args: [0n],
            from: zeroAddress,
            nonce: i
          })),
          stateOverrides: [
            {
              address: zeroAddress,
              nonce: 0
            }
          ]
        },
        // Symbols
        {
          calls: assetAddresses.map((address, i) => ({
            to: address,
            abi: [from4("function symbol() returns (string)")],
            functionName: "symbol",
            from: zeroAddress,
            nonce: i
          })),
          stateOverrides: [
            {
              address: zeroAddress,
              nonce: 0
            }
          ]
        }
      ] : []
    ],
    traceTransfers,
    validation
  });
  const block_results = traceAssetChanges ? blocks[2] : blocks[0];
  const [block_ethPre, block_assetsPre, , block_ethPost, block_assetsPost, block_decimals, block_tokenURI, block_symbols] = traceAssetChanges ? blocks : [];
  const { calls: block_calls, ...block } = block_results;
  const results = block_calls.slice(0, -1) ?? [];
  const ethPre = block_ethPre?.calls ?? [];
  const assetsPre = block_assetsPre?.calls ?? [];
  const balancesPre = [...ethPre, ...assetsPre].map((call2) => call2.status === "success" ? hexToBigInt(call2.data) : null);
  const ethPost = block_ethPost?.calls ?? [];
  const assetsPost = block_assetsPost?.calls ?? [];
  const balancesPost = [...ethPost, ...assetsPost].map((call2) => call2.status === "success" ? hexToBigInt(call2.data) : null);
  const decimals = (block_decimals?.calls ?? []).map((x) => x.status === "success" ? x.result : null);
  const symbols = (block_symbols?.calls ?? []).map((x) => x.status === "success" ? x.result : null);
  const tokenURI = (block_tokenURI?.calls ?? []).map((x) => x.status === "success" ? x.result : null);
  const changes = [];
  for (const [i, balancePost] of balancesPost.entries()) {
    const balancePre = balancesPre[i];
    if (typeof balancePost !== "bigint")
      continue;
    if (typeof balancePre !== "bigint")
      continue;
    const decimals_ = decimals[i - 1];
    const symbol_ = symbols[i - 1];
    const tokenURI_ = tokenURI[i - 1];
    const token = (() => {
      if (i === 0)
        return {
          address: ethAddress,
          decimals: 18,
          symbol: "ETH"
        };
      return {
        address: assetAddresses[i - 1],
        decimals: tokenURI_ || decimals_ ? Number(decimals_ ?? 1) : void 0,
        symbol: symbol_ ?? void 0
      };
    })();
    if (changes.some((change) => change.token.address === token.address))
      continue;
    changes.push({
      token,
      value: {
        pre: balancePre,
        post: balancePost,
        diff: balancePost - balancePre
      }
    });
  }
  return {
    assetChanges: changes,
    block,
    results
  };
}
__name(simulateCalls, "simulateCalls");

// node_modules/viem/_esm/actions/public/verifyMessage.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/actions/public/verifyHash.js
init_checked_fetch();
init_modules_watch_stub();
init_abis();
init_contracts();
init_contract();
init_encodeDeployData();
init_getAddress();
init_isAddressEqual();
init_isHex();
init_toHex();

// node_modules/viem/_esm/utils/signature/serializeSignature.js
init_checked_fetch();
init_modules_watch_stub();
init_secp256k1();
init_fromHex();
init_toBytes();
function serializeSignature({ r, s, to = "hex", v, yParity }) {
  const yParity_ = (() => {
    if (yParity === 0 || yParity === 1)
      return yParity;
    if (v && (v === 27n || v === 28n || v >= 35n))
      return v % 2n === 0n ? 1 : 0;
    throw new Error("Invalid `v` or `yParity` value");
  })();
  const signature = `0x${new secp256k1.Signature(hexToBigInt(r), hexToBigInt(s)).toCompactHex()}${yParity_ === 0 ? "1b" : "1c"}`;
  if (to === "hex")
    return signature;
  return hexToBytes(signature);
}
__name(serializeSignature, "serializeSignature");

// node_modules/viem/_esm/actions/public/verifyHash.js
init_call();
async function verifyHash(client, parameters) {
  const { address, factory, factoryData, hash: hash2, signature, universalSignatureVerifierAddress = client.chain?.contracts?.universalSignatureVerifier?.address, ...rest } = parameters;
  const signatureHex = (() => {
    if (isHex(signature))
      return signature;
    if (typeof signature === "object" && "r" in signature && "s" in signature)
      return serializeSignature(signature);
    return bytesToHex(signature);
  })();
  const wrappedSignature = await (async () => {
    if (!factory && !factoryData)
      return signatureHex;
    if (isErc6492Signature(signatureHex))
      return signatureHex;
    return serializeErc6492Signature({
      address: factory,
      data: factoryData,
      signature: signatureHex
    });
  })();
  try {
    const args = universalSignatureVerifierAddress ? {
      to: universalSignatureVerifierAddress,
      data: encodeFunctionData({
        abi: universalSignatureValidatorAbi,
        functionName: "isValidSig",
        args: [address, hash2, wrappedSignature]
      }),
      ...rest
    } : {
      data: encodeDeployData({
        abi: universalSignatureValidatorAbi,
        args: [address, hash2, wrappedSignature],
        bytecode: universalSignatureValidatorByteCode
      }),
      ...rest
    };
    const { data } = await getAction(client, call, "call")(args);
    return hexToBool(data ?? "0x0");
  } catch (error) {
    try {
      const verified = isAddressEqual(getAddress(address), await recoverAddress({ hash: hash2, signature }));
      if (verified)
        return true;
    } catch {
    }
    if (error instanceof CallExecutionError) {
      return false;
    }
    throw error;
  }
}
__name(verifyHash, "verifyHash");

// node_modules/viem/_esm/actions/public/verifyMessage.js
async function verifyMessage(client, { address, message, factory, factoryData, signature, ...callRequest }) {
  const hash2 = hashMessage(message);
  return verifyHash(client, {
    address,
    factory,
    factoryData,
    hash: hash2,
    signature,
    ...callRequest
  });
}
__name(verifyMessage, "verifyMessage");

// node_modules/viem/_esm/actions/public/verifyTypedData.js
init_checked_fetch();
init_modules_watch_stub();
async function verifyTypedData(client, parameters) {
  const { address, factory, factoryData, signature, message, primaryType, types, domain, ...callRequest } = parameters;
  const hash2 = hashTypedData({ message, primaryType, types, domain });
  return verifyHash(client, {
    address,
    factory,
    factoryData,
    hash: hash2,
    signature,
    ...callRequest
  });
}
__name(verifyTypedData, "verifyTypedData");

// node_modules/viem/_esm/actions/public/waitForTransactionReceipt.js
init_checked_fetch();
init_modules_watch_stub();
init_transaction();
init_withResolvers();
init_stringify();

// node_modules/viem/_esm/actions/public/watchBlockNumber.js
init_checked_fetch();
init_modules_watch_stub();
init_fromHex();
init_stringify();
function watchBlockNumber(client, { emitOnBegin = false, emitMissed = false, onBlockNumber, onError, poll: poll_, pollingInterval = client.pollingInterval }) {
  const enablePolling = (() => {
    if (typeof poll_ !== "undefined")
      return poll_;
    if (client.transport.type === "webSocket" || client.transport.type === "ipc")
      return false;
    if (client.transport.type === "fallback" && (client.transport.transports[0].config.type === "webSocket" || client.transport.transports[0].config.type === "ipc"))
      return false;
    return true;
  })();
  let prevBlockNumber;
  const pollBlockNumber = /* @__PURE__ */ __name(() => {
    const observerId = stringify([
      "watchBlockNumber",
      client.uid,
      emitOnBegin,
      emitMissed,
      pollingInterval
    ]);
    return observe(observerId, { onBlockNumber, onError }, (emit) => poll(async () => {
      try {
        const blockNumber = await getAction(client, getBlockNumber, "getBlockNumber")({ cacheTime: 0 });
        if (prevBlockNumber) {
          if (blockNumber === prevBlockNumber)
            return;
          if (blockNumber - prevBlockNumber > 1 && emitMissed) {
            for (let i = prevBlockNumber + 1n; i < blockNumber; i++) {
              emit.onBlockNumber(i, prevBlockNumber);
              prevBlockNumber = i;
            }
          }
        }
        if (!prevBlockNumber || blockNumber > prevBlockNumber) {
          emit.onBlockNumber(blockNumber, prevBlockNumber);
          prevBlockNumber = blockNumber;
        }
      } catch (err) {
        emit.onError?.(err);
      }
    }, {
      emitOnBegin,
      interval: pollingInterval
    }));
  }, "pollBlockNumber");
  const subscribeBlockNumber = /* @__PURE__ */ __name(() => {
    const observerId = stringify([
      "watchBlockNumber",
      client.uid,
      emitOnBegin,
      emitMissed
    ]);
    return observe(observerId, { onBlockNumber, onError }, (emit) => {
      let active = true;
      let unsubscribe = /* @__PURE__ */ __name(() => active = false, "unsubscribe");
      (async () => {
        try {
          const transport = (() => {
            if (client.transport.type === "fallback") {
              const transport2 = client.transport.transports.find((transport3) => transport3.config.type === "webSocket" || transport3.config.type === "ipc");
              if (!transport2)
                return client.transport;
              return transport2.value;
            }
            return client.transport;
          })();
          const { unsubscribe: unsubscribe_ } = await transport.subscribe({
            params: ["newHeads"],
            onData(data) {
              if (!active)
                return;
              const blockNumber = hexToBigInt(data.result?.number);
              emit.onBlockNumber(blockNumber, prevBlockNumber);
              prevBlockNumber = blockNumber;
            },
            onError(error) {
              emit.onError?.(error);
            }
          });
          unsubscribe = unsubscribe_;
          if (!active)
            unsubscribe();
        } catch (err) {
          onError?.(err);
        }
      })();
      return () => unsubscribe();
    });
  }, "subscribeBlockNumber");
  return enablePolling ? pollBlockNumber() : subscribeBlockNumber();
}
__name(watchBlockNumber, "watchBlockNumber");

// node_modules/viem/_esm/actions/public/waitForTransactionReceipt.js
async function waitForTransactionReceipt(client, parameters) {
  const {
    checkReplacement = true,
    confirmations = 1,
    hash: hash2,
    onReplaced,
    retryCount = 6,
    retryDelay = /* @__PURE__ */ __name(({ count }) => ~~(1 << count) * 200, "retryDelay"),
    // exponential backoff
    timeout = 18e4
  } = parameters;
  const observerId = stringify(["waitForTransactionReceipt", client.uid, hash2]);
  const pollingInterval = (() => {
    if (parameters.pollingInterval)
      return parameters.pollingInterval;
    if (client.chain?.experimental_preconfirmationTime)
      return client.chain.experimental_preconfirmationTime;
    return client.pollingInterval;
  })();
  let transaction;
  let replacedTransaction;
  let receipt;
  let retrying = false;
  let _unobserve;
  let _unwatch;
  const { promise, resolve, reject } = withResolvers();
  const timer = timeout ? setTimeout(() => {
    _unwatch();
    _unobserve();
    reject(new WaitForTransactionReceiptTimeoutError({ hash: hash2 }));
  }, timeout) : void 0;
  _unobserve = observe(observerId, { onReplaced, resolve, reject }, async (emit) => {
    receipt = await getAction(client, getTransactionReceipt, "getTransactionReceipt")({ hash: hash2 }).catch(() => void 0);
    if (receipt && confirmations <= 1) {
      clearTimeout(timer);
      emit.resolve(receipt);
      _unobserve();
      return;
    }
    _unwatch = getAction(client, watchBlockNumber, "watchBlockNumber")({
      emitMissed: true,
      emitOnBegin: true,
      poll: true,
      pollingInterval,
      async onBlockNumber(blockNumber_) {
        const done = /* @__PURE__ */ __name((fn) => {
          clearTimeout(timer);
          _unwatch();
          fn();
          _unobserve();
        }, "done");
        let blockNumber = blockNumber_;
        if (retrying)
          return;
        try {
          if (receipt) {
            if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
              return;
            done(() => emit.resolve(receipt));
            return;
          }
          if (checkReplacement && !transaction) {
            retrying = true;
            await withRetry(async () => {
              transaction = await getAction(client, getTransaction, "getTransaction")({ hash: hash2 });
              if (transaction.blockNumber)
                blockNumber = transaction.blockNumber;
            }, {
              delay: retryDelay,
              retryCount
            });
            retrying = false;
          }
          receipt = await getAction(client, getTransactionReceipt, "getTransactionReceipt")({ hash: hash2 });
          if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
            return;
          done(() => emit.resolve(receipt));
        } catch (err) {
          if (err instanceof TransactionNotFoundError || err instanceof TransactionReceiptNotFoundError) {
            if (!transaction) {
              retrying = false;
              return;
            }
            try {
              replacedTransaction = transaction;
              retrying = true;
              const block = await withRetry(() => getAction(client, getBlock, "getBlock")({
                blockNumber,
                includeTransactions: true
              }), {
                delay: retryDelay,
                retryCount,
                shouldRetry: /* @__PURE__ */ __name(({ error }) => error instanceof BlockNotFoundError, "shouldRetry")
              });
              retrying = false;
              const replacementTransaction = block.transactions.find(({ from: from5, nonce }) => from5 === replacedTransaction.from && nonce === replacedTransaction.nonce);
              if (!replacementTransaction)
                return;
              receipt = await getAction(client, getTransactionReceipt, "getTransactionReceipt")({
                hash: replacementTransaction.hash
              });
              if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
                return;
              let reason = "replaced";
              if (replacementTransaction.to === replacedTransaction.to && replacementTransaction.value === replacedTransaction.value && replacementTransaction.input === replacedTransaction.input) {
                reason = "repriced";
              } else if (replacementTransaction.from === replacementTransaction.to && replacementTransaction.value === 0n) {
                reason = "cancelled";
              }
              done(() => {
                emit.onReplaced?.({
                  reason,
                  replacedTransaction,
                  transaction: replacementTransaction,
                  transactionReceipt: receipt
                });
                emit.resolve(receipt);
              });
            } catch (err_) {
              done(() => emit.reject(err_));
            }
          } else {
            done(() => emit.reject(err));
          }
        }
      }
    });
  });
  return promise;
}
__name(waitForTransactionReceipt, "waitForTransactionReceipt");

// node_modules/viem/_esm/actions/public/watchBlocks.js
init_checked_fetch();
init_modules_watch_stub();
init_stringify();
function watchBlocks(client, { blockTag = client.experimental_blockTag ?? "latest", emitMissed = false, emitOnBegin = false, onBlock, onError, includeTransactions: includeTransactions_, poll: poll_, pollingInterval = client.pollingInterval }) {
  const enablePolling = (() => {
    if (typeof poll_ !== "undefined")
      return poll_;
    if (client.transport.type === "webSocket" || client.transport.type === "ipc")
      return false;
    if (client.transport.type === "fallback" && (client.transport.transports[0].config.type === "webSocket" || client.transport.transports[0].config.type === "ipc"))
      return false;
    return true;
  })();
  const includeTransactions = includeTransactions_ ?? false;
  let prevBlock;
  const pollBlocks = /* @__PURE__ */ __name(() => {
    const observerId = stringify([
      "watchBlocks",
      client.uid,
      blockTag,
      emitMissed,
      emitOnBegin,
      includeTransactions,
      pollingInterval
    ]);
    return observe(observerId, { onBlock, onError }, (emit) => poll(async () => {
      try {
        const block = await getAction(client, getBlock, "getBlock")({
          blockTag,
          includeTransactions
        });
        if (block.number !== null && prevBlock?.number != null) {
          if (block.number === prevBlock.number)
            return;
          if (block.number - prevBlock.number > 1 && emitMissed) {
            for (let i = prevBlock?.number + 1n; i < block.number; i++) {
              const block2 = await getAction(client, getBlock, "getBlock")({
                blockNumber: i,
                includeTransactions
              });
              emit.onBlock(block2, prevBlock);
              prevBlock = block2;
            }
          }
        }
        if (
          // If no previous block exists, emit.
          prevBlock?.number == null || // If the block tag is "pending" with no block number, emit.
          blockTag === "pending" && block?.number == null || // If the next block number is greater than the previous block number, emit.
          // We don't want to emit blocks in the past.
          block.number !== null && block.number > prevBlock.number
        ) {
          emit.onBlock(block, prevBlock);
          prevBlock = block;
        }
      } catch (err) {
        emit.onError?.(err);
      }
    }, {
      emitOnBegin,
      interval: pollingInterval
    }));
  }, "pollBlocks");
  const subscribeBlocks = /* @__PURE__ */ __name(() => {
    let active = true;
    let emitFetched = true;
    let unsubscribe = /* @__PURE__ */ __name(() => active = false, "unsubscribe");
    (async () => {
      try {
        if (emitOnBegin) {
          getAction(client, getBlock, "getBlock")({
            blockTag,
            includeTransactions
          }).then((block) => {
            if (!active)
              return;
            if (!emitFetched)
              return;
            onBlock(block, void 0);
            emitFetched = false;
          }).catch(onError);
        }
        const transport = (() => {
          if (client.transport.type === "fallback") {
            const transport2 = client.transport.transports.find((transport3) => transport3.config.type === "webSocket" || transport3.config.type === "ipc");
            if (!transport2)
              return client.transport;
            return transport2.value;
          }
          return client.transport;
        })();
        const { unsubscribe: unsubscribe_ } = await transport.subscribe({
          params: ["newHeads"],
          async onData(data) {
            if (!active)
              return;
            const block = await getAction(client, getBlock, "getBlock")({
              blockNumber: data.result?.number,
              includeTransactions
            }).catch(() => {
            });
            if (!active)
              return;
            onBlock(block, prevBlock);
            emitFetched = false;
            prevBlock = block;
          },
          onError(error) {
            onError?.(error);
          }
        });
        unsubscribe = unsubscribe_;
        if (!active)
          unsubscribe();
      } catch (err) {
        onError?.(err);
      }
    })();
    return () => unsubscribe();
  }, "subscribeBlocks");
  return enablePolling ? pollBlocks() : subscribeBlocks();
}
__name(watchBlocks, "watchBlocks");

// node_modules/viem/_esm/actions/public/watchEvent.js
init_checked_fetch();
init_modules_watch_stub();
init_stringify();
init_abi();
init_rpc();
function watchEvent(client, { address, args, batch = true, event, events, fromBlock, onError, onLogs, poll: poll_, pollingInterval = client.pollingInterval, strict: strict_ }) {
  const enablePolling = (() => {
    if (typeof poll_ !== "undefined")
      return poll_;
    if (typeof fromBlock === "bigint")
      return true;
    if (client.transport.type === "webSocket" || client.transport.type === "ipc")
      return false;
    if (client.transport.type === "fallback" && (client.transport.transports[0].config.type === "webSocket" || client.transport.transports[0].config.type === "ipc"))
      return false;
    return true;
  })();
  const strict = strict_ ?? false;
  const pollEvent = /* @__PURE__ */ __name(() => {
    const observerId = stringify([
      "watchEvent",
      address,
      args,
      batch,
      client.uid,
      event,
      pollingInterval,
      fromBlock
    ]);
    return observe(observerId, { onLogs, onError }, (emit) => {
      let previousBlockNumber;
      if (fromBlock !== void 0)
        previousBlockNumber = fromBlock - 1n;
      let filter;
      let initialized = false;
      const unwatch = poll(async () => {
        if (!initialized) {
          try {
            filter = await getAction(client, createEventFilter, "createEventFilter")({
              address,
              args,
              event,
              events,
              strict,
              fromBlock
            });
          } catch {
          }
          initialized = true;
          return;
        }
        try {
          let logs;
          if (filter) {
            logs = await getAction(client, getFilterChanges, "getFilterChanges")({ filter });
          } else {
            const blockNumber = await getAction(client, getBlockNumber, "getBlockNumber")({});
            if (previousBlockNumber && previousBlockNumber !== blockNumber) {
              logs = await getAction(client, getLogs, "getLogs")({
                address,
                args,
                event,
                events,
                fromBlock: previousBlockNumber + 1n,
                toBlock: blockNumber
              });
            } else {
              logs = [];
            }
            previousBlockNumber = blockNumber;
          }
          if (logs.length === 0)
            return;
          if (batch)
            emit.onLogs(logs);
          else
            for (const log of logs)
              emit.onLogs([log]);
        } catch (err) {
          if (filter && err instanceof InvalidInputRpcError)
            initialized = false;
          emit.onError?.(err);
        }
      }, {
        emitOnBegin: true,
        interval: pollingInterval
      });
      return async () => {
        if (filter)
          await getAction(client, uninstallFilter, "uninstallFilter")({ filter });
        unwatch();
      };
    });
  }, "pollEvent");
  const subscribeEvent = /* @__PURE__ */ __name(() => {
    let active = true;
    let unsubscribe = /* @__PURE__ */ __name(() => active = false, "unsubscribe");
    (async () => {
      try {
        const transport = (() => {
          if (client.transport.type === "fallback") {
            const transport2 = client.transport.transports.find((transport3) => transport3.config.type === "webSocket" || transport3.config.type === "ipc");
            if (!transport2)
              return client.transport;
            return transport2.value;
          }
          return client.transport;
        })();
        const events_ = events ?? (event ? [event] : void 0);
        let topics = [];
        if (events_) {
          const encoded = events_.flatMap((event2) => encodeEventTopics({
            abi: [event2],
            eventName: event2.name,
            args
          }));
          topics = [encoded];
          if (event)
            topics = topics[0];
        }
        const { unsubscribe: unsubscribe_ } = await transport.subscribe({
          params: ["logs", { address, topics }],
          onData(data) {
            if (!active)
              return;
            const log = data.result;
            try {
              const { eventName, args: args2 } = decodeEventLog({
                abi: events_ ?? [],
                data: log.data,
                topics: log.topics,
                strict
              });
              const formatted = formatLog(log, { args: args2, eventName });
              onLogs([formatted]);
            } catch (err) {
              let eventName;
              let isUnnamed;
              if (err instanceof DecodeLogDataMismatch || err instanceof DecodeLogTopicsMismatch) {
                if (strict_)
                  return;
                eventName = err.abiItem.name;
                isUnnamed = err.abiItem.inputs?.some((x) => !("name" in x && x.name));
              }
              const formatted = formatLog(log, {
                args: isUnnamed ? [] : {},
                eventName
              });
              onLogs([formatted]);
            }
          },
          onError(error) {
            onError?.(error);
          }
        });
        unsubscribe = unsubscribe_;
        if (!active)
          unsubscribe();
      } catch (err) {
        onError?.(err);
      }
    })();
    return () => unsubscribe();
  }, "subscribeEvent");
  return enablePolling ? pollEvent() : subscribeEvent();
}
__name(watchEvent, "watchEvent");

// node_modules/viem/_esm/actions/public/watchPendingTransactions.js
init_checked_fetch();
init_modules_watch_stub();
init_stringify();
function watchPendingTransactions(client, { batch = true, onError, onTransactions, poll: poll_, pollingInterval = client.pollingInterval }) {
  const enablePolling = typeof poll_ !== "undefined" ? poll_ : client.transport.type !== "webSocket" && client.transport.type !== "ipc";
  const pollPendingTransactions = /* @__PURE__ */ __name(() => {
    const observerId = stringify([
      "watchPendingTransactions",
      client.uid,
      batch,
      pollingInterval
    ]);
    return observe(observerId, { onTransactions, onError }, (emit) => {
      let filter;
      const unwatch = poll(async () => {
        try {
          if (!filter) {
            try {
              filter = await getAction(client, createPendingTransactionFilter, "createPendingTransactionFilter")({});
              return;
            } catch (err) {
              unwatch();
              throw err;
            }
          }
          const hashes = await getAction(client, getFilterChanges, "getFilterChanges")({ filter });
          if (hashes.length === 0)
            return;
          if (batch)
            emit.onTransactions(hashes);
          else
            for (const hash2 of hashes)
              emit.onTransactions([hash2]);
        } catch (err) {
          emit.onError?.(err);
        }
      }, {
        emitOnBegin: true,
        interval: pollingInterval
      });
      return async () => {
        if (filter)
          await getAction(client, uninstallFilter, "uninstallFilter")({ filter });
        unwatch();
      };
    });
  }, "pollPendingTransactions");
  const subscribePendingTransactions = /* @__PURE__ */ __name(() => {
    let active = true;
    let unsubscribe = /* @__PURE__ */ __name(() => active = false, "unsubscribe");
    (async () => {
      try {
        const { unsubscribe: unsubscribe_ } = await client.transport.subscribe({
          params: ["newPendingTransactions"],
          onData(data) {
            if (!active)
              return;
            const transaction = data.result;
            onTransactions([transaction]);
          },
          onError(error) {
            onError?.(error);
          }
        });
        unsubscribe = unsubscribe_;
        if (!active)
          unsubscribe();
      } catch (err) {
        onError?.(err);
      }
    })();
    return () => unsubscribe();
  }, "subscribePendingTransactions");
  return enablePolling ? pollPendingTransactions() : subscribePendingTransactions();
}
__name(watchPendingTransactions, "watchPendingTransactions");

// node_modules/viem/_esm/actions/siwe/verifySiweMessage.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/utils/siwe/parseSiweMessage.js
init_checked_fetch();
init_modules_watch_stub();
function parseSiweMessage(message) {
  const { scheme, statement, ...prefix } = message.match(prefixRegex)?.groups ?? {};
  const { chainId, expirationTime, issuedAt, notBefore, requestId, ...suffix } = message.match(suffixRegex)?.groups ?? {};
  const resources = message.split("Resources:")[1]?.split("\n- ").slice(1);
  return {
    ...prefix,
    ...suffix,
    ...chainId ? { chainId: Number(chainId) } : {},
    ...expirationTime ? { expirationTime: new Date(expirationTime) } : {},
    ...issuedAt ? { issuedAt: new Date(issuedAt) } : {},
    ...notBefore ? { notBefore: new Date(notBefore) } : {},
    ...requestId ? { requestId } : {},
    ...resources ? { resources } : {},
    ...scheme ? { scheme } : {},
    ...statement ? { statement } : {}
  };
}
__name(parseSiweMessage, "parseSiweMessage");
var prefixRegex = /^(?:(?<scheme>[a-zA-Z][a-zA-Z0-9+-.]*):\/\/)?(?<domain>[a-zA-Z0-9+-.]*(?::[0-9]{1,5})?) (?:wants you to sign in with your Ethereum account:\n)(?<address>0x[a-fA-F0-9]{40})\n\n(?:(?<statement>.*)\n\n)?/;
var suffixRegex = /(?:URI: (?<uri>.+))\n(?:Version: (?<version>.+))\n(?:Chain ID: (?<chainId>\d+))\n(?:Nonce: (?<nonce>[a-zA-Z0-9]+))\n(?:Issued At: (?<issuedAt>.+))(?:\nExpiration Time: (?<expirationTime>.+))?(?:\nNot Before: (?<notBefore>.+))?(?:\nRequest ID: (?<requestId>.+))?/;

// node_modules/viem/_esm/utils/siwe/validateSiweMessage.js
init_checked_fetch();
init_modules_watch_stub();
init_isAddress();
init_isAddressEqual();
function validateSiweMessage(parameters) {
  const { address, domain, message, nonce, scheme, time = /* @__PURE__ */ new Date() } = parameters;
  if (domain && message.domain !== domain)
    return false;
  if (nonce && message.nonce !== nonce)
    return false;
  if (scheme && message.scheme !== scheme)
    return false;
  if (message.expirationTime && time >= message.expirationTime)
    return false;
  if (message.notBefore && time < message.notBefore)
    return false;
  try {
    if (!message.address)
      return false;
    if (!isAddress(message.address, { strict: false }))
      return false;
    if (address && !isAddressEqual(message.address, address))
      return false;
  } catch {
    return false;
  }
  return true;
}
__name(validateSiweMessage, "validateSiweMessage");

// node_modules/viem/_esm/actions/siwe/verifySiweMessage.js
async function verifySiweMessage(client, parameters) {
  const { address, domain, message, nonce, scheme, signature, time = /* @__PURE__ */ new Date(), ...callRequest } = parameters;
  const parsed = parseSiweMessage(message);
  if (!parsed.address)
    return false;
  const isValid = validateSiweMessage({
    address,
    domain,
    message: parsed,
    nonce,
    scheme,
    time
  });
  if (!isValid)
    return false;
  const hash2 = hashMessage(message);
  return verifyHash(client, {
    address: parsed.address,
    hash: hash2,
    signature,
    ...callRequest
  });
}
__name(verifySiweMessage, "verifySiweMessage");

// node_modules/viem/_esm/clients/decorators/public.js
function publicActions(client) {
  return {
    call: /* @__PURE__ */ __name((args) => call(client, args), "call"),
    createAccessList: /* @__PURE__ */ __name((args) => createAccessList(client, args), "createAccessList"),
    createBlockFilter: /* @__PURE__ */ __name(() => createBlockFilter(client), "createBlockFilter"),
    createContractEventFilter: /* @__PURE__ */ __name((args) => createContractEventFilter(client, args), "createContractEventFilter"),
    createEventFilter: /* @__PURE__ */ __name((args) => createEventFilter(client, args), "createEventFilter"),
    createPendingTransactionFilter: /* @__PURE__ */ __name(() => createPendingTransactionFilter(client), "createPendingTransactionFilter"),
    estimateContractGas: /* @__PURE__ */ __name((args) => estimateContractGas(client, args), "estimateContractGas"),
    estimateGas: /* @__PURE__ */ __name((args) => estimateGas(client, args), "estimateGas"),
    getBalance: /* @__PURE__ */ __name((args) => getBalance(client, args), "getBalance"),
    getBlobBaseFee: /* @__PURE__ */ __name(() => getBlobBaseFee(client), "getBlobBaseFee"),
    getBlock: /* @__PURE__ */ __name((args) => getBlock(client, args), "getBlock"),
    getBlockNumber: /* @__PURE__ */ __name((args) => getBlockNumber(client, args), "getBlockNumber"),
    getBlockTransactionCount: /* @__PURE__ */ __name((args) => getBlockTransactionCount(client, args), "getBlockTransactionCount"),
    getBytecode: /* @__PURE__ */ __name((args) => getCode(client, args), "getBytecode"),
    getChainId: /* @__PURE__ */ __name(() => getChainId(client), "getChainId"),
    getCode: /* @__PURE__ */ __name((args) => getCode(client, args), "getCode"),
    getContractEvents: /* @__PURE__ */ __name((args) => getContractEvents(client, args), "getContractEvents"),
    getEip712Domain: /* @__PURE__ */ __name((args) => getEip712Domain(client, args), "getEip712Domain"),
    getEnsAddress: /* @__PURE__ */ __name((args) => getEnsAddress(client, args), "getEnsAddress"),
    getEnsAvatar: /* @__PURE__ */ __name((args) => getEnsAvatar(client, args), "getEnsAvatar"),
    getEnsName: /* @__PURE__ */ __name((args) => getEnsName(client, args), "getEnsName"),
    getEnsResolver: /* @__PURE__ */ __name((args) => getEnsResolver(client, args), "getEnsResolver"),
    getEnsText: /* @__PURE__ */ __name((args) => getEnsText(client, args), "getEnsText"),
    getFeeHistory: /* @__PURE__ */ __name((args) => getFeeHistory(client, args), "getFeeHistory"),
    estimateFeesPerGas: /* @__PURE__ */ __name((args) => estimateFeesPerGas(client, args), "estimateFeesPerGas"),
    getFilterChanges: /* @__PURE__ */ __name((args) => getFilterChanges(client, args), "getFilterChanges"),
    getFilterLogs: /* @__PURE__ */ __name((args) => getFilterLogs(client, args), "getFilterLogs"),
    getGasPrice: /* @__PURE__ */ __name(() => getGasPrice(client), "getGasPrice"),
    getLogs: /* @__PURE__ */ __name((args) => getLogs(client, args), "getLogs"),
    getProof: /* @__PURE__ */ __name((args) => getProof(client, args), "getProof"),
    estimateMaxPriorityFeePerGas: /* @__PURE__ */ __name((args) => estimateMaxPriorityFeePerGas(client, args), "estimateMaxPriorityFeePerGas"),
    getStorageAt: /* @__PURE__ */ __name((args) => getStorageAt(client, args), "getStorageAt"),
    getTransaction: /* @__PURE__ */ __name((args) => getTransaction(client, args), "getTransaction"),
    getTransactionConfirmations: /* @__PURE__ */ __name((args) => getTransactionConfirmations(client, args), "getTransactionConfirmations"),
    getTransactionCount: /* @__PURE__ */ __name((args) => getTransactionCount(client, args), "getTransactionCount"),
    getTransactionReceipt: /* @__PURE__ */ __name((args) => getTransactionReceipt(client, args), "getTransactionReceipt"),
    multicall: /* @__PURE__ */ __name((args) => multicall(client, args), "multicall"),
    prepareTransactionRequest: /* @__PURE__ */ __name((args) => prepareTransactionRequest(client, args), "prepareTransactionRequest"),
    readContract: /* @__PURE__ */ __name((args) => readContract(client, args), "readContract"),
    sendRawTransaction: /* @__PURE__ */ __name((args) => sendRawTransaction(client, args), "sendRawTransaction"),
    simulate: /* @__PURE__ */ __name((args) => simulateBlocks(client, args), "simulate"),
    simulateBlocks: /* @__PURE__ */ __name((args) => simulateBlocks(client, args), "simulateBlocks"),
    simulateCalls: /* @__PURE__ */ __name((args) => simulateCalls(client, args), "simulateCalls"),
    simulateContract: /* @__PURE__ */ __name((args) => simulateContract(client, args), "simulateContract"),
    verifyMessage: /* @__PURE__ */ __name((args) => verifyMessage(client, args), "verifyMessage"),
    verifySiweMessage: /* @__PURE__ */ __name((args) => verifySiweMessage(client, args), "verifySiweMessage"),
    verifyTypedData: /* @__PURE__ */ __name((args) => verifyTypedData(client, args), "verifyTypedData"),
    uninstallFilter: /* @__PURE__ */ __name((args) => uninstallFilter(client, args), "uninstallFilter"),
    waitForTransactionReceipt: /* @__PURE__ */ __name((args) => waitForTransactionReceipt(client, args), "waitForTransactionReceipt"),
    watchBlocks: /* @__PURE__ */ __name((args) => watchBlocks(client, args), "watchBlocks"),
    watchBlockNumber: /* @__PURE__ */ __name((args) => watchBlockNumber(client, args), "watchBlockNumber"),
    watchContractEvent: /* @__PURE__ */ __name((args) => watchContractEvent(client, args), "watchContractEvent"),
    watchEvent: /* @__PURE__ */ __name((args) => watchEvent(client, args), "watchEvent"),
    watchPendingTransactions: /* @__PURE__ */ __name((args) => watchPendingTransactions(client, args), "watchPendingTransactions")
  };
}
__name(publicActions, "publicActions");

// node_modules/viem/_esm/clients/createPublicClient.js
function createPublicClient(parameters) {
  const { key = "public", name = "Public Client" } = parameters;
  const client = createClient({
    ...parameters,
    key,
    name,
    type: "publicClient"
  });
  return client.extend(publicActions);
}
__name(createPublicClient, "createPublicClient");

// node_modules/viem/_esm/clients/decorators/wallet.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/actions/wallet/addChain.js
init_checked_fetch();
init_modules_watch_stub();
init_toHex();
async function addChain(client, { chain }) {
  const { id, name, nativeCurrency, rpcUrls, blockExplorers } = chain;
  await client.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: numberToHex(id),
        chainName: name,
        nativeCurrency,
        rpcUrls: rpcUrls.default.http,
        blockExplorerUrls: blockExplorers ? Object.values(blockExplorers).map(({ url }) => url) : void 0
      }
    ]
  }, { dedupe: true, retryCount: 0 });
}
__name(addChain, "addChain");

// node_modules/viem/_esm/actions/wallet/deployContract.js
init_checked_fetch();
init_modules_watch_stub();
init_encodeDeployData();
function deployContract(walletClient, parameters) {
  const { abi: abi2, args, bytecode, ...request } = parameters;
  const calldata = encodeDeployData({ abi: abi2, args, bytecode });
  return sendTransaction(walletClient, {
    ...request,
    ...request.authorizationList ? { to: null } : {},
    data: calldata
  });
}
__name(deployContract, "deployContract");

// node_modules/viem/_esm/actions/wallet/getAddresses.js
init_checked_fetch();
init_modules_watch_stub();
init_getAddress();
async function getAddresses(client) {
  if (client.account?.type === "local")
    return [client.account.address];
  const addresses = await client.request({ method: "eth_accounts" }, { dedupe: true });
  return addresses.map((address) => checksumAddress(address));
}
__name(getAddresses, "getAddresses");

// node_modules/viem/_esm/actions/wallet/getCapabilities.js
init_checked_fetch();
init_modules_watch_stub();
init_parseAccount();
init_toHex();
async function getCapabilities(client, parameters = {}) {
  const { account = client.account, chainId } = parameters;
  const account_ = account ? parseAccount(account) : void 0;
  const params = chainId ? [account_?.address, [numberToHex(chainId)]] : [account_?.address];
  const capabilities_raw = await client.request({
    method: "wallet_getCapabilities",
    params
  });
  const capabilities = {};
  for (const [chainId2, capabilities_] of Object.entries(capabilities_raw)) {
    capabilities[Number(chainId2)] = {};
    for (let [key, value] of Object.entries(capabilities_)) {
      if (key === "addSubAccount")
        key = "unstable_addSubAccount";
      capabilities[Number(chainId2)][key] = value;
    }
  }
  return typeof chainId === "number" ? capabilities[chainId] : capabilities;
}
__name(getCapabilities, "getCapabilities");

// node_modules/viem/_esm/actions/wallet/getPermissions.js
init_checked_fetch();
init_modules_watch_stub();
async function getPermissions(client) {
  const permissions = await client.request({ method: "wallet_getPermissions" }, { dedupe: true });
  return permissions;
}
__name(getPermissions, "getPermissions");

// node_modules/viem/_esm/actions/wallet/prepareAuthorization.js
init_checked_fetch();
init_modules_watch_stub();
init_parseAccount();
init_isAddressEqual();
async function prepareAuthorization(client, parameters) {
  const { account: account_ = client.account, chainId, nonce } = parameters;
  if (!account_)
    throw new AccountNotFoundError({
      docsPath: "/docs/eip7702/prepareAuthorization"
    });
  const account = parseAccount(account_);
  const executor = (() => {
    if (!parameters.executor)
      return void 0;
    if (parameters.executor === "self")
      return parameters.executor;
    return parseAccount(parameters.executor);
  })();
  const authorization = {
    address: parameters.contractAddress ?? parameters.address,
    chainId,
    nonce
  };
  if (typeof authorization.chainId === "undefined")
    authorization.chainId = client.chain?.id ?? await getAction(client, getChainId, "getChainId")({});
  if (typeof authorization.nonce === "undefined") {
    authorization.nonce = await getAction(client, getTransactionCount, "getTransactionCount")({
      address: account.address,
      blockTag: "pending"
    });
    if (executor === "self" || executor?.address && isAddressEqual(executor.address, account.address))
      authorization.nonce += 1;
  }
  return authorization;
}
__name(prepareAuthorization, "prepareAuthorization");

// node_modules/viem/_esm/actions/wallet/requestAddresses.js
init_checked_fetch();
init_modules_watch_stub();
init_getAddress();
async function requestAddresses(client) {
  const addresses = await client.request({ method: "eth_requestAccounts" }, { dedupe: true, retryCount: 0 });
  return addresses.map((address) => getAddress(address));
}
__name(requestAddresses, "requestAddresses");

// node_modules/viem/_esm/actions/wallet/requestPermissions.js
init_checked_fetch();
init_modules_watch_stub();
async function requestPermissions(client, permissions) {
  return client.request({
    method: "wallet_requestPermissions",
    params: [permissions]
  }, { retryCount: 0 });
}
__name(requestPermissions, "requestPermissions");

// node_modules/viem/_esm/actions/wallet/showCallsStatus.js
init_checked_fetch();
init_modules_watch_stub();
async function showCallsStatus(client, parameters) {
  const { id } = parameters;
  await client.request({
    method: "wallet_showCallsStatus",
    params: [id]
  });
  return;
}
__name(showCallsStatus, "showCallsStatus");

// node_modules/viem/_esm/actions/wallet/signAuthorization.js
init_checked_fetch();
init_modules_watch_stub();
init_parseAccount();
async function signAuthorization(client, parameters) {
  const { account: account_ = client.account } = parameters;
  if (!account_)
    throw new AccountNotFoundError({
      docsPath: "/docs/eip7702/signAuthorization"
    });
  const account = parseAccount(account_);
  if (!account.signAuthorization)
    throw new AccountTypeNotSupportedError({
      docsPath: "/docs/eip7702/signAuthorization",
      metaMessages: [
        "The `signAuthorization` Action does not support JSON-RPC Accounts."
      ],
      type: account.type
    });
  const authorization = await prepareAuthorization(client, parameters);
  return account.signAuthorization(authorization);
}
__name(signAuthorization, "signAuthorization");

// node_modules/viem/_esm/actions/wallet/signMessage.js
init_checked_fetch();
init_modules_watch_stub();
init_parseAccount();
init_toHex();
async function signMessage(client, { account: account_ = client.account, message }) {
  if (!account_)
    throw new AccountNotFoundError({
      docsPath: "/docs/actions/wallet/signMessage"
    });
  const account = parseAccount(account_);
  if (account.signMessage)
    return account.signMessage({ message });
  const message_ = (() => {
    if (typeof message === "string")
      return stringToHex(message);
    if (message.raw instanceof Uint8Array)
      return toHex(message.raw);
    return message.raw;
  })();
  return client.request({
    method: "personal_sign",
    params: [message_, account.address]
  }, { retryCount: 0 });
}
__name(signMessage, "signMessage");

// node_modules/viem/_esm/actions/wallet/signTransaction.js
init_checked_fetch();
init_modules_watch_stub();
init_parseAccount();
init_toHex();
init_transactionRequest();
init_assertRequest();
async function signTransaction(client, parameters) {
  const { account: account_ = client.account, chain = client.chain, ...transaction } = parameters;
  if (!account_)
    throw new AccountNotFoundError({
      docsPath: "/docs/actions/wallet/signTransaction"
    });
  const account = parseAccount(account_);
  assertRequest({
    account,
    ...parameters
  });
  const chainId = await getAction(client, getChainId, "getChainId")({});
  if (chain !== null)
    assertCurrentChain({
      currentChainId: chainId,
      chain
    });
  const formatters = chain?.formatters || client.chain?.formatters;
  const format = formatters?.transactionRequest?.format || formatTransactionRequest;
  if (account.signTransaction)
    return account.signTransaction({
      ...transaction,
      chainId
    }, { serializer: client.chain?.serializers?.transaction });
  return await client.request({
    method: "eth_signTransaction",
    params: [
      {
        ...format(transaction),
        chainId: numberToHex(chainId),
        from: account.address
      }
    ]
  }, { retryCount: 0 });
}
__name(signTransaction, "signTransaction");

// node_modules/viem/_esm/actions/wallet/signTypedData.js
init_checked_fetch();
init_modules_watch_stub();
init_parseAccount();
async function signTypedData(client, parameters) {
  const { account: account_ = client.account, domain, message, primaryType } = parameters;
  if (!account_)
    throw new AccountNotFoundError({
      docsPath: "/docs/actions/wallet/signTypedData"
    });
  const account = parseAccount(account_);
  const types = {
    EIP712Domain: getTypesForEIP712Domain({ domain }),
    ...parameters.types
  };
  validateTypedData({ domain, message, primaryType, types });
  if (account.signTypedData)
    return account.signTypedData({ domain, message, primaryType, types });
  const typedData = serializeTypedData({ domain, message, primaryType, types });
  return client.request({
    method: "eth_signTypedData_v4",
    params: [account.address, typedData]
  }, { retryCount: 0 });
}
__name(signTypedData, "signTypedData");

// node_modules/viem/_esm/actions/wallet/switchChain.js
init_checked_fetch();
init_modules_watch_stub();
init_toHex();
async function switchChain(client, { id }) {
  await client.request({
    method: "wallet_switchEthereumChain",
    params: [
      {
        chainId: numberToHex(id)
      }
    ]
  }, { retryCount: 0 });
}
__name(switchChain, "switchChain");

// node_modules/viem/_esm/actions/wallet/watchAsset.js
init_checked_fetch();
init_modules_watch_stub();
async function watchAsset(client, params) {
  const added = await client.request({
    method: "wallet_watchAsset",
    params
  }, { retryCount: 0 });
  return added;
}
__name(watchAsset, "watchAsset");

// node_modules/viem/_esm/clients/decorators/wallet.js
function walletActions(client) {
  return {
    addChain: /* @__PURE__ */ __name((args) => addChain(client, args), "addChain"),
    deployContract: /* @__PURE__ */ __name((args) => deployContract(client, args), "deployContract"),
    getAddresses: /* @__PURE__ */ __name(() => getAddresses(client), "getAddresses"),
    getCallsStatus: /* @__PURE__ */ __name((args) => getCallsStatus(client, args), "getCallsStatus"),
    getCapabilities: /* @__PURE__ */ __name((args) => getCapabilities(client, args), "getCapabilities"),
    getChainId: /* @__PURE__ */ __name(() => getChainId(client), "getChainId"),
    getPermissions: /* @__PURE__ */ __name(() => getPermissions(client), "getPermissions"),
    prepareAuthorization: /* @__PURE__ */ __name((args) => prepareAuthorization(client, args), "prepareAuthorization"),
    prepareTransactionRequest: /* @__PURE__ */ __name((args) => prepareTransactionRequest(client, args), "prepareTransactionRequest"),
    requestAddresses: /* @__PURE__ */ __name(() => requestAddresses(client), "requestAddresses"),
    requestPermissions: /* @__PURE__ */ __name((args) => requestPermissions(client, args), "requestPermissions"),
    sendCalls: /* @__PURE__ */ __name((args) => sendCalls(client, args), "sendCalls"),
    sendRawTransaction: /* @__PURE__ */ __name((args) => sendRawTransaction(client, args), "sendRawTransaction"),
    sendTransaction: /* @__PURE__ */ __name((args) => sendTransaction(client, args), "sendTransaction"),
    showCallsStatus: /* @__PURE__ */ __name((args) => showCallsStatus(client, args), "showCallsStatus"),
    signAuthorization: /* @__PURE__ */ __name((args) => signAuthorization(client, args), "signAuthorization"),
    signMessage: /* @__PURE__ */ __name((args) => signMessage(client, args), "signMessage"),
    signTransaction: /* @__PURE__ */ __name((args) => signTransaction(client, args), "signTransaction"),
    signTypedData: /* @__PURE__ */ __name((args) => signTypedData(client, args), "signTypedData"),
    switchChain: /* @__PURE__ */ __name((args) => switchChain(client, args), "switchChain"),
    waitForCallsStatus: /* @__PURE__ */ __name((args) => waitForCallsStatus(client, args), "waitForCallsStatus"),
    watchAsset: /* @__PURE__ */ __name((args) => watchAsset(client, args), "watchAsset"),
    writeContract: /* @__PURE__ */ __name((args) => writeContract(client, args), "writeContract")
  };
}
__name(walletActions, "walletActions");

// node_modules/viem/_esm/clients/createWalletClient.js
init_checked_fetch();
init_modules_watch_stub();
function createWalletClient(parameters) {
  const { key = "wallet", name = "Wallet Client", transport } = parameters;
  const client = createClient({
    ...parameters,
    key,
    name,
    transport,
    type: "walletClient"
  });
  return client.extend(walletActions);
}
__name(createWalletClient, "createWalletClient");

// node_modules/viem/_esm/index.js
init_abis();

// node_modules/viem/_esm/accounts/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/viem/_esm/accounts/privateKeyToAccount.js
init_checked_fetch();
init_modules_watch_stub();
init_secp256k1();
init_toHex();

// node_modules/viem/_esm/accounts/toAccount.js
init_checked_fetch();
init_modules_watch_stub();
init_address();
init_isAddress();
function toAccount(source) {
  if (typeof source === "string") {
    if (!isAddress(source, { strict: false }))
      throw new InvalidAddressError({ address: source });
    return {
      address: source,
      type: "json-rpc"
    };
  }
  if (!isAddress(source.address, { strict: false }))
    throw new InvalidAddressError({ address: source.address });
  return {
    address: source.address,
    nonceManager: source.nonceManager,
    sign: source.sign,
    signAuthorization: source.signAuthorization,
    signMessage: source.signMessage,
    signTransaction: source.signTransaction,
    signTypedData: source.signTypedData,
    source: "custom",
    type: "local"
  };
}
__name(toAccount, "toAccount");

// node_modules/viem/_esm/accounts/utils/sign.js
init_checked_fetch();
init_modules_watch_stub();
init_secp256k1();
init_toHex();
var extraEntropy = false;
async function sign({ hash: hash2, privateKey, to = "object" }) {
  const { r, s, recovery } = secp256k1.sign(hash2.slice(2), privateKey.slice(2), { lowS: true, extraEntropy });
  const signature = {
    r: numberToHex(r, { size: 32 }),
    s: numberToHex(s, { size: 32 }),
    v: recovery ? 28n : 27n,
    yParity: recovery
  };
  return (() => {
    if (to === "bytes" || to === "hex")
      return serializeSignature({ ...signature, to });
    return signature;
  })();
}
__name(sign, "sign");

// node_modules/viem/_esm/accounts/utils/signAuthorization.js
init_checked_fetch();
init_modules_watch_stub();
async function signAuthorization2(parameters) {
  const { chainId, nonce, privateKey, to = "object" } = parameters;
  const address = parameters.contractAddress ?? parameters.address;
  const signature = await sign({
    hash: hashAuthorization({ address, chainId, nonce }),
    privateKey,
    to
  });
  if (to === "object")
    return {
      address,
      chainId,
      nonce,
      ...signature
    };
  return signature;
}
__name(signAuthorization2, "signAuthorization");

// node_modules/viem/_esm/accounts/utils/signMessage.js
init_checked_fetch();
init_modules_watch_stub();
async function signMessage2({ message, privateKey }) {
  return await sign({ hash: hashMessage(message), privateKey, to: "hex" });
}
__name(signMessage2, "signMessage");

// node_modules/viem/_esm/accounts/utils/signTransaction.js
init_checked_fetch();
init_modules_watch_stub();
init_keccak256();
async function signTransaction2(parameters) {
  const { privateKey, transaction, serializer = serializeTransaction } = parameters;
  const signableTransaction = (() => {
    if (transaction.type === "eip4844")
      return {
        ...transaction,
        sidecars: false
      };
    return transaction;
  })();
  const signature = await sign({
    hash: keccak256(serializer(signableTransaction)),
    privateKey
  });
  return serializer(transaction, signature);
}
__name(signTransaction2, "signTransaction");

// node_modules/viem/_esm/accounts/utils/signTypedData.js
init_checked_fetch();
init_modules_watch_stub();
async function signTypedData2(parameters) {
  const { privateKey, ...typedData } = parameters;
  return await sign({
    hash: hashTypedData(typedData),
    privateKey,
    to: "hex"
  });
}
__name(signTypedData2, "signTypedData");

// node_modules/viem/_esm/accounts/privateKeyToAccount.js
function privateKeyToAccount(privateKey, options = {}) {
  const { nonceManager } = options;
  const publicKey = toHex(secp256k1.getPublicKey(privateKey.slice(2), false));
  const address = publicKeyToAddress(publicKey);
  const account = toAccount({
    address,
    nonceManager,
    async sign({ hash: hash2 }) {
      return sign({ hash: hash2, privateKey, to: "hex" });
    },
    async signAuthorization(authorization) {
      return signAuthorization2({ ...authorization, privateKey });
    },
    async signMessage({ message }) {
      return signMessage2({ message, privateKey });
    },
    async signTransaction(transaction, { serializer } = {}) {
      return signTransaction2({ privateKey, transaction, serializer });
    },
    async signTypedData(typedData) {
      return signTypedData2({ ...typedData, privateKey });
    }
  });
  return {
    ...account,
    publicKey,
    source: "privateKey"
  };
}
__name(privateKeyToAccount, "privateKeyToAccount");

// workers/src/precompiled-contracts.json
var precompiled_contracts_default = {
  erc20_mintable: {
    abi: [
      {
        inputs: [
          {
            internalType: "string",
            name: "name",
            type: "string"
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string"
          },
          {
            internalType: "address",
            name: "initialOwner",
            type: "address"
          }
        ],
        stateMutability: "nonpayable",
        type: "constructor"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "allowance",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "needed",
            type: "uint256"
          }
        ],
        name: "ERC20InsufficientAllowance",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "balance",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "needed",
            type: "uint256"
          }
        ],
        name: "ERC20InsufficientBalance",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "approver",
            type: "address"
          }
        ],
        name: "ERC20InvalidApprover",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "receiver",
            type: "address"
          }
        ],
        name: "ERC20InvalidReceiver",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address"
          }
        ],
        name: "ERC20InvalidSender",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address"
          }
        ],
        name: "ERC20InvalidSpender",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          }
        ],
        name: "OwnableInvalidOwner",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          }
        ],
        name: "OwnableUnauthorizedAccount",
        type: "error"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address"
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "Approval",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address"
          }
        ],
        name: "OwnershipTransferred",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "Transfer",
        type: "event"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          },
          {
            internalType: "address",
            name: "spender",
            type: "address"
          }
        ],
        name: "allowance",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "approve",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          }
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          }
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [],
        name: "name",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "transfer",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "transferFrom",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address"
          }
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      }
    ],
    bytecode: "0x608060405234801561000f575f5ffd5b50604051610bcc380380610bcc83398101604081905261002e9161017a565b808383600361003d8382610283565b50600461004a8282610283565b5050506001600160a01b03811661007a57604051631e4fbdf760e01b81525f600482015260240160405180910390fd5b6100838161008c565b5050505061033d565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b634e487b7160e01b5f52604160045260245ffd5b5f82601f830112610100575f5ffd5b81516001600160401b03811115610119576101196100dd565b604051601f8201601f19908116603f011681016001600160401b0381118282101715610147576101476100dd565b60405281815283820160200185101561015e575f5ffd5b8160208501602083015e5f918101602001919091529392505050565b5f5f5f6060848603121561018c575f5ffd5b83516001600160401b038111156101a1575f5ffd5b6101ad868287016100f1565b602086015190945090506001600160401b038111156101ca575f5ffd5b6101d6868287016100f1565b604086015190935090506001600160a01b03811681146101f4575f5ffd5b809150509250925092565b600181811c9082168061021357607f821691505b60208210810361023157634e487b7160e01b5f52602260045260245ffd5b50919050565b601f82111561027e57805f5260205f20601f840160051c8101602085101561025c5750805b601f840160051c820191505b8181101561027b575f8155600101610268565b50505b505050565b81516001600160401b0381111561029c5761029c6100dd565b6102b0816102aa84546101ff565b84610237565b6020601f8211600181146102e2575f83156102cb5750848201515b5f19600385901b1c1916600184901b17845561027b565b5f84815260208120601f198516915b8281101561031157878501518255602094850194600190920191016102f1565b508482101561032e57868401515f19600387901b60f8161c191681555b50505050600190811b01905550565b6108828061034a5f395ff3fe608060405234801561000f575f5ffd5b50600436106100cb575f3560e01c806370a082311161008857806395d89b411161006357806395d89b41146101a4578063a9059cbb146101ac578063dd62ed3e146101bf578063f2fde38b146101f7575f5ffd5b806370a0823114610159578063715018a6146101815780638da5cb5b14610189575f5ffd5b806306fdde03146100cf578063095ea7b3146100ed57806318160ddd1461011057806323b872dd14610122578063313ce5671461013557806340c10f1914610144575b5f5ffd5b6100d761020a565b6040516100e491906106f2565b60405180910390f35b6101006100fb366004610742565b61029a565b60405190151581526020016100e4565b6002545b6040519081526020016100e4565b61010061013036600461076a565b6102b3565b604051601281526020016100e4565b610157610152366004610742565b6102d6565b005b6101146101673660046107a4565b6001600160a01b03165f9081526020819052604090205490565b6101576102ec565b6005546040516001600160a01b0390911681526020016100e4565b6100d76102ff565b6101006101ba366004610742565b61030e565b6101146101cd3660046107c4565b6001600160a01b039182165f90815260016020908152604080832093909416825291909152205490565b6101576102053660046107a4565b61031b565b606060038054610219906107f5565b80601f0160208091040260200160405190810160405280929190818152602001828054610245906107f5565b80156102905780601f1061026757610100808354040283529160200191610290565b820191905f5260205f20905b81548152906001019060200180831161027357829003601f168201915b5050505050905090565b5f336102a781858561035d565b60019150505b92915050565b5f336102c085828561036f565b6102cb8585856103eb565b506001949350505050565b6102de610448565b6102e88282610475565b5050565b6102f4610448565b6102fd5f6104a9565b565b606060048054610219906107f5565b5f336102a78185856103eb565b610323610448565b6001600160a01b03811661035157604051631e4fbdf760e01b81525f60048201526024015b60405180910390fd5b61035a816104a9565b50565b61036a83838360016104fa565b505050565b6001600160a01b038381165f908152600160209081526040808320938616835292905220545f198110156103e557818110156103d757604051637dc7a0d960e11b81526001600160a01b03841660048201526024810182905260448101839052606401610348565b6103e584848484035f6104fa565b50505050565b6001600160a01b03831661041457604051634b637e8f60e11b81525f6004820152602401610348565b6001600160a01b03821661043d5760405163ec442f0560e01b81525f6004820152602401610348565b61036a8383836105cc565b6005546001600160a01b031633146102fd5760405163118cdaa760e01b8152336004820152602401610348565b6001600160a01b03821661049e5760405163ec442f0560e01b81525f6004820152602401610348565b6102e85f83836105cc565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b6001600160a01b0384166105235760405163e602df0560e01b81525f6004820152602401610348565b6001600160a01b03831661054c57604051634a1406b160e11b81525f6004820152602401610348565b6001600160a01b038085165f90815260016020908152604080832093871683529290522082905580156103e557826001600160a01b0316846001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040516105be91815260200190565b60405180910390a350505050565b6001600160a01b0383166105f6578060025f8282546105eb919061082d565b909155506106669050565b6001600160a01b0383165f90815260208190526040902054818110156106485760405163391434e360e21b81526001600160a01b03851660048201526024810182905260448101839052606401610348565b6001600160a01b0384165f9081526020819052604090209082900390555b6001600160a01b038216610682576002805482900390556106a0565b6001600160a01b0382165f9081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516106e591815260200190565b60405180910390a3505050565b602081525f82518060208401528060208501604085015e5f604082850101526040601f19601f83011684010191505092915050565b80356001600160a01b038116811461073d575f5ffd5b919050565b5f5f60408385031215610753575f5ffd5b61075c83610727565b946020939093013593505050565b5f5f5f6060848603121561077c575f5ffd5b61078584610727565b925061079360208501610727565b929592945050506040919091013590565b5f602082840312156107b4575f5ffd5b6107bd82610727565b9392505050565b5f5f604083850312156107d5575f5ffd5b6107de83610727565b91506107ec60208401610727565b90509250929050565b600181811c9082168061080957607f821691505b60208210810361082757634e487b7160e01b5f52602260045260245ffd5b50919050565b808201808211156102ad57634e487b7160e01b5f52601160045260245ffdfea2646970667358221220c8813648ebbc68871497785e90e880a5fd35adec98a0ed0fbdce47cdb0e534f964736f6c634300081e0033"
  },
  erc20_burnable_mintable: {
    abi: [
      {
        inputs: [
          {
            internalType: "string",
            name: "name",
            type: "string"
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string"
          },
          {
            internalType: "address",
            name: "initialOwner",
            type: "address"
          }
        ],
        stateMutability: "nonpayable",
        type: "constructor"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "allowance",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "needed",
            type: "uint256"
          }
        ],
        name: "ERC20InsufficientAllowance",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "balance",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "needed",
            type: "uint256"
          }
        ],
        name: "ERC20InsufficientBalance",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "approver",
            type: "address"
          }
        ],
        name: "ERC20InvalidApprover",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "receiver",
            type: "address"
          }
        ],
        name: "ERC20InvalidReceiver",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address"
          }
        ],
        name: "ERC20InvalidSender",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address"
          }
        ],
        name: "ERC20InvalidSpender",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          }
        ],
        name: "OwnableInvalidOwner",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          }
        ],
        name: "OwnableUnauthorizedAccount",
        type: "error"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address"
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "Approval",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address"
          }
        ],
        name: "OwnershipTransferred",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "Transfer",
        type: "event"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          },
          {
            internalType: "address",
            name: "spender",
            type: "address"
          }
        ],
        name: "allowance",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "approve",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          }
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "burnFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          }
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [],
        name: "name",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "transfer",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "transferFrom",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address"
          }
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      }
    ],
    bytecode: "0x608060405234801561000f575f5ffd5b50604051610c81380380610c8183398101604081905261002e9161017a565b808383600361003d8382610283565b50600461004a8282610283565b5050506001600160a01b03811661007a57604051631e4fbdf760e01b81525f600482015260240160405180910390fd5b6100838161008c565b5050505061033d565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b634e487b7160e01b5f52604160045260245ffd5b5f82601f830112610100575f5ffd5b81516001600160401b03811115610119576101196100dd565b604051601f8201601f19908116603f011681016001600160401b0381118282101715610147576101476100dd565b60405281815283820160200185101561015e575f5ffd5b8160208501602083015e5f918101602001919091529392505050565b5f5f5f6060848603121561018c575f5ffd5b83516001600160401b038111156101a1575f5ffd5b6101ad868287016100f1565b602086015190945090506001600160401b038111156101ca575f5ffd5b6101d6868287016100f1565b604086015190935090506001600160a01b03811681146101f4575f5ffd5b809150509250925092565b600181811c9082168061021357607f821691505b60208210810361023157634e487b7160e01b5f52602260045260245ffd5b50919050565b601f82111561027e57805f5260205f20601f840160051c8101602085101561025c5750805b601f840160051c820191505b8181101561027b575f8155600101610268565b50505b505050565b81516001600160401b0381111561029c5761029c6100dd565b6102b0816102aa84546101ff565b84610237565b6020601f8211600181146102e2575f83156102cb5750848201515b5f19600385901b1c1916600184901b17845561027b565b5f84815260208120601f198516915b8281101561031157878501518255602094850194600190920191016102f1565b508482101561032e57868401515f19600387901b60f8161c191681555b50505050600190811b01905550565b6109378061034a5f395ff3fe608060405234801561000f575f5ffd5b50600436106100f0575f3560e01c806370a082311161009357806395d89b411161006357806395d89b41146101ef578063a9059cbb146101f7578063dd62ed3e1461020a578063f2fde38b14610242575f5ffd5b806370a0823114610191578063715018a6146101b957806379cc6790146101c15780638da5cb5b146101d4575f5ffd5b806323b872dd116100ce57806323b872dd14610147578063313ce5671461015a57806340c10f191461016957806342966c681461017e575f5ffd5b806306fdde03146100f4578063095ea7b31461011257806318160ddd14610135575b5f5ffd5b6100fc610255565b6040516101099190610790565b60405180910390f35b6101256101203660046107e0565b6102e5565b6040519015158152602001610109565b6002545b604051908152602001610109565b610125610155366004610808565b6102fe565b60405160128152602001610109565b61017c6101773660046107e0565b610321565b005b61017c61018c366004610842565b610337565b61013961019f366004610859565b6001600160a01b03165f9081526020819052604090205490565b61017c610344565b61017c6101cf3660046107e0565b610357565b6005546040516001600160a01b039091168152602001610109565b6100fc61036c565b6101256102053660046107e0565b61037b565b610139610218366004610879565b6001600160a01b039182165f90815260016020908152604080832093909416825291909152205490565b61017c610250366004610859565b610388565b606060038054610264906108aa565b80601f0160208091040260200160405190810160405280929190818152602001828054610290906108aa565b80156102db5780601f106102b2576101008083540402835291602001916102db565b820191905f5260205f20905b8154815290600101906020018083116102be57829003601f168201915b5050505050905090565b5f336102f28185856103c7565b60019150505b92915050565b5f3361030b8582856103d9565b610316858585610455565b506001949350505050565b6103296104b2565b61033382826104df565b5050565b6103413382610513565b50565b61034c6104b2565b6103555f610547565b565b6103628233836103d9565b6103338282610513565b606060048054610264906108aa565b5f336102f2818585610455565b6103906104b2565b6001600160a01b0381166103be57604051631e4fbdf760e01b81525f60048201526024015b60405180910390fd5b61034181610547565b6103d48383836001610598565b505050565b6001600160a01b038381165f908152600160209081526040808320938616835292905220545f1981101561044f578181101561044157604051637dc7a0d960e11b81526001600160a01b038416600482015260248101829052604481018390526064016103b5565b61044f84848484035f610598565b50505050565b6001600160a01b03831661047e57604051634b637e8f60e11b81525f60048201526024016103b5565b6001600160a01b0382166104a75760405163ec442f0560e01b81525f60048201526024016103b5565b6103d483838361066a565b6005546001600160a01b031633146103555760405163118cdaa760e01b81523360048201526024016103b5565b6001600160a01b0382166105085760405163ec442f0560e01b81525f60048201526024016103b5565b6103335f838361066a565b6001600160a01b03821661053c57604051634b637e8f60e11b81525f60048201526024016103b5565b610333825f8361066a565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b6001600160a01b0384166105c15760405163e602df0560e01b81525f60048201526024016103b5565b6001600160a01b0383166105ea57604051634a1406b160e11b81525f60048201526024016103b5565b6001600160a01b038085165f908152600160209081526040808320938716835292905220829055801561044f57826001600160a01b0316846001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258460405161065c91815260200190565b60405180910390a350505050565b6001600160a01b038316610694578060025f82825461068991906108e2565b909155506107049050565b6001600160a01b0383165f90815260208190526040902054818110156106e65760405163391434e360e21b81526001600160a01b038516600482015260248101829052604481018390526064016103b5565b6001600160a01b0384165f9081526020819052604090209082900390555b6001600160a01b0382166107205760028054829003905561073e565b6001600160a01b0382165f9081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161078391815260200190565b60405180910390a3505050565b602081525f82518060208401528060208501604085015e5f604082850101526040601f19601f83011684010191505092915050565b80356001600160a01b03811681146107db575f5ffd5b919050565b5f5f604083850312156107f1575f5ffd5b6107fa836107c5565b946020939093013593505050565b5f5f5f6060848603121561081a575f5ffd5b610823846107c5565b9250610831602085016107c5565b929592945050506040919091013590565b5f60208284031215610852575f5ffd5b5035919050565b5f60208284031215610869575f5ffd5b610872826107c5565b9392505050565b5f5f6040838503121561088a575f5ffd5b610893836107c5565b91506108a1602084016107c5565b90509250929050565b600181811c908216806108be57607f821691505b6020821081036108dc57634e487b7160e01b5f52602260045260245ffd5b50919050565b808201808211156102f857634e487b7160e01b5f52601160045260245ffdfea2646970667358221220bb158108d3d36b4002038485269deafe0c6395a0400fe8e0492c95e4bfda424864736f6c634300081e0033"
  },
  erc20_mintable_permit: {
    abi: [
      {
        inputs: [
          {
            internalType: "string",
            name: "name",
            type: "string"
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string"
          },
          {
            internalType: "address",
            name: "initialOwner",
            type: "address"
          }
        ],
        stateMutability: "nonpayable",
        type: "constructor"
      },
      {
        inputs: [],
        name: "ECDSAInvalidSignature",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "length",
            type: "uint256"
          }
        ],
        name: "ECDSAInvalidSignatureLength",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "s",
            type: "bytes32"
          }
        ],
        name: "ECDSAInvalidSignatureS",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "allowance",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "needed",
            type: "uint256"
          }
        ],
        name: "ERC20InsufficientAllowance",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "balance",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "needed",
            type: "uint256"
          }
        ],
        name: "ERC20InsufficientBalance",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "approver",
            type: "address"
          }
        ],
        name: "ERC20InvalidApprover",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "receiver",
            type: "address"
          }
        ],
        name: "ERC20InvalidReceiver",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address"
          }
        ],
        name: "ERC20InvalidSender",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address"
          }
        ],
        name: "ERC20InvalidSpender",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256"
          }
        ],
        name: "ERC2612ExpiredSignature",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "signer",
            type: "address"
          },
          {
            internalType: "address",
            name: "owner",
            type: "address"
          }
        ],
        name: "ERC2612InvalidSigner",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "currentNonce",
            type: "uint256"
          }
        ],
        name: "InvalidAccountNonce",
        type: "error"
      },
      {
        inputs: [],
        name: "InvalidShortString",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          }
        ],
        name: "OwnableInvalidOwner",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          }
        ],
        name: "OwnableUnauthorizedAccount",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "str",
            type: "string"
          }
        ],
        name: "StringTooLong",
        type: "error"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address"
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "Approval",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [],
        name: "EIP712DomainChanged",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address"
          }
        ],
        name: "OwnershipTransferred",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "Transfer",
        type: "event"
      },
      {
        inputs: [],
        name: "DOMAIN_SEPARATOR",
        outputs: [
          {
            internalType: "bytes32",
            name: "",
            type: "bytes32"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          },
          {
            internalType: "address",
            name: "spender",
            type: "address"
          }
        ],
        name: "allowance",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "approve",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          }
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "eip712Domain",
        outputs: [
          {
            internalType: "bytes1",
            name: "fields",
            type: "bytes1"
          },
          {
            internalType: "string",
            name: "name",
            type: "string"
          },
          {
            internalType: "string",
            name: "version",
            type: "string"
          },
          {
            internalType: "uint256",
            name: "chainId",
            type: "uint256"
          },
          {
            internalType: "address",
            name: "verifyingContract",
            type: "address"
          },
          {
            internalType: "bytes32",
            name: "salt",
            type: "bytes32"
          },
          {
            internalType: "uint256[]",
            name: "extensions",
            type: "uint256[]"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          }
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [],
        name: "name",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          }
        ],
        name: "nonces",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          },
          {
            internalType: "address",
            name: "spender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256"
          },
          {
            internalType: "uint8",
            name: "v",
            type: "uint8"
          },
          {
            internalType: "bytes32",
            name: "r",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "s",
            type: "bytes32"
          }
        ],
        name: "permit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "transfer",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "transferFrom",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address"
          }
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      }
    ],
    bytecode: "0x610160604052348015610010575f5ffd5b5060405161155738038061155783398101604081905261002f916102b8565b6040805180820190915260018152603160f81b602082015283908190838286600361005a83826103c1565b50600461006782826103c1565b5050506001600160a01b03811661009857604051631e4fbdf760e01b81525f60048201526024015b60405180910390fd5b6100a18161015b565b506100ad8260066101ac565b610120526100bc8160076101ac565b61014052815160208084019190912060e052815190820120610100524660a05261014860e05161010051604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201529081019290925260608201524660808201523060a08201525f9060c00160405160208183030381529060405280519060200120905090565b60805250503060c052506104d392505050565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b5f6020835110156101c7576101c0836101de565b90506101d8565b816101d284826103c1565b5060ff90505b92915050565b5f5f829050601f81511115610208578260405163305a27a960e01b815260040161008f919061047b565b8051610213826104b0565b179392505050565b634e487b7160e01b5f52604160045260245ffd5b5f82601f83011261023e575f5ffd5b81516001600160401b038111156102575761025761021b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156102855761028561021b565b60405281815283820160200185101561029c575f5ffd5b8160208501602083015e5f918101602001919091529392505050565b5f5f5f606084860312156102ca575f5ffd5b83516001600160401b038111156102df575f5ffd5b6102eb8682870161022f565b602086015190945090506001600160401b03811115610308575f5ffd5b6103148682870161022f565b604086015190935090506001600160a01b0381168114610332575f5ffd5b809150509250925092565b600181811c9082168061035157607f821691505b60208210810361036f57634e487b7160e01b5f52602260045260245ffd5b50919050565b601f8211156103bc57805f5260205f20601f840160051c8101602085101561039a5750805b601f840160051c820191505b818110156103b9575f81556001016103a6565b50505b505050565b81516001600160401b038111156103da576103da61021b565b6103ee816103e8845461033d565b84610375565b6020601f821160018114610420575f83156104095750848201515b5f19600385901b1c1916600184901b1784556103b9565b5f84815260208120601f198516915b8281101561044f578785015182556020948501946001909201910161042f565b508482101561046c57868401515f19600387901b60f8161c191681555b50505050600190811b01905550565b602081525f82518060208401528060208501604085015e5f604082850101526040601f19601f83011684010191505092915050565b8051602080830151919081101561036f575f1960209190910360031b1b16919050565b60805160a05160c05160e0516101005161012051610140516110336105245f395f61087e01525f61085101525f61074801525f61072001525f61067b01525f6106a501525f6106cf01526110335ff3fe608060405234801561000f575f5ffd5b5060043610610106575f3560e01c8063715018a61161009e57806395d89b411161006e57806395d89b4114610215578063a9059cbb1461021d578063d505accf14610230578063dd62ed3e14610243578063f2fde38b1461027b575f5ffd5b8063715018a6146101c45780637ecebe00146101cc57806384b0196e146101df5780638da5cb5b146101fa575f5ffd5b8063313ce567116100d9578063313ce567146101705780633644e5151461017f57806340c10f191461018757806370a082311461019c575f5ffd5b806306fdde031461010a578063095ea7b31461012857806318160ddd1461014b57806323b872dd1461015d575b5f5ffd5b61011261028e565b60405161011f9190610daf565b60405180910390f35b61013b610136366004610de3565b61031e565b604051901515815260200161011f565b6002545b60405190815260200161011f565b61013b61016b366004610e0b565b610337565b6040516012815260200161011f565b61014f61035a565b61019a610195366004610de3565b610368565b005b61014f6101aa366004610e45565b6001600160a01b03165f9081526020819052604090205490565b61019a61037e565b61014f6101da366004610e45565b610391565b6101e76103ae565b60405161011f9796959493929190610e5e565b6005546040516001600160a01b03909116815260200161011f565b6101126103f0565b61013b61022b366004610de3565b6103ff565b61019a61023e366004610ef4565b61040c565b61014f610251366004610f61565b6001600160a01b039182165f90815260016020908152604080832093909416825291909152205490565b61019a610289366004610e45565b610547565b60606003805461029d90610f92565b80601f01602080910402602001604051908101604052809291908181526020018280546102c990610f92565b80156103145780601f106102eb57610100808354040283529160200191610314565b820191905f5260205f20905b8154815290600101906020018083116102f757829003601f168201915b5050505050905090565b5f3361032b818585610584565b60019150505b92915050565b5f33610344858285610596565b61034f858585610612565b506001949350505050565b5f61036361066f565b905090565b610370610798565b61037a82826107c5565b5050565b610386610798565b61038f5f6107f9565b565b6001600160a01b0381165f90815260086020526040812054610331565b5f6060805f5f5f60606103bf61084a565b6103c7610877565b604080515f80825260208201909252600f60f81b9b939a50919850469750309650945092509050565b60606004805461029d90610f92565b5f3361032b818585610612565b834211156104355760405163313c898160e11b8152600481018590526024015b60405180910390fd5b5f7f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98888886104808c6001600160a01b03165f90815260086020526040902080546001810190915590565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e0016040516020818303038152906040528051906020012090505f6104da826108a4565b90505f6104e9828787876108d0565b9050896001600160a01b0316816001600160a01b031614610530576040516325c0072360e11b81526001600160a01b0380831660048301528b16602482015260440161042c565b61053b8a8a8a610584565b50505050505050505050565b61054f610798565b6001600160a01b03811661057857604051631e4fbdf760e01b81525f600482015260240161042c565b610581816107f9565b50565b61059183838360016108fc565b505050565b6001600160a01b038381165f908152600160209081526040808320938616835292905220545f1981101561060c57818110156105fe57604051637dc7a0d960e11b81526001600160a01b0384166004820152602481018290526044810183905260640161042c565b61060c84848484035f6108fc565b50505050565b6001600160a01b03831661063b57604051634b637e8f60e11b81525f600482015260240161042c565b6001600160a01b0382166106645760405163ec442f0560e01b81525f600482015260240161042c565b6105918383836109ce565b5f306001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161480156106c757507f000000000000000000000000000000000000000000000000000000000000000046145b156106f157507f000000000000000000000000000000000000000000000000000000000000000090565b610363604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201527f0000000000000000000000000000000000000000000000000000000000000000918101919091527f000000000000000000000000000000000000000000000000000000000000000060608201524660808201523060a08201525f9060c00160405160208183030381529060405280519060200120905090565b6005546001600160a01b0316331461038f5760405163118cdaa760e01b815233600482015260240161042c565b6001600160a01b0382166107ee5760405163ec442f0560e01b81525f600482015260240161042c565b61037a5f83836109ce565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b60606103637f00000000000000000000000000000000000000000000000000000000000000006006610af4565b60606103637f00000000000000000000000000000000000000000000000000000000000000006007610af4565b5f6103316108b061066f565b8360405161190160f01b8152600281019290925260228201526042902090565b5f5f5f5f6108e088888888610b9d565b9250925092506108f08282610c65565b50909695505050505050565b6001600160a01b0384166109255760405163e602df0560e01b81525f600482015260240161042c565b6001600160a01b03831661094e57604051634a1406b160e11b81525f600482015260240161042c565b6001600160a01b038085165f908152600160209081526040808320938716835292905220829055801561060c57826001600160a01b0316846001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040516109c091815260200190565b60405180910390a350505050565b6001600160a01b0383166109f8578060025f8282546109ed9190610fca565b90915550610a689050565b6001600160a01b0383165f9081526020819052604090205481811015610a4a5760405163391434e360e21b81526001600160a01b0385166004820152602481018290526044810183905260640161042c565b6001600160a01b0384165f9081526020819052604090209082900390555b6001600160a01b038216610a8457600280548290039055610aa2565b6001600160a01b0382165f9081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610ae791815260200190565b60405180910390a3505050565b606060ff8314610b0e57610b0783610d1d565b9050610331565b818054610b1a90610f92565b80601f0160208091040260200160405190810160405280929190818152602001828054610b4690610f92565b8015610b915780601f10610b6857610100808354040283529160200191610b91565b820191905f5260205f20905b815481529060010190602001808311610b7457829003601f168201915b50505050509050610331565b5f80807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0841115610bd657505f91506003905082610c5b565b604080515f808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa158015610c27573d5f5f3e3d5ffd5b5050604051601f1901519150506001600160a01b038116610c5257505f925060019150829050610c5b565b92505f91508190505b9450945094915050565b5f826003811115610c7857610c78610fe9565b03610c81575050565b6001826003811115610c9557610c95610fe9565b03610cb35760405163f645eedf60e01b815260040160405180910390fd5b6002826003811115610cc757610cc7610fe9565b03610ce85760405163fce698f760e01b81526004810182905260240161042c565b6003826003811115610cfc57610cfc610fe9565b0361037a576040516335e2f38360e21b81526004810182905260240161042c565b60605f610d2983610d5a565b6040805160208082528183019092529192505f91906020820181803683375050509182525060208101929092525090565b5f60ff8216601f81111561033157604051632cd44ac360e21b815260040160405180910390fd5b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b602081525f610dc16020830184610d81565b9392505050565b80356001600160a01b0381168114610dde575f5ffd5b919050565b5f5f60408385031215610df4575f5ffd5b610dfd83610dc8565b946020939093013593505050565b5f5f5f60608486031215610e1d575f5ffd5b610e2684610dc8565b9250610e3460208501610dc8565b929592945050506040919091013590565b5f60208284031215610e55575f5ffd5b610dc182610dc8565b60ff60f81b8816815260e060208201525f610e7c60e0830189610d81565b8281036040840152610e8e8189610d81565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b81811015610ee3578351835260209384019390920191600101610ec5565b50909b9a5050505050505050505050565b5f5f5f5f5f5f5f60e0888a031215610f0a575f5ffd5b610f1388610dc8565b9650610f2160208901610dc8565b95506040880135945060608801359350608088013560ff81168114610f44575f5ffd5b9699959850939692959460a0840135945060c09093013592915050565b5f5f60408385031215610f72575f5ffd5b610f7b83610dc8565b9150610f8960208401610dc8565b90509250929050565b600181811c90821680610fa657607f821691505b602082108103610fc457634e487b7160e01b5f52602260045260245ffd5b50919050565b8082018082111561033157634e487b7160e01b5f52601160045260245ffd5b634e487b7160e01b5f52602160045260245ffdfea2646970667358221220ee332c21bb5af7ceacd5a6577ae9cb1ffe896765792e67ca4be5d1fb3baf25a564736f6c634300081e0033"
  },
  erc20_burnable_mintable_permit: {
    abi: [
      {
        inputs: [
          {
            internalType: "string",
            name: "name",
            type: "string"
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string"
          },
          {
            internalType: "address",
            name: "initialOwner",
            type: "address"
          }
        ],
        stateMutability: "nonpayable",
        type: "constructor"
      },
      {
        inputs: [],
        name: "ECDSAInvalidSignature",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "length",
            type: "uint256"
          }
        ],
        name: "ECDSAInvalidSignatureLength",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "s",
            type: "bytes32"
          }
        ],
        name: "ECDSAInvalidSignatureS",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "allowance",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "needed",
            type: "uint256"
          }
        ],
        name: "ERC20InsufficientAllowance",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "balance",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "needed",
            type: "uint256"
          }
        ],
        name: "ERC20InsufficientBalance",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "approver",
            type: "address"
          }
        ],
        name: "ERC20InvalidApprover",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "receiver",
            type: "address"
          }
        ],
        name: "ERC20InvalidReceiver",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address"
          }
        ],
        name: "ERC20InvalidSender",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address"
          }
        ],
        name: "ERC20InvalidSpender",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256"
          }
        ],
        name: "ERC2612ExpiredSignature",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "signer",
            type: "address"
          },
          {
            internalType: "address",
            name: "owner",
            type: "address"
          }
        ],
        name: "ERC2612InvalidSigner",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "currentNonce",
            type: "uint256"
          }
        ],
        name: "InvalidAccountNonce",
        type: "error"
      },
      {
        inputs: [],
        name: "InvalidShortString",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          }
        ],
        name: "OwnableInvalidOwner",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          }
        ],
        name: "OwnableUnauthorizedAccount",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "str",
            type: "string"
          }
        ],
        name: "StringTooLong",
        type: "error"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address"
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "Approval",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [],
        name: "EIP712DomainChanged",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address"
          }
        ],
        name: "OwnershipTransferred",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "Transfer",
        type: "event"
      },
      {
        inputs: [],
        name: "DOMAIN_SEPARATOR",
        outputs: [
          {
            internalType: "bytes32",
            name: "",
            type: "bytes32"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          },
          {
            internalType: "address",
            name: "spender",
            type: "address"
          }
        ],
        name: "allowance",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "approve",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          }
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "burnFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "eip712Domain",
        outputs: [
          {
            internalType: "bytes1",
            name: "fields",
            type: "bytes1"
          },
          {
            internalType: "string",
            name: "name",
            type: "string"
          },
          {
            internalType: "string",
            name: "version",
            type: "string"
          },
          {
            internalType: "uint256",
            name: "chainId",
            type: "uint256"
          },
          {
            internalType: "address",
            name: "verifyingContract",
            type: "address"
          },
          {
            internalType: "bytes32",
            name: "salt",
            type: "bytes32"
          },
          {
            internalType: "uint256[]",
            name: "extensions",
            type: "uint256[]"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          }
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [],
        name: "name",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          }
        ],
        name: "nonces",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          },
          {
            internalType: "address",
            name: "spender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256"
          },
          {
            internalType: "uint8",
            name: "v",
            type: "uint8"
          },
          {
            internalType: "bytes32",
            name: "r",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "s",
            type: "bytes32"
          }
        ],
        name: "permit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "transfer",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "transferFrom",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address"
          }
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      }
    ],
    bytecode: "0x610160604052348015610010575f5ffd5b506040516115fd3803806115fd83398101604081905261002f916102b8565b6040805180820190915260018152603160f81b602082015283908190838286600361005a83826103c1565b50600461006782826103c1565b5050506001600160a01b03811661009857604051631e4fbdf760e01b81525f60048201526024015b60405180910390fd5b6100a18161015b565b506100ad8260066101ac565b610120526100bc8160076101ac565b61014052815160208084019190912060e052815190820120610100524660a05261014860e05161010051604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201529081019290925260608201524660808201523060a08201525f9060c00160405160208183030381529060405280519060200120905090565b60805250503060c052506104d392505050565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b5f6020835110156101c7576101c0836101de565b90506101d8565b816101d284826103c1565b5060ff90505b92915050565b5f5f829050601f81511115610208578260405163305a27a960e01b815260040161008f919061047b565b8051610213826104b0565b179392505050565b634e487b7160e01b5f52604160045260245ffd5b5f82601f83011261023e575f5ffd5b81516001600160401b038111156102575761025761021b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156102855761028561021b565b60405281815283820160200185101561029c575f5ffd5b8160208501602083015e5f918101602001919091529392505050565b5f5f5f606084860312156102ca575f5ffd5b83516001600160401b038111156102df575f5ffd5b6102eb8682870161022f565b602086015190945090506001600160401b03811115610308575f5ffd5b6103148682870161022f565b604086015190935090506001600160a01b0381168114610332575f5ffd5b809150509250925092565b600181811c9082168061035157607f821691505b60208210810361036f57634e487b7160e01b5f52602260045260245ffd5b50919050565b601f8211156103bc57805f5260205f20601f840160051c8101602085101561039a5750805b601f840160051c820191505b818110156103b9575f81556001016103a6565b50505b505050565b81516001600160401b038111156103da576103da61021b565b6103ee816103e8845461033d565b84610375565b6020601f821160018114610420575f83156104095750848201515b5f19600385901b1c1916600184901b1784556103b9565b5f84815260208120601f198516915b8281101561044f578785015182556020948501946001909201910161042f565b508482101561046c57868401515f19600387901b60f8161c191681555b50505050600190811b01905550565b602081525f82518060208401528060208501604085015e5f604082850101526040601f19601f83011684010191505092915050565b8051602080830151919081101561036f575f1960209190910360031b1b16919050565b60805160a05160c05160e0516101005161012051610140516110d96105245f395f61090d01525f6108e001525f6107a301525f61077b01525f6106d601525f61070001525f61072a01526110d95ff3fe608060405234801561000f575f5ffd5b506004361061011c575f3560e01c8063715018a6116100a957806395d89b411161006e57806395d89b4114610251578063a9059cbb14610259578063d505accf1461026c578063dd62ed3e1461027f578063f2fde38b146102b7575f5ffd5b8063715018a6146101ed57806379cc6790146101f55780637ecebe001461020857806384b0196e1461021b5780638da5cb5b14610236575f5ffd5b8063313ce567116100ef578063313ce567146101865780633644e5151461019557806340c10f191461019d57806342966c68146101b257806370a08231146101c5575f5ffd5b806306fdde0314610120578063095ea7b31461013e57806318160ddd1461016157806323b872dd14610173575b5f5ffd5b6101286102ca565b6040516101359190610e3e565b60405180910390f35b61015161014c366004610e72565b61035a565b6040519015158152602001610135565b6002545b604051908152602001610135565b610151610181366004610e9a565b610373565b60405160128152602001610135565b610165610396565b6101b06101ab366004610e72565b6103a4565b005b6101b06101c0366004610ed4565b6103ba565b6101656101d3366004610eeb565b6001600160a01b03165f9081526020819052604090205490565b6101b06103c7565b6101b0610203366004610e72565b6103da565b610165610216366004610eeb565b6103ef565b61022361040c565b6040516101359796959493929190610f04565b6005546040516001600160a01b039091168152602001610135565b61012861044e565b610151610267366004610e72565b61045d565b6101b061027a366004610f9a565b61046a565b61016561028d366004611007565b6001600160a01b039182165f90815260016020908152604080832093909416825291909152205490565b6101b06102c5366004610eeb565b6105a5565b6060600380546102d990611038565b80601f016020809104026020016040519081016040528092919081815260200182805461030590611038565b80156103505780601f1061032757610100808354040283529160200191610350565b820191905f5260205f20905b81548152906001019060200180831161033357829003601f168201915b5050505050905090565b5f336103678185856105df565b60019150505b92915050565b5f336103808582856105f1565b61038b85858561066d565b506001949350505050565b5f61039f6106ca565b905090565b6103ac6107f3565b6103b68282610820565b5050565b6103c43382610854565b50565b6103cf6107f3565b6103d85f610888565b565b6103e58233836105f1565b6103b68282610854565b6001600160a01b0381165f9081526008602052604081205461036d565b5f6060805f5f5f606061041d6108d9565b610425610906565b604080515f80825260208201909252600f60f81b9b939a50919850469750309650945092509050565b6060600480546102d990611038565b5f3361036781858561066d565b834211156104935760405163313c898160e11b8152600481018590526024015b60405180910390fd5b5f7f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98888886104de8c6001600160a01b03165f90815260086020526040902080546001810190915590565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e0016040516020818303038152906040528051906020012090505f61053882610933565b90505f6105478287878761095f565b9050896001600160a01b0316816001600160a01b03161461058e576040516325c0072360e11b81526001600160a01b0380831660048301528b16602482015260440161048a565b6105998a8a8a6105df565b50505050505050505050565b6105ad6107f3565b6001600160a01b0381166105d657604051631e4fbdf760e01b81525f600482015260240161048a565b6103c481610888565b6105ec838383600161098b565b505050565b6001600160a01b038381165f908152600160209081526040808320938616835292905220545f19811015610667578181101561065957604051637dc7a0d960e11b81526001600160a01b0384166004820152602481018290526044810183905260640161048a565b61066784848484035f61098b565b50505050565b6001600160a01b03831661069657604051634b637e8f60e11b81525f600482015260240161048a565b6001600160a01b0382166106bf5760405163ec442f0560e01b81525f600482015260240161048a565b6105ec838383610a5d565b5f306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801561072257507f000000000000000000000000000000000000000000000000000000000000000046145b1561074c57507f000000000000000000000000000000000000000000000000000000000000000090565b61039f604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201527f0000000000000000000000000000000000000000000000000000000000000000918101919091527f000000000000000000000000000000000000000000000000000000000000000060608201524660808201523060a08201525f9060c00160405160208183030381529060405280519060200120905090565b6005546001600160a01b031633146103d85760405163118cdaa760e01b815233600482015260240161048a565b6001600160a01b0382166108495760405163ec442f0560e01b81525f600482015260240161048a565b6103b65f8383610a5d565b6001600160a01b03821661087d57604051634b637e8f60e11b81525f600482015260240161048a565b6103b6825f83610a5d565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b606061039f7f00000000000000000000000000000000000000000000000000000000000000006006610b83565b606061039f7f00000000000000000000000000000000000000000000000000000000000000006007610b83565b5f61036d61093f6106ca565b8360405161190160f01b8152600281019290925260228201526042902090565b5f5f5f5f61096f88888888610c2c565b92509250925061097f8282610cf4565b50909695505050505050565b6001600160a01b0384166109b45760405163e602df0560e01b81525f600482015260240161048a565b6001600160a01b0383166109dd57604051634a1406b160e11b81525f600482015260240161048a565b6001600160a01b038085165f908152600160209081526040808320938716835292905220829055801561066757826001600160a01b0316846001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610a4f91815260200190565b60405180910390a350505050565b6001600160a01b038316610a87578060025f828254610a7c9190611070565b90915550610af79050565b6001600160a01b0383165f9081526020819052604090205481811015610ad95760405163391434e360e21b81526001600160a01b0385166004820152602481018290526044810183905260640161048a565b6001600160a01b0384165f9081526020819052604090209082900390555b6001600160a01b038216610b1357600280548290039055610b31565b6001600160a01b0382165f9081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610b7691815260200190565b60405180910390a3505050565b606060ff8314610b9d57610b9683610dac565b905061036d565b818054610ba990611038565b80601f0160208091040260200160405190810160405280929190818152602001828054610bd590611038565b8015610c205780601f10610bf757610100808354040283529160200191610c20565b820191905f5260205f20905b815481529060010190602001808311610c0357829003601f168201915b5050505050905061036d565b5f80807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0841115610c6557505f91506003905082610cea565b604080515f808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa158015610cb6573d5f5f3e3d5ffd5b5050604051601f1901519150506001600160a01b038116610ce157505f925060019150829050610cea565b92505f91508190505b9450945094915050565b5f826003811115610d0757610d0761108f565b03610d10575050565b6001826003811115610d2457610d2461108f565b03610d425760405163f645eedf60e01b815260040160405180910390fd5b6002826003811115610d5657610d5661108f565b03610d775760405163fce698f760e01b81526004810182905260240161048a565b6003826003811115610d8b57610d8b61108f565b036103b6576040516335e2f38360e21b81526004810182905260240161048a565b60605f610db883610de9565b6040805160208082528183019092529192505f91906020820181803683375050509182525060208101929092525090565b5f60ff8216601f81111561036d57604051632cd44ac360e21b815260040160405180910390fd5b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b602081525f610e506020830184610e10565b9392505050565b80356001600160a01b0381168114610e6d575f5ffd5b919050565b5f5f60408385031215610e83575f5ffd5b610e8c83610e57565b946020939093013593505050565b5f5f5f60608486031215610eac575f5ffd5b610eb584610e57565b9250610ec360208501610e57565b929592945050506040919091013590565b5f60208284031215610ee4575f5ffd5b5035919050565b5f60208284031215610efb575f5ffd5b610e5082610e57565b60ff60f81b8816815260e060208201525f610f2260e0830189610e10565b8281036040840152610f348189610e10565b606084018890526001600160a01b038716608085015260a0840186905283810360c0850152845180825260208087019350909101905f5b81811015610f89578351835260209384019390920191600101610f6b565b50909b9a5050505050505050505050565b5f5f5f5f5f5f5f60e0888a031215610fb0575f5ffd5b610fb988610e57565b9650610fc760208901610e57565b95506040880135945060608801359350608088013560ff81168114610fea575f5ffd5b9699959850939692959460a0840135945060c09093013592915050565b5f5f60408385031215611018575f5ffd5b61102183610e57565b915061102f60208401610e57565b90509250929050565b600181811c9082168061104c57607f821691505b60208210810361106a57634e487b7160e01b5f52602260045260245ffd5b50919050565b8082018082111561036d57634e487b7160e01b5f52601160045260245ffd5b634e487b7160e01b5f52602160045260245ffdfea26469706673582212209135f34709d9f67986f13c5ce50b7eb35d2945c012d9a2e236d6cf48ec12320b64736f6c634300081e0033"
  },
  erc721_mintable: {
    abi: [
      {
        inputs: [
          {
            internalType: "string",
            name: "name",
            type: "string"
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string"
          },
          {
            internalType: "address",
            name: "initialOwner",
            type: "address"
          }
        ],
        stateMutability: "nonpayable",
        type: "constructor"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          },
          {
            internalType: "address",
            name: "owner",
            type: "address"
          }
        ],
        name: "ERC721IncorrectOwner",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "ERC721InsufficientApproval",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "approver",
            type: "address"
          }
        ],
        name: "ERC721InvalidApprover",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address"
          }
        ],
        name: "ERC721InvalidOperator",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          }
        ],
        name: "ERC721InvalidOwner",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "receiver",
            type: "address"
          }
        ],
        name: "ERC721InvalidReceiver",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address"
          }
        ],
        name: "ERC721InvalidSender",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "ERC721NonexistentToken",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          }
        ],
        name: "OwnableInvalidOwner",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          }
        ],
        name: "OwnableUnauthorizedAccount",
        type: "error"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "approved",
            type: "address"
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "Approval",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address"
          },
          {
            indexed: false,
            internalType: "bool",
            name: "approved",
            type: "bool"
          }
        ],
        name: "ApprovalForAll",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address"
          }
        ],
        name: "OwnershipTransferred",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "Transfer",
        type: "event"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "approve",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          }
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "getApproved",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          },
          {
            internalType: "address",
            name: "operator",
            type: "address"
          }
        ],
        name: "isApprovedForAll",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "name",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "ownerOf",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address"
          }
        ],
        name: "safeMint",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes"
          }
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address"
          },
          {
            internalType: "bool",
            name: "approved",
            type: "bool"
          }
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "bytes4",
            name: "interfaceId",
            type: "bytes4"
          }
        ],
        name: "supportsInterface",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "tokenURI",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address"
          }
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      }
    ],
    bytecode: "0x608060405234801561000f575f5ffd5b506040516113ee3803806113ee83398101604081905261002e9161017f565b8083835f61003c8382610288565b5060016100498282610288565b5050506001600160a01b03811661007957604051631e4fbdf760e01b81525f600482015260240160405180910390fd5b61008281610091565b50506001600755506103429050565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b634e487b7160e01b5f52604160045260245ffd5b5f82601f830112610105575f5ffd5b81516001600160401b0381111561011e5761011e6100e2565b604051601f8201601f19908116603f011681016001600160401b038111828210171561014c5761014c6100e2565b604052818152838201602001851015610163575f5ffd5b8160208501602083015e5f918101602001919091529392505050565b5f5f5f60608486031215610191575f5ffd5b83516001600160401b038111156101a6575f5ffd5b6101b2868287016100f6565b602086015190945090506001600160401b038111156101cf575f5ffd5b6101db868287016100f6565b604086015190935090506001600160a01b03811681146101f9575f5ffd5b809150509250925092565b600181811c9082168061021857607f821691505b60208210810361023657634e487b7160e01b5f52602260045260245ffd5b50919050565b601f82111561028357805f5260205f20601f840160051c810160208510156102615750805b601f840160051c820191505b81811015610280575f815560010161026d565b50505b505050565b81516001600160401b038111156102a1576102a16100e2565b6102b5816102af8454610204565b8461023c565b6020601f8211600181146102e7575f83156102d05750848201515b5f19600385901b1c1916600184901b178455610280565b5f84815260208120601f198516915b8281101561031657878501518255602094850194600190920191016102f6565b508482101561033357868401515f19600387901b60f8161c191681555b50505050600190811b01905550565b61109f8061034f5f395ff3fe608060405234801561000f575f5ffd5b5060043610610106575f3560e01c806370a082311161009e578063a22cb4651161006e578063a22cb46514610215578063b88d4fde14610228578063c87b56dd1461023b578063e985e9c51461024e578063f2fde38b14610261575f5ffd5b806370a08231146101e1578063715018a6146101f45780638da5cb5b146101fc57806395d89b411461020d575f5ffd5b806323b872dd116100d957806323b872dd1461018757806340d097c31461019a57806342842e0e146101bb5780636352211e146101ce575f5ffd5b806301ffc9a71461010a57806306fdde0314610132578063081812fc14610147578063095ea7b314610172575b5f5ffd5b61011d610118366004610d2d565b610274565b60405190151581526020015b60405180910390f35b61013a6102c5565b6040516101299190610d76565b61015a610155366004610d88565b610354565b6040516001600160a01b039091168152602001610129565b610185610180366004610db5565b61037b565b005b610185610195366004610ddd565b61038a565b6101ad6101a8366004610e17565b610418565b604051908152602001610129565b6101856101c9366004610ddd565b61044b565b61015a6101dc366004610d88565b61046a565b6101ad6101ef366004610e17565b610474565b6101856104b9565b6006546001600160a01b031661015a565b61013a6104cc565b610185610223366004610e30565b6104db565b610185610236366004610e7d565b6104e6565b61013a610249366004610d88565b6104fe565b61011d61025c366004610f5a565b61056f565b61018561026f366004610e17565b61059c565b5f6001600160e01b031982166380ac58cd60e01b14806102a457506001600160e01b03198216635b5e139f60e01b145b806102bf57506301ffc9a760e01b6001600160e01b03198316145b92915050565b60605f80546102d390610f8b565b80601f01602080910402602001604051908101604052809291908181526020018280546102ff90610f8b565b801561034a5780601f106103215761010080835404028352916020019161034a565b820191905f5260205f20905b81548152906001019060200180831161032d57829003601f168201915b5050505050905090565b5f61035e826105d9565b505f828152600460205260409020546001600160a01b03166102bf565b610386828233610611565b5050565b6001600160a01b0382166103b857604051633250574960e11b81525f60048201526024015b60405180910390fd5b5f6103c483833361061e565b9050836001600160a01b0316816001600160a01b031614610412576040516364283d7b60e01b81526001600160a01b03808616600483015260248201849052821660448201526064016103af565b50505050565b5f610421610710565b60075461042e838261073d565b60078054905f61043d83610fc3565b90915550909150505b919050565b61046583838360405180602001604052805f8152506104e6565b505050565b5f6102bf826105d9565b5f6001600160a01b03821661049e576040516322718ad960e21b81525f60048201526024016103af565b506001600160a01b03165f9081526003602052604090205490565b6104c1610710565b6104ca5f610756565b565b6060600180546102d390610f8b565b6103863383836107a7565b6104f184848461038a565b6104123385858585610845565b6060610509826105d9565b505f61051f60408051602081019091525f815290565b90505f81511161053d5760405180602001604052805f815250610568565b806105478461096d565b604051602001610558929190610ffe565b6040516020818303038152906040525b9392505050565b6001600160a01b039182165f90815260056020908152604080832093909416825291909152205460ff1690565b6105a4610710565b6001600160a01b0381166105cd57604051631e4fbdf760e01b81525f60048201526024016103af565b6105d681610756565b50565b5f818152600260205260408120546001600160a01b0316806102bf57604051637e27328960e01b8152600481018490526024016103af565b61046583838360016109fd565b5f828152600260205260408120546001600160a01b039081169083161561064a5761064a818486610b01565b6001600160a01b03811615610684576106655f855f5f6109fd565b6001600160a01b0381165f90815260036020526040902080545f190190555b6001600160a01b038516156106b2576001600160a01b0385165f908152600360205260409020805460010190555b5f8481526002602052604080822080546001600160a01b0319166001600160a01b0389811691821790925591518793918516917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4949350505050565b6006546001600160a01b031633146104ca5760405163118cdaa760e01b81523360048201526024016103af565b610386828260405180602001604052805f815250610b65565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b6001600160a01b0382166107d957604051630b61174360e31b81526001600160a01b03831660048201526024016103af565b6001600160a01b038381165f81815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6001600160a01b0383163b1561096657604051630a85bd0160e11b81526001600160a01b0384169063150b7a0290610887908890889087908790600401611012565b6020604051808303815f875af19250505080156108c1575060408051601f3d908101601f191682019092526108be9181019061104e565b60015b610928573d8080156108ee576040519150601f19603f3d011682016040523d82523d5f602084013e6108f3565b606091505b5080515f0361092057604051633250574960e11b81526001600160a01b03851660048201526024016103af565b805160208201fd5b6001600160e01b03198116630a85bd0160e11b1461096457604051633250574960e11b81526001600160a01b03851660048201526024016103af565b505b5050505050565b60605f61097983610b7c565b60010190505f8167ffffffffffffffff81111561099857610998610e69565b6040519080825280601f01601f1916602001820160405280156109c2576020820181803683370190505b5090508181016020015b5f19016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a85049450846109cc57509392505050565b8080610a1157506001600160a01b03821615155b15610ad2575f610a20846105d9565b90506001600160a01b03831615801590610a4c5750826001600160a01b0316816001600160a01b031614155b8015610a5f5750610a5d818461056f565b155b15610a885760405163a9fbf51f60e01b81526001600160a01b03841660048201526024016103af565b8115610ad05783856001600160a01b0316826001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45b505b50505f90815260046020526040902080546001600160a01b0319166001600160a01b0392909216919091179055565b610b0c838383610c53565b610465576001600160a01b038316610b3a57604051637e27328960e01b8152600481018290526024016103af565b60405163177e802f60e01b81526001600160a01b0383166004820152602481018290526044016103af565b610b6f8383610cb7565b610465335f858585610845565b5f8072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b8310610bba5772184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b830492506040015b6d04ee2d6d415b85acef81000000008310610be6576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc100008310610c0457662386f26fc10000830492506010015b6305f5e1008310610c1c576305f5e100830492506008015b6127108310610c3057612710830492506004015b60648310610c42576064830492506002015b600a83106102bf5760010192915050565b5f6001600160a01b03831615801590610caf5750826001600160a01b0316846001600160a01b03161480610c8c5750610c8c848461056f565b80610caf57505f828152600460205260409020546001600160a01b038481169116145b949350505050565b6001600160a01b038216610ce057604051633250574960e11b81525f60048201526024016103af565b5f610cec83835f61061e565b90506001600160a01b03811615610465576040516339e3563760e11b81525f60048201526024016103af565b6001600160e01b0319811681146105d6575f5ffd5b5f60208284031215610d3d575f5ffd5b813561056881610d18565b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b602081525f6105686020830184610d48565b5f60208284031215610d98575f5ffd5b5035919050565b80356001600160a01b0381168114610446575f5ffd5b5f5f60408385031215610dc6575f5ffd5b610dcf83610d9f565b946020939093013593505050565b5f5f5f60608486031215610def575f5ffd5b610df884610d9f565b9250610e0660208501610d9f565b929592945050506040919091013590565b5f60208284031215610e27575f5ffd5b61056882610d9f565b5f5f60408385031215610e41575f5ffd5b610e4a83610d9f565b915060208301358015158114610e5e575f5ffd5b809150509250929050565b634e487b7160e01b5f52604160045260245ffd5b5f5f5f5f60808587031215610e90575f5ffd5b610e9985610d9f565b9350610ea760208601610d9f565b925060408501359150606085013567ffffffffffffffff811115610ec9575f5ffd5b8501601f81018713610ed9575f5ffd5b803567ffffffffffffffff811115610ef357610ef3610e69565b604051601f8201601f19908116603f0116810167ffffffffffffffff81118282101715610f2257610f22610e69565b604052818152828201602001891015610f39575f5ffd5b816020840160208301375f6020838301015280935050505092959194509250565b5f5f60408385031215610f6b575f5ffd5b610f7483610d9f565b9150610f8260208401610d9f565b90509250929050565b600181811c90821680610f9f57607f821691505b602082108103610fbd57634e487b7160e01b5f52602260045260245ffd5b50919050565b5f60018201610fe057634e487b7160e01b5f52601160045260245ffd5b5060010190565b5f81518060208401855e5f93019283525090919050565b5f610caf61100c8386610fe7565b84610fe7565b6001600160a01b03858116825284166020820152604081018390526080606082018190525f9061104490830184610d48565b9695505050505050565b5f6020828403121561105e575f5ffd5b815161056881610d1856fea2646970667358221220247eb116d405b297b46b9c2a32f8863fc280320ae4149b5ac7127b5c26ea630064736f6c634300081e0033"
  },
  erc721_burnable_mintable: {
    abi: [
      {
        inputs: [
          {
            internalType: "string",
            name: "name",
            type: "string"
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string"
          },
          {
            internalType: "address",
            name: "initialOwner",
            type: "address"
          }
        ],
        stateMutability: "nonpayable",
        type: "constructor"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          },
          {
            internalType: "address",
            name: "owner",
            type: "address"
          }
        ],
        name: "ERC721IncorrectOwner",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "ERC721InsufficientApproval",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "approver",
            type: "address"
          }
        ],
        name: "ERC721InvalidApprover",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address"
          }
        ],
        name: "ERC721InvalidOperator",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          }
        ],
        name: "ERC721InvalidOwner",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "receiver",
            type: "address"
          }
        ],
        name: "ERC721InvalidReceiver",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address"
          }
        ],
        name: "ERC721InvalidSender",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "ERC721NonexistentToken",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          }
        ],
        name: "OwnableInvalidOwner",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          }
        ],
        name: "OwnableUnauthorizedAccount",
        type: "error"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "approved",
            type: "address"
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "Approval",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address"
          },
          {
            indexed: false,
            internalType: "bool",
            name: "approved",
            type: "bool"
          }
        ],
        name: "ApprovalForAll",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address"
          }
        ],
        name: "OwnershipTransferred",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "Transfer",
        type: "event"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "approve",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          }
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "getApproved",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          },
          {
            internalType: "address",
            name: "operator",
            type: "address"
          }
        ],
        name: "isApprovedForAll",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "name",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "ownerOf",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address"
          }
        ],
        name: "safeMint",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes"
          }
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address"
          },
          {
            internalType: "bool",
            name: "approved",
            type: "bool"
          }
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "bytes4",
            name: "interfaceId",
            type: "bytes4"
          }
        ],
        name: "supportsInterface",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "tokenURI",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address"
          }
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      }
    ],
    bytecode: "0x608060405234801561000f575f5ffd5b5060405161141738038061141783398101604081905261002e9161017f565b8083835f61003c8382610288565b5060016100498282610288565b5050506001600160a01b03811661007957604051631e4fbdf760e01b81525f600482015260240160405180910390fd5b61008281610091565b50506001600755506103429050565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b634e487b7160e01b5f52604160045260245ffd5b5f82601f830112610105575f5ffd5b81516001600160401b0381111561011e5761011e6100e2565b604051601f8201601f19908116603f011681016001600160401b038111828210171561014c5761014c6100e2565b604052818152838201602001851015610163575f5ffd5b8160208501602083015e5f918101602001919091529392505050565b5f5f5f60608486031215610191575f5ffd5b83516001600160401b038111156101a6575f5ffd5b6101b2868287016100f6565b602086015190945090506001600160401b038111156101cf575f5ffd5b6101db868287016100f6565b604086015190935090506001600160a01b03811681146101f9575f5ffd5b809150509250925092565b600181811c9082168061021857607f821691505b60208210810361023657634e487b7160e01b5f52602260045260245ffd5b50919050565b601f82111561028357805f5260205f20601f840160051c810160208510156102615750805b601f840160051c820191505b81811015610280575f815560010161026d565b50505b505050565b81516001600160401b038111156102a1576102a16100e2565b6102b5816102af8454610204565b8461023c565b6020601f8211600181146102e7575f83156102d05750848201515b5f19600385901b1c1916600184901b178455610280565b5f84815260208120601f198516915b8281101561031657878501518255602094850194600190920191016102f6565b508482101561033357868401515f19600387901b60f8161c191681555b50505050600190811b01905550565b6110c88061034f5f395ff3fe608060405234801561000f575f5ffd5b5060043610610111575f3560e01c806370a082311161009e578063a22cb4651161006e578063a22cb46514610233578063b88d4fde14610246578063c87b56dd14610259578063e985e9c51461026c578063f2fde38b1461027f575f5ffd5b806370a08231146101ff578063715018a6146102125780638da5cb5b1461021a57806395d89b411461022b575f5ffd5b806323b872dd116100e457806323b872dd1461019257806340d097c3146101a557806342842e0e146101c657806342966c68146101d95780636352211e146101ec575f5ffd5b806301ffc9a71461011557806306fdde031461013d578063081812fc14610152578063095ea7b31461017d575b5f5ffd5b610128610123366004610d56565b610292565b60405190151581526020015b60405180910390f35b6101456102e3565b6040516101349190610d9f565b610165610160366004610db1565b610372565b6040516001600160a01b039091168152602001610134565b61019061018b366004610dde565b610399565b005b6101906101a0366004610e06565b6103a8565b6101b86101b3366004610e40565b610436565b604051908152602001610134565b6101906101d4366004610e06565b610469565b6101906101e7366004610db1565b610488565b6101656101fa366004610db1565b610493565b6101b861020d366004610e40565b61049d565b6101906104e2565b6006546001600160a01b0316610165565b6101456104f5565b610190610241366004610e59565b610504565b610190610254366004610ea6565b61050f565b610145610267366004610db1565b610527565b61012861027a366004610f83565b610598565b61019061028d366004610e40565b6105c5565b5f6001600160e01b031982166380ac58cd60e01b14806102c257506001600160e01b03198216635b5e139f60e01b145b806102dd57506301ffc9a760e01b6001600160e01b03198316145b92915050565b60605f80546102f190610fb4565b80601f016020809104026020016040519081016040528092919081815260200182805461031d90610fb4565b80156103685780601f1061033f57610100808354040283529160200191610368565b820191905f5260205f20905b81548152906001019060200180831161034b57829003601f168201915b5050505050905090565b5f61037c82610602565b505f828152600460205260409020546001600160a01b03166102dd565b6103a482823361063a565b5050565b6001600160a01b0382166103d657604051633250574960e11b81525f60048201526024015b60405180910390fd5b5f6103e2838333610647565b9050836001600160a01b0316816001600160a01b031614610430576040516364283d7b60e01b81526001600160a01b03808616600483015260248201849052821660448201526064016103cd565b50505050565b5f61043f610739565b60075461044c8382610766565b60078054905f61045b83610fec565b90915550909150505b919050565b61048383838360405180602001604052805f81525061050f565b505050565b6103a45f8233610647565b5f6102dd82610602565b5f6001600160a01b0382166104c7576040516322718ad960e21b81525f60048201526024016103cd565b506001600160a01b03165f9081526003602052604090205490565b6104ea610739565b6104f35f61077f565b565b6060600180546102f190610fb4565b6103a43383836107d0565b61051a8484846103a8565b610430338585858561086e565b606061053282610602565b505f61054860408051602081019091525f815290565b90505f8151116105665760405180602001604052805f815250610591565b8061057084610996565b604051602001610581929190611027565b6040516020818303038152906040525b9392505050565b6001600160a01b039182165f90815260056020908152604080832093909416825291909152205460ff1690565b6105cd610739565b6001600160a01b0381166105f657604051631e4fbdf760e01b81525f60048201526024016103cd565b6105ff8161077f565b50565b5f818152600260205260408120546001600160a01b0316806102dd57604051637e27328960e01b8152600481018490526024016103cd565b6104838383836001610a26565b5f828152600260205260408120546001600160a01b039081169083161561067357610673818486610b2a565b6001600160a01b038116156106ad5761068e5f855f5f610a26565b6001600160a01b0381165f90815260036020526040902080545f190190555b6001600160a01b038516156106db576001600160a01b0385165f908152600360205260409020805460010190555b5f8481526002602052604080822080546001600160a01b0319166001600160a01b0389811691821790925591518793918516917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4949350505050565b6006546001600160a01b031633146104f35760405163118cdaa760e01b81523360048201526024016103cd565b6103a4828260405180602001604052805f815250610b8e565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b6001600160a01b03821661080257604051630b61174360e31b81526001600160a01b03831660048201526024016103cd565b6001600160a01b038381165f81815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6001600160a01b0383163b1561098f57604051630a85bd0160e11b81526001600160a01b0384169063150b7a02906108b090889088908790879060040161103b565b6020604051808303815f875af19250505080156108ea575060408051601f3d908101601f191682019092526108e791810190611077565b60015b610951573d808015610917576040519150601f19603f3d011682016040523d82523d5f602084013e61091c565b606091505b5080515f0361094957604051633250574960e11b81526001600160a01b03851660048201526024016103cd565b805160208201fd5b6001600160e01b03198116630a85bd0160e11b1461098d57604051633250574960e11b81526001600160a01b03851660048201526024016103cd565b505b5050505050565b60605f6109a283610ba5565b60010190505f8167ffffffffffffffff8111156109c1576109c1610e92565b6040519080825280601f01601f1916602001820160405280156109eb576020820181803683370190505b5090508181016020015b5f19016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a85049450846109f557509392505050565b8080610a3a57506001600160a01b03821615155b15610afb575f610a4984610602565b90506001600160a01b03831615801590610a755750826001600160a01b0316816001600160a01b031614155b8015610a885750610a868184610598565b155b15610ab15760405163a9fbf51f60e01b81526001600160a01b03841660048201526024016103cd565b8115610af95783856001600160a01b0316826001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45b505b50505f90815260046020526040902080546001600160a01b0319166001600160a01b0392909216919091179055565b610b35838383610c7c565b610483576001600160a01b038316610b6357604051637e27328960e01b8152600481018290526024016103cd565b60405163177e802f60e01b81526001600160a01b0383166004820152602481018290526044016103cd565b610b988383610ce0565b610483335f85858561086e565b5f8072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b8310610be35772184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b830492506040015b6d04ee2d6d415b85acef81000000008310610c0f576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc100008310610c2d57662386f26fc10000830492506010015b6305f5e1008310610c45576305f5e100830492506008015b6127108310610c5957612710830492506004015b60648310610c6b576064830492506002015b600a83106102dd5760010192915050565b5f6001600160a01b03831615801590610cd85750826001600160a01b0316846001600160a01b03161480610cb55750610cb58484610598565b80610cd857505f828152600460205260409020546001600160a01b038481169116145b949350505050565b6001600160a01b038216610d0957604051633250574960e11b81525f60048201526024016103cd565b5f610d1583835f610647565b90506001600160a01b03811615610483576040516339e3563760e11b81525f60048201526024016103cd565b6001600160e01b0319811681146105ff575f5ffd5b5f60208284031215610d66575f5ffd5b813561059181610d41565b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b602081525f6105916020830184610d71565b5f60208284031215610dc1575f5ffd5b5035919050565b80356001600160a01b0381168114610464575f5ffd5b5f5f60408385031215610def575f5ffd5b610df883610dc8565b946020939093013593505050565b5f5f5f60608486031215610e18575f5ffd5b610e2184610dc8565b9250610e2f60208501610dc8565b929592945050506040919091013590565b5f60208284031215610e50575f5ffd5b61059182610dc8565b5f5f60408385031215610e6a575f5ffd5b610e7383610dc8565b915060208301358015158114610e87575f5ffd5b809150509250929050565b634e487b7160e01b5f52604160045260245ffd5b5f5f5f5f60808587031215610eb9575f5ffd5b610ec285610dc8565b9350610ed060208601610dc8565b925060408501359150606085013567ffffffffffffffff811115610ef2575f5ffd5b8501601f81018713610f02575f5ffd5b803567ffffffffffffffff811115610f1c57610f1c610e92565b604051601f8201601f19908116603f0116810167ffffffffffffffff81118282101715610f4b57610f4b610e92565b604052818152828201602001891015610f62575f5ffd5b816020840160208301375f6020838301015280935050505092959194509250565b5f5f60408385031215610f94575f5ffd5b610f9d83610dc8565b9150610fab60208401610dc8565b90509250929050565b600181811c90821680610fc857607f821691505b602082108103610fe657634e487b7160e01b5f52602260045260245ffd5b50919050565b5f6001820161100957634e487b7160e01b5f52601160045260245ffd5b5060010190565b5f81518060208401855e5f93019283525090919050565b5f610cd86110358386611010565b84611010565b6001600160a01b03858116825284166020820152604081018390526080606082018190525f9061106d90830184610d71565b9695505050505050565b5f60208284031215611087575f5ffd5b815161059181610d4156fea2646970667358221220ace7d1bfbbe844fc562aefc4b932023d0491196e20ba224a4b150216eba44d7e64736f6c634300081e0033"
  },
  erc1155_mintable: {
    abi: [
      {
        inputs: [
          {
            internalType: "string",
            name: "uri",
            type: "string"
          },
          {
            internalType: "address",
            name: "initialOwner",
            type: "address"
          }
        ],
        stateMutability: "nonpayable",
        type: "constructor"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "balance",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "needed",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "ERC1155InsufficientBalance",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "approver",
            type: "address"
          }
        ],
        name: "ERC1155InvalidApprover",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "idsLength",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "valuesLength",
            type: "uint256"
          }
        ],
        name: "ERC1155InvalidArrayLength",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address"
          }
        ],
        name: "ERC1155InvalidOperator",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "receiver",
            type: "address"
          }
        ],
        name: "ERC1155InvalidReceiver",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address"
          }
        ],
        name: "ERC1155InvalidSender",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address"
          },
          {
            internalType: "address",
            name: "owner",
            type: "address"
          }
        ],
        name: "ERC1155MissingApprovalForAll",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          }
        ],
        name: "OwnableInvalidOwner",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          }
        ],
        name: "OwnableUnauthorizedAccount",
        type: "error"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "account",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address"
          },
          {
            indexed: false,
            internalType: "bool",
            name: "approved",
            type: "bool"
          }
        ],
        name: "ApprovalForAll",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address"
          }
        ],
        name: "OwnershipTransferred",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            indexed: false,
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]"
          },
          {
            indexed: false,
            internalType: "uint256[]",
            name: "values",
            type: "uint256[]"
          }
        ],
        name: "TransferBatch",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "id",
            type: "uint256"
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "TransferSingle",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "string",
            name: "value",
            type: "string"
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "id",
            type: "uint256"
          }
        ],
        name: "URI",
        type: "event"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256"
          }
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address[]",
            name: "accounts",
            type: "address[]"
          },
          {
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]"
          }
        ],
        name: "balanceOfBatch",
        outputs: [
          {
            internalType: "uint256[]",
            name: "",
            type: "uint256[]"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          },
          {
            internalType: "address",
            name: "operator",
            type: "address"
          }
        ],
        name: "isApprovedForAll",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes"
          }
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]"
          },
          {
            internalType: "uint256[]",
            name: "amounts",
            type: "uint256[]"
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes"
          }
        ],
        name: "mintBatch",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]"
          },
          {
            internalType: "uint256[]",
            name: "values",
            type: "uint256[]"
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes"
          }
        ],
        name: "safeBatchTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes"
          }
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address"
          },
          {
            internalType: "bool",
            name: "approved",
            type: "bool"
          }
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "newuri",
            type: "string"
          }
        ],
        name: "setURI",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "bytes4",
            name: "interfaceId",
            type: "bytes4"
          }
        ],
        name: "supportsInterface",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address"
          }
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        name: "uri",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string"
          }
        ],
        stateMutability: "view",
        type: "function"
      }
    ],
    bytecode: "0x608060405234801561000f575f5ffd5b5060405161181338038061181383398101604081905261002e91610108565b808261003981610078565b506001600160a01b03811661006757604051631e4fbdf760e01b81525f600482015260240160405180910390fd5b61007081610088565b505050610307565b6002610084828261024d565b5050565b600380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b634e487b7160e01b5f52604160045260245ffd5b80516001600160a01b0381168114610103575f5ffd5b919050565b5f5f60408385031215610119575f5ffd5b82516001600160401b0381111561012e575f5ffd5b8301601f8101851361013e575f5ffd5b80516001600160401b03811115610157576101576100d9565b604051601f8201601f19908116603f011681016001600160401b0381118282101715610185576101856100d9565b60405281815282820160200187101561019c575f5ffd5b8160208401602083015e5f602083830101528094505050506101c0602084016100ed565b90509250929050565b600181811c908216806101dd57607f821691505b6020821081036101fb57634e487b7160e01b5f52602260045260245ffd5b50919050565b601f82111561024857805f5260205f20601f840160051c810160208510156102265750805b601f840160051c820191505b81811015610245575f8155600101610232565b50505b505050565b81516001600160401b03811115610266576102666100d9565b61027a8161027484546101c9565b84610201565b6020601f8211600181146102ac575f83156102955750848201515b5f19600385901b1c1916600184901b178455610245565b5f84815260208120601f198516915b828110156102db57878501518255602094850194600190920191016102bb565b50848210156102f857868401515f19600387901b60f8161c191681555b50505050600190811b01905550565b6114ff806103145f395ff3fe608060405234801561000f575f5ffd5b50600436106100e4575f3560e01c8063715018a611610088578063a22cb46511610063578063a22cb465146101e2578063e985e9c5146101f5578063f242432a14610208578063f2fde38b1461021b575f5ffd5b8063715018a6146101ac578063731133e9146101b45780638da5cb5b146101c7575f5ffd5b80630e89341c116100c35780630e89341c146101465780631f7fdffa146101665780632eb2c2d6146101795780634e1273f41461018c575f5ffd5b8062fdd58e146100e857806301ffc9a71461010e57806302fe530514610131575b5f5ffd5b6100fb6100f6366004610cbb565b61022e565b6040519081526020015b60405180910390f35b61012161011c366004610cf8565b610255565b6040519015158152602001610105565b61014461013f366004610db6565b6102a4565b005b610159610154366004610e02565b6102b8565b6040516101059190610e47565b610144610174366004610f03565b61034a565b610144610187366004610f9f565b610364565b61019f61019a36600461104b565b6103d0565b6040516101059190611146565b61014461049a565b6101446101c2366004611158565b6104ad565b6003546040516001600160a01b039091168152602001610105565b6101446101f036600461119c565b6104c1565b6101216102033660046111d5565b6104d0565b610144610216366004611206565b6104fd565b610144610229366004611259565b61055c565b5f818152602081815260408083206001600160a01b03861684529091529020545b92915050565b5f6001600160e01b03198216636cdb3d1360e11b148061028557506001600160e01b031982166303a24d0760e21b145b8061024f57506301ffc9a760e01b6001600160e01b031983161461024f565b6102ac610596565b6102b5816105c3565b50565b6060600280546102c790611272565b80601f01602080910402602001604051908101604052809291908181526020018280546102f390611272565b801561033e5780601f106103155761010080835404028352916020019161033e565b820191905f5260205f20905b81548152906001019060200180831161032157829003601f168201915b50505050509050919050565b610352610596565b61035e848484846105cf565b50505050565b336001600160a01b0386168114801590610385575061038386826104d0565b155b156103bb5760405163711bec9160e11b81526001600160a01b038083166004830152871660248201526044015b60405180910390fd5b6103c88686868686610605565b505050505050565b606081518351146104015781518351604051635b05999160e01b8152600481019290925260248201526044016103b2565b5f83516001600160401b0381111561041b5761041b610d1a565b604051908082528060200260200182016040528015610444578160200160208202803683370190505b5090505f5b84518110156104925760208082028601015161046d9060208084028701015161022e565b82828151811061047f5761047f6112aa565b6020908102919091010152600101610449565b509392505050565b6104a2610596565b6104ab5f61066a565b565b6104b5610596565b61035e848484846106bb565b6104cc338383610716565b5050565b6001600160a01b039182165f90815260016020908152604080832093909416825291909152205460ff1690565b336001600160a01b038616811480159061051e575061051c86826104d0565b155b1561054f5760405163711bec9160e11b81526001600160a01b038083166004830152871660248201526044016103b2565b6103c886868686866107aa565b610564610596565b6001600160a01b03811661058d57604051631e4fbdf760e01b81525f60048201526024016103b2565b6102b58161066a565b6003546001600160a01b031633146104ab5760405163118cdaa760e01b81523360048201526024016103b2565b60026104cc8282611307565b6001600160a01b0384166105f857604051632bfa23e760e11b81525f60048201526024016103b2565b61035e5f85858585610836565b6001600160a01b03841661062e57604051632bfa23e760e11b81525f60048201526024016103b2565b6001600160a01b03851661065657604051626a0d4560e21b81525f60048201526024016103b2565b6106638585858585610836565b5050505050565b600380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b6001600160a01b0384166106e457604051632bfa23e760e11b81525f60048201526024016103b2565b604080516001808252602082018690528183019081526060820185905260808201909252906103c85f87848487610836565b6001600160a01b03821661073e5760405162ced3e160e81b81525f60048201526024016103b2565b6001600160a01b038381165f81815260016020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6001600160a01b0384166107d357604051632bfa23e760e11b81525f60048201526024016103b2565b6001600160a01b0385166107fb57604051626a0d4560e21b81525f60048201526024016103b2565b6040805160018082526020820186905281830190815260608201859052608082019092529061082d8787848487610836565b50505050505050565b61084285858585610889565b6001600160a01b03841615610663578251339060010361087b5760208481015190840151610874838989858589610a98565b50506103c8565b6103c8818787878787610bb9565b80518251146108b85781518151604051635b05999160e01b8152600481019290925260248201526044016103b2565b335f5b83518110156109ba576020818102858101820151908501909101516001600160a01b0388161561096c575f828152602081815260408083206001600160a01b038c16845290915290205481811015610946576040516303dee4c560e01b81526001600160a01b038a1660048201526024810182905260448101839052606481018490526084016103b2565b5f838152602081815260408083206001600160a01b038d16845290915290209082900390555b6001600160a01b038716156109b0575f828152602081815260408083206001600160a01b038b168452909152812080548392906109aa9084906113c1565b90915550505b50506001016108bb565b508251600103610a3a5760208301515f906020840151909150856001600160a01b0316876001600160a01b0316846001600160a01b03167fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f628585604051610a2b929190918252602082015260400190565b60405180910390a45050610663565b836001600160a01b0316856001600160a01b0316826001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8686604051610a899291906113e0565b60405180910390a45050505050565b6001600160a01b0384163b156103c85760405163f23a6e6160e01b81526001600160a01b0385169063f23a6e6190610adc908990899088908890889060040161140d565b6020604051808303815f875af1925050508015610b16575060408051601f3d908101601f19168201909252610b1391810190611451565b60015b610b7d573d808015610b43576040519150601f19603f3d011682016040523d82523d5f602084013e610b48565b606091505b5080515f03610b7557604051632bfa23e760e11b81526001600160a01b03861660048201526024016103b2565b805160208201fd5b6001600160e01b0319811663f23a6e6160e01b1461082d57604051632bfa23e760e11b81526001600160a01b03861660048201526024016103b2565b6001600160a01b0384163b156103c85760405163bc197c8160e01b81526001600160a01b0385169063bc197c8190610bfd908990899088908890889060040161146c565b6020604051808303815f875af1925050508015610c37575060408051601f3d908101601f19168201909252610c3491810190611451565b60015b610c64573d808015610b43576040519150601f19603f3d011682016040523d82523d5f602084013e610b48565b6001600160e01b0319811663bc197c8160e01b1461082d57604051632bfa23e760e11b81526001600160a01b03861660048201526024016103b2565b80356001600160a01b0381168114610cb6575f5ffd5b919050565b5f5f60408385031215610ccc575f5ffd5b610cd583610ca0565b946020939093013593505050565b6001600160e01b0319811681146102b5575f5ffd5b5f60208284031215610d08575f5ffd5b8135610d1381610ce3565b9392505050565b634e487b7160e01b5f52604160045260245ffd5b604051601f8201601f191681016001600160401b0381118282101715610d5657610d56610d1a565b604052919050565b5f5f6001600160401b03841115610d7757610d77610d1a565b50601f8301601f1916602001610d8c81610d2e565b915050828152838383011115610da0575f5ffd5b828260208301375f602084830101529392505050565b5f60208284031215610dc6575f5ffd5b81356001600160401b03811115610ddb575f5ffd5b8201601f81018413610deb575f5ffd5b610dfa84823560208401610d5e565b949350505050565b5f60208284031215610e12575f5ffd5b5035919050565b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b602081525f610d136020830184610e19565b5f6001600160401b03821115610e7157610e71610d1a565b5060051b60200190565b5f82601f830112610e8a575f5ffd5b8135610e9d610e9882610e59565b610d2e565b8082825260208201915060208360051b860101925085831115610ebe575f5ffd5b602085015b83811015610edb578035835260209283019201610ec3565b5095945050505050565b5f82601f830112610ef4575f5ffd5b610d1383833560208501610d5e565b5f5f5f5f60808587031215610f16575f5ffd5b610f1f85610ca0565b935060208501356001600160401b03811115610f39575f5ffd5b610f4587828801610e7b565b93505060408501356001600160401b03811115610f60575f5ffd5b610f6c87828801610e7b565b92505060608501356001600160401b03811115610f87575f5ffd5b610f9387828801610ee5565b91505092959194509250565b5f5f5f5f5f60a08688031215610fb3575f5ffd5b610fbc86610ca0565b9450610fca60208701610ca0565b935060408601356001600160401b03811115610fe4575f5ffd5b610ff088828901610e7b565b93505060608601356001600160401b0381111561100b575f5ffd5b61101788828901610e7b565b92505060808601356001600160401b03811115611032575f5ffd5b61103e88828901610ee5565b9150509295509295909350565b5f5f6040838503121561105c575f5ffd5b82356001600160401b03811115611071575f5ffd5b8301601f81018513611081575f5ffd5b803561108f610e9882610e59565b8082825260208201915060208360051b8501019250878311156110b0575f5ffd5b6020840193505b828410156110d9576110c884610ca0565b8252602093840193909101906110b7565b945050505060208301356001600160401b038111156110f6575f5ffd5b61110285828601610e7b565b9150509250929050565b5f8151808452602084019350602083015f5b8281101561113c57815186526020958601959091019060010161111e565b5093949350505050565b602081525f610d13602083018461110c565b5f5f5f5f6080858703121561116b575f5ffd5b61117485610ca0565b9350602085013592506040850135915060608501356001600160401b03811115610f87575f5ffd5b5f5f604083850312156111ad575f5ffd5b6111b683610ca0565b9150602083013580151581146111ca575f5ffd5b809150509250929050565b5f5f604083850312156111e6575f5ffd5b6111ef83610ca0565b91506111fd60208401610ca0565b90509250929050565b5f5f5f5f5f60a0868803121561121a575f5ffd5b61122386610ca0565b945061123160208701610ca0565b9350604086013592506060860135915060808601356001600160401b03811115611032575f5ffd5b5f60208284031215611269575f5ffd5b610d1382610ca0565b600181811c9082168061128657607f821691505b6020821081036112a457634e487b7160e01b5f52602260045260245ffd5b50919050565b634e487b7160e01b5f52603260045260245ffd5b601f82111561130257805f5260205f20601f840160051c810160208510156112e35750805b601f840160051c820191505b81811015610663575f81556001016112ef565b505050565b81516001600160401b0381111561132057611320610d1a565b6113348161132e8454611272565b846112be565b6020601f821160018114611366575f831561134f5750848201515b5f19600385901b1c1916600184901b178455610663565b5f84815260208120601f198516915b828110156113955787850151825560209485019460019092019101611375565b50848210156113b257868401515f19600387901b60f8161c191681555b50505050600190811b01905550565b8082018082111561024f57634e487b7160e01b5f52601160045260245ffd5b604081525f6113f2604083018561110c565b8281036020840152611404818561110c565b95945050505050565b6001600160a01b03868116825285166020820152604081018490526060810183905260a0608082018190525f9061144690830184610e19565b979650505050505050565b5f60208284031215611461575f5ffd5b8151610d1381610ce3565b6001600160a01b0386811682528516602082015260a0604082018190525f906114979083018661110c565b82810360608401526114a9818661110c565b905082810360808401526114bd8185610e19565b9897505050505050505056fea264697066735822122031acd924ad0600637eb5b41e0397bfdc949b1be39fee0d1b4da5f6cc9c53e0a064736f6c634300081e0033"
  },
  erc1155_burnable_mintable: {
    abi: [
      {
        inputs: [
          {
            internalType: "string",
            name: "uri",
            type: "string"
          },
          {
            internalType: "address",
            name: "initialOwner",
            type: "address"
          }
        ],
        stateMutability: "nonpayable",
        type: "constructor"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "balance",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "needed",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "ERC1155InsufficientBalance",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "approver",
            type: "address"
          }
        ],
        name: "ERC1155InvalidApprover",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "idsLength",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "valuesLength",
            type: "uint256"
          }
        ],
        name: "ERC1155InvalidArrayLength",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address"
          }
        ],
        name: "ERC1155InvalidOperator",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "receiver",
            type: "address"
          }
        ],
        name: "ERC1155InvalidReceiver",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address"
          }
        ],
        name: "ERC1155InvalidSender",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address"
          },
          {
            internalType: "address",
            name: "owner",
            type: "address"
          }
        ],
        name: "ERC1155MissingApprovalForAll",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          }
        ],
        name: "OwnableInvalidOwner",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          }
        ],
        name: "OwnableUnauthorizedAccount",
        type: "error"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "account",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address"
          },
          {
            indexed: false,
            internalType: "bool",
            name: "approved",
            type: "bool"
          }
        ],
        name: "ApprovalForAll",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address"
          }
        ],
        name: "OwnershipTransferred",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            indexed: false,
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]"
          },
          {
            indexed: false,
            internalType: "uint256[]",
            name: "values",
            type: "uint256[]"
          }
        ],
        name: "TransferBatch",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "id",
            type: "uint256"
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "TransferSingle",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "string",
            name: "value",
            type: "string"
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "id",
            type: "uint256"
          }
        ],
        name: "URI",
        type: "event"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256"
          }
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address[]",
            name: "accounts",
            type: "address[]"
          },
          {
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]"
          }
        ],
        name: "balanceOfBatch",
        outputs: [
          {
            internalType: "uint256[]",
            name: "",
            type: "uint256[]"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          },
          {
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]"
          },
          {
            internalType: "uint256[]",
            name: "values",
            type: "uint256[]"
          }
        ],
        name: "burnBatch",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          },
          {
            internalType: "address",
            name: "operator",
            type: "address"
          }
        ],
        name: "isApprovedForAll",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes"
          }
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]"
          },
          {
            internalType: "uint256[]",
            name: "amounts",
            type: "uint256[]"
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes"
          }
        ],
        name: "mintBatch",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]"
          },
          {
            internalType: "uint256[]",
            name: "values",
            type: "uint256[]"
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes"
          }
        ],
        name: "safeBatchTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes"
          }
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address"
          },
          {
            internalType: "bool",
            name: "approved",
            type: "bool"
          }
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "newuri",
            type: "string"
          }
        ],
        name: "setURI",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "bytes4",
            name: "interfaceId",
            type: "bytes4"
          }
        ],
        name: "supportsInterface",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address"
          }
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        name: "uri",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string"
          }
        ],
        stateMutability: "view",
        type: "function"
      }
    ],
    bytecode: "0x608060405234801561000f575f5ffd5b50604051611a2b380380611a2b83398101604081905261002e91610108565b808261003981610078565b506001600160a01b03811661006757604051631e4fbdf760e01b81525f600482015260240160405180910390fd5b61007081610088565b505050610307565b6002610084828261024d565b5050565b600380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b634e487b7160e01b5f52604160045260245ffd5b80516001600160a01b0381168114610103575f5ffd5b919050565b5f5f60408385031215610119575f5ffd5b82516001600160401b0381111561012e575f5ffd5b8301601f8101851361013e575f5ffd5b80516001600160401b03811115610157576101576100d9565b604051601f8201601f19908116603f011681016001600160401b0381118282101715610185576101856100d9565b60405281815282820160200187101561019c575f5ffd5b8160208401602083015e5f602083830101528094505050506101c0602084016100ed565b90509250929050565b600181811c908216806101dd57607f821691505b6020821081036101fb57634e487b7160e01b5f52602260045260245ffd5b50919050565b601f82111561024857805f5260205f20601f840160051c810160208510156102265750805b601f840160051c820191505b81811015610245575f8155600101610232565b50505b505050565b81516001600160401b03811115610266576102666100d9565b61027a8161027484546101c9565b84610201565b6020601f8211600181146102ac575f83156102955750848201515b5f19600385901b1c1916600184901b178455610245565b5f84815260208120601f198516915b828110156102db57878501518255602094850194600190920191016102bb565b50848210156102f857868401515f19600387901b60f8161c191681555b50505050600190811b01905550565b611717806103145f395ff3fe608060405234801561000f575f5ffd5b50600436106100fa575f3560e01c8063715018a611610093578063e985e9c511610063578063e985e9c51461021e578063f242432a14610231578063f2fde38b14610244578063f5298aca14610257575f5ffd5b8063715018a6146101d5578063731133e9146101dd5780638da5cb5b146101f0578063a22cb4651461020b575f5ffd5b80631f7fdffa116100ce5780631f7fdffa1461017c5780632eb2c2d61461018f5780634e1273f4146101a25780636b20c454146101c2575f5ffd5b8062fdd58e146100fe57806301ffc9a71461012457806302fe5305146101475780630e89341c1461015c575b5f5ffd5b61011161010c366004610e36565b61026a565b6040519081526020015b60405180910390f35b610137610132366004610e73565b610291565b604051901515815260200161011b565b61015a610155366004610f31565b6102e0565b005b61016f61016a366004610f7d565b6102f4565b60405161011b9190610fc2565b61015a61018a36600461107e565b610386565b61015a61019d36600461111a565b6103a0565b6101b56101b03660046111c6565b61040c565b60405161011b91906112c1565b61015a6101d03660046112d3565b6104d6565b61015a61053a565b61015a6101eb366004611345565b61054d565b6003546040516001600160a01b03909116815260200161011b565b61015a610219366004611389565b610561565b61013761022c3660046113c2565b610570565b61015a61023f3660046113f3565b61059d565b61015a610252366004611446565b6105fc565b61015a61026536600461145f565b610636565b5f818152602081815260408083206001600160a01b03861684529091529020545b92915050565b5f6001600160e01b03198216636cdb3d1360e11b14806102c157506001600160e01b031982166303a24d0760e21b145b8061028b57506301ffc9a760e01b6001600160e01b031983161461028b565b6102e861066c565b6102f181610699565b50565b6060600280546103039061148f565b80601f016020809104026020016040519081016040528092919081815260200182805461032f9061148f565b801561037a5780601f106103515761010080835404028352916020019161037a565b820191905f5260205f20905b81548152906001019060200180831161035d57829003601f168201915b50505050509050919050565b61038e61066c565b61039a848484846106a5565b50505050565b336001600160a01b03861681148015906103c157506103bf8682610570565b155b156103f75760405163711bec9160e11b81526001600160a01b038083166004830152871660248201526044015b60405180910390fd5b61040486868686866106db565b505050505050565b6060815183511461043d5781518351604051635b05999160e01b8152600481019290925260248201526044016103ee565b5f83516001600160401b0381111561045757610457610e95565b604051908082528060200260200182016040528015610480578160200160208202803683370190505b5090505f5b84518110156104ce576020808202860101516104a99060208084028701015161026a565b8282815181106104bb576104bb6114c7565b6020908102919091010152600101610485565b509392505050565b6001600160a01b03831633148015906104f657506104f48333610570565b155b1561052a57335b60405163711bec9160e11b81526001600160a01b03918216600482015290841660248201526044016103ee565b610535838383610740565b505050565b61054261066c565b61054b5f610783565b565b61055561066c565b61039a848484846107d4565b61056c33838361082f565b5050565b6001600160a01b039182165f90815260016020908152604080832093909416825291909152205460ff1690565b336001600160a01b03861681148015906105be57506105bc8682610570565b155b156105ef5760405163711bec9160e11b81526001600160a01b038083166004830152871660248201526044016103ee565b61040486868686866108c3565b61060461066c565b6001600160a01b03811661062d57604051631e4fbdf760e01b81525f60048201526024016103ee565b6102f181610783565b6001600160a01b038316331480159061065657506106548333610570565b155b1561066157336104fd565b61053583838361094f565b6003546001600160a01b0316331461054b5760405163118cdaa760e01b81523360048201526024016103ee565b600261056c828261151f565b6001600160a01b0384166106ce57604051632bfa23e760e11b81525f60048201526024016103ee565b61039a5f858585856109b1565b6001600160a01b03841661070457604051632bfa23e760e11b81525f60048201526024016103ee565b6001600160a01b03851661072c57604051626a0d4560e21b81525f60048201526024016103ee565b61073985858585856109b1565b5050505050565b6001600160a01b03831661076857604051626a0d4560e21b81525f60048201526024016103ee565b610535835f848460405180602001604052805f8152506109b1565b600380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b6001600160a01b0384166107fd57604051632bfa23e760e11b81525f60048201526024016103ee565b604080516001808252602082018690528183019081526060820185905260808201909252906104045f878484876109b1565b6001600160a01b0382166108575760405162ced3e160e81b81525f60048201526024016103ee565b6001600160a01b038381165f81815260016020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6001600160a01b0384166108ec57604051632bfa23e760e11b81525f60048201526024016103ee565b6001600160a01b03851661091457604051626a0d4560e21b81525f60048201526024016103ee565b6040805160018082526020820186905281830190815260608201859052608082019092529061094687878484876109b1565b50505050505050565b6001600160a01b03831661097757604051626a0d4560e21b81525f60048201526024016103ee565b604080516001808252602082018590528183019081526060820184905260a082019092525f60808201818152919291610739918791859085905b6109bd85858585610a04565b6001600160a01b0384161561073957825133906001036109f657602084810151908401516109ef838989858589610c13565b5050610404565b610404818787878787610d34565b8051825114610a335781518151604051635b05999160e01b8152600481019290925260248201526044016103ee565b335f5b8351811015610b35576020818102858101820151908501909101516001600160a01b03881615610ae7575f828152602081815260408083206001600160a01b038c16845290915290205481811015610ac1576040516303dee4c560e01b81526001600160a01b038a1660048201526024810182905260448101839052606481018490526084016103ee565b5f838152602081815260408083206001600160a01b038d16845290915290209082900390555b6001600160a01b03871615610b2b575f828152602081815260408083206001600160a01b038b16845290915281208054839290610b259084906115d9565b90915550505b5050600101610a36565b508251600103610bb55760208301515f906020840151909150856001600160a01b0316876001600160a01b0316846001600160a01b03167fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f628585604051610ba6929190918252602082015260400190565b60405180910390a45050610739565b836001600160a01b0316856001600160a01b0316826001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8686604051610c049291906115f8565b60405180910390a45050505050565b6001600160a01b0384163b156104045760405163f23a6e6160e01b81526001600160a01b0385169063f23a6e6190610c579089908990889088908890600401611625565b6020604051808303815f875af1925050508015610c91575060408051601f3d908101601f19168201909252610c8e91810190611669565b60015b610cf8573d808015610cbe576040519150601f19603f3d011682016040523d82523d5f602084013e610cc3565b606091505b5080515f03610cf057604051632bfa23e760e11b81526001600160a01b03861660048201526024016103ee565b805160208201fd5b6001600160e01b0319811663f23a6e6160e01b1461094657604051632bfa23e760e11b81526001600160a01b03861660048201526024016103ee565b6001600160a01b0384163b156104045760405163bc197c8160e01b81526001600160a01b0385169063bc197c8190610d789089908990889088908890600401611684565b6020604051808303815f875af1925050508015610db2575060408051601f3d908101601f19168201909252610daf91810190611669565b60015b610ddf573d808015610cbe576040519150601f19603f3d011682016040523d82523d5f602084013e610cc3565b6001600160e01b0319811663bc197c8160e01b1461094657604051632bfa23e760e11b81526001600160a01b03861660048201526024016103ee565b80356001600160a01b0381168114610e31575f5ffd5b919050565b5f5f60408385031215610e47575f5ffd5b610e5083610e1b565b946020939093013593505050565b6001600160e01b0319811681146102f1575f5ffd5b5f60208284031215610e83575f5ffd5b8135610e8e81610e5e565b9392505050565b634e487b7160e01b5f52604160045260245ffd5b604051601f8201601f191681016001600160401b0381118282101715610ed157610ed1610e95565b604052919050565b5f5f6001600160401b03841115610ef257610ef2610e95565b50601f8301601f1916602001610f0781610ea9565b915050828152838383011115610f1b575f5ffd5b828260208301375f602084830101529392505050565b5f60208284031215610f41575f5ffd5b81356001600160401b03811115610f56575f5ffd5b8201601f81018413610f66575f5ffd5b610f7584823560208401610ed9565b949350505050565b5f60208284031215610f8d575f5ffd5b5035919050565b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b602081525f610e8e6020830184610f94565b5f6001600160401b03821115610fec57610fec610e95565b5060051b60200190565b5f82601f830112611005575f5ffd5b813561101861101382610fd4565b610ea9565b8082825260208201915060208360051b860101925085831115611039575f5ffd5b602085015b8381101561105657803583526020928301920161103e565b5095945050505050565b5f82601f83011261106f575f5ffd5b610e8e83833560208501610ed9565b5f5f5f5f60808587031215611091575f5ffd5b61109a85610e1b565b935060208501356001600160401b038111156110b4575f5ffd5b6110c087828801610ff6565b93505060408501356001600160401b038111156110db575f5ffd5b6110e787828801610ff6565b92505060608501356001600160401b03811115611102575f5ffd5b61110e87828801611060565b91505092959194509250565b5f5f5f5f5f60a0868803121561112e575f5ffd5b61113786610e1b565b945061114560208701610e1b565b935060408601356001600160401b0381111561115f575f5ffd5b61116b88828901610ff6565b93505060608601356001600160401b03811115611186575f5ffd5b61119288828901610ff6565b92505060808601356001600160401b038111156111ad575f5ffd5b6111b988828901611060565b9150509295509295909350565b5f5f604083850312156111d7575f5ffd5b82356001600160401b038111156111ec575f5ffd5b8301601f810185136111fc575f5ffd5b803561120a61101382610fd4565b8082825260208201915060208360051b85010192508783111561122b575f5ffd5b6020840193505b828410156112545761124384610e1b565b825260209384019390910190611232565b945050505060208301356001600160401b03811115611271575f5ffd5b61127d85828601610ff6565b9150509250929050565b5f8151808452602084019350602083015f5b828110156112b7578151865260209586019590910190600101611299565b5093949350505050565b602081525f610e8e6020830184611287565b5f5f5f606084860312156112e5575f5ffd5b6112ee84610e1b565b925060208401356001600160401b03811115611308575f5ffd5b61131486828701610ff6565b92505060408401356001600160401b0381111561132f575f5ffd5b61133b86828701610ff6565b9150509250925092565b5f5f5f5f60808587031215611358575f5ffd5b61136185610e1b565b9350602085013592506040850135915060608501356001600160401b03811115611102575f5ffd5b5f5f6040838503121561139a575f5ffd5b6113a383610e1b565b9150602083013580151581146113b7575f5ffd5b809150509250929050565b5f5f604083850312156113d3575f5ffd5b6113dc83610e1b565b91506113ea60208401610e1b565b90509250929050565b5f5f5f5f5f60a08688031215611407575f5ffd5b61141086610e1b565b945061141e60208701610e1b565b9350604086013592506060860135915060808601356001600160401b038111156111ad575f5ffd5b5f60208284031215611456575f5ffd5b610e8e82610e1b565b5f5f5f60608486031215611471575f5ffd5b61147a84610e1b565b95602085013595506040909401359392505050565b600181811c908216806114a357607f821691505b6020821081036114c157634e487b7160e01b5f52602260045260245ffd5b50919050565b634e487b7160e01b5f52603260045260245ffd5b601f82111561053557805f5260205f20601f840160051c810160208510156115005750805b601f840160051c820191505b81811015610739575f815560010161150c565b81516001600160401b0381111561153857611538610e95565b61154c81611546845461148f565b846114db565b6020601f82116001811461157e575f83156115675750848201515b5f19600385901b1c1916600184901b178455610739565b5f84815260208120601f198516915b828110156115ad578785015182556020948501946001909201910161158d565b50848210156115ca57868401515f19600387901b60f8161c191681555b50505050600190811b01905550565b8082018082111561028b57634e487b7160e01b5f52601160045260245ffd5b604081525f61160a6040830185611287565b828103602084015261161c8185611287565b95945050505050565b6001600160a01b03868116825285166020820152604081018490526060810183905260a0608082018190525f9061165e90830184610f94565b979650505050505050565b5f60208284031215611679575f5ffd5b8151610e8e81610e5e565b6001600160a01b0386811682528516602082015260a0604082018190525f906116af90830186611287565b82810360608401526116c18186611287565b905082810360808401526116d58185610f94565b9897505050505050505056fea26469706673582212200cd1dff572dc679ab88622f18090fdd4b38737cfef3aa4b6d63ac0f8ab04850164736f6c634300081e0033"
  }
};

// workers/src/index.ts
var jsonResponse = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Wallet-Address",
    // Aggressively prevent caching of API responses
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0"
  }
}), "jsonResponse");
var errorResponse = /* @__PURE__ */ __name((message, status = 500) => jsonResponse({ error: message }, status), "errorResponse");
var toHex2 = /* @__PURE__ */ __name((buffer2) => `0x${[...new Uint8Array(buffer2)].map((b) => b.toString(16).padStart(2, "0")).join("")}`, "toHex");
var generateContractKey = /* @__PURE__ */ __name((type, options) => {
  const parts = [type.toLowerCase(), ...Object.keys(options).sort().filter((k) => options[k]).map((k) => k.toLowerCase())];
  return parts.join("_");
}, "generateContractKey");
var createUserKey = /* @__PURE__ */ __name((walletAddress, key) => `${walletAddress}:${key}`, "createUserKey");
var isValidWalletAddress = /* @__PURE__ */ __name((address) => /^0x[a-fA-F0-9]{40}$/.test(address), "isValidWalletAddress");
async function handleGenerateAccount(request, env) {
  const privateKeyBytes = crypto.getRandomValues(new Uint8Array(32));
  const privateKey = toHex2(privateKeyBytes);
  const account = privateKeyToAccount(privateKey);
  return jsonResponse({ address: account.address, privateKey });
}
__name(handleGenerateAccount, "handleGenerateAccount");
async function handleCompileContract(request, env) {
  const { contractType, options } = await request.json();
  if (!contractType || !options) return errorResponse("contractType and options are required", 400);
  const key = generateContractKey(contractType, options);
  const contractData = precompiled_contracts_default[key];
  if (!contractData) return errorResponse(`No precompiled contract found for key: ${key}`, 404);
  return jsonResponse(contractData);
}
__name(handleCompileContract, "handleCompileContract");
async function handleStorage(request, env) {
  const { method, url } = request;
  const walletAddress = request.headers.get("X-Wallet-Address");
  if (!walletAddress || !isValidWalletAddress(walletAddress)) return errorResponse("Valid X-Wallet-Address header required", 400);
  const key = new URL(url).searchParams.get("key");
  if (method === "GET") {
    if (key) {
      const value = await env.EVM_PANEL_KV.get(createUserKey(walletAddress, key));
      return value ? new Response(value, { headers: jsonResponse({}, 200).headers }) : errorResponse("Key not found", 404);
    } else {
      const list = await env.EVM_PANEL_KV.list({ prefix: `${walletAddress}:` });
      const items = {};
      for (const item of list.keys) {
        const value = await env.EVM_PANEL_KV.get(item.name);
        items[item.name.replace(`${walletAddress}:`, "")] = value ? JSON.parse(value) : null;
      }
      return jsonResponse(items);
    }
  }
  if (method === "POST") {
    const data = await request.json();
    if (!data.key) return errorResponse("Key is required in request body", 400);
    await env.EVM_PANEL_KV.put(createUserKey(walletAddress, data.key), JSON.stringify(data.value));
    return jsonResponse({ success: true });
  }
  if (method === "DELETE") {
    if (!key) return errorResponse("Key URL parameter is required for DELETE", 400);
    await env.EVM_PANEL_KV.delete(createUserKey(walletAddress, key));
    return jsonResponse({ success: true });
  }
  return errorResponse("Method not allowed for /storage", 405);
}
__name(handleStorage, "handleStorage");
async function handleUploadToIpfs(request, env) {
  if (!env.PINATA_JWT) return errorResponse("Pinata JWT secret not configured", 500);
  const formData = await request.formData();
  const file = formData.get("file");
  const name = formData.get("name");
  if (!file || !name) return errorResponse("Name and file are required", 400);
  const fileFormData = new FormData();
  fileFormData.append("file", file, file.name);
  fileFormData.append("pinataOptions", JSON.stringify({ wrapWithDirectory: false }));
  const pinataFileResponse = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: { "Authorization": `Bearer ${env.PINATA_JWT}` },
    body: fileFormData
  });
  if (!pinataFileResponse.ok) throw new Error(`Pinata file upload failed: ${await pinataFileResponse.text()}`);
  const fileResult = await pinataFileResponse.json();
  const metadata = { name, description: `NFT for ${name}`, image: `https://gateway.pinata.cloud/ipfs/${fileResult.IpfsHash}` };
  const pinataMetadataResponse = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: { "Authorization": `Bearer ${env.PINATA_JWT}`, "Content-Type": "application/json" },
    body: JSON.stringify({ pinataContent: metadata, pinataMetadata: { name: `${name}-metadata.json` } })
  });
  if (!pinataMetadataResponse.ok) throw new Error(`Pinata metadata upload failed: ${await pinataMetadataResponse.text()}`);
  const metadataResult = await pinataMetadataResponse.json();
  return jsonResponse({ tokenURI: `https://gateway.pinata.cloud/ipfs/${metadataResult.IpfsHash}` });
}
__name(handleUploadToIpfs, "handleUploadToIpfs");
var DEFAULT_NETWORKS = [
  { id: 1, name: "Ethereum", rpcUrl: "https://eth.drpc.org", symbol: "ETH", explorerUrl: "https://etherscan.io" },
  { id: 11155111, name: "Sepolia", rpcUrl: "https://sepolia.drpc.org", symbol: "ETH", explorerUrl: "https://sepolia.etherscan.io" },
  { id: 56, name: "BSC", rpcUrl: "https://bsc-drpc.org", symbol: "BNB", explorerUrl: "https://bscscan.com" },
  { id: 137, name: "Polygon", rpcUrl: "https://polygon.drpc.org", symbol: "MATIC", explorerUrl: "https://polygonscan.com" },
  { id: 42161, name: "Arbitrum", rpcUrl: "https://arbitrum.drpc.org", symbol: "ETH", explorerUrl: "https://arbiscan.io" },
  { id: 43114, name: "Avalanche", rpcUrl: "https://avalanche.drpc.org", symbol: "AVAX", explorerUrl: "https://snowtrace.io" },
  { id: 250, name: "Fantom", rpcUrl: "https://fantom.drpc.org", symbol: "FTM", explorerUrl: "https://ftmscan.com" },
  { id: 10, name: "Optimism", rpcUrl: "https://optimism.drpc.org", symbol: "ETH", explorerUrl: "https://optimistic.etherscan.io" },
  { id: 8453, name: "Base", rpcUrl: "https://base.drpc.org", symbol: "ETH", explorerUrl: "https://basescan.org" }
];
var NETWORKS_KV_KEY = "networks_list";
async function handleGetNetworks(request, env) {
  try {
    let networks = await env.EVM_PANEL_KV.get(NETWORKS_KV_KEY, "json");
    if (!networks) {
      networks = DEFAULT_NETWORKS;
      await env.EVM_PANEL_KV.put(NETWORKS_KV_KEY, JSON.stringify(networks));
    }
    return jsonResponse(networks);
  } catch (error) {
    console.error("Error getting networks from KV:", error);
    return errorResponse("Could not retrieve network list", 500);
  }
}
__name(handleGetNetworks, "handleGetNetworks");
async function handleManageNetworks(request, env) {
  if (request.method === "POST") {
    try {
      const newNetwork = await request.json();
      if (!newNetwork.id || !newNetwork.name || !newNetwork.rpcUrl || !newNetwork.symbol) {
        return errorResponse("New network object is missing required fields", 400);
      }
      let networks = await env.EVM_PANEL_KV.get(NETWORKS_KV_KEY, "json") || DEFAULT_NETWORKS;
      const existingIndex = networks.findIndex((n) => n.id === newNetwork.id);
      if (existingIndex > -1) {
        networks[existingIndex] = newNetwork;
      } else {
        networks.push(newNetwork);
      }
      await env.EVM_PANEL_KV.put(NETWORKS_KV_KEY, JSON.stringify(networks));
      return jsonResponse(networks);
    } catch (error) {
      console.error("Error adding network to KV:", error);
      return errorResponse("Could not add network", 500);
    }
  }
  if (request.method === "DELETE") {
    try {
      const { id } = await request.json();
      if (!id) {
        return errorResponse("Network ID is required for deletion", 400);
      }
      let networks = await env.EVM_PANEL_KV.get(NETWORKS_KV_KEY, "json");
      if (!networks) {
        return errorResponse("No networks found to delete from", 404);
      }
      const updatedNetworks = networks.filter((n) => n.id !== id);
      if (updatedNetworks.length === 0) {
        return errorResponse("Cannot delete the last network", 400);
      }
      await env.EVM_PANEL_KV.put(NETWORKS_KV_KEY, JSON.stringify(updatedNetworks));
      return jsonResponse(updatedNetworks);
    } catch (error) {
      console.error("Error deleting network from KV:", error);
      return errorResponse("Could not delete network", 500);
    }
  }
  return errorResponse("Method not allowed for this route", 405);
}
__name(handleManageNetworks, "handleManageNetworks");
async function handleConnect(request, env) {
  const { rpcUrl, privateKey } = await request.json();
  console.log("Handling connect request:", { rpcUrl, privateKey });
  if (!rpcUrl || !privateKey) {
    return errorResponse("RPC URL or private key missing", 400);
  }
  const normalizedPrivateKey = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;
  if (!/^0x[a-fA-F0-9]{64}$/.test(normalizedPrivateKey)) {
    return errorResponse("Invalid private key", 400);
  }
  try {
    const networks = JSON.parse(env.NETWORKS);
    const chainId = await getChainId2(rpcUrl);
    const network = networks.find((n) => n.id === chainId);
    if (!network) {
      return errorResponse(`Network with chainId ${chainId} not configured`, 400);
    }
    const client = createPublicClient({
      chain: {
        id: network.id,
        name: network.name,
        nativeCurrency: { name: network.name, symbol: network.symbol, decimals: 18 },
        rpcUrls: { default: { http: [network.rpcUrl] } }
      },
      transport: http(rpcUrl)
    });
    const account = privateKeyToAccount(normalizedPrivateKey);
    const balance = await client.getBalance({ address: account.address });
    const result = { address: account.address, balance: balance.toString(), chainId, rpcUrl, explorerUrl: network.explorerUrl };
    console.log("Connect result:", result);
    return jsonResponse(result);
  } catch (error) {
    console.error("Error in handleConnect:", error);
    return errorResponse("Failed to connect: " + error.message, 500);
  }
}
__name(handleConnect, "handleConnect");
async function handleBalance(request, env) {
  const { rpcUrl, address, tokenAddresses = [], nftAddresses = [] } = await request.json();
  console.log("Handling balance request:", { rpcUrl, address, tokenAddresses, nftAddresses });
  if (!rpcUrl || !address) {
    return errorResponse("RPC URL and address are required", 400);
  }
  try {
    const networks = JSON.parse(env.NETWORKS);
    const chainId = await getChainId2(rpcUrl);
    const network = networks.find((n) => n.id === chainId);
    if (!network) {
      return errorResponse(`Network with chainId ${chainId} not configured`, 400);
    }
    const client = createPublicClient({
      chain: {
        id: network.id,
        name: network.name,
        nativeCurrency: { name: network.name, symbol: network.symbol, decimals: 18 },
        rpcUrls: { default: { http: [network.rpcUrl] } }
      },
      transport: http(rpcUrl)
    });
    console.log("Chain ID:", chainId);
    const nativeBalance = await client.getBalance({ address });
    console.log("Native balance:", nativeBalance.toString());
    const erc20Balances = await Promise.all(
      tokenAddresses.map(async (token) => {
        try {
          const [balance, symbol, decimals] = await Promise.all([
            client.readContract({
              address: token,
              abi: erc20Abi,
              functionName: "balanceOf",
              args: [address]
            }),
            client.readContract({
              address: token,
              abi: erc20Abi,
              functionName: "symbol"
            }),
            client.readContract({
              address: token,
              abi: erc20Abi,
              functionName: "decimals"
            })
          ]);
          console.log("ERC20 token balance:", { token, balance: balance.toString(), symbol, decimals: Number(decimals) });
          return { token, balance: balance.toString(), symbol, decimals: Number(decimals) };
        } catch (error) {
          console.error("Error fetching ERC20 token balance:", error);
          return { token, balance: "0", symbol: "UNKNOWN", decimals: 18 };
        }
      })
    );
    const nftBalances = await Promise.all(
      nftAddresses.map(async (nft) => {
        try {
          const balance = await client.readContract({
            address: nft,
            abi: erc721Abi,
            functionName: "balanceOf",
            args: [address]
          });
          console.log("ERC721 NFT balance:", { nft, balance: balance.toString() });
          return { nft, balance: balance.toString(), type: "ERC721" };
        } catch {
          try {
            const balance = await client.readContract({
              address: nft,
              abi: erc1155Abi,
              functionName: "balanceOf",
              args: [address, 0n]
            });
            console.log("ERC1155 NFT balance:", { nft, balance: balance.toString() });
            return { nft, balance: balance.toString(), type: "ERC1155", tokenId: 0 };
          } catch (error) {
            console.error("Error fetching NFT balance:", error);
            return { nft, balance: "0", type: "UNKNOWN" };
          }
        }
      })
    );
    const result = { chainId, nativeBalance: nativeBalance.toString(), erc20Balances, nftBalances };
    console.log("Balance result:", result);
    return jsonResponse(result);
  } catch (error) {
    console.error("Error in handleBalance:", error);
    return errorResponse("Failed to fetch balance: " + error.message, 500);
  }
}
__name(handleBalance, "handleBalance");
async function handleSendTransaction(request, env) {
  const { rpcUrl, privateKey, toAddress, amount, tokenType, tokenAddress, tokenId } = await request.json();
  if (!rpcUrl || !privateKey || !toAddress) {
    return errorResponse("Missing required fields", 400);
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(toAddress)) {
    return errorResponse("Invalid toAddress", 400);
  }
  if (tokenType !== "native" && tokenAddress && !/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
    return errorResponse("Invalid tokenAddress", 400);
  }
  if ((tokenType === "ERC721" || tokenType === "ERC1155") && !tokenId) {
    return errorResponse("Missing tokenId for NFT", 400);
  }
  if (!["native", "ERC20", "ERC721", "ERC1155"].includes(tokenType)) {
    return errorResponse("Invalid token type", 400);
  }
  if (amount && isNaN(Number(amount))) {
    return errorResponse("Invalid amount", 400);
  }
  const normalizedPrivateKey = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;
  if (!/^0x[a-fA-F0-9]{64}$/.test(normalizedPrivateKey)) {
    return errorResponse("Invalid private key", 400);
  }
  try {
    const networks = JSON.parse(env.NETWORKS);
    const chainId = await getChainId2(rpcUrl);
    const network = networks.find((n) => n.id === chainId);
    if (!network) {
      return errorResponse(`Network with chainId ${chainId} not configured`, 400);
    }
    const client = createPublicClient({
      chain: {
        id: network.id,
        name: network.name,
        nativeCurrency: { name: network.name, symbol: network.symbol, decimals: 18 },
        rpcUrls: { default: { http: [network.rpcUrl] } }
      },
      transport: http(rpcUrl)
    });
    const walletClient = createWalletClient({
      chain: {
        id: network.id,
        name: network.name,
        nativeCurrency: { name: network.name, symbol: network.symbol, decimals: 18 },
        rpcUrls: { default: { http: [network.rpcUrl] } }
      },
      transport: http(rpcUrl),
      account: privateKeyToAccount(normalizedPrivateKey)
    });
    let hash2;
    if (tokenType === "native") {
      hash2 = await walletClient.sendTransaction({
        to: toAddress,
        value: BigInt(Math.round(Number(amount) * 1e18))
      });
    } else if (tokenType === "ERC20") {
      hash2 = await walletClient.writeContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "transfer",
        args: [toAddress, BigInt(Math.round(Number(amount) * 1e18))]
      });
    } else if (tokenType === "ERC721") {
      hash2 = await walletClient.writeContract({
        address: tokenAddress,
        abi: erc721Abi,
        functionName: "safeTransferFrom",
        args: [walletClient.account.address, toAddress, BigInt(tokenId)]
      });
    } else if (tokenType === "ERC1155") {
      hash2 = await walletClient.writeContract({
        address: tokenAddress,
        abi: erc1155Abi,
        functionName: "safeTransferFrom",
        args: [walletClient.account.address, toAddress, BigInt(tokenId), BigInt(amount), "0x"]
      });
    }
    if (!hash2) {
      return errorResponse("Failed to send transaction: hash not generated", 500);
    }
    const receipt = await client.waitForTransactionReceipt({ hash: hash2 });
    return jsonResponse({ hash: hash2, address: receipt.contractAddress || null });
  } catch (error) {
    return errorResponse("Failed to send transaction: " + error.message, 500);
  }
}
__name(handleSendTransaction, "handleSendTransaction");
async function handleDeployContract(request, env) {
  const { rpcUrl, privateKey, abi: abi2, bytecode, constructorArgs } = await request.json();
  if (!rpcUrl || !privateKey || !abi2 || !bytecode) {
    return errorResponse("Missing required fields", 400);
  }
  const normalizedPrivateKey = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;
  if (!/^0x[a-fA-F0-9]{64}$/.test(normalizedPrivateKey)) {
    return errorResponse("Invalid private key", 400);
  }
  try {
    const networks = JSON.parse(env.NETWORKS);
    const chainId = await getChainId2(rpcUrl);
    const network = networks.find((n) => n.id === chainId);
    if (!network) {
      return errorResponse(`Network with chainId ${chainId} not configured`, 400);
    }
    const client = createPublicClient({
      chain: {
        id: network.id,
        name: network.name,
        nativeCurrency: { name: network.name, symbol: network.symbol, decimals: 18 },
        rpcUrls: { default: { http: [network.rpcUrl] } }
      },
      transport: http(rpcUrl)
    });
    const walletClient = createWalletClient({
      chain: {
        id: network.id,
        name: network.name,
        nativeCurrency: { name: network.name, symbol: network.symbol, decimals: 18 },
        rpcUrls: { default: { http: [network.rpcUrl] } }
      },
      transport: http(rpcUrl),
      account: privateKeyToAccount(normalizedPrivateKey)
    });
    const hash2 = await walletClient.deployContract({
      abi: abi2,
      bytecode,
      args: constructorArgs || []
    });
    const receipt = await client.waitForTransactionReceipt({ hash: hash2 });
    return jsonResponse({ address: receipt.contractAddress, hash: hash2 });
  } catch (error) {
    return errorResponse("Failed to deploy contract: " + error.message, 500);
  }
}
__name(handleDeployContract, "handleDeployContract");
async function getChainId2(rpcUrl) {
  try {
    console.log("Fetching chain ID for RPC URL:", rpcUrl);
    const client = createPublicClient({ transport: http(rpcUrl) });
    const chainId = await client.getChainId();
    console.log("Chain ID:", chainId);
    return chainId;
  } catch (error) {
    console.error("Error fetching chain ID:", error);
    throw new Error("Failed to fetch chain ID: " + error.message);
  }
}
__name(getChainId2, "getChainId");
var src_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: jsonResponse({}, 200).headers });
    }
    try {
      if (path.startsWith("/api/")) {
        const route = path.substring(5);
        if (route === "generate-account") return await handleGenerateAccount(request, env);
        if (route === "compile-contract") return await handleCompileContract(request, env);
        if (route === "storage") return await handleStorage(request, env);
        if (route === "upload-to-ipfs") return await handleUploadToIpfs(request, env);
        if (route === "connect") return await handleConnect(request, env);
        if (route === "balance") return await handleBalance(request, env);
        if (route === "send-transaction") return await handleSendTransaction(request, env);
        if (route === "deploy-contract") return await handleDeployContract(request, env);
        if (route === "networks" && request.method === "GET") return await handleGetNetworks(request, env);
        if (route === "networks" && (request.method === "POST" || request.method === "DELETE")) return await handleManageNetworks(request, env);
        if (route === "health") return jsonResponse({ status: "ok" });
      } else {
        return await env.ASSETS.fetch(request);
      }
    } catch (e) {
      console.error("Caught error in fetch handler:", e);
      return errorResponse("Internal Server Error: " + e.message, 500);
    }
    return errorResponse("API Route not found.", 404);
  }
};

// ../../AppData/Roaming/nvm/v20.19.1/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_checked_fetch();
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../AppData/Roaming/nvm/v20.19.1/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_checked_fetch();
init_modules_watch_stub();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-e0KIFJ/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../AppData/Roaming/nvm/v20.19.1/node_modules/wrangler/templates/middleware/common.ts
init_checked_fetch();
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-e0KIFJ/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
/*! Bundled license information:

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/utils.js:
@noble/curves/esm/abstract/modular.js:
@noble/curves/esm/abstract/curve.js:
@noble/curves/esm/abstract/weierstrass.js:
@noble/curves/esm/_shortw_utils.js:
@noble/curves/esm/secp256k1.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
//# sourceMappingURL=index.js.map
