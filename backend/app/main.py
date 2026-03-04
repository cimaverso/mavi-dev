from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import app.models.proveedores
import app.models.embarcaciones
import app.models.embarcacion_media
import app.models.reservas
import app.models.tipo_embarcacion
import app.models.usuarios

from app.routes import proveedor, embarcacion
from app.db.base import Base
from app.core.db import engine

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(proveedor.router, prefix="/api")
app.include_router(embarcacion.router, prefix="/api")