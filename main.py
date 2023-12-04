import os
import PyPDF2
import re
import tkinter as tk
import pyttsx3

def extract_questions(text):
    pattern = r'Pytanie nr\s*\d+.*?(?=Pytanie nr\s*\d+|\Z)'
    return re.findall(pattern, text, re.DOTALL)

def read_questions_from_pdf(pdf_path):
    questions = []
    with open(pdf_path, 'rb') as pdf_file:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ''
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            text += page_text
        extracted_questions = extract_questions(text)
        questions.extend(extracted_questions)
    return questions

def preprocess_questions(questions):
    processed_questions = []
    for question in questions:
        question_with_newline = re.sub(r'(Pytanie nr\s*\d+)', r'\1\n', question)
        processed_questions.append(question_with_newline)
    return processed_questions

class QuestionWindow:
    def __init__(self, master, questions):
        self.master = master
        self.questions = questions
        self.current_question_index = 0
        self.engine = pyttsx3.init()
        self.engine.setProperty('rate', 200)  

        self.text_box = tk.Text(master, font=('Arial', 12), wrap='word')
        self.text_box.pack()

        self.display_text()

    def display_text(self):
        if self.current_question_index < len(self.questions):
            current_question = self.questions[self.current_question_index]
            self.text_box.delete('1.0', tk.END)
            self.text_box.insert(tk.END, current_question)
            self.master.after(1000, self.read_question_aloud) 

    def read_question_aloud(self):
        if self.current_question_index < len(self.questions):
            current_question = self.questions[self.current_question_index]
            self.engine.say(current_question) 
            self.engine.runAndWait()
            self.current_question_index += 1
            self.master.after(10000, self.display_text)  

def main():
    pdf_folder = 'resources'
    pdf_files = [file for file in os.listdir(pdf_folder) if file.endswith('.pdf')]
    questions = []
    for pdf_file in pdf_files:
        pdf_path = os.path.join(pdf_folder, pdf_file)
        questions.extend(read_questions_from_pdf(pdf_path))
    processed_questions = preprocess_questions(questions)
    root = tk.Tk()
    root.title("Wyświetlanie pytań")
    window = QuestionWindow(root, processed_questions)
    root.mainloop()
    
if __name__ == "__main__":
    main()