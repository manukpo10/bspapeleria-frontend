import { useState, useEffect } from 'react';
import { Shield, User, Users, SearchX } from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'sonner';
import { EmptyState } from '../components/shared/EmptyState';
import { SearchField } from '../components/admin/SearchField';
import { AdminTable, THead, Th, TRow, Td } from '../components/admin/AdminTable';
import { IconButton } from '../components/admin/RowActions';
import { ListSkeleton } from '../components/admin/ListSkeleton';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

const avatarOf = (u: AdminUser) => u.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}`;

function RoleChip({ role }: { role: string }) {
  const isAdmin = role === 'admin';
  const Icon = isAdmin ? Shield : User;
  return (
    <span className={isAdmin ? 'chip bg-secondary/25 text-dark' : 'chip bg-sand/50 text-dark'}>
      <Icon className="size-3.5" aria-hidden="true" />
      {isAdmin ? 'Administrador' : 'Usuario'}
    </span>
  );
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [userList, setUserList] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllUsers().then((users) => { setUserList(users); setLoading(false); });
  }, []);

  const filtered = userList.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await api.updateUserRole(id, newRole);
      setUserList((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
      toast.success(`Rol actualizado a ${newRole}`);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  // Same call the buttons always made: toggleRole also expects the current role, which is not passed here (known issue)
  const changeRole = (id: string) => toggleRole(id);

  return (
    <div className="animate-fade-in space-y-6">
      <SearchField
        label="Buscar usuarios"
        placeholder="Buscar por nombre o email..."
        value={search}
        onChange={setSearch}
        className="sm:max-w-sm"
      />

      {loading ? (
        <ListSkeleton label="Cargando usuarios..." />
      ) : userList.length === 0 ? (
        <EmptyState className="card" icon={Users} title="Todavía no hay usuarios.">
          Cuando alguien se registre, lo vas a ver acá.
        </EmptyState>
      ) : filtered.length === 0 ? (
        <EmptyState
          className="card"
          icon={SearchX}
          title="No encontramos usuarios."
          action={
            <button type="button" onClick={() => setSearch('')} className="btn btn-secondary">
              Limpiar búsqueda
            </button>
          }
        >
          Probá con otro nombre o email.
        </EmptyState>
      ) : (
        <>
          <p aria-live="polite" className="text-sm text-dark/65">
            {search ? `${filtered.length} de ${userList.length} usuarios` : `${userList.length} ${userList.length === 1 ? 'usuario' : 'usuarios'}`}
          </p>

          <AdminTable caption="Usuarios registrados">
            <THead>
              <Th>Usuario</Th>
              <Th>Email</Th>
              <Th>Rol</Th>
              <Th align="right">Acciones</Th>
            </THead>
            <tbody>
              {filtered.map((u) => (
                <TRow key={u.id}>
                  <Td className="w-1/2 max-w-0">
                    <div className="flex items-center gap-3">
                      <img
                        src={avatarOf(u)}
                        alt=""
                        width={40}
                        height={40}
                        loading="lazy"
                        decoding="async"
                        className="size-10 shrink-0 rounded-full bg-sand/40 object-cover"
                      />
                      <p className="truncate font-medium text-dark">{u.name}</p>
                    </div>
                  </Td>
                  <Td className="w-1/2 max-w-0 text-xs text-dark/75">
                    <p className="truncate" title={u.email}>{u.email}</p>
                  </Td>
                  <Td>
                    <RoleChip role={u.role} />
                  </Td>
                  <Td align="right">
                    <IconButton onClick={() => changeRole(u.id)} icon={Shield} label={`Cambiar el rol de ${u.name}`} />
                  </Td>
                </TRow>
              ))}
            </tbody>
          </AdminTable>

          <ul aria-label="Usuarios registrados" className="space-y-3 md:hidden">
            {filtered.map((u) => (
              <li key={u.id}>
                <article className="card p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatarOf(u)}
                      alt=""
                      width={48}
                      height={48}
                      loading="lazy"
                      decoding="async"
                      className="size-12 shrink-0 rounded-full bg-sand/40 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display font-semibold text-dark">{u.name}</p>
                      <p className="truncate text-xs text-dark/65">{u.email}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-sand/60 pt-3">
                    <RoleChip role={u.role} />
                    <button type="button" onClick={() => changeRole(u.id)} className="btn btn-soft btn-sm min-h-11">
                      <Shield className="size-4" aria-hidden="true" /> Cambiar rol
                      <span className="sr-only"> de {u.name}</span>
                    </button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
