// src/components/Navbar.tsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import { useAuthStore } from "~/src/store/authStore";
import { cn } from "~/src/lib/utils";
import { Button } from "~/src/components/ui/Button/button";
import { Input } from "~/src/components/ui/Input/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/src/components/imported/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "~/src/components/ui/Sheet/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "~/src/components/imported/avatar";
import { toast } from "sonner";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    isLoading,
    login,
    logout,
    error,
    resetError
  } = useAuthStore();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated());
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Resetar erros ao desmontar o componente
  useEffect(() => {
    return () => {
      if (error) resetError();
    };
  }, [error, resetError]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/shop", label: "Coleções", hasSubmenu: true },
    { href: "/", label: "Lançamentos" },
    { href: "/products", label: "Produtos" },
    ...(isAuthenticated ? [{ href: "/profile", label: "Perfil" }] : []),
    { href: "/contact", label: "Contato" },
  ];

  const shopCategories = [
    { href: "/shop/women", label: "Feminina" },
    { href: "/shop/men", label: "Masculina" },
    { href: "/shop/accessories", label: "Acessórios" },
    { href: "/shop/shoes", label: "Calçados" },
  ];

  const handleLogin = async () => {
    try {
      navigate("/login"); 
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Você foi desconectado com sucesso");
      // Opcional: redirecionar para home após logout
      navigate("/"); 
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "US";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-zinc-50 backdrop-blur-sm shadow-sm" : "bg-zinc-50"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-zinc-950"
                disabled={isLoading}
              >
                <Menu className="h-5 w-5 text-zinc-950" />
                <span className="sr-only text-zinc-950">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[300px] sm:w-[350px] text-zinc-950 bg-zinc-50"
            >
              <div className="flex flex-col h-full bg-zinc-50 text-zinc-950">
                <div className="py-6 border-b bg-zinc-50">
                  <Link
                    to="/"
                    className="font-serif text-xl font-medium tracking-wide text-zinc-950"
                  >
                    STUDIO +
                  </Link>
                </div>

                <div className="flex-1 overflow-auto py-6 space-y-6 bg-zinc-50">
                  <div className="space-y-3 bg-zinc-50">
                    {navLinks.map((link) => (
                      <div key={link.href} className="space-y-3">
                        <Link
                          to={link.href}
                          className={cn(
                            "block py-2 text-base font-medium transition-colors",
                            location.pathname === link.href
                              ? "text-zinc-950"
                              : "text-muted-foreground hover:text-black"
                          )}
                        >
                          {link.label}
                        </Link>

                        {link.hasSubmenu && (
                          <div className="pl-4 space-y-3 border-l text-zinc-950">
                            {shopCategories.map((category) => (
                              <Link
                                key={category.href}
                                to={category.href}
                                className={cn(
                                  "block py-1 text-sm transition-colors",
                                  location.pathname === category.href
                                    ? "text-black"
                                    : "text-muted-foreground hover:text-black"
                                )}
                              >
                                {category.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t py-6">
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.image} />
                          <AvatarFallback>
                            {getInitials(user?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium">Olá, {user?.name || "Usuário"}</p>
                      </div>
                      <div className="space-y-2">
                        <Link
                          to="/profile"
                          className="block text-sm text-muted-foreground hover:text-black"
                        >
                          Meu Perfil
                        </Link>
                        <Link
                          to="/orders"
                          className="block text-sm text-muted-foreground hover:text-black"
                        >
                          Meus Pedidos
                        </Link>
                        <Link
                          to="/wishlist"
                          className="block text-sm text-muted-foreground hover:text-black"
                        >
                          Favoritos
                        </Link>
                        <SheetClose asChild>
                          <Button
                            variant="outline"
                            className="w-full mt-2"
                            onClick={handleLogout}
                            disabled={isLoading}
                          >
                            {isLoading ? "Saindo..." : "Sair"}
                          </Button>
                        </SheetClose>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <SheetClose asChild>
                        <Button
                          variant="default"
                          className="w-full"
                          onClick={handleLogin}
                          disabled={isLoading}
                        >
                          {isLoading ? "Carregando..." : "Entrar"}
                        </Button>
                      </SheetClose>
                      <Link to="/register" className="w-full">
                        <Button variant="outline" className="w-full" disabled={isLoading}>
                          Criar Conta
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link
            to="/"
            className="font-serif text-xl md:text-2xl font-medium tracking-wider text-zinc-950"
          >
            STUDIO +
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-zinc-950">
            {navLinks.map((link) =>
              link.hasSubmenu ? (
                <DropdownMenu key={link.href}>
                  <DropdownMenuTrigger className="bg-zinc-50 flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-black transition-colors outline-none">
                    {link.label}
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-[180px]">
                    {shopCategories.map((category) => (
                      <DropdownMenuItem key={category.href} asChild>
                        <Link to={category.href}>{category.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    location.pathname === link.href
                      ? "text-black"
                      : "text-muted-foreground hover:text-black"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4 text-zinc-950">
            {/* Search */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
                disabled={isLoading}
              >
                {isSearchOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </Button>

              {isSearchOpen && (
                <div className="absolute right-0 top-full mt-2 w-[300px] bg-zinc-50 shadow-lg rounded-md p-4 border">
                  <form className="flex items-center">
                    <Input
                      type="search"
                      placeholder="Buscar produtos..."
                      className="flex-1"
                      autoFocus
                    />
                    <Button type="submit" size="icon" variant="ghost">
                      <Search className="h-4 w-4" />
                      <span className="sr-only">Buscar</span>
                    </Button>
                  </form>
                </div>
              )}
            </div>

            {/* User Account */}
            <div className="hidden md:block">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={isLoading}>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.image} />
                        <AvatarFallback>
                          {getInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="sr-only">Conta</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <div className="px-2 py-1.5 text-sm font-medium flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user?.image} />
                        <AvatarFallback>
                          {getInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      Olá, {user?.name || "Usuário"}
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Meu Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders">Meus Pedidos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/wishlist">Favoritos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      disabled={isLoading}
                    >
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={isLoading}>
                      <User className="h-5 w-5" />
                      <span className="sr-only">Conta</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem 
                      onClick={handleLogin}
                      disabled={isLoading}
                    >
                      Entrar
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register">Criar Conta</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Shopping Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative" disabled={isLoading}>
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-medium text-white">
                  {/* Aqui você pode adicionar a quantidade de itens no carrinho */}
                  0
                </span>
                <span className="sr-only">Carrinho</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}