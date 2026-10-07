"""
Evaluation Layer for AIRGUARD AI.
Calculates regression metrics (MAE, RMSE, R2) and classification metrics
(Accuracy, Weighted F1, Precision, Recall, Confusion Matrix, Adjacent-Category Accuracy).
"""

import numpy as np
import pandas as pd
from sklearn.metrics import (
    mean_absolute_error,
    root_mean_squared_error,
    r2_score,
    accuracy_score,
    precision_recall_fscore_support,
    confusion_matrix
)

CATEGORIES_ORDER = ['Good', 'Satisfactory', 'Moderate', 'Poor', 'Very Poor', 'Severe']
CAT_TO_IDX = {cat: idx for idx, cat in enumerate(CATEGORIES_ORDER)}

class Evaluator:
    @staticmethod
    def evaluate_regression(y_true, y_pred) -> dict:
        mae = float(mean_absolute_error(y_true, y_pred))
        rmse = float(root_mean_squared_error(y_true, y_pred))
        r2 = float(r2_score(y_true, y_pred))
        return {
            'mae': round(mae, 3),
            'rmse': round(rmse, 3),
            'r2': round(r2, 4)
        }

    @staticmethod
    def evaluate_classification(y_true, y_pred) -> dict:
        y_true = list(y_true)
        y_pred = list(y_pred)
        
        acc = float(accuracy_score(y_true, y_pred))
        p, r, f1, _ = precision_recall_fscore_support(y_true, y_pred, average='weighted', zero_division=0)
        
        # Calculate Adjacent Category Accuracy
        adjacent_correct = 0
        total = len(y_true)
        for t, p_val in zip(y_true, y_pred):
            t_idx = CAT_TO_IDX.get(t, -1)
            p_idx = CAT_TO_IDX.get(p_val, -1)
            if t_idx != -1 and p_idx != -1:
                if abs(t_idx - p_idx) <= 1:
                    adjacent_correct += 1
        adj_acc = float(adjacent_correct / total) if total > 0 else 0.0

        # Confusion Matrix
        labels = [c for c in CATEGORIES_ORDER if c in set(y_true).union(set(y_pred))]
        cm = confusion_matrix(y_true, y_pred, labels=labels)

        return {
            'accuracy': round(acc, 4),
            'weighted_f1': round(float(f1), 4),
            'precision': round(float(p), 4),
            'recall': round(float(r), 4),
            'adjacent_accuracy': round(adj_acc, 4),
            'confusion_matrix': cm.tolist(),
            'labels': labels
        }
