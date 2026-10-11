import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Package, SearchX } from 'lucide-react';
import { api } from '../services/api';
import { formatPrice } from '../lib/utils';
import { PRODUCT_CATEGORIES } from '../lib/constants';
import type { Product } from '../types';
import { toast } from 'sonner';
import { EmptyState } from '../components/shared/EmptyState';
import { SearchField } from '../components/admin/SearchField';
import { AdminTable, THead, Th, TRow, Td } from '../components/admin/AdminTable';
import { IconButton, IconLink } from '../components/admin/RowActions';
import { ListSkeleton } from '../components/admin/ListSkeleton';
import { Thumb } from '../components/admin/Thumb';

const categoryLabel = (category: string) => PRODUCT_CATEGORIES.find((c) => c.id === category)?.name ?? category;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts().then((data) => { setProducts(data); setLoading(false); });
  }, []);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return;
    await api.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success('Producto eliminado');
  };

  const stockCell = (stock: number) => (stock === 0 ? <span className="chip bg-error/40 text-dark">Sin stock</span> : stock);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchField
          label="Buscar productos"
          placeholder="Buscar productos..."
          value={search}
          onChange={setSearch}
          className="sm:w-full sm:max-w-sm"
        />
        <Link to="/admin/productos/nuevo" className="btn btn-primary">
          <Plus className="size-5" aria-hidden="true" /> Nuevo producto
        </Link>
      </div>

      {loading ? (
        <ListSkeleton label="Cargando productos..." />
      ) : products.length === 0 ? (
        <EmptyState
          className="card"
          icon={Package}
          title="Todavía no hay productos."
          action={
            <Link to="/admin/productos/nuevo" className="btn btn-secondary">
              Crear el primero
            </Link>
          }
        >
          Cuando cargues productos, los vas a ver acá para editarlos o eliminarlos.
        </EmptyState>
      ) : filtered.length === 0 ? (
        <EmptyState
          className="card"
          icon={SearchX}
          title="No encontramos productos."
          action={
            <button type="button" onClick={() => setSearch('')} className="btn btn-secondary">
              Limpiar búsqueda
            </button>
          }
        >
          Probá con otro nombre o limpiá la búsqueda.
        </EmptyState>
      ) : (
        <>
          <p aria-live="polite" className="text-sm text-dark/65">
            {search ? `${filtered.length} de ${products.length} productos` : `${products.length} ${products.length === 1 ? 'producto' : 'productos'}`}
          </p>

          <AdminTable caption="Productos de la tienda">
            <THead>
              <Th>Producto</Th>
              <Th>Categoría</Th>
              <Th align="right">Precio</Th>
              <Th align="right">Stock</Th>
              <Th align="right">Acciones</Th>
            </THead>
            <tbody>
              {filtered.map((p) => (
                <TRow key={p.id}>
                  <Td className="w-full max-w-0">
                    <div className="flex items-center gap-3">
                      <Thumb src={p.images[0]} />
                      <p className="line-clamp-2 min-w-0 font-medium text-dark">{p.name}</p>
                    </div>
                  </Td>
                  <Td className="text-xs text-dark/75">{categoryLabel(p.category)}</Td>
                  <Td align="right" className="whitespace-nowrap font-display font-semibold text-dark">{formatPrice(p.price)}</Td>
                  <Td align="right" className="whitespace-nowrap font-display text-dark">{stockCell(p.stock)}</Td>
                  <Td align="right">
                    <div className="flex items-center justify-end gap-1">
                      <IconLink to={`/admin/productos/${p.id}/builder`} icon={Pencil} label={`Editar ${p.name}`} />
                      <IconButton onClick={() => handleDelete(p.id)} icon={Trash2} tone="danger" label={`Eliminar ${p.name}`} />
                    </div>
                  </Td>
                </TRow>
              ))}
            </tbody>
          </AdminTable>

          <ul aria-label="Productos de la tienda" className="space-y-3 md:hidden">
            {filtered.map((p) => (
              <li key={p.id}>
                <article className="card p-4">
                  <div className="flex items-start gap-3">
                    <Thumb src={p.images[0]} />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 font-display font-semibold text-dark">{p.name}</p>
                      <p className="mt-0.5 text-xs text-dark/65">{categoryLabel(p.category)}</p>
                    </div>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-sand/60 pt-4">
                    <div>
                      <dt className="text-xs text-dark/65">Precio</dt>
                      <dd className="font-display font-semibold text-dark">{formatPrice(p.price)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-dark/65">Stock</dt>
                      <dd className="font-display font-semibold text-dark">{stockCell(p.stock)}</dd>
                    </div>
                  </dl>
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-sand/60 pt-3">
                    <Link to={`/admin/productos/${p.id}/builder`} className="btn btn-soft btn-sm min-h-11">
                      <Pencil className="size-4" aria-hidden="true" /> Editar
                      <span className="sr-only"> {p.name}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="btn btn-sm min-h-11 text-rose-700 hover:bg-rose-50"
                    >
                      <Trash2 className="size-4" aria-hidden="true" /> Eliminar
                      <span className="sr-only"> {p.name}</span>
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
