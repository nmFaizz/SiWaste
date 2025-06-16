import { LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'light' | 'danger';
type ButtonSize = 'sm' | 'base';

type ButtonLinkProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  classNames?: {
    leftIcon?: string;
    rightIcon?: string;
  };
  href: string;
} & React.ComponentPropsWithRef<'a'>;

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'base',
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      classNames,
      href,
      ...rest
    },
    ref
  ) => {

    return (
      <Link
        href={href}
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-lg font-medium',
          'focus-visible:ring-primary-500 focus:outline-none focus-visible:ring',
          'shadow-sm',
          'transition-colors duration-75',
          'px-4 py-1.5', 
          'text-sm md:text-base',
          'cursor-pointer',
          [
            variant === 'primary' && [
                'bg-primary text-white',
                'hover:bg-primary-hover hover:text-white',
                'active:bg-primary-700',
                'disabled:bg-primary-700',
              ],
              variant === 'danger' && [
                'bg-error-main text-white',
              ]
          ],
          //#endregion  //*======== Variants ===========
          'disabled:cursor-not-allowed',
          className
        )}
        {...rest}
      >
        {LeftIcon && (
          <div
            className={cn([
              size === 'base' && 'mr-1',
              size === 'sm' && 'mr-1.5',
            ])}
          >
            <LeftIcon
              size='1em'
              className={cn(
                [
                  size === 'base' && 'md:text-md text-md',
                  size === 'sm' && 'md:text-md text-sm',
                ],
                classNames?.leftIcon
              )}
            />
          </div>
        )}
        {children}
        {RightIcon && (
          <div
            className={cn([
              size === 'base' && 'ml-1',
              size === 'sm' && 'ml-1.5',
            ])}
          >
            <RightIcon
              size='1em'
              className={cn(
                [
                  size === 'base' && 'text-md md:text-md',
                  size === 'sm' && 'md:text-md text-sm',
                ],
                classNames?.rightIcon
              )}
            />
          </div>
        )}
      </Link>
    );
  }
);

ButtonLink.displayName = 'ButtonLink';

export default ButtonLink;