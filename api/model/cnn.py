import cv2
import numpy as np
import tensorflow as tf


class Cnn():
    def __init__(self):
        self.model = tf.keras.models.load_model('./model/model.h5')

    def predict(self, image):
        npimg = np.fromstring(image, np.uint8)

        im_gray = cv2.imdecode(npimg, cv2.IMREAD_GRAYSCALE)
        im_gray = cv2.bitwise_not(im_gray)

        resized_image = cv2.resize(im_gray, (28, 28))
        predict = self.model.predict(resized_image.reshape(-1, 28, 28, 1))[0]

        return predict.tolist()
