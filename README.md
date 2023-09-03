# Skin lession classification mobile and web app

The aim of this project was to create universal app that would help users to examine their skin lessions.

## About

The project is written to be multi-platform, so basically, it is one code that is then translated to be deployable to the web, Android, and iOS. It allows users to take or select photos that are further classified as either benign or malignant skin changes. As it is rather proof of concept, the model used for classification is simple and during phase test yields results about 60-70% when it comes to accuracy. Models that have an accuracy of about 98% were also created, but managing them in memory (especially for mobile devices) was extremely slow. Therefore, worse but lighter model was picked to present the concept of this project. After classifing image as one of these classes, it appears in the history section.

## Tech Stack

To create and develop model **Python** with **Tensorflow**, which is a library related to Machine Learning, was used. Such a model was then saved to a special format, that allowed further usage in the main application. The main code was written with the help of **React Native** - framework in **JavaScrpit** - that was then translated to native platforms during the compilation process. In order to load and manage the model, that was created earlier, **Tensorflowjs** was used at the main application side.  

## How to run
To run application in non-deployed mode **Node.js** server must be started. In order to that **yarn** - Node.js's package manager - could be use. In order to start testing serwer this command should be executed:
> yarn start

If there is any lack in dependencies, this command should be used to manage that:
> yarn install

After server should be able to start.


## Code documentation

You can find documentation under: https://rochfedorowicz.github.io/SkinLessionClassificationMobileAndWebApp/
