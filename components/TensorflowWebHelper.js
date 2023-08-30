import * as tf from '@tensorflow/tfjs';
import { loadGraphModel } from '@tensorflow/tfjs-converter';

/**
 * Load a machine learning model for image classification.
 *
 * @returns {Promise<tf.GraphModel>} - A Promise that resolves to the loaded machine learning model.
 */
export const loadModel = async () => {
  try {
      // Ensure TensorFlow.js is ready before loading the model
      await tf.ready();

      // Load the machine learning model from the specified URL
      const loadedModel = await loadGraphModel('https://rofbusinesstestbucket.s3.eu-central-1.amazonaws.com/model5_2_json/model.json');
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
      // Create an HTML image element and set its source to the provided URI
      const imgElement = new Image();
      imgElement.src = uri;

      // Convert the image to a TensorFlow tensor
      const imgTensor = tf.browser.fromPixels(imgElement);

      // Resize the image tensor to the required dimensions (320x320)
      const resizedImgTensor = tf.image.resizeNearestNeighbor(imgTensor, [320, 320]);

      // Normalize the pixel values to the range [0, 1]
      const scalar = tf.scalar(255);
      const tensorScaled = resizedImgTensor.div(scalar);

      // Reshape the tensor to match the expected input shape for the model
      const img = tf.reshape(tensorScaled, [1, 320, 320, 3]);
      return img;

  } catch (error) {
      console.log("[TRANSFORM ERROR] info:", error);
  }
};