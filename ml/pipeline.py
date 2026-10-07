"""
End-to-End Machine Learning Pipeline for AIRGUARD AI.
Executes data loading, validation, preprocessing, feature engineering,
time-based train/val/test splitting, model training, evaluation, SHAP explainability,
and artifact serialization.
"""

import os
import json
import logging
import joblib
import pandas as pd
import numpy as np

from ml.data.loader import DataLoader
from ml.data.preprocessor import Preprocessor
from ml.data.feature_engineering import FeatureEngineer
from ml.models.trainer import ModelTrainer
from ml.explainability.shap_explainer import ShapExplainer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AirGuardMLPipeline")

class MLPipeline:
    def __init__(self, data_path: str = "city_day.csv", artifacts_dir: str = "artifacts"):
        self.data_path = data_path
        self.artifacts_dir = artifacts_dir
        os.makedirs(self.artifacts_dir, exist_ok=True)
        
        self.loader = DataLoader(file_path=self.data_path)
        self.preprocessor = Preprocessor()
        self.feature_engineer = FeatureEngineer()
        self.trainer = ModelTrainer()
        
        self.df_clean = None
        self.df_engineered = None
        self.pipeline_results = None
        self.explainer = None

    def run(self) -> dict:
        logger.info("=== STARTING AIRGUARD AI ML PIPELINE ===")

        # Stage 1-2: Load & Validate Data
        df_raw = self.loader.load_data()

        # Stage 3-5: Clean, Preprocess, Missing Value & Outlier Handling
        self.df_clean = self.preprocessor.preprocess(df_raw)

        # Stage 9: Feature Engineering
        self.df_engineered = self.feature_engineer.create_features(self.df_clean, is_training=True)

        # Stage 10: Time-based Train / Validation / Test Split
        # 2015-2018: Train | 2019: Validation | 2020: Test
        train_mask = self.df_engineered['Date'] < '2019-01-01'
        val_mask = (self.df_engineered['Date'] >= '2019-01-01') & (self.df_engineered['Date'] < '2020-01-01')
        test_mask = self.df_engineered['Date'] >= '2020-01-01'

        df_train = self.df_engineered[train_mask]
        df_val = self.df_engineered[val_mask]
        df_test = self.df_engineered[test_mask]

        logger.info(f"Time-based split sizes -> Train (2015-2018): {len(df_train)}, Val (2019): {len(df_val)}, Test (2020): {len(df_test)}")

        feature_cols = self.feature_engineer.get_feature_names()

        X_train, y_train_reg, y_train_clf = df_train[feature_cols], df_train['target_aqi'], df_train['target_category']
        X_val, y_val_reg, y_val_clf = df_val[feature_cols], df_val['target_aqi'], df_val['target_category']
        X_test, y_test_reg, y_test_clf = df_test[feature_cols], df_test['target_aqi'], df_test['target_category']

        # Stage 11-14: Model Training, Hyperparameter Tuning & Evaluation
        metrics_results = self.trainer.train_and_evaluate_all(
            X_train, y_train_reg, y_train_clf,
            X_val, y_val_reg, y_val_clf,
            X_test, y_test_reg, y_test_clf
        )

        # Stage 15: SHAP Explainability for the best selected regression model
        best_reg_model = self.trainer.best_reg_model
        sample_bg = X_train.sample(min(200, len(X_train)), random_state=42)
        self.explainer = ShapExplainer(best_reg_model, feature_cols, background_data=sample_bg)
        global_importance = self.explainer.get_global_feature_importance(sample_bg.head(50))

        # Stage 16: Model Serialization & Artifact Saving
        logger.info("Saving ML models and artifacts...")
        joblib.dump(best_reg_model, os.path.join(self.artifacts_dir, 'aqi_regressor.joblib'))
        joblib.dump(self.trainer.best_clf_model, os.path.join(self.artifacts_dir, 'aqi_classifier.joblib'))
        joblib.dump(self.feature_engineer, os.path.join(self.artifacts_dir, 'feature_engineer.joblib'))
        
        # Save metrics and global importance
        with open(os.path.join(self.artifacts_dir, 'model_metrics.json'), 'w') as f:
            json.dump(metrics_results, f, indent=2)
            
        with open(os.path.join(self.artifacts_dir, 'global_importance.json'), 'w') as f:
            json.dump(global_importance, f, indent=2)

        # Save cleaned dataset for API server fast retrieval
        self.df_clean.to_csv(os.path.join(self.artifacts_dir, 'clean_air_quality.csv'), index=False)
        self.df_engineered.to_csv(os.path.join(self.artifacts_dir, 'engineered_air_quality.csv'), index=False)

        self.pipeline_results = {
            'metrics': metrics_results,
            'selected_regression_model': self.trainer.best_reg_name,
            'selected_classification_model': self.trainer.best_clf_name,
            'global_importance': global_importance
        }

        logger.info("=== AIRGUARD AI ML PIPELINE EXECUTED SUCCESSFULLY ===")
        return self.pipeline_results

if __name__ == "__main__":
    pipeline = MLPipeline()
    results = pipeline.run()
    print("Pipeline Results Summary:")
    print(json.dumps(results, indent=2))
