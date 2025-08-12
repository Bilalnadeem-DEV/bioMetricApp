/**
 * @format
 */

import 'react-native-gesture-handler';
import React from 'react';
import { AppRegistry, Text, TextInput } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Method 1: Set default props for Text components
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
Text.defaultProps.maxFontSizeMultiplier = 1;

// Method 2: Set default props for TextInput components
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
TextInput.defaultProps.maxFontSizeMultiplier = 1;

// Method 3: Override the original render methods (more aggressive approach)
const originalTextRender = Text.render;
const originalTextInputRender = TextInput.render;

// Override Text rendering
Text.render = function(props, ref) {
  const newProps = {
    ...props,
    allowFontScaling: false,
    maxFontSizeMultiplier: 1,
  };
  
  if (originalTextRender) {
    return originalTextRender.call(this, newProps, ref);
  }
  return Text.prototype.constructor.call(this, newProps);
};

// Override TextInput rendering
TextInput.render = function(props, ref) {
  const newProps = {
    ...props,
    allowFontScaling: false,
    maxFontSizeMultiplier: 1,
  };
  
  if (originalTextInputRender) {
    return originalTextInputRender.call(this, newProps, ref);
  }
  return TextInput.prototype.constructor.call(this, newProps);
};

// Method 4: Patch the createElement method for Text components
const originalCreateElement = React.createElement;
React.createElement = function(type, props, ...children) {
  if (type === Text || type === TextInput) {
    const newProps = {
      ...props,
      allowFontScaling: false,
      maxFontSizeMultiplier: 1,
    };
    return originalCreateElement.call(this, type, newProps, ...children);
  }
  return originalCreateElement.call(this, type, props, ...children);
};

AppRegistry.registerComponent(appName, () => App);
