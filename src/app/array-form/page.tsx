"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { text } from "stream/consumers"
import { z } from "zod"

const formSchema = z.object({
  options: z.array(
    z.object({
      label: z.string(),
      isSelected: z.boolean(),
    }),
  ).refine((options) => options.some(option => option.isSelected), {
    message: "Please select at least one option.",
  }),
  text: z.string().min(3),
})

export default function OptionsForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      options: [
        { label: "Option 1", isSelected: false },
        { label: "Option 2", isSelected: false },
        { label: "Option 3", isSelected: false }
      ],
      text: "",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-10">
        <FormField
          control={form.control}
          name="options"
          render={({ field: {onChange, value} }) => (
            <FormItem>
              <FormLabel>options</FormLabel>
              <FormControl>
                <>
                {value.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 gap-">
                    <Input
                      type="checkbox"
                      checked={option.isSelected}
                      onChange={(e) => {
                        const updatedOptions = [...value];
                        updatedOptions[index].isSelected = e.target.checked;
                        onChange(updatedOptions);
                      }}
                      className="h-10 w-10"
                    />
                    <label>{option.label}</label>
                  </div>
                ))}
                </>
              </FormControl>
              <FormDescription>
                Choose one or more options.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField control={form.control} name="text" render={({field}) => {
          return (
            <FormItem>
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Enter some text.</FormDescription>
              <FormMessage />
            </FormItem>
          )
        }} />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
