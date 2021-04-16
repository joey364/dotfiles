'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function activate(context) {
    let tailwindDocsAddingBaseStyles = vscode.commands.registerCommand('extension.tailwindDocsAddingBaseStyles', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/adding-base-styles'));
    });
    context.subscriptions.push(tailwindDocsAddingBaseStyles);
    let tailwindDocsAddingNewUtilities = vscode.commands.registerCommand('extension.tailwindDocsAddingNewUtilities', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/adding-new-utilities'));
    });
    context.subscriptions.push(tailwindDocsAddingNewUtilities);
    let tailwindDocsAlignContent = vscode.commands.registerCommand('extension.tailwindDocsAlignContent', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/align-content'));
    });
    context.subscriptions.push(tailwindDocsAlignContent);
    let tailwindDocsAlignItems = vscode.commands.registerCommand('extension.tailwindDocsAlignItems', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/align-items'));
    });
    context.subscriptions.push(tailwindDocsAlignItems);
    let tailwindDocsAlignSelf = vscode.commands.registerCommand('extension.tailwindDocsAlignSelf', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/align-self'));
    });
    context.subscriptions.push(tailwindDocsAlignSelf);
    let tailwindDocsAnimation = vscode.commands.registerCommand('extension.tailwindDocsAnimation', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/animation'));
    });
    context.subscriptions.push(tailwindDocsAnimation);
    let tailwindDocsAppearance = vscode.commands.registerCommand('extension.tailwindDocsAppearance', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/appearance'));
    });
    context.subscriptions.push(tailwindDocsAppearance);
    let tailwindDocsBackgroundAttachment = vscode.commands.registerCommand('extension.tailwindDocsBackgroundAttachment', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/background-attachment'));
    });
    context.subscriptions.push(tailwindDocsBackgroundAttachment);
    let tailwindDocsBackgroundClip = vscode.commands.registerCommand('extension.tailwindDocsBackgroundClip', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/background-clip'));
    });
    context.subscriptions.push(tailwindDocsBackgroundClip);
    let tailwindDocsBackgroundColor = vscode.commands.registerCommand('extension.tailwindDocsBackgroundColor', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/background-color'));
    });
    context.subscriptions.push(tailwindDocsBackgroundColor);
    let tailwindDocsBackgroundImage = vscode.commands.registerCommand('extension.tailwindDocsBackgroundImage', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/background-image'));
    });
    context.subscriptions.push(tailwindDocsBackgroundImage);
    let tailwindDocsBackgroundOpacity = vscode.commands.registerCommand('extension.tailwindDocsBackgroundOpacity', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/background-opacity'));
    });
    context.subscriptions.push(tailwindDocsBackgroundOpacity);
    let tailwindDocsBackgroundPosition = vscode.commands.registerCommand('extension.tailwindDocsBackgroundPosition', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/background-position'));
    });
    context.subscriptions.push(tailwindDocsBackgroundPosition);
    let tailwindDocsBackgroundRepeat = vscode.commands.registerCommand('extension.tailwindDocsBackgroundRepeat', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/background-repeat'));
    });
    context.subscriptions.push(tailwindDocsBackgroundRepeat);
    let tailwindDocsBackgroundSize = vscode.commands.registerCommand('extension.tailwindDocsBackgroundSize', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/background-size'));
    });
    context.subscriptions.push(tailwindDocsBackgroundSize);
    let tailwindDocsBorderCollapse = vscode.commands.registerCommand('extension.tailwindDocsBorderCollapse', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/border-collapse'));
    });
    context.subscriptions.push(tailwindDocsBorderCollapse);
    let tailwindDocsBorderColor = vscode.commands.registerCommand('extension.tailwindDocsBorderColor', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/border-color'));
    });
    context.subscriptions.push(tailwindDocsBorderColor);
    let tailwindDocsBorderOpacity = vscode.commands.registerCommand('extension.tailwindDocsBorderOpacity', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/border-opacity'));
    });
    context.subscriptions.push(tailwindDocsBorderOpacity);
    let tailwindDocsBorderRadius = vscode.commands.registerCommand('extension.tailwindDocsBorderRadius', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/border-radius'));
    });
    context.subscriptions.push(tailwindDocsBorderRadius);
    let tailwindDocsBorderStyle = vscode.commands.registerCommand('extension.tailwindDocsBorderStyle', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/border-style'));
    });
    context.subscriptions.push(tailwindDocsBorderStyle);
    let tailwindDocsBorderWidth = vscode.commands.registerCommand('extension.tailwindDocsBorderWidth', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/border-width'));
    });
    context.subscriptions.push(tailwindDocsBorderWidth);
    let tailwindDocsBoxShadow = vscode.commands.registerCommand('extension.tailwindDocsBoxShadow', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/box-shadow'));
    });
    context.subscriptions.push(tailwindDocsBoxShadow);
    let tailwindDocsBoxSizing = vscode.commands.registerCommand('extension.tailwindDocsBoxSizing', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/box-sizing'));
    });
    context.subscriptions.push(tailwindDocsBoxSizing);
    let tailwindDocsBreakpoints = vscode.commands.registerCommand('extension.tailwindDocsBreakpoints', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/breakpoints'));
    });
    context.subscriptions.push(tailwindDocsBreakpoints);
    let tailwindDocsBrowserSupport = vscode.commands.registerCommand('extension.tailwindDocsBrowserSupport', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/browser-support'));
    });
    context.subscriptions.push(tailwindDocsBrowserSupport);
    let tailwindDocsClear = vscode.commands.registerCommand('extension.tailwindDocsClear', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/clear'));
    });
    context.subscriptions.push(tailwindDocsClear);
    let tailwindDocsConfiguration = vscode.commands.registerCommand('extension.tailwindDocsConfiguration', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/configuration'));
    });
    context.subscriptions.push(tailwindDocsConfiguration);
    let tailwindDocsConfiguringVariants = vscode.commands.registerCommand('extension.tailwindDocsConfiguringVariants', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/configuring-variants'));
    });
    context.subscriptions.push(tailwindDocsConfiguringVariants);
    let tailwindDocsContainer = vscode.commands.registerCommand('extension.tailwindDocsContainer', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/container'));
    });
    context.subscriptions.push(tailwindDocsContainer);
    let tailwindDocsControllingFileSize = vscode.commands.registerCommand('extension.tailwindDocsControllingFileSize', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/controlling-file-size'));
    });
    context.subscriptions.push(tailwindDocsControllingFileSize);
    let tailwindDocsCursor = vscode.commands.registerCommand('extension.tailwindDocsCursor', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/cursor'));
    });
    context.subscriptions.push(tailwindDocsCursor);
    let tailwindDocsCustomizingColors = vscode.commands.registerCommand('extension.tailwindDocsCustomizingColors', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/customizing-colors'));
    });
    context.subscriptions.push(tailwindDocsCustomizingColors);
    let tailwindDocsCustomizingSpacing = vscode.commands.registerCommand('extension.tailwindDocsCustomizingSpacing', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/customizing-spacing'));
    });
    context.subscriptions.push(tailwindDocsCustomizingSpacing);
    let tailwindDocsDisplay = vscode.commands.registerCommand('extension.tailwindDocsDisplay', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/display'));
    });
    context.subscriptions.push(tailwindDocsDisplay);
    let tailwindDocsDivideColor = vscode.commands.registerCommand('extension.tailwindDocsDivideColor', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/divide-color'));
    });
    context.subscriptions.push(tailwindDocsDivideColor);
    let tailwindDocsDivideOpacity = vscode.commands.registerCommand('extension.tailwindDocsDivideOpacity', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/divide-opacity'));
    });
    context.subscriptions.push(tailwindDocsDivideOpacity);
    let tailwindDocsDivideStyle = vscode.commands.registerCommand('extension.tailwindDocsDivideStyle', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/divide-style'));
    });
    context.subscriptions.push(tailwindDocsDivideStyle);
    let tailwindDocsDivideWidth = vscode.commands.registerCommand('extension.tailwindDocsDivideWidth', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/divide-width'));
    });
    context.subscriptions.push(tailwindDocsDivideWidth);
    let tailwindDocsExtractingComponents = vscode.commands.registerCommand('extension.tailwindDocsExtractingComponents', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/extracting-components'));
    });
    context.subscriptions.push(tailwindDocsExtractingComponents);
    let tailwindDocsFill = vscode.commands.registerCommand('extension.tailwindDocsFill', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/fill'));
    });
    context.subscriptions.push(tailwindDocsFill);
    let tailwindDocsFlex = vscode.commands.registerCommand('extension.tailwindDocsFlex', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/flex'));
    });
    context.subscriptions.push(tailwindDocsFlex);
    let tailwindDocsFlexDirection = vscode.commands.registerCommand('extension.tailwindDocsFlexDirection', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/flex-direction'));
    });
    context.subscriptions.push(tailwindDocsFlexDirection);
    let tailwindDocsFlexGrow = vscode.commands.registerCommand('extension.tailwindDocsFlexGrow', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/flex-grow'));
    });
    context.subscriptions.push(tailwindDocsFlexGrow);
    let tailwindDocsFlexShrink = vscode.commands.registerCommand('extension.tailwindDocsFlexShrink', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/flex-shrink'));
    });
    context.subscriptions.push(tailwindDocsFlexShrink);
    let tailwindDocsFlexWrap = vscode.commands.registerCommand('extension.tailwindDocsFlexWrap', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/flex-wrap'));
    });
    context.subscriptions.push(tailwindDocsFlexWrap);
    let tailwindDocsFloat = vscode.commands.registerCommand('extension.tailwindDocsFloat', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/float'));
    });
    context.subscriptions.push(tailwindDocsFloat);
    let tailwindDocsFontFamily = vscode.commands.registerCommand('extension.tailwindDocsFontFamily', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/font-family'));
    });
    context.subscriptions.push(tailwindDocsFontFamily);
    let tailwindDocsFontSize = vscode.commands.registerCommand('extension.tailwindDocsFontSize', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/font-size'));
    });
    context.subscriptions.push(tailwindDocsFontSize);
    let tailwindDocsFontSmoothing = vscode.commands.registerCommand('extension.tailwindDocsFontSmoothing', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/font-smoothing'));
    });
    context.subscriptions.push(tailwindDocsFontSmoothing);
    let tailwindDocsFontStyle = vscode.commands.registerCommand('extension.tailwindDocsFontStyle', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/font-style'));
    });
    context.subscriptions.push(tailwindDocsFontStyle);
    let tailwindDocsFontVariantNumeric = vscode.commands.registerCommand('extension.tailwindDocsFontVariantNumeric', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/font-variant-numeric'));
    });
    context.subscriptions.push(tailwindDocsFontVariantNumeric);
    let tailwindDocsFontWeight = vscode.commands.registerCommand('extension.tailwindDocsFontWeight', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/font-weight'));
    });
    context.subscriptions.push(tailwindDocsFontWeight);
    let tailwindDocsFunctionsAndDirectives = vscode.commands.registerCommand('extension.tailwindDocsFunctionsAndDirectives', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/functions-and-directives'));
    });
    context.subscriptions.push(tailwindDocsFunctionsAndDirectives);
    let tailwindDocsGap = vscode.commands.registerCommand('extension.tailwindDocsGap', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/gap'));
    });
    context.subscriptions.push(tailwindDocsGap);
    let tailwindDocsGradientColorStops = vscode.commands.registerCommand('extension.tailwindDocsGradientColorStops', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/gradient-color-stops'));
    });
    context.subscriptions.push(tailwindDocsGradientColorStops);
    let tailwindDocsGridAutoFlow = vscode.commands.registerCommand('extension.tailwindDocsGridAutoFlow', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/grid-auto-flow'));
    });
    context.subscriptions.push(tailwindDocsGridAutoFlow);
    let tailwindDocsGridColumn = vscode.commands.registerCommand('extension.tailwindDocsGridColumn', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/grid-column'));
    });
    context.subscriptions.push(tailwindDocsGridColumn);
    let tailwindDocsGridRow = vscode.commands.registerCommand('extension.tailwindDocsGridRow', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/grid-row'));
    });
    context.subscriptions.push(tailwindDocsGridRow);
    let tailwindDocsGridTemplateColumns = vscode.commands.registerCommand('extension.tailwindDocsGridTemplateColumns', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/grid-template-columns'));
    });
    context.subscriptions.push(tailwindDocsGridTemplateColumns);
    let tailwindDocsGridTemplateRows = vscode.commands.registerCommand('extension.tailwindDocsGridTemplateRows', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/grid-template-rows'));
    });
    context.subscriptions.push(tailwindDocsGridTemplateRows);
    let tailwindDocsHeight = vscode.commands.registerCommand('extension.tailwindDocsHeight', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/height'));
    });
    context.subscriptions.push(tailwindDocsHeight);
    let tailwindDocsInstallation = vscode.commands.registerCommand('extension.tailwindDocsInstallation', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/installation'));
    });
    context.subscriptions.push(tailwindDocsInstallation);
    let tailwindDocsIntellisense = vscode.commands.registerCommand('extension.tailwindDocsIntellisense', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/intellisense'));
    });
    context.subscriptions.push(tailwindDocsIntellisense);
    let tailwindDocsJustifyContent = vscode.commands.registerCommand('extension.tailwindDocsJustifyContent', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/justify-content'));
    });
    context.subscriptions.push(tailwindDocsJustifyContent);
    let tailwindDocsJustifyItems = vscode.commands.registerCommand('extension.tailwindDocsJustifyItems', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/justify-items'));
    });
    context.subscriptions.push(tailwindDocsJustifyItems);
    let tailwindDocsJustifySelf = vscode.commands.registerCommand('extension.tailwindDocsJustifySelf', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/justify-self'));
    });
    context.subscriptions.push(tailwindDocsJustifySelf);
    let tailwindDocsLetterSpacing = vscode.commands.registerCommand('extension.tailwindDocsLetterSpacing', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/letter-spacing'));
    });
    context.subscriptions.push(tailwindDocsLetterSpacing);
    let tailwindDocsLineHeight = vscode.commands.registerCommand('extension.tailwindDocsLineHeight', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/line-height'));
    });
    context.subscriptions.push(tailwindDocsLineHeight);
    let tailwindDocsListStylePosition = vscode.commands.registerCommand('extension.tailwindDocsListStylePosition', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/list-style-position'));
    });
    context.subscriptions.push(tailwindDocsListStylePosition);
    let tailwindDocsListStyleType = vscode.commands.registerCommand('extension.tailwindDocsListStyleType', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/list-style-type'));
    });
    context.subscriptions.push(tailwindDocsListStyleType);
    let tailwindDocsMargin = vscode.commands.registerCommand('extension.tailwindDocsMargin', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/margin'));
    });
    context.subscriptions.push(tailwindDocsMargin);
    let tailwindDocsMaxHeight = vscode.commands.registerCommand('extension.tailwindDocsMaxHeight', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/max-height'));
    });
    context.subscriptions.push(tailwindDocsMaxHeight);
    let tailwindDocsMaxWidth = vscode.commands.registerCommand('extension.tailwindDocsMaxWidth', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/max-width'));
    });
    context.subscriptions.push(tailwindDocsMaxWidth);
    let tailwindDocsMinHeight = vscode.commands.registerCommand('extension.tailwindDocsMinHeight', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/min-height'));
    });
    context.subscriptions.push(tailwindDocsMinHeight);
    let tailwindDocsMinWidth = vscode.commands.registerCommand('extension.tailwindDocsMinWidth', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/min-width'));
    });
    context.subscriptions.push(tailwindDocsMinWidth);
    let tailwindDocsObjectFit = vscode.commands.registerCommand('extension.tailwindDocsObjectFit', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/object-fit'));
    });
    context.subscriptions.push(tailwindDocsObjectFit);
    let tailwindDocsObjectPosition = vscode.commands.registerCommand('extension.tailwindDocsObjectPosition', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/object-position'));
    });
    context.subscriptions.push(tailwindDocsObjectPosition);
    let tailwindDocsOpacity = vscode.commands.registerCommand('extension.tailwindDocsOpacity', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/opacity'));
    });
    context.subscriptions.push(tailwindDocsOpacity);
    let tailwindDocsOrder = vscode.commands.registerCommand('extension.tailwindDocsOrder', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/order'));
    });
    context.subscriptions.push(tailwindDocsOrder);
    let tailwindDocsOutline = vscode.commands.registerCommand('extension.tailwindDocsOutline', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/outline'));
    });
    context.subscriptions.push(tailwindDocsOutline);
    let tailwindDocsOverflow = vscode.commands.registerCommand('extension.tailwindDocsOverflow', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/overflow'));
    });
    context.subscriptions.push(tailwindDocsOverflow);
    let tailwindDocsOverscrollBehavior = vscode.commands.registerCommand('extension.tailwindDocsOverscrollBehavior', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/overscroll-behavior'));
    });
    context.subscriptions.push(tailwindDocsOverscrollBehavior);
    let tailwindDocsPadding = vscode.commands.registerCommand('extension.tailwindDocsPadding', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/padding'));
    });
    context.subscriptions.push(tailwindDocsPadding);
    let tailwindDocsPlaceContent = vscode.commands.registerCommand('extension.tailwindDocsPlaceContent', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/place-content'));
    });
    context.subscriptions.push(tailwindDocsPlaceContent);
    let tailwindDocsPlaceItems = vscode.commands.registerCommand('extension.tailwindDocsPlaceItems', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/place-items'));
    });
    context.subscriptions.push(tailwindDocsPlaceItems);
    let tailwindDocsPlaceSelf = vscode.commands.registerCommand('extension.tailwindDocsPlaceSelf', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/place-self'));
    });
    context.subscriptions.push(tailwindDocsPlaceSelf);
    let tailwindDocsPlaceholderColor = vscode.commands.registerCommand('extension.tailwindDocsPlaceholderColor', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/placeholder-color'));
    });
    context.subscriptions.push(tailwindDocsPlaceholderColor);
    let tailwindDocsPlaceholderOpacity = vscode.commands.registerCommand('extension.tailwindDocsPlaceholderOpacity', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/placeholder-opacity'));
    });
    context.subscriptions.push(tailwindDocsPlaceholderOpacity);
    let tailwindDocsPlugins = vscode.commands.registerCommand('extension.tailwindDocsPlugins', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/plugins'));
    });
    context.subscriptions.push(tailwindDocsPlugins);
    let tailwindDocsPointerEvents = vscode.commands.registerCommand('extension.tailwindDocsPointerEvents', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/pointer-events'));
    });
    context.subscriptions.push(tailwindDocsPointerEvents);
    let tailwindDocsPosition = vscode.commands.registerCommand('extension.tailwindDocsPosition', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/position'));
    });
    context.subscriptions.push(tailwindDocsPosition);
    let tailwindDocsPreflight = vscode.commands.registerCommand('extension.tailwindDocsPreflight', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/preflight'));
    });
    context.subscriptions.push(tailwindDocsPreflight);
    let tailwindDocsPseudoClassVariants = vscode.commands.registerCommand('extension.tailwindDocsPseudoClassVariants', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/pseudo-class-variants'));
    });
    context.subscriptions.push(tailwindDocsPseudoClassVariants);
    let tailwindDocsReleaseNotes = vscode.commands.registerCommand('extension.tailwindDocsReleaseNotes', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/release-notes'));
    });
    context.subscriptions.push(tailwindDocsReleaseNotes);
    let tailwindDocsResize = vscode.commands.registerCommand('extension.tailwindDocsResize', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/resize'));
    });
    context.subscriptions.push(tailwindDocsResize);
    let tailwindDocsResponsiveDesign = vscode.commands.registerCommand('extension.tailwindDocsResponsiveDesign', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/responsive-design'));
    });
    context.subscriptions.push(tailwindDocsResponsiveDesign);
    let tailwindDocsRotate = vscode.commands.registerCommand('extension.tailwindDocsRotate', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/rotate'));
    });
    context.subscriptions.push(tailwindDocsRotate);
    let tailwindDocsScale = vscode.commands.registerCommand('extension.tailwindDocsScale', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/scale'));
    });
    context.subscriptions.push(tailwindDocsScale);
    let tailwindDocsScreenReaders = vscode.commands.registerCommand('extension.tailwindDocsScreenReaders', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/screen-readers'));
    });
    context.subscriptions.push(tailwindDocsScreenReaders);
    let tailwindDocsSkew = vscode.commands.registerCommand('extension.tailwindDocsSkew', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/skew'));
    });
    context.subscriptions.push(tailwindDocsSkew);
    let tailwindDocsSpace = vscode.commands.registerCommand('extension.tailwindDocsSpace', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/space'));
    });
    context.subscriptions.push(tailwindDocsSpace);
    let tailwindDocsStroke = vscode.commands.registerCommand('extension.tailwindDocsStroke', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/stroke'));
    });
    context.subscriptions.push(tailwindDocsStroke);
    let tailwindDocsStrokeWidth = vscode.commands.registerCommand('extension.tailwindDocsStrokeWidth', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/stroke-width'));
    });
    context.subscriptions.push(tailwindDocsStrokeWidth);
    let tailwindDocsTableLayout = vscode.commands.registerCommand('extension.tailwindDocsTableLayout', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/table-layout'));
    });
    context.subscriptions.push(tailwindDocsTableLayout);
    let tailwindDocsTextAlign = vscode.commands.registerCommand('extension.tailwindDocsTextAlign', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/text-align'));
    });
    context.subscriptions.push(tailwindDocsTextAlign);
    let tailwindDocsTextColor = vscode.commands.registerCommand('extension.tailwindDocsTextColor', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/text-color'));
    });
    context.subscriptions.push(tailwindDocsTextColor);
    let tailwindDocsTextDecoration = vscode.commands.registerCommand('extension.tailwindDocsTextDecoration', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/text-decoration'));
    });
    context.subscriptions.push(tailwindDocsTextDecoration);
    let tailwindDocsTextOpacity = vscode.commands.registerCommand('extension.tailwindDocsTextOpacity', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/text-opacity'));
    });
    context.subscriptions.push(tailwindDocsTextOpacity);
    let tailwindDocsTextTransform = vscode.commands.registerCommand('extension.tailwindDocsTextTransform', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/text-transform'));
    });
    context.subscriptions.push(tailwindDocsTextTransform);
    let tailwindDocsTheme = vscode.commands.registerCommand('extension.tailwindDocsTheme', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/theme'));
    });
    context.subscriptions.push(tailwindDocsTheme);
    let tailwindDocsTopRightBottomLeft = vscode.commands.registerCommand('extension.tailwindDocsTopRightBottomLeft', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/top-right-bottom-left'));
    });
    context.subscriptions.push(tailwindDocsTopRightBottomLeft);
    let tailwindDocsTransformOrigin = vscode.commands.registerCommand('extension.tailwindDocsTransformOrigin', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/transform-origin'));
    });
    context.subscriptions.push(tailwindDocsTransformOrigin);
    let tailwindDocsTransitionDelay = vscode.commands.registerCommand('extension.tailwindDocsTransitionDelay', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/transition-delay'));
    });
    context.subscriptions.push(tailwindDocsTransitionDelay);
    let tailwindDocsTransitionDuration = vscode.commands.registerCommand('extension.tailwindDocsTransitionDuration', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/transition-duration'));
    });
    context.subscriptions.push(tailwindDocsTransitionDuration);
    let tailwindDocsTransitionProperty = vscode.commands.registerCommand('extension.tailwindDocsTransitionProperty', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/transition-property'));
    });
    context.subscriptions.push(tailwindDocsTransitionProperty);
    let tailwindDocsTransitionTimingFunction = vscode.commands.registerCommand('extension.tailwindDocsTransitionTimingFunction', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/transition-timing-function'));
    });
    context.subscriptions.push(tailwindDocsTransitionTimingFunction);
    let tailwindDocsTranslate = vscode.commands.registerCommand('extension.tailwindDocsTranslate', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/translate'));
    });
    context.subscriptions.push(tailwindDocsTranslate);
    let tailwindDocsTypographyPlugin = vscode.commands.registerCommand('extension.tailwindDocsTypographyPlugin', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/typography-plugin'));
    });
    context.subscriptions.push(tailwindDocsTypographyPlugin);
    let tailwindDocsUpcomingChanges = vscode.commands.registerCommand('extension.tailwindDocsUpcomingChanges', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/upcoming-changes'));
    });
    context.subscriptions.push(tailwindDocsUpcomingChanges);
    let tailwindDocsUpgradingToV1 = vscode.commands.registerCommand('extension.tailwindDocsUpgradingToV1', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/upgrading-to-v1'));
    });
    context.subscriptions.push(tailwindDocsUpgradingToV1);
    let tailwindDocsUserSelect = vscode.commands.registerCommand('extension.tailwindDocsUserSelect', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/user-select'));
    });
    context.subscriptions.push(tailwindDocsUserSelect);
    let tailwindDocsUsingWithPreprocessors = vscode.commands.registerCommand('extension.tailwindDocsUsingWithPreprocessors', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/using-with-preprocessors'));
    });
    context.subscriptions.push(tailwindDocsUsingWithPreprocessors);
    let tailwindDocsUtilityFirst = vscode.commands.registerCommand('extension.tailwindDocsUtilityFirst', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/utility-first'));
    });
    context.subscriptions.push(tailwindDocsUtilityFirst);
    let tailwindDocsVerticalAlign = vscode.commands.registerCommand('extension.tailwindDocsVerticalAlign', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/vertical-align'));
    });
    context.subscriptions.push(tailwindDocsVerticalAlign);
    let tailwindDocsVisibility = vscode.commands.registerCommand('extension.tailwindDocsVisibility', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/visibility'));
    });
    context.subscriptions.push(tailwindDocsVisibility);
    let tailwindDocsWhitespace = vscode.commands.registerCommand('extension.tailwindDocsWhitespace', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/whitespace'));
    });
    context.subscriptions.push(tailwindDocsWhitespace);
    let tailwindDocsWidth = vscode.commands.registerCommand('extension.tailwindDocsWidth', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/width'));
    });
    context.subscriptions.push(tailwindDocsWidth);
    let tailwindDocsWordBreak = vscode.commands.registerCommand('extension.tailwindDocsWordBreak', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/word-break'));
    });
    context.subscriptions.push(tailwindDocsWordBreak);
    let tailwindDocsZIndex = vscode.commands.registerCommand('extension.tailwindDocsZIndex', () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://tailwindcss.com/docs/z-index'));
    });
    context.subscriptions.push(tailwindDocsZIndex);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map