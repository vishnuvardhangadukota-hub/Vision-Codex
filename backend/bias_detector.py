import pandas as pd
import numpy as np

def analyze_dataset(file_stream, domain="General") -> dict:
    df = pd.read_csv(file_stream)

    # Basic stats
    row_count = len(df)
    col_count = len(df.columns)

    # Identify columns
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
    numeric_cols = df.select_dtypes(include=['number']).columns.tolist()

    # ❌ Ignore useless columns like name/id
    ignore_cols = ["name", "id"]
    categorical_cols = [col for col in categorical_cols if col.lower() not in ignore_cols]

    analysis_results = {
        "summary": {
            "rowCount": row_count,
            "columnCount": col_count,
            "categoricalColumns": len(categorical_cols),
            "numericColumns": len(numeric_cols)
        },
        "biasScore": 0,
        "overallRisk": "Safe",
        "mostBiasedFeature": None,
        "domainContext": domain,
        "features": [],
        "distributions": {}
    }

    total_bias_score = 0
    feature_count = 0

    # 🔥 Advanced bias detection
    for col in categorical_cols:
        counts = df[col].value_counts()

        if len(counts) > 1:
            distribution = counts.to_dict()

            frequencies = np.array(list(distribution.values()))
            total = frequencies.sum()

            # Convert to probabilities
            probs = frequencies / total

            max_ratio = max(probs)
            min_ratio = min(probs)

            # Imbalance measure
            imbalance = max_ratio - min_ratio

            # Entropy (disorder)
            entropy = -np.sum(probs * np.log2(probs + 1e-9))
            max_entropy = np.log2(len(probs))
            normalized_entropy = entropy / max_entropy if max_entropy > 0 else 1

            # 🚀 Aggressive scoring (hackathon ready)
            dominance = max_ratio

            score = int(
                (imbalance * 50) +
                (dominance * 30) +
                ((1 - normalized_entropy) * 20)
            )

            # Extra boost
            if dominance > 0.85:
                score += 25
            elif dominance > 0.7:
                score += 15

            score = min(100, score)

            total_bias_score += score
            feature_count += 1

            # Generate AI Explanation based on domain
            top_class = list(distribution.keys())[0] if distribution else "None"
            dom_percent = int(dominance * 100)
            
            if domain == "Hiring":
                ai_exp = f"In Hiring context, `{col}` shows strong imbalance where `{top_class}` dominates {dom_percent}%, which can lead to biased screening models."
            elif domain == "Healthcare":
                ai_exp = f"In Healthcare data, `{col}` exhibits {dom_percent}% dominance by `{top_class}`, risking unequal diagnostics or treatment recommendations."
            elif domain == "Finance":
                ai_exp = f"For Finance models, `{col}` skewing {dom_percent}% towards `{top_class}` could result in unfair loan approvals or credit scoring."
            else:
                ai_exp = f"General analysis: `{col}` has {dom_percent}% dominance by `{top_class}`, indicating a skewed class representation."

            # 🚨 Better suggestions
            if score >= 70:
                suggestion = f"🚨 Highly biased! {ai_exp} Immediate action required."
            elif score >= 40:
                suggestion = f"⚠️ Moderate bias detected. {ai_exp} Consider balancing."
            else:
                suggestion = "✅ Data looks fairly balanced."

            analysis_results["features"].append({
                "name": col,
                "biasScore": score,
                "suggestion": suggestion,
                "aiExplanation": ai_exp,
                "dominance": dominance
            })

            # Format for charts
            analysis_results["distributions"][col] = [
                {"name": str(k), "value": int(v)} for k, v in distribution.items()
            ]

    # Numeric columns → histogram
    for col in numeric_cols:
        bins = pd.cut(df[col], bins=5)
        counts = bins.value_counts(sort=False)

        analysis_results["distributions"][col] = [
            {"name": str(k), "value": int(v)} for k, v in counts.items()
        ]

    # Final score
    if feature_count > 0:
        overall_score = int(total_bias_score / feature_count)
        analysis_results["biasScore"] = overall_score
        
        # Risk classification
        if overall_score >= 70:
            analysis_results["overallRisk"] = "Critical"
        elif overall_score >= 40:
            analysis_results["overallRisk"] = "Warning"
        else:
            analysis_results["overallRisk"] = "Safe"
            
    # Most biased feature extraction
    if analysis_results["features"]:
        sorted_features = sorted(analysis_results["features"], key=lambda x: x["biasScore"], reverse=True)
        analysis_results["mostBiasedFeature"] = sorted_features[0]

    return analysis_results