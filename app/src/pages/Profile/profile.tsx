import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from '~/src/hooks/useUser';
import { useProducts } from '~/src/hooks/useStorage' // Importe o hook de produtos
import { UserAvatar } from '~/src/components/ui/Avatar/avatar';
import { toast } from 'sonner';
import { formatPrice } from '~/src/utils/format';
import { motion } from "framer-motion";
import { LogoutButton } from '~/src/components/ui/User/logout';
import { UserIcon } from 'lucide-react';
import { ShieldIcon } from 'lucide-react';
import { ShoppingBagIcon, ArrowRight } from 'lucide-react';
// Components from shadcn/ui

import { Button } from '~/src/components/imported/button';
import { Input } from '~/src/components/imported/input';
import { Label } from '~/src/components/imported/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/src/components/imported/tabs';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '~/src/components/imported/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '~/src/components/imported/table';
import { Badge } from '~/src/components/imported/badge';
import { Skeleton } from '~/src/components/imported/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '~/src/components/imported/alert-dialog';
import { AuthUserService } from '~/src/services/userService';

export default function Profile() {
  const { 
    user, 
    isLoading: authLoading,
    updateProfile,
    updatePassword,
    logout,
    clearError,
    fetchProfile // Adicionar para recarregar os dados
  } = useAuthUser();

  const {
    userProducts,
    loading: productsLoading,
    getUserProducts,
    removeProduct
  } = useProducts() // Use o hook de produtos

  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState({
    profile: false,
    password: false,
    delete: false
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [show, setShow] = useState(false);

  // Carrega os dados do usuário quando o componente monta
  useEffect(() => {
    setTimeout(() => setShow(true), 300);
    
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email
      });
      getUserProducts(1);
    } else {
      fetchProfile(); // Carrega os dados do perfil se não estiverem carregados
    }
  }, [user, fetchProfile]); // Adicionar fetchProfile nas dependências

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, profile: true }));
    clearError();
    
    try {
      const updatedUser = await updateProfile({
        name: profileData.name,
        email: profileData.email
      });
      
      // Atualiza os dados locais com a resposta do servidor
      setProfileData({
        name: updatedUser.name,
        email: updatedUser.email
      });
      
      toast.success('Perfil atualizado com sucesso');
    } catch (error: any) {
      toast.error(error.message || 'Falha ao atualizar perfil');
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setLoading(prev => ({ ...prev, password: true }));
    clearError();
    
    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      toast.success('Senha atualizada com sucesso');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast.error(error.message || 'Falha ao atualizar senha');
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  };


  const confirmAccountDeletion = async () => {
    setLoading(prev => ({ ...prev, delete: true }));
    try {
      await AuthUserService.deleteUser(user?.id || '');
      logout({ silent: true });
      navigate('/');
      toast.success('Sua conta foi excluída com sucesso');
    } catch (error: any) {
      toast.error(error.message || 'Falha ao excluir conta');
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
      setShowDeleteDialog(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await removeProduct(productId)
      toast.success('Produto removido com sucesso')
      // Não precisamos chamar loadUserProducts() pois o Redux já atualiza o estado
    } catch (error) {
      toast.error('Falha ao remover produto')
    }
  }

  if (!user && !authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white px-4">
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-full max-w-md"
        >
          <Card className="overflow-hidden border-0 shadow-none">
            <CardHeader className="pb-2 pt-10">
              <div className="mx-auto h-px w-16 bg-black/10 mb-8" />
              <CardTitle className="text-center text-4xl font-light tracking-tight text-black">
                Acesso Restrito
              </CardTitle>
            </CardHeader>

            <CardContent className="px-8 pt-4">
              <p className="text-center text-gray-500 text-sm font-light leading-relaxed max-w-xs mx-auto">
                Para acessar esta página, é necessário estar autenticado com suas credenciais.
              </p>
            </CardContent>

            <CardFooter className="flex flex-col items-center pb-10 pt-6">
              <motion.div
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="bg-black hover:bg-black/90 text-white px-8 py-6 h-10 rounded-none font-light tracking-wide text-sm transition-colors duration-300"
                  onClick={() => navigate("/login")}
                >
                  Ir para Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>

              <motion.button
                className="mt-6 text-xs text-gray-400 hover:text-gray-600 font-light underline-offset-4 hover:underline transition-colors"
                onClick={() => navigate("/")}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Voltar para página inicial
              </motion.button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar - Dados do Usuário */}
        {/* Sidebar - Dados do Usuário */}
        <div className="w-full md:w-1/4">
          <Card className="h-full flex flex-col bg-white border border-gray-100 rounded-lg overflow-hidden shadow-xs">
            {/* Header com foto e nome */}
            <CardHeader className="items-center flex-col justify-start p-6 pb-4 border-b border-gray-50">
              <div className="p-1 rounded-full border border-gray-100 shadow-sm">
                <UserAvatar 
                  size="lg" 
                  className="border-2 border-white shadow-sm"
                />
              </div>
              <CardTitle className="text-center mt-4 text-xl font-medium text-gray-900">
                {user?.name || 'Carregando...'}
              </CardTitle>
              <p className="text-gray-500 text-xs mt-1 font-light">
                {user?.email || 'carregando@email.com'}
              </p>
            </CardHeader>

            {/* Conteúdo central (pode adicionar mais itens de menu aqui) */}
            <div className="flex-1 p-4 space-y-2">
              <div className="flex items-center p-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <UserIcon className="w-4 h-4 mr-3 text-gray-400" />
                Meu Perfil
              </div>
              <div className="flex items-center p-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <ShoppingBagIcon className="w-4 h-4 mr-3 text-gray-400" />
                Meus Pedidos
              </div>
              {user?.isAdmin && (
                <div className="flex items-center p-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <ShieldIcon className="w-4 h-4 mr-3 text-gray-400" />
                  Área Admin
                </div>
              )}
            </div>

            {/* Footer com badge de status e logout */}
            <CardFooter className="p-4 border-t border-gray-50 flex flex-col items-center">
              <Badge 
                variant={user?.isAdmin ? "default" : "secondary"}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium mb-3"
              >
                {user?.isAdmin ? 'Administrador' : 'Membro'}
              </Badge>
              <LogoutButton 
                className="text-xs text-gray-500 hover:text-red-500 flex items-center"
                showText={true}
              />
            </CardFooter>
          </Card>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="products">Meus Produtos</TabsTrigger>
              <TabsTrigger value="security">Segurança</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Perfil</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={loading.profile}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={loading.profile}
                      />
                    </div>
                    <Button type="submit" disabled={loading.profile}>
                      {loading.profile ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products">
              <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle>Meus Produtos</CardTitle>
                  <Button onClick={() => navigate('/products/new')}>
                    Adicionar Produto
                  </Button>
                </CardHeader>
                <CardContent>
                {productsLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : userProducts.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Você ainda não cadastrou nenhum produto</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead>Preço</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-4">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-10 h-10 object-cover rounded"
                                />
                                {product.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              R$ {formatPrice(product.price)}
                              </TableCell>
                            <TableCell>
                              <Badge variant="outline">{product.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/products/${product.id}/edit`)}
                                >
                                  Editar
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  Excluir
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Senha Atual *</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        required
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value
                          })
                        }
                        disabled={loading.password}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nova Senha *</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        required
                        minLength={6}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value
                          })
                        }
                        disabled={loading.password}
                      />
                      <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Nova Senha *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        required
                        minLength={6}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value
                          })
                        }
                        disabled={loading.password}
                      />
                    </div>
                    <Button type="submit" disabled={loading.password}>
                      {loading.password ? 'Salvando...' : 'Alterar Senha'}
                    </Button>
                  </form>
                  <div className="border-t pt-6">
                    <Card className="border-destructive">
                      <CardHeader>
                        <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Ao excluir sua conta, todos os seus dados serão removidos permanentemente.
                        </p>
                        <Button
                          variant="destructive"
                          onClick={() => setShowDeleteDialog(true)}
                          disabled={loading.delete}
                        >
                          {loading.delete ? 'Processando...' : 'Excluir Minha Conta'}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta
              e removerá todos os seus dados de nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading.delete}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAccountDeletion}
              disabled={loading.delete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading.delete ? 'Excluindo...' : 'Excluir Conta'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}