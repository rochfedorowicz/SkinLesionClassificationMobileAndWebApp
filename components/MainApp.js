import LoadingScreen from './LoadingScreen';
import TakePhoto from './TakePhoto';
import History from './History';

import React, { useState, useEffect } from 'react';
import { StatusBar, Platform, Text, View, TouchableOpacity, Image as ImageReactNative, StyleSheet } from 'react-native';

/**
 * Main application component.
 *
 * @param {Object} props - Component props.
 * @param {function} props.loadModel - Function to load the machine learning model.
 * @param {function} props.transformImageToTensor - Function to transform an image to a tensor.
 * @param {function} props.makePredictions - Function to make predictions using the model.
 * @returns {JSX.Element} - Rendered component.
 */
function MainApp(props) {
  const [data, setData] = useState([]);
  const [loadingVisible, setLoadingVisible] = useState(true);
  const [takingPhotoVisible, setTakingPhotoVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [loadingText, setLoadingText] = useState("");
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [predictedClass, setPredictedClass] = useState("");

  useEffect(() => {
    initializeModel();
  }, []);

  /**
   * Initialize the machine learning model on component mount.
   */
  const initializeModel = async () => {
    setLoadingText("Loading model...");
    setLoadingVisible(true);
    const loadedModel = await props.loadModel();
    setModel(loadedModel);
    setLoadingVisible(false);
  };

  /**
   * Show the history modal.
   */
  const showHistory = async () => {
    setHistoryVisible(true);
  };

  /**
   * Show the take photo modal and reset predicted class.
   */
  const showTakePhoto = async () => {
    setTakingPhotoVisible(true);
    setPredictedClass("");
  };

  /**
   * Handle the prediction process.
   */
  const handlePredict = async () => {
    try {
      if (imageUri) {
        setLoadingVisible(true);
        setLoadingText("Transforming image...");
        
        const imageTensor = await props.transformImageToTensor(imageUri);
        setLoadingText("Predicting...");

        let predictionsData;
        setTimeout(async () => {
          predictionsData = await props.makePredictions(model, imageTensor);
          setPrediction(predictionsData);
          let predictedClassToSet;
          if (predictionsData.dataSync()[0] > predictionsData.dataSync()[1]) {
            predictedClassToSet = "Benign";
          } else {
            predictedClassToSet = "Malignant";
          }
          setPredictedClass(predictedClassToSet);
          setLoadingVisible(false);
          addHistoryElement(imageUri, predictedClassToSet);
        }, 1000);
      }
    } catch (error) {
      console.log("[HANDLE PREDICT ERROR] info:", error);
    }
  };

  /**
   * Add an element to the history data.
   *
   * @param {string} uri - Image URI.
   * @param {string} predictedClass - Predicted class.
   */
  const addHistoryElement = (uri, predictedClass) => {
    const newRow = {
      id: data.length + 1,
      uri: uri,
      predictedClass: predictedClass,
    };
    setData([...data, newRow]);
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        translucent={false}
      />
      {loadingVisible && 
        <LoadingScreen
          loadingText={loadingText}
        />
      }
      <TakePhoto 
        visible={takingPhotoVisible} 
        setImageUri={setImageUri} 
        setTakingPhotoVisible={setTakingPhotoVisible}  
      />
      <History
        visible={historyVisible}
        data={data}
        setHistoryVisible={setHistoryVisible}
      />
      {/* Main content */}
      <View style={styles.background}>
        <Text style={styles.pageText}>Chosen photo</Text>
        <View style={styles.backgroundForPhoto}>
          <ImageReactNative 
            source={ imageUri ? 
              { uri: imageUri } : 
              Platform.OS == 'web' ?
                require('./images/image-background-web.png') :
                require('./images/image-background-native.png') }
            style={styles.previewImage} 
          />
        </View>
        {imageUri && prediction && 
          <Text style={styles.text}>Prediction: {predictedClass} </Text>
        }
      </View>
      {/* Button container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={initializeModel}>
          <Text style={styles.text}>Reload Model</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={showTakePhoto}>
          <Text style={styles.text}>Choose photo</Text>
        </TouchableOpacity>
        {imageUri && 
          <TouchableOpacity style={styles.button} onPress={handlePredict}>
            <Text style={styles.text}>Predict</Text>
          </TouchableOpacity>
        }
        <TouchableOpacity style={styles.button} onPress={showHistory}>
          <Text style={styles.text}>History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default MainApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffb703',
  },
  background: {
    width: Platform.OS === 'web' ? '40%' : '85%',
    backgroundColor: '#fb8500',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  backgroundForPhoto: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#219ebc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: Platform.OS === 'android' ? 10 : 15,
    borderRadius: 25,
    backgroundColor: '#023047',
    width: '70%',
  },
  text: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  pageText: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
  previewImage: {
    width: '95%',
    aspectRatio: 1,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8ecae6',
  },
});