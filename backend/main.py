"""
API FastAPI para o sistema de escalas.
"""
from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select, create_engine, and_, or_
from typing import List, Optional
from datetime import date, datetime, timedelta
import calendar
import os

from models import (
    Militar, EscalaDia, Feriado, Excecao,
    PostoGraduacao, StatusMilitar, TipoEscala, MotivoExcecao
)
from schemas import (
    MilitarCreate, MilitarUpdate,
    FeriadoCreate,
    ExcecaoCreate,
    GerarEscalaRequest,
    TrocaEscalaRequest
)

# Configuração do banco de dados
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/escala_db")
engine = create_engine(DATABASE_URL, echo=False)

# Criar aplicação FastAPI
app = FastAPI(title="Escala API", version="2.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar origens
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency para obter sessão do banco
def get_session():
    with Session(engine) as session:
        yield session


# ==================== HEALTH CHECK ====================
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "API funcionando"}


# ==================== MILITARES ====================
@app.get("/militares", response_model=List[Militar])
def listar_militares(session: Session = Depends(get_session)):
    """Lista militares ordenados por antiguidade (PG e data de promoção)."""
    statement = select(Militar).order_by(
        Militar.pg.desc(),  # TEN1 > TEN2 > ASP
        Militar.data_ultima_promocao.asc()  # Mais antigo primeiro
    )
    militares = session.exec(statement).all()
    return list(militares)


@app.post("/militares", response_model=Militar)
def criar_militar(militar: MilitarCreate, session: Session = Depends(get_session)):
    """Cria um novo militar."""
    db_militar = Militar(**militar.model_dump())
    session.add(db_militar)
    session.commit()
    session.refresh(db_militar)
    return db_militar


@app.put("/militares/{militar_id}", response_model=Militar)
def atualizar_militar(
    militar_id: int,
    militar_update: MilitarUpdate,
    session: Session = Depends(get_session)
):
    """Atualiza um militar existente."""
    db_militar = session.get(Militar, militar_id)
    if not db_militar:
        raise HTTPException(status_code=404, detail="Militar não encontrado")
    
    update_data = militar_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_militar, field, value)
    
    session.add(db_militar)
    session.commit()
    session.refresh(db_militar)
    return db_militar


# ==================== FERIADOS ====================
@app.get("/feriados", response_model=List[Feriado])
def listar_feriados(session: Session = Depends(get_session)):
    """Lista todos os feriados."""
    statement = select(Feriado).order_by(Feriado.data)
    feriados = session.exec(statement).all()
    return list(feriados)


@app.post("/feriados", response_model=Feriado)
def criar_feriado(feriado: FeriadoCreate, session: Session = Depends(get_session)):
    """Cria um novo feriado."""
    # Verificar se já existe feriado nesta data
    statement = select(Feriado).where(Feriado.data == feriado.data)
    existente = session.exec(statement).first()
    if existente:
        raise HTTPException(status_code=400, detail="Já existe um feriado nesta data")
    
    db_feriado = Feriado(**feriado.model_dump())
    session.add(db_feriado)
    session.commit()
    session.refresh(db_feriado)
    return db_feriado


@app.delete("/feriados/{feriado_id}")
def deletar_feriado(feriado_id: int, session: Session = Depends(get_session)):
    """Deleta um feriado."""
    db_feriado = session.get(Feriado, feriado_id)
    if not db_feriado:
        raise HTTPException(status_code=404, detail="Feriado não encontrado")
    
    session.delete(db_feriado)
    session.commit()
    return {"message": "Feriado deletado com sucesso"}


# ==================== EXCEÇÕES ====================
@app.get("/excecoes", response_model=List[Excecao])
def listar_excecoes(session: Session = Depends(get_session)):
    """Lista todas as exceções."""
    statement = select(Excecao).order_by(Excecao.data_inicio)
    excecoes = session.exec(statement).all()
    return list(excecoes)


@app.post("/excecoes", response_model=Excecao)
def criar_excecao(excecao: ExcecaoCreate, session: Session = Depends(get_session)):
    """Cria uma nova exceção."""
    # Verificar se militar existe
    militar = session.get(Militar, excecao.militar_id)
    if not militar:
        raise HTTPException(status_code=404, detail="Militar não encontrado")
    
    db_excecao = Excecao(**excecao.model_dump())
    session.add(db_excecao)
    session.commit()
    session.refresh(db_excecao)
    return db_excecao


