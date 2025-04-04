import React, { useState } from 'react';
import { useCart } from '~/src/hooks/useCart';
import CartSummary from '~/src/components/cart/Summary/cart.summary';
import { Button } from '~/src/components/imported/button';
import { Check, CreditCard, Truck } from 'lucide-react';

const CheckoutPage: React.FC = () => {
    const { cart, loading, error } = useCart();
    const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');

    if (loading) {
        return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        </div>
        );
    }

    if (error || !cart) {
        return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            <div className="bg-red-100 p-4 rounded-md text-red-700 mb-6">
            Erro ao carregar o carrinho. Por favor, tente novamente.
            </div>
        </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
            <div className="flex flex-col items-center">
            <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step === 'shipping' ? 'bg-primary text-primary-foreground' : 'bg-green-500 text-white'}`}>
                {step === 'shipping' ? <span>1</span> : <Check className="h-5 w-5" />}
            </div>
            <span className="mt-2 text-sm">Endereço</span>
            </div>
            <div className="flex-1 border-t-2 self-center mx-4 border-gray-300"></div>
            <div className="flex flex-col items-center">
            <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step === 'payment' ? 'bg-primary text-primary-foreground' : step === 'review' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {step === 'review' ? <Check className="h-5 w-5" /> : <span>2</span>}
            </div>
            <span className="mt-2 text-sm">Pagamento</span>
            </div>
            <div className="flex-1 border-t-2 self-center mx-4 border-gray-300"></div>
            <div className="flex flex-col items-center">
            <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step === 'review' ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-600'}`}>
                <span>3</span>
            </div>
            <span className="mt-2 text-sm">Confirmação</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
            {step === 'shipping' && (
                <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium mb-4 flex items-center">
                    <Truck className="mr-2 h-5 w-5" />
                    Endereço de Entrega
                </h2>
                <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nome</label>
                        <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Seu nome completo"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Telefone</label>
                        <input
                        type="tel"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="(00) 00000-0000"
                        />
                    </div>
                    </div>
                    <div>
                    <label className="block text-sm font-medium mb-1">Endereço</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Rua, número, complemento"
                    />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Cidade</label>
                        <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Sua cidade"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Estado</label>
                        <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="UF"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">CEP</label>
                        <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="00000-000"
                        />
                    </div>
                    </div>
                    <div className="pt-4">
                    <Button 
                        onClick={() => setStep('payment')}
                        className="w-full"
                    >
                        Continuar para Pagamento
                    </Button>
                    </div>
                </form>
                </div>
            )}

            {step === 'payment' && (
                <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium mb-4 flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Método de Pagamento
                </h2>
                <form className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium mb-1">Número do Cartão</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="0000 0000 0000 0000"
                    />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nome no Cartão</label>
                        <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Nome como aparece no cartão"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="block text-sm font-medium mb-1">Validade</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="MM/AA"
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium mb-1">CVV</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="123"
                        />
                        </div>
                    </div>
                    </div>
                    <div className="pt-4 grid grid-cols-2 gap-4">
                    <Button 
                        variant="outline" 
                        onClick={() => setStep('shipping')}
                    >
                        Voltar
                    </Button>
                    <Button 
                        onClick={() => setStep('review')}
                    >
                        Revisar Pedido
                    </Button>
                    </div>
                </form>
                </div>
            )}

            {step === 'review' && (
                <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium mb-4">Revise seu Pedido</h2>
                <div className="space-y-6">
                    <div className="border-b pb-4">
                    <h3 className="font-medium mb-2">Endereço de Entrega</h3>
                    <p className="text-gray-600">
                        João Silva<br />
                        Rua Exemplo, 123, Apto 45<br />
                        São Paulo, SP - 01234-567<br />
                        (11) 98765-4321
                    </p>
                    </div>
                    <div className="border-b pb-4">
                    <h3 className="font-medium mb-2">Método de Pagamento</h3>
                    <p className="text-gray-600">
                        Cartão de Crédito<br />
                        **** **** **** 1234<br />
                        Validade: 12/25
                    </p>
                    </div>
                    <div>
                    <h3 className="font-medium mb-2">Itens ({cart.items.length})</h3>
                    <div className="space-y-3">
                        {cart.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                            <div>
                            <span className="font-medium">{item.product?.name}</span>
                            <span className="text-gray-600 ml-2">x{item.quantity}</span>
                            </div>
                            <span>
                            R$ {((item.product?.price || 0) * item.quantity).toFixed(2)}
                            </span>
                        </div>
                        ))}
                    </div>
                    </div>
                    <div className="pt-4 grid grid-cols-2 gap-4">
                    <Button 
                        variant="outline" 
                        onClick={() => setStep('payment')}
                    >
                        Voltar
                    </Button>
                    <Button>
                        Finalizar Compra
                    </Button>
                    </div>
                </div>
                </div>
            )}
            </div>
            <div>
            <CartSummary cart={cart} />
            </div>
        </div>
        </div>
    );
};

export default CheckoutPage;