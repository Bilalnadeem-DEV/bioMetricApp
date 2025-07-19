import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ColorPalettes } from '../theme/helpers/colorPalettes';
import { InferenceSession, Tensor } from "onnxruntime-react-native";
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-picker';

type LocalModelPOCNavigationProp = StackNavigationProp<RootStackParamList, 'LocalModelPOC'>;

interface LocalModelPOCProps {
  navigation: LocalModelPOCNavigationProp;
}

interface DetectionResult {
  masks: number[][][];
  boxes: number[][];
  scores: number[];
  classes: number[];
}

const LocalModelPOC: React.FC<LocalModelPOCProps> = ({ navigation }) => {
  const [modelSession, setModelSession] = useState<InferenceSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [inferenceResult, setInferenceResult] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [detectionResults, setDetectionResults] = useState<DetectionResult | null>(null);

  useEffect(() => {
    // Optional: Load model automatically on screen mount
    // loadModel();
  }, []);

    const loadModel = async () => {
    setIsLoading(true);
    setInferenceResult('');
    
    try {
      // Create a temporary file in the documents directory
      const documentsPath = `${RNFS.DocumentDirectoryPath}/best.onnx`;
      
      console.log('Target path:', documentsPath);
      
      // Try different approaches to get the model file
      let modelCopied = false;
      
      // Approach 1: Try using the bundled asset via Metro
      try {
        // Since Metro config includes 'onnx' in assetExts, try direct bundled access
        const bundleAsset = require('../../assets/models/best.onnx');
        console.log('Bundle asset:', bundleAsset);
        
        if (typeof bundleAsset === 'string' || (bundleAsset && bundleAsset.uri)) {
          const assetUri = typeof bundleAsset === 'string' ? bundleAsset : bundleAsset.uri;
          console.log('Asset URI:', assetUri);
          
          // Copy from the resolved URI
          await RNFS.copyFile(assetUri, documentsPath);
          modelCopied = true;
          console.log('Model copied using bundled asset approach');
        }
      } catch (bundleError) {
        console.log('Bundle asset approach failed:', bundleError);
      }
      
      // Approach 2: Try platform-specific paths if bundle approach failed
      if (!modelCopied) {
        if (Platform.OS === 'ios') {
          // For iOS, try multiple possible paths
          const possiblePaths = [
            `${RNFS.MainBundlePath}/assets/models/best.onnx`,
            `${RNFS.MainBundlePath}/best.onnx`,
            `${RNFS.MainBundlePath}/assets/best.onnx`,
            `${RNFS.MainBundlePath}/assets.bundle/assets/models/best.onnx`,
            `${RNFS.MainBundlePath}/assets.bundle/models/best.onnx`
          ];
          
          // Find the first path that exists
          let foundPath = null;
          for (const path of possiblePaths) {
            const exists = await RNFS.exists(path);
            console.log(`Checking iOS path: ${path} - exists: ${exists}`);
            if (exists) {
              foundPath = path;
              break;
            }
          }
          
          if (foundPath) {
            await RNFS.copyFile(foundPath, documentsPath);
            modelCopied = true;
            console.log('Model copied using iOS bundle path approach');
          }
        } else {
          // For Android, copy from assets
          try {
            await RNFS.copyFileAssets('assets/models/best.onnx', documentsPath);
            modelCopied = true;
            console.log('Model copied using Android assets approach');
          } catch (androidError) {
            console.log('Android assets approach failed:', androidError);
          }
        }
      }
      
      // Approach 3: Final fallback - check if model already exists in documents
      if (!modelCopied) {
        const modelExists = await RNFS.exists(documentsPath);
        if (modelExists) {
          console.log('Model already exists in documents directory');
          modelCopied = true;
        }
      }
      
      if (!modelCopied) {
        throw new Error('Could not locate or copy the model file. Please ensure best.onnx is properly bundled with the app.');
      }
      
      console.log('Model ready at:', documentsPath);

      // Load the model from the documents directory
      console.log('Loading fingerprint segmentation model from:', documentsPath);
      const session = await InferenceSession.create(documentsPath);
      
      // Log model information
      console.log('Model loaded successfully');
      console.log('Input names:', session.inputNames);
      console.log('Output names:', session.outputNames);
      
      // Update state
      setModelSession(session);
      setModelLoaded(true);
      setInferenceResult('Fingerprint Segmentation Model loaded successfully!\nReady to process fingerprint images.');
      
    } catch (error) {
      console.error('Failed to load model:', error);
      Alert.alert(
        'Model Loading Error', 
        `Failed to load fingerprint segmentation model: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      setInferenceResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const selectImage = () => {
    const options = {
      mediaType: 'photo' as const,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0].uri!);
        setDetectionResults(null);
        setInferenceResult('Image selected. Ready for fingerprint segmentation.');
      }
    });
  };

  const preprocessImage = async (imageUri: string): Promise<Float32Array> => {
    // This is a simplified preprocessing - in a real implementation,
    // you'd need to properly resize and normalize the image
    
    // YOLO expects input shape: [1, 3, 512, 512]
    // Values should be normalized to [0, 1] range
    const inputShape = [1, 3, 512, 512];
    const inputSize = inputShape.reduce((a, b) => a * b, 1);
    const inputData = new Float32Array(inputSize);
    
    // TODO: Implement proper image preprocessing
    // 1. Load image from URI
    // 2. Resize to 512x512
    // 3. Convert to RGB if needed
    // 4. Normalize pixels to [0, 1] range (divide by 255)
    // 5. Arrange in CHW format (Channel, Height, Width)
    
    // For now, using dummy data - replace with actual image processing
    for (let i = 0; i < inputSize; i++) {
      inputData[i] = Math.random(); // Replace with actual pixel values / 255.0
    }
    
    return inputData;
  };

  const runFingerprintSegmentation = async () => {
    if (!modelSession) {
      Alert.alert('Error', 'Model not loaded. Please load the model first.');
      return;
    }

    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image first.');
      return;
    }

    setIsLoading(true);
    setInferenceResult('Processing fingerprint image...');

    try {
      // Preprocess the selected image
      const inputData = await preprocessImage(selectedImage);
      
      // Create input tensor for YOLO model (batch_size=1, channels=3, height=512, width=512)
      const inputShape = [1, 3, 512, 512];
      const inputTensor = new Tensor('float32', inputData, inputShape);
      
      // Prepare input object (YOLO models typically use 'images' as input name)
      const inputs: Record<string, Tensor> = {};
      if (modelSession.inputNames.length > 0) {
        inputs[modelSession.inputNames[0]] = inputTensor;
      }

      console.log('Running fingerprint segmentation...');
      console.log('Input shape:', inputShape);
      console.log('Model inputs:', modelSession.inputNames);
      console.log('Model outputs:', modelSession.outputNames);
      
      // Run inference
      const outputs = await modelSession.run(inputs);
      
      console.log('Segmentation completed. Processing results...');
      
      // Process YOLO segmentation outputs
      const results = processYOLOSegmentationOutputs(outputs);
      setDetectionResults(results);
      
      let resultText = `Fingerprint Segmentation Results:\n`;
      resultText += `Found ${results.masks.length} fingerprint(s)\n\n`;
      
      results.masks.forEach((mask, idx) => {
        resultText += `Fingerprint ${idx + 1}:\n`;
        resultText += `  - Confidence: ${(results.scores[idx] * 100).toFixed(1)}%\n`;
        resultText += `  - Mask size: ${mask.length}x${mask[0]?.length || 0}\n`;
        if (results.boxes[idx]) {
          const [x1, y1, x2, y2] = results.boxes[idx];
          resultText += `  - Bounding box: (${x1.toFixed(0)}, ${y1.toFixed(0)}) to (${x2.toFixed(0)}, ${y2.toFixed(0)})\n`;
        }
        resultText += `\n`;
      });
      
      if (results.masks.length === 0) {
        resultText += 'No fingerprints detected in the image.\nTry adjusting the image or confidence threshold.';
      }
      
      setInferenceResult(resultText);
      
    } catch (error) {
      console.error('Segmentation failed:', error);
      Alert.alert(
        'Segmentation Error', 
        `Failed to process fingerprint: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      setInferenceResult(`Segmentation Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const processYOLOSegmentationOutputs = (outputs: Record<string, Tensor>): DetectionResult => {
    // YOLO segmentation models typically output:
    // - Boxes: [batch, num_boxes, 4] (x1, y1, x2, y2)
    // - Scores: [batch, num_boxes]
    // - Classes: [batch, num_boxes]
    // - Masks: [batch, num_masks, mask_height, mask_width]
    
    const result: DetectionResult = {
      masks: [],
      boxes: [],
      scores: [],
      classes: []
    };

    try {
      // Extract outputs based on common YOLO output names
      const outputKeys = Object.keys(outputs);
      console.log('Available outputs:', outputKeys);

      // Process each output tensor
      outputKeys.forEach(key => {
        const tensor = outputs[key];
        console.log(`${key}: shape [${tensor.dims.join(', ')}]`);
        
        // This is a simplified processing - actual YOLO output processing
        // would depend on the specific model architecture and output format
        if (key.includes('mask') || key.includes('proto')) {
          // Process mask data
          const maskData = Array.from(tensor.data as Float32Array);
          const [batch, channels, height, width] = tensor.dims;
          
          // Convert flat array to 3D mask array
          for (let c = 0; c < channels; c++) {
            const mask: number[][] = [];
            for (let h = 0; h < height; h++) {
              const row: number[] = [];
              for (let w = 0; w < width; w++) {
                const idx = c * height * width + h * width + w;
                row.push(maskData[idx] || 0);
              }
              mask.push(row);
            }
            result.masks.push(mask);
          }
        }
      });

      // Apply confidence threshold (similar to your Python code conf=0.5)
      const confidenceThreshold = 0.5;
      
      // Filter results by confidence
      const filteredIndices: number[] = [];
      result.scores.forEach((score, idx) => {
        if (score >= confidenceThreshold) {
          filteredIndices.push(idx);
        }
      });

      // Keep only high-confidence detections
      result.masks = result.masks.filter((_, idx) => filteredIndices.includes(idx));
      result.boxes = result.boxes.filter((_, idx) => filteredIndices.includes(idx));
      result.scores = result.scores.filter((_, idx) => filteredIndices.includes(idx));
      result.classes = result.classes.filter((_, idx) => filteredIndices.includes(idx));

    } catch (error) {
      console.error('Error processing YOLO outputs:', error);
    }

    return result;
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ColorPalettes.backgrounds.primary} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} bounces={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Fingerprint Segmentation</Text>
          <Text style={styles.description}>
            YOLO-based fingerprint detection and segmentation
          </Text>

          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Model Status:</Text>
            <Text style={[
              styles.statusText, 
              { color: modelLoaded ? '#4CAF50' : ColorPalettes.text.secondary }
            ]}>
              {modelLoaded ? 'Loaded' : 'Not Loaded'}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]} 
              onPress={loadModel}
              disabled={isLoading}
            >
              {isLoading && !modelLoaded ? (
                <ActivityIndicator color={ColorPalettes.text.light} />
              ) : (
                <Text style={styles.buttonText}>Load Segmentation Model</Text>
              )}
            </TouchableOpacity>



            <TouchableOpacity 
              style={[
                styles.button, 
                styles.selectButton,
                isLoading && styles.buttonDisabled
              ]} 
              onPress={selectImage}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Select Fingerprint Image</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.button, 
                styles.inferenceButton,
                (!modelLoaded || !selectedImage || isLoading) && styles.buttonDisabled
              ]} 
              onPress={runFingerprintSegmentation}
              disabled={!modelLoaded || !selectedImage || isLoading}
            >
              {isLoading && modelLoaded ? (
                <ActivityIndicator color={ColorPalettes.text.light} />
              ) : (
                <Text style={styles.buttonText}>Segment Fingerprints</Text>
              )}
            </TouchableOpacity>
          </View>

          {selectedImage && (
            <View style={styles.imageContainer}>
              <Text style={styles.imageLabel}>Selected Image:</Text>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            </View>
          )}

          {inferenceResult ? (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Results:</Text>
              <ScrollView style={styles.resultScroll}>
                <Text style={styles.resultText}>{inferenceResult}</Text>
              </ScrollView>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPalettes.backgrounds.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ColorPalettes.text.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: '300',
    color: ColorPalettes.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorPalettes.text.primary,
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#1E2772',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  selectButton: {
    backgroundColor: '#FF9800',
  },
  inferenceButton: {
    backgroundColor: ColorPalettes.interactive.primary,
  },
  buttonDisabled: {
    backgroundColor: ColorPalettes.text.secondary,
    opacity: 0.6,
  },
  buttonText: {
    color: ColorPalettes.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    backgroundColor: ColorPalettes.backgrounds.secondary,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: ColorPalettes.borders.light,
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ColorPalettes.text.primary,
    marginBottom: 10,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  resultContainer: {
    backgroundColor: ColorPalettes.backgrounds.secondary,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: ColorPalettes.borders.light,
    maxHeight: 300,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ColorPalettes.text.primary,
    marginBottom: 10,
  },
  resultScroll: {
    maxHeight: 200,
  },
  resultText: {
    fontSize: 14,
    color: ColorPalettes.text.secondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 20,
  },
});

export default LocalModelPOC; 