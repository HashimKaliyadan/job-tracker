from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Object-level and Global permission to only allow Admins to access.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'Admin')

class IsManager(permissions.BasePermission):
    """
    Permission for Manager role. Managers can view/manage records but typically 
    cannot create/delete users or change roles unless explicitly granted elsewhere.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'Manager')

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to access it, 
    unless they are an Admin who can access everything.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'Admin':
            return True
        # Assuming the object is the User model itself (e.g. for profile edits)
        return obj == request.user

class IsActionAllowed(permissions.BasePermission):
    """
    Complex logic for the user management API:
    - Admins can do anything.
    - Managers can view users, but cannot create or delete users.
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False

        if request.user.role == 'Admin':
            return True

        if request.user.role == 'Manager':
            if view.action in ['create', 'destroy']:
                return False
            return True
            
        # Standard 'User' can list (filtered by queryset) and manage own profile
        if view.action in ['list', 'retrieve', 'update', 'partial_update']:
            return True
            
        return False
