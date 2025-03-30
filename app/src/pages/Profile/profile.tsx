

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '~/src/hooks/useAuth'
import { UserAvatar } from '~/src/components/ui/Avatar/avatar'
import { LogoutButton } from '~/src/components/ui/User/logout'
import { ProductService } from '~/src/services/produtcService'
import type { User, Product } from '~/src/services/type'
import { toast } from 'sonner'

// Components from shadcn/ui
import { Button } from '~/src/components/imported/button'
import { Input } from '~/src/components/imported/input'
import { Label } from '~/src/components/imported/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/src/components/imported/tabs'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '~/src/components/imported/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '~/src/components/imported/table'
import { Badge } from '~/src/components/imported/badge'
import { Skeleton } from '~/src/components/imported//skeleton'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '~/src/components/imported/alert-dialog'
import { UserService } from '~/src/services/userService'

export default function Profile() {
  const { user, logout} = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string>('profile')
  const [userData, setUserData] = useState({
    name: '',
    email: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState({
    profile: false,
    products: false,
    password: false,
    delete: false
  })
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Load user data
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name,
        email: user.email
      })
      loadUserProducts()
    }
  }, [user])

  const loadUserProducts = async () => {
    setLoading(prev => ({ ...prev, products: true }))
    try {
      const userProducts = await ProductService.getAll({ userId: user?.id })
      setProducts(userProducts)
    } catch (error) {
      toast.error('Falha ao carregar produtos')
    } finally {
      setLoading(prev => ({ ...prev, products: false }))
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(prev => ({ ...prev, profile: true }))
    
    try {
      if (!user?.id) throw new Error('Usuário não autenticado')
      
      // Chama o método atualizado do UserService
      const updatedUser = await UserService.updateProfile(user.id, {
        name: userData.name,
        email: userData.email
      })
      
      toast.success('Perfil atualizado com sucesso')
      // Atualiza os dados no contexto de autenticação se necessário
    } catch (error: any) {
      toast.error(error.message || 'Falha ao atualizar perfil')
    } finally {
      setLoading(prev => ({ ...prev, profile: false }))
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }
    
    if (!passwordData.currentPassword) {
      toast.error('A senha atual é obrigatória')
      return
    }
    
    setLoading(prev => ({ ...prev, profile: true }))
    
    try {
      if (!user?.id) throw new Error('Usuário não autenticado')
      
      // Usa o método específico para atualização de senha
      await UserService.updatePassword(
        user.id,
        passwordData.currentPassword,
        passwordData.newPassword
      )
      
      toast.success('Senha atualizada com sucesso')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error: any) {
      toast.error(error.message || 'Falha ao atualizar senha')
    } finally {
      setLoading(prev => ({ ...prev, profile: false }))
    }
  }
  

  const handleDeleteProduct = async (productId: string) => {
    try {
      await ProductService.delete(productId)
      toast.success('Produto removido com sucesso')
      loadUserProducts()
    } catch (error) {
      toast.error('Falha ao remover produto')
    }
  }

  const confirmAccountDeletion = async () => {
    setLoading(prev => ({ ...prev, delete: true }))
    try {
      if (user?.id) {
        await UserService.delete(user.id)
        logout()
        navigate('/login')
        toast.success('Sua conta foi excluída com sucesso')
      }
    } catch (error) {
      toast.error('Falha ao excluir conta')
    } finally {
      setLoading(prev => ({ ...prev, delete: false }))
      setShowDeleteDialog(false)
    }
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Acesso não autorizado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              Você precisa estar logado para acessar esta página
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate('/login')}>Ir para Login</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <Card className="h-full flex flex-col bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 border-0 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="items-center flex-col justify-start p-8 pb-6">
              <div className="p-1 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 shadow-inner">
                <UserAvatar 
                  size="md" 
                  className="w-20 h-20 text-3xl border-2 border-white dark:border-gray-800" 
                />
              </div>
              <CardTitle className="text-left mt-5 text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                {user?.name || 'Usuário'}
              </CardTitle>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-light tracking-wide">
                {user?.email || 'email@exemplo.com'}
              </p>
              <Badge 
                variant="outline" 
                className="mt-3 px-3 py-1 rounded-full border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-medium text-xs uppercase tracking-wider"
              >
                {user.isAdmin ? 'Administrador' : 'Usuário'}
              </Badge>
            </CardHeader>
            <CardFooter className="mt-auto p-0 border-t border-gray-100 dark:border-gray-700/50">
              <LogoutButton />
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
                        value={userData.name || ''}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userData.email || ''}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
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
                  {loading.products ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : products.length === 0 ? (
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
                        {products.map((product) => (
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
                              R$ {product.price.toFixed(2)}
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
                      />
                    </div>
                    <Button type="submit" disabled={loading.profile}>
                      {loading.profile ? 'Salvando...' : 'Alterar Senha'}
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
  )
}