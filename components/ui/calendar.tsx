
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-4 bg-white rounded-2xl", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4 w-full",
                caption: "flex justify-center pt-2 pb-2 relative items-center w-full",
                caption_label: "text-base font-semibold text-charcoal tracking-wide",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 border-stone-200 hover:bg-stone-50 rounded-full transition-all"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1 mx-auto",
                head_row: "flex justify-between w-full mb-2 px-1",
                head_cell: "text-stone-400 font-bold uppercase tracking-wider w-9 text-[0.75rem] flex items-center justify-center",
                row: "flex w-full mt-2 justify-between px-1",
                cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
                ),
                day_range_end: "day-range-end",
                day_selected:
                    "bg-gold-leaf-500 text-white hover:bg-gold-leaf-500 hover:text-white focus:bg-gold-leaf-500 focus:text-white shadow-md font-bold",
                day_today: "bg-stone-100 text-charcoal",
                day_outside:
                    "day-outside text-stone-300 opacity-50 aria-selected:bg-stone-100/50 aria-selected:text-stone-400 aria-selected:opacity-30",
                day_disabled: "text-stone-300 opacity-50",
                day_range_middle:
                    "aria-selected:bg-stone-100 aria-selected:text-charcoal",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
            }}
            {...props}
        />
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
