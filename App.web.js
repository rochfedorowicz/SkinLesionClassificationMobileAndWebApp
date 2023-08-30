import React from 'react';
import MainApp from './components/MainApp';
import { loadModel, transformImageToTensor } from './components/TensorflowWebHelper';
import { makePredictions } from './components/TensorflowUniqueHelper';

/**
 * Root component of the web application.
 *
 * @returns {JSX.Element} - The rendered root component.
 */
export default function App() {
  return (
    // Render the MainApp component while passing necessary functions as props
    <MainApp
      loadModel={loadModel}                       // Function to load the machine learning model
      transformImageToTensor={transformImageToTensor} // Function to transform an image to a tensor
      makePredictions={makePredictions}           // Function to make predictions using the model
    />
  );
}