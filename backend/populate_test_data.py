"""
Script para popular dados de teste no banco de dados.
Execute após o banco estar rodando.
"""
from sqlmodel import Session, create_engine, select
from models import Militar, Feriado, Excecao, PostoGraduacao, StatusMilitar, MotivoExcecao
from datetime import date, timedelta
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/escala_db")
engine = create_engine(DATABASE_URL, echo=True)

def popular_dados():
    with Session(engine) as session:
        # Verificar se já existem militares
        statement = select(Militar)
        militares_existentes = session.exec(statement).first()
        
        if militares_existentes:
            print("⚠️  Já existem dados no banco. Pulando população de dados de teste.")
            return
        
        print("Criando militares de teste...")
        
        # Criar militares de teste
        militares = [
            Militar(
                pg=PostoGraduacao.TEN1,
                nome_completo="João Silva Santos",
                nome_guerra="Silva",
                data_ultima_promocao=date(2020, 1, 15),
                data_inicio_escala=date(2020, 1, 1),
                status=StatusMilitar.ATIVO
            ),
            Militar(
                pg=PostoGraduacao.TEN1,
                nome_completo="Maria Oliveira Costa",
                nome_guerra="Oliveira",
                data_ultima_promocao=date(2020, 6, 20),
                data_inicio_escala=date(2020, 1, 1),
                status=StatusMilitar.ATIVO
            ),
            Militar(
                pg=PostoGraduacao.TEN2,
                nome_completo="Pedro Almeida Lima",
                nome_guerra="Almeida",
                data_ultima_promocao=date(2022, 3, 10),
                data_inicio_escala=date(2022, 1, 1),
                status=StatusMilitar.ATIVO
            ),
            Militar(
                pg=PostoGraduacao.TEN2,
                nome_completo="Ana Paula Rodrigues",
                nome_guerra="Paula",
                data_ultima_promocao=date(2022, 9, 5),
                data_inicio_escala=date(2022, 1, 1),
                status=StatusMilitar.ATIVO
            ),
            Militar(
                pg=PostoGraduacao.ASP,
                nome_completo="Carlos Eduardo Souza",
                nome_guerra="Eduardo",
                data_ultima_promocao=date(2024, 1, 8),
                data_inicio_escala=date(2024, 1, 1),
                status=StatusMilitar.ATIVO
            ),
            Militar(
                pg=PostoGraduacao.ASP,
                nome_completo="Fernanda Costa Silva",
                nome_guerra="Fernanda",
                data_ultima_promocao=date(2024, 1, 15),
                data_inicio_escala=date(2024, 1, 1),
                status=StatusMilitar.ATIVO
            ),
        ]
        
        for militar in militares:
            session.add(militar)
        
        session.commit()
        print(f"{len(militares)} militares criados!")
        
        # Criar feriados de teste (Natal e Ano Novo)
        print("Criando feriados de teste...")
        feriados = [
            Feriado(
                data=date(2024, 12, 25),
                descricao="Natal"
            ),
            Feriado(
                data=date(2025, 1, 1),
                descricao="Ano Novo"
            ),
        ]
        
        for feriado in feriados:
            session.add(feriado)
        
        session.commit()
        print(f"{len(feriados)} feriados criados!")
        
        print("\nDados de teste criados com sucesso!")
        print("\nMilitares criados:")
        for m in militares:
            print(f"   - {m.nome_guerra} ({m.pg})")

if __name__ == "__main__":
    popular_dados()

