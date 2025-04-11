
import { useEffect, useState, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from "react-leaflet"
import { DivIcon } from "leaflet"
import type { LatLngExpression } from "leaflet"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Navigation, ZoomIn, ZoomOut, X } from "lucide-react"
import "leaflet/dist/leaflet.css"

interface MapComponentProps {
  coordinates: [number, number]
  companyName: string
  address: string
  mapStyle?: "light" | "dark" | "minimal"
  height?: string
  showControls?: boolean
  className?: string
}

// Custom marker animation component
function PulsingMarker({ position }: { position: LatLngExpression }) {
  return (
    <div className="relative">
      <Marker
        position={position}
        icon={
          new DivIcon({
            className: "custom-marker-icon",
            html: `
              <div class="relative">
                <div class="absolute -top-8 -left-5 h-10 w-10 animate-ping rounded-full bg-neutral-900 opacity-30"></div>
                <div class="absolute -top-8 -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
              </div>
            `,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          })
        }
      />
    </div>
  )
}

// Component to recenter map when coordinates change
function RecenterAutomatically({ coordinates }: { coordinates: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(coordinates, map.getZoom(), {
      animate: true,
      duration: 1,
    })
  }, [coordinates, map])
  return null
}

// Custom controls component
function MapControls({
  onLocate,
  onZoomIn,
  onZoomOut,
}: {
  onLocate: () => void
  onZoomIn: () => void
  onZoomOut: () => void
}) {
  return (
    <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={onLocate}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300"
        title="Center map"
      >
        <Navigation className="h-5 w-5 text-neutral-700" />
      </button>
      <button
        onClick={onZoomIn}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300"
        title="Zoom in"
      >
        <ZoomIn className="h-5 w-5 text-neutral-700" />
      </button>
      <button
        onClick={onZoomOut}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300"
        title="Zoom out"
      >
        <ZoomOut className="h-5 w-5 text-neutral-700" />
      </button>
    </div>
  )
}

export default function MapComponent({
  coordinates,
  companyName,
  address,
  mapStyle = "dark",
  height = "800px",
  showControls = true,
  className = "",
}: MapComponentProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const mapRef = useRef(null)

  // Map style URLs
  const mapStyles = {
    light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    minimal: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
  }

  // Handle map actions
  const handleLocate = () => {
    if (mapRef.current) {
      const map = mapRef.current as any
      map.setView(coordinates, map.getZoom(), {
        animate: true,
        duration: 1,
      })
    }
  }

  const handleZoomIn = () => {
    if (mapRef.current) {
      const map = mapRef.current as any
      map.setZoom(map.getZoom() + 1)
    }
  }

  const handleZoomOut = () => {
    if (mapRef.current) {
      const map = mapRef.current as any
      map.setZoom(map.getZoom() - 1)
    }
  }

  // Set loaded state after component mounts
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className={`relative  overflow-hidden rounded-lg ${className}`} style={{ height }}>
      {/* Loading state */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-neutral-100 "
          >
            <div className="flex flex-col items-center">
              <MapPin className="mb-2 h-8 w-8 animate-bounce text-neutral-400" />
              <p className="text-neutral-500">Loading map...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="h-full w-full"
      >
        <MapContainer
          center={coordinates}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          ref={mapRef}
          whenReady={() => setIsLoaded(true)}
        >
          <TileLayer
            url={mapStyles[mapStyle]}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <PulsingMarker position={coordinates} />
          <Marker
            position={coordinates}
            icon={
              new DivIcon({
                className: "custom-marker-icon",
                html: `
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                `,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
              })
            }
            eventHandlers={{
              click: () => {
                setIsPopupOpen(true)
              },
            }}
          >
            <Popup className="custom-popup" onClose={() => setIsPopupOpen(false)} closeButton={false} maxWidth={300}>
              <div className="relative p-1">
                <button
                  className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                  onClick={() => {
                    if (mapRef.current) {
                      const map = mapRef.current as any
                      map.closePopup()
                    }
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="pt-2">
                  <h3 className="mb-1 text-base font-medium text-neutral-900">{companyName}</h3>
                  <p className="text-sm text-neutral-600">{address}</p>
                  <div className="mt-3 flex justify-end">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates[0]},${coordinates[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white hover:bg-neutral-800"
                    >
                      <Navigation className="h-3 w-3" />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
          <RecenterAutomatically coordinates={coordinates} />
          {!showControls && <ZoomControl position="bottomright" />}
        </MapContainer>
      </motion.div>

      {/* Custom controls */}
      {showControls && isLoaded && (
        <MapControls onLocate={handleLocate} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
      )}
    </div>
  )
}
