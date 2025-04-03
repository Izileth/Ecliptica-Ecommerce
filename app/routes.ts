import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/auth/login.tsx"),
    route("register", "routes/auth/register.tsx"),
    route("forgot-password", "routes/auth/password.tsx"),
    route("reset-password", "routes/auth/reset.tsx"),
    route("products", "routes/products.tsx"),  // Listagem de produtos
    route("products/new", "routes/products/new.tsx"),  // Criação de produto
    route("products/:id/edit", "routes/products/edit.tsx"),  // Edição de produto
    route("products/:id", "routes/products/[id].tsx"),  // Visualização individual
    route("profile", "routes/profile.tsx")
] satisfies RouteConfig;

