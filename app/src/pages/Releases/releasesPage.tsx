import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLatestReleases } from "~/src/hooks/useRenderBy"
import ProductCard from "~/src/components/products/Card/card"
import { ShoppingBag, RefreshCw, ArrowRight, Package } from "lucide-react"
import { Button } from "~/src/components/imported/button"
import { Skeleton } from "~/src/components/imported/skeleton"

export default function LatestReleasesPage() {
    const { latestProducts, loading, error, refreshLatestProducts } = useLatestReleases(6, 12)
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Ensure products have the 'image' property defined to avoid errors
    const safeProducts = latestProducts.map((product) => {
        if (!product.image) {
        return {
            ...product,
            image: "/placeholder.svg?height=400&width=400", // Path to a default image
        }
        }
        return product
    })

    // Effect to update products automatically on each page visit
    useEffect(() => {
        // When the page is loaded, this ensures a "fresh content" experience
        if (!loading && safeProducts.length > 0) {
        const timer = setTimeout(() => {
            refreshLatestProducts()
        }, 500) // Small delay to give time for the page to load

        return () => clearTimeout(timer)
        }
    }, [loading, safeProducts.length, refreshLatestProducts])

    // Handle refresh with animation
    const handleRefresh = () => {
        setIsRefreshing(true)
        refreshLatestProducts()
        setTimeout(() => setIsRefreshing(false), 1000)
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
        },
    }

    return (
        <div className="min-h-screen bg-neutral-50 mt-20">
        {/* Hero section */}
        <section className="relative overflow-hidden bg-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)]" />
            <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mx-auto max-w-2xl text-center"
            >
                <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100"
                >
                <ShoppingBag className="h-8 w-8 text-neutral-900" />
                </motion.div>
                <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-3xl font-light tracking-tight text-neutral-900 sm:text-4xl md:text-5xl"
                >
                Latest Releases
                </motion.h1>
                <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-4 text-lg font-light text-neutral-600"
                >
                Discover the newest additions to our collection
                </motion.p>
            </motion.div>
            </div>
        </section>

        {/* Content section */}
        <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            {/* Loading state */}
            {loading && (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="relative h-12 w-12">
                <Skeleton className="absolute inset-0 h-full w-full rounded-full" />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <RefreshCw className="h-6 w-6 text-neutral-400" />
                </motion.div>
                </div>
                <p className="mt-4 text-neutral-600">Loading latest releases...</p>
            </div>
            )}

            {/* Error state */}
            {error && (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-md rounded-lg border border-red-100 bg-white p-6 shadow-sm"
            >
                <div className="flex items-start">
                <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                        />
                    </svg>
                    </div>
                </div>
                <div className="ml-4">
                    <h3 className="text-sm font-medium text-red-800">Error loading products</h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                    <div className="mt-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={refreshLatestProducts}
                        className="text-red-700 hover:bg-red-50"
                    >
                        Try again
                    </Button>
                    </div>
                </div>
                </div>
            </motion.div>
            )}

            {/* Products grid */}
            {!loading && !error && safeProducts.length > 0 && (
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-12">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <motion.h2 variants={itemVariants} className="text-xl font-light text-neutral-900 sm:text-2xl">
                    This Week's Arrivals
                </motion.h2>
                <motion.div variants={itemVariants}>
                    <Button
                    variant="outline"
                    onClick={handleRefresh}
                    className="group flex items-center gap-2"
                    disabled={isRefreshing}
                    >
                    <RefreshCw
                        className={`h-4 w-4 text-neutral-600 transition-transform duration-500 ${
                        isRefreshing ? "animate-spin" : "group-hover:rotate-90"
                        }`}
                    />
                    <span>Refresh</span>
                    </Button>
                </motion.div>
                </div>

                <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                <AnimatePresence>
                    {safeProducts.map((product, index) => (
                    <motion.div
                        key={product.id}
                        variants={itemVariants}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                        <ProductCard product={product} />
                    </motion.div>
                    ))}
                </AnimatePresence>
                </motion.div>

                {/* Call to action */}
                <motion.div variants={itemVariants} className="mx-auto max-w-2xl space-y-6 text-center">
                <p className="text-neutral-600">These are just a few of our recent releases.</p>
                <Button
                    asChild
                    className="group inline-flex items-center gap-2 bg-neutral-900 text-white hover:bg-neutral-800"
                >
                    <a href="/products">
                    <span>View all products</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                </Button>
                </motion.div>
            </motion.div>
            )}

            {/* Empty state */}
            {!loading && !error && safeProducts.length === 0 && (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-md rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm"
            >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                <Package className="h-8 w-8 text-neutral-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-neutral-900">No new releases</h3>
                <p className="mt-2 text-neutral-600">We don't have any new releases to show at the moment.</p>
                <div className="mt-6">
                <Button onClick={refreshLatestProducts} variant="outline">
                    Refresh
                </Button>
                </div>
            </motion.div>
            )}
        </section>
        </div>
    )
}
