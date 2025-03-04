from fastapi import FastAPI
from pydantic import BaseModel
from langchain.llms import HuggingFaceHub
from dotenv import load_dotenv
import json
from langchain_anthropic import ChatAnthropic
from config import settings

import os
import re
load_dotenv()
# HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACEHUB_API_TOKEN")
os.environ["ANTHROPIC_API_KEY"] = settings.ANTHROPIC_API_KEY
# Load API Key from environment variable
# HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACEHUB_API_TOKEN")
# print(settings.ANTHROPIC_API_KEY,"jsdfjksdjkffb")

# Initialize FastAPI
app = FastAPI()

model = ChatAnthropic(model="claude-3-5-sonnet-20240620", temperature=0)
# Initialize the Hugging Face model



# Request Model
class PromptRequest(BaseModel):
    class_level: int
    subject : str
    difficulty_level : str
    num_questions : str
    

def extract_json(response: str):
    # Find all JSON-like blocks inside triple backticks
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

    return combined_data  # Return full list of MCQs




@app.post("/generate")
def generate_text(request: PromptRequest):
    class_level = request.class_level  # ✅ Correct way
    subject = request.subject
    difficulty_level = request.difficulty_level
    num_questions = request.num_questions
    
    # prompt=f"give {num_questions} mcq {subject} questions of {class_level}th class with multiple options. Give response in proper python json format "
#     prompt = (
#     f"Generate {num_questions} random multiple-choice questions (MCQs) in {subject} "
#     f"for class {class_level} of NCERT book. The difficulty level should be {difficulty_level}. "
#     "Ensure the response is in **strict JSON format** with the following structure:\n\n"
#     "```json\n"
#     "[\n"
#     "  {\n"
#     '    "question": "Question text?",\n'
#     '    "options": ["Option A", "Option B", "Option C", "Option D"],\n'
#     '    "answer": "Correct answer"\n'
#     "  },\n"
#     "  ... more questions ...\n"
#     "]\n"
#     "```"
# )

    prompt = (
    f"Generate {num_questions} unique and diverse multiple-choice questions (MCQs) in {subject} "
    f"for class {class_level} of the NCERT book. The difficulty level should be {difficulty_level}. "
    "Ensure that each response is fresh and non-repetitive, avoiding previously generated questions. "
    "Vary question topics, wording, and difficulty where possible. "
    "Ensure the response is in **strict JSON format** with the following structure:\n\n"
    "```json\n"
    "[\n"
    "  {\n"
    '    "question": "Question text?",\n'
    '    "options": ["Option A", "Option B", "Option C", "Option D"],\n'
    '    "answer": "Correct answer"\n'
    "  },\n"
    "  ... more questions ...\n"
    "]\n"
    "```"
)



    response = model.invoke(prompt, temperature=0.8,max_tokens=4000)  # Get model response as string
    print(f":::::::::::response::::::{response}:::::::::::::::")
    result = response.content.strip()
    clean_response = extract_json(result)  # Extract JSON data
    print(":::::::::>>>>>>>>",clean_response,":::::::::>>>>>>>")
    
    

    print(clean_response)  # Debugging log
    return clean_response  # Return extracted JSON # Return extracted JSON

