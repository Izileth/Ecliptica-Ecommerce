import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),

    route("login", "routes/auth/login.tsx"),
    route("register", "routes/auth/register.tsx"),
    route("forgot", "routes/auth/password.tsx"),
    route("reset-password", "routes/auth/reset.tsx"),

    route("products", "routes/products.tsx"),  // Listagem de produtos
    route("products/new", "routes/products/new.tsx"),  // Criação de produto
    route("products/:id/edit", "routes/products/edit.tsx"),  // Edição de produto
    route("products/:id", "routes/products/[id].tsx"),  // Visualização individual


    route("colections/mens", "routes/colections/mens.tsx"),
    route("colections/girls", "routes/colections/girls.tsx"),
    route("colections/unisex", "routes/colections/unisex.tsx"),
    route("coletions/season", "routes/colections/season.tsx"),

    route("releases", "routes/releases.tsx"),
    route("contact", "routes/contact.tsx"),

    route("shirts", "routes/categorys/shirts.tsx"), //
    route("pants", "routes/categorys/pants.tsx"),
    route("dress", "routes/categorys/dress.tsx"),
    route("accessories", "routes/categorys/accessories.tsx"),
    
    route("profile", "routes/profile.tsx"),
    route("cart", "routes/cart/cart.tsx"),
    route("checkout", "routes/cart/checkout.tsx")
] satisfies RouteConfig;

