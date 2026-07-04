# LatentDream

LatentDream is an interactive web application that uses artificial intelligence to analyse dreams based strictly on the traditional psychoanalytic theories of Sigmund Freud. 

This project was developed as a final year project for the National College of Ireland (NCI). It aims to safely replicate a traditional dream psychoanalysis session by helping users separate the literal story of a dream (manifest content) from its hidden psychological meaning (latent content).

## 🚀 Live Demo
* **Frontend Application:** [View on Vercel](https://latentdream.vercel.app)
* **Backend API:** Hosted securely on Render

## ✨ Features

* **Dream Logging:** A simple text interface for users to record their dreams as soon as they wake up.
* **Interactive AI Conversation:** A chat system powered by the Gemini API and LangChain that asks exactly three follow-up questions to understand the user's personal context and emotions.
* **Freudian Interpretation Reports:** Generates a final summary explaining hidden desires and psychological conflicts, strictly following Freudian theory and avoiding generic dream dictionary symbols.
* **Secure Journal Dashboard:** A private, authenticated space where users can view a timeline of their past dream entries and reports.

## 📂 Repository Structure

This repository is built with a separate frontend and backend to allow for future scalability.

* `/latentdream_frontend`: Contains the user interface built with React.js and Tailwind CSS.
* `/latentdream_backend`: Contains the server and API logic built with Python, FastAPI, and SQLAlchemy.

## 🛠️ Technology Stack

**Frontend:**
* React.js
* Tailwind CSS
* Hosted on Vercel

**Backend:**
* Python
* FastAPI
* SQLAlchemy (ORM)
* Hosted on Render

**Data & AI:**
* PostgreSQL (Encrypted database for dream logs)
* Firebase Authentication (Secure user login)
* LangChain & Gemini API (AI conversational loop and text generation)

## ⚙️ Local Setup Instructions

To run this project on your local machine, you will need to set up both the backend and frontend environments.

### 1. Backend Setup (`/latentdream_backend`)
1. Navigate to the backend folder:
   `cd latentdream_backend`
2. Create a virtual environment:
   `python -m venv venv`
3. Activate the virtual environment:
   * Windows: `venv\Scripts\activate`
   * Mac/Linux: `source venv/bin/activate`
4. Install the required dependencies:
   `pip install -r requirements.txt`
5. Run the FastAPI server:
   `uvicorn main:app --reload`

### 2. Frontend Setup (`/latentdream_frontend`)
1. Open a new terminal and navigate to the frontend folder:
   `cd latentdream_frontend`
2. Install the necessary Node packages:
   `npm install`
3. Start the development server:
   `npm start`

## 🧪 Testing

The system includes automated tests using `PyTest` to ensure backend stability and quick processing times. Evaluation criteria ensure that the AI successfully uses Freudian terms 100% of the time without referencing conflicting psychological concepts.

## 🎓 Academic Context

Module: Project (HDAIML_SEP25OL)
Institution: National College of Ireland (NCI)
