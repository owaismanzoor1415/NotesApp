from flask import Flask,render_template,request,jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId


client=MongoClient("mongodb://127.0.0.1:27017/ecommerceDB")
db = client["notes_db"]
notes_col = db["notes"]

app=Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/notes", methods=["GET"])
def get_notes():
    notes = []
    for n in notes_col.find().sort("_id", -1):
        notes.append({
            "title": n.get("title", ""),
            "content": n.get("content", "")
        })
    return jsonify(notes), 200

@app.route("/api/notes", methods=["POST"])
def add_note():
    data = request.get_json(force=True)
    title = data.get("title", "").strip()
    content = data.get("content", "").strip()

    if not title and not content:
        return jsonify({"error": "Note cannot be empty"}), 400

    res = notes_col.insert_one({"title": title, "content": content})
    return jsonify({"_id": str(res.inserted_id), "title": title, "content": content}), 201

@app.route("/api/notes/<note_id>", methods=["PUT"])
def update_note(note_id):
    data = request.get_json(force=True)
    title = data.get("title", "").strip()
    content = data.get("content", "").strip()

    notes_col.update_one(
        {"_id": ObjectId(note_id)},
        {"$set": {"title": title, "content": content}}
    )
    return jsonify({"message": "Updated"}), 200


@app.route("/api/notes/<note_id>", methods=["DELETE"])
def delete_note(note_id):
    notes_col.delete_one({"_id": ObjectId(note_id)})
    return jsonify({"message": "Deleted"}), 200


if __name__=="__main__":
    app.run(debug=True)