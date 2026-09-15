import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { cart as cartApi } from '../../api/cart'

export function cartCount(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

export function cartTotal(items) {
  return items.reduce((sum, item) => sum + item.book.displayPrice * item.quantity, 0)
}

export function useCart() {
  const token = useSelector((state) => state.auth.token)
  return useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.list,
    enabled: !!token,
  })
}

export function useAddToCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['cart'],
    mutationFn: ({ productId, quantity }) => cartApi.add(productId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })
}

export function useUpdateCartItemQuantity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['cart'],
    mutationFn: ({ cartItemId, quantity }) => cartApi.updateQuantity(cartItemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['cart'],
    mutationFn: (cartItemId) => cartApi.remove(cartItemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })
}
