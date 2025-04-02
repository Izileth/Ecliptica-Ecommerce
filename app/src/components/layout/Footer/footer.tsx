

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Instagram, Facebook, Twitter, Youtube, ArrowRight } from "lucide-react"
import { Button } from "~/src/components/ui/Button/button"
import { Input } from "~/src/components/ui/Input/input"


export default function Footer() {
    const [email, setEmail] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle newsletter signup
        console.log("Newsletter signup:", email)
        setEmail("")
        // You would typically call your API here
    }

    const year = new Date().getFullYear()

    return (
        <footer className="bg-zinc-50 border-t text-zinc-950">
        <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand Column */}
            <div className="space-y-6">
                <Link to="/" className="font-serif text-xl font-medium tracking-wider">
                MAISON
                </Link>
                <p className="text-sm text-muted-foreground max-w-xs">
                Curated collections of modern essentials, designed with quality and sustainability in mind.
                </p>
                <div className="flex items-center space-x-4">
                <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-black transition-colors"
                    aria-label="Instagram"
                >
                    <Instagram className="h-5 w-5" />
                </a>
                <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-black transition-colors"
                    aria-label="Facebook"
                >
                    <Facebook className="h-5 w-5" />
                </a>
                <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-black transition-colors"
                    aria-label="Twitter"
                >
                    <Twitter className="h-5 w-5" />
                </a>
                <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-black transition-colors"
                    aria-label="YouTube"
                >
                    <Youtube className="h-5 w-5" />
                </a>
                </div>
            </div>

            {/* Shop Column */}
            <div className="space-y-6">
                <h3 className="font-medium text-sm uppercase tracking-wider">Shop</h3>
                <nav className="flex flex-col space-y-3">
                <Link to="/shop/women" className="text-sm text-muted-foreground hover:text-black transition-colors">
                    Women
                </Link>
                <Link to="/shop/men" className="text-sm text-muted-foreground hover:text-black transition-colors">
                    Men
                </Link>
                <Link to="/shop/accessories" className="text-sm text-muted-foreground hover:text-black transition-colors">
                    Accessories
                </Link>
                <Link to="/shop/shoes" className="text-sm text-muted-foreground hover:text-black transition-colors">
                    Shoes
                </Link>
                <Link to="/new-arrivals" className="text-sm text-muted-foreground hover:text-black transition-colors">
                    New Arrivals
                </Link>
                <Link to="/sale" className="text-sm text-muted-foreground hover:text-black transition-colors">
                    Sale
                </Link>
                </nav>
            </div>

            {/* Company Column */}
            <div className="space-y-6">
                <h3 className="font-medium text-sm uppercase tracking-wider">Company</h3>
                <nav className="flex flex-col space-y-3">
                <Link to="/about" className="text-sm text-muted-foreground hover:text-black transition-colors">
                    About Us
                </Link>
                <Link to="/sustainability" className="text-sm text-muted-foreground hover:text-black transition-colors">
                    Sustainability
                </Link>
                <Link to="/careers" className="text-sm text-muted-foreground hover:text-black transition-colors">
                    Careers
                </Link>
                <Link to="/stores" className="text-sm text-muted-foreground hover:text-black transition-colors">
                    Store Locator
                </Link>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-black transition-colors">
                    Contact Us
                </Link>
                </nav>
            </div>

            {/* Newsletter Column */}
            <div className="space-y-6">
                <h3 className="font-medium text-sm uppercase tracking-wider">Stay Connected</h3>
                <p className="text-sm text-muted-foreground">
                Subscribe to our newsletter for exclusive offers and updates.
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex">
                    <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-r-none"
                    />
                    <Button type="submit" className="rounded-l-none">
                    <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    By subscribing, you agree to our Privacy Policy and consent to receive updates.
                </p>
                </form>
            </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-12 pt-8 border-t">
            <div className="flex flex-wrap gap-4 justify-center">
                <img src="../../../assets/cartoes.svg/bandeiras_catoes.png" alt="bandeiras" className="h-6" />
            </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-12 pt-8 border-t text-center md:flex md:justify-between md:text-left">
            <p className="text-xs text-muted-foreground">&copy; {year} MAISON. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
                <Link to="/terms" className="text-xs text-muted-foreground hover:text-black transition-colors">
                Terms of Service
                </Link>
                <Link to="/privacy" className="text-xs text-muted-foreground hover:text-black transition-colors">
                Privacy Policy
                </Link>
                <Link to="/shipping" className="text-xs text-muted-foreground hover:text-black transition-colors">
                Shipping Policy
                </Link>
                <Link to="/returns" className="text-xs text-muted-foreground hover:text-black transition-colors">
                Returns & Exchanges
                </Link>
            </div>
            </div>
        </div>
        </footer>
    )
}

