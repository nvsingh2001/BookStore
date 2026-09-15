import { mapBook } from './products'

describe('mapBook', () => {
  it('derives displayPrice by subtracting discount from price', () => {
    const book = mapBook({
      productId: '1',
      bookName: 'Foo',
      author: 'Bar',
      quantity: 5,
      price: 1000,
      discountPrice: 200,
    })
    expect(book.displayPrice).toBe(800)
  })

  it('defaults discount to 0 when discountPrice is missing', () => {
    const book = mapBook({
      productId: '1',
      bookName: 'Foo',
      author: 'Bar',
      quantity: 5,
      price: 1000,
    })
    expect(book.discount).toBe(0)
    expect(book.displayPrice).toBe(1000)
  })

  it('derives inStock from quantity', () => {
    expect(mapBook({ productId: '1', quantity: 0, price: 100 }).inStock).toBe(false)
    expect(mapBook({ productId: '1', quantity: 3, price: 100 }).inStock).toBe(true)
  })
})
