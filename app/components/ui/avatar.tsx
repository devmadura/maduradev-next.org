import { forwardRef } from "react";

interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className = "", ...props }, ref) => (
    <span
      ref={ref}
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
      {...props}
    />
  )
);
Avatar.displayName = "Avatar";

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className = "", src, alt = "", ...props }, ref) => {
    if (!src) return null;
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={`aspect-square h-full w-full object-cover ${className}`}
        {...props}
      />
    );
  }
);
AvatarImage.displayName = "AvatarImage";

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const AvatarFallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ className = "", ...props }, ref) => (
    <span
      ref={ref}
      className={`flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium ${className}`}
      {...props}
    />
  )
);
AvatarFallback.displayName = "AvatarFallback";
