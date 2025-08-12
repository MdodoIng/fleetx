'use client';
import { APP_SIDEBAR_MENU } from '@/shared/constants/sidebar';
import { UserRole } from '@/shared/types/auth';
import { useAuthStore } from '@/store';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

const SideBar = () => {
  const { user } = useAuthStore();
  const t = useTranslations();

  function filterMenuByRole(menu: typeof APP_SIDEBAR_MENU, roles: UserRole[] = []) {
    return menu
      .filter((item) => !item.roles || item.roles.some((role) => roles.includes(role)))
      .map((item) => ({
        ...item,
        children: item.children
          ? item.children.filter(
            (child) => !child.roles || child.roles.some((role) => roles.includes(role))
          )
          : undefined,
      }));
  }

  const filteredMenu = filterMenuByRole(APP_SIDEBAR_MENU, user?.roles ?? []);

  return (
    <aside className="bg-green-700 text-white flex flex-col gap-10  min-h-[-webkit-fill-available] h-full overflow-y-auto w-[min(100%,230px)] px-4 pb-10">
      <div className="flex justify-center items-center bg-amber-300 w-full px-4 py-2 mt-3.5 text-black text-pretty text-xs">
        {user && <span>{user.user.first_name}</span>}
      </div>
      <div className="gap-6 grid">
        {filteredMenu.map((item, index) => (
          <div key={index}>
            <Link href={item.route} prefetch={true} className="grid gap-2 ">
              <span>{t(item.labelKey)}</span>
            </Link>
            {item.children && (
              <div className="flex flex-col gap-2 ml-6">
                {item.children.map((child, childIndex) => (
                  <Link
                    key={childIndex}
                    href={child.route}
                    prefetch={true}
                    className="flex items-center gap-2"
                  >
                    <span>{t(child.labelKey)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};
export default SideBar;
