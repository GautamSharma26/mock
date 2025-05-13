from fastapi import APIRouter
from config import settings
from langchain_groq import ChatGroq
from .schema import PromptRequest
from .service import extract_json, save_to_json
import os

os.environ["GROQ_API_KEY"] = settings.ANTHROPIC_API_KEY

model = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.0,
    max_retries=2,
    # other params...
)

question_router = APIRouter()

@question_router.post("/generate")
def generate_text(request: PromptRequest):
    class_level = request.class_level
    subject = request.subject
    difficulty_level = request.difficulty_level
    num_questions = request.num_questions

    # 🔹 Stronger JSON enforcement in prompt
    prompt = (
        f"Generate {num_questions} **unique and diverse multiple-choice questions (MCQs)** in {subject} "
        f"for **class {class_level}** from the NCERT syllabus. "
        f"Difficulty level: **{difficulty_level}**. "
        "Each question must have **four distinct options**, with one correct answer. "
        "Ensure the response follows **STRICT JSON format** without extra text, like this:\n\n"
        "```json\n"
        "[\n"
        "  {\n"
        '    "question": "What is the capital of France?",\n'
        '    "options": ["Paris", "London", "Berlin", "Madrid"],\n'
        '    "correctAnswer": "Paris"\n'
        "  }\n"
        "]\n"
        "```"
    )

    response = model.invoke(prompt, temperature=0.7, max_tokens=4000)  # Get model response as string
    print(f":::::::::::RAW RESPONSE:::::::\n{response}\n:::::::::::::::::::")

    result = response.content.strip()
    clean_response = extract_json(result)  # Extract JSON data
    print(":::::::::PROCESSED JSON:::::::::\n", clean_response, "\n::::::::::::::::::::")
    
    print(":::::::Saving Json ::::::::::::::")
    
    save_to_json(clean_response,subject)

    return clean_response  # ✅ Return extracted JSON
