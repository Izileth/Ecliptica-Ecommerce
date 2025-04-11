import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "~/src/hooks/useUser";
import { useProducts } from "~/src/hooks/useProducts"; // Importe o hook de produtos
import { UserAvatar } from "~/src/components/ui/Avatar/avatar";
import { toast } from "sonner";
import { formatPrice } from "~/src/utils/format";
import { LogoutButton } from "~/src/components/ui/User/logout";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserIcon,
  ShieldIcon,
  ShoppingBagIcon,
  ArrowRight,
  ChevronRight,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  LockIcon,
  AlertTriangleIcon,
  ChevronLeft,
} from "lucide-react";

// Components from shadcn/ui

import { Button } from "~/src/components/imported/button";
import { Input } from "~/src/components/imported/input";
import { Label } from "~/src/components/imported/label";
import { Separator } from "@radix-ui/react-dropdown-menu";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "~/src/components/imported/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/src/components/imported/table";
import { Badge } from "~/src/components/imported/badge";
import { Skeleton } from "~/src/components/imported/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/src/components/imported/alert-dialog";
import { AuthUserService } from "~/src/services/userService";

export default function Profile() {
  const {
    user,
    isLoading: authLoading,
    updateProfile,
    updatePassword,
    logout,
    clearError,
    fetchProfile,
  } = useAuthUser();

  const {
    userProducts,
    loading: productsLoading,
    getUserProducts,
    removeProduct,
  } = useProducts();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState({
    profile: false,
    password: false,
    delete: false,
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [show, setShow] = useState(false);

  // Carrega os dados do usuário quando o componente monta
  useEffect(() => {
    setTimeout(() => setShow(true), 300);

    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
      });
      getUserProducts(1);
    } else {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, profile: true }));
    clearError();

    try {
      const updatedUser = await updateProfile({
        name: profileData.name,
        email: profileData.email,
      });

      setProfileData({
        name: updatedUser.name,
        email: updatedUser.email,
      });

      toast.success("Perfil atualizado com sucesso");
    } catch (error: any) {
      toast.error(error.message || "Falha ao atualizar perfil");
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading((prev) => ({ ...prev, password: true }));
    clearError();

    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Senha atualizada com sucesso");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Falha ao atualizar senha");
    } finally {
      setLoading((prev) => ({ ...prev, password: false }));
    }
  };

  const confirmAccountDeletion = async () => {
    setLoading((prev) => ({ ...prev, delete: true }));
    try {
      await AuthUserService.deleteUser(user?.id || "");
      logout({ silent: true });
      navigate("/");
      toast.success("Sua conta foi excluída com sucesso");
    } catch (error: any) {
      toast.error(error.message || "Falha ao excluir conta");
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
      setShowDeleteDialog(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await removeProduct(productId);
      toast.success("Produto removido com sucesso");
    } catch (error) {
      toast.error("Falha ao remover produto");
    }
  };

  if (!user && !authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white px-4 w-full">
        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
                    Para acessar esta página, é necessário estar autenticado com
                    suas credenciais.
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
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => navigate(-1)}
        className="mb-10 flex items-center text-gray-500 hover:text-black transition-colors group"
      >
        <ChevronLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-light tracking-wide">Voltar</span>
      </motion.button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Dados do Usuário */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/4"
        >
          <Card className="h-full flex flex-col bg-white border-0 shadow-sm rounded-none overflow-hidden">
            {/* Header com foto e nome */}
            <CardHeader className="items-center flex-col justify-start p-8 pb-6 border-b border-gray-50">
              <div className="p-1 rounded-full bg-gradient-to-br from-gray-50 to-gray-100">
                <UserAvatar
                  size="lg"
                  className="border-2 border-white shadow-sm"
                />
              </div>
              <CardTitle className="text-center mt-5 text-2xl font-light tracking-tight text-gray-900">
                {user?.name || "Carregando..."}
              </CardTitle>
              <p className="text-gray-500 text-sm mt-1 font-light tracking-wide">
                {user?.email || "carregando@email.com"}
              </p>
              <Badge
                variant={user?.isAdmin ? "default" : "outline"}
                className="mt-3 px-3 py-1 rounded-none border-gray-200 bg-white/50 text-gray-700 font-light text-xs uppercase tracking-wider"
              >
                {user?.isAdmin ? "Administrador" : "Usuário"}
              </Badge>
            </CardHeader>

            {/* Conteúdo central */}
            <CardContent className="flex-1 p-0">
              <nav className="space-y-1 py-4">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center justify-between px-8 py-3 text-sm font-light transition-colors ${
                    activeTab === "profile"
                      ? "bg-gray-50 text-black"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <UserIcon className="w-4 h-4 mr-3 opacity-70" />
                    <span>Meu Perfil</span>
                  </div>
                  {activeTab === "profile" && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("products")}
                  className={`w-full flex items-center justify-between px-8 py-3 text-sm font-light transition-colors ${
                    activeTab === "products"
                      ? "bg-gray-50 text-black"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <ShoppingBagIcon className="w-4 h-4 mr-3 opacity-70" />
                    <span>Meus Produtos</span>
                  </div>
                  {activeTab === "products" && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center justify-between px-8 py-3 text-sm font-light transition-colors ${
                    activeTab === "security"
                      ? "bg-gray-50 text-black"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <LockIcon className="w-4 h-4 mr-3 opacity-70" />
                    <span>Segurança</span>
                  </div>
                  {activeTab === "security" && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {user?.isAdmin && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="w-full flex items-center justify-between px-8 py-3 text-sm font-light text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <ShieldIcon className="w-4 h-4 mr-3 opacity-70" />
                      <span>Área Admin</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                  </button>
                )}
              </nav>
            </CardContent>

            {/* Footer com logout */}
            <CardFooter className="p-0 border-t border-gray-50">
              <LogoutButton
                className="w-full flex items-center justify-center py-4 text-sm font-light text-gray-500 hover:text-red-500 transition-colors"
                showText={true}
              />
            </CardFooter>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full lg:w-3/4"
        >
          <AnimatePresence mode="wait">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-sm rounded-none overflow-hidden">
                  <CardHeader className="pb-2 border-b border-gray-50">
                    <CardTitle className="text-2xl font-light tracking-tight">
                      Informações do Perfil
                    </CardTitle>
                    <CardDescription className="text-gray-500 font-light">
                      Atualize suas informações pessoais
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-light text-gray-700"
                        >
                          Nome
                        </Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                          disabled={loading.profile}
                          className="h-10 rounded-none border-gray-200 focus:border-black focus:ring-0 font-light"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-light text-gray-700"
                        >
                          E-mail
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              email: e.target.value,
                            })
                          }
                          disabled={loading.profile}
                          className="h-10 rounded-none border-gray-200 focus:border-black focus:ring-0 font-light"
                        />
                      </div>
                      <div>
                        <Button
                          type="submit"
                          disabled={loading.profile}
                          className="bg-black hover:bg-black/90 text-white rounded-none font-light tracking-wide text-sm h-10 transition-colors duration-300"
                        >
                          {loading.profile
                            ? "Salvando..."
                            : "Salvar Alterações"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-sm rounded-none overflow-hidden">
                  <CardHeader className="pb-2 border-b border-gray-50 flex flex-row justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl font-light tracking-tight">
                        Meus Produtos
                      </CardTitle>
                      <CardDescription className="text-gray-500 font-light">
                        Gerencie seus produtos cadastrados
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => navigate("/products/new")}
                      className="bg-black hover:bg-black/90 text-white rounded-none font-light tracking-wide text-sm h-10 transition-colors duration-300"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Adicionar Produto
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    {productsLoading ? (
                      <div className="p-6 space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <Skeleton key={i} className="h-20 w-full" />
                        ))}
                      </div>
                    ) : userProducts.length === 0 ? (
                      <div className="text-center py-16">
                        <ShoppingBagIcon className="h-10 w-10 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 font-light">
                          Você ainda não cadastrou nenhum produto
                        </p>
                        <Button
                          onClick={() => navigate("/products/new")}
                          variant="outline"
                          className="mt-4 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-none font-light text-sm"
                        >
                          Adicionar Primeiro Produto
                        </Button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-gray-100">
                              <TableHead className="font-light text-gray-500">
                                Produto
                              </TableHead>
                              <TableHead className="font-light text-gray-500">
                                Preço
                              </TableHead>
                              <TableHead className="font-light text-gray-500">
                                Categoria
                              </TableHead>
                              <TableHead className="font-light text-gray-500 text-right">
                                Ações
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {userProducts.map((product) => (
                              <TableRow
                                key={product.id}
                                className="border-gray-50"
                              >
                                <TableCell className="font-light">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 flex items-center justify-center overflow-hidden">
                                      <img
                                        src={
                                          product.image || "/placeholder.svg"
                                        }
                                        alt={product.name}
                                        className="w-10 h-10 object-contain mix-blend-multiply"
                                      />
                                    </div>
                                    <span className="line-clamp-1">
                                      {product.name}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="font-light">
                                  {formatPrice(product.price)}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="rounded-none font-light text-xs border-gray-200 text-gray-700"
                                  >
                                    {product.category}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex gap-2 justify-end">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        navigate(`/products/${product.id}/edit`)
                                      }
                                      className="h-8 px-3 rounded-none border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-light text-xs"
                                    >
                                      <PencilIcon className="h-3 w-3 mr-1" />
                                      Editar
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleDeleteProduct(product.id)
                                      }
                                      className="h-8 px-3 rounded-none border-gray-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 font-light text-xs"
                                    >
                                      <TrashIcon className="h-3 w-3 mr-1" />
                                      Excluir
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-sm rounded-none overflow-hidden">
                  <CardHeader className="pb-2 border-b border-gray-50">
                    <CardTitle className="text-2xl font-light tracking-tight">
                      Segurança
                    </CardTitle>
                    <CardDescription className="text-gray-500 font-light">
                      Gerencie suas credenciais de acesso
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-8">
                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="currentPassword"
                          className="text-sm font-light text-gray-700"
                        >
                          Senha Atual *
                        </Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          required
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          disabled={loading.password}
                          className="h-10 rounded-none border-gray-200 focus:border-black focus:ring-0 font-light"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="newPassword"
                          className="text-sm font-light text-gray-700"
                        >
                          Nova Senha *
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          required
                          minLength={6}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          disabled={loading.password}
                          className="h-10 rounded-none border-gray-200 focus:border-black focus:ring-0 font-light"
                        />
                        <p className="text-xs text-gray-500 font-light">
                          Mínimo de 6 caracteres
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="confirmPassword"
                          className="text-sm font-light text-gray-700"
                        >
                          Confirmar Nova Senha *
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          required
                          minLength={6}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          disabled={loading.password}
                          className="h-10 rounded-none border-gray-200 focus:border-black focus:ring-0 font-light"
                        />
                      </div>
                      <div>
                        <Button
                          type="submit"
                          disabled={loading.password}
                          className="bg-black hover:bg-black/90 text-white rounded-none font-light tracking-wide text-sm h-10 transition-colors duration-300"
                        >
                          {loading.password ? "Salvando..." : "Alterar Senha"}
                        </Button>
                      </div>
                    </form>

                    <Separator className="my-8" />

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-red-500">
                        <AlertTriangleIcon className="h-5 w-5" />
                        <h3 className="text-lg font-light">Zona de Perigo</h3>
                      </div>
                      <p className="text-sm text-gray-500 font-light">
                        Ao excluir sua conta, todos os seus dados serão
                        removidos permanentemente. Esta ação não pode ser
                        desfeita.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteDialog(true)}
                        disabled={loading.delete}
                        className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 rounded-none font-light text-sm"
                      >
                        {loading.delete
                          ? "Processando..."
                          : "Excluir Minha Conta"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="border-0 rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-light tracking-tight">
              Tem certeza absoluta?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 font-light">
              Esta ação não pode ser desfeita. Isso excluirá permanentemente sua
              conta e removerá todos os seus dados de nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              disabled={loading.delete}
              className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-none font-light text-sm"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAccountDeletion}
              disabled={loading.delete}
              className="bg-red-500 hover:bg-red-600 text-white rounded-none font-light text-sm"
            >
              {loading.delete ? "Excluindo..." : "Excluir Conta"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
