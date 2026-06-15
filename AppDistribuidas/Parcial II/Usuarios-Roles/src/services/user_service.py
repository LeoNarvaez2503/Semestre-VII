from src.repositories.user_repository import SqlAlchemyUserRepository
from src.repositories.interfaces import IUserRepository


class UserService:
    """
    Service layer with single responsibility: business logic for users.
    Depends on repository abstraction (IUserRepository) to follow Dependency Inversion.
    """

    def __init__(self, repo: IUserRepository = None):
        # Allow injection of a different repository for testing or extension
        self.repo = repo or SqlAlchemyUserRepository()

    def create_user(self, payload: dict):
        # Open/Closed: can accept different payloads without modifying repository
        return self.repo.create(payload)

    def get_user(self, user_id: str):
        return self.repo.get(user_id)

    def deactivate_user(self, user_id: str) -> None:
        # Business rule: when deactivating a user, deactivate their person and user_roles
        self.repo.deactivate(user_id)
