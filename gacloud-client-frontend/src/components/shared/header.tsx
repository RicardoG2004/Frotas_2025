import { useMenuItems } from '@/hooks/use-menu-items';
import { usePathname } from '@/routes/hooks';
import Heading from '@/components/shared/heading';
import UserNav from '@/components/shared/user-nav';
import { ModeToggle } from '@/components/shared/theme-toggle';

// Custom hook to find the matched path
const useMatchedPath = (pathname: string) => {
  const menuItems = useMenuItems();
  const matchedPath =
    menuItems.find((item) => item.href === pathname) ||
    menuItems.find(
      (item) => pathname.startsWith(item.href + '/') && item.href !== '/'
    );
  return matchedPath?.title || '';
};

export default function Header() {
  const pathname = usePathname();
  const headingText = useMatchedPath(pathname);

  return (
    <div className="flex flex-1 items-center justify-between bg-secondary px-4">
      <Heading title={headingText} />
      <div className="ml-4 flex items-center md:ml-6">
        <UserNav />
        <ModeToggle />
      </div>
    </div>
  );
}
