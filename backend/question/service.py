import json
import re
import os

def extract_json(response: str):
    """ Extract JSON data from the response, handling both raw JSON and triple backtick-wrapped JSON. """
    
    # 1️⃣ Try to directly parse JSON (if Claude returns raw JSON)
    try:
        parsed_data = json.loads(response)
        if isinstance(parsed_data, list):  
            return parsed_data  # ✅ Return directly if it's already valid JSON
    except json.JSONDecodeError:
        pass  # Continue to regex extraction

    # 2️⃣ Try to extract JSON from triple backticks (```json ... ```)
    matches = re.findall(r"```(?:json|python)?\n(.*?)\n```", response, re.DOTALL)
    
    if not matches:
        return {"error": "No valid JSON found", "raw_response": response}

    combined_data = []  # Store all parsed MCQs

    for json_str in matches:
        try:
            parsed_data = json.loads(json_str)  # Parse JSON
            if isinstance(parsed_data, list):  # Ensure it's a list
                combined_data.extend(parsed_data)
        except json.JSONDecodeError:
            continue  # Skip invalid JSON parts

    if not combined_data:
        return {"error": "Failed to parse JSON", "raw_json": response}

    return combined_data  # ✅ Return final extracted JSON list


def save_to_json(data, filename):
    """ Save extracted JSON data to a file """
    try:
        save_path = os.path.join(os.path.dirname(__file__), "../../mock-test-portal/src/data/", f"{filename}_mcq_data.json")
        print(f" save path :::::{save_path}")
        with open(save_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)  # Pretty-print JSON
        print(f"✅ Data successfully saved to {filename}")
    except Exception as e:
        print(f"❌ Error saving file: {e}")


