"""
Script para criar as tabelas no banco de dados.
"""
from sqlmodel import SQLModel, create_engine
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/escala_db")
engine = create_engine(DATABASE_URL, echo=True)

# Importar todos os modelos para que sejam registrados
from models import Militar, EscalaDia, Excecao, Feriado

if __name__ == "__main__":
    print("Criando tabelas no banco de dados...")
    SQLModel.metadata.create_all(engine)
    print("Tabelas criadas com sucesso!")

