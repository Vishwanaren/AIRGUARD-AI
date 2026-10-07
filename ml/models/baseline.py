"""
Persistence Baseline Model for AIRGUARD AI.
Predicts tomorrow's AQI as today's AQI value (t+1 = t).
"""

import numpy as np
import pandas as pd
from ml.data.loader import get_aqi_bucket

class PersistenceBaseline:
    def __init__(self):
        self.name = "Persistence Baseline"

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        # AQI_lag_1 is today's AQI (day t)
        if 'AQI_lag_1' in X.columns:
            return X['AQI_lag_1'].values
        elif 'AQI' in X.columns:
            return X['AQI'].values
        else:
            raise KeyError("AQI or AQI_lag_1 column required for Persistence Baseline.")

    def predict_category(self, X: pd.DataFrame) -> list:
        preds = self.predict(X)
        return [get_aqi_bucket(val) for val in preds]
