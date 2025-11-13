"""
Modelos de dados para o sistema de escalas.

A tabela EscalaDia é a chave do sistema:
- militar_agendado_id: Quem o ALGORITMO escolheu (quem "queima a vez" na fila)
- militar_executado_id: Quem REALMENTE vai tirar o serviço (para a regra D+2 funcionar)

Isso permite rastrear tanto a ordem da fila quanto quem realmente executou o serviço,
permitindo trocas e ajustes manuais sem quebrar a lógica de antiguidade.
"""
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import date, datetime
from enum import Enum


# Enums
class PostoGraduacao(str, Enum):
    """Posto/Graduação para ordenar por antiguidade."""
    ASP = "ASP"
    TEN2 = "TEN2"
    TEN1 = "TEN1"


class StatusMilitar(str, Enum):
    """Status do militar no sistema."""
    ATIVO = "ATIVO"
    FERIAS = "FERIAS"
    BAIXADO = "BAIXADO"
    MISSAO = "MISSAO"
    DISPENSA = "DISPENSA"


class TipoEscala(str, Enum):
    """Tipo de escala do dia."""
    PRETA = "PRETA"
    VERMELHA = "VERMELHA"


class MotivoExcecao(str, Enum):
    """Motivo da exceção (afastamento longo)."""
    FERIAS = "FERIAS"
    MISSAO = "MISSAO"
    DISPENSA = "DISPENSA"


# Modelo Militar
class Militar(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    pg: PostoGraduacao = Field(description="Posto/Graduação para ordenar por antiguidade")
    nome_completo: str
    nome_guerra: str = Field(description="Nome que aparece na escala")
    data_ultima_promocao: date = Field(description="Para o desempate da antiguidade")
    data_inicio_escala: date = Field(description="Data que ele 'entra na fila'")
    status: StatusMilitar = Field(default=StatusMilitar.ATIVO)
    
    # Relacionamentos
    escalas_agendadas: List["EscalaDia"] = Relationship(
        back_populates="militar_agendado",
        sa_relationship_kwargs={"foreign_keys": "EscalaDia.militar_agendado_id"}
    )
    escalas_executadas: List["EscalaDia"] = Relationship(
        back_populates="militar_executado",
        sa_relationship_kwargs={"foreign_keys": "EscalaDia.militar_executado_id"}
    )
    excecoes: List["Excecao"] = Relationship(back_populates="militar")


# Modelo EscalaDia (O "Cérebro")
class EscalaDia(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    data: date = Field(unique=True, description="O dia do serviço")
    tipo_escala: TipoEscala
    militar_agendado_id: Optional[int] = Field(
        default=None,
        foreign_key="militar.id",
        description="Quem o ALGORITMO escolheu. É quem 'queima a vez' na fila."
    )
    militar_executado_id: Optional[int] = Field(
        default=None,
        foreign_key="militar.id",
        description="Quem REALMENTE vai tirar o serviço. Por padrão, é o mesmo que o agendado."
    )
    justificativa_troca: Optional[str] = Field(
        default=None,
        description="Aqui entra a 'Troca com Fulano', 'Reforço', 'Força Maior'."
    )
    
    # Relacionamentos
    militar_agendado: Optional[Militar] = Relationship(
        back_populates="escalas_agendadas",
        sa_relationship_kwargs={"foreign_keys": "EscalaDia.militar_agendado_id"}
    )
    militar_executado: Optional[Militar] = Relationship(
        back_populates="escalas_executadas",
        sa_relationship_kwargs={"foreign_keys": "EscalaDia.militar_executado_id"}
    )


# Modelo Excecao (Afastamentos longos)
class Excecao(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    militar_id: int = Field(foreign_key="militar.id")
    motivo: MotivoExcecao
    data_inicio: date
    data_fim: date
    
    # Relacionamento
    militar: Militar = Relationship(back_populates="excecoes")


# Modelo Feriado
class Feriado(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    data: date = Field(unique=True)
    descricao: str
