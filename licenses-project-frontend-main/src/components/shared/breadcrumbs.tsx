import { Fragment } from 'react'
import { Slash } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

type BreadcrumbItemProps = {
  title: string
  link: string
}

export function Breadcrumbs({ items }: { items: BreadcrumbItemProps[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList className='text-xs'>
        {items.map((item, index) => (
          <Fragment key={item.title}>
            {index !== items.length - 1 && (
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={item.link}
                  className='text-muted-foreground hover:text-foreground'
                >
                  {item.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {index < items.length - 1 && (
              <BreadcrumbSeparator>
                <Slash className='h-3 w-3' />
              </BreadcrumbSeparator>
            )}
            {index === items.length - 1 && (
              <BreadcrumbPage className='font-medium'>
                {item.title}
              </BreadcrumbPage>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
