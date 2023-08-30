import * as tf from '@tensorflow/tfjs';

/**
 * Perform image classification predictions using a machine learning model.
 *
 * @param {tf.Model} model - The loaded machine learning model for predictions.
 * @param {tf.Tensor} imagesTensor - Tensor representing the input image for predictions.
 * @returns {Promise<tf.Tensor>} - A Promise that resolves to a tensor containing prediction data.
 */
export const makePredictions = async (model, imagesTensor) => {
    try {
      // Create a dummy image tensor for initialization
      const dummyImage = tf.zeros([1, 320, 320, 3]);

      // Run an initial prediction on the dummy image to initialize the model
      const predictionsData_ = await model.predict(dummyImage);

      // Dispose the dummy image tensor to free up memory
      dummyImage.dispose();

      // Perform the actual prediction on the provided image tensor
      const predictionsData = await model.predict(imagesTensor);
      return predictionsData;

    } catch (error) {
      console.log("[PREDICTION ERROR] info:", error);
    }
};