import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Users, Trash2, Edit, UserCheck, AlertCircle, X, Save, Crown, Briefcase } from 'lucide-react';

export default function Dashboard() {
    const { user, isAdmin, isManager } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', role: '' });

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/users/');
            setUsers(res.data);
        } catch (err) {
            setError('Failed to load users.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/users/${id}/`);
            setUsers(users.filter((u) => u.id !== id));
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to delete user.');
        }
    };

    const startEdit = (u) => {
        setEditingUser(u.id);
        setEditForm({ name: u.name, role: u.role });
    };

    const cancelEdit = () => {
        setEditingUser(null);
        setEditForm({ name: '', role: '' });
    };

    const saveEdit = async (id) => {
        try {
            const payload = { name: editForm.name };
            if (isAdmin) payload.role = editForm.role;
            await api.patch(`/users/${id}/`, payload);
            setEditingUser(null);
            fetchUsers();
        } catch (err) {
            const data = err.response?.data;
            const msg = data?.role?.[0] || data?.detail || 'Failed to update user.';
            setError(msg);
        }
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'Admin': return 'badge badge-admin';
            case 'Manager': return 'badge badge-manager';
            default: return 'badge badge-user';
        }
    };

    const adminCount = users.filter(u => u.role === 'Admin').length;
    const managerCount = users.filter(u => u.role === 'Manager').length;
    const userCount = users.filter(u => u.role === 'User').length;

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p className="dashboard-welcome">
                    Welcome, <strong>{user?.name}</strong> You are logged in as{' '}
                    <span className={getRoleBadgeClass(user?.role)}>{user?.role}</span>
                </p>
            </div>

            {/* Stat Cards */}
            {(isAdmin || isManager) && !loading && (
                <div className="dashboard-grid">
                    <div className="stat-card">
                        <div className="stat-icon admin-icon"><Crown size={20} /></div>
                        <div className="stat-label">Admins</div>
                        <div className="stat-value">{adminCount}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon manager-icon"><Briefcase size={20} /></div>
                        <div className="stat-label">Managers</div>
                        <div className="stat-value">{managerCount}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon user-icon"><Users size={20} /></div>
                        <div className="stat-label">Users</div>
                        <div className="stat-value">{userCount}</div>
                    </div>
                </div>
            )}

            {error && (
                <div className="alert alert-error">
                    <AlertCircle size={16} />
                    {error}
                    <button onClick={() => setError('')} className="alert-close"><X size={14} /></button>
                </div>
            )}

            {/* User Management Table */}
            <div className="dashboard-card">
                <div className="card-header">
                    <h2><Users size={18} /> User Management</h2>
                    {(isAdmin || isManager) && (
                        <span className="card-subtitle">{users.length} user(s) total</span>
                    )}
                </div>

                {loading ? (
                    <div className="table-loading">Loading users...</div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table" id="users-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Verified</th>
                                    <th>Joined</th>
                                    {(isAdmin || isManager) && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id}>
                                        <td>
                                            {editingUser === u.id ? (
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="inline-input"
                                                />
                                            ) : (
                                                <strong>{u.name}</strong>
                                            )}
                                        </td>
                                        <td>{u.email}</td>
                                        <td>
                                            {editingUser === u.id && isAdmin ? (
                                                <select
                                                    value={editForm.role}
                                                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                                    className="inline-select"
                                                >
                                                    <option value="User">User</option>
                                                    <option value="Manager">Manager</option>
                                                    <option value="Admin">Admin</option>
                                                </select>
                                            ) : (
                                                <span className={getRoleBadgeClass(u.role)}>{u.role}</span>
                                            )}
                                        </td>
                                        <td>
                                            {u.is_email_verified ? (
                                                <UserCheck size={16} className="text-success" />
                                            ) : (
                                                <X size={16} className="text-danger" />
                                            )}
                                        </td>
                                        <td>{new Date(u.date_joined).toLocaleDateString()}</td>
                                        {(isAdmin || isManager) && (
                                            <td className="actions-cell">
                                                {editingUser === u.id ? (
                                                    <>
                                                        <button onClick={() => saveEdit(u.id)} className="action-btn save" title="Save">
                                                            <Save size={14} />
                                                        </button>
                                                        <button onClick={cancelEdit} className="action-btn cancel" title="Cancel">
                                                            <X size={14} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => startEdit(u)} className="action-btn edit" title="Edit">
                                                            <Edit size={14} />
                                                        </button>
                                                        {isAdmin && u.id !== user.id && (
                                                            <button onClick={() => handleDelete(u.id)} className="action-btn delete" title="Delete">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

