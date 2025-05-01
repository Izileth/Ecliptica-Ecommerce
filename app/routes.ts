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
    route("colections/womans", "routes/colections/girls.tsx"),
    route("colections/summer", "routes/colections/summer.tsx"),
    route("coletions/winter", "routes/colections/winter.tsx"),
    route("coletions/falls", "routes/colections/fall.tsx"),

    route("categorys/shirts", "routes/categorys/shirts.tsx"), //
    route("categorys/pants", "routes/categorys/pants.tsx"),
    route("categorys/dress", "routes/categorys/dress.tsx"),
    route("categorys/accessories", "routes/categorys/accessories.tsx"),
    
    route("releases", "routes/releases.tsx"),
    route("contact", "routes/contact.tsx"),

    route("profile", "routes/profile.tsx"),
    route("cart", "routes/cart/cart.tsx"),
    route("checkout", "routes/cart/checkout.tsx"),
    route("order-sucess", "routes/cart/order.tsx")
    
    
] satisfies RouteConfig;

