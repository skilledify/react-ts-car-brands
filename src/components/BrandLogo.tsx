import type { CSSProperties } from 'react'
import { customBrandLogos, type CustomBrandLogo } from '../data/customBrandLogos'
import { brandLogoPaths, type BrandLogoId } from '../data/brandLogos'
import type { Brand } from '../types'

interface BrandMarkProps {
  logo: BrandLogoId | 'mercedes'
  className?: string
  style?: CSSProperties
}

export function BrandMark({ logo, className, style }: BrandMarkProps) {
  if (logo === 'mercedes') {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        style={style}
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="10.1" stroke="currentColor" strokeWidth="0.9" opacity="0.72" />
        <path
          d="M12 2.2V12m0 0 8.35 5.75M12 12 3.65 17.75"
          stroke="currentColor"
          strokeWidth="1.55"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="0.9" fill="currentColor" />
      </svg>
    )
  }

  if (logo in customBrandLogos) {
    const custom: CustomBrandLogo = customBrandLogos[logo as keyof typeof customBrandLogos]

    return (
      <svg
        viewBox={custom.viewBox}
        className={className}
        style={style}
        aria-hidden="true"
        focusable="false"
      >
        {custom.groupTransform ? (
          <g transform={custom.groupTransform}>
            {custom.paths.map((path, index) => (
              <path
                key={index}
                d={path.d}
                fill={path.fill}
                fillRule={path.fillRule}
                transform={path.transform}
              />
            ))}
          </g>
        ) : (
          custom.paths.map((path, index) => (
            <path
              key={index}
              d={path.d}
              fill={path.fill}
              fillRule={path.fillRule}
              transform={path.transform}
            />
          ))
        )}
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true" focusable="false">
      <path d={brandLogoPaths[logo as keyof typeof brandLogoPaths]} fill="currentColor" />
    </svg>
  )
}

interface BrandLogoProps {
  brand: Brand
  size?: number | string
  className?: string
}

export function BrandLogo({ brand, size = 72, className = '' }: BrandLogoProps) {
  return <BrandMark logo={brand.logo} className={className} style={{ width: size, height: size }} />
}
