import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        hover?: boolean;
        animation?: "fade-in" | "slide-up" | "scale-in" | "none";
        delay?: "none" | "100" | "200" | "300" | "400" | "500";
    }
>(
    (
        {
            className,
            hover = false,
            animation = "none",
            delay = "none",
            ...props
        },
        ref
    ) => {
        const animationClasses = {
            "fade-in": "animate-fade-in",
            "slide-up": "animate-slide-up",
            "scale-in": "animate-scale-in",
            none: "",
        };

        const delayClasses = {
            none: "",
            "100": "delay-100",
            "200": "delay-200",
            "300": "delay-300",
            "400": "delay-400",
            "500": "delay-500",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "spotify-card",
                    hover && "spotify-hover-card",
                    animationClasses[animation],
                    delayClasses[delay],
                    className
                )}
                {...props}
            />
        );
    }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-xl font-bold", className)} {...props} />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
};
