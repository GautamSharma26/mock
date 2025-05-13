from pydantic import BaseModel

class PromptRequest(BaseModel):
    class_level: int
    subject : str
    difficulty_level : str
    num_questions : str