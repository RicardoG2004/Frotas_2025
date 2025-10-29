import React, { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type LogoProps = React.HTMLAttributes<HTMLDivElement> & {
  to?: string
  disableLink?: boolean
  width?: number
  height?: number
}

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    { width, height, to = '/', disableLink = false, className, ...props },
    ref
  ) => {
    // Calculating base size based on props
    const baseSize = {
      width: width ?? 50,
      height: height ?? 50,
    }

    const logoContent = (
      <svg
        width={baseSize.width}
        height={baseSize.height}
        viewBox='0 0 25.135 25.135'
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        className={cn('text-foreground', className)}
      >
        <defs>
          <linearGradient
            id='c'
            x1={116.19}
            x2={180.91}
            y1={73.377}
            y2={73.377}
            gradientTransform='scale(-3.0986) rotate(-60 982.284 490.304)'
            gradientUnits='userSpaceOnUse'
            xlinkHref='#a'
          />
          <linearGradient id='a'>
            <stop stopColor='#0069f8' offset={0} />
            <stop stopColor='#10acfd' stopOpacity={0.973} offset={0.523} />
            <stop stopColor='#82d9f9' stopOpacity={0.969} offset={1} />
          </linearGradient>
          <linearGradient
            id='d'
            x1={116.19}
            x2={180.91}
            y1={73.377}
            y2={73.377}
            gradientTransform='scale(3.0986) rotate(60 934.802 -775.34)'
            gradientUnits='userSpaceOnUse'
            xlinkHref='#a'
          />
          <linearGradient
            id='e'
            x1={116.19}
            x2={180.91}
            y1={73.377}
            y2={73.377}
            gradientTransform='scale(3.0986) rotate(-60 -1020.387 -150.705)'
            gradientUnits='userSpaceOnUse'
            xlinkHref='#a'
          />
          <linearGradient
            id='f'
            x1={116.19}
            x2={180.91}
            y1={73.377}
            y2={73.377}
            gradientTransform='scale(-3.0986) rotate(60 -621.648 638.539)'
            gradientUnits='userSpaceOnUse'
            xlinkHref='#a'
          />
          <linearGradient
            id='g'
            x1={116.19}
            x2={180.91}
            y1={73.377}
            y2={73.377}
            gradientTransform='translate(-1117.5 -3497.9) scale(3.0987)'
            gradientUnits='userSpaceOnUse'
            xlinkHref='#a'
          />
          <linearGradient
            id='h'
            x1={116.19}
            x2={180.91}
            y1={73.377}
            y2={73.377}
            gradientTransform='rotate(180 -132.595 -1434.7) scale(3.0987)'
            gradientUnits='userSpaceOnUse'
            xlinkHref='#a'
          />
          <linearGradient
            id='k'
            x1={3168.4}
            x2={3169.2}
            y1={4106}
            y2={4317.7}
            gradientTransform='translate(-2094.2 -5379.6) scale(.51382)'
            gradientUnits='userSpaceOnUse'
            xlinkHref='#a'
          />
          <filter
            id='b'
            x={-0.093}
            y={-0.081}
            width={1.187}
            height={1.165}
            colorInterpolationFilters='sRGB'
          >
            <feFlood floodColor='#000' floodOpacity={0.498} result='flood' />
            <feComposite
              in='flood'
              in2='SourceGraphic'
              operator='out'
              result='composite1'
            />
            <feGaussianBlur in='composite1' result='blur' stdDeviation={10} />
            <feOffset dy={1} result='offset' />
            <feComposite
              in='offset'
              in2='SourceGraphic'
              operator='atop'
              result='composite2'
            />
          </filter>
          <filter
            id='i'
            x={-0.054}
            y={-0.079}
            width={1.107}
            height={1.175}
            colorInterpolationFilters='sRGB'
          >
            <feFlood floodColor='#000' floodOpacity={0.498} result='flood' />
            <feComposite
              in='flood'
              in2='SourceGraphic'
              operator='out'
              result='composite1'
            />
            <feGaussianBlur in='composite1' result='blur' stdDeviation={1.9} />
            <feOffset dy={1} result='offset' />
            <feComposite
              in='offset'
              in2='SourceGraphic'
              operator='in'
              result='composite2'
            />
          </filter>
          <filter
            id='j'
            x={-0.11}
            y={-0.295}
            width={1.22}
            height={1.644}
            colorInterpolationFilters='sRGB'
          >
            <feFlood floodColor='#000' floodOpacity={0.498} result='flood' />
            <feComposite
              in='flood'
              in2='SourceGraphic'
              operator='out'
              result='composite1'
            />
            <feGaussianBlur in='composite1' result='blur' stdDeviation={2.3} />
            <feOffset dy={1} result='offset' />
            <feComposite
              in='offset'
              in2='SourceGraphic'
              operator='atop'
              result='composite2'
            />
          </filter>
        </defs>
        <g fill='#0fa9fd' fillOpacity={0.973}>
          <g strokeWidth={1.11}>
            <path
              className='cls-3'
              d='M7.057 23.335q0 .707-.85.707a1.672 1.672 0 0 1-.53-.073v-.323a1.707 1.707 0 0 0 .532.073q.44 0 .44-.366a.99.99 0 0 1-.39.077q-.721 0-.721-.786 0-.798.838-.798a4.273 4.273 0 0 1 .68.066zm-.408-1.122a.872.872 0 0 0-.285-.037q-.422 0-.422.466 0 .45.366.45a.771.771 0 0 0 .343-.082zM7.85 21.263v2.198H7.44v-2.198zM8.156 22.655q0-.811.8-.812t.8.812q0 .81-.8.81t-.8-.81zm.8.5q.392 0 .392-.506 0-.493-.392-.494-.393 0-.392.494 0 .505.392.504zM10.063 21.263h.408v.707a.716.716 0 0 1 .408-.123q.688 0 .688.776 0 .84-.789.84a4.233 4.233 0 0 1-.715-.067zm.408 1.826a1.09 1.09 0 0 0 .325.044q.366 0 .366-.521 0-.427-.318-.427a.837.837 0 0 0-.375.084zM11.798 22.952q0-.481.702-.481a1.785 1.785 0 0 1 .329.03v-.121q0-.22-.312-.22a2.555 2.555 0 0 0-.586.074v-.317a2.555 2.555 0 0 1 .586-.077q.72 0 .72.533v1.082h-.238l-.146-.146a.806.806 0 0 1-.465.146q-.59 0-.59-.503zm.702-.204c-.197 0-.293.066-.293.2 0 .133.082.215.246.215a.626.626 0 0 0 .376-.126v-.258a1.678 1.678 0 0 0-.326-.031zM14.029 21.263v2.198h-.407v-2.198zM14.414 23.388v-.339a1.662 1.662 0 0 0 .62.108c.176 0 .264-.057.264-.17s-.059-.16-.177-.16h-.293q-.492 0-.492-.485 0-.508.718-.508a1.753 1.753 0 0 1 .573.092v.339a1.556 1.556 0 0 0-.586-.108q-.33 0-.33.17c0 .107.064.161.192.161h.261c.359 0 .539.161.539.484q0 .508-.687.508a1.862 1.862 0 0 1-.602-.092zM15.913 22.655q0-.811.8-.812.8 0 .8.812 0 .81-.8.81t-.8-.81zm.8.5q.392 0 .392-.506 0-.493-.392-.494-.392 0-.392.494 0 .505.392.504zM17.82 23.46V21.85q0-.664.726-.665a1.006 1.006 0 0 1 .36.062v.323a.88.88 0 0 0-.33-.062c-.232 0-.348.114-.348.342h.484v.323h-.484v1.288z'
            />
            <path
              className='cls-3'
              d='M18.83 21.58h.3l.062.261h.407v.323h-.362v.743q0 .227.196.227h.166v.323h-.366q-.406 0-.406-.436z'
            />
          </g>
          <text
            x={-716.865}
            y={-2971.618}
            fontFamily="'Franklin Gothic Medium'"
            fontSize={16.314}
            strokeWidth={0.136}
            style={{
              lineHeight: 1.25,
            }}
            xmlSpace='preserve'
            transform='translate(58.184 220.75) scale(.06598)'
          >
            <tspan x={-716.865} y={-2971.618}>
              {'GROUP'}
            </tspan>
          </text>
        </g>
        <path
          transform='matrix(.03398 0 0 .03398 -73.065 -133.726)'
          d='m2520.1 4398.6-128.44-74.155v-148.31l128.44-74.155 128.44 74.155v148.31z'
          fill='#fff'
          filter='url(#b)'
        />
        <g strokeWidth={0.82}>
          <path
            d='M-591.07-3086.3v-115.79l-34.14-19.711v115.79l-100.28 57.895 34.14 19.711z'
            fill='url(#c)'
            transform='translate(58.184 220.75) scale(.06598)'
          />
          <path
            d='m-556.93-3221.8-34.139-19.711-34.142 19.711 34.14 19.711v115.79l34.14-19.711z'
            fill='url(#d)'
            transform='translate(58.184 220.75) scale(.06598)'
          />
          <path
            d='M-791.62-3281v115.79l34.14 19.711v-115.79l100.28-57.895-34.14-19.711z'
            fill='url(#e)'
            transform='translate(58.184 220.75) scale(.06598)'
          />
          <path
            d='m-825.76-3145.5 100.28 57.894 34.14-19.711-100.28-57.894v-115.79l-34.14 19.711z'
            fill='url(#f)'
            transform='translate(58.184 220.75) scale(.06598)'
          />
          <path
            d='m-657.21-3319.1-100.28 57.894v39.422l100.26-57.903 66.151 38.191v-39.422z'
            fill='url(#g)'
            transform='translate(58.184 220.75) scale(.06598)'
          />
          <path
            d='m-725.49-3048.2 100.28-57.894v-39.422l-100.28 57.894-100.28-57.894v39.422z'
            fill='url(#h)'
            transform='translate(58.184 220.75) scale(.06598)'
          />
        </g>
        <g
          transform='matrix(.07695 0 0 .07695 9.293 8.043)'
          fill='#f3f3f3'
          filter='url(#i)'
          data-name='Logo 3'
        >
          <path
            className='cls-1'
            d='M70.79 23.66a41.49 41.49 0 0 1-9.44 12.27c-11.74 10.86-34 19.85-53.68 15.77 3.5 2.83 14.72 8.65 31.36 4.58 11.14-3.4 24-12 28.76-18.9-4.88 8.32-12.33 14.59-20.61 18.9h18.39c10.77 0 19.51-7.5 19.51-16.7-.04-6.01-3.43-13.68-14.29-15.92z'
          />
          <path
            className='cls-2'
            d='M70.94 10.19C69.7 5.34 65.36 1.84 58.4 0c8.86 5.43 9.58 12.06 8 17.44C62.03 7.28 52.22 2.56 41.77 2.5c-11.45.07-22.56 6.06-26.15 18.38C3.98 22.83.01 31.12.01 37.32a15.72 15.72 0 0 0 5.95 12c19.67 4.11 42.11-4.78 53.85-15.65 8.69-8.06 12.86-16.82 11.13-23.48z'
          />
        </g>
        <text
          transform='translate(-73.21 -133.427) scale(.0339)'
          x={2502.268}
          y={4333.452}
          filter='url(#j)'
          fontFamily="'Franklin Gothic Medium'"
          fontSize={24.717}
          strokeWidth={0.265}
          style={{
            lineHeight: 1.25,
          }}
          xmlSpace='preserve'
        >
          <tspan x={2502.268} y={4333.452} fill='#fff' fontFamily='Tahoma'>
            {'1992'}
          </tspan>
        </text>
        <path
          d='m-691.36-3260 34.138-19.71 100.29 57.903-34.144 19.71z'
          fill='url(#k)'
          transform='translate(58.184 220.75) scale(.06598)'
        />
        <path
          d='M20.133 6.774a.423.423 0 0 1-.303-.164.397.397 0 0 1 .1-.574.432.432 0 0 1 .177-.067.27.27 0 0 1 .12 0 .42.42 0 0 1 .302.197.398.398 0 0 1-.227.587.43.43 0 0 1-.168.021zm.103-.084c.03-.009.064-.018.088-.03a.344.344 0 0 0 .153-.153.315.315 0 0 0 .015-.234.335.335 0 0 0-.255-.223c-.022-.009-.027-.009-.07-.009-.042 0-.047 0-.07.01a.339.339 0 0 0-.239.183.308.308 0 0 0 .031.325.342.342 0 0 0 .224.134h.062c.031 0 .042 0 .061-.009z'
          fill='#53c6fb'
          fillOpacity={0.969}
        />
        <path
          d='M20.009 6.365v-.2h.098c.106 0 .13 0 .154.01.04.012.069.043.075.08a.109.109 0 0 1-.015.088.18.18 0 0 1-.047.043c-.009.01-.013.01-.012.01.002 0 .03.039.065.084l.064.082h-.126l-.054-.072-.054-.073h-.047v.145h-.102zm.157-.021c.027 0 .038-.01.05-.017.02-.02.02-.06-.001-.074-.013-.009-.024-.012-.066-.012h-.039v.107h.055z'
          fill='#53c6fb'
          fillOpacity={0.969}
        />
      </svg>
    )

    // If the link is disabled, just render the SVG
    if (disableLink) {
      return (
        <div ref={ref} {...props}>
          {logoContent}
        </div>
      )
    }

    // Otherwise, wrap the SVG with the Link component
    return (
      <div ref={ref} {...props}>
        <Link to={to} className='transition-opacity hover:opacity-80'>
          {logoContent}
        </Link>
      </div>
    )
  }
)

Logo.displayName = 'Logo'
