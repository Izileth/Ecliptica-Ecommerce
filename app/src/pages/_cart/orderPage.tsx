import { useState, useEffect } from "react";
import { Check, ArrowRight, Package, Calendar, Home, Download } from "lucide-react";

import { useNavigate } from "react-router-dom";
const OrderSuccessPage = () => {
    const [orderDetails, setOrderDetails] = useState({
        orderNumber: generateOrderNumber(),
        date: new Date().toLocaleDateString('pt-BR'),
        items: [
            { id: 1, name: "Aguardando Dados...", price: 0.00, quantity: 1 },
        ],
        total: 0.0,
        estimatedDelivery: getEstimatedDeliveryDate()
    });

    // Scroll para o topo ao carregar a página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const navigate = useNavigate()

    const handleSucess = () =>{
        navigate('/products')
    }
    const handleUserOrders = () => {
        navigate('/profile')
    }
    return (
        <div className="mt-24 p-6 max-w-4xl mx-auto">
        {/* Cabeçalho do sucesso */}
        <div className="text-center mb-12">
            <div className="mb-6 inline-flex">
            <div className="bg-green-500 text-white rounded-full p-4 h-24 w-24 flex items-center justify-center mx-auto">
                <Check className="h-12 w-12" />
            </div>
            </div>
            <h1 className="text-3xl font-light mb-2">Pedido Confirmado</h1>
            <p className="text-gray-600 max-w-md mx-auto">
            Obrigado pela sua compra! Enviamos um e-mail de confirmação com todos os detalhes do seu pedido.
            </p>
        </div>

        {/* Detalhes do pedido */}
        <div className="bg-white rounded-lg p-6 mb-8 ">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
            <div>
                <h2 className="text-xl font-medium">Detalhes do Pedido</h2>
                <p className="text-gray-600 text-sm mt-1">Pedido #{orderDetails.orderNumber}</p>
            </div>
            <div className="text-right">
                <p className="text-gray-600 text-sm">Data</p>
                <p>{orderDetails.date}</p>
            </div>
            </div>

            <div className="space-y-6">
            {/* Status do pedido com linha do tempo */}
            <div className="relative">
                <div className="flex justify-between items-start mb-2">
                <div className="text-green-500 font-medium">Pedido confirmado</div>
                <div className="text-gray-400">Entrega estimada</div>
                </div>
                
                <div className="relative flex items-center h-2 mb-2">
                <div className="h-1 bg-gray-200 absolute left-0 right-0"></div>
                <div className="h-2 w-2 rounded-full bg-green-500 absolute left-0"></div>
                <div className="h-1 bg-green-500 absolute left-0 w-1/5"></div>
                <div className="h-2 w-2 rounded-full bg-gray-300 absolute left-1/4"></div>
                <div className="h-2 w-2 rounded-full bg-gray-300 absolute left-1/2"></div>
                <div className="h-2 w-2 rounded-full bg-gray-300 absolute left-3/4"></div>
                <div className="h-2 w-2 rounded-full bg-gray-300 absolute right-0"></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                <span>Hoje</span>
                <span>Processando</span>
                <span>Enviado</span>
                <span>Em trânsito</span>
                <span>{orderDetails.estimatedDelivery}</span>
                </div>
            </div>

            {/* Lista de itens */}
            <div className="mt-6">
                <h3 className="font-medium mb-3">Itens ({orderDetails.items.length})</h3>
                <div className="space-y-3">
                {orderDetails.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                    <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                    </div>
                    <span>R${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
                
                <div className="border-t pt-3 mt-4">
                    <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>R${orderDetails.total.toFixed(2)}</span>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>

        {/* Cartões de informações */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 border-t-2 border-t-gray-200 p-4">
            <div className="bg-white rounded-lg p-4 ">
            <div className="flex items-start mb-2">
                <div className="mr-3 mt-1">
                <Package className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                <h3 className="font-medium text-sm">Rastreamento</h3>
                <p className="text-gray-600 text-sm mt-1">
                    Um código de rastreamento será enviado por e-mail quando seu pedido for despachado.
                </p>
                </div>
            </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 ">
            <div className="flex items-start mb-2">
                <div className="mr-3 mt-1">
                <Calendar className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                <h3 className="font-medium text-sm">Entrega estimada</h3>
                <p className="text-gray-600 text-sm mt-1">
                    {orderDetails.estimatedDelivery}
                </p>
                </div>
            </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 ">
            <div className="flex items-start mb-2">
                <div className="mr-3 mt-1">
                <Home className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                <h3 className="font-medium text-sm">Endereço de entrega</h3>
                <p className="text-gray-600 text-sm mt-1">
                    Endereço conforme informado no checkout
                </p>
                </div>
            </div>
            </div>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
            className="border border-gray-300 rounded-none py-2 px-4 flex items-center justify-center"
            onClick={handleUserOrders}
            >
            <Package className="mr-2 h-4 w-4" />
            Meus Pedidos
            </button>
            
            <button 
            className="bg-black text-white rounded-none py-2 px-4 flex items-center justify-center"
            onClick={handleSucess}
            >
            Continue Comprando
            <ArrowRight className="ml-2 h-4 w-4" />
            </button>
        </div>
        </div>
    );
};

// Funções auxiliares
function generateOrderNumber() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function getEstimatedDeliveryDate() {
    const date = new Date();
    date.setDate(date.getDate() + 7); // Adiciona 7 dias
    return date.toLocaleDateString('pt-BR');
}

export default OrderSuccessPage;