import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Users, Star, GraduationCap, SearchX } from 'lucide-react';
import { api } from '../services/api';
import { formatPrice } from '../lib/utils';
import type { Course } from '../types';
import { toast } from 'sonner';
import { EmptyState } from '../components/shared/EmptyState';
import { SearchField } from '../components/admin/SearchField';
import { AdminTable, THead, Th, TRow, Td } from '../components/admin/AdminTable';
import { IconButton, IconLink } from '../components/admin/RowActions';
import { ListSkeleton } from '../components/admin/ListSkeleton';
import { Thumb } from '../components/admin/Thumb';

const levelLabel: Record<Course['level'], string> = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCourses().then((data) => { setCourses(data); setLoading(false); });
  }, []);

  const filtered = courses.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este curso?')) return;
    await api.deleteCourse(id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
    toast.success('Curso eliminado');
  };

  const ratingLine = (rating: number) => (
    <span className="flex items-center gap-1 text-xs text-dark/65">
      <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
      <span className="sr-only">Calificación: </span>
      {rating}
    </span>
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchField
          label="Buscar cursos"
          placeholder="Buscar cursos..."
          value={search}
          onChange={setSearch}
          className="sm:w-full sm:max-w-sm"
        />
        <Link to="/admin/cursos/nuevo" className="btn btn-primary">
          <Plus className="size-5" aria-hidden="true" /> Crear curso
        </Link>
      </div>

      {loading ? (
        <ListSkeleton label="Cargando cursos..." />
      ) : courses.length === 0 ? (
        <EmptyState
          className="card"
          icon={GraduationCap}
          title="Todavía no hay cursos."
          action={
            <Link to="/admin/cursos/nuevo" className="btn btn-secondary">
              Crear el primero
            </Link>
          }
        >
          Cuando crees cursos, los vas a ver acá para editarlos o eliminarlos.
        </EmptyState>
      ) : filtered.length === 0 ? (
        <EmptyState
          className="card"
          icon={SearchX}
          title="No encontramos cursos."
          action={
            <button type="button" onClick={() => setSearch('')} className="btn btn-secondary">
              Limpiar búsqueda
            </button>
          }
        >
          Probá con otro título o limpiá la búsqueda.
        </EmptyState>
      ) : (
        <>
          <p aria-live="polite" className="text-sm text-dark/65">
            {search ? `${filtered.length} de ${courses.length} cursos` : `${courses.length} ${courses.length === 1 ? 'curso' : 'cursos'}`}
          </p>

          <AdminTable caption="Cursos de la tienda">
            <THead>
              <Th>Curso</Th>
              <Th>Nivel</Th>
              <Th align="right">Precio</Th>
              <Th align="right">Estudiantes</Th>
              <Th align="right">Acciones</Th>
            </THead>
            <tbody>
              {filtered.map((c) => (
                <TRow key={c.id}>
                  <Td className="w-full max-w-0">
                    <div className="flex items-center gap-3">
                      <Thumb src={c.coverImage} />
                      <div className="min-w-0">
                        <p className="line-clamp-2 font-medium text-dark">{c.title}</p>
                        {ratingLine(c.rating)}
                      </div>
                    </div>
                  </Td>
                  <Td className="whitespace-nowrap text-xs text-dark/75">{levelLabel[c.level] ?? c.level}</Td>
                  <Td align="right" className="whitespace-nowrap font-display font-semibold text-dark">{formatPrice(c.price)}</Td>
                  <Td align="right" className="whitespace-nowrap font-display text-dark">
                    <span className="inline-flex items-center justify-end gap-1.5">
                      <Users className="size-4 text-dark/55" aria-hidden="true" />
                      {c.enrolledCount}
                    </span>
                  </Td>
                  <Td align="right">
                    <div className="flex items-center justify-end gap-1">
                      <IconLink to={`/admin/cursos/${c.id}/builder`} icon={Pencil} label={`Editar ${c.title}`} />
                      <IconButton onClick={() => handleDelete(c.id)} icon={Trash2} tone="danger" label={`Eliminar ${c.title}`} />
                    </div>
                  </Td>
                </TRow>
              ))}
            </tbody>
          </AdminTable>

          <ul aria-label="Cursos de la tienda" className="space-y-3 md:hidden">
            {filtered.map((c) => (
              <li key={c.id}>
                <article className="card p-4">
                  <div className="flex items-start gap-3">
                    <Thumb src={c.coverImage} />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 font-display font-semibold text-dark">{c.title}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <span className="text-xs text-dark/65">{levelLabel[c.level] ?? c.level}</span>
                        {ratingLine(c.rating)}
                      </div>
                    </div>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-sand/60 pt-4">
                    <div>
                      <dt className="text-xs text-dark/65">Precio</dt>
                      <dd className="font-display font-semibold text-dark">{formatPrice(c.price)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-dark/65">Estudiantes</dt>
                      <dd className="font-display font-semibold text-dark">{c.enrolledCount}</dd>
                    </div>
                  </dl>
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-sand/60 pt-3">
                    <Link to={`/admin/cursos/${c.id}/builder`} className="btn btn-soft btn-sm min-h-11">
                      <Pencil className="size-4" aria-hidden="true" /> Editar
                      <span className="sr-only"> {c.title}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="btn btn-sm min-h-11 text-rose-700 hover:bg-rose-50"
                    >
                      <Trash2 className="size-4" aria-hidden="true" /> Eliminar
                      <span className="sr-only"> {c.title}</span>
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
