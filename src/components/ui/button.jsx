import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import React from 'react';
import { useCart } from '@/store/CartContext.jsx'; // import your cart context
import { toast } from '@/components/ui/use-toast.js'; // optional: for notifications

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, action, product, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const { addItem } = useCart(); // ✅ matches your context


    const handleClick = (e) => {
  if (action === 'add-to-cart' && product) {
    const defaultColor = product.colors?.[0]?.name || "Default";
    const defaultSize = product.sizes?.[0] || "Default";

    const finalProduct = {
      ...product,
      color: product.color || defaultColor,
      size: product.size || defaultSize,
    };

    addItem(finalProduct);

    toast({
      title: "Added to Cart",
      description: `${finalProduct.name} (${finalProduct.size}, ${finalProduct.color}) was added.`,
    });
  }

      // Call any other onClick passed via props
      if (props.onClick) props.onClick(e);
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
