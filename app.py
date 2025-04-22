#flask
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("quiz.html")

@app.route("/submit_score", methods=["POST"])
def submit_score():
    data = request.get_json()
    score = data.get("score")
    print(f"Score received: {score}")
    return jsonify({"status": "success", "received": score})

if __name__ == "__main__":
    app.run(debug=True)
