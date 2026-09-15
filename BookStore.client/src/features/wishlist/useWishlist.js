import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { wishlist as wishlistApi } from '../../api/wishlist'

export function isInWishlist(items, productId) {
  return items.some((item) => item.book.id === productId)
}

export function useWishlist() {
  const token = useSelector((state) => state.auth.token)
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistApi.list,
    enabled: !!token,
  })
}

export function useAddToWishlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['wishlist'],
    mutationFn: (productId) => wishlistApi.add(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  })
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['wishlist'],
    mutationFn: (productId) => wishlistApi.remove(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  })
}
