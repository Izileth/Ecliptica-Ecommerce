import type React from "react"
import { Button } from "~/src/components/imported/button"
import { ArrowRight } from 'lucide-react'
import { cn } from "~/src/lib/utils"

interface DiscountCTAProps {
  title?: string
  subtitle?: string
  offerText?: string
  buttonText?: string
  variant?: "primary" | "secondary" | "elegant"
  className?: string
  discountSectionId?: string
  navigateTo?: string
  onButtonClick?: () => void
}

export const DiscountCTA: React.FC<DiscountCTAProps> = ({
  title = "Aproveite nossas ofertas especiais",
  subtitle = "Produtos selecionados com descontos exclusivos",
  offerText = "Até 50% OFF em itens selecionados",
  buttonText = "Ver Ofertas",
  variant = "elegant",
  className = "",
  discountSectionId = "destaques-desconto",
  navigateTo,
  onButtonClick,
}) => {
  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick()
    } else if (navigateTo) {
      // Navigate to specific route (handled by parent component)
      window.location.href = navigateTo
    } else {
      // Smooth scroll to discount section
      const section = document.getElementById(discountSectionId)
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }

  return (
    <div
      className={cn(
        "overflow-hidden",
        {
          "bg-neutral-900 text-white": variant === "primary",
          "border border-neutral-200 bg-white text-neutral-900": variant === "secondary",
          "border border-neutral-200 bg-neutral-50 text-neutral-900": variant === "elegant",
        },
        className
      )}
    >
      <div
        className={cn("relative px-6 py-12 sm:px-10 sm:py-16", {
          "after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:bg-gradient-to-r after:from-neutral-700 after:to-neutral-900":
            variant === "primary",
          "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-neutral-200": variant === "secondary",
          "": variant === "elegant",
        })}
      >
        {variant === "elegant" && (
          <div className="absolute -right-16 -top-16 h-32 w-32 rotate-45 bg-neutral-900 opacity-5"></div>
        )}

        <div className="relative z-10 text-center">
          {offerText && (
            <div className="mb-6">
              <span
                className={cn("inline-block font-serif text-sm tracking-wider", {
                  "bg-white px-3 py-1 text-neutral-900": variant === "primary",
                  "bg-neutral-900 px-3 py-1 text-white": variant === "secondary",
                  "text-lg font-light text-neutral-900 sm:text-xl": variant === "elegant",
                })}
              >
                {offerText}
              </span>
            </div>
          )}

          <h3
            className={cn("mb-2 font-serif text-2xl font-light tracking-wide sm:text-3xl", {
              "text-white": variant === "primary",
              "text-neutral-900": variant !== "primary",
            })}
          >
            {title}
          </h3>

          {subtitle && (
            <p
              className={cn("mx-auto mb-8 max-w-md text-sm font-light sm:text-base", {
                "text-neutral-300": variant === "primary",
                "text-neutral-500": variant !== "primary",
              })}
            >
              {subtitle}
            </p>
          )}

          <Button
            onClick={handleClick}
            variant={variant === "primary" ? "outline" : "default"}
            className={cn(
              "group min-w-[200px] border-0 px-8 py-6 text-xs font-light tracking-wider transition-all duration-300 sm:text-sm",
              {
                "bg-white text-neutral-900 hover:bg-neutral-100": variant === "primary",
                "bg-neutral-900 text-white hover:bg-neutral-800": variant === "secondary",
                "border border-neutral-300 bg-transparent text-neutral-900 hover:bg-neutral-900 hover:text-white":
                  variant === "elegant",
              }
            )}
          >
            {buttonText}
            <ArrowRight
              className={cn("ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1", {
                "text-neutral-900": variant === "primary",
                "text-white": variant === "secondary",
                "text-neutral-500 group-hover:text-white": variant === "elegant",
              })}
            />
          </Button>
        </div>
      </div>
    </div>
  )
}

