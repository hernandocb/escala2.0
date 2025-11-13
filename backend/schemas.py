"""
Schemas para validação de entrada e saída da API.
"""
from sqlmodel import SQLModel
from typing import Optional
from datetime import date
from models import PostoGraduacao, StatusMilitar, MotivoExcecao


# Schemas para Militar
class MilitarCreate(SQLModel):
    pg: PostoGraduacao
    nome_completo: str
    nome_guerra: str
    data_ultima_promocao: date
    data_inicio_escala: date
    status: StatusMilitar = StatusMilitar.ATIVO


class MilitarUpdate(SQLModel):
    pg: Optional[PostoGraduacao] = None
    nome_completo: Optional[str] = None
    nome_guerra: Optional[str] = None
    data_ultima_promocao: Optional[date] = None
    data_inicio_escala: Optional[date] = None
    status: Optional[StatusMilitar] = None


# Schemas para Feriado
class FeriadoCreate(SQLModel):
    data: date
    descricao: str


# Schemas para Excecao
class ExcecaoCreate(SQLModel):
    militar_id: int
    motivo: MotivoExcecao
    data_inicio: date
    data_fim: date


# Schemas para Gerar Escala
class GerarEscalaRequest(SQLModel):
    mes: int
    ano: int


# Schemas para Troca de Escala
class TrocaEscalaRequest(SQLModel):
    escala_dia_id: int
    militar_substituto_id: int
    justificativa: str

