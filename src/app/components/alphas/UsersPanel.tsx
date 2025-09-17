'use client';

import React, { useState, useEffect } from 'react';
import { User, Search, Shield, Crown, Mail, Clock, Eye } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useAlphasApi } from '@/lib/alphas-api';

interface AdminUser {
  userAddress: string;
  role: 'super_admin' | 'editor' | 'viewer' | 'moderator';
  permissions: string[];
}

const UsersPanel: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const { address } = useAppContext();
  const alphasApi = useAlphasApi();

  // Load users from API
  const loadUsers = async () => {
    if (!address) {
      setLoading(false);
      return;
    }

    try {
      const data = await alphasApi.users.getAll();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      loadUsers();
    }
  }, [address]);

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.userAddress.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Role badge component
  const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
    const roleConfig = {
      super_admin: { color: 'bg-purple-100 text-purple-800', icon: Crown, label: 'Super Admin' },
      editor: { color: 'bg-blue-100 text-blue-800', icon: Shield, label: 'Editor' },
      moderator: { color: 'bg-yellow-100 text-yellow-800', icon: User, label: 'Moderator' },
      viewer: { color: 'bg-green-100 text-green-800', icon: Eye, label: 'Viewer' }
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.viewer;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon size={12} className="mr-1" />
        {config.label}
      </span>
    );
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Administración de Usuarios</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <User size={16} className="mr-2" />
            Agregar Usuario
          </button>
        </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por dirección..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Todos los Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="editor">Editor</option>
            <option value="moderator">Moderator</option>
            <option value="viewer">Viewer</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchQuery('');
              setRoleFilter('all');
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Cargando usuarios...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No se encontraron usuarios
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dirección de Wallet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permisos
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.userAddress} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      <div className="truncate max-w-xs" title={user.userAddress}>
                        {user.userAddress.slice(0, 6)}...{user.userAddress.slice(-4)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.slice(0, 2).map((permission, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {permission}
                          </span>
                        ))}
                        {user.permissions.length > 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            +{user.permissions.length - 2} más
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Editar Rol
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Crown className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Super Admins</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter(u => u.role === 'super_admin').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Editores</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter(u => u.role === 'editor').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <User className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Moderadores</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter(u => u.role === 'moderator').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
              <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Edit User Modal */}
      {(showAddForm || editingUser) && (
        <UserForm
          user={editingUser}
          onClose={() => {
            setShowAddForm(false);
            setEditingUser(null);
          }}
          onSave={loadUsers}
        />
      )}
    </div>
    </>
  );
};

// User Form Component
interface UserFormProps {
  user?: AdminUser | null;
  onClose: () => void;
  onSave: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose, onSave }) => {
  const [userAddress, setUserAddress] = useState(user?.userAddress || '');
  const [role, setRole] = useState<AdminUser['role']>(user?.role || 'viewer');
  const [saving, setSaving] = useState(false);

  const alphasApi = useAlphasApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userAddress || !role) {
      alert('Dirección de wallet y rol son requeridos');
      return;
    }

    if (!/^(0x)?[a-fA-F0-9]{40}$/.test(userAddress.replace('0x', ''))) {
      alert('Dirección de wallet no válida');
      return;
    }

    const normalizedAddress = userAddress.startsWith('0x') ? userAddress : `0x${userAddress}`;

    setSaving(true);
    try {
      await alphasApi.users.updateRole(normalizedAddress, role);
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error guardando usuario');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {user ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección de Wallet *
              </label>
              <input
                type="text"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent font-mono"
                required
                disabled={!!user} // Can't change address if editing
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AdminUser['role'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="viewer">Viewer - Solo lectura</option>
                <option value="moderator">Moderator - Manejar reports/flags</option>
                <option value="editor">Editor - CRUD proyectos (con aprobación)</option>
                <option value="super_admin">Super Admin - Control total</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? 'Guardando...' : (user ? 'Actualizar' : 'Agregar')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UsersPanel;
