from flask import Flask, request, jsonify
from flask_cors import CORS
from bson import ObjectId
from datetime import datetime, timezone
from db import get_db
from flask_caching import Cache
import redis
from collections import Counter
from dateutil import parser

app = Flask(__name__)
CORS(app)

# Configurações de cache e Redis
app.config['CACHE_TYPE'] = 'RedisCache'
app.config['CACHE_REDIS_HOST'] = 'localhost'
app.config['CACHE_REDIS_PORT'] = 6379
app.config['CACHE_REDIS_DB'] = 0
app.config['CACHE_DEFAULT_TIMEOUT'] = 60

cache = Cache(app)
redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

# Mongo
db = get_db()
tarefas = db.tarefas

def serialize_task(tarefa):
    creation = tarefa.get("creationDate")
    if isinstance(creation, str):
        creation_date = creation
    else:
        creation_date = (creation or datetime.now(timezone.utc)).isoformat()

    return {
        "id": str(tarefa["_id"]),
        "title": tarefa["title"],
        "description": tarefa["description"],
        "status": tarefa.get("status", "pendente"),
        "creationDate": creation_date,
        "comments": tarefa.get("comments", []),
        "tags": tarefa.get("tags", []),
        "idUsuario": tarefa.get("idUsuario", "Desconhecido")
    }

@app.route("/tarefas", methods=["GET"])
def listar_tarefas():
    return jsonify([serialize_task(t) for t in tarefas.find()])

@app.route("/tarefas", methods=["POST"])
def criar_tarefa():
    data = request.json
    nova = {
        "title": data["title"],
        "description": data["description"],
        "status": data.get("status", "pendente"),
        "creationDate": datetime.now(timezone.utc).isoformat(),
        "comments": [],
        "tags": data.get("tags", []),
        "idUsuario": data["idUsuario"]
    }
    result = tarefas.insert_one(nova)
    nova["_id"] = result.inserted_id
    return jsonify(serialize_task(nova)), 201

@app.route("/tarefas/<tarefa_id>", methods=["PATCH"])
def atualizar_tarefa(tarefa_id):
    data = request.json
    atualizacao = {}
    for field in ["title", "description", "status", "tags"]:
        if field in data:
            atualizacao[field] = data[field]
    result = tarefas.update_one({"_id": ObjectId(tarefa_id)}, {"$set": atualizacao})
    if result.modified_count > 0:
        tarefa = tarefas.find_one({"_id": ObjectId(tarefa_id)})
        return jsonify(serialize_task(tarefa))
    return jsonify({"error": "Tarefa não encontrada"}), 404

@app.route("/tarefas/<tarefa_id>/comment", methods=["POST"])
def adicionar_comentario(tarefa_id):
    data = request.json
    comentario = {
        "text": data["text"],
        "date": datetime.now(timezone.utc).isoformat()
    }
    tarefas.update_one({"_id": ObjectId(tarefa_id)}, {"$push": {"comments": comentario}})
    tarefa = tarefas.find_one({"_id": ObjectId(tarefa_id)})
    return jsonify(serialize_task(tarefa))

@app.route("/tarefas/<tarefa_id>", methods=["DELETE"])
def excluir_tarefa(tarefa_id):
    tarefas.delete_one({"_id": ObjectId(tarefa_id)})
    return '', 204

@cache.cached(timeout=60, key_prefix='dashboard')
@app.route("/dashboard", methods=["GET"])
def dashboard():
    usuarios = ["Ítalo", "Julia"]
    resultado = {}

    for usuario in usuarios:
        dados = {
            "status": {"pendentes": 0, "em_andamento": 0, "concluídas": 0},
            "por_dia": [],
            "tags_top": []
        }

        tarefas_usuario = list(tarefas.find({"idUsuario": usuario}))
        tag_counter = Counter()
        concluidas_por_dia = Counter()

        for tarefa in tarefas_usuario:
            status = tarefa.get("status", "pendente")
            if status in dados["status"]:
                dados["status"][status] += 1

            if status == "concluída":
                try:
                    dt = parser.parse(tarefa.get("creationDate"))
                    data_formatada = dt.strftime("%Y-%m-%d")
                    concluidas_por_dia[data_formatada] += 1
                except Exception:
                    pass

            for tag in tarefa.get("tags", []):
                if isinstance(tag, dict):
                    tag_counter[tag.get("label", "desconhecida")] += 1

        dados["por_dia"] = [{"date": dia, "count": count} for dia, count in concluidas_por_dia.items()]
        dados["tags_top"] = [{"label": tag, "count": count} for tag, count in tag_counter.most_common(5)]

        resultado[usuario] = dados

    return jsonify(resultado)

if __name__ == "__main__":
    app.run(debug=True)
