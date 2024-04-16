"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  options: z
    .array(
      z.object({
        label: z.string(),
        isSelected: z.boolean(),
      })
    )
    .refine((options) => options.some((option) => option.isSelected), {
      message: "Please select at least one option.",
    }),
  text: z.string().min(3),
});

export default function OptionsForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      options: [
        { label: "Option 1", isSelected: false },
        { label: "Option 2", isSelected: false },
        { label: "Option 3", isSelected: false },
      ],
      text: "",
    },
    mode: "onBlur",
  });
  const { fields } = useFieldArray({ control: form.control, name: "options" });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    console.log("state on submit :", form.formState.errors);
  }

  const handleBeforeSubmit = () => {
    console.log("current values :", form.getValues());
    console.log("state :", form.formState.errors);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-10">
        {fields.map((field, index) => {
          return (
            <div key={index} className="flex flex-row gap-2">
              <FormField
                control={form.control}
                name={`options.${index}.isSelected`}
                render={({ field }) => {
                  return (
                    <>
                      <FormItem>
                        <FormControl>
                          <Input
                            type="checkbox"
                            checked={field.value}
                            onChange={async (e) => {
                              field.onChange(e.target.checked);
                              await form.trigger("options");
                              console.log("state :", form.formState.errors);
                            }}
                            className="h-10 w-10"
                          />
                        </FormControl>
                      </FormItem>
                    </>
                  );
                }}
              />
              <label>{field.label}</label>
            </div>
          );
        })}
        <FormField
          control={form.control}
          name="options"
          render={() => {
            return <FormMessage />;
          }}
        />
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Text</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Enter some text.</FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button type="submit" onClick={handleBeforeSubmit}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