@app.delete("/excecoes/{excecao_id}")
def deletar_excecao(excecao_id: int, session: Session = Depends(get_session)):
    """Deleta uma exceção."""
    db_excecao = session.get(Excecao, excecao_id)
    if not db_excecao:
        raise HTTPException(status_code=404, detail="Exceção não encontrada")
    
    session.delete(db_excecao)
    session.commit()
    return {"message": "Exceção deletada com sucesso"}


# ==================== ESCALA ====================
@app.get("/escala")
def buscar_escala(
    mes: int = Query(..., ge=1, le=12),
    ano: int = Query(..., ge=2020, le=2100),
    session: Session = Depends(get_session)
):
    """Busca a escala de um mês específico."""
    # Calcular primeiro e último dia do mês
    primeiro_dia = date(ano, mes, 1)
    ultimo_dia = date(ano, mes, calendar.monthrange(ano, mes)[1])
    
    statement = select(EscalaDia).where(
        and_(
            EscalaDia.data >= primeiro_dia,
            EscalaDia.data <= ultimo_dia
        )
    ).order_by(EscalaDia.data)
    
    escalas = session.exec(statement).all()
    
    # Carregar relacionamentos
    resultado = []
    for escala in escalas:
        escala_dict = escala.model_dump()
        if escala.militar_agendado:
            escala_dict["militar_agendado"] = escala.militar_agendado.model_dump()
        if escala.militar_executado:
            escala_dict["militar_executado"] = escala.militar_executado.model_dump()
        resultado.append(escala_dict)
    
    return resultado


def obter_militares_ativos_ordenados(session: Session) -> List[Militar]:
    """Retorna militares ativos ordenados por antiguidade."""
    statement = select(Militar).where(
        Militar.status == StatusMilitar.ATIVO
    ).order_by(
        Militar.pg.desc(),
        Militar.data_ultima_promocao.asc()
    )
    return list(session.exec(statement).all())


def militar_tem_excecao(militar_id: int, data: date, session: Session) -> bool:
    """Verifica se o militar tem exceção (afastamento) na data."""
    statement = select(Excecao).where(
        and_(
            Excecao.militar_id == militar_id,
            Excecao.data_inicio <= data,
            Excecao.data_fim >= data
        )
    )
    return session.exec(statement).first() is not None


def eh_feriado(data: date, session: Session) -> bool:
    """Verifica se a data é feriado."""
    statement = select(Feriado).where(Feriado.data == data)
    return session.exec(statement).first() is not None


def eh_fim_de_semana(data: date) -> bool:
    """Verifica se a data é fim de semana (sábado ou domingo)."""
    return data.weekday() >= 5  # 5 = sábado, 6 = domingo


def obter_tipo_escala(data: date, session: Session) -> TipoEscala:
    """Determina o tipo de escala (PRETA ou VERMELHA)."""
    if eh_feriado(data, session) or eh_fim_de_semana(data):
        return TipoEscala.VERMELHA
    return TipoEscala.PRETA


def militar_executou_recentemente(militar_id: int, data: date, session: Session, dias: int = 2) -> bool:
    """Verifica se o militar executou escala nos últimos N dias (regra D+2)."""
    data_limite = data - timedelta(days=dias)
    statement = select(EscalaDia).where(
        and_(
            EscalaDia.militar_executado_id == militar_id,
            EscalaDia.data >= data_limite,
            EscalaDia.data < data
        )
    )
    return session.exec(statement).first() is not None


