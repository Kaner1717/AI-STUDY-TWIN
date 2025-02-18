import openai
import os

# Load API key from environment variables
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_quiz(notes):
    prompt = f"Create 5 multiple-choice quiz questions from these notes:\n{notes}\n" \
             "For each question, include one correct answer and three incorrect options, clearly labeled."

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )

    return response['choices'][0]['message']['content']

# Example: Test with sample notes
sample_notes = "Photosynthesis is the process by which green plants convert sunlight into energy. It takes place in the chloroplasts and produces oxygen and glucose."
quiz = generate_quiz(sample_notes)
print(quiz)
