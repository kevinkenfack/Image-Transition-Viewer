"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Moon, Sun, Upload } from "lucide-react"

interface ImageCompareProps {
  lightImage?: string
  darkImage?: string
}

export function ImageCompare({ lightImage, darkImage }: ImageCompareProps) {
  const [position, setPosition] = useState(50)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [direction, setDirection] = useState(1) // 1 for increasing, -1 for decreasing
  const [speed, setSpeed] = useState(1)
  const [customLightImage, setCustomLightImage] = useState<string | null>(null)
  const [customDarkImage, setCustomDarkImage] = useState<string | null>(null)

  const lightInputRef = useRef<HTMLInputElement>(null)
  const darkInputRef = useRef<HTMLInputElement>(null)

  // Auto-play animation
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setPosition((prev) => {
        const newPosition = prev + direction * speed

        // Change direction when reaching the edges
        if (newPosition >= 100 || newPosition <= 0) {
          setDirection((d) => -d)
          return prev
        }

        return newPosition
      })
    }, 16) // ~60fps

    return () => clearInterval(interval)
  }, [isAutoPlaying, direction, speed])

  // Handle file uploads
  const handleLightImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCustomLightImage(URL.createObjectURL(file))
    }
  }

  const handleDarkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCustomDarkImage(URL.createObjectURL(file))
    }
  }

  const effectiveLightImage = customLightImage || lightImage
  const effectiveDarkImage = customDarkImage || darkImage

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="light-image">Light Image</Label>
          <div className="flex items-center gap-2">
            <Input
              ref={lightInputRef}
              id="light-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLightImageUpload}
            />
            <Button variant="outline" onClick={() => lightInputRef.current?.click()} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Upload Light Image
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dark-image">Dark Image</Label>
          <div className="flex items-center gap-2">
            <Input
              ref={darkInputRef}
              id="dark-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleDarkImageUpload}
            />
            <Button variant="outline" onClick={() => darkInputRef.current?.click()} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Upload Dark Image
            </Button>
          </div>
        </div>
      </div>

      <div className="relative w-full" style={{ minHeight: "300px" }}>
        {/* Dark image (background) */}
        {effectiveDarkImage && (
          <img
            src={effectiveDarkImage || "/placeholder.svg"}
            alt="Dark version"
            className="w-full h-auto object-contain"
            style={{
              maxHeight: "70vh",
              display: "block",
            }}
          />
        )}

        {/* Light image (foreground with clip) */}
        {effectiveLightImage && (
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`,
            }}
          >
            <img
              src={effectiveLightImage || "/placeholder.svg"}
              alt="Light version"
              className="w-full h-auto object-contain"
              style={{
                maxHeight: "70vh",
                display: "block",
              }}
            />
          </div>
        )}

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
          style={{
            left: `calc(${position}% - 0.5px)`,
            cursor: "ew-resize",
            height: "100%",
          }}
        />
      </div>

      {/* Icons for light/dark */}
      <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded-full">
        <Moon size={20} />
      </div>
      <div className="absolute top-4 right-4 bg-white/50 text-black p-2 rounded-full">
        <Sun size={20} />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="position-slider">Position</Label>
            <span className="text-sm text-muted-foreground">{position}%</span>
          </div>
          <Slider
            id="position-slider"
            min={0}
            max={100}
            step={0.1}
            value={[position]}
            onValueChange={(values) => {
              setPosition(values[0])
              if (isAutoPlaying) setIsAutoPlaying(false)
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="speed-slider">Animation Speed</Label>
          <Slider
            id="speed-slider"
            min={0.1}
            max={5}
            step={0.1}
            value={[speed]}
            onValueChange={(values) => setSpeed(values[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            variant={isAutoPlaying ? "destructive" : "default"}
            className="flex-1"
          >
            {isAutoPlaying ? "Stop Animation" : "Start Animation"}
          </Button>

          <Button variant="outline" onClick={() => setPosition(50)} className="flex-1">
            Reset Position
          </Button>
        </div>
      </div>
    </div>
  )
}

