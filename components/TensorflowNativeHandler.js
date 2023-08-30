import * as tf from '@tensorflow/tfjs';
import { loadGraphModel } from '@tensorflow/tfjs-converter';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';

// Import the JSON architecture and weights of the neural network model
const modelJSON = require('./NNmodel/model.json');
const modelWeights = require('./NNmodel/group1-shard1of1.bin');

/**
 * Load a machine learning model for image classification.
 *
 * @returns {Promise<tf.GraphModel>} - A Promise that resolves to the loaded machine learning model.
 */
export const loadModel = async () => {
    try {
        // Ensure TensorFlow.js is ready before loading the model
        await tf.ready();

        // Load the machine learning model from bundled resources
        const loadedModel = await loadGraphModel(bundleResourceIO(modelJSON, modelWeights));
        return loadedModel;
    } catch (error) {
        console.log("[LOADING ERROR] info:", error);
    }
};

/**
 * Transform an image from a URI into a TensorFlow tensor suitable for prediction.
 *
 * @param {string} uri - URI of the image to transform.
 * @returns {tf.Tensor} - TensorFlow tensor representing the transformed image.
 */
export const transformImageToTensor = async (uri) => {
    try {
        // Read the image as a Base64-encoded string
        const img64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

        // Convert the Base64 string to a Uint8Array buffer
        const imgBuffer = tf.util.encodeString(img64, 'base64').buffer;
        const raw = new Uint8Array(imgBuffer);

        // Decode the JPEG image and create a TensorFlow tensor
        let imgTensor = decodeJpeg(raw);

        // Convert the tensor to an array, resize, and normalize it
        imgTensor = await imgTensor.array();
        imgTensor = tf.image.resizeNearestNeighbor(imgTensor, [320, 320]);
        const scalar = tf.scalar(255);
        const tensorScaled = imgTensor.div(255);

        // Reshape the tensor to match the expected input shape for the model
        const img = tf.reshape(tensorScaled, [1, 320, 320, 3]);
        return img;

    } catch (error) {
        console.log("[TRANSFORM ERROR] info:", error);
    }
};