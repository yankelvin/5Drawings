from os import chmod
import cv2
import numpy as np
import tensorflow as tf
from PIL import Image


class Cnn():
    def __init__(self):
        self.model = tf.keras.models.load_model('./model/model.h5')

    def predict(self, image):
        Image.open(image).save("img.png")

        img = Image.open('img.png')
        img = np.array(img)[:, :, 3]

        opencvImage = cv2.resize(img, (28, 28))

        predict = self.model.predict(opencvImage.reshape(-1, 28, 28, 1))[0]

        return predict.tolist()
