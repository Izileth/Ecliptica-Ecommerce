import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { useCart } from "~/src/hooks/useCart"
import { useCheckout } from "~/src/hooks/useCheckout"
import { useAuthUser } from "~/src/hooks/useUser"

import { Check, CreditCard, Truck } from "lucide-react"
import { Button } from "~/src/components/imported/button"
import { Card } from "~/src/components/imported/card"
import { Input } from "~/src/components/imported/input"
import { Label } from "~/src/components/imported/label"

import { cn } from "~/src/lib/utils"

import { motion } from "framer-motion"

import type { CheckoutSessionRequest } from "~/src/services/type"

const CartSummary: React.FC<{ cart: any }> = ({ cart }) => {
  if (!cart) return null

  return (
    <Card className="p-6 sticky top-6">
      <h2 className="text-xl font-medium mb-4">Order Summary</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          {cart.items.map((item: any) => (
            <div key={item.id} className="flex items-center gap-3">
              {item.product?.image && (
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded-md bg-muted"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.product?.name}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">${(item.product?.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${cart.subtotal?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>${cart.shippingCost?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span>${cart.total?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, loading: cartLoading, error: cartError, getCart } = useCart()
  const { user, isAuthenticated } = useAuthUser()
  const { initiateCheckout, loading: checkoutLoading, error: checkoutError } = useCheckout()
  
  const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping")
  const [formData, setFormData] = useState({
    shipping: {
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Brasil'
    },
    payment: {
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvv: ''
    }
  })

  // Preenche o nome do usuário se estiver autenticado
  useEffect(() => {
    if (user?.name) {
      setFormData(prev => ({
        ...prev,
        shipping: {
          ...prev.shipping,
          name: user.name || ''
        }
      }))
    }
  }, [user])

  // Verifica autenticação e carrega carrinho
  useEffect(() => {
    if (!isAuthenticated) { // Remova os parênteses
      navigate('/login?redirect=/checkout')
      return
    }
  
    if (!cart && !cartLoading && !cartError) {
      getCart()
    }
  }, [isAuthenticated, navigate, cart, cartLoading, cartError, getCart])

 
  const handleSubmit = async () => {
    if (!cart || !user) return
  
    // Ajuste para corresponder ao CheckoutSessionRequest
    const request: CheckoutSessionRequest = {
      lineItems: cart.items.map((item: any) => ({ // Renomeado para lineItems
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      })),
      userId: user.id, // Adicione o userId diretamente
      customer: {
        userId: user.id,
        email: user.email,
        name: user.name
      },
      shippingAddress: {
        street: formData.shipping.street,
        city: formData.shipping.city,
        state: formData.shipping.state,
        postalCode: formData.shipping.postalCode,
        country: formData.shipping.country
      },
      paymentMethod: {
        type: 'credit_card',
        card: {
          number: formData.payment.cardNumber.replace(/\s/g, ''),
          name: formData.payment.cardName,
          expiry: formData.payment.expiry,
          cvc: formData.payment.cvv
        }
      }
    }
  
    try {
      await initiateCheckout(request)
    } catch (error) {
      console.error("Checkout failed:", error)
    }
  }

  const handleInputChange = (step: 'shipping' | 'payment', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        [field]: value
      }
    }))
  }

  // Formatadores para campos de pagamento
  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/')
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  }

  if (cartLoading && !cart) {
    return (
      <div className="container max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (cartError || !cart) {
    return (
      <div className="container max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="bg-red-100 p-4 rounded-md text-red-700 mb-6">
          {cartError || 'Error loading cart. Please try again.'}
        </div>
        <Button onClick={getCart}>Try Again</Button>
      </div>
    )
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Please add some products to your cart before proceeding to checkout.
          </p>
          <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex justify-between mb-12 max-w-2xl mx-auto">
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "rounded-full h-12 w-12 flex items-center justify-center transition-all duration-300",
              step === "shipping" ? "bg-primary text-primary-foreground" : "bg-green-500 text-white",
            )}
          >
            {step === "shipping" ? <span>1</span> : <Check className="h-5 w-5" />}
          </div>
          <span className="mt-2 text-sm font-medium">Shipping</span>
        </div>
        <div className="flex-1 border-t-2 self-center mx-4 border-gray-300"></div>
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "rounded-full h-12 w-12 flex items-center justify-center transition-all duration-300",
              step === "payment"
                ? "bg-primary text-primary-foreground"
                : step === "review"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600",
            )}
          >
            {step === "review" ? <Check className="h-5 w-5" /> : <span>2</span>}
          </div>
          <span className="mt-2 text-sm font-medium">Payment</span>
        </div>
        <div className="flex-1 border-t-2 self-center mx-4 border-gray-300"></div>
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "rounded-full h-12 w-12 flex items-center justify-center transition-all duration-300",
              step === "review" ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-600",
            )}
          >
            <span>3</span>
          </div>
          <span className="mt-2 text-sm font-medium">Review</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === "shipping" && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <h2 className="text-xl font-medium mb-6 flex items-center">
                <Truck className="mr-2 h-5 w-5" />
                Shipping Address
              </h2>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Your full name"
                      value={formData.shipping.name}
                      onChange={(e) => handleInputChange('shipping', 'name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      placeholder="(000) 000-0000"
                      value={formData.shipping.phone}
                      onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    placeholder="Street address, apt, suite, etc."
                    value={formData.shipping.street}
                    onChange={(e) => handleInputChange('shipping', 'street', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      placeholder="Your city"
                      value={formData.shipping.city}
                      onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input 
                      id="state" 
                      placeholder="State"
                      value={formData.shipping.state}
                      onChange={(e) => handleInputChange('shipping', 'state', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input 
                      id="zip" 
                      placeholder="00000"
                      value={formData.shipping.postalCode}
                      onChange={(e) => handleInputChange('shipping', 'postalCode', e.target.value)}
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <Button 
                    onClick={() => setStep("payment")} 
                    className="w-full" 
                    size="lg"
                    disabled={
                      !formData.shipping.name || 
                      !formData.shipping.street || 
                      !formData.shipping.city || 
                      !formData.shipping.state || 
                      !formData.shipping.postalCode
                    }
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === "payment" && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <h2 className="text-xl font-medium mb-6 flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Method
              </h2>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input 
                    id="cardNumber" 
                    placeholder="0000 0000 0000 0000"
                    value={formData.payment.cardNumber}
                    onChange={(e) => handleInputChange(
                      'payment', 
                      'cardNumber', 
                      formatCardNumber(e.target.value)
                    )}
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input 
                      id="cardName" 
                      placeholder="Name as it appears on card"
                      value={formData.payment.cardName}
                      onChange={(e) => handleInputChange('payment', 'cardName', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input 
                        id="expiry" 
                        placeholder="MM/YY"
                        value={formData.payment.expiry}
                        onChange={(e) => handleInputChange(
                          'payment', 
                          'expiry', 
                          formatExpiryDate(e.target.value)
                        )}
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input 
                        id="cvv" 
                        placeholder="123"
                        value={formData.payment.cvv}
                        onChange={(e) => handleInputChange(
                          'payment', 
                          'cvv', 
                          e.target.value.replace(/\D/g, '')
                         )}
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-4 grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => setStep("shipping")} size="lg">
                    Back
                  </Button>
                  <Button 
                    onClick={() => setStep("review")} 
                    size="lg"
                    disabled={
                      !formData.payment.cardNumber || 
                      !formData.payment.cardName || 
                      !formData.payment.expiry || 
                      !formData.payment.cvv ||
                      formData.payment.cardNumber.replace(/\s/g, '').length < 16 ||
                      formData.payment.expiry.length < 5 ||
                      formData.payment.cvv.length < 3
                    }
                  >
                    Review Order
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === "review" && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <h2 className="text-xl font-medium mb-6">Review Your Order</h2>
              <div className="space-y-6">
                <div className="border-b pb-5">
                  <h3 className="font-medium mb-3">Shipping Address</h3>
                  <p className="text-muted-foreground">
                    {formData.shipping.name}
                    <br />
                    {formData.shipping.street}
                    <br />
                    {formData.shipping.city}, {formData.shipping.state} - {formData.shipping.postalCode}
                    <br />
                    {formData.shipping.phone}
                  </p>
                </div>
                <div className="border-b pb-5">
                  <h3 className="font-medium mb-3">Payment Method</h3>
                  <p className="text-muted-foreground flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Credit Card ending in {formData.payment.cardNumber.slice(-4)}
                    <br />
                    Expires: {formData.payment.expiry}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Items ({cart.items.length})</h3>
                  <div className="space-y-3">
                    {cart.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <span className="font-medium">{item.product?.name}</span>
                          <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                        </div>
                        <span>${(item.product?.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-4 grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => setStep("payment")} size="lg">
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    size="lg"
                  >
                    Complete Purchase
                  </Button>
                </div>
                {checkoutError && (
                  <div className="text-red-500 text-sm mt-2">
                    {checkoutError}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
        <div>
          <CartSummary cart={cart} />
        </div>
      </div>
    </div>
  )
}