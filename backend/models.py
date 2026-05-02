from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class Pipeline(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    run: Optional[bool] = False