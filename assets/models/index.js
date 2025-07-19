// This file helps React Native bundle the ONNX model
// Reference the model file so it gets included in the bundle
export const MODEL_PATH = './best.onnx';

// For React Native to recognize and bundle the model
// We need to reference it explicitly
require('./best.onnx'); 