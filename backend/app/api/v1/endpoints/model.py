"""
Model Metrics and Features Endpoints for AIRGUARD AI.
GET /api/model/metrics
GET /api/model/features
"""

from fastapi import APIRouter
from backend.app.models.schemas import ModelMetricsResponse, GlobalImportanceResponse
from backend.app.services.forecast_service import ForecastService

router = APIRouter()

@router.get("/model/metrics", response_model=ModelMetricsResponse)
def get_model_metrics():
    fs = ForecastService.get_instance()
    m_data = fs.metrics_data

    sel_reg = m_data.get('selected_regression_model', 'LightGBM')
    sel_clf = m_data.get('selected_classification_model', 'XGBoost Classifier')

    reg_models = {}
    for name, res in m_data.get('regression', {}).items():
        reg_models[name] = {
            'val_metrics': res.get('val_metrics', {}),
            'test_metrics': res.get('test_metrics', {}),
            'is_selected': (name == sel_reg)
        }

    clf_models = {}
    for name, res in m_data.get('classification', {}).items():
        clf_models[name] = {
            'val_metrics': res.get('val_metrics', {}),
            'test_metrics': res.get('test_metrics', {}),
            'is_selected': (name == sel_clf)
        }

    return ModelMetricsResponse(
        selected_regression_model=sel_reg,
        selected_classification_model=sel_clf,
        regression_models=reg_models,
        classification_models=clf_models
    )

@router.get("/model/features", response_model=GlobalImportanceResponse)
def get_model_features():
    fs = ForecastService.get_instance()
    features = fs.global_importance
    return GlobalImportanceResponse(features=features)
