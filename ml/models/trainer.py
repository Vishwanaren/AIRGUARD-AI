"""
Model Training and Hyperparameter Tuning Layer for AIRGUARD AI.
Trains and compares Linear Regression, Random Forest, Gradient Boosting, XGBoost, and LightGBM.
Dynamically selects the best model based on validation metrics.
"""

import logging
import pandas as pd
import numpy as np
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
import xgboost as xgb
import lightgbm as lgb

from ml.models.baseline import PersistenceBaseline
from ml.models.evaluator import Evaluator, CATEGORIES_ORDER

logger = logging.getLogger("AirGuardTrainer")

class ModelTrainer:
    def __init__(self, random_state: int = 42):
        self.random_state = random_state
        self.models_regression = {}
        self.models_classification = {}
        self.best_reg_name = None
        self.best_clf_name = None
        self.best_reg_model = None
        self.best_clf_model = None

    def get_regression_models(self):
        return {
            'Linear Regression (Ridge)': Pipeline([
                ('imputer', SimpleImputer(strategy='median')),
                ('scaler', StandardScaler()),
                ('ridge', Ridge(alpha=10.0, random_state=self.random_state))
            ]),
            'Random Forest': RandomForestRegressor(n_estimators=50, max_depth=8, random_state=self.random_state, n_jobs=-1),
            'Gradient Boosting': lgb.LGBMRegressor(n_estimators=60, max_depth=5, learning_rate=0.1, random_state=self.random_state, verbose=-1, n_jobs=-1),
            'XGBoost': xgb.XGBRegressor(n_estimators=60, max_depth=5, learning_rate=0.1, random_state=self.random_state, n_jobs=-1),
            'LightGBM': lgb.LGBMRegressor(n_estimators=70, max_depth=6, learning_rate=0.09, random_state=self.random_state, verbose=-1, n_jobs=-1)
        }

    def get_classification_models(self):
        return {
            'Random Forest Classifier': RandomForestClassifier(n_estimators=50, max_depth=8, random_state=self.random_state, n_jobs=-1),
            'Gradient Boosting Classifier': lgb.LGBMClassifier(n_estimators=60, max_depth=5, learning_rate=0.1, random_state=self.random_state, verbose=-1, n_jobs=-1),
            'XGBoost Classifier': xgb.XGBClassifier(n_estimators=60, max_depth=5, learning_rate=0.1, random_state=self.random_state, n_jobs=-1),
            'LightGBM Classifier': lgb.LGBMClassifier(n_estimators=70, max_depth=6, learning_rate=0.09, random_state=self.random_state, verbose=-1, n_jobs=-1)
        }

    def train_and_evaluate_all(self, X_train, y_train_reg, y_train_clf,
                               X_val, y_val_reg, y_val_clf,
                               X_test, y_test_reg, y_test_clf) -> dict:
        logger.info("Training and evaluating regression and classification models...")
        
        results = {
            'regression': {},
            'classification': {}
        }

        # 1. Baseline Regression
        baseline = PersistenceBaseline()
        b_val_pred = baseline.predict(X_val)
        b_test_pred = baseline.predict(X_test)
        results['regression']['Persistence Baseline'] = {
            'val_metrics': Evaluator.evaluate_regression(y_val_reg, b_val_pred),
            'test_metrics': Evaluator.evaluate_regression(y_test_reg, b_test_pred)
        }

        # 2. Regression Models
        reg_candidates = self.get_regression_models()
        best_val_mae = float('inf')

        for name, model in reg_candidates.items():
            logger.info(f"Training Regression Model: {name}")
            model.fit(X_train, y_train_reg)
            self.models_regression[name] = model

            val_preds = model.predict(X_val)
            test_preds = model.predict(X_test)

            val_metrics = Evaluator.evaluate_regression(y_val_reg, val_preds)
            test_metrics = Evaluator.evaluate_regression(y_test_reg, test_preds)

            results['regression'][name] = {
                'val_metrics': val_metrics,
                'test_metrics': test_metrics
            }

            if val_metrics['mae'] < best_val_mae:
                best_val_mae = val_metrics['mae']
                self.best_reg_name = name
                self.best_reg_model = model

        logger.info(f"Best Regression Model Selected: {self.best_reg_name} (Val MAE: {best_val_mae})")

        # 3. Classification Models
        cat_to_int = {cat: i for i, cat in enumerate(CATEGORIES_ORDER)}
        int_to_cat = {i: cat for i, cat in enumerate(CATEGORIES_ORDER)}
        
        y_train_clf_int = y_train_clf.map(cat_to_int).fillna(0).astype(int)
        y_val_clf_int = y_val_clf.map(cat_to_int).fillna(0).astype(int)
        y_test_clf_int = y_test_clf.map(cat_to_int).fillna(0).astype(int)

        clf_candidates = self.get_classification_models()
        best_val_f1 = -1.0

        for name, model in clf_candidates.items():
            logger.info(f"Training Classification Model: {name}")
            model.fit(X_train, y_train_clf_int)
            val_preds_int = model.predict(X_val)
            test_preds_int = model.predict(X_test)
            val_preds = [int_to_cat[i] for i in val_preds_int]
            test_preds = [int_to_cat[i] for i in test_preds_int]

            self.models_classification[name] = model

            val_metrics = Evaluator.evaluate_classification(y_val_clf, val_preds)
            test_metrics = Evaluator.evaluate_classification(y_test_clf, test_preds)

            results['classification'][name] = {
                'val_metrics': val_metrics,
                'test_metrics': test_metrics
            }

            if val_metrics['weighted_f1'] > best_val_f1:
                best_val_f1 = val_metrics['weighted_f1']
                self.best_clf_name = name
                self.best_clf_model = model

        logger.info(f"Best Classification Model Selected: {self.best_clf_name} (Val F1: {best_val_f1})")

        results['selected_regression_model'] = self.best_reg_name
        results['selected_classification_model'] = self.best_clf_name

        return results
