from pydantic import BaseModel


class EmbarcacionMediaBase(BaseModel):
    embmed_path: str
    embmed_idembarcacion: int


class EmbarcacionMediaRead(EmbarcacionMediaBase):
    embmed_id: int

    class Config:
        from_attributes = True