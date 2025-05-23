from flask import Flask, request, jsonify
from bson import ObjectId
from datetime import datetime
from db import get_db
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  
db = get_db()
tarefas = db["tarefas"]

def serialize_tarefa(tarefa):
    return {
        "id": str(tarefa["_id"]),
        "title": tarefa["title"],
        "description": tarefa["description"],
        "created_at": tarefa["created_at"].isoformat(),
        "status": tarefa["status"],
        "tags": tarefa.get("tags", []),
        "comments": tarefa.get("comments", [])
    }

@app.route("/tarefas/<tarefa_id>", methods=["PATCH"])
def atualizar_tarefa(tarefa_id):
    data = request.json
    atualizacao = {}

    if "title" in data:
        atualizacao["title"] = data["title"]
    if "description" in data:
        atualizacao["description"] = data["description"]
    if "status" in data:
        atualizacao["status"] = data["status"]

    if not atualizacao:
        return jsonify({"error": "Nenhum campo válido para atualizar."}), 400

    result = tarefas.update_one(
        {"_id": ObjectId(tarefa_id)},
        {"$set": atualizacao}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Tarefa não encontrada."}), 404

    return jsonify({"message": "Tarefa atualizada com sucesso."}), 200

@app.route("/tarefas", methods=["GET"])
def listar_tarefas():
    todas = list(tarefas.find())
    return jsonify([serialize_tarefa(t) for t in todas])

@app.route("/tarefas", methods=["POST"])
def criar_tarefa():
    data = request.json
    nova = {
        "title": data["title"],
        "description": data.get("description", ""),
        "created_at": datetime.utcnow(),
        "status": "pendente",
        "tags": data.get("tags", []),
        "comments": []
    }
    result = tarefas.insert_one(nova)
    nova["_id"] = result.inserted_id
    return jsonify(serialize_tarefa(nova)), 201

from datetime import datetime

@app.route("/tarefas/<tarefa_id>/comment", methods=["POST"])
def adicionar_comentario(tarefa_id):
    data = request.json
    comentario = {
        "text": data["text"],
        "date": datetime.utcnow().isoformat() 
    }

    tarefas.update_one(
        {"_id": ObjectId(tarefa_id)},
        {"$push": {"comments": comentario}}
    )

    return jsonify(comentario), 200

@app.route("/tarefas/<tarefa_id>", methods=["DELETE"])
def excluir_tarefa(tarefa_id):
    tarefas.delete_one({"_id": ObjectId(tarefa_id)})
    return jsonify({"message": "Tarefa excluída."}), 204

if __name__ == "__main__":
    app.run(debug=True)
