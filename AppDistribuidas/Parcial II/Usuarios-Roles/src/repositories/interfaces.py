from abc import ABC, abstractmethod
from typing import Any, List, Optional


class IUserRepository(ABC):
    @abstractmethod
    def get(self, user_id: str) -> Optional[Any]:
        pass

    @abstractmethod
    def create(self, payload: dict) -> Any:
        pass

    @abstractmethod
    def deactivate(self, user_id: str) -> None:
        pass
