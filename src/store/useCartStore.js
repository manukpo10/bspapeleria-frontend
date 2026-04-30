import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get()
        const existing = items.find(
          (i) => i.referenciaId === item.referenciaId && i.tipoItem === item.tipoItem
        )
        if (existing) {
          set({
            items: items.map((i) =>
              i.referenciaId === item.referenciaId && i.tipoItem === item.tipoItem
                ? { ...i, cantidad: i.cantidad + 1 }
                : i
            ),
          })
        } else {
          set({ items: [...items, { ...item, cantidad: 1 }] })
        }
      },

      removeItem: (referenciaId, tipoItem) => {
        set({
          items: get().items.filter(
            (i) => !(i.referenciaId === referenciaId && i.tipoItem === tipoItem)
          ),
        })
      },

      updateQuantity: (referenciaId, tipoItem, cantidad) => {
        if (cantidad <= 0) {
          get().removeItem(referenciaId, tipoItem)
          return
        }
        set({
          items: get().items.map((i) =>
            i.referenciaId === referenciaId && i.tipoItem === tipoItem
              ? { ...i, cantidad }
              : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce((sum, i) => sum + Number(i.precio) * i.cantidad, 0),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.cantidad, 0),
    }),
    { name: 'cart-storage' }
  )
)

export default useCartStore
