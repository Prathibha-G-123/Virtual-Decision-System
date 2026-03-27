import numpy as np  # type: ignore
import pickle
import os
from sklearn.ensemble import RandomForestRegressor  # type: ignore
from sklearn.model_selection import train_test_split  # type: ignore
from sklearn.metrics import mean_squared_error, r2_score  # type: ignore

def train_and_save_model():
    print("Generating advanced synthetic dataset for project delays...")
    np.random.seed(42)
    num_samples = 3000  # Larger dataset for better generalization

    # Features
    budgets = np.random.randint(10000, 1000000, num_samples)
    team_sizes = np.random.randint(3, 50, num_samples)
    team_experience = np.random.uniform(1.0, 15.0, num_samples) # Average years of experience
    durations = np.random.randint(30, 365, num_samples)
    complexities = np.random.randint(1, 11, num_samples)

    X = np.column_stack((budgets, team_sizes, team_experience, durations, complexities))

    # Advanced logic for delays
    base_delay = (complexities * 4.0) + (durations * 0.15)
    mitigation = (team_experience * 2.5) + (team_sizes * 0.5)
    
    # Funding factor: Extremely low budgets relative to duration increase delay
    funding_squeeze = np.where((budgets / durations) < 500, 15.0, 0.0)
    
    # Introduce random real-world chaotic noise
    noise = np.random.normal(0, 7.5, num_samples)
    
    delays = base_delay - mitigation + funding_squeeze + noise
    delays = np.clip(delays, -15, None)
    
    y = delays

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training Random Forest model...")
    model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate
    predictions = model.predict(X_test)
    mse = mean_squared_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)
    
    print(f"Model trained successfully.")
    print(f"Mean Squared Error: {mse:.2f}")
    print(f"R2 Score: {r2:.2f}")

    feature_names = ['budget', 'team_size', 'team_experience', 'estimated_duration', 'complexity']
    importances = model.feature_importances_
    for name, imp in zip(feature_names, importances):
        print(f"Importance of {name}: {imp:.4f}")

    # Save to model.pkl
    model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_and_save_model()
