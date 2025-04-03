// src/components/Navbar.tsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import { useAuthUser } from "~/src/hooks/useUser";
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
import { UserAvatar } from "~/src/components/ui/Avatar/avatar";
import { toast } from "sonner";
import { LogoutButton } from "~/src/components/ui/User/logout";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    logout
  } = useAuthUser();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
    { href: "/contact", label: "Contato" },
  ];

  const shopCategories = [
    { href: "/shop/women", label: "Feminina" },
    { href: "/shop/men", label: "Masculina" },
    { href: "/shop/accessories", label: "Acessórios" },
    { href: "/shop/shoes", label: "Calçados" },
  ];

  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register");

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Você foi desconectado com sucesso");
      navigate("/");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-background"
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
                className="md:hidden"
                disabled={isLoading}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="py-6 border-b">
                  <Link
                  to="/"
                  className="font-serif text-2xl md:text-3xl font-light tracking-[0.2em] uppercase text-gray-900 dark:text-gray-100 transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[1px] after:bg-gray-400 after:dark:bg-gray-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                >
                  Ecliptica
                </Link>
                </div>

                <div className="flex-1 overflow-auto py-6 space-y-6">
                  <div className="space-y-3">
                    {navLinks.map((link) => (
                      <div key={link.href} className="space-y-3">
                        <Link
                          to={link.href}
                          className={cn(
                            "block py-2 text-base font-medium transition-colors",
                            location.pathname === link.href
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {link.label}
                        </Link>

                        {link.hasSubmenu && (
                          <div className="pl-4 space-y-3 border-l">
                            {shopCategories.map((category) => (
                              <Link
                                key={category.href}
                                to={category.href}
                                className={cn(
                                  "block py-1 text-sm transition-colors",
                                  location.pathname === category.href
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
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
                      <UserAvatar size="sm" showName />
                      <div className="space-y-2">
                        <Link
                          to="/profile"
                          className="block text-sm text-muted-foreground hover:text-foreground"
                        >
                          Meu Perfil
                        </Link>
                        <Link
                          to="/orders"
                          className="block text-sm text-muted-foreground hover:text-foreground"
                        >
                          Meus Pedidos
                        </Link>
                        <Link
                          to="/wishlist"
                          className="block text-sm text-muted-foreground hover:text-foreground"
                        >
                          Favoritos
                        </Link>
                        <SheetClose asChild>
                          <LogoutButton 
                            variant="button" 
                            className="w-full mt-2"
                          />
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
                          Entrar
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handleRegister}
                          disabled={isLoading}
                        >
                          Criar Conta
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link
            to="/"
            className="font-serif text-2xl md:text-3xl font-light tracking-[0.2em] uppercase text-gray-900 dark:text-gray-100 transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[1px] after:bg-gray-400 after:dark:bg-gray-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
          >
            Ecliptica
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) =>
              link.hasSubmenu ? (
                <DropdownMenu key={link.href}>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors outline-none">
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
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
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
                <div className="absolute right-0 top-full mt-2 w-[300px] bg-background shadow-lg rounded-md p-4 border">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={isLoading}>
                    {isAuthenticated ? (
                      <UserAvatar size="sm" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                    <span className="sr-only">Conta</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  {isAuthenticated ? (
                    <>
                      <div className="px-2 py-1.5 text-sm font-medium flex items-center gap-2">
                        <UserAvatar size="sm" />
                        <span>Olá, {user?.name || "Usuário"}</span>
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
                      <DropdownMenuItem onSelect={handleLogout}>
                        Sair
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onSelect={handleLogin}>
                        Entrar
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={handleRegister}>
                        Criar Conta
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Shopping Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative" disabled={isLoading}>
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
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