@app.post("/escala/gerar")
def gerar_escala(request: GerarEscalaRequest, session: Session = Depends(get_session)):
    """Gera a escala do mês seguindo as regras de antiguidade e D+2."""
    mes = request.mes
    ano = request.ano
    
    # Verificar se já existe escala para este mês
    primeiro_dia = date(ano, mes, 1)
    ultimo_dia = date(ano, mes, calendar.monthrange(ano, mes)[1])
    
    statement = select(EscalaDia).where(
        and_(
            EscalaDia.data >= primeiro_dia,
            EscalaDia.data <= ultimo_dia
        )
    )
    escalas_existentes = list(session.exec(statement).all())
    
    # Deletar escalas existentes do mês
    for escala in escalas_existentes:
        session.delete(escala)
    session.commit()
    
    # Obter militares ativos ordenados por antiguidade
    militares = obter_militares_ativos_ordenados(session)
    
    if not militares:
        raise HTTPException(status_code=400, detail="Não há militares ativos cadastrados")
    
    # Gerar escala para cada dia do mês
    escalas_criadas = []
    dia_atual = primeiro_dia
    
    while dia_atual <= ultimo_dia:
        tipo_escala = obter_tipo_escala(dia_atual, session)
        
        # Encontrar o próximo militar disponível
        militar_escolhido = None
        
        # Tentar encontrar militar que não executou recentemente (D+2)
        for militar in militares:
            # Verificar se militar tem exceção nesta data
            if militar_tem_excecao(militar.id, dia_atual, session):
                continue
            
            # Verificar regra D+2
            if not militar_executou_recentemente(militar.id, dia_atual, session, dias=2):
                militar_escolhido = militar
                break
        
        # Se não encontrou nenhum disponível (todos executaram recentemente),
        # escolher o que executou há mais tempo (relaxar regra D+2)
        if not militar_escolhido:
            # Buscar último dia que cada militar executou
            ultimas_execucoes = {}
            for militar in militares:
                if militar_tem_excecao(militar.id, dia_atual, session):
                    continue
                
                statement = select(EscalaDia).where(
                    and_(
                        EscalaDia.militar_executado_id == militar.id,
                        EscalaDia.data < dia_atual
                    )
                ).order_by(EscalaDia.data.desc())
                ultima_escala = session.exec(statement).first()
                ultimas_execucoes[militar.id] = ultima_escala.data if ultima_escala else date.min
        
            # Escolher o que executou há mais tempo
            if ultimas_execucoes:
                militar_escolhido = max(
                    [m for m in militares if m.id in ultimas_execucoes and not militar_tem_excecao(m.id, dia_atual, session)],
                    key=lambda m: ultimas_execucoes[m.id]
                )
        
        # Se ainda não encontrou (todos têm exceção), pular o dia
        if not militar_escolhido:
            dia_atual += timedelta(days=1)
            continue
        
        # Criar escala
        escala = EscalaDia(
            data=dia_atual,
            tipo_escala=tipo_escala,
            militar_agendado_id=militar_escolhido.id,
            militar_executado_id=militar_escolhido.id  # Inicialmente é o mesmo
        )
        session.add(escala)
        escalas_criadas.append(escala)
        
        dia_atual += timedelta(days=1)
    
    session.commit()
    
    # Recarregar escalas com relacionamentos
    for escala in escalas_criadas:
        session.refresh(escala)
    
    return escalas_criadas


@app.put("/escala/troca")
def trocar_escala(request: TrocaEscalaRequest, session: Session = Depends(get_session)):
    """Troca quem executa a escala (mantém quem foi agendado)."""
    escala = session.get(EscalaDia, request.escala_dia_id)
    if not escala:
        raise HTTPException(status_code=404, detail="Escala não encontrada")
    
    # Verificar se militar substituto existe
    militar_substituto = session.get(Militar, request.militar_substituto_id)
    if not militar_substituto:
        raise HTTPException(status_code=404, detail="Militar substituto não encontrado")
    
    # Atualizar escala
    escala.militar_executado_id = request.militar_substituto_id
    escala.justificativa_troca = request.justificativa
    
    session.add(escala)
    session.commit()
    session.refresh(escala)
    
    return escala


@app.delete("/escala/mes/{mes}/{ano}")
def deletar_escala_mes(mes: int, ano: int, session: Session = Depends(get_session)):
    """Deleta toda a escala de um mês."""
    primeiro_dia = date(ano, mes, 1)
    ultimo_dia = date(ano, mes, calendar.monthrange(ano, mes)[1])
    
    statement = select(EscalaDia).where(
        and_(
            EscalaDia.data >= primeiro_dia,
            EscalaDia.data <= ultimo_dia
        )
    )
    escalas = list(session.exec(statement).all())
    
    for escala in escalas:
        session.delete(escala)
    
    session.commit()
    
    return {"message": f"Escala de {mes}/{ano} deletada com sucesso", "deletados": len(escalas)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
