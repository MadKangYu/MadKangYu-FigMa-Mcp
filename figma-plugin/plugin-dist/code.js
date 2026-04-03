var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
(function() {
  "use strict";
  const isMixed = (value) => typeof value === "symbol";
  const pixelRound = (v) => Math.round(v * 100) / 100;
  const toHex = (color) => {
    const clamp = (v) => Math.min(255, Math.max(0, Math.round(v * 255)));
    const [r, g, b] = [clamp(color.r), clamp(color.g), clamp(color.b)];
    return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
  };
  const serializePaints = (paints) => {
    if (isMixed(paints)) return "mixed";
    if (!paints || !Array.isArray(paints)) return void 0;
    const result = paints.filter((paint) => paint.type === "SOLID" && "color" in paint).map((paint) => {
      const hex = toHex(paint.color);
      const opacity = paint.opacity != null ? paint.opacity : 1;
      if (opacity === 1) return hex;
      return hex + Math.round(opacity * 255).toString(16).padStart(2, "0");
    });
    return result.length > 0 ? result : void 0;
  };
  const getBounds = (node) => {
    if ("x" in node && "y" in node && "width" in node && "height" in node) {
      return {
        x: pixelRound(node.x),
        y: pixelRound(node.y),
        width: pixelRound(node.width),
        height: pixelRound(node.height)
      };
    }
    return void 0;
  };
  const serializeStyles = (node) => __async(null, null, function* () {
    const styles = {};
    if ("fills" in node) {
      if (node.fillStyleId && typeof node.fillStyleId === "string") {
        const style = yield figma.getStyleByIdAsync(node.fillStyleId);
        if (style) styles.fillStyle = style.name;
      }
      const fills = serializePaints(node.fills);
      if (fills !== void 0) styles.fills = fills;
    }
    if ("strokes" in node) {
      if (node.strokeStyleId && typeof node.strokeStyleId === "string") {
        const style = yield figma.getStyleByIdAsync(node.strokeStyleId);
        if (style) styles.strokeStyle = style.name;
      }
      const strokes = serializePaints(node.strokes);
      if (strokes !== void 0) styles.strokes = strokes;
    }
    if ("cornerRadius" in node) {
      const cr = isMixed(node.cornerRadius) ? "mixed" : node.cornerRadius;
      if (cr !== 0) styles.cornerRadius = cr;
    }
    if ("paddingLeft" in node) {
      styles.padding = {
        top: node.paddingTop,
        right: node.paddingRight,
        bottom: node.paddingBottom,
        left: node.paddingLeft
      };
    }
    return styles;
  });
  const serializeLineHeight = (lineHeight) => {
    if (isMixed(lineHeight)) return "mixed";
    if (!lineHeight || lineHeight.unit === "AUTO") return void 0;
    return { value: lineHeight.value, unit: lineHeight.unit };
  };
  const serializeLetterSpacing = (letterSpacing) => {
    if (isMixed(letterSpacing)) return "mixed";
    if (!letterSpacing || letterSpacing.value === 0) return void 0;
    return { value: letterSpacing.value, unit: letterSpacing.unit };
  };
  const serializeText = (node, base) => __async(null, null, function* () {
    var _a, _b;
    let fontFamily;
    let fontStyle;
    if (typeof node.fontName === "symbol") {
      fontFamily = "mixed";
      fontStyle = "mixed";
    } else if (node.fontName) {
      fontFamily = node.fontName.family;
      fontStyle = node.fontName.style;
    }
    const textStyleName = node.textStyleId && typeof node.textStyleId === "string" ? (_b = (_a = yield figma.getStyleByIdAsync(node.textStyleId)) == null ? void 0 : _a.name) != null ? _b : void 0 : void 0;
    return Object.assign({}, base, {
      characters: node.characters,
      styles: Object.assign({}, base.styles, __spreadProps(__spreadValues({}, textStyleName ? { textStyle: textStyleName } : {}), {
        fontSize: isMixed(node.fontSize) ? "mixed" : node.fontSize,
        fontFamily,
        fontStyle,
        fontWeight: isMixed(node.fontWeight) ? "mixed" : node.fontWeight,
        textDecoration: isMixed(node.textDecoration) ? "mixed" : node.textDecoration !== "NONE" ? node.textDecoration : void 0,
        lineHeight: serializeLineHeight(node.lineHeight),
        letterSpacing: serializeLetterSpacing(node.letterSpacing),
        textAlignHorizontal: isMixed(node.textAlignHorizontal) ? "mixed" : node.textAlignHorizontal
      }))
    });
  });
  const serializeNode = (node) => __async(null, null, function* () {
    const styles = yield serializeStyles(node);
    const base = {
      id: node.id,
      name: node.name,
      type: node.type,
      bounds: getBounds(node),
      styles
    };
    if (node.type === "TEXT") return serializeText(node, base);
    if ("children" in node) {
      return Object.assign({}, base, {
        children: yield Promise.all(node.children.map((child) => serializeNode(child)))
      });
    }
    return base;
  });
  const serializeVariableValue = (value) => {
    if (typeof value !== "object" || value === null) return value;
    if ("type" in value && value.type === "VARIABLE_ALIAS") {
      return { type: "VARIABLE_ALIAS", id: value.id };
    }
    if ("r" in value && "g" in value && "b" in value) {
      return {
        type: "COLOR",
        r: value.r,
        g: value.g,
        b: value.b,
        a: "a" in value ? value.a : 1
      };
    }
    return value;
  };
  const handleReadRequest = (request) => __async(null, null, function* () {
    switch (request.type) {
      case "get_document":
        return {
          type: request.type,
          requestId: request.requestId,
          data: yield serializeNode(figma.currentPage)
        };
      case "get_selection":
        return {
          type: request.type,
          requestId: request.requestId,
          data: yield Promise.all(figma.currentPage.selection.map((node) => serializeNode(node)))
        };
      case "get_node": {
        const nodeId = request.nodeIds && request.nodeIds[0];
        if (!nodeId) throw new Error("nodeIds is required for get_node");
        const node = yield figma.getNodeByIdAsync(nodeId);
        if (!node || node.type === "DOCUMENT")
          throw new Error(`Node not found: ${nodeId}`);
        return {
          type: request.type,
          requestId: request.requestId,
          data: yield serializeNode(node)
        };
      }
      case "get_styles": {
        const [paintStyles, textStyles, effectStyles, gridStyles] = yield Promise.all([
          figma.getLocalPaintStylesAsync(),
          figma.getLocalTextStylesAsync(),
          figma.getLocalEffectStylesAsync(),
          figma.getLocalGridStylesAsync()
        ]);
        return {
          type: request.type,
          requestId: request.requestId,
          data: {
            paints: paintStyles.map((s) => ({
              id: s.id,
              name: s.name,
              paints: s.paints
            })),
            text: textStyles.map((s) => ({
              id: s.id,
              name: s.name,
              fontSize: s.fontSize,
              fontFamily: s.fontName ? s.fontName.family : void 0,
              fontStyle: s.fontName ? s.fontName.style : void 0,
              textDecoration: s.textDecoration !== "NONE" ? s.textDecoration : void 0,
              lineHeight: s.lineHeight,
              letterSpacing: s.letterSpacing
            })),
            effects: effectStyles.map((s) => ({
              id: s.id,
              name: s.name,
              effects: s.effects
            })),
            grids: gridStyles.map((s) => ({
              id: s.id,
              name: s.name,
              layoutGrids: s.layoutGrids
            }))
          }
        };
      }
      case "get_metadata":
        return {
          type: request.type,
          requestId: request.requestId,
          data: {
            fileName: figma.root.name,
            currentPageId: figma.currentPage.id,
            currentPageName: figma.currentPage.name,
            pageCount: figma.root.children.length,
            pages: figma.root.children.map((page) => ({
              id: page.id,
              name: page.name
            }))
          }
        };
      case "get_design_context": {
        const depth = request.params && request.params.depth != null ? request.params.depth : 2;
        const detail = request.params && request.params.detail || "full";
        const serializeForDetail = (n) => __async(null, null, function* () {
          const base = { id: n.id, name: n.name, type: n.type, bounds: getBounds(n) };
          if (detail === "minimal") return base;
          const styles = yield serializeStyles(n);
          const result = Object.assign({}, base);
          if (Object.keys(styles).length > 0) result.styles = styles;
          if ("opacity" in n && n.opacity !== 1) result.opacity = n.opacity;
          if ("visible" in n && !n.visible) result.visible = false;
          if (detail === "compact") return result;
          return yield serializeNode(n);
        });
        const serializeWithDepth = (node, currentDepth) => __async(null, null, function* () {
          if (detail === "full") {
            const serialized2 = yield serializeNode(node);
            if (currentDepth >= depth && serialized2.children) {
              return Object.assign({}, serialized2, {
                children: void 0,
                childCount: node.children ? node.children.length : 0
              });
            }
            if (serialized2.children) {
              const childNodes = yield Promise.all(
                serialized2.children.map(
                  (child) => figma.getNodeByIdAsync(child.id)
                )
              );
              const serializedChildren2 = yield Promise.all(
                childNodes.filter((n) => n !== null && n.type !== "DOCUMENT").map((n) => serializeWithDepth(n, currentDepth + 1))
              );
              return Object.assign({}, serialized2, { children: serializedChildren2 });
            }
            return serialized2;
          }
          const serialized = yield serializeForDetail(node);
          const hasChildren = "children" in node && node.children.length > 0;
          if (!hasChildren) return serialized;
          if (currentDepth >= depth) {
            return Object.assign({}, serialized, { childCount: node.children.length });
          }
          const serializedChildren = yield Promise.all(
            node.children.filter((n) => n.type !== "DOCUMENT").map((n) => serializeWithDepth(n, currentDepth + 1))
          );
          return Object.assign({}, serialized, { children: serializedChildren });
        });
        const selection = figma.currentPage.selection;
        const contextNodes = selection.length > 0 ? yield Promise.all(
          selection.map((node) => serializeWithDepth(node, 0))
        ) : [yield serializeWithDepth(figma.currentPage, 0)];
        return {
          type: request.type,
          requestId: request.requestId,
          data: {
            fileName: figma.root.name,
            currentPage: {
              id: figma.currentPage.id,
              name: figma.currentPage.name
            },
            selectionCount: selection.length,
            context: contextNodes
          }
        };
      }
      case "get_variable_defs": {
        const collections = yield figma.variables.getLocalVariableCollectionsAsync();
        const variableData = yield Promise.all(
          collections.map((collection) => __async(null, null, function* () {
            const variables = yield Promise.all(
              collection.variableIds.map(
                (id) => figma.variables.getVariableByIdAsync(id)
              )
            );
            return {
              id: collection.id,
              name: collection.name,
              modes: collection.modes.map((mode) => ({
                modeId: mode.modeId,
                name: mode.name
              })),
              variables: variables.filter((v) => v !== null).map((variable) => ({
                id: variable.id,
                name: variable.name,
                resolvedType: variable.resolvedType,
                valuesByMode: Object.fromEntries(
                  Object.entries(variable.valuesByMode).map(
                    ([modeId, value]) => [
                      modeId,
                      serializeVariableValue(value)
                    ]
                  )
                )
              }))
            };
          }))
        );
        return {
          type: request.type,
          requestId: request.requestId,
          data: { collections: variableData }
        };
      }
      case "get_screenshot": {
        const format = request.params && request.params.format ? request.params.format : "PNG";
        const scale = request.params && request.params.scale != null ? request.params.scale : 2;
        let targetNodes;
        if (request.nodeIds && request.nodeIds.length > 0) {
          const nodes = yield Promise.all(
            request.nodeIds.map((id) => figma.getNodeByIdAsync(id))
          );
          targetNodes = nodes.filter(
            (n) => n !== null && n.type !== "DOCUMENT" && n.type !== "PAGE"
          );
        } else {
          targetNodes = figma.currentPage.selection.slice();
        }
        if (targetNodes.length === 0)
          throw new Error(
            "No nodes to export. Select nodes or provide nodeIds."
          );
        const exports$1 = yield Promise.all(
          targetNodes.map((node) => __async(null, null, function* () {
            const settings = format === "SVG" ? { format: "SVG" } : format === "PDF" ? { format: "PDF" } : format === "JPG" ? {
              format: "JPG",
              constraint: { type: "SCALE", value: scale }
            } : {
              format: "PNG",
              constraint: { type: "SCALE", value: scale }
            };
            const bytes = yield node.exportAsync(settings);
            const base64 = figma.base64Encode(bytes);
            return {
              nodeId: node.id,
              nodeName: node.name,
              format,
              base64,
              width: node.width,
              height: node.height
            };
          }))
        );
        return {
          type: request.type,
          requestId: request.requestId,
          data: { exports: exports$1 }
        };
      }
      case "get_nodes_info": {
        if (!request.nodeIds || request.nodeIds.length === 0)
          throw new Error("nodeIds is required for get_nodes_info");
        const nodes = yield Promise.all(
          request.nodeIds.map((id) => figma.getNodeByIdAsync(id))
        );
        return {
          type: request.type,
          requestId: request.requestId,
          data: yield Promise.all(
            nodes.filter((n) => n !== null && n.type !== "DOCUMENT").map((n) => serializeNode(n))
          )
        };
      }
      case "get_local_components": {
        const pages = figma.root.children;
        const allComponents = [];
        const componentSetsMap = /* @__PURE__ */ new Map();
        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          yield page.loadAsync();
          const pageNodes = page.findAllWithCriteria({
            types: ["COMPONENT", "COMPONENT_SET"]
          });
          for (const n of pageNodes) {
            if (n.type === "COMPONENT_SET") {
              componentSetsMap.set(n.id, {
                id: n.id,
                name: n.name,
                key: "key" in n ? n.key : null
              });
            } else {
              const parentIsSet = n.parent && n.parent.type === "COMPONENT_SET";
              allComponents.push({
                id: n.id,
                name: n.name,
                key: "key" in n ? n.key : null,
                componentSetId: parentIsSet ? n.parent.id : null,
                variantProperties: "variantProperties" in n ? n.variantProperties : null
              });
            }
          }
          figma.ui.postMessage({
            type: "progress_update",
            requestId: request.requestId,
            progress: Math.round((i + 1) / pages.length * 90) + 1,
            message: `Scanned ${page.name}: ${allComponents.length} components so far`
          });
          yield new Promise((r) => setTimeout(r, 0));
        }
        return {
          type: request.type,
          requestId: request.requestId,
          data: {
            count: allComponents.length,
            components: allComponents,
            componentSets: Array.from(componentSetsMap.values())
          }
        };
      }
      case "get_pages":
        return {
          type: request.type,
          requestId: request.requestId,
          data: {
            currentPageId: figma.currentPage.id,
            pages: figma.root.children.map((page) => ({
              id: page.id,
              name: page.name
            }))
          }
        };
      case "get_viewport":
        return {
          type: request.type,
          requestId: request.requestId,
          data: {
            center: { x: figma.viewport.center.x, y: figma.viewport.center.y },
            zoom: figma.viewport.zoom,
            bounds: {
              x: figma.viewport.bounds.x,
              y: figma.viewport.bounds.y,
              width: figma.viewport.bounds.width,
              height: figma.viewport.bounds.height
            }
          }
        };
      case "get_fonts": {
        const fontMap = /* @__PURE__ */ new Map();
        const collectFonts = (n) => {
          if (n.type === "TEXT") {
            const fontName = n.fontName;
            if (typeof fontName !== "symbol" && fontName) {
              const key = `${fontName.family}::${fontName.style}`;
              if (!fontMap.has(key)) {
                fontMap.set(key, { family: fontName.family, style: fontName.style, nodeCount: 0 });
              }
              fontMap.get(key).nodeCount++;
            }
          }
          if ("children" in n) n.children.forEach(collectFonts);
        };
        collectFonts(figma.currentPage);
        const fonts = Array.from(fontMap.values()).sort((a, b) => b.nodeCount - a.nodeCount);
        return {
          type: request.type,
          requestId: request.requestId,
          data: { count: fonts.length, fonts }
        };
      }
      case "search_nodes": {
        const query = request.params && request.params.query ? request.params.query.toLowerCase() : "";
        const scopeNodeId = request.params && request.params.nodeId;
        const types = request.params && request.params.types ? request.params.types : [];
        const limit = request.params && request.params.limit ? request.params.limit : 50;
        const root = scopeNodeId ? yield figma.getNodeByIdAsync(scopeNodeId) : figma.currentPage;
        if (!root) throw new Error(`Node not found: ${scopeNodeId}`);
        const results = [];
        const search = (n) => __async(null, null, function* () {
          if (results.length >= limit) return;
          if (n !== root) {
            const nameMatch = !query || n.name.toLowerCase().includes(query);
            const typeMatch = types.length === 0 || types.includes(n.type);
            if (nameMatch && typeMatch) {
              results.push({
                id: n.id,
                name: n.name,
                type: n.type,
                bounds: getBounds(n)
              });
            }
          }
          if (results.length < limit && "children" in n) {
            for (const child of n.children) yield search(child);
          }
        });
        yield search(root);
        return {
          type: request.type,
          requestId: request.requestId,
          data: { count: results.length, nodes: results }
        };
      }
      case "get_reactions": {
        const nodeId = request.nodeIds && request.nodeIds[0];
        if (!nodeId) throw new Error("nodeId is required for get_reactions");
        const node = yield figma.getNodeByIdAsync(nodeId);
        if (!node || node.type === "DOCUMENT") throw new Error(`Node not found: ${nodeId}`);
        const reactions = "reactions" in node ? node.reactions : [];
        return {
          type: request.type,
          requestId: request.requestId,
          data: { nodeId: node.id, name: node.name, reactions }
        };
      }
      case "get_annotations": {
        const nodeId = request.params && request.params.nodeId;
        const nodeAnnotations = (n) => {
          const anns = n.annotations;
          return Array.isArray(anns) ? anns : null;
        };
        if (nodeId) {
          const node = yield figma.getNodeByIdAsync(nodeId);
          if (!node) throw new Error(`Node not found: ${nodeId}`);
          const mergedAnnotations = [];
          const collect = (n) => __async(null, null, function* () {
            const anns = nodeAnnotations(n);
            if (anns)
              for (const a of anns)
                mergedAnnotations.push({ nodeId: n.id, annotation: a });
            if ("children" in n)
              for (const child of n.children) yield collect(child);
          });
          yield collect(node);
          return {
            type: request.type,
            requestId: request.requestId,
            data: {
              nodeId: node.id,
              name: node.name,
              annotations: mergedAnnotations
            }
          };
        }
        const annotated = [];
        const processNode = (n) => __async(null, null, function* () {
          const anns = nodeAnnotations(n);
          if (anns && anns.length > 0)
            annotated.push({ nodeId: n.id, name: n.name, annotations: anns });
          if ("children" in n)
            for (const child of n.children) yield processNode(child);
        });
        yield processNode(figma.currentPage);
        return {
          type: request.type,
          requestId: request.requestId,
          data: { annotatedNodes: annotated }
        };
      }
      case "scan_text_nodes": {
        const nodeId = request.params && request.params.nodeId;
        if (!nodeId) throw new Error("nodeId is required for scan_text_nodes");
        const root = yield figma.getNodeByIdAsync(nodeId);
        if (!root) throw new Error(`Node not found: ${nodeId}`);
        const textNodes = [];
        const findText = (n) => __async(null, null, function* () {
          if (n.type === "TEXT") {
            textNodes.push({
              id: n.id,
              name: n.name,
              characters: n.characters,
              fontSize: n.fontSize,
              fontName: n.fontName
            });
          }
          if ("children" in n)
            for (const child of n.children) yield findText(child);
        });
        figma.ui.postMessage({
          type: "progress_update",
          requestId: request.requestId,
          progress: 10,
          message: "Scanning text nodes..."
        });
        yield new Promise((r) => setTimeout(r, 0));
        yield findText(root);
        return {
          type: request.type,
          requestId: request.requestId,
          data: { count: textNodes.length, textNodes }
        };
      }
      case "scan_nodes_by_types": {
        const nodeId = request.params && request.params.nodeId;
        const types = request.params && request.params.types ? request.params.types : [];
        if (!nodeId)
          throw new Error("nodeId is required for scan_nodes_by_types");
        if (types.length === 0)
          throw new Error("types must be a non-empty array");
        const root = yield figma.getNodeByIdAsync(nodeId);
        if (!root) throw new Error(`Node not found: ${nodeId}`);
        const matchingNodes = [];
        const findByTypes = (n) => __async(null, null, function* () {
          if ("visible" in n && !n.visible) return;
          if (types.includes(n.type)) {
            matchingNodes.push({
              id: n.id,
              name: n.name,
              type: n.type,
              bbox: {
                x: "x" in n ? n.x : 0,
                y: "y" in n ? n.y : 0,
                width: "width" in n ? n.width : 0,
                height: "height" in n ? n.height : 0
              }
            });
          }
          if ("children" in n)
            for (const child of n.children) yield findByTypes(child);
        });
        figma.ui.postMessage({
          type: "progress_update",
          requestId: request.requestId,
          progress: 10,
          message: `Scanning for types: ${types.join(", ")}...`
        });
        yield new Promise((r) => setTimeout(r, 0));
        yield findByTypes(root);
        return {
          type: request.type,
          requestId: request.requestId,
          data: {
            count: matchingNodes.length,
            matchingNodes,
            searchedTypes: types
          }
        };
      }
      default:
        return null;
    }
  });
  const hexToRgb = (hex) => {
    const clean = hex.replace("#", "");
    return {
      r: parseInt(clean.slice(0, 2), 16) / 255,
      g: parseInt(clean.slice(2, 4), 16) / 255,
      b: parseInt(clean.slice(4, 6), 16) / 255,
      a: clean.length >= 8 ? parseInt(clean.slice(6, 8), 16) / 255 : 1
    };
  };
  const makeSolidPaint = (colorInput, opacityOverride) => {
    const { r, g, b, a } = typeof colorInput === "string" ? hexToRgb(colorInput) : { r: colorInput.r, g: colorInput.g, b: colorInput.b, a: colorInput.a != null ? colorInput.a : 1 };
    const eff = opacityOverride != null ? opacityOverride : a;
    const paint = { type: "SOLID", color: { r, g, b } };
    if (eff !== 1) paint.opacity = eff;
    return paint;
  };
  const getParentNode = (parentId) => __async(null, null, function* () {
    if (!parentId) return figma.currentPage;
    const parent = yield figma.getNodeByIdAsync(parentId);
    if (!parent) throw new Error(`Parent node not found: ${parentId}`);
    if (!("appendChild" in parent)) throw new Error(`Node ${parentId} cannot have children`);
    return parent;
  });
  const base64ToBytes = (b64) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    const lookup = {};
    for (let i = 0; i < chars.length; i++) lookup[chars[i]] = i;
    const clean = b64.replace(/[^A-Za-z0-9+/]/g, "");
    let outLen = Math.floor(clean.length * 3 / 4);
    if (b64.endsWith("==")) outLen -= 2;
    else if (b64.endsWith("=")) outLen -= 1;
    const bytes = new Uint8Array(outLen);
    let j = 0;
    for (let i = 0; i < clean.length; i += 4) {
      const a = lookup[clean[i]] || 0;
      const bv = lookup[clean[i + 1]] || 0;
      const c = lookup[clean[i + 2]] || 0;
      const d = lookup[clean[i + 3]] || 0;
      bytes[j++] = a << 2 | bv >> 4;
      if (j < outLen) bytes[j++] = (bv & 15) << 4 | c >> 2;
      if (j < outLen) bytes[j++] = (c & 3) << 6 | d;
    }
    return bytes;
  };
  const handleWriteRequest = (request) => __async(null, null, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    switch (request.type) {
      case "create_frame": {
        const p = request.params || {};
        const parent = yield getParentNode(p.parentId);
        const frame = figma.createFrame();
        frame.resize(p.width || 100, p.height || 100);
        frame.x = p.x != null ? p.x : 0;
        frame.y = p.y != null ? p.y : 0;
        if (p.name) frame.name = p.name;
        if (p.fillColor) frame.fills = [makeSolidPaint(p.fillColor)];
        applyAutoLayout(frame, p);
        parent.appendChild(frame);
        figma.commitUndo();
        return {
          type: request.type,
          requestId: request.requestId,
          data: { id: frame.id, name: frame.name, type: frame.type, bounds: getBounds(frame) }
        };
      }
      case "create_rectangle": {
        const p = request.params || {};
        const parent = yield getParentNode(p.parentId);
        const rect = figma.createRectangle();
        rect.resize(p.width || 100, p.height || 100);
        rect.x = p.x != null ? p.x : 0;
        rect.y = p.y != null ? p.y : 0;
        if (p.name) rect.name = p.name;
        if (p.fillColor) rect.fills = [makeSolidPaint(p.fillColor)];
        if (p.cornerRadius != null) rect.cornerRadius = p.cornerRadius;
        parent.appendChild(rect);
        figma.commitUndo();
        return {
          type: request.type,
          requestId: request.requestId,
          data: { id: rect.id, name: rect.name, type: rect.type, bounds: getBounds(rect) }
        };
      }
      case "create_ellipse": {
        const p = request.params || {};
        const parent = yield getParentNode(p.parentId);
        const ellipse = figma.createEllipse();
        ellipse.resize(p.width || 100, p.height || 100);
        ellipse.x = p.x != null ? p.x : 0;
        ellipse.y = p.y != null ? p.y : 0;
        if (p.name) ellipse.name = p.name;
        if (p.fillColor) ellipse.fills = [makeSolidPaint(p.fillColor)];
        parent.appendChild(ellipse);
        figma.commitUndo();
        return {
          type: request.type,
          requestId: request.requestId,
          data: { id: ellipse.id, name: ellipse.name, type: ellipse.type, bounds: getBounds(ellipse) }
        };
      }
      case "create_text": {
        const p = request.params || {};
        const parent = yield getParentNode(p.parentId);
        const fontFamily = p.fontFamily || "Inter";
        const fontStyle = p.fontStyle || "Regular";
        yield figma.loadFontAsync({ family: fontFamily, style: fontStyle });
        const textNode = figma.createText();
        textNode.fontName = { family: fontFamily, style: fontStyle };
        if (p.fontSize) textNode.fontSize = p.fontSize;
        textNode.characters = p.text || "";
        textNode.x = p.x != null ? p.x : 0;
        textNode.y = p.y != null ? p.y : 0;
        if (p.name) textNode.name = p.name;
        if (p.fillColor) textNode.fills = [makeSolidPaint(p.fillColor)];
        parent.appendChild(textNode);
        figma.commitUndo();
        return {
          type: request.type,
          requestId: request.requestId,
          data: { id: textNode.id, name: textNode.name, type: textNode.type, bounds: getBounds(textNode) }
        };
      }
      case "set_text": {
        const p = request.params || {};
        const nodeId = request.nodeIds && request.nodeIds[0];
        if (!nodeId) throw new Error("nodeId is required");
        const node = yield figma.getNodeByIdAsync(nodeId);
        if (!node) throw new Error(`Node not found: ${nodeId}`);
        if (node.type !== "TEXT") throw new Error(`Node ${nodeId} is not a TEXT node`);
        const fontName = typeof node.fontName === "symbol" ? { family: "Inter", style: "Regular" } : node.fontName;
        yield figma.loadFontAsync(fontName);
        node.characters = p.text;
        figma.commitUndo();
        return {
          type: request.type,
          requestId: request.requestId,
          data: { id: node.id, name: node.name, characters: node.characters }
        };
      }
      case "set_fills": {
        const p = request.params || {};
        const nodeId = request.nodeIds && request.nodeIds[0];
        if (!nodeId) throw new Error("nodeId is required");
        const node = yield figma.getNodeByIdAsync(nodeId);
        if (!node) throw new Error(`Node not found: ${nodeId}`);
        if (!("fills" in node)) throw new Error(`Node ${nodeId} does not support fills`);
        node.fills = [makeSolidPaint(p.color, p.opacity != null ? p.opacity : void 0)];
        figma.commitUndo();
        return {
          type: request.type,
          requestId: request.requestId,
          data: { id: node.id, name: node.name }
        };
      }
      case "set_strokes": {
        const p = request.params || {};
        const nodeId = request.nodeIds && request.nodeIds[0];
        if (!nodeId) throw new Error("nodeId is required");
        const node = yield figma.getNodeByIdAsync(nodeId);
        if (!node) throw new Error(`Node not found: ${nodeId}`);
        if (!("strokes" in node)) throw new Error(`Node ${nodeId} does not support strokes`);
        node.strokes = [makeSolidPaint(p.color)];
        if (p.strokeWeight != null) node.strokeWeight = p.strokeWeight;
        figma.commitUndo();
        return {
          type: request.type,
          requestId: request.requestId,
          data: { id: node.id, name: node.name }
        };
      }
      case "move_nodes": {
        const p = request.params || {};
        const nodeIds = request.nodeIds || [];
        if (nodeIds.length === 0) throw new Error("nodeIds is required");
        const results = [];
        for (const nid of nodeIds) {
          const n = yield figma.getNodeByIdAsync(nid);
          if (!n) {
            results.push({ nodeId: nid, error: "Node not found" });
            continue;
          }
          if (!("x" in n)) {
            results.push({ nodeId: nid, error: "Node does not support position" });
            continue;
          }
          if (p.x != null) n.x = p.x;
          if (p.y != null) n.y = p.y;
          results.push({ nodeId: nid, x: n.x, y: n.y });
        }
        figma.commitUndo();
        return { type: request.type, requestId: request.requestId, data: { results } };
      }
      case "resize_nodes": {
        const p = request.params || {};
        const nodeIds = request.nodeIds || [];
        if (nodeIds.length === 0) throw new Error("nodeIds is required");
        const results = [];
        for (const nid of nodeIds) {
          const n = yield figma.getNodeByIdAsync(nid);
          if (!n) {
            results.push({ nodeId: nid, error: "Node not found" });
            continue;
          }
          if (!("resize" in n)) {
            results.push({ nodeId: nid, error: "Node does not support resize" });
            continue;
          }
          const w = p.width != null ? p.width : n.width;
          const h = p.height != null ? p.height : n.height;
          n.resize(w, h);
          results.push({ nodeId: nid, width: n.width, height: n.height });
        }
        figma.commitUndo();
        return { type: request.type, requestId: request.requestId, data: { results } };
      }
      case "delete_nodes": {
        const nodeIds = request.nodeIds || [];
        if (nodeIds.length === 0) throw new Error("nodeIds is required");
        const results = [];
        for (const nid of nodeIds) {
          const n = yield figma.getNodeByIdAsync(nid);
          if (!n) {
            results.push({ nodeId: nid, error: "Node not found" });
            continue;
          }
          n.remove();
          results.push({ nodeId: nid, deleted: true });
        }
        figma.commitUndo();
        return { type: request.type, requestId: request.requestId, data: { results } };
      }
      case "rename_node": {
        const p = request.params || {};
        const nodeId = request.nodeIds && request.nodeIds[0];
        if (!nodeId) throw new Error("nodeId is required");
        const node = yield figma.getNodeByIdAsync(nodeId);
        if (!node) throw new Error(`Node not found: ${nodeId}`);
        node.name = p.name;
        return {
          type: request.type,
          requestId: request.requestId,
          data: { id: node.id, name: node.name }
        };
      }
      case "clone_node": {
        const p = request.params || {};
        const nodeId = request.nodeIds && request.nodeIds[0];
        if (!nodeId) throw new Error("nodeId is required");
        const node = yield figma.getNodeByIdAsync(nodeId);
        if (!node) throw new Error(`Node not found: ${nodeId}`);
        const clone = node.clone();
        if (p.x != null) clone.x = p.x;
        if (p.y != null) clone.y = p.y;
        if (p.parentId) {
          const parent = yield getParentNode(p.parentId);
          parent.appendChild(clone);
        }
        figma.commitUndo();
        return {
          type: request.type,
          requestId: request.requestId,
          data: { id: clone.id, name: clone.name, type: clone.type, bounds: getBounds(clone) }
        };
      }
      case "import_image": {
        const p = request.params || {};
        if (!p.imageData) throw new Error("imageData (base64) is required");
        const parent = yield getParentNode(p.parentId);
        const bytes = base64ToBytes(p.imageData);
        const image = figma.createImage(bytes);
        const rect = figma.createRectangle();
        rect.resize(p.width || 200, p.height || 200);
        rect.x = p.x != null ? p.x : 0;
        rect.y = p.y != null ? p.y : 0;
        if (p.name) rect.name = p.name;
        rect.fills = [{ type: "IMAGE", imageHash: image.hash, scaleMode: p.scaleMode || "FILL" }];
        parent.appendChild(rect);
        figma.commitUndo();
        return {
          type: request.type,
          requestId: request.requestId,
          data: { id: rect.id, name: rect.name, type: rect.type, bounds: getBounds(rect) }
        };
      }
      case "set_auto_layout": {
        const p = request.params || {};
        const nodeId = request.nodeIds && request.nodeIds[0];
        if (!nodeId) throw new Error("nodeId is required");
        const node = yield figma.getNodeByIdAsync(nodeId);
        if (!node) throw new Error(`Node not found: ${nodeId}`);
        if (node.type !== "FRAME") throw new Error(`Node ${nodeId} is not a FRAME`);
        applyAutoLayout(node, p);
        figma.commitUndo();
        return {
          type: request.type,
          requestId: request.requestId,
          data: { id: node.id, name: node.name }
        };
      }
      // ── Variables ─────────────────────────────────────────────────────────
      case "create_variable_collection": {
        const p = request.params || {};
        if (!p.name) throw new Error("name is required");
        const collection = figma.variables.createVariableCollection(p.name);
        if (p.initialModeName && collection.modes.length > 0) {
          collection.renameMode(collection.modes[0].modeId, p.initialModeName);
        }
        figma.commitUndo();
        return {
          type: request.type,
          requestId: request.requestId,
          data: {
            id: collection.id,
            name: collection.name,
            modes: collection.modes.map((m) => ({ modeId: m.modeId, name: m.name }))
          }
        };
      }
      case "add_variable_mode": {
        const p = request.params || {};
        if (!p.collectionId) throw new Error("collectionId is required");
        if (!p.modeName) throw new Error("modeName is required");
        const collection = yield figma.variables.getVariableCollectionByIdAsync(p.collectionId);
        if (!collection) throw new Error(`Collection not found: ${p.collectionId}`);
        const modeId = collection.addMode(p.modeName);
        figma.commitUndo();
        return {
          type: request.type,
          requestId: request.requestId,
          data: { collectionId: p.collectionId, modeId, modeName: p.modeName }
        };
      }
      case "create_variable": {
        const p = request.params || {};
        if (!p.name) throw new Error("name is required");
        if (!p.collectionId) throw new Error("collectionId is required");
        const validTypes = ["COLOR", "FLOAT", "STRING", "BOOLEAN"];
        if (!p.type || !validTypes.includes(p.type)) {
          throw new Error("type is required: COLOR, FLOAT, STRING, or BOOLEAN");
        }
        const collection = yield figma.variables.getVariableCollectionByIdAsync(p.collectionId);
        if (!collection) throw new Error(`Collection not found: ${p.collectionId}`);
        const variable = figma.variables.createVariable(p.name, collection, p.type);
        if (p.value != null && collection.modes.length > 0) {
          const modeId = collection.modes[0].modeId;
          variable.setValueForMode(modeId, parseVariableValue(p.type, p.value));
        }
        figma.commitUndo();
        return {
          type: request.type,
          requestId: request.requestId,
          data: {
            id: variable.id,
            name: variable.name,
            resolvedType: variable.resolvedType,
            collectionId: p.collectionId
          }
        };
      }
      case "set_variable_value": {
        const p = request.params || {};
        if (!p.variableId) throw new Error("variableId is required");
        if (!p.modeId) throw new Error("modeId is required");
        if (p.value == null) throw new Error("value is required");
        const variable = yield figma.variables.getVariableByIdAsync(p.variableId);
        if (!variable) throw new Error(`Variable not found: ${p.variableId}`);
        variable.setValueForMode(p.modeId, parseVariableValue(variable.resolvedType, p.value));
        figma.commitUndo();
        return {
          type: request.type,
          requestId: request.requestId,
          data: { variableId: variable.id, name: variable.name, modeId: p.modeId }
        };
      }
      case "delete_variable": {
        const p = request.params || {};
        if (p.variableId) {
          const variable = yield figma.variables.getVariableByIdAsync(p.variableId);
          if (!variable) throw new Error(`Variable not found: ${p.variableId}`);
          variable.remove();
          figma.commitUndo();
          return {
            type: request.type,
            requestId: request.requestId,
            data: { variableId: p.variableId, deleted: true }
          };
        } else if (p.collectionId) {
          const collection = yield figma.variables.getVariableCollectionByIdAsync(p.collectionId);
          if (!collection) throw new Error(`Collection not found: ${p.collectionId}`);
          collection.remove();
          figma.commitUndo();
          return {
            type: request.type,
            requestId: request.requestId,
            data: { collectionId: p.collectionId, deleted: true }
          };
        } else {
          throw new Error("variableId or collectionId is required");
        }
      }
      // ── Styles ────────────────────────────────────────────────────────────
      case "create_paint_style": {
        const p = request.params || {};
        if (!p.name) throw new Error("name is required");
        if (!p.color) throw new Error("color is required");
        const style = figma.createPaintStyle();
        style.name = p.name;
        style.paints = [makeSolidPaint(p.color)];
        if (p.description) style.description = p.description;
        figma.commitUndo();
        return {
          type: request.type,
          requestId: request.requestId,
          data: { id: style.id, name: style.name }
        };
      }
      case "create_text_style": {
        const p = request.params || {};
        if (!p.name) throw new Error("name is required");
        const family = p.fontFamily || "Inter";
        const fontStyle = p.fontStyle || "Regular";
        yield figma.loadFontAsync({ family, style: fontStyle });
        const style = figma.createTextStyle();
        style.name = p.name;
        style.fontName = { family, style: fontStyle };
        if (p.fontSize != null) style.fontSize = p.fontSize;
        if (p.description) style.description = p.description;
        if (p.textDecoration && p.textDecoration !== "NONE") {
          style.textDecoration = p.textDecoration;
        }
        if (p.lineHeightValue != null) {
          style.lineHeight = { value: p.lineHeightValue, unit: p.lineHeightUnit || "PIXELS" };
        }
        if (p.letterSpacingValue != null) {
          style.letterSpacing = { value: p.letterSpacingValue, unit: p.letterSpacingUnit || "PIXELS" };
        }
        figma.commitUndo();
        return {
          type: request.type,
          requestId: request.requestId,
          data: { id: style.id, name: style.name }
        };
      }
      case "create_effect_style": {
        const p = request.params || {};
        if (!p.name) throw new Error("name is required");
        const effectType = p.type || "DROP_SHADOW";
        let effect;
        if (effectType === "LAYER_BLUR") {
          effect = { type: "LAYER_BLUR", blurType: "NORMAL", radius: (_a = p.radius) != null ? _a : 4, visible: true };
        } else if (effectType === "BACKGROUND_BLUR") {
          effect = { type: "BACKGROUND_BLUR", blurType: "NORMAL", radius: (_b = p.radius) != null ? _b : 4, visible: true };
        } else {
          const { r, g, b, a } = hexToRgb(p.color || "#000000");
          const alpha = p.opacity != null ? p.opacity : a !== 1 ? a : 0.25;
          effect = {
            type: effectType,
            color: { r, g, b, a: alpha },
            offset: { x: (_c = p.offsetX) != null ? _c : 0, y: (_d = p.offsetY) != null ? _d : 4 },
            radius: (_e = p.radius) != null ? _e : 8,
            spread: (_f = p.spread) != null ? _f : 0,
            visible: true,
            blendMode: "NORMAL"
          };
        }
        const style = figma.createEffectStyle();
        style.name = p.name;
        style.effects = [effect];
        if (p.description) style.description = p.description;
        figma.commitUndo();
        return {
          type: request.type,
          requestId: request.requestId,
          data: { id: style.id, name: style.name }
        };
      }
      case "create_grid_style": {
        const p = request.params || {};
        if (!p.name) throw new Error("name is required");
        const pattern = p.pattern || "GRID";
        let grid;
        if (pattern === "COLUMNS" || pattern === "ROWS") {
          grid = {
            pattern,
            count: (_g = p.count) != null ? _g : 12,
            gutterSize: (_h = p.gutterSize) != null ? _h : 16,
            offset: (_i = p.offset) != null ? _i : 0,
            alignment: p.alignment || "STRETCH",
            visible: true
          };
        } else {
          const { r, g, b, a } = hexToRgb(p.color || "#FF0000");
          grid = {
            pattern: "GRID",
            sectionSize: (_j = p.sectionSize) != null ? _j : 8,
            visible: true,
            color: { r, g, b, a: p.opacity != null ? p.opacity : a !== 1 ? a : 0.1 }
          };
        }
        const style = figma.createGridStyle();
        style.name = p.name;
        style.layoutGrids = [grid];
        if (p.description) style.description = p.description;
        figma.commitUndo();
        return {
          type: request.type,
          requestId: request.requestId,
          data: { id: style.id, name: style.name }
        };
      }
      case "update_paint_style": {
        const p = request.params || {};
        if (!p.styleId) throw new Error("styleId is required");
        const style = yield figma.getStyleByIdAsync(p.styleId);
        if (!style) throw new Error(`Style not found: ${p.styleId}`);
        if (style.type !== "PAINT") throw new Error(`Style ${p.styleId} is not a paint style`);
        if (p.name) style.name = p.name;
        if (p.color) style.paints = [makeSolidPaint(p.color)];
        if (p.description != null) style.description = p.description;
        figma.commitUndo();
        return {
          type: request.type,
          requestId: request.requestId,
          data: { id: style.id, name: style.name }
        };
      }
      case "delete_style": {
        const p = request.params || {};
        if (!p.styleId) throw new Error("styleId is required");
        const style = yield figma.getStyleByIdAsync(p.styleId);
        if (!style) throw new Error(`Style not found: ${p.styleId}`);
        style.remove();
        figma.commitUndo();
        return {
          type: request.type,
          requestId: request.requestId,
          data: { styleId: p.styleId, deleted: true }
        };
      }
      default:
        return null;
    }
  });
  const applyAutoLayout = (frame, p) => {
    if (p.layoutMode != null) frame.layoutMode = p.layoutMode;
    if (p.paddingTop != null) frame.paddingTop = p.paddingTop;
    if (p.paddingRight != null) frame.paddingRight = p.paddingRight;
    if (p.paddingBottom != null) frame.paddingBottom = p.paddingBottom;
    if (p.paddingLeft != null) frame.paddingLeft = p.paddingLeft;
    if (p.itemSpacing != null) frame.itemSpacing = p.itemSpacing;
    if (frame.layoutMode !== "NONE") {
      if (p.primaryAxisAlignItems) frame.primaryAxisAlignItems = p.primaryAxisAlignItems;
      if (p.counterAxisAlignItems) frame.counterAxisAlignItems = p.counterAxisAlignItems;
      if (p.primaryAxisSizingMode) frame.primaryAxisSizingMode = p.primaryAxisSizingMode;
      if (p.counterAxisSizingMode) frame.counterAxisSizingMode = p.counterAxisSizingMode;
      if (p.layoutWrap) frame.layoutWrap = p.layoutWrap;
      if (p.counterAxisSpacing != null && frame.layoutWrap === "WRAP") {
        frame.counterAxisSpacing = p.counterAxisSpacing;
      }
    }
  };
  const parseVariableValue = (type, value) => {
    if (type === "COLOR") {
      if (typeof value === "string") {
        const { r, g, b, a } = hexToRgb(value);
        return { r, g, b, a };
      }
      return value;
    }
    if (type === "FLOAT") return typeof value === "number" ? value : parseFloat(String(value));
    if (type === "BOOLEAN") return value === true || value === "true";
    return String(value);
  };
  const sendStatus = () => {
    figma.ui.postMessage({
      type: "plugin-status",
      payload: {
        fileName: figma.root.name,
        selectionCount: figma.currentPage.selection.length
      }
    });
  };
  const handleRequest = (request) => __async(null, null, function* () {
    var _a;
    try {
      const result = (_a = yield handleReadRequest(request)) != null ? _a : yield handleWriteRequest(request);
      if (result === null)
        throw new Error(`Unknown request type: ${request.type}`);
      return result;
    } catch (error) {
      return {
        type: request.type,
        requestId: request.requestId,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  });
  figma.showUI(__html__, { width: 320, height: 180 });
  sendStatus();
  figma.on("selectionchange", () => {
    sendStatus();
  });
  figma.ui.onmessage = (message) => __async(null, null, function* () {
    if (message.type === "ui-ready") {
      sendStatus();
      return;
    }
    if (message.type === "server-request") {
      const response = yield handleRequest(message.payload);
      try {
        figma.ui.postMessage(response);
      } catch (err) {
        figma.ui.postMessage({
          type: response.type,
          requestId: response.requestId,
          error: err instanceof Error ? err.message : String(err)
        });
      }
    }
  });
})();
