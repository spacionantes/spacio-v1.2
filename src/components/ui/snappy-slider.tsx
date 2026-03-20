import * as React from "react"
import { cn } from "@/lib/utils"

interface SnappySliderProps {
  values: number[]
  defaultValue: number
  value?: number
  snapping?: boolean
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
  config?: {
    snappingThreshold?: number
    labelFormatter?: (value: number) => string
  }
  label: string
  suffix?: string
  className?: string
}

const formatNumber = (value: number, step: number = 1): string => {
  const numValue = Number(value)
  if (isNaN(numValue)) throw new Error(`Invalid number value: ${value}`)
  const decimalPlaces = step.toString().split('.')[1]?.length || 0
  if (decimalPlaces === 0 && Number.isInteger(numValue)) return numValue.toString()
  return numValue.toFixed(decimalPlaces)
}

const SnappySlider = React.forwardRef<HTMLDivElement, SnappySliderProps>(
  (
    {
      values,
      defaultValue,
      value,
      snapping = true,
      min: providedMin,
      max: providedMax,
      step,
      onChange,
      config = {},
      label,
      suffix,
      className,
      ...props
    },
    ref
  ) => {
    const sliderRef = React.useRef<HTMLDivElement>(null)
    const { snappingThreshold = 0.3, labelFormatter } = config

    const allValues = [...new Set([...values, defaultValue])].sort((a, b) => a - b)
    const sliderMin = providedMin ?? Math.min(...allValues)
    const sliderMax = providedMax ?? Math.max(...allValues)
    const computedStep = step ?? 1

    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const currentValue = value ?? internalValue

    const percentage =
      sliderMax === sliderMin
        ? 0
        : ((Math.min(Math.max(currentValue, sliderMin), sliderMax) - sliderMin) /
            (sliderMax - sliderMin)) *
          100

    const handleValueChange = React.useCallback(
      (newValue: number) => {
        setInternalValue(newValue)
        onChange(newValue)
      },
      [onChange]
    )

    const handleInteraction = React.useCallback(
      (clientX: number) => {
        const slider = sliderRef.current
        if (!slider) return

        const rect = slider.getBoundingClientRect()
        const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
        const rawValue = pct * (sliderMax - sliderMin) + sliderMin

        if (snapping) {
          const closestValue = allValues.reduce((prev, curr) =>
            Math.abs(curr - rawValue) < Math.abs(prev - rawValue) ? curr : prev
          )
          if (Math.abs(closestValue - rawValue) <= snappingThreshold) {
            handleValueChange(closestValue)
            return
          }
        }

        const steppedValue = Math.round(rawValue / computedStep) * computedStep
        const clampedValue = Math.max(sliderMin, Math.min(sliderMax, steppedValue))
        handleValueChange(clampedValue)
      },
      [sliderMin, sliderMax, allValues, computedStep, snapping, snappingThreshold, handleValueChange]
    )

    React.useEffect(() => {
      const slider = sliderRef.current
      if (!slider) return

      const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault()
        handleInteraction(e.clientX)
        document.body.style.userSelect = "none"

        const handleMouseMove = (e: MouseEvent) => handleInteraction(e.clientX)
        const handleMouseUp = () => {
          document.removeEventListener("mousemove", handleMouseMove)
          document.body.style.userSelect = ""
        }

        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp, { once: true })
      }

      const handleTouchStart = (e: TouchEvent) => {
        e.preventDefault()
        handleInteraction(e.touches[0].clientX)

        const handleTouchMove = (e: TouchEvent) =>
          handleInteraction(e.touches[0].clientX)

        document.addEventListener("touchmove", handleTouchMove, { passive: false })
        document.addEventListener(
          "touchend",
          () => document.removeEventListener("touchmove", handleTouchMove),
          { once: true }
        )
      }

      slider.addEventListener("mousedown", handleMouseDown)
      slider.addEventListener("touchstart", handleTouchStart, { passive: false })

      return () => {
        slider.removeEventListener("mousedown", handleMouseDown)
        slider.removeEventListener("touchstart", handleTouchStart)
        document.body.style.userSelect = ""
      }
    }, [handleInteraction])

    // Double-click to reset
    React.useEffect(() => {
      const slider = sliderRef.current
      if (!slider) return
      const handleDblClick = () => handleValueChange(defaultValue)
      slider.addEventListener("dblclick", handleDblClick)
      return () => slider.removeEventListener("dblclick", handleDblClick)
    }, [handleValueChange, defaultValue])

    const displayValue = labelFormatter
      ? labelFormatter(currentValue)
      : formatNumber(currentValue, computedStep)

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-foreground">{label}</label>
          <span className="text-xs font-medium text-primary tabular-nums">
            {displayValue}
            {suffix && <span className="text-muted-foreground ml-0.5">{suffix}</span>}
          </span>
        </div>

        {/* Slider track */}
        <div
          ref={sliderRef}
          className="relative h-10 cursor-pointer select-none touch-none"
          role="slider"
          aria-valuemin={sliderMin}
          aria-valuemax={sliderMax}
          aria-valuenow={currentValue}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowUp") {
              e.preventDefault()
              const newVal = Math.min(sliderMax, currentValue + computedStep)
              handleValueChange(newVal)
            } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
              e.preventDefault()
              const newVal = Math.max(sliderMin, currentValue - computedStep)
              handleValueChange(newVal)
            }
          }}
        >
          {/* Track background */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 rounded-full bg-secondary" />

          {/* Progress fill */}
          <div
            className="absolute top-1/2 -translate-y-1/2 left-0 h-2 rounded-full bg-gradient-to-r from-primary/80 to-primary transition-[width] duration-75"
            style={{ width: `${percentage}%` }}
          />

          {/* Snap markers */}
          {allValues.map((mark) => {
            const markPct = ((mark - sliderMin) / (sliderMax - sliderMin)) * 100
            if (markPct < 0 || markPct > 100) return null
            const isActive = mark <= currentValue
            return (
              <div
                key={mark}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${markPct}%` }}
              >
                <div
                  className={cn(
                    "w-2.5 h-2.5 rounded-full border-2 transition-colors duration-150",
                    isActive
                      ? "border-primary bg-primary-foreground"
                      : "border-muted-foreground/30 bg-background"
                  )}
                />
              </div>
            )
          })}

          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-[left] duration-75"
            style={{ left: `${percentage}%` }}
          >
            {/* Thumb triangle pointing down */}
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  "w-6 h-6 rounded-lg bg-primary shadow-md border-2 border-primary-foreground",
                  "flex items-center justify-center",
                  "hover:scale-110 active:scale-95 transition-transform"
                )}
              >
              </div>
              {/* Triangle pointer */}
              <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-primary -mt-[1px]" />
            </div>
          </div>
        </div>

      </div>
    )
  }
)
SnappySlider.displayName = "SnappySlider"

export { SnappySlider }
