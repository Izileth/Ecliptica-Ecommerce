// ~/src/hooks/useProductRatings.ts
import { useEffect, useState } from "react"

interface ProductRating {
  id: string
  rating: number
  ratingCount: number
  likes: number
  hasLiked: boolean
}

export const useProductRatings = (productId: string) => {
  const [ratings, setRatings] = useState<ProductRating>(() => {
    // Carrega do localStorage ou gera dados iniciais
    const savedRatings = typeof window !== 'undefined' 
      ? localStorage.getItem('productRatings')
      : null
    
    const allRatings = savedRatings ? JSON.parse(savedRatings) : {}
    
    if (allRatings[productId]) {
      return allRatings[productId]
    }
    
    // Gera dados iniciais se não existir
    return {
      id: productId,
      rating: generateRandomRating(),
      ratingCount: Math.floor(Math.random() * 100) + 5,
      likes: Math.floor(Math.random() * 50),
      hasLiked: false
    }
  })

  // Atualiza o localStorage quando os ratings mudam
  useEffect(() => {
    const savedRatings = typeof window !== 'undefined' 
      ? localStorage.getItem('productRatings')
      : null
    
    const allRatings = savedRatings ? JSON.parse(savedRatings) : {}
    allRatings[productId] = ratings
    
    localStorage.setItem('productRatings', JSON.stringify(allRatings))
  }, [productId, ratings])

  const toggleLike = () => {
    setRatings(prev => {
      const newLikes = prev.hasLiked ? prev.likes - 1 : prev.likes + 1
      return {
        ...prev,
        likes: newLikes,
        hasLiked: !prev.hasLiked
      }
    })
  }

  return {
    ...ratings,
    toggleLike
  }
}

// Função para gerar avaliação aleatória (majoritariamente positiva)
const generateRandomRating = () => {
  const isPositive = Math.random() < 0.8
  const rating = isPositive 
    ? 4 + Math.random() // Entre 4.0 e 5.0
    : 3 + Math.random() // Entre 3.0 e 4.0
  
  return Number(rating.toFixed(1))
}