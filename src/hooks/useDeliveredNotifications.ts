import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

const STORAGE_KEY = 'bs-seen-delivered-orders';

function getSeenOrders(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function markOrderAsSeen(orderId: string) {
  const seen = getSeenOrders();
  if (!seen.includes(orderId)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen, orderId]));
  }
}

export interface DeliveredItem {
  orderId: string;
  orderNumber: string;
  type: 'course' | 'product';
  name: string;
  image: string;
  itemId: string;
  slug?: string;
}

export function useDeliveredNotifications() {
  const { isAuthenticated } = useAuthStore();
  const [items, setItems] = useState<DeliveredItem[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    api.getMyOrders().then((orders) => {
      const seen = getSeenOrders();
      const newItems: DeliveredItem[] = [];

      for (const order of orders) {
        if (order.status !== 'delivered') continue;
        if (seen.includes(order.id)) continue;

        for (const item of order.items) {
          newItems.push({
            orderId: order.id,
            orderNumber: order.orderNumber,
            type: item.type,
            name: item.name,
            image: item.image,
            itemId: item.itemId,
          });
        }
      }

      setItems(newItems);
    }).catch(() => {});
  }, [isAuthenticated]);

  const dismiss = (orderId: string) => {
    markOrderAsSeen(orderId);
    setItems((prev) => prev.filter((i) => i.orderId !== orderId));
  };

  const dismissAll = () => {
    const uniqueOrderIds = [...new Set(items.map((i) => i.orderId))];
    uniqueOrderIds.forEach(markOrderAsSeen);
    setItems([]);
  };

  return { items, dismiss, dismissAll };
}
