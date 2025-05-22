from pymongo import MongoClient

# Conexão direta
client = MongoClient("mongodb://localhost:27017")
db = client["lista_de_tarefas"]  # Nome do banco

def get_db():
    return db
